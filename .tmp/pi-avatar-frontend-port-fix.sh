#!/bin/bash
set -e
APP=/home/sarapriyain/Projects/Velynxia/apps/avatar-studio
CFG="$APP/ecosystem.config.js"

python3 - <<'PY'
from pathlib import Path
p = Path('/home/sarapriyain/Projects/Velynxia/apps/avatar-studio/ecosystem.config.js')
t = p.read_text()
t = t.replace('PORT: "3008"', 'PORT: "3018"')
t = t.replace('PORT: "3000"', 'PORT: "3018"')
p.write_text(t)
print('frontend port set to 3018')
PY

cd "$APP"
pm2 delete avatar-frontend >/dev/null 2>&1 || true
pm2 start ecosystem.config.js --only avatar-frontend --update-env
pm2 save

echo BACKEND
curl -sS -m 20 http://127.0.0.1:8000/health || true
echo
echo FRONTEND
curl -sS -I -m 20 http://127.0.0.1:3018 | head -n 1 || true
echo PM2
pm2 ls | grep -E "avatar-backend|avatar-frontend" || true