from __future__ import annotations

from pathlib import Path

from app.providers.avatar_animation.base import AvatarAnimationProvider
from app.providers.local_avatar_renderer import render_lipsync_avatar_video


class OverlayAvatarAnimationProvider(AvatarAnimationProvider):
    def __init__(self, provider_name: str = "local-lipsync") -> None:
        self.provider_name = provider_name

    def name(self) -> str:
        return self.provider_name

    def is_ready(self) -> tuple[bool, str]:
        return True, "overlay renderer available"

    def generate_video(
        self,
        *,
        script: str,
        avatar_id: str,
        portrait_path: Path | None,
        audio_wav_path: Path | None,
        render_plan: list[dict] | None,
    ) -> dict:
        return render_lipsync_avatar_video(
            script=script,
            provider_name=self.provider_name,
            portrait_path=portrait_path,
            render_plan=render_plan,
        )
