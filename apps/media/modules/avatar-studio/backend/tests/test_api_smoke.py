from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_api_smoke_core_routes() -> None:
    health_response = client.get("/api/health")
    assert health_response.status_code == 200
    assert health_response.json() == {"status": "ok"}

    avatars_response = client.get("/api/avatars")
    assert avatars_response.status_code == 200
    avatars_payload = avatars_response.json()
    assert "avatars" in avatars_payload
    assert isinstance(avatars_payload["avatars"], list)

    projects_response = client.get("/api/projects")
    assert projects_response.status_code == 200
    projects_payload = projects_response.json()
    assert "projects" in projects_payload
    assert isinstance(projects_payload["projects"], list)
