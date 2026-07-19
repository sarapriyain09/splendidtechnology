from app.config import settings
from app.providers.avatar_animation.factory import (
    create_avatar_animation_fallback_provider,
    create_avatar_animation_provider,
    get_avatar_animation_policy_health,
)


def test_create_avatar_animation_provider_defaults_to_overlay() -> None:
    original_provider = settings.avatar_animation_provider
    original_endpoint = settings.avatar_animation_endpoint
    try:
        settings.avatar_animation_provider = "overlay"
        settings.avatar_animation_endpoint = ""
        provider = create_avatar_animation_provider()
        assert provider.__class__.__name__ == "OverlayAvatarAnimationProvider"
    finally:
        settings.avatar_animation_provider = original_provider
        settings.avatar_animation_endpoint = original_endpoint


def test_create_avatar_animation_provider_uses_neural_http_when_configured() -> None:
    original_provider = settings.avatar_animation_provider
    original_endpoint = settings.avatar_animation_endpoint
    original_health_url = settings.avatar_animation_health_url
    try:
        settings.avatar_animation_provider = "musetalk"
        settings.avatar_animation_endpoint = "http://127.0.0.1:9090/api/animate"
        settings.avatar_animation_health_url = "http://127.0.0.1:9090/health"
        provider = create_avatar_animation_provider()
        assert provider.__class__.__name__ == "NeuralHttpAvatarAnimationProvider"
    finally:
        settings.avatar_animation_provider = original_provider
        settings.avatar_animation_endpoint = original_endpoint
        settings.avatar_animation_health_url = original_health_url


def test_create_avatar_animation_provider_overlay_auto_upgrades_to_neural_with_endpoint() -> None:
    original_provider = settings.avatar_animation_provider
    original_endpoint = settings.avatar_animation_endpoint
    original_health_url = settings.avatar_animation_health_url
    try:
        settings.avatar_animation_provider = "overlay"
        settings.avatar_animation_endpoint = "http://127.0.0.1:9090/api/animate"
        settings.avatar_animation_health_url = "http://127.0.0.1:9090/health"
        provider = create_avatar_animation_provider()
        assert provider.__class__.__name__ == "NeuralHttpAvatarAnimationProvider"
    finally:
        settings.avatar_animation_provider = original_provider
        settings.avatar_animation_endpoint = original_endpoint
        settings.avatar_animation_health_url = original_health_url


def test_create_avatar_animation_fallback_provider_can_disable() -> None:
    original = settings.avatar_animation_fallback_provider
    try:
        settings.avatar_animation_fallback_provider = "none"
        provider = create_avatar_animation_fallback_provider()
        assert provider is None
    finally:
        settings.avatar_animation_fallback_provider = original


def test_get_avatar_animation_policy_health_shape() -> None:
    payload = get_avatar_animation_policy_health()
    assert "provider" in payload
    assert "strict" in payload
    assert "ready" in payload
    assert "fallbackEnabled" in payload
