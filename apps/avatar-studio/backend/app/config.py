from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Velynxia Avatar Studio API"
    database_url: str = "postgresql+psycopg://avatar_user:avatar_pass@localhost:5432/avatar_studio"
    redis_url: str = "redis://localhost:6379/0"

    heygen_api_key: str = ""
    openai_api_key: str = ""

    minio_root_user: str = "minioadmin"
    minio_root_password: str = "minioadmin"
    minio_endpoint: str = "localhost:9000"
    minio_bucket: str = "avatar-media"
    minio_secure: bool = False

    upload_session_ttl_seconds: int = 3600


settings = Settings()
