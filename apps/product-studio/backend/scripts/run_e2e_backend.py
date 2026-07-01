import os
from pathlib import Path

import uvicorn


if __name__ == "__main__":
    backend_dir = Path(__file__).resolve().parents[1]
    e2e_db = backend_dir / "e2e.db"
    if e2e_db.exists():
        e2e_db.unlink()

    os.environ["DATABASE_URL"] = "sqlite:///./e2e.db"

    uvicorn.run("app.main:app", host="127.0.0.1", port=8011, app_dir=str(backend_dir))
