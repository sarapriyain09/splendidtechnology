from app.providers.base import ScriptProvider


class OpenAIScriptProvider(ScriptProvider):
    async def generate_script(self, prompt: str) -> dict:
        return {
            "title": "Generated Video Script",
            "hook": "Start strong with the core pain point.",
            "script": f"Draft script generated for: {prompt}",
            "cta": "Book a demo today.",
        }
