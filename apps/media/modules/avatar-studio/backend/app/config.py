from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Velynxia Avatar Studio API"
    app_env: str = "development"
    database_url: str = "postgresql+psycopg://avatar_user:avatar_pass@localhost:5432/avatar_studio"
    redis_url: str = "redis://localhost:6379/0"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    app_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"
    jwt_secret: str = "change-me-in-production"

    heygen_api_key: str = ""
    openai_api_key: str = ""

    minio_root_user: str = ""
    minio_root_password: str = ""
    minio_endpoint: str = "localhost:9000"
    minio_bucket: str = "avatar-media"
    minio_secure: bool = False
    storage_backend: str = "filesystem"
    storage_root: str = "/srv/velynxia/avatarstudio/storage"
    local_media_root: str = "/srv/velynxia/avatarstudio/storage"
    logs_root: str = "/srv/velynxia/avatarstudio/logs"
    backup_root: str = "/srv/velynxia/avatarstudio/storage/backups"

    upload_session_ttl_seconds: int = 3600

    def is_production(self) -> bool:
        return self.app_env.strip().lower() == "production"

    def validate_runtime(self) -> None:
        if not self.is_production():
            return

        errors: list[str] = []

        db_url = self.database_url.strip().lower()
        if not db_url:
            errors.append("DATABASE_URL is required in production")
        if "change_me" in db_url:
            errors.append("DATABASE_URL contains placeholder value 'CHANGE_ME'")

        jwt = self.jwt_secret.strip()
        if not jwt:
            errors.append("JWT_SECRET is required in production")
        if jwt in {"change-me-in-production", "replace-with-64-char-secret", "replace-with-strong-secret"}:
            errors.append("JWT_SECRET is using a placeholder value")
        if len(jwt) < 32:
            errors.append("JWT_SECRET must be at least 32 characters in production")

        if not self.openai_api_key.strip():
            errors.append("OPENAI_API_KEY is required in production")

        if not self.heygen_api_key.strip():
            errors.append("HEYGEN_API_KEY is required in production")

        if errors:
            joined = "; ".join(errors)
            raise RuntimeError(f"Invalid production environment: {joined}")


settings = Settings()
