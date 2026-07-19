from __future__ import annotations

import os
import re
import subprocess
import wave
from pathlib import Path
from uuid import uuid4

from app.config import settings


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

    ffmpeg_command = ["ffmpeg", "-y"]
    if portrait_path is not None and portrait_path.exists():
        ffmpeg_command.extend(["-loop", "1", "-i", str(portrait_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "color=c=0x0f172a:s=1280x720:r=30"])

    if has_voice:
        ffmpeg_command.extend(["-i", str(voice_path)])
    else:
        ffmpeg_command.extend([
            "-f",
            "lavfi",
            "-i",
            f"sine=frequency=560:sample_rate=48000:duration={duration_seconds:.3f},volume=-30dB",
        ])

    profile = _build_render_profile(render_plan)
    camera_style = str(profile.get("camera") or "medium")
    transition_style = str(profile.get("transition") or "cut")
    asset_count = int(profile.get("asset_count") or 0)

    if portrait_path is not None and portrait_path.exists():
        if camera_style == "close-up":
            base_scale = "scale=1460:920:force_original_aspect_ratio=increase"
            motion = "crop=1280:720:x=(in_w-1280)/2+5*sin(t*0.8):y=(in_h-720)/2+4*cos(t*0.6)"
        elif camera_style == "static":
            base_scale = "scale=1280:720:force_original_aspect_ratio=increase"
            motion = "crop=1280:720"
        else:
            base_scale = "scale=1360:820:force_original_aspect_ratio=increase"
            motion = "crop=1280:720:x=(in_w-1280)/2+9*sin(t*0.9):y=(in_h-720)/2+6*cos(t*0.7)"
    else:
        base_scale = "scale=1280:720:force_original_aspect_ratio=increase"
        motion = "crop=1280:720"

    transition_effect = ""
    if transition_style == "fade":
        transition_effect = ",fade=t=in:st=0:d=0.35"
    elif transition_style == "wipe":
        transition_effect = ",drawbox=x='-420+mod(t*560,1700)':y=0:w=420:h=720:color=0xffffff@0.05:t=fill"

    asset_overlay_height = 4 + (min(asset_count, 5) * 3)
    viseme_segments = _build_viseme_segments(script, duration_seconds)

    mouth_filters: list[str] = []
    for start, end, openness in viseme_segments:
        outer_height = int(6 + (22 * openness))
        inner_height = max(2, int(2 + (12 * openness)))

        if portrait_path is not None and portrait_path.exists():
            if camera_style == "close-up":
                mouth_center_y = 382
            elif camera_style == "static":
                mouth_center_y = 402
            else:
                mouth_center_y = 392

            outer_y = int(mouth_center_y - (outer_height / 2))
            inner_y = int((mouth_center_y + 4) - (inner_height / 2))
            mouth_x_outer = 575
            mouth_x_inner = 598
            mouth_w_outer = 130
            mouth_w_inner = 84
        else:
            outer_y = int(474 - (outer_height / 2))
            inner_y = int(478 - (inner_height / 2))
            mouth_x_outer = 575
            mouth_x_inner = 600
            mouth_w_outer = 130
            mouth_w_inner = 80

        enable = f"enable='between(t,{start:.3f},{end:.3f})'"
        mouth_filters.append(
            f"drawbox=x={mouth_x_outer}:y={outer_y}:w={mouth_w_outer}:h={outer_height}:color=0x2b1212@0.42:t=fill:{enable}"
        )
        mouth_filters.append(
            f"drawbox=x={mouth_x_inner}:y={inner_y}:w={mouth_w_inner}:h={inner_height}:color=0x050505@0.35:t=fill:{enable}"
        )

    if portrait_path is not None and portrait_path.exists():
        filter_parts = [
            base_scale,
            motion,
            "eq=contrast=1.03:saturation=1.04:brightness=0.01",
            *mouth_filters,
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill",
        ]
    else:
        # No portrait available: render a visible presenter silhouette with lip-sync motion overlays.
        filter_parts = [
            base_scale,
            motion,
            "eq=contrast=1.07:saturation=1.10:brightness=0.05",
            "drawbox=x=500:y=190:w=280:h=420:color=0x6b7280@1.00:t=fill",
            "drawbox=x=570:y=95:w=140:h=140:color=0xf1c27d@1.00:t=fill",
            "drawbox=x=560:y=85:w=160:h=160:color=0xffffff@0.24:t=3",
            "drawbox=x=545:y=230:w=190:h=26:color=0x93c5fd@0.75:t=fill",
            "drawbox=x=430:y=620:w=420:h=6:color=0x38bdf8@1:t=fill",
            *mouth_filters,
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill",
        ]
    filter_chain = ",".join(filter_parts) + transition_effect

    ffmpeg_command.extend(
        [
            "-vf",
            filter_chain,
            "-shortest",
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

    ffmpeg_command = ["ffmpeg", "-y"]
    if portrait_path is not None and portrait_path.exists():
        ffmpeg_command.extend(["-loop", "1", "-i", str(portrait_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "color=c=0x0f172a:s=1280x720:r=30"])

    if has_voice:
        ffmpeg_command.extend(["-i", str(voice_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "sine=frequency=600:sample_rate=48000:duration=6,volume=-30dB"])

    profile = _build_render_profile(render_plan)
    camera_style = str(profile.get("camera") or "medium")
    transition_style = str(profile.get("transition") or "cut")
    asset_count = int(profile.get("asset_count") or 0)

    if portrait_path is not None and portrait_path.exists():
        if camera_style == "close-up":
            base_scale = "scale=1460:920:force_original_aspect_ratio=increase"
            motion = "crop=1280:720:x=(in_w-1280)/2+6*sin(t*0.8):y=(in_h-720)/2+4*cos(t*0.6)"
        elif camera_style == "static":
            base_scale = "scale=1280:720:force_original_aspect_ratio=increase"
            motion = "crop=1280:720"
        else:
            base_scale = "scale=1360:820:force_original_aspect_ratio=increase"
            motion = "crop=1280:720:x=(in_w-1280)/2+10*sin(t*0.9):y=(in_h-720)/2+6*cos(t*0.7)"

        transition_effect = ""
        if transition_style == "fade":
            transition_effect = ",fade=t=in:st=0:d=0.40"
        elif transition_style == "wipe":
            transition_effect = ",drawbox=x='-360+mod(t*540,1640)':y=0:w=360:h=720:color=0xffffff@0.05:t=fill"

        asset_overlay_height = 4 + (min(asset_count, 5) * 3)

        # Keep a real portrait clean, add subtle camera motion, and force visible mouth motion.
        filter_chain = (
            f"{base_scale},"
            f"{motion},"
            "eq=contrast=1.03:saturation=1.04:brightness=0.01,"
            "drawbox=x=560:y='460-2*abs(sin(t*8.5))':w=160:h='5+18*abs(sin(t*8.5))':"
            "color=0x2b1212@0.28:t=fill,"
            "drawbox=x=585:y='464-2*abs(sin(t*8.5))':w=110:h='2+10*abs(sin(t*8.5))':"
            "color=0x000000@0.18:t=fill,"
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill"
            f"{transition_effect}"
        )
        portrait_fallback_filter_chain = "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"
    else:
        # Fallback silhouette when no portrait is available.
        transition_overlay = ""
        if transition_style == "fade":
            transition_overlay = ",fade=t=in:st=0:d=0.35"
        elif transition_style == "wipe":
            transition_overlay = ",drawbox=x='-420+mod(t*560,1700)':y=0:w=420:h=720:color=0xffffff@0.05:t=fill"

        asset_overlay_height = 4 + (min(asset_count, 5) * 3)

        filter_chain = (
            "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
            "drawbox=x='540+20*sin(t*1.2)':y=220:w=200:h=320:color=0x1e293b@0.45:t=fill,"
            "drawbox=x='590+20*sin(t*1.2)':y=120:w=100:h=100:color=0x334155@0.45:t=fill,"
            "drawbox=x=430:y=560:w=420:h=6:color=0x38bdf8@1:t=fill,"
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill"
            f"{transition_overlay}"
        )
        portrait_fallback_filter_chain = ""

    ffmpeg_command.extend(
        [
            "-vf",
            filter_chain,
            "-shortest",
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
