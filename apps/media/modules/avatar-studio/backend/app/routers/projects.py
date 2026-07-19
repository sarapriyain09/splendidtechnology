from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.security import RequestActor, get_request_actor
from app.schemas.projects import ProjectCreate
from app.services.db.project_service import create_project, list_projects
from app.services.db.seed import ensure_user

router = APIRouter()


@router.get("")
def get_projects(
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, list[dict[str, str]]]:
    ensure_user(db, actor.user_id)
    projects = list_projects(db, actor.user_id)
    return {
        "projects": [
            {
                "id": project.id,
                "name": project.name,
                "prompt": project.prompt,
                "status": project.status,
            }
            for project in projects
        ]
    }


@router.post("")
def post_project(
    payload: ProjectCreate,
    actor: RequestActor = Depends(get_request_actor),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    ensure_user(db, actor.user_id)
    project = create_project(db, actor.user_id, payload.name, payload.prompt)
    return {
        "id": project.id,
        "name": project.name,
        "status": project.status,
    }
