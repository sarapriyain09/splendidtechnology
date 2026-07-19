from __future__ import annotations

from app.providers.base import AIProvider
from app.services.scene_planner_config import (
    SCENE_DEFAULTS,
    SCENE_DOMAIN_DETECTION_ORDER,
    SCENE_DOMAIN_KEYWORDS,
    SCENE_ROLE_DURATION_SECONDS,
)


class ScenePlanner:
    def _infer_prompt_domain(self, prompt: str) -> str:
        p = prompt.lower()
        for domain in SCENE_DOMAIN_DETECTION_ORDER:
            if any(token in p for token in SCENE_DOMAIN_KEYWORDS[domain]):
                return domain
        return "general"

    def _infer_scene_role(self, item: dict, index: int, total: int) -> str:
        explicit_role = str(item.get("role") or "").strip().lower()
        if explicit_role in {"hook", "body", "cta"}:
            return explicit_role

        title = str(item.get("title") or "").strip().lower()
        if any(token in title for token in ["hook", "intro", "introduction", "opening"]):
            return "hook"
        if any(token in title for token in ["cta", "call to action", "outro", "closing", "final"]):
            return "cta"

        if total > 1 and index == 0:
            return "hook"
        if total > 1 and index == total - 1:
            return "cta"
        return "body"

    def _default_camera_for_role(self, scene_role: str) -> str:
        if scene_role == "hook":
            return "close-up"
        if scene_role == "cta":
            return "close-up"
        return "medium"

    def _default_transition_for_role(self, scene_role: str) -> str:
        if scene_role == "hook":
            return "cut"
        if scene_role == "cta":
            return "wipe"
        return "fade"

    def _infer_duration_seconds(self, prompt: str, scene_role: str) -> int:
        domain = self._infer_prompt_domain(prompt)
        role = scene_role if scene_role in {"hook", "body", "cta"} else "body"
        return SCENE_ROLE_DURATION_SECONDS.get(domain, SCENE_ROLE_DURATION_SECONDS["general"])[role]

    def _infer_voice_preset(self, prompt: str, scene_role: str) -> str:
        domain = self._infer_prompt_domain(prompt)
        if domain == "social":
            return "energetic"
        if domain == "finance":
            return "professional"
        if domain == "industrial":
            return "technical"
        if domain == "commerce":
            return "sales"
        if scene_role == "cta":
            return "motivational"
        return "default"

    def _normalize_assets(self, assets: list[str]) -> list[str]:
        unique_assets: list[str] = []
        for raw in assets:
            item = str(raw).strip()
            if not item or item in unique_assets:
                continue
            unique_assets.append(item)
        return unique_assets

    def _infer_background(self, prompt: str, scene_role: str) -> str:
        domain = self._infer_prompt_domain(prompt)
        if domain == "social":
            return "social"
        if domain == "saas":
            return "office"
        if domain == "industrial":
            return "industrial"
        if domain == "finance":
            return "corporate"
        if domain == "commerce":
            if scene_role == "hook":
                return "showroom"
            if scene_role == "cta":
                return "brand"
            return "product-table"
        if scene_role == "hook":
            return "studio"
        if scene_role == "cta":
            return "brand"
        return "office"

    def _infer_assets(self, prompt: str, scene_role: str) -> list[str]:
        p = prompt.lower()
        domain = self._infer_prompt_domain(prompt)
        assets: list[str] = []

        if "crm" in p:
            assets.extend(["dashboard.png", "pipeline-chart.png"])
        if "product" in p or "demo" in p:
            assets.append("product-shot.png")
        if "maintenance" in p:
            assets.append("sensor-graph.png")
        if "short" in p or "reel" in p or "tiktok" in p:
            assets.append("captions-template-vertical.json")
        if domain == "commerce":
            assets.extend(["product-grid.png", "checkout-flow.png"])
        if domain == "finance":
            assets.extend(["revenue-chart.png", "invoice-preview.png"])
        if scene_role == "cta":
            assets.append("brand-logo.png")

        return self._normalize_assets(assets)

    def _infer_caption_style(self, prompt: str, scene_role: str) -> str:
        domain = self._infer_prompt_domain(prompt)
        if domain == "social":
            return "bold"
        if scene_role == "cta":
            return "highlight"
        return "default"

    async def plan(
        self,
        ai_provider: AIProvider,
        prompt: str,
        script: dict,
        avatar_id: str,
    ) -> dict:
        raw_plan = await ai_provider.generate_scene_plan(prompt, script)
        raw_scenes = raw_plan.get("scenes") if isinstance(raw_plan, dict) else None

        hook_text = str(script.get("hook") or "").strip()
        body_text = str(script.get("script") or "").strip()
        cta_text = str(script.get("cta") or "").strip()

        # Deterministic baseline segmentation for PR2: hook -> body -> CTA.
        default_segments: list[dict] = []
        if hook_text:
            default_segments.append(
                {
                    "title": "Hook",
                    "narration": hook_text,
                    "durationSeconds": self._infer_duration_seconds(prompt, "hook"),
                    "background": self._infer_background(prompt, "hook"),
                    "transition": "cut",
                    "camera": "close-up",
                    "voice": self._infer_voice_preset(prompt, "hook"),
                    "captionStyle": self._infer_caption_style(prompt, "hook"),
                    "assets": self._infer_assets(prompt, "hook"),
                }
            )
        if body_text:
            default_segments.append(
                {
                    "title": str(script.get("title") or "Main Message"),
                    "narration": body_text,
                    "durationSeconds": self._infer_duration_seconds(prompt, "body"),
                    "background": self._infer_background(prompt, "body"),
                    "transition": "fade",
                    "camera": "medium",
                    "voice": self._infer_voice_preset(prompt, "body"),
                    "captionStyle": self._infer_caption_style(prompt, "body"),
                    "assets": self._infer_assets(prompt, "body"),
                }
            )
        if cta_text:
            default_segments.append(
                {
                    "title": "Call To Action",
                    "narration": cta_text,
                    "durationSeconds": self._infer_duration_seconds(prompt, "cta"),
                    "background": self._infer_background(prompt, "cta"),
                    "transition": "wipe",
                    "camera": "close-up",
                    "voice": self._infer_voice_preset(prompt, "cta"),
                    "captionStyle": self._infer_caption_style(prompt, "cta"),
                    "assets": self._infer_assets(prompt, "cta"),
                }
            )

        if not isinstance(raw_scenes, list) or not raw_scenes:
            raw_scenes = default_segments

        # If provider returns a minimal single-scene payload, promote deterministic multi-scene split.
        if isinstance(raw_scenes, list) and len(raw_scenes) <= 1 and len(default_segments) >= 2:
            raw_scenes = default_segments

        normalized_scenes: list[dict] = []
        total_scenes = len(raw_scenes) if isinstance(raw_scenes, list) else 0
        for idx, item in enumerate(raw_scenes):
            if not isinstance(item, dict):
                continue
            scene_role = self._infer_scene_role(item, idx, total_scenes)
            narration = str(item.get("narration") or script.get("script") or "").strip()
            if not narration:
                continue
            explicit_assets = item.get("assets")
            if isinstance(explicit_assets, list) and explicit_assets:
                assets = self._normalize_assets([str(asset) for asset in explicit_assets])
            else:
                assets = self._infer_assets(prompt, scene_role)

            normalized_scenes.append(
                {
                    "title": str(item.get("title") or script.get("title") or "Generated Scene").strip(),
                    "narration": narration,
                    "durationSeconds": int(item.get("durationSeconds") or self._infer_duration_seconds(prompt, scene_role)),
                    "background": str(item.get("background") or self._infer_background(prompt, scene_role)).strip(),
                    "transition": str(item.get("transition") or self._default_transition_for_role(scene_role)).strip(),
                    "avatar": str(item.get("avatar") or avatar_id).strip(),
                    "voice": str(item.get("voice") or self._infer_voice_preset(prompt, scene_role)).strip(),
                    "camera": str(item.get("camera") or self._default_camera_for_role(scene_role)).strip(),
                    "music": str(item.get("music") or SCENE_DEFAULTS["music"]).strip(),
                    "captionStyle": str(item.get("captionStyle") or self._infer_caption_style(prompt, scene_role)).strip(),
                    "assets": assets,
                }
            )

        if not normalized_scenes:
            normalized_scenes.append(
                {
                    "title": str(script.get("title") or "Generated Scene"),
                    "narration": str(script.get("script") or "").strip(),
                    "durationSeconds": 20,
                    "background": "office",
                    "transition": SCENE_DEFAULTS["transition"],
                    "avatar": avatar_id,
                    "voice": SCENE_DEFAULTS["voice"],
                    "camera": SCENE_DEFAULTS["camera"],
                    "music": SCENE_DEFAULTS["music"],
                    "captionStyle": SCENE_DEFAULTS["caption_style"],
                    "assets": [],
                }
            )

        return {
            "scenes": normalized_scenes,
            "sourcePrompt": prompt,
        }
