# Velynxia Avatar Studio

Standalone avatar platform scaffold with provider-agnostic architecture.

This deployment profile is native Raspberry Pi OS and does not require Docker.

## Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind, Zustand, React Query, React Hook Form, Framer Motion
- Backend: FastAPI, PostgreSQL
- Storage: Native filesystem on SSD
- Process manager: PM2
- Reverse proxy: Nginx
- Media: FFmpeg

## Target

- Raspberry Pi 5
- Raspberry Pi OS 64-bit
- 8GB RAM
- SSD storage

## Native folder layout

Runtime data is outside source code:

- `/srv/velynxia/avatarstudio/storage/uploads`
- `/srv/velynxia/avatarstudio/storage/avatars`
- `/srv/velynxia/avatarstudio/storage/voices`
- `/srv/velynxia/avatarstudio/storage/projects`
- `/srv/velynxia/avatarstudio/storage/renders`
- `/srv/velynxia/avatarstudio/storage/exports`
- `/srv/velynxia/avatarstudio/storage/training`
- `/srv/velynxia/avatarstudio/storage/temp`
- `/srv/velynxia/avatarstudio/storage/logs`
- `/srv/velynxia/avatarstudio/storage/backups`
- `/srv/velynxia/avatarstudio/logs/frontend`
- `/srv/velynxia/avatarstudio/logs/backend`
- `/srv/velynxia/avatarstudio/logs/training`
- `/srv/velynxia/avatarstudio/logs/rendering`

The backend auto-creates these directories on startup.

## Quick start (native)

1. Copy `.env.example` to `.env`.
2. Configure PostgreSQL locally (`localhost:5432`).
3. Keep `APP_ENV=development` for local work. Set `APP_ENV=production` only on production deployments.
4. When `APP_ENV=production`, startup fails fast unless these are set with non-placeholder values:
   - `DATABASE_URL`
   - `JWT_SECRET` (minimum 32 chars)
   - `OPENAI_API_KEY`
   - `HEYGEN_API_KEY`
5. Backend setup:

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

6. Frontend setup:

   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

7. Open:

- Frontend: `http://localhost:3000`
- Backend docs: `http://localhost:8000/docs`

## PM2 process management

Use the included `ecosystem.config.js`:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Smoke monitor runs from PM2 as `avatar-smoke-monitor` on a 10-minute schedule.

Useful commands:

```bash
pm2 start ecosystem.config.js --only avatar-smoke-monitor
pm2 logs avatar-smoke-monitor --lines 100
pm2 describe avatar-smoke-monitor
```

Email alerts for smoke monitor failures:

- recipient: `ALERT_EMAIL_TO` (default `admin@velynxia.com`)
- sender: `ALERT_EMAIL_FROM`
- SMTP host: `SMTP_HOST`
- SMTP port: `SMTP_PORT` (default `587`)
- SMTP user: `SMTP_USERNAME`
- SMTP password: `SMTP_PASSWORD`
- TLS mode: `SMTP_USE_TLS` (`true` for STARTTLS on 587)

When SMTP settings are missing, the smoke script logs a warning and skips sending email.

## Nginx reverse proxy

Sample config is provided at `config/nginx/avatar-studio.conf`.

It supports:

- `avatar.velynxia.com`
- `/avatar` path routing

Proxy targets:

- Frontend -> `localhost:3000`
- Backend API -> `localhost:8000`

## Storage conventions

Uploads are saved directly to SSD, outside project source:

- `storage/uploads/{user-id}/videos`
- `storage/uploads/{user-id}/voices`
- `storage/uploads/{user-id}/images`

Training data:

- `storage/training/{user-id}/{session-id}/`

Rendered project output:

- `storage/projects/{project-id}/scene01.mp4`
- `storage/projects/{project-id}/scene02.mp4`
- `storage/projects/{project-id}/final.mp4`

Models:

- `storage/voices/{user-id}/`
- `storage/avatars/{user-id}/`

## Backups

Run:

```bash
./scripts/backup_avatarstudio.sh
```

Backups include database dumps and storage archives in:

- `storage/backups/{timestamp}`

## Deployment scripts

- `scripts/setup_pi.sh` - install system/runtime dependencies and initialize app folders.
- `scripts/start_backend.sh` - start FastAPI with the backend virtual environment.
- `scripts/backup_avatarstudio.sh` - backup PostgreSQL and media/training artifacts.

## Architecture

The backend keeps provider interfaces for future expansion:

- `AvatarProvider`
- `VoiceProvider`
- `ScriptProvider`
- `VideoProvider`

Storage remains abstraction-friendly via `STORAGE_BACKEND` and can be switched to object storage later.

## Training API

- `POST /api/training/start`
- `POST /api/training/{training_id}/enqueue`
- `GET /api/training/{training_id}/status`
- `GET /api/training/{training_id}/logs`

Resumable upload flow:

- `POST /api/training/{training_id}/uploads/init`
- `POST /api/training/{training_id}/uploads/chunk` (multipart)
- `POST /api/training/{training_id}/uploads/complete`

## Health endpoints

- `GET /health` (legacy/internal checks)
- `GET /api/health` (public API checks)

## Smoke test

Run the deployment smoke test from the repo root:

```bash
python apps/avatar-studio/scripts/smoke_test.py
```

Optional target override:

```bash
AVATAR_BASE_URL=https://avatar.velynxia.com python apps/avatar-studio/scripts/smoke_test.py
```

## Project structure

- `frontend/` Next.js app
- `backend/` FastAPI app
- `storage/` runtime media on SSD (external path)
- `config/` deployment configuration
- `scripts/` operational scripts
- `ecosystem.config.js` PM2 services

   ```bash
   docker compose up --build
   ```

3. Open:
- Frontend: `http://localhost:3008`
- Backend docs: `http://localhost:8008/docs`
- MinIO Console: `http://localhost:9001`

4. Run database migration:

   ```bash
   docker compose exec backend alembic upgrade head
   ```

## Architecture

The application uses a provider interface in backend services:

- `AvatarProvider`
- `VoiceProvider`
- `ScriptProvider`
- `VideoProvider`

Initial default provider is HeyGen for avatar/video and OpenAI for script.

## Training API (Phase 3)

- `POST /api/training/start`
- `POST /api/training/{training_id}/enqueue`
- `GET /api/training/{training_id}/status`
- `GET /api/training/{training_id}/logs`

Resumable upload flow:

- `POST /api/training/{training_id}/uploads/init`
- `POST /api/training/{training_id}/uploads/chunk` (multipart)
- `POST /api/training/{training_id}/uploads/complete`

## Folders

- `frontend/` Next.js app
- `backend/` FastAPI app + Celery tasks
- `docker-compose.yml` all local infra
