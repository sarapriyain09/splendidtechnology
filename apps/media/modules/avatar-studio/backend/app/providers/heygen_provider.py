from __future__ import annotations

import asyncio
import os
import subprocess
from pathlib import Path
from uuid import UUID
from uuid import uuid4

import httpx

from app.config import settings
from app.providers.base import AvatarProvider


class HeyGenProvider(AvatarProvider):
    @staticmethod
    def _is_uuid_like(value: str) -> bool:
        try:
            UUID(value)
            return True
        except ValueError:
            return False

    def _resolve_avatar_id_for_provider(self, avatar_id: str) -> str:
        candidate = (avatar_id or "").strip()
        configured_default = settings.heygen_default_avatar_id.strip()

        if not candidate or candidate.lower() == "default":
            return configured_default or candidate or "default"

        # Local app avatars are UUIDs; HeyGen usually expects provider-specific avatar IDs.
        if self._is_uuid_like(candidate) and configured_default:
            return configured_default

        return candidate

    async def _request_with_retry(self, client: httpx.AsyncClient, method: str, url: str, **kwargs) -> httpx.Response:
        retries = max(0, int(settings.heygen_request_retries))
        attempts = retries + 1
        backoff = max(0.1, float(settings.heygen_retry_backoff_seconds))
        retryable_statuses = {429, 500, 502, 503, 504}

        for attempt in range(attempts):
            try:
                response = await client.request(method=method, url=url, **kwargs)
                if response.status_code in retryable_statuses and attempt < attempts - 1:
                    await asyncio.sleep(backoff * (2**attempt))
                    continue
                response.raise_for_status()
                return response
            except httpx.HTTPStatusError as exc:
                status_code = exc.response.status_code
                if status_code in retryable_statuses and attempt < attempts - 1:
                    await asyncio.sleep(backoff * (2**attempt))
                    continue
                raise
            except httpx.HTTPError:
                if attempt < attempts - 1:
                    await asyncio.sleep(backoff * (2**attempt))
                    continue
                raise

        raise RuntimeError("HeyGen request retry loop exhausted")

    async def generate_video(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        provider_avatar_id = self._resolve_avatar_id_for_provider(avatar_id)

        return await self._generate_video_with_heygen_api(script, provider_avatar_id)

    async def _generate_video_with_heygen_api(self, script: str, avatar_id: str) -> dict:
        api_key = settings.heygen_api_key.strip()
        if not api_key:
            return {
                "provider": "heygen",
                "status": "failed",
                "error": "HEYGEN_API_KEY is not configured",
                "avatarId": avatar_id,
                "script": script,
            }

        base_url = settings.heygen_api_base_url.rstrip("/")
        generate_url = f"{base_url}/v2/video/generate"
        headers = {
            "X-Api-Key": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        payload = {
            "video_inputs": [
                {
                    "character": {
                        "type": "avatar",
                        "avatar_id": avatar_id or "default",
                    },
                    "voice": {
                        "type": "text",
                        "input_text": script,
                    },
                }
            ]
        }

        timeout = httpx.Timeout(float(settings.heygen_api_timeout_seconds))
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                submit_response = await self._request_with_retry(
                    client,
                    "POST",
                    generate_url,
                    json=payload,
                    headers=headers,
                )
                submit_payload = submit_response.json()

                job_data = submit_payload.get("data") if isinstance(submit_payload, dict) else None
                video_job_id = self._extract_job_id(job_data or submit_payload)
                if not video_job_id:
                    return {
                        "provider": "heygen",
                        "status": "failed",
                        "avatarId": avatar_id,
                        "script": script,
                        "error": "HeyGen response missing video job id",
                    }

                status_result = await self._poll_video_status(client, headers, base_url, video_job_id)
                status_result.update(
                    {
                        "provider": "heygen",
                        "videoJobId": video_job_id,
                        "avatarId": avatar_id,
                        "script": script,
                    }
                )
                return status_result
        except httpx.HTTPStatusError as exc:
            return {
                "provider": "heygen",
                "status": "failed",
                "avatarId": avatar_id,
                "script": script,
                "error": f"HeyGen API error: {exc.response.status_code}",
            }
        except httpx.HTTPError as exc:
            return {
                "provider": "heygen",
                "status": "failed",
                "avatarId": avatar_id,
                "script": script,
                "error": f"HeyGen request failed: {exc.__class__.__name__}",
            }

    async def _poll_video_status(
        self,
        client: httpx.AsyncClient,
        headers: dict[str, str],
        base_url: str,
        video_job_id: str,
    ) -> dict:
        status_url = f"{base_url}/v1/video_status.get"
        poll_interval = float(settings.heygen_poll_interval_seconds)
        poll_timeout = int(settings.heygen_poll_timeout_seconds)
        poll_iterations = max(1, int(poll_timeout / max(poll_interval, 0.1)))

        for _ in range(poll_iterations):
            response = await self._request_with_retry(
                client,
                "GET",
                status_url,
                params={"video_id": video_job_id},
                headers=headers,
            )
            payload = response.json()
            payload_data = payload.get("data") if isinstance(payload, dict) else None

            status = str((payload_data or {}).get("status") or payload.get("status") or "queued").lower()
            video_url = self._extract_video_url(payload_data or payload)

            if status in {"completed", "success"}:
                return {
                    "status": "completed",
                    "videoUrl": video_url or "",
                }

            if status in {"failed", "error", "canceled", "cancelled"}:
                return {
                    "status": "failed",
                    "error": str((payload_data or {}).get("error") or "HeyGen job failed"),
                }

            await asyncio.sleep(poll_interval)

        return {
            "status": "queued",
            "videoUrl": "",
        }

    @staticmethod
    def _extract_job_id(payload: dict | None) -> str:
        if not isinstance(payload, dict):
            return ""
        return str(
            payload.get("video_id")
            or payload.get("videoId")
            or payload.get("id")
            or ""
        )

    @staticmethod
    def _extract_video_url(payload: dict | None) -> str:
        if not isinstance(payload, dict):
            return ""
        return str(
            payload.get("video_url")
            or payload.get("videoUrl")
            or payload.get("url")
            or ""
        )

    @staticmethod
    def _escape_ps_single_quoted(value: str) -> str:
        return value.replace("'", "''")

    def _synthesize_voice_track(self, script: str, output_wav_path: Path) -> bool:
        sanitized = script.strip() or "Welcome to Velynxia Avatar Studio."
        output_wav_path.parent.mkdir(parents=True, exist_ok=True)

        if os.name != "nt":
            return False

        escaped_text = self._escape_ps_single_quoted(sanitized)
        escaped_path = self._escape_ps_single_quoted(str(output_wav_path))
        ps_script = (
            "Add-Type -AssemblyName System.Speech; "
            "$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
            "$voice.Rate = 0; "
            "$voice.Volume = 100; "
            f"$voice.SetOutputToWaveFile('{escaped_path}'); "
            f"$voice.Speak('{escaped_text}'); "
            "$voice.Dispose();"
        )

        completed = subprocess.run(
            ["powershell", "-NoProfile", "-Command", ps_script],
            capture_output=True,
            text=True,
            check=False,
        )
        return completed.returncode == 0 and output_wav_path.exists() and output_wav_path.stat().st_size > 0

    def _generate_video_with_local_ffmpeg(self, script: str, avatar_id: str, render_plan: list[dict] | None = None) -> dict:
        renders_dir = Path(settings.storage_root) / "renders"
        renders_dir.mkdir(parents=True, exist_ok=True)

        video_id = f"render_{uuid4().hex[:12]}"
        output_path = renders_dir / f"{video_id}.mp4"
        voice_path = renders_dir / f"{video_id}.wav"

        has_voice = self._synthesize_voice_track(script, voice_path)

        # Generate a cleaner branded-style dev video. Prefer spoken narration when TTS is available.
        ffmpeg_command = ["ffmpeg", "-y"]
        ffmpeg_command.extend(["-f", "lavfi", "-i", "color=c=0x0f172a:s=1280x720:r=30"])
        if has_voice:
            ffmpeg_command.extend(["-i", str(voice_path)])
            ffmpeg_command.extend(["-shortest"])
        else:
            ffmpeg_command.extend(["-f", "lavfi", "-i", "sine=frequency=600:sample_rate=48000:duration=6,volume=-30dB"])
            ffmpeg_command.extend(["-shortest"])

        ffmpeg_command.extend(
            [
                "-vf",
                "drawbox=x='540+20*sin(t*1.2)':y=220:w=200:h=320:color=0x1e293b@1:t=fill,"
                "drawbox=x='590+20*sin(t*1.2)':y=120:w=100:h=100:color=0x334155@1:t=fill,"
                "drawbox=x=430:y=560:w=420:h=6:color=0x38bdf8@1:t=fill",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-c:a",
                "aac",
                "-ac",
                "2",
                "-b:a",
                "192k",
                "-movflags",
                "+faststart",
                str(output_path),
            ]
        )

        completed = subprocess.run(ffmpeg_command, capture_output=True, text=True, check=False)

        if voice_path.exists():
            try:
                voice_path.unlink()
            except OSError:
                pass

        if completed.returncode != 0 or not output_path.exists():
            return {
                "provider": "heygen",
                "status": "failed",
                "videoJobId": video_id,
                "avatarId": avatar_id,
                "error": "Local render failed",
                "script": script,
            }

        media_base = settings.app_base_url.rstrip("/")
        if media_base.startswith("http://localhost"):
            media_base = media_base.replace("http://localhost", "http://127.0.0.1", 1)
        video_url = f"{media_base}/media/renders/{output_path.name}"

        return {
            "provider": "heygen",
            "status": "completed",
            "videoJobId": video_id,
            "avatarId": avatar_id,
            "videoUrl": video_url,
            "script": script,
        }
