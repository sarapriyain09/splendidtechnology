from io import BytesIO
from pathlib import Path
from typing import BinaryIO

try:
    from minio import Minio
    from minio.error import S3Error
except ImportError:  # pragma: no cover
    Minio = None  # type: ignore[assignment]

    class S3Error(Exception):
        pass

from app.config import settings


class MinioStorage:
    def __init__(self) -> None:
        self._use_filesystem = settings.storage_backend.lower() == "filesystem"
        self._local_root = Path(settings.storage_root)
        self.client = None
        self.bucket = settings.minio_bucket

        if not self._use_filesystem:
            if Minio is None:
                raise RuntimeError("MinIO client is not installed. Set STORAGE_BACKEND=filesystem or install minio package.")

            self.client = Minio(
                settings.minio_endpoint,
                access_key=settings.minio_root_user,
                secret_key=settings.minio_root_password,
                secure=settings.minio_secure,
            )

        if self._use_filesystem:
            self._local_root.mkdir(parents=True, exist_ok=True)

    def _ensure_bucket(self) -> None:
        if self.client is None:
            return

        found = self.client.bucket_exists(self.bucket)
        if not found:
            self.client.make_bucket(self.bucket)

    def put_bytes(self, object_name: str, data: bytes, content_type: str = "application/octet-stream") -> str:
        if self._use_filesystem:
            target = self._local_path(object_name)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
            return self.object_url(object_name)

        self._ensure_bucket()
        if self.client is None:
            raise RuntimeError("MinIO client is not configured")

        self.client.put_object(
            self.bucket,
            object_name,
            BytesIO(data),
            length=len(data),
            content_type=content_type,
        )
        return self.object_url(object_name)

    def put_fileobj(self, object_name: str, fileobj: BinaryIO, length: int, content_type: str = "application/octet-stream") -> str:
        if self._use_filesystem:
            target = self._local_path(object_name)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(fileobj.read(length))
            return self.object_url(object_name)

        self._ensure_bucket()
        if self.client is None:
            raise RuntimeError("MinIO client is not configured")

        self.client.put_object(self.bucket, object_name, fileobj, length=length, content_type=content_type)
        return self.object_url(object_name)

    def get_bytes(self, object_name: str) -> bytes:
        if self._use_filesystem:
            return self._local_path(object_name).read_bytes()

        if self.client is None:
            raise RuntimeError("MinIO client is not configured")

        response = self.client.get_object(self.bucket, object_name)
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()

    def remove_object(self, object_name: str) -> None:
        if self._use_filesystem:
            self._local_path(object_name).unlink(missing_ok=True)
            return

        try:
            self.client.remove_object(self.bucket, object_name)
        except S3Error:
            return

    def object_url(self, object_name: str) -> str:
        if self._use_filesystem:
            return str(self._local_path(object_name).resolve())

        scheme = "https" if settings.minio_secure else "http"
        return f"{scheme}://{settings.minio_endpoint}/{self.bucket}/{object_name}"

    def _local_path(self, object_name: str) -> Path:
        return self._local_root / object_name
