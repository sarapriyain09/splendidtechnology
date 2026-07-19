from __future__ import annotations

import base64
from pathlib import Path
from uuid import uuid4

import httpx

from app.config import settings
from app.providers.base import AvatarProvider
from app.providers.local_avatar_renderer import render_avatar_video


class OpenAIAvatarProvider(AvatarProvider):
    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        key = settings.openai_api_key.strip()
        if not key:
            result = render_avatar_video(script, "openai-local", render_plan=render_plan)
            result["avatarId"] = avatar_id
            return result

        portrait_path = await self._generate_avatar_portrait(script, key)
        result = render_avatar_video(script, "openai", portrait_path=portrait_path, render_plan=render_plan)
        result["avatarId"] = avatar_id
        return result

    async def _generate_avatar_portrait(self, script: str, api_key: str) -> Path | None:
        payload = {
            "model": "gpt-image-1",
            "size": "1024x1024",
            "prompt": (
                "Create a professional front-facing presenter portrait for AI talking avatar video. "
                "Studio lighting, neutral clean background, realistic human appearance. "
                f"Script context: {script[:300]}"
            ),
        }
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        url = f"{settings.openai_api_base_url.rstrip('/')}/images/generations"
        timeout = httpx.Timeout(float(settings.openai_request_timeout_seconds))

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(url, headers=headers, json=payload)
                response.raise_for_status()
                body = response.json()
        except httpx.HTTPError:
            return None

        data = body.get("data") if isinstance(body, dict) else None
        if not isinstance(data, list) or not data:
            return None

        first = data[0] if isinstance(data[0], dict) else None
        if not isinstance(first, dict):
            return None

        b64 = first.get("b64_json")
        if not isinstance(b64, str) or not b64:
            return None

        try:
            image_bytes = base64.b64decode(b64)
        except Exception:
            return None

        assets_dir = Path(settings.storage_root) / "temp" / "openai-portraits"
        assets_dir.mkdir(parents=True, exist_ok=True)
        out_path = assets_dir / f"portrait_{uuid4().hex[:12]}.png"
        out_path.write_bytes(image_bytes)
        return out_path
