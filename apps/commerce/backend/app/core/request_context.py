from dataclasses import dataclass

from fastapi import Header, HTTPException, Request


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
) -> RequestContext:
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
