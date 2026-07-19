from __future__ import annotations

from app.config import settings
from app.providers.avatar_animation.base import AvatarAnimationProvider
from app.providers.avatar_animation.neural_http_provider import NeuralHttpAvatarAnimationProvider
from app.providers.avatar_animation.overlay_provider import OverlayAvatarAnimationProvider


def _resolve_primary_provider_name() -> str:
    return settings.avatar_animation_provider.strip().lower()


def _resolve_fallback_provider_name() -> str:
    return settings.avatar_animation_fallback_provider.strip().lower()


def create_avatar_animation_provider(provider_name: str | None = None) -> AvatarAnimationProvider:
    provider = (provider_name or _resolve_primary_provider_name()).strip().lower()
    endpoint = settings.avatar_animation_endpoint.strip()

    if provider in {"overlay", "local-overlay", "local", "default"}:
        if endpoint:
            return NeuralHttpAvatarAnimationProvider(
                endpoint=endpoint,
                backend="neural-auto",
                health_url=settings.avatar_animation_health_url,
            )
        return OverlayAvatarAnimationProvider(provider_name="local-lipsync")

    if provider in {"liveportrait", "musetalk", "sadtalker", "neural", "external-neural"}:
        if endpoint:
            return NeuralHttpAvatarAnimationProvider(
                endpoint=endpoint,
                backend=provider,
                health_url=settings.avatar_animation_health_url,
            )
        return OverlayAvatarAnimationProvider(provider_name=f"{provider}-overlay-fallback")

    return OverlayAvatarAnimationProvider(provider_name="local-lipsync")


def create_avatar_animation_fallback_provider() -> AvatarAnimationProvider | None:
    fallback = _resolve_fallback_provider_name()
    if fallback in {"none", "disabled"}:
        return None
    if fallback in {"overlay", "local-overlay", "local", "default"}:
        return OverlayAvatarAnimationProvider(provider_name="local-lipsync-fallback")
    return OverlayAvatarAnimationProvider(provider_name="local-lipsync-fallback")


def get_avatar_animation_policy_health() -> dict[str, object]:
    primary_name = _resolve_primary_provider_name()
    primary = create_avatar_animation_provider(primary_name)
    fallback = create_avatar_animation_fallback_provider()
    ready, reason = primary.is_ready()

    return {
        "provider": primary_name,
        "providerImpl": primary.__class__.__name__,
        "strict": bool(settings.avatar_animation_strict),
        "ready": bool(ready),
        "reason": reason,
        "fallbackProvider": fallback.name() if fallback is not None else "none",
        "fallbackEnabled": fallback is not None and not bool(settings.avatar_animation_strict),
        "endpoint": settings.avatar_animation_endpoint.strip() or None,
    }
