from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

import httpx

from app.config import settings
from app.providers.avatar_animation.base import AvatarAnimationProvider


class NeuralHttpAvatarAnimationProvider(AvatarAnimationProvider):
    def __init__(self, endpoint: str, backend: str, health_url: str | None = None) -> None:
        self.endpoint = endpoint.strip()
        self.backend = backend.strip() or "neural"
        self.health_url = (health_url or "").strip() or self._derive_health_url(self.endpoint)

    @staticmethod
    def _derive_health_url(endpoint: str) -> str:
        parsed = urlparse(endpoint)
        if not parsed.scheme or not parsed.netloc:
            return ""
        return f"{parsed.scheme}://{parsed.netloc}/health"

    @staticmethod
    def _derive_motion_options(render_plan: list[dict] | None) -> dict[str, object]:
        camera_tokens: list[str] = []
        transition_tokens: list[str] = []
        if isinstance(render_plan, list):
            for scene in render_plan:
                if not isinstance(scene, dict):
                    continue
                camera_tokens.append(str(scene.get("camera") or "").strip().lower())
                transition_tokens.append(str(scene.get("transition") or "").strip().lower())

        has_close_up = "close-up" in camera_tokens
        has_static = "static" in camera_tokens
        has_soft_transition = "fade" in transition_tokens

        head_motion_scale = 0.25 if has_static else (0.48 if has_close_up else 0.40)
        expression_intensity = 0.66 if has_close_up else 0.58

        return {
            "predictHeadPose": True,
            "predictExpressions": True,
            "enableBlink": True,
            "syncMode": "audio-driven",
            "qualityProfile": "natural-face-v1",
            "lipSyncStrength": 0.88,
            "expressionIntensity": expression_intensity,
            "headMotionScale": head_motion_scale,
            "blinkIntervalMs": 3400,
            "stabilizeNeck": True,
            "transitionAwareness": "soft" if has_soft_transition else "standard",
        }

    def name(self) -> str:
        return self.backend

    def is_ready(self) -> tuple[bool, str]:
        if not self.endpoint:
            return False, "endpoint_missing"
        if not self.health_url:
            return True, "health_url_not_configured"

        timeout = httpx.Timeout(2.0)
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.get(self.health_url)
                if response.status_code >= 400:
                    return False, f"health_http_{response.status_code}"
            return True, "healthy"
        except httpx.HTTPError as exc:
            return False, f"health_request_failed:{exc.__class__.__name__}"

    def generate_video(
        self,
        *,
        script: str,
        avatar_id: str,
        portrait_path: Path | None,
        audio_wav_path: Path | None,
        render_plan: list[dict] | None,
    ) -> dict:
        if not self.endpoint:
            return {
                "provider": self.backend,
                "status": "failed",
                "error": "Missing AVATAR_ANIMATION_ENDPOINT for neural animation provider",
                "script": script,
            }

        payload: dict[str, object] = {
            "backend": self.backend,
            "script": script,
            "avatarId": avatar_id,
            "portraitSource": str(portrait_path) if portrait_path is not None else None,
            "audioSource": str(audio_wav_path) if audio_wav_path is not None else None,
            "renderPlan": render_plan or [],
            "options": self._derive_motion_options(render_plan),
        }

        timeout = httpx.Timeout(float(settings.avatar_animation_timeout_seconds))
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.post(self.endpoint, json=payload)
                response.raise_for_status()
                body = response.json() if response.content else {}
        except httpx.HTTPError as exc:
            return {
                "provider": self.backend,
                "status": "failed",
                "error": f"Neural animation request failed: {exc}",
                "script": script,
            }

        if not isinstance(body, dict):
            return {
                "provider": self.backend,
                "status": "failed",
                "error": "Neural animation response payload is invalid",
                "script": script,
            }

        video_url = str(body.get("videoUrl") or body.get("video_url") or "").strip()
        status = str(body.get("status") or "completed").strip().lower()

        if not video_url:
            return {
                "provider": self.backend,
                "status": "failed",
                "error": "Neural animation response missing videoUrl",
                "script": script,
            }

        result: dict[str, object] = {
            "provider": self.backend,
            "status": status,
            "videoUrl": video_url,
            "videoJobId": str(body.get("videoJobId") or body.get("video_job_id") or ""),
            "script": script,
            "animationMode": "neural-http",
            "contractVersion": "v1",
        }

        if "meta" in body:
            result["animationMeta"] = body.get("meta")

        return result
