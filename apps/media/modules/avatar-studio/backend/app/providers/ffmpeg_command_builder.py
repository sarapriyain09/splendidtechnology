from __future__ import annotations

from pathlib import Path


def _drawtext_font_option() -> str:
    # On Windows, drawtext may fail if Fontconfig is unavailable. Use a known system font file.
    candidates = [
        Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            escaped_path = str(candidate).replace("\\", "/").replace(":", r"\:")
            return f"fontfile='{escaped_path}':"
    return ""


def _escape_drawtext_text(value: str) -> str:
    sanitized = (value or "").replace("\\", r"\\")
    sanitized = sanitized.replace("'", r"\'")
    sanitized = sanitized.replace(":", r"\:")
    sanitized = sanitized.replace("%", r"\%")
    return sanitized


def _build_caption_drawtext(caption_text: str) -> str:
    escaped = _escape_drawtext_text(caption_text)
    font_option = _drawtext_font_option()
    return (
        "drawtext="
        f"{font_option}"
        f"text='{escaped}':"
        "x=(w-text_w)/2:"
        "y=h-120:"
        "fontsize=34:"
        "fontcolor=white:"
        "box=1:"
        "boxcolor=0x00000099:"
        "boxborderw=8"
    )


def _build_brand_drawtext(branding_text: str) -> str:
    escaped = _escape_drawtext_text(branding_text)
    font_option = _drawtext_font_option()
    return (
        "drawtext="
        f"{font_option}"
        f"text='{escaped}':"
        "x=w-text_w-28:"
        "y=24:"
        "fontsize=22:"
        "fontcolor=0x38bdf8:"
        "box=1:"
        "boxcolor=0x0f172acc:"
        "boxborderw=6"
    )


def build_lipsync_ffmpeg_command(
    *,
    portrait_path: Path | None,
    voice_path: Path,
    has_voice: bool,
    duration_seconds: float,
    camera_style: str,
    transition_style: str,
    asset_count: int,
    caption_text: str,
    branding_text: str,
    viseme_segments: list[tuple[float, float, float]],
    output_path: Path,
) -> list[str]:
    ffmpeg_command = ["ffmpeg", "-y"]
    if portrait_path is not None and portrait_path.exists():
        ffmpeg_command.extend(["-loop", "1", "-i", str(portrait_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "color=c=0x0f172a:s=1280x720:r=30"])

    if has_voice:
        ffmpeg_command.extend(["-i", str(voice_path)])
    else:
        ffmpeg_command.extend(
            [
                "-f",
                "lavfi",
                "-i",
                f"sine=frequency=560:sample_rate=48000:duration={duration_seconds:.3f},volume=-30dB",
            ]
        )

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
            _build_caption_drawtext(caption_text),
            _build_brand_drawtext(branding_text),
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill",
        ]
    else:
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
            _build_caption_drawtext(caption_text),
            _build_brand_drawtext(branding_text),
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
    return ffmpeg_command


def build_avatar_ffmpeg_command(
    *,
    portrait_path: Path | None,
    voice_path: Path,
    has_voice: bool,
    camera_style: str,
    transition_style: str,
    asset_count: int,
    caption_text: str,
    branding_text: str,
    output_path: Path,
) -> tuple[list[str], str]:
    ffmpeg_command = ["ffmpeg", "-y"]
    if portrait_path is not None and portrait_path.exists():
        ffmpeg_command.extend(["-loop", "1", "-i", str(portrait_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "color=c=0x0f172a:s=1280x720:r=30"])

    if has_voice:
        ffmpeg_command.extend(["-i", str(voice_path)])
    else:
        ffmpeg_command.extend(["-f", "lavfi", "-i", "sine=frequency=600:sample_rate=48000:duration=6,volume=-30dB"])

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
        filter_chain = (
            f"{base_scale},"
            f"{motion},"
            "eq=contrast=1.03:saturation=1.04:brightness=0.01,"
            "drawbox=x=560:y='460-2*abs(sin(t*8.5))':w=160:h='5+18*abs(sin(t*8.5))':"
            "color=0x2b1212@0.28:t=fill,"
            "drawbox=x=585:y='464-2*abs(sin(t*8.5))':w=110:h='2+10*abs(sin(t*8.5))':"
            "color=0x000000@0.18:t=fill,"
            f"{_build_caption_drawtext(caption_text)},"
            f"{_build_brand_drawtext(branding_text)},"
            f"drawbox=x=0:y=714:w=1280:h={asset_overlay_height}:color=0x38bdf8@0.35:t=fill"
            f"{transition_effect}"
        )
        portrait_fallback_filter_chain = "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"
    else:
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
            f"{_build_caption_drawtext(caption_text)},"
            f"{_build_brand_drawtext(branding_text)},"
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

    return ffmpeg_command, portrait_fallback_filter_chain
