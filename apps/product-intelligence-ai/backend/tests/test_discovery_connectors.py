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
async def test_discovery_search_filters_by_market_and_sources() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/discovery/search",
            headers=REQUIRED_HEADERS,
            json={
                "keyword": "stand",
                "market": "amazon_us",
                "min_price": 20,
                "max_price": 35,
                "sources": ["alibaba_public_api"],
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["source"] == "alibaba_public_api"
    assert response.headers.get("X-Total-Count") == "1"


@pytest.mark.anyio
async def test_discovery_search_sorts_and_paginates() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/discovery/search",
            headers=REQUIRED_HEADERS,
            json={
                "keyword": "",
                "market": "amazon_uk",
                "min_price": 0,
                "max_price": 100,
                "sort_by": "price",
                "sort_order": "asc",
                "page": 1,
                "page_size": 2,
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 2
    assert payload[0]["price"] <= payload[1]["price"]
    assert response.headers.get("X-Total-Count") == "3"
    assert response.headers.get("X-Page") == "1"
    assert response.headers.get("X-Page-Size") == "2"
    assert response.headers.get("X-Sort-By") == "price"
    assert response.headers.get("X-Sort-Order") == "asc"


@pytest.mark.anyio
async def test_discovery_import_normalizes_user_records() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/discovery/import",
            headers=REQUIRED_HEADERS,
            json={
                "items": [
                    {
                        "source": "user_upload",
                        "title": "Flat Pack Monitor Stand",
                        "price": 27.5,
                        "rating": 4.0,
                        "reviews": 12,
                        "brand": "Velynxia Candidate",
                        "dimensions": "50x20x8 cm",
                        "weight_kg": 1.4,
                    }
                ]
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["title"] == "Flat Pack Monitor Stand"
    assert payload[0]["source"] == "user_upload"
