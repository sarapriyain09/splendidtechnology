from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Velynxia Accounting API"
    database_url: str = "postgresql+psycopg://postgres:postgres@192.168.0.64:5432/velynxia_db"
    cors_origins: str = "*"

    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_exp_minutes: int = 30
    refresh_token_exp_days: int = 14


settings = Settings()
