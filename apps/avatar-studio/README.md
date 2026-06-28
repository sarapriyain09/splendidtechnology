# Velynxia Avatar Studio

Standalone avatar platform scaffold with provider-agnostic architecture.

## Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind, Zustand, React Query, React Hook Form, Framer Motion
- Backend: FastAPI, PostgreSQL, Redis, Celery
- Storage: MinIO
- Media: FFmpeg (via worker container)

## Quick start

1. Copy `.env.example` to `.env`.
2. Start services:

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
