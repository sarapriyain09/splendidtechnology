from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, Request

from app.core.config import get_settings
from app.core.security import decode_access_token


@dataclass
class RequestContext:
    tenant_id: str
    user_id: str
    role: str
    source_module: str
    correlation_id: str


def require_request_context(
    request: Request,
    x_tenant_id: str | None = Header(default=None, alias="X-Tenant-Id"),
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_user_role: str | None = Header(default=None, alias="X-User-Role"),
    x_request_source: str | None = Header(default=None, alias="X-Request-Source"),
    x_correlation_id: str | None = Header(default=None, alias="X-Correlation-Id"),
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> RequestContext:
    settings = get_settings()

    missing: list[str] = []
    if not x_tenant_id:
        missing.append("X-Tenant-Id")
    if not x_user_id:
        missing.append("X-User-Id")
    if not x_user_role:
        missing.append("X-User-Role")
    if not x_request_source:
        missing.append("X-Request-Source")

    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required headers: {', '.join(missing)}",
        )

    token = None
    if authorization:
        scheme, _, value = authorization.partition(" ")
        if scheme.lower() != "bearer" or not value:
            raise HTTPException(status_code=401, detail="Invalid Authorization header format")
        token = value.strip()

    if settings.auth_mode.lower() == "jwt" and not token:
        raise HTTPException(status_code=401, detail="Missing bearer token")

    if token:
        auth_user = decode_access_token(token)
        if auth_user.user_id != x_user_id or auth_user.tenant_id != x_tenant_id or auth_user.role.lower() != x_user_role.lower():
            raise HTTPException(status_code=403, detail="Token claims do not match request context")

    correlation_id = x_correlation_id or getattr(request.state, "correlation_id", "")
    if not correlation_id:
        raise HTTPException(status_code=400, detail="Missing X-Correlation-Id")

    return RequestContext(
        tenant_id=x_tenant_id,
        user_id=x_user_id,
        role=x_user_role,
        source_module=x_request_source,
        correlation_id=correlation_id,
    )


def require_roles(*allowed_roles: str):
    normalized_allowed = {role.strip().lower() for role in allowed_roles if role.strip()}

    def _dependency(ctx: RequestContext = Depends(require_request_context)) -> RequestContext:
        if normalized_allowed and ctx.role.strip().lower() not in normalized_allowed:
            raise HTTPException(status_code=403, detail="Insufficient role permissions")
        return ctx

    return _dependency
