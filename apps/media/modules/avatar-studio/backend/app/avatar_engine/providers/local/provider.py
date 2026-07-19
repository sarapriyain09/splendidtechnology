from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

import httpx

from app.avatar_engine.provider import AvatarAnimationProvider, ProviderUnavailableError
from app.config import settings


class LocalAvatarProvider(AvatarAnimationProvider):
    version = "1.0"

    def __init__(self) -> None:
        self.provider_name = settings.avatar_animation_provider.strip().lower() or "local"
        self.endpoint = settings.avatar_animation_endpoint.strip()
        self.health_url = settings.avatar_animation_health_url.strip() or self._derive_health_url(self.endpoint)

    @staticmethod
    def _derive_health_url(endpoint: str) -> str:
        parsed = urlparse(endpoint)
        if not parsed.scheme or not parsed.netloc:
            return ""
        return f"{parsed.scheme}://{parsed.netloc}/health"

    def health(self) -> dict[str, object]:
        provider = self.provider_name
        if provider in {"overlay", "local", "local-overlay", "default"}:
            return {
                "status": "ok",
                "provider": provider,
                "version": self.version,
                "available": True,
                "reason": "overlay_provider",
            }

        if provider in {"liveportrait", "musetalk", "sadtalker", "neural", "external-neural"} and not self.endpoint:
            return {
                "status": "degraded",
                "provider": provider,
                "version": self.version,
                "available": False,
                "reason": "missing_endpoint",
            }

        if not self.health_url:
            return {
                "status": "ok",
                "provider": provider,
                "version": self.version,
                "available": True,
                "reason": "no_health_url_configured",
            }

        timeout = httpx.Timeout(3.0)
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.get(self.health_url)
                response.raise_for_status()
            return {
                "status": "ok",
                "provider": provider,
                "version": self.version,
                "available": True,
                "reason": "healthy",
            }
        except httpx.HTTPError as exc:
            return {
                "status": "degraded",
                "provider": provider,
                "version": self.version,
                "available": False,
                "reason": f"health_check_failed:{exc.__class__.__name__}",
            }

    def generate_video(
        self,
        portrait_path: Path | None,
        audio_path: Path | None,
        output_path: Path,
        options: dict[str, object],
    ) -> dict[str, object]:
        health = self.health()
        if not bool(health.get("available")):
            raise ProviderUnavailableError("Neural animation provider unavailable.")

        payload: dict[str, object] = {
            "backend": self.provider_name,
            "script": str(options.get("script") or ""),
            "avatarId": str(options.get("avatar_id") or "default"),
            "portraitSource": str(portrait_path) if portrait_path is not None else None,
            "audioSource": str(audio_path) if audio_path is not None else None,
            "renderPlan": options.get("render_plan") or [],
            "options": {
                "predictHeadPose": True,
                "predictExpressions": True,
                "enableBlink": True,
                "syncMode": "audio-driven",
                "background": options.get("background", "studio"),
                "captions": bool(options.get("captions", False)),
                "resolution": options.get("resolution", "1080p"),
                "aspectRatio": options.get("aspect_ratio", "16:9"),
                "outputPath": str(output_path),
            },
        }

        timeout = httpx.Timeout(float(settings.avatar_animation_timeout_seconds))
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.post(self.endpoint, json=payload)
                response.raise_for_status()
                body = response.json() if response.content else {}
        except httpx.HTTPError as exc:
            raise ProviderUnavailableError(f"Neural animation provider unavailable. {exc}") from exc

        if not isinstance(body, dict):
            raise ProviderUnavailableError("Neural animation provider unavailable. Invalid response payload.")

        video_url = str(body.get("videoUrl") or body.get("video_url") or "").strip()
        status = str(body.get("status") or "failed").strip().lower()
        if not video_url:
            raise ProviderUnavailableError("Neural animation provider unavailable. Missing video URL.")

        return {
            "provider": self.provider_name,
            "status": status,
            "videoUrl": video_url,
            "videoJobId": str(body.get("videoJobId") or body.get("video_job_id") or ""),
            "animationMode": "neural-http",
            "contractVersion": "v1",
            "meta": body.get("meta") if isinstance(body.get("meta"), dict) else None,
        }

    def train_avatar(self) -> dict[str, object]:
        return {
            "status": "not_implemented",
            "provider": self.provider_name,
        }
