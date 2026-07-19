import asyncio
import hashlib
import json
from pathlib import Path

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.config import settings
from app.models import Job, Project, Scene, Video
from app.providers.factory import create_ai_provider, create_avatar_provider, create_voice_provider
from app.services.db.project_service import add_scene, create_project, upsert_scene_settings
from app.services.render_service import RenderService, build_render_plan_from_scenes
from app.services.scene_planner import ScenePlanner

_JOB_TYPE_RENDER = "PROJECT_RENDER"
_PENDING_MARKER = "PENDING"
_render_locks: dict[str, asyncio.Lock] = {}
_render_locks_guard = asyncio.Lock()


async def _get_render_lock(render_ref: str) -> asyncio.Lock:
    async with _render_locks_guard:
        existing = _render_locks.get(render_ref)
        if existing is not None:
            return existing
        created = asyncio.Lock()
        _render_locks[render_ref] = created
        return created


def _build_render_ref(project_id: str, idempotency_token: str) -> str:
    return f"render:{project_id}:{idempotency_token}"


def _build_job_ref(render_ref: str, token: str) -> str:
    return f"{render_ref}|{token}"


def _split_job_ref(ref_id: str) -> tuple[str, str] | None:
    render_ref, separator, token = ref_id.partition("|")
    if not separator:
        return None
    return render_ref, token


def _render_meta_file_path(project_id: str, video_id: str) -> Path:
    root = Path(settings.storage_root)
    return root / "projects" / project_id / "render-meta" / f"{video_id}.json"


def _render_job_meta_file_path(project_id: str, job_id: str) -> Path:
    root = Path(settings.storage_root)
    return root / "projects" / project_id / "render-jobs" / f"{job_id}.json"


def _persist_render_meta(project_id: str, video_id: str, telemetry: dict[str, object] | None) -> None:
    if not telemetry:
        return
    target = _render_meta_file_path(project_id, video_id)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(telemetry), encoding="utf-8")


def _load_render_meta(project_id: str, video_id: str) -> dict[str, object] | None:
    path = _render_meta_file_path(project_id, video_id)
    if not path.exists():
        return None
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None
    if isinstance(parsed, dict):
        return parsed
    return None


def _persist_render_job_meta(project_id: str, job_id: str, payload: dict[str, object]) -> None:
    target = _render_job_meta_file_path(project_id, job_id)
    target.parent.mkdir(parents=True, exist_ok=True)
    current = _load_render_job_meta(project_id, job_id) or {}
    merged = {**current, **payload}
    target.write_text(json.dumps(merged), encoding="utf-8")


def _load_render_job_meta(project_id: str, job_id: str) -> dict[str, object] | None:
    path = _render_job_meta_file_path(project_id, job_id)
    if not path.exists():
        return None
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None
    if isinstance(parsed, dict):
        return parsed
    return None


def _default_stage_for_status(status: str) -> str:
    normalized = status.strip().upper()
    if normalized == "QUEUED":
        return "queued"
    if normalized == "PROCESSING":
        return "rendering"
    if normalized == "COMPLETED":
        return "completed"
    if normalized == "FAILED":
        return "failed"
    return "unknown"


def _serialize_video_response(video: Video, provider: str, video_job_id: str) -> dict[str, object]:
    payload: dict[str, object] = {
        "id": video.id,
        "status": video.status,
        "provider": provider,
        "videoJobId": video_job_id,
        "outputUrl": video.output_url,
    }
    telemetry = _load_render_meta(video.project_id, video.id)
    if telemetry is not None:
        payload["renderExecution"] = telemetry
    return payload


def _extract_idempotency_token(render_ref: str) -> str:
    # render:{project_id}:{token}
    parts = render_ref.split(":", 2)
    if len(parts) != 3:
        return ""
    return parts[2]


def _find_latest_job_for_render_ref(db: Session, actor_user_id: str, render_ref: str) -> Job | None:
    stmt = (
        select(Job)
        .where(
            Job.user_id == actor_user_id,
            Job.job_type == _JOB_TYPE_RENDER,
            Job.ref_id.like(f"{render_ref}|%"),
        )
        .order_by(Job.created_at.desc())
        .limit(1)
    )
    return db.scalar(stmt)


def _status_to_progress(status: str) -> int:
    normalized = status.strip().upper()
    if normalized == "QUEUED":
        return 5
    if normalized == "PROCESSING":
        return 60
    if normalized == "COMPLETED":
        return 100
    if normalized == "FAILED":
        return 100
    return 0


