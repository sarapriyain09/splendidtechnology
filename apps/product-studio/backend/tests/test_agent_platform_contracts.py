import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services.agent_platform_client import AgentPlatformClient


REQUIRED_HEADERS = {
    "X-Tenant-Id": "tenant-1",
    "X-User-Id": "user-1",
    "X-User-Role": "owner",
    "X-Request-Source": "product-studio",
}


@pytest.mark.anyio
async def test_reviews_uses_agent_platform_result(monkeypatch) -> None:
    async def fake_prompt(*args, **kwargs):
        return {
            "result": {
                "top_pain_points": [{"term": f"issue-{i}", "mentions": i} for i in range(25)],
            }
        }

    monkeypatch.setattr(AgentPlatformClient, "run_product_intelligence_prompt", fake_prompt)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reviews/analyze",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": "desk organizer",
                "one_star": ["bad finish", "wobbly legs"],
                "two_star": [],
                "three_star": [],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload["top_pain_points"]) == 20
    assert payload["top_pain_points"][0]["term"] == "issue-0"


@pytest.mark.anyio
async def test_reviews_falls_back_when_agent_shape_is_missing(monkeypatch) -> None:
    async def fake_prompt(*args, **kwargs):
        return {"result": {"summary": "no structured pain points"}}

    monkeypatch.setattr(AgentPlatformClient, "run_product_intelligence_prompt", fake_prompt)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reviews/analyze",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": "desk organizer",
                "one_star": ["broken screws", "broken corners"],
                "two_star": ["packaging damaged"],
                "three_star": [],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert isinstance(payload["top_pain_points"], list)
    assert payload["top_pain_points"]
    assert "term" in payload["top_pain_points"][0]


@pytest.mark.anyio
async def test_marketing_merges_agent_fields_with_defaults(monkeypatch) -> None:
    async def fake_prompt(*args, **kwargs):
        return {
            "result": {
                "amazon_title": "AI Optimized Desk Organizer",
                "linkedin_post": "AI-crafted launch narrative",
            }
        }

    monkeypatch.setattr(AgentPlatformClient, "run_product_intelligence_prompt", fake_prompt)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/marketing/generate",
            headers=REQUIRED_HEADERS,
            json={"product_name": "Desk Organizer", "pain_points": ["assembly"]},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["amazon_title"] == "AI Optimized Desk Organizer"
    assert payload["linkedin_post"] == "AI-crafted launch narrative"
    assert "keywords" in payload
    assert payload["keywords"]


@pytest.mark.anyio
async def test_b2b_returns_defaults_when_agent_returns_empty(monkeypatch) -> None:
    async def fake_prompt(*args, **kwargs):
        return {"result": {}}

    monkeypatch.setattr(AgentPlatformClient, "run_product_intelligence_prompt", fake_prompt)

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/b2b/suggest",
            headers=REQUIRED_HEADERS,
            json={"product_name": "Desk Organizer", "pain_points": ["durability"]},
        )

    assert response.status_code == 200
    payload = response.json()
    assert "potential_markets" in payload
    assert "Hotels" in payload["potential_markets"]
