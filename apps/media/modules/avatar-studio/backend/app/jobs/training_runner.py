from __future__ import annotations

from threading import Thread
from time import sleep

from app.db.session import SessionLocal
from app.services.db.training_service import TRAINING_STAGES, add_training_log, update_progress


def _run_training_job(training_id: str) -> None:
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
    finally:
        db.close()


def enqueue_training_job(training_id: str) -> None:
    # Keep training asynchronous in native mode without requiring external brokers.
    worker = Thread(target=_run_training_job, args=(training_id,), daemon=True)
    worker.start()
