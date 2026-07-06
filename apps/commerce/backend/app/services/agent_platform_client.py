from typing import Any

import httpx

from app.core.config import get_settings
from app.core.request_context import RequestContext


class AgentPlatformClient:
    """Thin adapter for shared agent-platform APIs."""

    def __init__(self) -> None:
        self._base_url = get_settings().agent_platform_base_url

    @staticmethod
    def _build_headers(context: RequestContext) -> dict[str, str]:
        return {
            "X-Tenant-Id": context.tenant_id,
            "X-User-Id": context.user_id,
            "X-User-Role": context.role,
            "X-Request-Source": context.source_module,
            "X-Correlation-Id": context.correlation_id,
        }

    async def run_product_intelligence_prompt(
        self,
        prompt_key: str,
        payload: dict[str, Any],
        context: RequestContext,
    ) -> dict[str, Any]:
        # Keep all AI orchestration behind the shared platform boundary.
        try:
            async with httpx.AsyncClient(base_url=self._base_url, timeout=20.0) as client:
                response = await client.post(
                    "/api/v1/agents/execute",
                    json={"prompt_key": prompt_key, "payload": payload},
                    headers=self._build_headers(context),
                )
        except httpx.HTTPError:
            return {
                "status": "fallback",
                "message": "Agent platform unavailable; using deterministic fallback.",
                "result": payload,
            }

        if response.status_code >= 400:
            # Safe fallback if agent platform is unavailable during MVP setup.
            return {
                "status": "fallback",
                "message": "Agent platform unavailable; using deterministic fallback.",
                "result": payload,
            }

        return response.json()
