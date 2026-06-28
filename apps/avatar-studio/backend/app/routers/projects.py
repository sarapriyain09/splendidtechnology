from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.projects import ProjectCreate
from app.services.db.project_service import create_project, list_projects
from app.services.db.seed import DEFAULT_USER_ID, ensure_default_user

router = APIRouter()


@router.get("")
def get_projects(db: Session = Depends(get_db)) -> dict[str, list[dict[str, str]]]:
    ensure_default_user(db)
    projects = list_projects(db, DEFAULT_USER_ID)
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
def post_project(payload: ProjectCreate, db: Session = Depends(get_db)) -> dict[str, str]:
    ensure_default_user(db)
    project = create_project(db, DEFAULT_USER_ID, payload.name, payload.prompt)
    return {
        "id": project.id,
        "name": project.name,
        "status": project.status,
    }
