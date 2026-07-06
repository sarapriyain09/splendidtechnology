from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.config import settings


def ensure_runtime_directories() -> dict[str, Path]:
    storage_root = Path(settings.storage_root)
    logs_root = Path(settings.logs_root)

    storage_dirs = {
        "storage": storage_root,
        "uploads": storage_root / "uploads",
        "avatars": storage_root / "avatars",
        "voices": storage_root / "voices",
        "projects": storage_root / "projects",
        "renders": storage_root / "renders",
        "exports": storage_root / "exports",
        "training": storage_root / "training",
        "temp": storage_root / "temp",
        "logs": storage_root / "logs",
        "backups": storage_root / "backups",
    }
    for path in storage_dirs.values():
        path.mkdir(parents=True, exist_ok=True)

    log_dirs = {
        "logs_root": logs_root,
        "frontend_logs": logs_root / "frontend",
        "backend_logs": logs_root / "backend",
        "training_logs": logs_root / "training",
        "rendering_logs": logs_root / "rendering",
    }
    for path in log_dirs.values():
        path.mkdir(parents=True, exist_ok=True)

    return {**storage_dirs, **log_dirs}


def configure_logging() -> None:
    paths = ensure_runtime_directories()
    backend_log_file = paths["backend_logs"] / "api.log"

    root_logger = logging.getLogger()
    if any(isinstance(handler, RotatingFileHandler) for handler in root_logger.handlers):
        return

    root_logger.setLevel(logging.INFO)
    formatter = logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")

    file_handler = RotatingFileHandler(
        backend_log_file,
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)
