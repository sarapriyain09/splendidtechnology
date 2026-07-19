from __future__ import annotations

import base64
import binascii
from pathlib import Path
import re
from uuid import uuid4

import httpx

from app.config import settings
from app.providers.base import AvatarProvider
from app.providers.local_avatar_renderer import render_avatar_video


class GeminiAvatarProvider(AvatarProvider):
    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        key = settings.gemini_api_key.strip()
        if not key:
            result = render_avatar_video(script, "gemini-local", render_plan=render_plan)
            result["avatarId"] = avatar_id
            return result

        portrait_path = await self._generate_avatar_portrait(script, key)
        result = render_avatar_video(script, "gemini", portrait_path=portrait_path, render_plan=render_plan)
        result["avatarId"] = avatar_id
        return result

    async def _generate_avatar_portrait(self, script: str, api_key: str) -> Path | None:
        url = (
            f"{settings.gemini_api_base_url.rstrip('/')}/models/"
            f"{settings.gemini_model}:generateContent"
        )
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                "Generate a realistic front-facing presenter portrait suitable for an AI avatar video. "
                                "Professional style, neutral expression, clean background. "
                                f"Script context: {script[:300]}"
                            )
                        }
                    ]
                }
            ],
            "generationConfig": {
                "responseModalities": ["TEXT", "IMAGE"],
            },
        }

        timeout = httpx.Timeout(float(settings.gemini_request_timeout_seconds))
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(url, params={"key": api_key}, json=payload)
                response.raise_for_status()
                body = response.json()
        except httpx.HTTPError:
            return None

        candidates = body.get("candidates") if isinstance(body, dict) else None
        if not isinstance(candidates, list):
            return None

        image_b64 = None
        mime_type = "image/png"
        for candidate in candidates:
            content = candidate.get("content") if isinstance(candidate, dict) else None
            parts = content.get("parts") if isinstance(content, dict) else None
            if not isinstance(parts, list):
                continue
            for part in parts:
                if not isinstance(part, dict):
                    continue
                inline = part.get("inlineData") or part.get("inline_data")
                if isinstance(inline, dict) and isinstance(inline.get("data"), str):
                    image_b64 = inline.get("data")
                    mime_type = str(inline.get("mimeType") or inline.get("mime_type") or "image/png")
                    break
            if image_b64:
                break

        if not image_b64:
            return None

        try:
            # Gemini can return whitespace-wrapped base64.
            compact_b64 = re.sub(r"\s+", "", image_b64)
            image_bytes = base64.b64decode(compact_b64, validate=False)
        except (binascii.Error, ValueError):
            return None

        assets_dir = Path(settings.storage_root) / "temp" / "gemini-portraits"
        assets_dir.mkdir(parents=True, exist_ok=True)
        extension = "png"
        lower_mime = mime_type.lower()
        if "jpeg" in lower_mime or "jpg" in lower_mime:
            extension = "jpg"
        elif "webp" in lower_mime:
            extension = "webp"

        out_path = assets_dir / f"portrait_{uuid4().hex[:12]}.{extension}"
        out_path.write_bytes(image_bytes)
        return out_path
