from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_project_then_list_projects() -> None:
    project_name = f"Test Project {uuid4().hex[:8]}"
    prompt = "Generate a short onboarding explainer"

    create_response = client.post(
        "/api/projects",
        json={
            "name": project_name,
            "prompt": prompt,
        },
    )

    assert create_response.status_code == 200
    created = create_response.json()
    assert created["id"]
    assert created["name"] == project_name
    assert created["status"] == "DRAFT"

    list_response = client.get("/api/projects")

    assert list_response.status_code == 200
    projects_payload = list_response.json()
    assert "projects" in projects_payload
    assert isinstance(projects_payload["projects"], list)

    created_project = next((item for item in projects_payload["projects"] if item["id"] == created["id"]), None)
    assert created_project is not None
    assert created_project["name"] == project_name
    assert created_project["prompt"] == prompt
    assert created_project["status"] == "DRAFT"


def test_create_project_rejects_short_name() -> None:
    response = client.post(
        "/api/projects",
        json={
            "name": "A",
            "prompt": "too short name should fail",
        },
    )

    assert response.status_code == 422
