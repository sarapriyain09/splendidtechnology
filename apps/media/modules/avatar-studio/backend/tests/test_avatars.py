from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_list_avatars_returns_expected_shape() -> None:
    response = client.get("/api/avatars")

    assert response.status_code == 200
    payload = response.json()
    assert "avatars" in payload
    assert isinstance(payload["avatars"], list)
    assert payload["avatars"], "Expected at least one seeded avatar"

    first_avatar = payload["avatars"][0]
    assert {"id", "name", "language", "style", "cloneStatus", "imageUrl"}.issubset(first_avatar.keys())


def test_avatar_duplicate_update_and_delete() -> None:
    list_response = client.get("/api/avatars")
    assert list_response.status_code == 200
    original = list_response.json()["avatars"][0]

    duplicate_response = client.post(f"/api/avatars/{original['id']}/duplicate")
    assert duplicate_response.status_code == 200
    duplicate_payload = duplicate_response.json()["avatar"]
    assert duplicate_payload["name"].endswith("(Copy)")

    update_response = client.patch(
        f"/api/avatars/{duplicate_payload['id']}",
        json={"name": "Edited Avatar", "style": "Narration"},
    )
    assert update_response.status_code == 200
    updated_payload = update_response.json()["avatar"]
    assert updated_payload["name"] == "Edited Avatar"
    assert updated_payload["style"] == "Narration"

    delete_response = client.delete(f"/api/avatars/{duplicate_payload['id']}")
    assert delete_response.status_code == 200
    assert delete_response.json()["status"] == "deleted"
