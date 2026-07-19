from __future__ import annotations

from typing import Literal

SceneRole = Literal["hook", "body", "cta"]
PromptDomain = Literal["social", "commerce", "saas", "industrial", "finance", "general"]

SCENE_MUSIC_OPTIONS: tuple[str, ...] = (
    "none",
    "ambient",
    "cinematic",
    "corporate",
    "energetic",
)

SCENE_CAMERA_OPTIONS: tuple[str, ...] = ("static", "close-up", "medium", "wide")

SCENE_TRANSITION_OPTIONS: tuple[str, ...] = ("cut", "fade", "wipe", "slide")

SCENE_CAPTION_STYLE_OPTIONS: tuple[str, ...] = ("default", "bold", "highlight", "minimal")

SCENE_VOICE_PRESET_OPTIONS: tuple[str, ...] = (
    "default",
    "energetic",
    "sales",
    "professional",
    "technical",
    "motivational",
)

SCENE_DEFAULTS: dict[str, str] = {
    "music": SCENE_MUSIC_OPTIONS[0],
    "camera": SCENE_CAMERA_OPTIONS[0],
    "transition": SCENE_TRANSITION_OPTIONS[0],
    "caption_style": SCENE_CAPTION_STYLE_OPTIONS[0],
    "voice": SCENE_VOICE_PRESET_OPTIONS[0],
}

SCENE_DOMAIN_DETECTION_ORDER: tuple[PromptDomain, ...] = (
    "social",
    "commerce",
    "saas",
    "industrial",
    "finance",
)

SCENE_DOMAIN_KEYWORDS: dict[PromptDomain, tuple[str, ...]] = {
    "social": ("tiktok", "reel", "short", "youtube short", "instagram"),
    "commerce": ("shop", "commerce", "ecommerce", "checkout", "catalog"),
    "saas": ("crm", "saas", "product", "demo", "onboarding"),
    "industrial": ("engineering", "factory", "maintenance", "industrial"),
    "finance": ("finance", "accounting", "invoice", "vat", "tax"),
    "general": (),
}

SCENE_ROLE_DURATION_SECONDS: dict[PromptDomain, dict[SceneRole, int]] = {
    "social": {"hook": 5, "body": 10, "cta": 5},
    "commerce": {"hook": 6, "body": 14, "cta": 6},
    "saas": {"hook": 6, "body": 16, "cta": 6},
    "industrial": {"hook": 7, "body": 16, "cta": 6},
    "finance": {"hook": 7, "body": 15, "cta": 6},
    "general": {"hook": 6, "body": 16, "cta": 6},
}
