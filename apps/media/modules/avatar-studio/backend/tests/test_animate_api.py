from fastapi.testclient import TestClient

from app.avatar_engine.models import RenderJobRecord, RenderJobStatus
from app.avatar_engine.provider import ProviderUnavailableError
from app.main import app
from app.routers import animate


client = TestClient(app)


def test_animate_submits_job(monkeypatch) -> None:
    class FakeEngine:
        def submit(self, request):
            return RenderJobRecord(
                job_id="job_test_123",
                status=RenderJobStatus.PENDING,
                provider="musetalk",
            )

        def get_job(self, job_id: str):
            return None

    monkeypatch.setattr(animate, "get_avatar_engine", lambda: FakeEngine())

    response = client.post(
        "/api/animate",
        json={
            "portrait_path": "D:/tmp/portrait.png",
            "audio_path": "D:/tmp/audio.wav",
            "options": {"background": "studio", "captions": False, "resolution": "1080p", "aspect_ratio": "16:9"},
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["job_id"] == "job_test_123"
    assert payload["status"] == "Pending"


def test_animate_returns_503_when_provider_unavailable(monkeypatch) -> None:
    class FakeEngine:
        def submit(self, request):
            raise ProviderUnavailableError("Neural animation provider unavailable.")

        def get_job(self, job_id: str):
            return None

    monkeypatch.setattr(animate, "get_avatar_engine", lambda: FakeEngine())

    response = client.post(
        "/api/animate",
        json={
            "portrait_path": "D:/tmp/portrait.png",
            "audio_path": "D:/tmp/audio.wav",
            "options": {"background": "studio", "captions": False, "resolution": "1080p", "aspect_ratio": "16:9"},
        },
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Neural animation provider unavailable."


def test_get_job_returns_status(monkeypatch) -> None:
    class FakeEngine:
        def submit(self, request):
            raise AssertionError("not used")

        def get_job(self, job_id: str):
            return RenderJobRecord(
                job_id=job_id,
                status=RenderJobStatus.COMPLETED,
                provider="musetalk",
                video_url="https://example.test/video.mp4",
            )

    monkeypatch.setattr(animate, "get_avatar_engine", lambda: FakeEngine())

    response = client.get("/api/animate/jobs/job_test_789")

    assert response.status_code == 200
    payload = response.json()
    assert payload["job_id"] == "job_test_789"
    assert payload["status"] == "Completed"
    assert payload["done"] is True