def _stage_to_progress(stage: str) -> int:
    normalized = stage.strip().lower()
    if normalized == "queued":
        return 10
    if normalized == "preparing":
        return 25
    if normalized == "rendering":
        return 70
    if normalized == "persisting":
        return 90
    if normalized in {"completed", "failed"}:
        return 100
    return 0


def _find_existing_video_for_render_ref(db: Session, actor_user_id: str, project_id: str, render_ref: str) -> Video | None:
    stmt = (
        select(Job)
        .where(
            Job.user_id == actor_user_id,
            Job.job_type == _JOB_TYPE_RENDER,
            Job.ref_id.like(f"{render_ref}|%"),
        )
        .order_by(Job.created_at.desc())
    )
    jobs = list(db.scalars(stmt).all())
    for job in jobs:
        parsed = _split_job_ref(job.ref_id)
        if not parsed:
            continue
        _, token = parsed
        if token == _PENDING_MARKER:
            continue

        video = db.get(Video, token)
        if video and video.project_id == project_id:
            return video
    return None


def _get_project_for_actor(db: Session, project_id: str, actor_user_id: str) -> Project:
    project = db.get(Project, project_id)
    if not project or project.user_id != actor_user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


class AIOrchestrator:
    def __init__(self) -> None:
        self.ai_provider = create_ai_provider()
        self.avatar_provider = create_avatar_provider()
        self.voice_provider = create_voice_provider()
        self.scene_planner = ScenePlanner()
        self.render_service = RenderService(self.avatar_provider)

    @staticmethod
    def _build_render_context(project: Project, scenes: list[Scene], avatar_id: str | None, idempotency_key: str | None) -> dict:
        scene_scripts = [s.narration.strip() for s in scenes if s.narration.strip()]
        combined_script = "\n\n".join(scene_scripts).strip()
        if not combined_script:
            raise HTTPException(status_code=400, detail="Scenes contain no narration")

        render_plan = build_render_plan_from_scenes(scenes)
        selected_avatar_id = avatar_id or "default"
        supplied_idempotency_key = (idempotency_key or "").strip()
        idempotency_input = supplied_idempotency_key or f"{project.id}|{selected_avatar_id}|{combined_script}"
        idempotency_token = hashlib.sha256(idempotency_input.encode("utf-8")).hexdigest()[:24]
        render_ref = _build_render_ref(project.id, idempotency_token)

        return {
            "combined_script": combined_script,
            "render_plan": render_plan,
            "selected_avatar_id": selected_avatar_id,
            "idempotency_token": idempotency_token,
            "render_ref": render_ref,
        }

    @staticmethod
    def _serialize_render_job(
        job: Job,
        render_ref: str,
        scene_count: int,
        project_id: str,
        video: Video | None = None,
    ) -> dict[str, object]:
        job_meta = _load_render_job_meta(project_id, job.id) if job.id else None
        stage = str((job_meta or {}).get("stage") or _default_stage_for_status(job.status))
        payload: dict[str, object] = {
            "jobId": job.id,
            "status": job.status,
            "progressPercent": _stage_to_progress(stage),
            "idempotencyKey": _extract_idempotency_token(render_ref),
            "sceneCount": scene_count,
            "stage": stage,
        }
        if isinstance(job_meta, dict):
            if isinstance(job_meta.get("error"), str) and str(job_meta.get("error")).strip():
                payload["error"] = str(job_meta.get("error"))
            if isinstance(job_meta.get("startedAt"), str):
                payload["startedAt"] = str(job_meta.get("startedAt"))
            if isinstance(job_meta.get("updatedAt"), str):
                payload["updatedAt"] = str(job_meta.get("updatedAt"))
        if video is not None:
            payload["video"] = _serialize_video_response(video, "cached", "")
        return payload

    async def run_prompt(self, db: Session, user_id: str, prompt: str, avatar_id: str | None) -> dict:
        selected_avatar_id = avatar_id or "default"
        script_result = await self.ai_provider.generate_script(prompt)
        scene_plan = await self.scene_planner.plan(
            ai_provider=self.ai_provider,
            prompt=prompt,
            script=script_result,
            avatar_id=selected_avatar_id,
        )
        project = create_project(db, user_id, "AI Generated Project", prompt)

        persisted_scenes = []
        for idx, planned_scene in enumerate(scene_plan["scenes"]):
            scene = add_scene(
                    db,
                    project.id,
                    title=str(planned_scene.get("title") or f"Scene {idx + 1}"),
                    narration=str(planned_scene.get("narration") or "").strip(),
                    duration_seconds=int(planned_scene.get("durationSeconds") or 20),
                    background=str(planned_scene.get("background") or "office"),
                    image_url="",
                    voice_audio_url="",
                    music=str(planned_scene.get("music") or "none"),
                )
            upsert_scene_settings(
                db,
                scene_id=scene.id,
                camera=str(planned_scene.get("camera") or "static"),
                transition=str(planned_scene.get("transition") or "cut"),
                caption_style=str(planned_scene.get("captionStyle") or "default"),
                voice=str(planned_scene.get("voice") or "default"),
                assets=[str(a) for a in (planned_scene.get("assets") or []) if isinstance(a, str)],
            )
            persisted_scenes.append(scene)

        combined_script = "\n\n".join(
            s.narration.strip() for s in persisted_scenes if s.narration and s.narration.strip()
        ).strip() or str(script_result.get("script") or "").strip()

        video_result = await self.render_service.generate_video(
            combined_script=combined_script,
            selected_avatar_id=selected_avatar_id,
            render_plan=scene_plan.get("scenes") if isinstance(scene_plan.get("scenes"), list) else [],
            project_id=project.id,
            idempotency_token=project.id,
        )
        captions = await self.ai_provider.generate_captions(script_result["script"])
        first_scene = persisted_scenes[0]

        return {
            "prompt": prompt,
            "project": {
                "id": project.id,
                "name": project.name,
            },
            "scene": {
                "id": first_scene.id,
                "title": first_scene.title,
            },
            "scenes": [
                {
                    "id": s.id,
                    "title": s.title,
                    "narration": s.narration,
                    "durationSeconds": s.duration_seconds,
                    "background": s.background,
                    "music": s.music,
                    "camera": scene_plan["scenes"][index].get("camera", "static"),
                    "transition": scene_plan["scenes"][index].get("transition", "cut"),
                    "captionStyle": scene_plan["scenes"][index].get("captionStyle", "default"),
                    "voice": scene_plan["scenes"][index].get("voice", "default"),
                    "assets": scene_plan["scenes"][index].get("assets", []),
                }
                for index, s in enumerate(persisted_scenes)
            ],
            "script": script_result,
            "scenePlan": scene_plan,
            "captions": captions,
            "voice": {
                "provider": self.voice_provider.__class__.__name__,
            },
            "video": video_result,
        }

    async def render_project_from_scenes(
        self,
        db: Session,
        actor_user_id: str,
        project_id: str,
        avatar_id: str | None,
        idempotency_key: str | None,
    ) -> dict[str, object]:
        project = _get_project_for_actor(db, project_id, actor_user_id)

        stmt = select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.asc())
        scenes = list(db.scalars(stmt).all())
        if not scenes:
            raise HTTPException(status_code=400, detail="Project has no scenes")

        context = self._build_render_context(project, scenes, avatar_id, idempotency_key)
        combined_script = str(context["combined_script"])
        render_plan = context["render_plan"]
        selected_avatar_id = str(context["selected_avatar_id"])
        idempotency_token = str(context["idempotency_token"])
        render_ref = str(context["render_ref"])
        render_lock = await _get_render_lock(render_ref)

        async with render_lock:
            existing_video = _find_existing_video_for_render_ref(db, actor_user_id, project.id, render_ref)
            if existing_video is not None:
                return {
                    "projectId": project.id,
                    "sceneCount": len(scenes),
                    "idempotencyKey": idempotency_token,
                    "replayed": True,
                    "video": _serialize_video_response(existing_video, "cached", ""),
                }

            reservation = Job(
                user_id=actor_user_id,
                job_type=_JOB_TYPE_RENDER,
                status="PROCESSING",
                ref_id=_build_job_ref(render_ref, _PENDING_MARKER),
            )
            db.add(reservation)
            db.commit()
            db.refresh(reservation)
            _persist_render_job_meta(
                project.id,
                reservation.id,
                {
                    "stage": "preparing",
                    "startedAt": reservation.created_at.isoformat(),
                    "updatedAt": reservation.updated_at.isoformat(),
                },
            )

            try:
                _persist_render_job_meta(
                    project.id,
                    reservation.id,
                    {
                        "stage": "rendering",
                    },
                )
                render_result = await self.render_service.generate_video(
                    combined_script=combined_script,
                    selected_avatar_id=selected_avatar_id,
                    render_plan=render_plan,
                    project_id=project.id,
                    idempotency_token=idempotency_token,
                )
                render_status = str(render_result.get("status", "queued")).upper()
                _persist_render_job_meta(
                    project.id,
                    reservation.id,
                    {
                        "stage": "persisting",
                    },
                )
                video = Video(
                    project_id=project.id,
                    status=render_status,
                    resolution="1080p",
                    output_url=str(render_result.get("videoUrl", "")),
                )
                db.add(video)
                self.render_service.apply_project_status(project, render_status, bool(render_result.get("videoUrl")))

                reservation.status = render_status
                db.add(project)
                db.add(reservation)
                db.commit()
                db.refresh(video)
                _persist_render_job_meta(
                    project.id,
                    reservation.id,
                    {
                        "stage": "completed" if render_status == "COMPLETED" else _default_stage_for_status(render_status),
                        "error": str(render_result.get("error") or "") if render_status == "FAILED" else "",
                        "updatedAt": reservation.updated_at.isoformat(),
                    },
                )
                _persist_render_meta(
                    project_id=project.id,
                    video_id=video.id,
                    telemetry=render_result.get("renderExecution") if isinstance(render_result, dict) else None,
                )

                reservation.ref_id = _build_job_ref(render_ref, video.id)
                db.add(reservation)
                db.commit()

                return {
                    "projectId": project.id,
                    "sceneCount": len(scenes),
                    "idempotencyKey": idempotency_token,
                    "replayed": False,
                    "video": _serialize_video_response(
                        video,
                        str(render_result.get("provider", "unknown")),
                        str(render_result.get("videoJobId", "")),
                    ),
                }
            except Exception:
                reservation.status = "FAILED"
                db.add(reservation)
                db.commit()
                _persist_render_job_meta(
                    project.id,
                    reservation.id,
                    {
                        "stage": "failed",
                        "error": "Render execution failed",
                        "updatedAt": reservation.updated_at.isoformat(),
                    },
                )
                raise

    async def enqueue_render_project_from_scenes(
        self,
        db: Session,
        actor_user_id: str,
        project_id: str,
        avatar_id: str | None,
        idempotency_key: str | None,
    ) -> dict[str, object]:
        project = _get_project_for_actor(db, project_id, actor_user_id)
        stmt = select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.asc())
        scenes = list(db.scalars(stmt).all())
        if not scenes:
            raise HTTPException(status_code=400, detail="Project has no scenes")

        context = self._build_render_context(project, scenes, avatar_id, idempotency_key)
        render_ref = str(context["render_ref"])
        scene_count = len(scenes)

        existing_video = _find_existing_video_for_render_ref(db, actor_user_id, project.id, render_ref)
        if existing_video is not None:
            synthetic_job = Job(
                id="",
                user_id=actor_user_id,
                job_type=_JOB_TYPE_RENDER,
                status="COMPLETED",
                ref_id=_build_job_ref(render_ref, existing_video.id),
            )
            return {
                **self._serialize_render_job(synthetic_job, render_ref, scene_count, project.id, video=existing_video),
                "replayed": True,
                "runInBackground": False,
            }

        existing_job = _find_latest_job_for_render_ref(db, actor_user_id, render_ref)
        if existing_job is not None and existing_job.status in {"QUEUED", "PROCESSING"}:
            return {
                **self._serialize_render_job(existing_job, render_ref, scene_count, project.id),
                "replayed": False,
                "runInBackground": False,
            }

        queued_job = Job(
            user_id=actor_user_id,
            job_type=_JOB_TYPE_RENDER,
            status="QUEUED",
            ref_id=_build_job_ref(render_ref, _PENDING_MARKER),
        )
        db.add(queued_job)
        project.status = "RENDERING"
        db.add(project)
        db.commit()
        db.refresh(queued_job)
        _persist_render_job_meta(
            project.id,
            queued_job.id,
            {
                "stage": "queued",
                "startedAt": queued_job.created_at.isoformat(),
                "updatedAt": queued_job.updated_at.isoformat(),
            },
        )

        return {
            **self._serialize_render_job(queued_job, render_ref, scene_count, project.id),
            "replayed": False,
            "runInBackground": True,
            "backgroundContext": {
                "jobId": queued_job.id,
                "actorUserId": actor_user_id,
                "projectId": project_id,
                "avatarId": avatar_id,
                "idempotencyKey": idempotency_key,
            },
        }

    async def process_queued_render_job(
        self,
        job_id: str,
        actor_user_id: str,
        project_id: str,
        avatar_id: str | None,
        idempotency_key: str | None,
    ) -> None:
        db = SessionLocal()
        try:
            job = db.get(Job, job_id)
            if not job or job.user_id != actor_user_id or job.job_type != _JOB_TYPE_RENDER:
                return

            project = _get_project_for_actor(db, project_id, actor_user_id)
            stmt = select(Scene).where(Scene.project_id == project_id).order_by(Scene.order_index.asc())
            scenes = list(db.scalars(stmt).all())
            if not scenes:
                job.status = "FAILED"
                db.add(job)
                db.commit()
                _persist_render_job_meta(
                    project_id,
                    job.id,
                    {
                        "stage": "failed",
                        "error": "Project has no scenes",
                        "updatedAt": job.updated_at.isoformat(),
                    },
                )
                return

            context = self._build_render_context(project, scenes, avatar_id, idempotency_key)
            combined_script = str(context["combined_script"])
            render_plan = context["render_plan"]
            selected_avatar_id = str(context["selected_avatar_id"])
            render_ref = str(context["render_ref"])

            _persist_render_job_meta(
                project.id,
                job.id,
                {
                    "stage": "preparing",
                    "updatedAt": job.updated_at.isoformat(),
                },
            )

            job.status = "PROCESSING"
            db.add(job)
            db.commit()
            _persist_render_job_meta(
                project.id,
                job.id,
                {
                    "stage": "rendering",
                    "updatedAt": job.updated_at.isoformat(),
                },
            )

            render_result = await self.render_service.generate_video(
                combined_script=combined_script,
                selected_avatar_id=selected_avatar_id,
                render_plan=render_plan,
                project_id=project.id,
                idempotency_token=str(context["idempotency_token"]),
            )
            render_status = str(render_result.get("status", "queued")).upper()
            _persist_render_job_meta(
                project.id,
                job.id,
                {
                    "stage": "persisting",
                },
            )
            video = Video(
                project_id=project.id,
                status=render_status,
                resolution="1080p",
                output_url=str(render_result.get("videoUrl", "")),
            )
            db.add(video)
            db.commit()
            db.refresh(video)
            _persist_render_meta(
                project_id=project.id,
                video_id=video.id,
                telemetry=render_result.get("renderExecution") if isinstance(render_result, dict) else None,
            )

            self.render_service.apply_project_status(project, render_status, bool(render_result.get("videoUrl")))

            job.status = render_status
            job.ref_id = _build_job_ref(render_ref, video.id)
            db.add(project)
            db.add(job)
            db.commit()
            _persist_render_job_meta(
                project.id,
                job.id,
                {
                    "stage": "completed" if render_status == "COMPLETED" else _default_stage_for_status(render_status),
                    "error": str(render_result.get("error") or "") if render_status == "FAILED" else "",
                    "updatedAt": job.updated_at.isoformat(),
                },
            )
        except Exception:
            failed_job = db.get(Job, job_id)
            if failed_job is not None:
                failed_job.status = "FAILED"
                db.add(failed_job)
                db.commit()
                _persist_render_job_meta(
                    project_id,
                    failed_job.id,
                    {
                        "stage": "failed",
                        "error": "Render worker failed",
                        "updatedAt": failed_job.updated_at.isoformat(),
                    },
                )
        finally:
            db.close()

    def get_render_job_status(
        self,
        db: Session,
        actor_user_id: str,
        project_id: str,
        job_id: str,
    ) -> dict[str, object]:
        _get_project_for_actor(db, project_id, actor_user_id)
        job = db.get(Job, job_id)
        if not job or job.user_id != actor_user_id or job.job_type != _JOB_TYPE_RENDER:
            raise HTTPException(status_code=404, detail="Render job not found")

        parsed = _split_job_ref(job.ref_id)
        if not parsed:
            raise HTTPException(status_code=500, detail="Render job ref format is invalid")
        render_ref, token = parsed

        if not render_ref.startswith(f"render:{project_id}:"):
            raise HTTPException(status_code=404, detail="Render job does not belong to this project")

        scene_count_stmt = select(Scene).where(Scene.project_id == project_id)
        scene_count = len(list(db.scalars(scene_count_stmt).all()))

        video = None
        if token != _PENDING_MARKER:
            candidate = db.get(Video, token)
            if candidate and candidate.project_id == project_id:
                video = candidate

        return self._serialize_render_job(job, render_ref, scene_count, project_id, video=video)
