from celery import Celery

from app.config import settings

celery_app = Celery("avatar_studio", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.update(
    include=[
        "app.workers.tasks.training",
        "app.workers.tasks.video",
    ]
)
celery_app.conf.task_routes = {
    "app.workers.tasks.training.*": {"queue": "training"},
    "app.workers.tasks.video.*": {"queue": "video"},
}
