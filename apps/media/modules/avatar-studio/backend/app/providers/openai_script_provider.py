from __future__ import annotations

import json

import httpx

from app.config import settings
from app.providers.base import AIProvider


class OpenAIScriptProvider(AIProvider):
    async def generate_script(self, prompt: str) -> dict:
        api_key = settings.openai_api_key.strip()
        if api_key:
            generated = await self._generate_with_openai(prompt, api_key)
            if generated is not None:
                return generated

        # Development fallback when OpenAI is not configured or response parsing fails.
        return {
            "title": "Generated Video Script",
            "hook": "Start strong with the core pain point.",
            "script": f"Draft script generated for: {prompt}",
            "cta": "Book a demo today.",
        }

    async def _generate_with_openai(self, prompt: str, api_key: str) -> dict | None:
        url = f"{settings.openai_api_base_url.rstrip('/')}/chat/completions"
        timeout = httpx.Timeout(float(settings.openai_request_timeout_seconds))
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        request_payload = {
            "model": settings.openai_model,
            "temperature": 0.6,
            "response_format": {"type": "json_object"},
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a concise video script assistant. "
                        "Return strict JSON with keys: title, hook, script, cta."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Create an avatar video script for this prompt:\n"
                        f"{prompt}"
                    ),
                },
            ],
        }

        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(url, headers=headers, json=request_payload)
                response.raise_for_status()
                payload = response.json()
        except httpx.HTTPError:
            return None

        choices = payload.get("choices") if isinstance(payload, dict) else None
        if not isinstance(choices, list) or not choices:
            return None

        message = choices[0].get("message") if isinstance(choices[0], dict) else None
        content = message.get("content") if isinstance(message, dict) else None
        if not isinstance(content, str) or not content.strip():
            return None

        try:
            parsed = json.loads(content)
        except json.JSONDecodeError:
            return None

        title = str(parsed.get("title") or "Generated Video Script").strip()
        hook = str(parsed.get("hook") or "Start strong with the core pain point.").strip()
        script = str(parsed.get("script") or f"Draft script generated for: {prompt}").strip()
        cta = str(parsed.get("cta") or "Book a demo today.").strip()

        return {
            "title": title,
            "hook": hook,
            "script": script,
            "cta": cta,
        }

    async def generate_scene_plan(self, prompt: str, script: dict) -> dict:
        narration = str(script.get("script") or "").strip()
        return {
            "scenes": [
                {
                    "title": str(script.get("title") or "Generated Scene"),
                    "narration": narration,
                    "durationSeconds": 20,
                    "background": "office",
                    "transition": "cut",
                }
            ],
            "sourcePrompt": prompt,
        }

    async def rewrite(self, text: str, style: str | None = None) -> str:
        if style and style.strip():
            return f"{style.strip()}: {text}"
        return text

    async def summarize(self, text: str) -> str:
        compact = " ".join(text.split())
        return compact[:220]

    async def translate(self, text: str, target_language: str) -> str:
        return f"[{target_language}] {text}"

    async def generate_captions(self, script: str) -> list[dict]:
        words = script.split()
        if not words:
            return []
        return [{"start": 0.0, "end": 4.0, "text": " ".join(words[: min(len(words), 14)])}]
