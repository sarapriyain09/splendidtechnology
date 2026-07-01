from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Velynxia Product Intelligence AI"
    api_prefix: str = "/api/v1"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/velynxia_product_intelligence"
    agent_platform_base_url: str = "http://localhost:8020"
    cors_origins: str = "http://localhost:3020,http://localhost:3000"
    discovery_catalog_provider: str = "json_file"
    discovery_catalog_file: str = "data/public_catalog.json"
    auth_mode: str = "context"
    jwt_secret_key: str = "change-me-in-env"
    jwt_algorithm: str = "HS256"
    jwt_access_token_exp_minutes: int = 60

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
