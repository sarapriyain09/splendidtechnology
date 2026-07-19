from fastapi.testclient import TestClient

from app.main import app
from app.routers import chat


client = TestClient(app)


def test_chat_prompt_returns_playable_video_url(monkeypatch) -> None:
    async def fake_run_prompt(self, db, user_id: str, prompt: str, avatar_id: str | None) -> dict:
        return {
            "prompt": prompt,
            "project": {"id": "project-test", "name": "AI Generated Project"},
            "scene": {"id": "scene-test", "title": "Generated Video Script"},
            "script": {
                "title": "Generated Video Script",
                "script": "Draft script",
                "hook": "Hook",
                "cta": "CTA",
            },
            "video": {
                "provider": "heygen",
                "status": "completed",
                "videoJobId": "job-test",
                "avatarId": avatar_id or "default",
                "videoUrl": "https://example.test/render.mp4",
            },
        }

    monkeypatch.setattr(chat.AIOrchestrator, "run_prompt", fake_run_prompt)

    response = client.post(
        "/api/chat/prompt",
        json={
            "prompt": "Create a short product intro video for Velynxia",
            "avatar_id": "ava_1",
        },
    )

    assert response.status_code == 200
    payload = response.json()

    assert "video" in payload
    assert payload["video"]["status"].lower() == "completed"
    assert payload["video"].get("videoUrl")
