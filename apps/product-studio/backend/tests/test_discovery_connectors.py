import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.main import app
from app.services.discovery_connectors import DiscoveryConnectorService


REQUIRED_HEADERS = {
    "X-Tenant-Id": "tenant-1",
    "X-User-Id": "user-1",
    "X-User-Role": "owner",
    "X-Request-Source": "product-studio",
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
    assert response.headers.get("X-Catalog-Row-Count") == "3"
    assert response.headers.get("X-Skipped-Row-Count") == "0"


@pytest.mark.anyio
async def test_discovery_search_second_page_metadata_and_payload() -> None:
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
                "page": 2,
                "page_size": 2,
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert response.headers.get("X-Total-Count") == "3"
    assert response.headers.get("X-Page") == "2"
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


@pytest.mark.anyio
async def test_discovery_search_uses_configured_catalog_connector() -> None:
    class StubCatalogConnector:
        def load_catalog(self) -> list[dict]:
            return [
                {
                    "source": "amazon_public_api",
                    "title": "Configured Connector Stand",
                    "price": 29.9,
                    "rating": 4.8,
                    "reviews": 51,
                    "brand": "Connector Brand",
                    "dimensions": "30x20x5 cm",
                    "weight_kg": 1.0,
                    "category": "desk_organization",
                    "markets": ["amazon_uk"],
                }
            ]

    DiscoveryConnectorService.configure_catalog_connector(StubCatalogConnector())
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/discovery/search",
                headers=REQUIRED_HEADERS,
                json={
                    "keyword": "configured",
                    "market": "amazon_uk",
                    "min_price": 0,
                    "max_price": 50,
                    "sources": ["amazon_public_api"],
                },
            )
    finally:
        DiscoveryConnectorService.reset_catalog_connector()

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["title"] == "Configured Connector Stand"
    assert response.headers.get("X-Total-Count") == "1"


@pytest.mark.anyio
async def test_discovery_search_handles_empty_catalog_connector() -> None:
    class EmptyCatalogConnector:
        def load_catalog(self) -> list[dict]:
            return []

    DiscoveryConnectorService.configure_catalog_connector(EmptyCatalogConnector())
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/discovery/search",
                headers=REQUIRED_HEADERS,
                json={
                    "keyword": "stand",
                    "market": "amazon_uk",
                    "min_price": 0,
                    "max_price": 100,
                },
            )
    finally:
        DiscoveryConnectorService.reset_catalog_connector()

    assert response.status_code == 200
    assert response.json() == []
    assert response.headers.get("X-Total-Count") == "0"


@pytest.mark.anyio
async def test_discovery_search_skips_malformed_catalog_rows() -> None:
    class MixedCatalogConnector:
        def load_catalog(self) -> list[dict]:
            return [
                {
                    "source": "amazon_public_api",
                    "title": "Valid Stand Candidate",
                    "price": 33.5,
                    "rating": 4.4,
                    "reviews": 60,
                    "brand": "Valid",
                    "dimensions": "31x20x7 cm",
                    "weight_kg": 1.1,
                    "category": "desk_organization",
                    "markets": ["amazon_uk"],
                },
                {
                    "source": "amazon_public_api",
                    "title": "Broken Price Candidate",
                    "price": "not-a-number",
                    "rating": 4.2,
                    "reviews": 10,
                    "category": "desk_organization",
                    "markets": ["amazon_uk"],
                },
            ]

    DiscoveryConnectorService.configure_catalog_connector(MixedCatalogConnector())
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/api/v1/discovery/search",
                headers=REQUIRED_HEADERS,
                json={
                    "keyword": "candidate",
                    "market": "amazon_uk",
                    "min_price": 0,
                    "max_price": 100,
                },
            )
    finally:
        DiscoveryConnectorService.reset_catalog_connector()

    assert response.status_code == 200
    payload = response.json()
    assert len(payload) == 1
    assert payload[0]["title"] == "Valid Stand Candidate"
    assert response.headers.get("X-Catalog-Row-Count") == "2"
    assert response.headers.get("X-Skipped-Row-Count") == "1"


def test_discovery_connector_settings_default_file_path_is_relative_to_service_dir() -> None:
    settings = get_settings()
    DiscoveryConnectorService.configure_from_settings(settings)

    connector = DiscoveryConnectorService._catalog_connector
    assert hasattr(connector, "_file_path")
    normalized_path = str(connector._file_path).replace("\\", "/")
    assert normalized_path.endswith("app/services/data/public_catalog.json")

    DiscoveryConnectorService.reset_catalog_connector()
