from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum

from pydantic import BaseModel, Field


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class RenderJobStatus(str, Enum):
    PENDING = "Pending"
    LOADING_MODELS = "Loading Models"
    ANIMATING_FACE = "Animating Face"
    LIP_SYNC = "Lip Sync"
    RENDERING = "Rendering"
    COMPLETED = "Completed"
    FAILED = "Failed"


class AnimateOptions(BaseModel):
    background: str = "studio"
    captions: bool = False
    resolution: str = "1080p"
    aspect_ratio: str = "16:9"
    provider: str | None = None


class AnimateRequest(BaseModel):
    portrait_path: str | None = Field(default=None)
    audio_path: str | None = Field(default=None)
    options: AnimateOptions = Field(default_factory=AnimateOptions)


class RenderJobRecord(BaseModel):
    job_id: str
    status: RenderJobStatus
    provider: str
    created_at: str = Field(default_factory=utc_now_iso)
    updated_at: str = Field(default_factory=utc_now_iso)
    video_url: str | None = None
    output_path: str | None = None
    error: str | None = None


class AnimateResponse(BaseModel):
    job_id: str
    status: RenderJobStatus
    video_url: str | None = None
