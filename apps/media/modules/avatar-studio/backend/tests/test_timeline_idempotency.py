from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.routers import timeline
from app.services import orchestrator as orchestrator_module
from app.services.render_service import RenderService


client = TestClient(app)


def _create_project_with_scene() -> str:
    project_response = client.post(
        "/api/projects",
        json={
            "name": f"Render Project {uuid4().hex[:6]}",
            "prompt": "Render idempotency check",
        },
    )
    assert project_response.status_code == 200
    project_id = project_response.json()["id"]

    scene_response = client.post(
        f"/api/timeline/{project_id}/scenes",
        json={
            "title": "Scene 1",
            "narration": "This is a deterministic test script.",
            "duration_seconds": 8,
            "background": "office",
            "image_url": "",
            "voice_audio_url": "",
            "music": "none",
        },
    )
    assert scene_response.status_code == 200

    return project_id


def test_render_with_same_idempotency_key_replays_existing_result(monkeypatch) -> None:
    call_counter = {"count": 0}
    captured_render_plan: dict[str, object] = {}

    class _FakeAvatarProvider:
        async def generate_video(
            self,
            script: str,
            avatar_id: str,
            render_plan: list[dict] | None = None,
        ) -> dict[str, object]:
            call_counter["count"] += 1
            captured_render_plan["value"] = render_plan or []
            return {
                "provider": "heygen",
                "status": "completed",
                "videoJobId": f"job-{call_counter['count']}",
                "videoUrl": f"https://example.test/video-{call_counter['count']}.mp4",
                "renderExecution": {
                    "attemptCount": 1,
                    "fallbackUsed": False,
                    "durationMs": 42,
                },
            }

    def fake_orchestrator_init(self) -> None:
        self.ai_provider = None
        self.voice_provider = None
        self.scene_planner = None
        self.avatar_provider = _FakeAvatarProvider()
        self.render_service = RenderService(self.avatar_provider)

    monkeypatch.setattr(timeline.AIOrchestrator, "__init__", fake_orchestrator_init)

    project_id = _create_project_with_scene()
    idempotency_key = f"render-{uuid4().hex}"

    first_response = client.post(
        f"/api/timeline/{project_id}/render",
        json={
            "avatar_id": "avatar-demo",
            "idempotency_key": idempotency_key,
        },
    )
    assert first_response.status_code == 200
    first_payload = first_response.json()
    assert first_payload["replayed"] is False
    assert first_payload["idempotencyKey"]
    assert first_payload.get("jobId") is not None
    assert isinstance(first_payload.get("stage"), str)
    assert first_payload["stage"] in {"queued", "preparing", "rendering", "persisting", "completed", "failed"}
    assert isinstance(first_payload.get("progressPercent"), int)

    second_response = client.post(
        f"/api/timeline/{project_id}/render",
        json={
            "avatar_id": "avatar-demo",
            "idempotency_key": idempotency_key,
        },
    )
    assert second_response.status_code == 200
    second_payload = second_response.json()

    assert call_counter["count"] == 1
    assert second_payload["idempotencyKey"] == first_payload["idempotencyKey"]

    job_id = second_payload.get("jobId") or first_payload.get("jobId")
    if job_id:
        status_response = client.get(f"/api/timeline/{project_id}/render/{job_id}")
        assert status_response.status_code == 200
        status_payload = status_response.json()
        assert status_payload["status"] in {"QUEUED", "PROCESSING", "COMPLETED", "FAILED"}
        assert status_payload["idempotencyKey"] == first_payload["idempotencyKey"]
        assert isinstance(status_payload.get("stage"), str)
        stage_progress = {
            "queued": 10,
            "preparing": 25,
            "rendering": 70,
            "persisting": 90,
            "completed": 100,
            "failed": 100,
        }
        if status_payload.get("stage") in stage_progress:
            assert status_payload.get("progressPercent") == stage_progress[str(status_payload.get("stage"))]
        if status_payload["status"] == "FAILED":
            assert isinstance(status_payload.get("error"), str)
        if "video" in status_payload:
            execution = status_payload["video"].get("renderExecution")
            assert isinstance(execution, dict)
            assert execution.get("attemptCount") == 1
            assert execution.get("fallbackUsed") is False

    if second_payload.get("replayed"):
        assert "video" in second_payload

    render_plan = captured_render_plan.get("value")
    assert isinstance(render_plan, list)
    assert len(render_plan) == 1
    first_scene = render_plan[0]
    assert first_scene.get("camera") == "static"
    assert first_scene.get("transition") == "cut"


