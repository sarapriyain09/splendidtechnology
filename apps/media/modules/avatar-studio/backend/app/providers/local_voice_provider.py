from app.providers.base import VoiceProvider


class LocalVoiceProvider(VoiceProvider):
    async def text_to_speech(self, text: str, voice_id: str | None = None) -> dict:
        return {
            "provider": "local",
            "status": "not_implemented",
            "voiceId": voice_id or "system-default",
            "textLength": len(text.strip()),
        }

    async def clone_voice(self, source_path: str, voice_name: str) -> dict:
        return {
            "provider": "local",
            "status": "not_implemented",
            "sourcePath": source_path,
            "voiceName": voice_name,
        }

    async def list_voices(self) -> list[dict]:
        return [{"id": "system-default", "name": "System Default", "provider": "local"}]
