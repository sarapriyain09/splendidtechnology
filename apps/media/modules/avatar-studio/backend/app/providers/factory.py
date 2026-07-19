from app.config import settings
from app.providers.base import AIProvider, AvatarProvider, VoiceProvider
from app.providers.gemini_avatar_provider import GeminiAvatarProvider
from app.providers.gemini_script_provider import GeminiScriptProvider
from app.providers.heygen_provider import HeyGenProvider
from app.providers.local_lipsync_avatar_provider import LocalLipSyncAvatarProvider
from app.providers.local_llm_script_provider import LocalLLMScriptProvider
from app.providers.local_voice_provider import LocalVoiceProvider
from app.providers.openai_avatar_provider import OpenAIAvatarProvider
from app.providers.openai_script_provider import OpenAIScriptProvider
from app.providers.openai_voice_provider import OpenAIVoiceProvider


def create_avatar_provider() -> AvatarProvider:
    provider = settings.avatar_provider.strip().lower()

    if provider in {"local-lipsync", "lipsync", "lip-sync", "local"}:
        return LocalLipSyncAvatarProvider()
    if provider in {"openai", "chatgpt"}:
        return OpenAIAvatarProvider()
    if provider == "gemini":
        return GeminiAvatarProvider()
    if provider == "heygen":
        return HeyGenProvider()
    return LocalLipSyncAvatarProvider()


def create_ai_provider() -> AIProvider:
    provider = settings.ai_provider.strip().lower()
    if provider in {"openai", "chatgpt"}:
        return OpenAIScriptProvider()
    if provider == "gemini":
        return GeminiScriptProvider()
    if provider in {"local", "local-llm"}:
        return LocalLLMScriptProvider()
    return OpenAIScriptProvider()


def create_voice_provider() -> VoiceProvider:
    provider = settings.voice_provider.strip().lower()
    if provider == "openai":
        return OpenAIVoiceProvider()
    if provider in {"local", "system"}:
        return LocalVoiceProvider()
    return LocalVoiceProvider()
