from __future__ import annotations

import os
import re
import subprocess
import wave
from pathlib import Path
from uuid import uuid4

from app.config import settings
from app.providers.ffmpeg_command_builder import build_avatar_ffmpeg_command, build_lipsync_ffmpeg_command


def _escape_ps_single_quoted(value: str) -> str:
    return value.replace("'", "''")


def synthesize_voice_track(script: str, output_wav_path: Path) -> bool:
    sanitized = script.strip() or "Welcome to Velynxia Avatar Studio."
    output_wav_path.parent.mkdir(parents=True, exist_ok=True)

    if os.name != "nt":
        return False

    escaped_text = _escape_ps_single_quoted(sanitized)
    escaped_path = _escape_ps_single_quoted(str(output_wav_path))
    ps_script = (
        "Add-Type -AssemblyName System.Speech; "
        "$voice = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
        "try { $voice.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female) } catch {}; "
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


def _build_render_profile(render_plan: list[dict] | None) -> dict:
    profile = {
        "camera": "medium",
        "transition": "cut",
        "asset_count": 0,
    }
    if not render_plan:
        return profile

    cameras: list[str] = []
    transitions: list[str] = []
    assets: list[str] = []

    for scene in render_plan:
        if not isinstance(scene, dict):
            continue
        camera = str(scene.get("camera") or "").strip().lower()
        transition = str(scene.get("transition") or "").strip().lower()
        if camera:
            cameras.append(camera)
        if transition:
            transitions.append(transition)

        raw_assets = scene.get("assets")
        if isinstance(raw_assets, list):
            for item in raw_assets:
                normalized = str(item).strip()
                if normalized and normalized not in assets:
                    assets.append(normalized)

    if cameras:
        if "close-up" in cameras:
            profile["camera"] = "close-up"
        elif "static" in cameras:
            profile["camera"] = "static"
        else:
            profile["camera"] = cameras[0]

    if transitions:
        if "wipe" in transitions:
            profile["transition"] = "wipe"
        elif "fade" in transitions:
            profile["transition"] = "fade"
        else:
            profile["transition"] = transitions[0]

    profile["asset_count"] = len(assets)
    return profile


def _estimate_duration_seconds(script: str) -> float:
    words = len(re.findall(r"[A-Za-z0-9']+", script))
    estimated = max(4.0, min(24.0, words * 0.33))
    return float(estimated)


def _read_wav_duration_seconds(path: Path) -> float:
    if not path.exists():
        return 0.0

    try:
        with wave.open(str(path), "rb") as wav_file:
            frame_count = wav_file.getnframes()
            frame_rate = wav_file.getframerate()
            if frame_rate <= 0:
                return 0.0
            return float(frame_count) / float(frame_rate)
    except (OSError, wave.Error):
        return 0.0


def _build_viseme_segments(script: str, duration_seconds: float) -> list[tuple[float, float, float]]:
    # Returns (start_sec, end_sec, mouth_open_ratio).
    tokens = re.findall(r"[A-Za-z']+", script.lower())
    if not tokens:
        return [(0.2, max(0.8, duration_seconds * 0.3), 0.6)]

    max_tokens = 180
    limited_tokens = tokens[:max_tokens]
    time_per_token = max(0.07, duration_seconds / max(len(limited_tokens), 1))
    pattern = [0.25, 0.45, 0.75, 0.55, 0.9, 0.4]

    cursor = 0.0
    segments: list[tuple[float, float, float]] = []
    for token_index, token in enumerate(limited_tokens):
        vowels = sum(1 for ch in token if ch in "aeiouy")
        beats = max(1, min(4, vowels))
        beat_duration = max(0.05, time_per_token / (beats + 0.4))

        for beat in range(beats):
            start = cursor + (beat * beat_duration)
            end = min(duration_seconds, start + (beat_duration * 0.85))
            if end <= start:
                continue
            openness = pattern[(token_index + beat) % len(pattern)]
            segments.append((start, end, openness))

        cursor += time_per_token

    if not segments:
        return [(0.2, max(0.8, duration_seconds * 0.3), 0.6)]

    return segments


def _resolve_render_output_basename(render_plan: list[dict] | None) -> str | None:
    if not render_plan:
        return None

    for scene in render_plan:
        if not isinstance(scene, dict):
            continue
        raw = str(scene.get("__renderOutputBasename") or "").strip()
        if not raw:
            continue
        sanitized = re.sub(r"[^a-zA-Z0-9_-]", "", raw)
        sanitized = sanitized.strip("_-")
        if sanitized:
            return sanitized
    return None


def render_lipsync_avatar_video(
    script: str,
    provider_name: str,
    portrait_path: Path | None = None,
    render_plan: list[dict] | None = None,
) -> dict:
    renders_dir = Path(settings.storage_root) / "renders"
    renders_dir.mkdir(parents=True, exist_ok=True)

    video_id = _resolve_render_output_basename(render_plan) or f"render_{uuid4().hex[:12]}"
    output_path = renders_dir / f"{video_id}.mp4"
    voice_path = renders_dir / f"{video_id}.wav"

    has_voice = synthesize_voice_track(script, voice_path)
    audio_duration = _read_wav_duration_seconds(voice_path) if has_voice else 0.0
    duration_seconds = audio_duration if audio_duration > 0 else _estimate_duration_seconds(script)

    profile = _build_render_profile(render_plan)
    camera_style = str(profile.get("camera") or "medium")
    transition_style = str(profile.get("transition") or "cut")
    asset_count = int(profile.get("asset_count") or 0)
    viseme_segments = _build_viseme_segments(script, duration_seconds)
    ffmpeg_command = build_lipsync_ffmpeg_command(
        portrait_path=portrait_path,
        voice_path=voice_path,
        has_voice=has_voice,
        duration_seconds=duration_seconds,
        camera_style=camera_style,
        transition_style=transition_style,
        asset_count=asset_count,
        viseme_segments=viseme_segments,
        output_path=output_path,
    )

    completed = subprocess.run(ffmpeg_command, capture_output=True, text=True, check=False)

    if voice_path.exists():
        try:
            voice_path.unlink()
        except OSError:
            pass

    if completed.returncode != 0 or not output_path.exists():
        return {
            "provider": provider_name,
            "status": "failed",
            "videoJobId": video_id,
            "error": f"Local lip-sync render failed: {completed.stderr.strip()[-300:]}",
            "script": script,
        }

    media_base = settings.app_base_url.rstrip("/")
    if media_base.startswith("http://localhost"):
        media_base = media_base.replace("http://localhost", "http://127.0.0.1", 1)
    video_url = f"{media_base}/media/renders/{output_path.name}"

    return {
        "provider": provider_name,
        "status": "completed",
        "videoJobId": video_id,
        "videoUrl": video_url,
        "script": script,
        "renderProfile": profile,
        "lipSync": {
            "mode": "local-viseme-timeline",
            "segmentCount": len(viseme_segments),
            "audioDurationSeconds": round(duration_seconds, 3),
        },
    }


def render_avatar_video(
    script: str,
    provider_name: str,
    portrait_path: Path | None = None,
    render_plan: list[dict] | None = None,
) -> dict:
    renders_dir = Path(settings.storage_root) / "renders"
    renders_dir.mkdir(parents=True, exist_ok=True)

    video_id = _resolve_render_output_basename(render_plan) or f"render_{uuid4().hex[:12]}"
    output_path = renders_dir / f"{video_id}.mp4"
    voice_path = renders_dir / f"{video_id}.wav"

    has_voice = synthesize_voice_track(script, voice_path)

    profile = _build_render_profile(render_plan)
    camera_style = str(profile.get("camera") or "medium")
    transition_style = str(profile.get("transition") or "cut")
    asset_count = int(profile.get("asset_count") or 0)
    ffmpeg_command, portrait_fallback_filter_chain = build_avatar_ffmpeg_command(
        portrait_path=portrait_path,
        voice_path=voice_path,
        has_voice=has_voice,
        camera_style=camera_style,
        transition_style=transition_style,
        asset_count=asset_count,
        output_path=output_path,
    )

    completed = subprocess.run(ffmpeg_command, capture_output=True, text=True, check=False)

    if completed.returncode != 0 and portrait_fallback_filter_chain:
        # If animated portrait expressions are unsupported by local ffmpeg, retry with a static clean portrait.
        fallback_command = list(ffmpeg_command)
        vf_index = fallback_command.index("-vf") + 1
        fallback_command[vf_index] = portrait_fallback_filter_chain
        completed = subprocess.run(fallback_command, capture_output=True, text=True, check=False)

    if voice_path.exists():
        try:
            voice_path.unlink()
        except OSError:
            pass

    if completed.returncode != 0 or not output_path.exists():
        return {
            "provider": provider_name,
            "status": "failed",
            "videoJobId": video_id,
            "error": f"Local render failed: {completed.stderr.strip()[-300:]}",
            "script": script,
        }

    media_base = settings.app_base_url.rstrip("/")
    if media_base.startswith("http://localhost"):
        media_base = media_base.replace("http://localhost", "http://127.0.0.1", 1)
    video_url = f"{media_base}/media/renders/{output_path.name}"

    return {
        "provider": provider_name,
        "status": "completed",
        "videoJobId": video_id,
        "videoUrl": video_url,
        "script": script,
        "renderProfile": profile,
    }
