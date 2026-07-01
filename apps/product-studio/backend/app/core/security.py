from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

import jwt
from fastapi import HTTPException

from app.core.config import get_settings


@dataclass
class AuthUser:
    user_id: str
    tenant_id: str
    role: str


def create_access_token(*, user_id: str, tenant_id: str, role: str) -> str:
    settings = get_settings()
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.jwt_access_token_exp_minutes)
    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "role": role,
        "exp": expires_at,
        "iat": datetime.now(UTC),
        "type": "access",
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> AuthUser:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid or expired access token") from exc

    user_id = str(payload.get("sub", "")).strip()
    tenant_id = str(payload.get("tenant_id", "")).strip()
    role = str(payload.get("role", "")).strip()
    token_type = str(payload.get("type", "")).strip()

    if token_type != "access" or not user_id or not tenant_id or not role:
        raise HTTPException(status_code=401, detail="Invalid access token payload")

    return AuthUser(user_id=user_id, tenant_id=tenant_id, role=role)