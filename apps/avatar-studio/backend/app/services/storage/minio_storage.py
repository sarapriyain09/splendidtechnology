from io import BytesIO
from typing import BinaryIO

from minio import Minio
from minio.error import S3Error

from app.config import settings


class MinioStorage:
    def __init__(self) -> None:
        self.client = Minio(
            settings.minio_endpoint,
            access_key=settings.minio_root_user,
            secret_key=settings.minio_root_password,
            secure=settings.minio_secure,
        )
        self.bucket = settings.minio_bucket

    def _ensure_bucket(self) -> None:
        found = self.client.bucket_exists(self.bucket)
        if not found:
            self.client.make_bucket(self.bucket)

    def put_bytes(self, object_name: str, data: bytes, content_type: str = "application/octet-stream") -> str:
        self._ensure_bucket()
        self.client.put_object(
            self.bucket,
            object_name,
            BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
        return self.object_url(object_name)

    def put_fileobj(self, object_name: str, fileobj: BinaryIO, length: int, content_type: str = "application/octet-stream") -> str:
        self._ensure_bucket()
        self.client.put_object(self.bucket, object_name, fileobj, length=length, content_type=content_type)
        return self.object_url(object_name)

    def get_bytes(self, object_name: str) -> bytes:
        response = self.client.get_object(self.bucket, object_name)
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()

    def remove_object(self, object_name: str) -> None:
        try:
            self.client.remove_object(self.bucket, object_name)
        except S3Error:
            return

    def object_url(self, object_name: str) -> str:
        scheme = "https" if settings.minio_secure else "http"
        return f"{scheme}://{settings.minio_endpoint}/{self.bucket}/{object_name}"
