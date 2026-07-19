import asyncio

from app.services.scene_planner import ScenePlanner


class _FakeAIProvider:
    def __init__(self, scene_plan: dict) -> None:
        self._scene_plan = scene_plan

    async def generate_scene_plan(self, prompt: str, script: dict) -> dict:
        return self._scene_plan


def test_role_aware_fallback_defaults_for_raw_provider_scenes() -> None:
    planner = ScenePlanner()
    provider = _FakeAIProvider(
        {
            "scenes": [
                {"title": "Hook", "narration": "Problem statement."},
                {"title": "Main Message", "narration": "How it works."},
                {"title": "Call To Action", "narration": "Book a demo."},
            ]
        }
    )
    script = {
        "title": "Workflow Demo",
        "hook": "Problem statement.",
        "script": "How it works.",
        "cta": "Book a demo.",
    }

    result = asyncio.run(planner.plan(provider, "Create an internal explainer", script, "default"))
    scenes = result["scenes"]

    assert len(scenes) == 3
    assert scenes[0]["background"] == "studio"
    assert scenes[0]["camera"] == "close-up"
    assert scenes[0]["transition"] == "cut"

    assert scenes[1]["background"] == "office"
    assert scenes[1]["camera"] == "medium"
    assert scenes[1]["transition"] == "fade"

    assert scenes[2]["background"] == "brand"
    assert scenes[2]["camera"] == "close-up"
    assert scenes[2]["transition"] == "wipe"
    assert scenes[2]["assets"] == ["brand-logo.png"]


def test_social_prompt_keeps_social_background_and_cta_logo_asset() -> None:
    planner = ScenePlanner()
    provider = _FakeAIProvider(
        {
            "scenes": [
                {"title": "Opening", "narration": "Fast hook."},
                {"title": "Benefits", "narration": "Show key value."},
                {"title": "Final CTA", "narration": "Try now."},
            ]
        }
    )
    script = {
        "title": "Social Clip",
        "hook": "Fast hook.",
        "script": "Show key value.",
        "cta": "Try now.",
    }

    result = asyncio.run(
        planner.plan(provider, "Make a TikTok product short for CRM demo", script, "default")
    )
    scenes = result["scenes"]

    assert len(scenes) == 3
    assert all(scene["background"] == "social" for scene in scenes)
    assert all("captions-template-vertical.json" in scene["assets"] for scene in scenes)
    assert all(scene["voice"] == "energetic" for scene in scenes)
    assert scenes[0]["durationSeconds"] == 5
    assert scenes[1]["durationSeconds"] == 10
    assert scenes[2]["durationSeconds"] == 5
    assert "brand-logo.png" not in scenes[0]["assets"]
    assert "brand-logo.png" in scenes[2]["assets"]


def test_commerce_prompt_applies_domain_backgrounds_and_assets() -> None:
    planner = ScenePlanner()
    provider = _FakeAIProvider(
        {
            "scenes": [
                {"title": "Opening", "narration": "New collection launch."},
                {"title": "Product Details", "narration": "Compare key features."},
                {"title": "Checkout CTA", "narration": "Buy now with free shipping."},
            ]
        }
    )
    script = {
        "title": "Commerce Launch",
        "hook": "New collection launch.",
        "script": "Compare key features.",
        "cta": "Buy now with free shipping.",
    }

    result = asyncio.run(planner.plan(provider, "Create ecommerce product launch demo with checkout", script, "default"))
    scenes = result["scenes"]

    assert len(scenes) == 3
    assert scenes[0]["background"] == "showroom"
    assert scenes[1]["background"] == "product-table"
    assert scenes[2]["background"] == "brand"
    assert scenes[0]["durationSeconds"] == 6
    assert scenes[1]["durationSeconds"] == 14
    assert scenes[2]["durationSeconds"] == 6
    assert all(scene["voice"] == "sales" for scene in scenes)
    assert "product-grid.png" in scenes[1]["assets"]
    assert "checkout-flow.png" in scenes[2]["assets"]
    assert "brand-logo.png" in scenes[2]["assets"]


def test_finance_prompt_applies_corporate_background_and_assets() -> None:
    planner = ScenePlanner()
    provider = _FakeAIProvider(
        {
            "scenes": [
                {"title": "Quarterly Overview", "narration": "Revenue and VAT summary."},
            ]
        }
    )
    script = {
        "title": "Finance Update",
        "hook": "Revenue and VAT summary.",
        "script": "Revenue and VAT summary.",
        "cta": "Review the full report.",
    }

    result = asyncio.run(planner.plan(provider, "Prepare accounting finance invoice VAT update", script, "default"))
    scenes = result["scenes"]

    assert len(scenes) >= 1
    assert scenes[0]["background"] == "corporate"
    assert scenes[0]["voice"] == "professional"
    assert "revenue-chart.png" in scenes[0]["assets"]
    assert "invoice-preview.png" in scenes[0]["assets"]
