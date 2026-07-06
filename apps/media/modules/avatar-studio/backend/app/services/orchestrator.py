from sqlalchemy.orm import Session

from app.providers.heygen_provider import HeyGenProvider
from app.providers.openai_script_provider import OpenAIScriptProvider
from app.services.db.project_service import add_scene, create_project


class AIOrchestrator:
    def __init__(self) -> None:
        self.avatar_provider = HeyGenProvider()
        self.script_provider = OpenAIScriptProvider()

    async def run_prompt(self, db: Session, user_id: str, prompt: str, avatar_id: str | None) -> dict:
        script_result = await self.script_provider.generate_script(prompt)
        project = create_project(db, user_id, "AI Generated Project", prompt)

        scene = add_scene(
            db,
            project.id,
            title=script_result["title"],
            narration=script_result["script"],
            duration_seconds=20,
            background="office",
        )

        video_result = await self.avatar_provider.generate_video(script_result["script"], avatar_id or "default")
        return {
            "prompt": prompt,
            "project": {
                "id": project.id,
                "name": project.name,
            },
            "scene": {
                "id": scene.id,
                "title": scene.title,
            },
            "script": script_result,
            "video": video_result,
        }
