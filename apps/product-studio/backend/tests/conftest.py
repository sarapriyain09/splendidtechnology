import os
from pathlib import Path

import pytest


TEST_DB_PATH = Path(__file__).resolve().parents[1] / "test.db"
DEFAULT_TEST_DATABASE_URL = f"sqlite:///{TEST_DB_PATH.as_posix()}"


# Default local pytest runs to SQLite, but respect an explicit DATABASE_URL when provided.
os.environ.setdefault("DATABASE_URL", DEFAULT_TEST_DATABASE_URL)


@pytest.fixture(scope="session", autouse=True)
def sqlite_test_database_file() -> None:
    active_database_url = os.environ.get("DATABASE_URL", "")
    uses_default_sqlite = active_database_url == DEFAULT_TEST_DATABASE_URL

    if uses_default_sqlite and TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()

    yield