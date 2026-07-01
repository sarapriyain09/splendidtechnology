import pytest
from httpx import ASGITransport, AsyncClient

from app.db.session import init_db
from app.main import app


REQUIRED_HEADERS = {
    "X-Tenant-Id": "tenant-1",
    "X-User-Id": "user-1",
    "X-User-Role": "owner",
    "X-Request-Source": "commerce-platform",
}


@pytest.mark.anyio
async def test_mission_run_to_approval_and_product_creation() -> None:
    init_db()

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        create_response = await client.post(
            "/api/v1/missions",
            headers=REQUIRED_HEADERS,
            json={
                "mission_text": "Find premium monitor stands for UK market",
                "quick_mission": "Find Product Opportunities",
            },
        )
        assert create_response.status_code == 200
        mission_id = create_response.json()["id"]

        run_response = await client.post(f"/api/v1/missions/{mission_id}/run", headers=REQUIRED_HEADERS)
        assert run_response.status_code == 200
        assert run_response.json()["status"] == "running"

        # Force mission into approval-ready state for deterministic test.
        from app.db.models import ProductMission
        from app.db.session import SessionLocal

        db = SessionLocal()
        try:
            row = db.query(ProductMission).filter(ProductMission.id == mission_id).first()
            assert row is not None
            row.status = "pending_approval"
            row.current_stage_index = 5
            row.recommended_product_name = "Executive Monitor Stand"
            row.recommended_sku = "VPL-TEST-001"
            row.opportunity_score = 90.0
            db.commit()
        finally:
            db.close()

        approve_response = await client.post(
            f"/api/v1/missions/{mission_id}/approve",
            headers=REQUIRED_HEADERS,
            json={"status": "idea"},
        )
        assert approve_response.status_code == 200
        approved_payload = approve_response.json()
        assert approved_payload["status"] == "approved"
        assert approved_payload["created_product_id"] is not None

        products_response = await client.get("/api/v1/products", headers=REQUIRED_HEADERS)
        assert products_response.status_code == 200
        assert any(item["id"] == approved_payload["created_product_id"] for item in products_response.json())
