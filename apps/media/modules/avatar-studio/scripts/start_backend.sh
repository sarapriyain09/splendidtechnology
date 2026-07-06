#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$APP_ROOT/backend"
source ./venv/bin/activate
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
