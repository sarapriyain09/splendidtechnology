from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.chat import PromptRequest
from app.services.orchestrator import AIOrchestrator
from app.services.db.seed import DEFAULT_USER_ID, ensure_default_user

router = APIRouter()


@router.post("/prompt")
async def handle_prompt(payload: PromptRequest, db: Session = Depends(get_db)) -> dict:
    ensure_default_user(db)
    orchestrator = AIOrchestrator()
    return await orchestrator.run_prompt(db, DEFAULT_USER_ID, payload.prompt, payload.avatar_id)
