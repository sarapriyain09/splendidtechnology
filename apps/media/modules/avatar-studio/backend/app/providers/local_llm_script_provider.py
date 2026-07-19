from app.providers.base import AIProvider


class LocalLLMScriptProvider(AIProvider):
    async def generate_script(self, prompt: str) -> dict:
        return {
            "title": "Generated Video Script",
            "hook": "Open with the key audience pain point.",
            "script": f"Local model draft script for: {prompt}",
            "cta": "Get started with Velynxia today.",
        }

    async def generate_scene_plan(self, prompt: str, script: dict) -> dict:
        return {
            "scenes": [
                {
                    "title": str(script.get("title") or "Generated Scene"),
                    "narration": str(script.get("script") or "").strip(),
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
