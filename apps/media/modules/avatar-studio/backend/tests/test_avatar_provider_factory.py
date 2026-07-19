from app.config import settings
from app.providers.factory import create_avatar_provider


def test_create_avatar_provider_uses_local_lipsync_by_default() -> None:
    original = settings.avatar_provider
    try:
        settings.avatar_provider = "local-lipsync"
        provider = create_avatar_provider()
        assert provider.__class__.__name__ == "LocalLipSyncAvatarProvider"
    finally:
        settings.avatar_provider = original


def test_create_avatar_provider_can_select_heygen() -> None:
    original = settings.avatar_provider
    try:
        settings.avatar_provider = "heygen"
        provider = create_avatar_provider()
        assert provider.__class__.__name__ == "HeyGenProvider"
    finally:
        settings.avatar_provider = original
