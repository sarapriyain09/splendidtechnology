from pathlib import Path

from app.providers.avatar_animation.neural_http_provider import NeuralHttpAvatarAnimationProvider


def test_neural_http_provider_contract_payload_and_response(monkeypatch) -> None:
    captured: dict[str, object] = {}

    class FakeResponse:
        status_code = 200
        content = b"1"

        @staticmethod
        def raise_for_status() -> None:
            return None

        @staticmethod
        def json() -> dict[str, object]:
            return {
                "status": "completed",
                "videoUrl": "https://neural.example/render.mp4",
                "videoJobId": "job-123",
                "meta": {"engine": "musetalk"},
            }

    class FakeClient:
        def __init__(self, *args, **kwargs) -> None:
            return None

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb) -> None:
            return None

        def post(self, url: str, json: dict[str, object]):
            captured["url"] = url
            captured["json"] = json
            return FakeResponse()

        def get(self, url: str):
            captured["health_url"] = url
            return FakeResponse()

    monkeypatch.setattr("app.providers.avatar_animation.neural_http_provider.httpx.Client", FakeClient)

    provider = NeuralHttpAvatarAnimationProvider(
        endpoint="http://127.0.0.1:9090/api/animate",
        backend="musetalk",
        health_url="http://127.0.0.1:9090/health",
    )

    ready, reason = provider.is_ready()
    assert ready is True
    assert reason == "healthy"

    result = provider.generate_video(
        script="Test script",
        avatar_id="avatar-123",
        portrait_path=Path("D:/tmp/portrait.png"),
        audio_wav_path=Path("D:/tmp/audio.wav"),
        render_plan=[{"camera": "close-up"}],
    )

    assert captured["url"] == "http://127.0.0.1:9090/api/animate"
    payload = captured["json"]
    assert payload["backend"] == "musetalk"
    assert payload["avatarId"] == "avatar-123"
    assert str(payload["portraitSource"]).replace("\\", "/") == "D:/tmp/portrait.png"
    assert str(payload["audioSource"]).replace("\\", "/") == "D:/tmp/audio.wav"
    options = payload["options"]
    assert options["syncMode"] == "audio-driven"
    assert options["qualityProfile"] == "natural-face-v1"
    assert options["stabilizeNeck"] is True
    assert isinstance(options["headMotionScale"], float)
    assert isinstance(options["expressionIntensity"], float)

    assert result["status"] == "completed"
    assert result["videoUrl"] == "https://neural.example/render.mp4"
    assert result["animationMode"] == "neural-http"
    assert result["contractVersion"] == "v1"
