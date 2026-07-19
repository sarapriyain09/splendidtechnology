from __future__ import annotations

from contextvars import ContextVar, Token


correlation_id_var: ContextVar[str] = ContextVar("correlation_id", default="-")
request_id_var: ContextVar[str] = ContextVar("request_id", default="-")
tenant_id_var: ContextVar[str] = ContextVar("tenant_id", default="-")
user_id_var: ContextVar[str] = ContextVar("user_id", default="-")


def set_request_context(correlation_id: str, request_id: str, tenant_id: str, user_id: str) -> dict[str, Token[str]]:
    return {
        "correlation_id": correlation_id_var.set(correlation_id or "-"),
        "request_id": request_id_var.set(request_id or "-"),
        "tenant_id": tenant_id_var.set(tenant_id or "-"),
        "user_id": user_id_var.set(user_id or "-"),
    }


def reset_request_context(tokens: dict[str, Token[str]]) -> None:
    correlation_id_var.reset(tokens["correlation_id"])
    request_id_var.reset(tokens["request_id"])
    tenant_id_var.reset(tokens["tenant_id"])
    user_id_var.reset(tokens["user_id"])
