import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Project, Scene, SceneSettings


def create_project(db: Session, user_id: str, name: str, prompt: str) -> Project:
    project = Project(user_id=user_id, name=name, prompt=prompt, status="DRAFT")
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session, user_id: str) -> list[Project]:
    stmt = select(Project).where(Project.user_id == user_id).order_by(Project.created_at.desc())
    return list(db.scalars(stmt).all())


def add_scene(
    db: Session,
    project_id: str,
    title: str,
    narration: str,
    duration_seconds: int,
    background: str,
    image_url: str = "",
    voice_audio_url: str = "",
    music: str = "none",
) -> Scene:
    latest = db.scalar(select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.desc()).limit(1))
    next_order = (latest.order_index + 1) if latest else 1
    scene = Scene(
        project_id=project_id,
        title=title,
        narration=narration,
        duration_seconds=duration_seconds,
        background=background,
        image_url=image_url,
        voice_audio_url=voice_audio_url,
        music=music,
        order_index=next_order,
    )
    db.add(scene)
    db.commit()
    db.refresh(scene)
    return scene


def upsert_scene_settings(
    db: Session,
    scene_id: str,
    camera: str = "static",
    transition: str = "cut",
    caption_style: str = "default",
    voice: str = "default",
    assets: list[str] | None = None,
) -> SceneSettings:
    existing = db.scalar(select(SceneSettings).where(SceneSettings.scene_id == scene_id).limit(1))
    if existing is None:
        existing = SceneSettings(scene_id=scene_id)

    existing.camera = camera or "static"
    existing.transition = transition or "cut"
    existing.caption_style = caption_style or "default"
    existing.voice = voice or "default"
    existing.assets_json = json.dumps(assets or [])

    db.add(existing)
    db.commit()
    db.refresh(existing)
    return existing
