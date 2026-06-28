from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models import Project, Scene
from app.schemas.scenes import SceneCreate, SceneUpdate
from app.services.db.project_service import add_scene

router = APIRouter()


@router.get("/{project_id}/scenes")
def get_project_scenes(project_id: str, db: Session = Depends(get_db)) -> dict[str, list[dict[str, str | int]]]:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    stmt = select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.asc())
    scenes = list(db.scalars(stmt).all())
    return {
        "scenes": [
            {
                "id": s.id,
                "orderIndex": s.order_index,
                "title": s.title,
                "narration": s.narration,
                "durationSeconds": s.duration_seconds,
                "background": s.background,
            }
            for s in scenes
        ]
    }


@router.post("/{project_id}/scenes")
def post_project_scene(project_id: str, payload: SceneCreate, db: Session = Depends(get_db)) -> dict[str, str | int]:
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    scene = add_scene(db, project_id, payload.title, payload.narration, payload.duration_seconds, payload.background)
    return {
        "id": scene.id,
        "orderIndex": scene.order_index,
        "title": scene.title,
    }


@router.patch("/{project_id}/scenes/{scene_id}")
def patch_project_scene(project_id: str, scene_id: str, payload: SceneUpdate, db: Session = Depends(get_db)) -> dict[str, str | int]:
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
    if payload.order_index is not None:
        scene.order_index = payload.order_index

    db.add(scene)
    db.commit()
    db.refresh(scene)

    return {
        "id": scene.id,
        "orderIndex": scene.order_index,
        "title": scene.title,
        "narration": scene.narration,
        "durationSeconds": scene.duration_seconds,
        "background": scene.background,
    }
