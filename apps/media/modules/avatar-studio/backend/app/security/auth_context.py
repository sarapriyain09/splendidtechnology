from dataclasses import dataclass
from uuid import UUID

from fastapi import Header, HTTPException, status

from app.config import settings


@dataclass(frozen=True)
class RequestActor:
    user_id: str
    tenant_id: str
    role: str


def _is_valid_uuid(value: str) -> bool:
    try:
        UUID(value)
        return True
    except ValueError:
        return False


def get_request_actor(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_tenant_id: str | None = Header(default=None, alias="X-Tenant-Id"),
    x_user_role: str | None = Header(default=None, alias="X-User-Role"),
) -> RequestActor:
    # Keep local development productive while enforcing strict request context in production.
    if not settings.is_production() and not x_user_id and not x_tenant_id:
        return RequestActor(
            user_id=settings.dev_default_user_id,
            tenant_id=settings.dev_default_tenant_id,
            role=x_user_role or "owner",
        )

    if not x_user_id or not x_tenant_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing required auth context headers: X-User-Id and X-Tenant-Id",
        )

    if not _is_valid_uuid(x_user_id) or not _is_valid_uuid(x_tenant_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="X-User-Id and X-Tenant-Id must be valid UUID values",
        )

    return RequestActor(
        user_id=x_user_id,
        tenant_id=x_tenant_id,
        role=x_user_role or "staff",
    )
