import uuid
from datetime import datetime, timezone

import pytest
from httpx import ASGITransport, AsyncClient

from app.db.session import init_db
from app.db.models import ProductAnalysis, SavedDiscoveryRecord
from app.main import app


REQUIRED_HEADERS = {
    "X-Tenant-Id": "tenant-1",
    "X-User-Id": "user-1",
    "X-User-Role": "owner",
    "X-Request-Source": "product-studio",
}


@pytest.mark.anyio
async def test_database_save_is_idempotent_for_same_tenant_source_product_market() -> None:
    init_db()
    unique_title = f"Desk Stand {uuid.uuid4()}"
    payload = {
        "product_name": unique_title,
        "source": "amazon_public_api",
        "market": "amazon_uk",
        "opportunity_score": 81,
        "estimated_profit_percent": 34,
        "competition_score": 46,
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        first_response = await client.post("/api/v1/database/save", headers=REQUIRED_HEADERS, json=payload)
        second_response = await client.post("/api/v1/database/save", headers=REQUIRED_HEADERS, json=payload)

    assert first_response.status_code == 200
    assert second_response.status_code == 200

    first_payload = first_response.json()
    second_payload = second_response.json()

    assert first_payload["created"] is True
    assert first_payload["already_exists"] is False
    assert second_payload["created"] is False
    assert second_payload["already_exists"] is True
    assert first_payload["id"] == second_payload["id"]


@pytest.mark.anyio
async def test_database_save_response_contract_supports_frontend_message_mapping() -> None:
    init_db()
    unique_title = f"Contract Stand {uuid.uuid4()}"
    payload = {
        "product_name": unique_title,
        "source": "amazon_public_api",
        "market": "amazon_uk",
        "opportunity_score": 80,
        "estimated_profit_percent": 33,
        "competition_score": 45,
    }

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        created_response = await client.post("/api/v1/database/save", headers=REQUIRED_HEADERS, json=payload)
        existing_response = await client.post("/api/v1/database/save", headers=REQUIRED_HEADERS, json=payload)

    assert created_response.status_code == 200
    assert existing_response.status_code == 200

    created_payload = created_response.json()
    existing_payload = existing_response.json()

    # Frontend relies on this exact contract for success vs already-saved messaging.
    assert set(created_payload.keys()) == {"id", "created", "already_exists"}
    assert set(existing_payload.keys()) == {"id", "created", "already_exists"}

    assert isinstance(created_payload["id"], int)
    assert isinstance(existing_payload["id"], int)
    assert isinstance(created_payload["created"], bool)
    assert isinstance(existing_payload["created"], bool)
    assert isinstance(created_payload["already_exists"], bool)
    assert isinstance(existing_payload["already_exists"], bool)

    assert created_payload["created"] is True
    assert created_payload["already_exists"] is False
    assert existing_payload["created"] is False
    assert existing_payload["already_exists"] is True
    assert created_payload["id"] == existing_payload["id"]


@pytest.mark.anyio
async def test_saved_status_returns_only_matching_saved_row_keys() -> None:
    init_db()
    unique_title = f"Shelf Rack {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        save_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": unique_title,
                "source": "etsy_public_api",
                "market": "amazon_uk",
                "opportunity_score": 73,
                "estimated_profit_percent": 28,
                "competition_score": 52,
            },
        )
        status_response = await client.post(
            "/api/v1/database/saved-status",
            headers=REQUIRED_HEADERS,
            json={
                "items": [
                    {"source": "etsy_public_api", "title": unique_title, "market": "amazon_uk"},
                    {"source": "amazon_public_api", "title": "Unsaved Item", "market": "amazon_uk"},
                ]
            },
        )

    assert save_response.status_code == 200
    assert status_response.status_code == 200
    payload = status_response.json()
    assert payload["saved_row_keys"] == [f"etsy_public_api-{unique_title}"]


@pytest.mark.anyio
async def test_database_save_bulk_returns_created_and_existing_counts() -> None:
    init_db()
    title_a = f"Bulk Stand A {uuid.uuid4()}"
    title_b = f"Bulk Stand B {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        first_bulk = await client.post(
            "/api/v1/database/save-bulk",
            headers=REQUIRED_HEADERS,
            json={
                "items": [
                    {
                        "product_name": title_a,
                        "source": "amazon_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 82,
                        "estimated_profit_percent": 35,
                        "competition_score": 44,
                    },
                    {
                        "product_name": title_b,
                        "source": "etsy_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 74,
                        "estimated_profit_percent": 27,
                        "competition_score": 56,
                    },
                ]
            },
        )
        second_bulk = await client.post(
            "/api/v1/database/save-bulk",
            headers=REQUIRED_HEADERS,
            json={
                "items": [
                    {
                        "product_name": title_a,
                        "source": "amazon_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 82,
                        "estimated_profit_percent": 35,
                        "competition_score": 44,
                    },
                    {
                        "product_name": title_b,
                        "source": "etsy_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 74,
                        "estimated_profit_percent": 27,
                        "competition_score": 56,
                    },
                ]
            },
        )

    assert first_bulk.status_code == 200
    assert second_bulk.status_code == 200

    first_payload = first_bulk.json()
    second_payload = second_bulk.json()

    assert first_payload["total"] == 2
    assert first_payload["created_count"] == 2
    assert first_payload["already_exists_count"] == 0
    assert all(item["created"] is True for item in first_payload["items"])

    assert second_payload["total"] == 2
    assert second_payload["created_count"] == 0
    assert second_payload["already_exists_count"] == 2
    assert all(item["already_exists"] is True for item in second_payload["items"])