def test_queued_render_stage_sequence_is_deterministic(monkeypatch) -> None:
    stage_events: list[str] = []
    original_persist = orchestrator_module._persist_render_job_meta

    class _FakeAvatarProvider:
        async def generate_video(
            self,
            script: str,
            avatar_id: str,
            render_plan: list[dict] | None = None,
        ) -> dict[str, object]:
            return {
                "provider": "heygen",
                "status": "completed",
                "videoJobId": "job-sequence",
                "videoUrl": "https://example.test/video-sequence.mp4",
                "renderExecution": {
                    "attemptCount": 1,
                    "fallbackUsed": False,
                    "durationMs": 55,
                },
            }

    def fake_orchestrator_init(self) -> None:
        self.ai_provider = None
        self.voice_provider = None
        self.scene_planner = None
        self.avatar_provider = _FakeAvatarProvider()
        self.render_service = RenderService(self.avatar_provider)

    def persist_spy(project_id: str, job_id: str, payload: dict[str, object]) -> None:
        stage = payload.get("stage")
        if isinstance(stage, str) and stage:
            stage_events.append(stage)
        original_persist(project_id, job_id, payload)

    monkeypatch.setattr(timeline.AIOrchestrator, "__init__", fake_orchestrator_init)
    monkeypatch.setattr(orchestrator_module, "_persist_render_job_meta", persist_spy)

    project_id = _create_project_with_scene()
    idempotency_key = f"stage-seq-{uuid4().hex}"

    response = client.post(
        f"/api/timeline/{project_id}/render",
        json={
            "avatar_id": "avatar-demo",
            "idempotency_key": idempotency_key,
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload.get("jobId")

    expected_sequence = ["queued", "preparing", "rendering", "persisting", "completed"]
    assert stage_events[: len(expected_sequence)] == expected_sequence

    status_response = client.get(f"/api/timeline/{project_id}/render/{payload['jobId']}")
    assert status_response.status_code == 200
    status_payload = status_response.json()
    assert status_payload.get("stage") == "completed"
    assert status_payload.get("progressPercent") == 100


def test_queued_render_failure_stage_sequence_is_deterministic(monkeypatch) -> None:
    stage_events: list[str] = []
    original_persist = orchestrator_module._persist_render_job_meta

    class _FailingAvatarProvider:
        async def generate_video(
            self,
            script: str,
            avatar_id: str,
            render_plan: list[dict] | None = None,
        ) -> dict[str, object]:
            raise RuntimeError("simulated-render-failure")

    def fake_orchestrator_init(self) -> None:
        self.ai_provider = None
        self.voice_provider = None
        self.scene_planner = None
        self.avatar_provider = _FailingAvatarProvider()
        self.render_service = RenderService(self.avatar_provider)

    def persist_spy(project_id: str, job_id: str, payload: dict[str, object]) -> None:
        stage = payload.get("stage")
        if isinstance(stage, str) and stage:
            stage_events.append(stage)
        original_persist(project_id, job_id, payload)

    monkeypatch.setattr(timeline.AIOrchestrator, "__init__", fake_orchestrator_init)
    monkeypatch.setattr(orchestrator_module, "_persist_render_job_meta", persist_spy)

    project_id = _create_project_with_scene()
    idempotency_key = f"stage-fail-seq-{uuid4().hex}"

    response = client.post(
        f"/api/timeline/{project_id}/render",
        json={
            "avatar_id": "avatar-demo",
            "idempotency_key": idempotency_key,
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload.get("jobId")

    expected_sequence = ["queued", "preparing", "rendering", "failed"]
    assert stage_events[: len(expected_sequence)] == expected_sequence

    status_response = client.get(f"/api/timeline/{project_id}/render/{payload['jobId']}")
    assert status_response.status_code == 200
    status_payload = status_response.json()
    assert status_payload.get("status") == "FAILED"
    assert status_payload.get("stage") == "failed"
    assert status_payload.get("progressPercent") == 100
    assert isinstance(status_payload.get("error"), str)
