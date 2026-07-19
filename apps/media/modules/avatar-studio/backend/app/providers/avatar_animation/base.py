from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path


class AvatarAnimationProvider(ABC):
    @abstractmethod
    def name(self) -> str:
        raise NotImplementedError

    @abstractmethod
    def is_ready(self) -> tuple[bool, str]:
        raise NotImplementedError

    @abstractmethod
    def generate_video(
        self,
        *,
        script: str,
        avatar_id: str,
        portrait_path: Path | None,
        audio_wav_path: Path | None,
        render_plan: list[dict] | None,
    ) -> dict:
        raise NotImplementedError
