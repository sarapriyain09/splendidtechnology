from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import AvatarTraining, TrainingLog, Upload


TRAINING_STAGES = [
    "UPLOADING",
    "EXTRACTING_FRAMES",
    "EXTRACTING_VOICE",
    "FACE_ALIGNMENT",
    "LIP_SYNC",
    "BODY_TRACKING",
    "TRAINING",
    "GENERATING_AVATAR",
    "VALIDATION",
    "COMPLETED",
]


def start_training(db: Session, user_id: str, avatar_name: str, mode: str) -> AvatarTraining:
    training = AvatarTraining(
        user_id=user_id,
        avatar_name=avatar_name,
        mode=mode,
        current_stage="UPLOADING",
        progress_percent=0,
        status="QUEUED",
    )
    db.add(training)
    db.commit()
    db.refresh(training)

    db.add(TrainingLog(training_id=training.id, stage="UPLOADING", message="Training job created"))
    db.commit()
    return training


def list_trainings(db: Session, user_id: str) -> list[AvatarTraining]:
    stmt = select(AvatarTraining).where(AvatarTraining.user_id == user_id).order_by(AvatarTraining.created_at.desc())
    return list(db.scalars(stmt).all())


def add_training_log(db: Session, training_id: str, stage: str, message: str) -> TrainingLog:
    log = TrainingLog(training_id=training_id, stage=stage, message=message)
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def add_upload(db: Session, training_id: str, upload_type: str, filename: str, storage_url: str) -> Upload:
    upload = Upload(training_id=training_id, upload_type=upload_type, filename=filename, storage_url=storage_url, completed=True)
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload


def list_logs(db: Session, training_id: str) -> list[TrainingLog]:
    stmt = select(TrainingLog).where(TrainingLog.training_id == training_id).order_by(TrainingLog.created_at.asc())
    return list(db.scalars(stmt).all())


def update_progress(db: Session, training_id: str, stage: str, progress_percent: int, status: str) -> AvatarTraining | None:
    training = db.get(AvatarTraining, training_id)
    if not training:
        return None
    training.current_stage = stage
    training.progress_percent = progress_percent
    training.status = status
    db.add(training)
    db.commit()
    db.refresh(training)
    return training
