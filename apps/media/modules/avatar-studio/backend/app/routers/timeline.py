import json

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Project, Scene, SceneSettings
from app.security import RequestActor, get_request_actor
from app.schemas.scenes import SceneCreate, SceneRenderRequest, SceneUpdate
from app.services.db.project_service import add_scene, upsert_scene_settings
from app.services.orchestrator import AIOrchestrator

router = APIRouter()


def _get_project_for_actor(db: Session, project_id: str, actor_user_id: str) -> Project:
    project = db.get(Project, project_id)
    if not project or project.user_id != actor_user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def _serialize_scene(scene: Scene) -> dict[str, object]:
    settings = scene.settings
    assets: list[str] = []
    if settings and settings.assets_json:
        try:
            parsed = json.loads(settings.assets_json)
            if isinstance(parsed, list):
                assets = [str(item) for item in parsed]
        except json.JSONDecodeError:
            assets = []

    return {
        "id": scene.id,
        "orderIndex": scene.order_index,
        "title": scene.title,
        "narration": scene.narration,
        "durationSeconds": scene.duration_seconds,
        "background": scene.background,
        "imageUrl": scene.image_url,
        "voiceAudioUrl": scene.voice_audio_url,
        "music": scene.music,
        "camera": settings.camera if settings else "static",
        "transition": settings.transition if settings else "cut",
        "captionStyle": settings.caption_style if settings else "default",
        "voice": settings.voice if settings else "default",
        "assets": assets,
    }


@router.get("/{project_id}/scenes")
def get_project_scenes(
    project_id: str,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, list[dict[str, object]]]:
    _get_project_for_actor(db, project_id, actor.user_id)

    stmt = select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.asc())
    scenes = list(db.scalars(stmt).all())
    return {"scenes": [_serialize_scene(s) for s in scenes]}


@router.post("/{project_id}/scenes")
def post_project_scene(
    project_id: str,
    payload: SceneCreate,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    _get_project_for_actor(db, project_id, actor.user_id)

    scene = add_scene(
        db,
        project_id,
        payload.title,
        payload.narration,
        payload.duration_seconds,
        payload.background,
        payload.image_url,
        payload.voice_audio_url,
        payload.music,
    )
    upsert_scene_settings(
        db,
        scene_id=scene.id,
        camera=payload.camera,
        transition=payload.transition,
        caption_style=payload.caption_style,
        voice=payload.voice,
        assets=payload.assets,
    )
    db.refresh(scene)
    return _serialize_scene(scene)


@router.patch("/{project_id}/scenes/{scene_id}")
def patch_project_scene(
    project_id: str,
    scene_id: str,
    payload: SceneUpdate,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    _get_project_for_actor(db, project_id, actor.user_id)
    scene = db.get(Scene, scene_id)
    if not scene or scene.project_id != project_id:
        raise HTTPException(status_code=404, detail="Scene not found")

    if payload.title is not None:
        scene.title = payload.title
    if payload.narration is not None:
        scene.narration = payload.narration
    if payload.duration_seconds is not None:
        scene.duration_seconds = payload.duration_seconds
    if payload.background is not None:
        scene.background = payload.background
    if payload.image_url is not None:
        scene.image_url = payload.image_url
    if payload.voice_audio_url is not None:
        scene.voice_audio_url = payload.voice_audio_url
    if payload.music is not None:
        scene.music = payload.music
    if payload.order_index is not None:
        scene.order_index = payload.order_index

    db.add(scene)
    db.commit()

    if any(
        value is not None
        for value in [
            payload.camera,
            payload.transition,
            payload.caption_style,
            payload.voice,
            payload.assets,
        ]
    ):
        existing_settings = db.scalar(select(SceneSettings).where(SceneSettings.scene_id == scene.id).limit(1))
        upsert_scene_settings(
            db,
            scene_id=scene.id,
            camera=payload.camera if payload.camera is not None else (existing_settings.camera if existing_settings else "static"),
            transition=(
                payload.transition if payload.transition is not None else (existing_settings.transition if existing_settings else "cut")
            ),
            caption_style=(
                payload.caption_style
                if payload.caption_style is not None
                else (existing_settings.caption_style if existing_settings else "default")
            ),
            voice=payload.voice if payload.voice is not None else (existing_settings.voice if existing_settings else "default"),
            assets=payload.assets if payload.assets is not None else json.loads(existing_settings.assets_json) if existing_settings else [],
        )

    db.refresh(scene)

    return _serialize_scene(scene)


@router.post("/{project_id}/render")
async def render_project_from_scenes(
    project_id: str,
    payload: SceneRenderRequest,
    background_tasks: BackgroundTasks,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    orchestrator = AIOrchestrator()
    result = await orchestrator.enqueue_render_project_from_scenes(
        db=db,
        actor_user_id=actor.user_id,
        project_id=project_id,
        avatar_id=payload.avatar_id,
        idempotency_key=payload.idempotency_key,
    )

    background_context = result.pop("backgroundContext", None)
    run_in_background = bool(result.get("runInBackground"))
    if run_in_background and isinstance(background_context, dict):
        background_tasks.add_task(
            orchestrator.process_queued_render_job,
            str(background_context.get("jobId", "")),
            str(background_context.get("actorUserId", actor.user_id)),
            str(background_context.get("projectId", project_id)),
            background_context.get("avatarId"),
            background_context.get("idempotencyKey"),
        )

    return result


@router.get("/{project_id}/render/{job_id}")
def get_render_job_status(
    project_id: str,
    job_id: str,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    orchestrator = AIOrchestrator()
    return orchestrator.get_render_job_status(
        db=db,
        actor_user_id=actor.user_id,
        project_id=project_id,
        job_id=job_id,
    )
