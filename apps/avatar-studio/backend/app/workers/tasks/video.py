from app.workers.celery_app import celery_app


@celery_app.task(name="app.workers.tasks.video.render_video")
def render_video(project_id: str) -> dict[str, str]:
    return {
        "projectId": project_id,
        "status": "RENDERED",
    }
