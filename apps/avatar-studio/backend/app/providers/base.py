from abc import ABC, abstractmethod


class AvatarProvider(ABC):
    @abstractmethod
    async def generate_video(self, script: str, avatar_id: str) -> dict:
        raise NotImplementedError


class ScriptProvider(ABC):
    @abstractmethod
    async def generate_script(self, prompt: str) -> dict:
        raise NotImplementedError
