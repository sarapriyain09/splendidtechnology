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
    dev_default_user_id: str = "00000000-0000-0000-0000-000000000001"
    dev_default_tenant_id: str = "00000000-0000-0000-0000-000000000001"

    ai_provider: str = "gemini"
    avatar_provider: str = "local-lipsync"
    avatar_animation_provider: str = "overlay"
    avatar_animation_fallback_provider: str = "overlay"
    avatar_animation_strict: bool = False
    avatar_animation_endpoint: str = ""
    avatar_animation_health_url: str = ""
    avatar_animation_timeout_seconds: int = 120
    voice_provider: str = "local"

    heygen_api_key: str = ""
    heygen_api_base_url: str = "https://api.heygen.com"
    heygen_default_avatar_id: str = ""
    heygen_api_timeout_seconds: int = 30
    heygen_poll_interval_seconds: float = 2.0
    heygen_poll_timeout_seconds: int = 45
    heygen_request_retries: int = 2
    heygen_retry_backoff_seconds: float = 1.0
    heygen_enable_dev_fallback: bool = True

    openai_api_key: str = ""
    openai_api_base_url: str = "https://api.openai.com/v1"
    openai_model: str = "gpt-4o-mini"
    openai_request_timeout_seconds: int = 30

    gemini_api_key: str = ""
    gemini_api_base_url: str = "https://generativelanguage.googleapis.com/v1beta"
    gemini_script_model: str = "gemini-2.5-flash"
    gemini_model: str = "gemini-2.5-flash-image"
    gemini_request_timeout_seconds: int = 30

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

        provider = self.avatar_provider.strip().lower()
        if provider in {"openai", "chatgpt"}:
            if not self.openai_api_key.strip():
                errors.append("OPENAI_API_KEY is required in production when AVATAR_PROVIDER=openai")
        elif provider == "gemini":
            if not self.gemini_api_key.strip():
                errors.append("GEMINI_API_KEY is required in production when AVATAR_PROVIDER=gemini")
        elif provider == "heygen":
            if not self.heygen_api_key.strip():
                errors.append("HEYGEN_API_KEY is required in production when AVATAR_PROVIDER=heygen")
        elif provider in {"local-lipsync", "lipsync", "lip-sync", "local"}:
            pass
        else:
            errors.append("AVATAR_PROVIDER must be one of: openai, gemini, heygen, local-lipsync")

        ai_provider = self.ai_provider.strip().lower()
        if ai_provider in {"openai", "chatgpt"} and not self.openai_api_key.strip():
            errors.append("OPENAI_API_KEY is required in production when AI_PROVIDER=openai")
        elif ai_provider == "gemini" and not self.gemini_api_key.strip():
            errors.append("GEMINI_API_KEY is required in production when AI_PROVIDER=gemini")
        elif ai_provider not in {"openai", "chatgpt", "gemini", "local", "local-llm"}:
            errors.append("AI_PROVIDER must be one of: openai, gemini, local")

        voice_provider = self.voice_provider.strip().lower()
        if voice_provider not in {"openai", "local", "system"}:
            errors.append("VOICE_PROVIDER must be one of: openai, local")

        animation_provider = self.avatar_animation_provider.strip().lower()
        allowed_animation_providers = {
            "overlay",
            "local-overlay",
            "liveportrait",
            "musetalk",
            "sadtalker",
            "neural",
            "external-neural",
        }
        if animation_provider not in allowed_animation_providers:
            errors.append(
                "AVATAR_ANIMATION_PROVIDER must be one of: overlay, liveportrait, musetalk, sadtalker, neural"
            )

        fallback_provider = self.avatar_animation_fallback_provider.strip().lower()
        if fallback_provider not in {"overlay", "local-overlay", "none", "disabled"}:
            errors.append("AVATAR_ANIMATION_FALLBACK_PROVIDER must be one of: overlay, none")

        if animation_provider in {"liveportrait", "musetalk", "sadtalker", "neural", "external-neural"}:
            endpoint = self.avatar_animation_endpoint.strip().lower()
            if not endpoint:
                errors.append(
                    "AVATAR_ANIMATION_ENDPOINT is required in production when AVATAR_ANIMATION_PROVIDER is neural"
                )
            elif not (endpoint.startswith("http://") or endpoint.startswith("https://")):
                errors.append("AVATAR_ANIMATION_ENDPOINT must start with http:// or https://")

        health_url = self.avatar_animation_health_url.strip().lower()
        if health_url and not (health_url.startswith("http://") or health_url.startswith("https://")):
            errors.append("AVATAR_ANIMATION_HEALTH_URL must start with http:// or https://")

        requires_provider_key = provider in {"openai", "chatgpt", "gemini", "heygen"}
        if requires_provider_key and not self.openai_api_key.strip() and not self.gemini_api_key.strip() and not self.heygen_api_key.strip():
            errors.append("At least one provider API key is required in production")

        if errors:
            joined = "; ".join(errors)
            raise RuntimeError(f"Invalid production environment: {joined}")


settings = Settings()
