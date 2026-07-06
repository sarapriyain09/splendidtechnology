from time import sleep

from app.db.session import SessionLocal
from app.services.db.training_service import TRAINING_STAGES, add_training_log, update_progress
from app.workers.celery_app import celery_app


@celery_app.task(name="app.workers.tasks.training.start_avatar_training")
def start_avatar_training(training_id: str) -> dict[str, str]:
    db = SessionLocal()
    try:
        total = max(len(TRAINING_STAGES) - 1, 1)
        for idx, stage in enumerate(TRAINING_STAGES):
            progress = int((idx / total) * 100)
            status = "COMPLETED" if stage == "COMPLETED" else "RUNNING"
            update_progress(db, training_id, stage, progress, status)
            add_training_log(db, training_id, stage, f"Stage {stage} finished")
            if stage != "COMPLETED":
                sleep(2)

        return {
            "trainingId": training_id,
            "status": "COMPLETED",
        }
    finally:
        db.close()
