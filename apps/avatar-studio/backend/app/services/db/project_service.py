from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Project, Scene


def create_project(db: Session, user_id: str, name: str, prompt: str) -> Project:
    project = Project(user_id=user_id, name=name, prompt=prompt, status="DRAFT")
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session, user_id: str) -> list[Project]:
    stmt = select(Project).where(Project.user_id == user_id).order_by(Project.created_at.desc())
    return list(db.scalars(stmt).all())


def add_scene(db: Session, project_id: str, title: str, narration: str, duration_seconds: int, background: str) -> Scene:
    latest = db.scalar(select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.desc()).limit(1))
    next_order = (latest.order_index + 1) if latest else 1
    scene = Scene(
        project_id=project_id,
        title=title,
        narration=narration,
        duration_seconds=duration_seconds,
        background=background,
        order_index=next_order,
    )
    db.add(scene)
    db.commit()
    db.refresh(scene)
    return scene
