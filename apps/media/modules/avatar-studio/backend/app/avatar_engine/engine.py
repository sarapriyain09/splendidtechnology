from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from threading import Lock
from uuid import uuid4

from app.avatar_engine.models import AnimateOptions, AnimateRequest, RenderJobRecord, RenderJobStatus, utc_now_iso
from app.avatar_engine.pipeline import PipelineTracker
from app.avatar_engine.provider import ProviderUnavailableError
from app.avatar_engine.providers.local.provider import LocalAvatarProvider
from app.config import settings


class AvatarEngine:
    def __init__(self) -> None:
        self.provider = LocalAvatarProvider()
        self._jobs: dict[str, RenderJobRecord] = {}
        self._lock = Lock()
        self._executor = ThreadPoolExecutor(max_workers=2, thread_name_prefix="avatar-engine")

    def health(self) -> dict[str, object]:
        return self.provider.health()

    def submit(self, request: AnimateRequest) -> RenderJobRecord:
        health = self.health()
        if settings.avatar_animation_strict and not bool(health.get("available")):
            raise ProviderUnavailableError("Neural animation provider unavailable.")

        job_id = f"job_{uuid4().hex[:12]}"
        output_path = Path(settings.storage_root) / "renders" / f"{job_id}.mp4"
        output_path.parent.mkdir(parents=True, exist_ok=True)

        job = RenderJobRecord(
            job_id=job_id,
            status=RenderJobStatus.PENDING,
            provider=str(health.get("provider") or settings.avatar_animation_provider),
            output_path=str(output_path),
        )
        with self._lock:
            self._jobs[job_id] = job

        self._executor.submit(self._run_job, job_id, request, output_path)
        return job

    def get_job(self, job_id: str) -> RenderJobRecord | None:
        with self._lock:
            return self._jobs.get(job_id)

    def generate_sync(
        self,
        *,
        script: str,
        avatar_id: str,
        portrait_path: Path | None,
        audio_path: Path | None,
        render_plan: list[dict] | None,
        options: AnimateOptions | None = None,
    ) -> dict[str, object]:
        opts = options or AnimateOptions()
        output_path = Path(settings.storage_root) / "renders" / f"render_{uuid4().hex[:12]}.mp4"
        output_path.parent.mkdir(parents=True, exist_ok=True)

        result = self.provider.generate_video(
            portrait_path=portrait_path,
            audio_path=audio_path,
            output_path=output_path,
            options={
                "script": script,
                "avatar_id": avatar_id,
                "render_plan": render_plan or [],
                "background": opts.background,
                "captions": opts.captions,
                "resolution": opts.resolution,
                "aspect_ratio": opts.aspect_ratio,
            },
        )
        result["script"] = script
        return result

    def _run_job(self, job_id: str, request: AnimateRequest, output_path: Path) -> None:
        tracker = PipelineTracker(lambda stage: self._update_status(job_id, stage))
        try:
            tracker.mark(RenderJobStatus.LOADING_MODELS)
            tracker.mark(RenderJobStatus.ANIMATING_FACE)
            tracker.mark(RenderJobStatus.LIP_SYNC)
            tracker.mark(RenderJobStatus.RENDERING)

            portrait = Path(request.portrait_path) if request.portrait_path else None
            audio = Path(request.audio_path) if request.audio_path else None
            result = self.provider.generate_video(
                portrait_path=portrait,
                audio_path=audio,
                output_path=output_path,
                options={
                    "script": "",
                    "avatar_id": "default",
                    "render_plan": [],
                    "background": request.options.background,
                    "captions": request.options.captions,
                    "resolution": request.options.resolution,
                    "aspect_ratio": request.options.aspect_ratio,
                },
            )

            self._finish_job(
                job_id=job_id,
                status=RenderJobStatus.COMPLETED,
                video_url=str(result.get("videoUrl") or ""),
                error=None,
            )
        except Exception as exc:  # noqa: BLE001
            self._finish_job(
                job_id=job_id,
                status=RenderJobStatus.FAILED,
                video_url=None,
                error=str(exc),
            )

    def _update_status(self, job_id: str, status: RenderJobStatus) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return
            job.status = status
            job.updated_at = utc_now_iso()

    def _finish_job(self, job_id: str, status: RenderJobStatus, video_url: str | None, error: str | None) -> None:
        with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return
            job.status = status
            job.video_url = video_url
            job.error = error
            job.updated_at = utc_now_iso()


_ENGINE: AvatarEngine | None = None


def get_avatar_engine() -> AvatarEngine:
    global _ENGINE
    if _ENGINE is None:
        _ENGINE = AvatarEngine()
    return _ENGINE
