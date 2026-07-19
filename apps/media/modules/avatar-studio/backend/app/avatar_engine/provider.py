from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path


class ProviderUnavailableError(RuntimeError):
    pass


class AvatarAnimationProvider(ABC):
    @abstractmethod
    def health(self) -> dict[str, object]:
        raise NotImplementedError

    @abstractmethod
    def generate_video(
        self,
        portrait_path: Path | None,
        audio_path: Path | None,
        output_path: Path,
        options: dict[str, object],
    ) -> dict[str, object]:
        raise NotImplementedError

    @abstractmethod
    def train_avatar(self) -> dict[str, object]:
        raise NotImplementedError
