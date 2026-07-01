import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


REQUIRED_HEADERS = {
    "X-Tenant-Id": "tenant-1",
    "X-User-Id": "user-1",
    "X-User-Role": "owner",
    "X-Request-Source": "product-intelligence-ai",
}


@pytest.mark.anyio
async def test_reviews_endpoint_rejects_missing_context_headers() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reviews/analyze",
            json={"product_name": "desk organizer", "one_star": [], "two_star": [], "three_star": []},
        )
    assert response.status_code == 400


@pytest.mark.anyio
async def test_reviews_endpoint_accepts_required_context_headers() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reviews/analyze",
            headers=REQUIRED_HEADERS,
            json={"product_name": "desk organizer", "one_star": [], "two_star": [], "three_star": []},
        )
    assert response.status_code == 200
