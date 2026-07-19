from __future__ import annotations

import json

import httpx

from app.config import settings
from app.providers.base import AIProvider


class GeminiScriptProvider(AIProvider):
    async def generate_script(self, prompt: str) -> dict:
        api_key = settings.gemini_api_key.strip()
        if api_key:
            generated = await self._generate_with_gemini(prompt, api_key)
            if generated is not None:
                return generated

        return {
            "title": "Generated Video Script",
            "hook": "Start with a clear business problem.",
            "script": f"Draft script generated for: {prompt}",
            "cta": "Book a demo today.",
        }

    async def _generate_with_gemini(self, prompt: str, api_key: str) -> dict | None:
        timeout = httpx.Timeout(float(settings.gemini_request_timeout_seconds))
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": (
                                "You are a concise video script assistant. Return strict JSON with keys "
                                "title, hook, script, cta. Prompt: "
                                f"{prompt}"
                            )
                        }
                    ]
                }
            ]
        }

        raw_candidates = [
            settings.gemini_script_model.strip(),
            "gemini-2.5-flash",
            "gemini-2.0-flash",
            settings.gemini_model.strip(),
        ]
        model_candidates: list[str] = []
        for candidate in raw_candidates:
            if not candidate or candidate in model_candidates:
                continue
            # Avoid image-only models for script generation unless explicitly configured.
            if "image" in candidate.lower() and candidate != settings.gemini_script_model.strip():
                continue
            model_candidates.append(candidate)

        body = None
        async with httpx.AsyncClient(timeout=timeout) as client:
            for model in model_candidates:
                if not model:
                    continue
                url = f"{settings.gemini_api_base_url.rstrip('/')}/models/{model}:generateContent"
                try:
                    response = await client.post(url, params={"key": api_key}, json=payload)
                    response.raise_for_status()
                    body = response.json()
                    break
                except httpx.HTTPError:
                    continue

        if body is None:
            return None

        candidates = body.get("candidates") if isinstance(body, dict) else None
        if not isinstance(candidates, list) or not candidates:
            return None

        content = candidates[0].get("content") if isinstance(candidates[0], dict) else None
        parts = content.get("parts") if isinstance(content, dict) else None
        if not isinstance(parts, list):
            return None

        text_part = next((p.get("text") for p in parts if isinstance(p, dict) and isinstance(p.get("text"), str)), None)
        if not text_part:
            return None

        raw = text_part.strip()
        start = raw.find("{")
        end = raw.rfind("}")
        if start < 0 or end <= start:
            return None

        try:
            parsed = json.loads(raw[start : end + 1])
        except json.JSONDecodeError:
            return None

        title = str(parsed.get("title") or "Generated Video Script").strip()
        hook = str(parsed.get("hook") or "Start with a clear business problem.").strip()
        script = str(parsed.get("script") or f"Draft script generated for: {prompt}").strip()
        cta = str(parsed.get("cta") or "Book a demo today.").strip()
        return {"title": title, "hook": hook, "script": script, "cta": cta}

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
