from app.providers.base import AvatarProvider


class HeyGenProvider(AvatarProvider):
    async def generate_video(self, script: str, avatar_id: str) -> dict:
        return {
            "provider": "heygen",
            "status": "queued",
            "videoJobId": "heygen_job_123",
            "avatarId": avatar_id,
            "script": script,
        }
