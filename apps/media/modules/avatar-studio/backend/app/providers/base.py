from abc import ABC, abstractmethod


class AvatarProvider(ABC):
    @abstractmethod
    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        raise NotImplementedError

    async def train_avatar(self, training_payload: dict) -> dict:
        return {"status": "not_implemented", "provider": self.__class__.__name__}

    async def list_avatars(self) -> list[dict]:
        return []

    async def delete_avatar(self, avatar_id: str) -> dict:
        return {"status": "not_implemented", "avatarId": avatar_id, "provider": self.__class__.__name__}


class AIProvider(ABC):
    @abstractmethod
    async def generate_script(self, prompt: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def generate_scene_plan(self, prompt: str, script: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def rewrite(self, text: str, style: str | None = None) -> str:
        raise NotImplementedError

    @abstractmethod
    async def summarize(self, text: str) -> str:
        raise NotImplementedError

    @abstractmethod
    async def translate(self, text: str, target_language: str) -> str:
        raise NotImplementedError

    @abstractmethod
    async def generate_captions(self, script: str) -> list[dict]:
        raise NotImplementedError


class VoiceProvider(ABC):
    @abstractmethod
    async def text_to_speech(self, text: str, voice_id: str | None = None) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def clone_voice(self, source_path: str, voice_name: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    async def list_voices(self) -> list[dict]:
        raise NotImplementedError


# Backward compatible alias for legacy imports.
ScriptProvider = AIProvider
