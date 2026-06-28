import json
import uuid

import redis

from app.config import settings


class UploadSessionStore:
    def __init__(self) -> None:
        self.redis = redis.from_url(settings.redis_url, decode_responses=True)

    def create_session(self, training_id: str, upload_type: str, filename: str, total_chunks: int, content_type: str) -> dict[str, str | int]:
        upload_id = str(uuid.uuid4())
        key = self._key(upload_id)
        prefix = f"tmp/{training_id}/{upload_id}"

        payload = {
            "upload_id": upload_id,
            "training_id": training_id,
            "upload_type": upload_type,
            "filename": filename,
            "total_chunks": total_chunks,
            "content_type": content_type,
            "prefix": prefix,
        }

        self.redis.setex(key, settings.upload_session_ttl_seconds, json.dumps(payload))
        return payload

    def get_session(self, upload_id: str) -> dict[str, str | int] | None:
        value = self.redis.get(self._key(upload_id))
        if not value:
            return None
        return json.loads(value)

    def mark_chunk(self, upload_id: str, chunk_index: int) -> None:
        self.redis.sadd(self._chunks_key(upload_id), chunk_index)
        self.redis.expire(self._chunks_key(upload_id), settings.upload_session_ttl_seconds)

    def count_chunks(self, upload_id: str) -> int:
        return int(self.redis.scard(self._chunks_key(upload_id)))

    def clear(self, upload_id: str) -> None:
        self.redis.delete(self._key(upload_id))
        self.redis.delete(self._chunks_key(upload_id))

    @staticmethod
    def _key(upload_id: str) -> str:
        return f"upload_session:{upload_id}"

    @staticmethod
    def _chunks_key(upload_id: str) -> str:
        return f"upload_session:{upload_id}:chunks"
