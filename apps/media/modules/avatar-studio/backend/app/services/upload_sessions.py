import json
import uuid

try:
    import redis
    from redis.exceptions import RedisError
except ImportError:  # pragma: no cover
    redis = None  # type: ignore[assignment]

    class RedisError(Exception):
        pass

from app.config import settings


class UploadSessionStore:
    def __init__(self) -> None:
        self.redis = None
        self._use_in_memory = False
        self._sessions: dict[str, dict[str, str | int]] = {}
        self._chunks: dict[str, set[int]] = {}

        if redis is None:
            self._use_in_memory = True
            return

        try:
            self.redis = redis.from_url(settings.redis_url, decode_responses=True)
            self.redis.ping()
        except RedisError:
            self._use_in_memory = True

    def create_session(
        self,
        training_id: str,
        upload_type: str,
        filename: str,
        total_chunks: int,
        content_type: str,
        user_id: str = "default-user",
    ) -> dict[str, str | int]:
        upload_id = str(uuid.uuid4())
        key = self._key(upload_id)
        prefix = f"temp/{user_id}/{training_id}/{upload_id}"

        payload = {
            "upload_id": upload_id,
            "training_id": training_id,
            "upload_type": upload_type,
            "user_id": user_id,
            "filename": filename,
            "total_chunks": total_chunks,
            "content_type": content_type,
            "prefix": prefix,
        }

        if self._use_in_memory:
            self._sessions[upload_id] = payload
            self._chunks[upload_id] = set()
            return payload

        self.redis.setex(key, settings.upload_session_ttl_seconds, json.dumps(payload))
        return payload

    def get_session(self, upload_id: str) -> dict[str, str | int] | None:
        if self._use_in_memory:
            return self._sessions.get(upload_id)

        if self.redis is None:
            return None

        value = self.redis.get(self._key(upload_id))
        if not value:
            return None
        return json.loads(value)

    def mark_chunk(self, upload_id: str, chunk_index: int) -> None:
        if self._use_in_memory:
            self._chunks.setdefault(upload_id, set()).add(chunk_index)
            return

        if self.redis is None:
            return

        self.redis.sadd(self._chunks_key(upload_id), chunk_index)
        self.redis.expire(self._chunks_key(upload_id), settings.upload_session_ttl_seconds)

    def count_chunks(self, upload_id: str) -> int:
        if self._use_in_memory:
            return len(self._chunks.get(upload_id, set()))

        if self.redis is None:
            return 0

        return int(self.redis.scard(self._chunks_key(upload_id)))

    def clear(self, upload_id: str) -> None:
        if self._use_in_memory:
            self._sessions.pop(upload_id, None)
            self._chunks.pop(upload_id, None)
            return

        if self.redis is None:
            return

        self.redis.delete(self._key(upload_id))
        self.redis.delete(self._chunks_key(upload_id))

    @staticmethod
    def _key(upload_id: str) -> str:
        return f"upload_session:{upload_id}"

    @staticmethod
    def _chunks_key(upload_id: str) -> str:
        return f"upload_session:{upload_id}:chunks"
