from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Mock Neural Animation Service", version="0.1.0")


class AnimateOptions(BaseModel):
    predictHeadPose: bool | None = True
    predictExpressions: bool | None = True
    enableBlink: bool | None = True
    syncMode: str | None = "audio-driven"


class AnimateRequest(BaseModel):
    backend: str = "musetalk"
    script: str
    avatarId: str | None = None
    portraitSource: str | None = None
    audioSource: str | None = None
    renderPlan: list[dict] = []
    options: AnimateOptions | None = None


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "mock-neural-animation"}


@app.post("/api/animate")
def animate(payload: AnimateRequest) -> dict[str, object]:
    # Contract-compatible stub for strict neural-path validation.
    renders_root = Path("D:/srv/velynxia/avatarstudio/storage/renders")
    candidates = sorted(
        [p for p in renders_root.glob("render_*.mp4") if p.is_file()],
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )

    if not candidates:
        return {
            "status": "failed",
            "error": "no_render_artifacts",
            "videoUrl": None,
            "videoJobId": None,
        }

    selected = candidates[0]
    return {
        "status": "completed",
        "videoUrl": f"http://127.0.0.1:8000/media/renders/{selected.name}",
        "videoJobId": f"musetalk_{uuid4().hex[:12]}",
        "meta": {
            "engine": payload.backend,
            "mode": "mock-neural-gateway",
            "portraitSource": payload.portraitSource,
            "audioSource": payload.audioSource,
            "scriptChars": len(payload.script),
        },
    }
