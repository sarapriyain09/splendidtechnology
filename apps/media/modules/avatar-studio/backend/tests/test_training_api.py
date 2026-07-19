from fastapi.testclient import TestClient

from app.main import app
from app.routers import training as training_router


client = TestClient(app)


def test_training_start_auto_enqueues_job(monkeypatch) -> None:
    captured: dict[str, str] = {}

    def fake_enqueue(training_id: str) -> None:
        captured["training_id"] = training_id

    monkeypatch.setattr(training_router, "enqueue_training_job", fake_enqueue)

    response = client.post(
        "/api/training/start",
        json={
            "avatar_name": "Training API Test Avatar",
            "mode": "clone",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "ENQUEUED"
    assert payload["jobId"]
    assert payload["avatarName"] == "Training API Test Avatar"
    assert captured.get("training_id") == payload["jobId"]


def test_enqueue_training_skips_duplicate_for_running_job(monkeypatch) -> None:
    start_response = client.post(
        "/api/training/start",
        json={
            "avatar_name": "Training Dedup Avatar",
            "mode": "clone",
        },
    )
    assert start_response.status_code == 200
    training_id = start_response.json()["jobId"]

    progress_response = client.post(
        f"/api/training/{training_id}/progress",
        json={
            "stage": "TRAINING",
            "progress": 55,
            "status": "RUNNING",
        },
    )
    assert progress_response.status_code == 200

    enqueue_calls = {"count": 0}

    def fake_enqueue(_: str) -> None:
        enqueue_calls["count"] += 1

    monkeypatch.setattr(training_router, "enqueue_training_job", fake_enqueue)

    enqueue_response = client.post(f"/api/training/{training_id}/enqueue")
    assert enqueue_response.status_code == 200
    payload = enqueue_response.json()
    assert payload["trainingId"] == training_id
    assert payload["status"] == "RUNNING"
    assert enqueue_calls["count"] == 0