@pytest.mark.anyio
async def test_database_save_bulk_item_mapping_for_mixed_existing_and_new_records() -> None:
    init_db()
    existing_title = f"Bulk Existing {uuid.uuid4()}"
    new_title = f"Bulk New {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        existing_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": existing_title,
                "source": "amazon_public_api",
                "market": "amazon_uk",
                "opportunity_score": 81,
                "estimated_profit_percent": 34,
                "competition_score": 45,
            },
        )
        existing_id = existing_response.json()["id"]

        bulk_response = await client.post(
            "/api/v1/database/save-bulk",
            headers=REQUIRED_HEADERS,
            json={
                "items": [
                    {
                        "product_name": existing_title,
                        "source": "amazon_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 81,
                        "estimated_profit_percent": 34,
                        "competition_score": 45,
                    },
                    {
                        "product_name": new_title,
                        "source": "etsy_public_api",
                        "market": "amazon_uk",
                        "opportunity_score": 75,
                        "estimated_profit_percent": 29,
                        "competition_score": 55,
                    },
                ]
            },
        )

    assert existing_response.status_code == 200
    assert bulk_response.status_code == 200

    payload = bulk_response.json()
    assert payload["total"] == 2
    assert payload["created_count"] == 1
    assert payload["already_exists_count"] == 1

    first_item = payload["items"][0]
    second_item = payload["items"][1]

    # Item contracts should map back to corresponding submitted payload order and identity.
    assert first_item["source"] == "amazon_public_api"
    assert first_item["product_name"] == existing_title
    assert first_item["market"] == "amazon_uk"
    assert first_item["created"] is False
    assert first_item["already_exists"] is True
    assert first_item["id"] == existing_id

    assert second_item["source"] == "etsy_public_api"
    assert second_item["product_name"] == new_title
    assert second_item["market"] == "amazon_uk"
    assert second_item["created"] is True
    assert second_item["already_exists"] is False
    assert isinstance(second_item["id"], int)
    assert second_item["id"] != existing_id


@pytest.mark.anyio
async def test_database_save_bulk_empty_payload_is_valid() -> None:
    init_db()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/database/save-bulk",
            headers=REQUIRED_HEADERS,
            json={"items": []},
        )

    assert response.status_code == 200
    assert response.json() == {
        "total": 0,
        "created_count": 0,
        "already_exists_count": 0,
        "items": [],
    }


@pytest.mark.anyio
async def test_database_save_normalizes_idempotency_key_fields() -> None:
    init_db()
    unique_title = f"Portable Stand {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        first_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": unique_title,
                "source": "AMAZON_PUBLIC_API",
                "market": "AMAZON_UK",
                "opportunity_score": 78,
                "estimated_profit_percent": 30,
                "competition_score": 50,
            },
        )
        second_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": f"  {unique_title.lower()}  ",
                "source": "amazon_public_api",
                "market": "amazon_uk",
                "opportunity_score": 78,
                "estimated_profit_percent": 30,
                "competition_score": 50,
            },
        )

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    first_payload = first_response.json()
    second_payload = second_response.json()
    assert first_payload["created"] is True
    assert second_payload["already_exists"] is True
    assert first_payload["id"] == second_payload["id"]


@pytest.mark.anyio
async def test_saved_list_returns_tenant_saved_analyses() -> None:
    init_db()
    unique_title = f"Listed Stand {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        save_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": unique_title,
                "source": "amazon_public_api",
                "market": "amazon_uk",
                "opportunity_score": 79,
                "estimated_profit_percent": 32,
                "competition_score": 47,
            },
        )
        list_response = await client.get("/api/v1/database/saved", headers=REQUIRED_HEADERS)

    assert save_response.status_code == 200
    assert list_response.status_code == 200
    payload = list_response.json()
    assert payload["items"]

    first_item = payload["items"][0]
    assert first_item["product_name"] == unique_title
    assert first_item["source"] == "amazon_public_api"
    assert first_item["market"] == "amazon_uk"


@pytest.mark.anyio
async def test_delete_saved_analysis_removes_record_and_analysis() -> None:
    init_db()
    unique_title = f"Delete Stand {uuid.uuid4()}"

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        save_response = await client.post(
            "/api/v1/database/save",
            headers=REQUIRED_HEADERS,
            json={
                "product_name": unique_title,
                "source": "etsy_public_api",
                "market": "amazon_uk",
                "opportunity_score": 76,
                "estimated_profit_percent": 29,
                "competition_score": 53,
            },
        )
        saved_id = save_response.json()["id"]

        delete_response = await client.delete(f"/api/v1/database/saved/{saved_id}", headers=REQUIRED_HEADERS)
        list_response = await client.get("/api/v1/database/saved", headers=REQUIRED_HEADERS)

    assert save_response.status_code == 200
    assert delete_response.status_code == 200
    assert delete_response.json() == {"deleted": True}
    assert list_response.status_code == 200
    assert all(item["id"] != saved_id for item in list_response.json()["items"])


def test_created_at_defaults_are_timezone_aware_utc() -> None:
    product_default = ProductAnalysis.__table__.c.created_at.default
    saved_record_default = SavedDiscoveryRecord.__table__.c.created_at.default

    assert product_default is not None and callable(product_default.arg)
    assert saved_record_default is not None and callable(saved_record_default.arg)

    product_timestamp = product_default.arg(None)
    saved_record_timestamp = saved_record_default.arg(None)

    assert isinstance(product_timestamp, datetime)
    assert isinstance(saved_record_timestamp, datetime)

    assert product_timestamp.tzinfo is not None
    assert saved_record_timestamp.tzinfo is not None

    assert product_timestamp.utcoffset() == timezone.utc.utcoffset(product_timestamp)
    assert saved_record_timestamp.utcoffset() == timezone.utc.utcoffset(saved_record_timestamp)
