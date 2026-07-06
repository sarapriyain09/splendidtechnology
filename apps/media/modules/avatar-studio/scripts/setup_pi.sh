#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="/srv/velynxia/avatarstudio"
BACKEND_DIR="$APP_ROOT/backend"
FRONTEND_DIR="$APP_ROOT/frontend"
STORAGE_ROOT="/srv/velynxia/avatarstudio/storage"
LOGS_ROOT="/srv/velynxia/avatarstudio/logs"

sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql postgresql-contrib nginx ffmpeg nodejs npm
sudo npm install -g pm2

sudo mkdir -p "$STORAGE_ROOT"/{uploads,avatars,voices,projects,renders,exports,training,temp,logs,backups}
sudo mkdir -p "$LOGS_ROOT"/{frontend,backend,training,rendering}
sudo chown -R "$USER":"$USER" "$APP_ROOT"

python3 -m venv "$BACKEND_DIR/venv"
source "$BACKEND_DIR/venv/bin/activate"
pip install --upgrade pip
pip install -r "$BACKEND_DIR/requirements.txt"

cd "$FRONTEND_DIR"
npm install
npm run build

echo "Pi setup complete. Configure PostgreSQL credentials and copy .env.production to .env before starting PM2."
