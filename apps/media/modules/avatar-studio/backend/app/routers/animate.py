from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.avatar_engine.engine import get_avatar_engine
from app.avatar_engine.models import AnimateRequest, AnimateResponse, RenderJobStatus
from app.avatar_engine.provider import ProviderUnavailableError

router = APIRouter()


@router.post("", response_model=AnimateResponse)
def animate(payload: AnimateRequest) -> AnimateResponse:
    engine = get_avatar_engine()
    try:
        job = engine.submit(payload)
    except ProviderUnavailableError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    return AnimateResponse(job_id=job.job_id, status=job.status, video_url=job.video_url)


@router.get("/jobs/{job_id}")
def get_job(job_id: str) -> dict[str, object]:
    engine = get_avatar_engine()
    job = engine.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    payload = job.model_dump()
    payload["done"] = job.status in {RenderJobStatus.COMPLETED, RenderJobStatus.FAILED}
    return payload


@router.post("/train-avatar")
def train_avatar() -> dict[str, object]:
    engine = get_avatar_engine()
    return engine.provider.train_avatar()
