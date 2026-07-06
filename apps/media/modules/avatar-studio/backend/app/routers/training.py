from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import AvatarTraining
from app.schemas.training import (
    ResumableUploadCompleteRequest,
    ResumableUploadInitRequest,
    TrainingLogCreate,
    TrainingStartRequest,
    TrainingUploadMeta,
)
from app.jobs.training_runner import enqueue_training_job
from app.services.db.seed import DEFAULT_USER_ID, ensure_default_user
from app.services.db.training_service import add_training_log, add_upload, list_logs, list_trainings, start_training, update_progress
from app.services.storage.minio_storage import MinioStorage
from app.services.upload_sessions import UploadSessionStore


router = APIRouter()

upload_store = UploadSessionStore()
minio_storage = MinioStorage()


@router.post("/start")
def post_training_start(payload: TrainingStartRequest, db: Session = Depends(get_db)) -> dict[str, str]:
    ensure_default_user(db)
    training = start_training(db, DEFAULT_USER_ID, payload.avatar_name, payload.mode)
    return {"jobId": training.id, "status": training.status, "avatarName": training.avatar_name}


@router.get("/")
def get_trainings(db: Session = Depends(get_db)) -> dict[str, list[dict[str, str | int]]]:
    ensure_default_user(db)
    trainings = list_trainings(db, DEFAULT_USER_ID)
    return {
        "trainings": [
            {
                "id": item.id,
                "avatarName": item.avatar_name,
                "mode": item.mode,
                "stage": item.current_stage,
                "progress": item.progress_percent,
                "status": item.status,
            }
            for item in trainings
        ]
    }


@router.get("/{training_id}")
def get_training(training_id: str, db: Session = Depends(get_db)) -> dict[str, str | int]:
    training = db.get(AvatarTraining, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")
    return {
        "id": training.id,
        "avatarName": training.avatar_name,
        "stage": training.current_stage,
        "progress": training.progress_percent,
        "status": training.status,
    }


@router.get("/{training_id}/status")
def get_training_status(training_id: str, db: Session = Depends(get_db)) -> dict[str, str | int]:
    return get_training(training_id, db)


@router.post("/{training_id}/enqueue")
def enqueue_training(training_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    training = db.get(AvatarTraining, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    enqueue_training_job(training_id)
    return {"trainingId": training_id, "status": "ENQUEUED"}


@router.post("/{training_id}/logs")
def post_training_log(training_id: str, payload: TrainingLogCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    log = add_training_log(db, training_id, payload.stage, payload.message)
    return {"id": log.id, "stage": log.stage, "message": log.message}


@router.get("/{training_id}/logs")
def get_training_logs(training_id: str, db: Session = Depends(get_db)) -> dict[str, list[dict[str, str]]]:
    logs = list_logs(db, training_id)
    return {
        "logs": [
            {"id": log.id, "stage": log.stage, "message": log.message, "createdAt": log.created_at.isoformat()}
            for log in logs
        ]
    }


@router.post("/{training_id}/uploads")
def post_training_upload(training_id: str, payload: TrainingUploadMeta, db: Session = Depends(get_db)) -> dict[str, str]:
    upload = add_upload(db, training_id, payload.upload_type, payload.filename, payload.storage_url)
    return {
        "id": upload.id,
        "trainingId": upload.training_id,
        "type": upload.upload_type,
        "filename": upload.filename,
    }


@router.post("/{training_id}/uploads/init")
def init_resumable_upload(
    training_id: str,
    payload: ResumableUploadInitRequest,
    db: Session = Depends(get_db),
) -> dict[str, str | int]:
    training = db.get(AvatarTraining, training_id)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")

    if payload.total_chunks < 1:
        raise HTTPException(status_code=400, detail="total_chunks must be >= 1")

    session = upload_store.create_session(
        training_id=training_id,
        upload_type=payload.upload_type,
        filename=payload.filename,
        total_chunks=payload.total_chunks,
        content_type=payload.content_type,
        user_id=DEFAULT_USER_ID,
    )

    add_training_log(db, training_id, "UPLOADING", f"Initialized resumable upload for {payload.filename}")

    return {
        "uploadId": str(session["upload_id"]),
        "trainingId": training_id,
        "filename": str(session["filename"]),
        "totalChunks": int(session["total_chunks"]),
    }


@router.post("/{training_id}/uploads/chunk")
async def upload_chunk(
    training_id: str,
    upload_id: str = Form(...),
    chunk_index: int = Form(...),
    file: UploadFile = File(...),
) -> dict[str, str | int]:
    session = upload_store.get_session(upload_id)
    if not session:
        raise HTTPException(status_code=404, detail="Upload session not found")

    if str(session["training_id"]) != training_id:
        raise HTTPException(status_code=400, detail="Upload session does not match training")

    total_chunks = int(session["total_chunks"])
    if chunk_index < 0 or chunk_index >= total_chunks:
        raise HTTPException(status_code=400, detail="Invalid chunk index")

    content = await file.read()
    object_name = f"{session['prefix']}/chunk-{chunk_index:06d}"
    minio_storage.put_bytes(object_name, content, file.content_type or "application/octet-stream")
    upload_store.mark_chunk(upload_id, chunk_index)

    return {
        "uploadId": upload_id,
        "chunkIndex": chunk_index,
        "receivedChunks": upload_store.count_chunks(upload_id),
        "totalChunks": total_chunks,
    }


@router.post("/{training_id}/uploads/complete")
def complete_resumable_upload(
    training_id: str,
    payload: ResumableUploadCompleteRequest,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    session = upload_store.get_session(payload.upload_id)
    if not session:
        raise HTTPException(status_code=404, detail="Upload session not found")

    if str(session["training_id"]) != training_id:
        raise HTTPException(status_code=400, detail="Upload session does not match training")

    total_chunks = int(session["total_chunks"])
    received = upload_store.count_chunks(payload.upload_id)
    if received != total_chunks:
        raise HTTPException(status_code=400, detail=f"Upload incomplete: received {received}/{total_chunks} chunks")

    merged = bytearray()
    for index in range(total_chunks):
        chunk_name = f"{session['prefix']}/chunk-{index:06d}"
        merged.extend(minio_storage.get_bytes(chunk_name))

    final_object_name = f"training/{session['user_id']}/{training_id}/{payload.upload_id}/{session['filename']}"
    final_url = minio_storage.put_bytes(final_object_name, bytes(merged), str(session["content_type"]))

    upload = add_upload(
        db,
        training_id,
        str(session["upload_type"]),
        str(session["filename"]),
        final_url,
    )

    for index in range(total_chunks):
        minio_storage.remove_object(f"{session['prefix']}/chunk-{index:06d}")
    upload_store.clear(payload.upload_id)

    add_training_log(db, training_id, "UPLOADING", f"Completed upload {session['filename']}")

    return {
        "uploadId": upload.id,
        "trainingId": upload.training_id,
        "filename": upload.filename,
        "storageUrl": upload.storage_url,
    }


@router.post("/{training_id}/progress")
def post_training_progress(training_id: str, payload: dict[str, str | int], db: Session = Depends(get_db)) -> dict[str, str | int]:
    stage = str(payload.get("stage", "TRAINING"))
    progress = int(payload.get("progress", 0))
    status = str(payload.get("status", "RUNNING"))
    training = update_progress(db, training_id, stage, progress, status)
    if not training:
        raise HTTPException(status_code=404, detail="Training not found")
    return {
        "id": training.id,
        "stage": training.current_stage,
        "progress": training.progress_percent,
        "status": training.status,
    }
