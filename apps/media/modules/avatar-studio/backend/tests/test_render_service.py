import asyncio

from app.services.render_service import RenderService


class _FakeAvatarProvider:
    def __init__(self) -> None:
        self.calls: list[dict] = []

    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        self.calls.append(
            {
                "script": script,
                "avatar_id": avatar_id,
                "render_plan": render_plan or [],
            }
        )
        return {
            "provider": "fake",
            "status": "completed",
            "videoUrl": "https://example.test/video.mp4",
        }


class _Project:
    def __init__(self) -> None:
        self.status = "DRAFT"


class _SceneSettings:
    def __init__(self) -> None:
        self.camera = "close-up"
        self.transition = "fade"
        self.caption_style = "bold"
        self.voice = "female"
        self.assets_json = '["logo.png", " broll.mp4 "]'


class _Scene:
    def __init__(self) -> None:
        self.title = "S1"
        self.narration = "Hello"
        self.duration_seconds = 8
        self.background = "office"
        self.music = "none"
        self.settings = _SceneSettings()


def test_build_output_basename_is_stable_and_sanitized() -> None:
    service = RenderService(_FakeAvatarProvider())
    basename = service.build_output_basename(
        project_id="a3f9f1a8-31f8-46b6-9b37-a9dca6f8f004",
        idempotency_token="token:abc/123?bad",
    )
    assert basename.startswith("render_a3f9f1a8-31f")
    assert "?" not in basename
    assert ":" not in basename
    assert "/" not in basename


def test_attach_output_basename_adds_metadata_to_each_scene() -> None:
    service = RenderService(_FakeAvatarProvider())
    scenes = [{"title": "one"}, {"title": "two"}]

    enriched = service.attach_output_basename(
        render_plan=scenes,
        project_id="project-123",
        idempotency_token="idem-456",
    )

    assert len(enriched) == 2
    expected = service.build_output_basename("project-123", "idem-456")
    assert all(scene.get("__renderOutputBasename") == expected for scene in enriched)


def test_generate_video_passes_deterministic_basename_metadata() -> None:
    provider = _FakeAvatarProvider()
    service = RenderService(provider)

    asyncio.run(
        service.generate_video(
            combined_script="script",
            selected_avatar_id="avatar-1",
            render_plan=[{"title": "Scene 1"}],
            project_id="project-123",
            idempotency_token="idem-456",
        )
    )

    assert len(provider.calls) == 1
    call = provider.calls[0]
    assert call["script"] == "script"
    assert call["avatar_id"] == "avatar-1"
    assert call["render_plan"][0].get("__renderOutputBasename") == service.build_output_basename(
        "project-123", "idem-456"
    )


def test_apply_project_status_transitions() -> None:
    service = RenderService(_FakeAvatarProvider())
    project = _Project()

    service.apply_project_status(project, "COMPLETED", True)
    assert project.status == "COMPLETED"

    service.apply_project_status(project, "PROCESSING", False)
    assert project.status == "RENDERING"

    service.apply_project_status(project, "FAILED", False)
    assert project.status == "FAILED"


def test_build_render_plan_from_scenes_maps_metadata() -> None:
    from app.services.render_service import build_render_plan_from_scenes

    plan = build_render_plan_from_scenes([_Scene()])
    assert len(plan) == 1
    scene = plan[0]
    assert scene["camera"] == "close-up"
    assert scene["transition"] == "fade"
    assert scene["captionStyle"] == "bold"
    assert scene["voice"] == "female"
    assert scene["assets"] == ["logo.png", "broll.mp4"]
