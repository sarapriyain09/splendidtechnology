import pytest
from httpx import ASGITransport, AsyncClient

from app.core.config import get_settings
from app.main import app


@pytest.fixture
def jwt_mode(monkeypatch: pytest.MonkeyPatch):
    monkeypatch.setenv("AUTH_MODE", "jwt")
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-key")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.mark.anyio
async def test_login_success_returns_bearer_token() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "owner@velynxia.local", "password": "StrongPass123!"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["tokens"]["access_token"]
    assert payload["tokens"]["token_type"] == "bearer"
    assert payload["user"]["role"] == "owner"


@pytest.mark.anyio
async def test_login_rejects_invalid_credentials() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/auth/login",
            json={"email": "owner@velynxia.local", "password": "wrong-password"},
        )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_jwt_mode_requires_bearer_for_protected_endpoint(jwt_mode) -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reviews/analyze",
            headers={
                "X-Tenant-Id": "tenant-1",
                "X-User-Id": "user-owner-1",
                "X-User-Role": "owner",
                "X-Request-Source": "product-studio",
            },
            json={"product_name": "desk stand", "one_star": [], "two_star": [], "three_star": []},
        )

    assert response.status_code == 401


@pytest.mark.anyio
async def test_jwt_mode_allows_matching_claims(jwt_mode) -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_response = await client.post(
            "/api/v1/auth/login",
            json={"email": "owner@velynxia.local", "password": "StrongPass123!"},
        )
        assert login_response.status_code == 200
        token = login_response.json()["tokens"]["access_token"]

        response = await client.post(
            "/api/v1/reviews/analyze",
            headers={
                "Authorization": f"Bearer {token}",
                "X-Tenant-Id": "tenant-1",
                "X-User-Id": "user-owner-1",
                "X-User-Role": "owner",
                "X-Request-Source": "product-studio",
            },
            json={"product_name": "desk stand", "one_star": [], "two_star": [], "three_star": []},
        )

    assert response.status_code == 200
    payload = response.json()
    assert "top_pain_points" in payload


@pytest.mark.anyio
async def test_jwt_mode_rejects_claim_header_mismatch(jwt_mode) -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        login_response = await client.post(
            "/api/v1/auth/login",
            json={"email": "owner@velynxia.local", "password": "StrongPass123!"},
        )
        assert login_response.status_code == 200
        token = login_response.json()["tokens"]["access_token"]

        response = await client.post(
            "/api/v1/reviews/analyze",
            headers={
                "Authorization": f"Bearer {token}",
                "X-Tenant-Id": "tenant-1",
                "X-User-Id": "different-user",
                "X-User-Role": "owner",
                "X-Request-Source": "product-studio",
            },
            json={"product_name": "desk stand", "one_star": [], "two_star": [], "three_star": []},
        )

    assert response.status_code == 403