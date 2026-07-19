from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from app.config import settings
from app.providers.avatar_animation import create_avatar_animation_provider
from app.providers.avatar_animation.factory import create_avatar_animation_fallback_provider
from app.providers.base import AvatarProvider
from app.providers.local_avatar_renderer import synthesize_voice_track


class LocalLipSyncAvatarProvider(AvatarProvider):
    def __init__(self) -> None:
        self.animation_provider = create_avatar_animation_provider()
        self.fallback_animation_provider = create_avatar_animation_fallback_provider()

    @staticmethod
    def _find_latest_file(candidates: list[Path]) -> Path | None:
        existing = [path for path in candidates if path.exists() and path.is_file()]
        if not existing:
            return None
        return max(existing, key=lambda item: item.stat().st_mtime)

    def _resolve_portrait_path(self, avatar_id: str) -> Path | None:
        storage_root = Path(settings.storage_root)
        normalized_avatar_id = (avatar_id or "").strip()

        avatar_candidates: list[Path] = []
        if normalized_avatar_id and normalized_avatar_id.lower() != "default":
            avatar_candidates.extend(
                [
                    storage_root / "avatars" / f"{normalized_avatar_id}.png",
                    storage_root / "avatars" / f"{normalized_avatar_id}.jpg",
                    storage_root / "avatars" / f"{normalized_avatar_id}.jpeg",
                    storage_root / "avatars" / f"{normalized_avatar_id}.webp",
                    storage_root / "avatars" / normalized_avatar_id / "portrait.png",
                    storage_root / "avatars" / normalized_avatar_id / "portrait.jpg",
                    storage_root / "avatars" / normalized_avatar_id / "portrait.jpeg",
                    storage_root / "avatars" / normalized_avatar_id / "portrait.webp",
                ]
            )

        resolved_avatar = self._find_latest_file(avatar_candidates)
        if resolved_avatar is not None:
            return resolved_avatar

        fallback_dirs = [
            storage_root / "temp" / "openai-portraits",
            storage_root / "temp" / "gemini-portraits",
        ]

        fallback_candidates: list[Path] = []
        for directory in fallback_dirs:
            if directory.exists() and directory.is_dir():
                fallback_candidates.extend(directory.glob("portrait_*.png"))

        return self._find_latest_file(fallback_candidates)

    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        portrait_path = self._resolve_portrait_path(avatar_id)
        audio_wav_path = self._build_temp_audio_track(script)
        try:
            primary_ready, primary_reason = self.animation_provider.is_ready()
            if primary_ready:
                result = self.animation_provider.generate_video(
                    script=script,
                    avatar_id=avatar_id,
                    portrait_path=portrait_path,
                    audio_wav_path=audio_wav_path,
                    render_plan=render_plan,
                )
            else:
                result = {
                    "provider": self.animation_provider.name(),
                    "status": "failed",
                    "error": f"Animation provider is not ready ({primary_reason})",
                    "script": script,
                }

            status = str(result.get("status") or "").strip().upper()
            should_fallback = status == "FAILED" and not bool(settings.avatar_animation_strict)
            if should_fallback and self.fallback_animation_provider is not None:
                fallback_result = self.fallback_animation_provider.generate_video(
                    script=script,
                    avatar_id=avatar_id,
                    portrait_path=portrait_path,
                    audio_wav_path=audio_wav_path,
                    render_plan=render_plan,
                )
                fallback_result["fallback"] = {
                    "triggered": True,
                    "from": self.animation_provider.name(),
                    "to": self.fallback_animation_provider.name(),
                    "reason": str(result.get("error") or "primary_failed"),
                }
                result = fallback_result
            elif status == "FAILED" and bool(settings.avatar_animation_strict):
                result["strictMode"] = True
        finally:
            self._cleanup_temp_audio_track(audio_wav_path)

        if not result.get("provider"):
            result["provider"] = "local-lipsync"
        result["avatarId"] = avatar_id
        if portrait_path is not None:
            result["portraitSource"] = str(portrait_path)
        return result

    @staticmethod
    def _build_temp_audio_track(script: str) -> Path | None:
        renders_dir = Path(settings.storage_root) / "renders"
        renders_dir.mkdir(parents=True, exist_ok=True)
        wav_path = renders_dir / f"tmp_neural_audio_{uuid4().hex[:12]}.wav"

        if synthesize_voice_track(script, wav_path):
            return wav_path
        if wav_path.exists():
            try:
                wav_path.unlink()
            except OSError:
                pass
        return None

    @staticmethod
    def _cleanup_temp_audio_track(path: Path | None) -> None:
        if path is None or not path.exists():
            return
        try:
            path.unlink()
        except OSError:
            pass
