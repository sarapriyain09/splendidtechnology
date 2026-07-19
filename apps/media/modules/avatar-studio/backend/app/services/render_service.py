from __future__ import annotations

import json
import re
from typing import Any

from app.models import Project, Scene


def build_render_plan_from_scenes(scenes: list[Scene]) -> list[dict[str, Any]]:
    render_plan: list[dict[str, Any]] = []
    for scene in scenes:
        settings = scene.settings
        assets: list[str] = []
        if settings and settings.assets_json:
            try:
                parsed_assets = json.loads(settings.assets_json)
                if isinstance(parsed_assets, list):
                    assets = [str(item).strip() for item in parsed_assets if str(item).strip()]
            except json.JSONDecodeError:
                assets = []

        render_plan.append(
            {
                "title": scene.title,
                "narration": scene.narration,
                "durationSeconds": scene.duration_seconds,
                "background": scene.background,
                "music": scene.music,
                "camera": settings.camera if settings else "static",
                "transition": settings.transition if settings else "cut",
                "captionStyle": settings.caption_style if settings else "default",
                "voice": settings.voice if settings else "default",
                "assets": assets,
            }
        )

    return render_plan


class RenderService:
    def __init__(self, avatar_provider: Any) -> None:
        self.avatar_provider = avatar_provider

    @staticmethod
    def _sanitize_identifier(value: str, fallback: str) -> str:
        cleaned = re.sub(r"[^a-zA-Z0-9_-]", "", value)
        cleaned = cleaned.strip("_-")
        return cleaned or fallback

    def build_output_basename(self, project_id: str, idempotency_token: str) -> str:
        project_part = self._sanitize_identifier(project_id, "project")[:12]
        token_part = self._sanitize_identifier(idempotency_token, "token")[:24]
        return f"render_{project_part}_{token_part}"

    def attach_output_basename(
        self,
        *,
        render_plan: list[dict[str, Any]],
        project_id: str,
        idempotency_token: str,
    ) -> list[dict[str, Any]]:
        basename = self.build_output_basename(project_id, idempotency_token)
        enriched_plan: list[dict[str, Any]] = []
        for scene in render_plan:
            if isinstance(scene, dict):
                scene_copy = dict(scene)
            else:
                scene_copy = {}
            scene_copy["__renderOutputBasename"] = basename
            enriched_plan.append(scene_copy)
        return enriched_plan

    async def generate_video(
        self,
        *,
        combined_script: str,
        selected_avatar_id: str,
        render_plan: list[dict[str, Any]],
        project_id: str | None = None,
        idempotency_token: str | None = None,
    ) -> dict[str, Any]:
        effective_render_plan = render_plan
        if project_id and idempotency_token:
            effective_render_plan = self.attach_output_basename(
                render_plan=render_plan,
                project_id=project_id,
                idempotency_token=idempotency_token,
            )

        return await self.avatar_provider.generate_video(
            combined_script,
            selected_avatar_id,
            render_plan=effective_render_plan,
        )

    @staticmethod
    def apply_project_status(project: Project, render_status: str, has_output_url: bool) -> None:
        if render_status == "COMPLETED" and has_output_url:
            project.status = "COMPLETED"
        elif render_status in {"QUEUED", "PROCESSING"}:
            project.status = "RENDERING"
        elif render_status == "FAILED":
            project.status = "FAILED"
        else:
            project.status = "DRAFT"
