from pathlib import Path

from app.providers.ffmpeg_command_builder import build_avatar_ffmpeg_command, build_lipsync_ffmpeg_command


def _vf_value(command: list[str]) -> str:
    index = command.index("-vf")
    return command[index + 1]


def test_build_lipsync_command_without_portrait_uses_color_input_and_viseme_filters() -> None:
    command = build_lipsync_ffmpeg_command(
        portrait_path=None,
        voice_path=Path("voice.wav"),
        has_voice=False,
        duration_seconds=7.5,
        camera_style="medium",
        transition_style="fade",
        asset_count=2,
        caption_text="Caption line",
        branding_text="Velynxia",
        viseme_segments=[(0.1, 0.5, 0.7)],
        output_path=Path("out.mp4"),
    )

    assert command[0:2] == ["ffmpeg", "-y"]
    assert "color=c=0x0f172a:s=1280x720:r=30" in command
    assert any("sine=frequency=560" in part for part in command)
    vf = _vf_value(command)
    assert "drawbox=x=500:y=190:w=280:h=420" in vf
    assert "enable='between(t,0.100,0.500)'" in vf
    assert "text='Caption line'" in vf
    assert "text='Velynxia'" in vf
    assert "fade=t=in:st=0:d=0.35" in vf


def test_build_lipsync_command_with_portrait_and_audio_uses_loop_and_input_wav() -> None:
    portrait = Path(__file__)
    command = build_lipsync_ffmpeg_command(
        portrait_path=portrait,
        voice_path=Path("voice.wav"),
        has_voice=True,
        duration_seconds=9.0,
        camera_style="close-up",
        transition_style="cut",
        asset_count=1,
        caption_text="Hello world",
        branding_text="BrandX",
        viseme_segments=[(0.2, 0.6, 0.8)],
        output_path=Path("out.mp4"),
    )

    assert "-loop" in command
    assert str(portrait) in command
    assert str(Path("voice.wav")) in command
    vf = _vf_value(command)
    assert "scale=1460:920:force_original_aspect_ratio=increase" in vf
    assert "drawbox=x=575" in vf


def test_build_avatar_command_returns_fallback_for_portrait_path() -> None:
    portrait = Path(__file__)
    command, fallback = build_avatar_ffmpeg_command(
        portrait_path=portrait,
        voice_path=Path("voice.wav"),
        has_voice=True,
        camera_style="static",
        transition_style="wipe",
        asset_count=4,
        caption_text="Caption",
        branding_text="BrandX",
        output_path=Path("out.mp4"),
    )

    assert "-vf" in command
    vf = _vf_value(command)
    assert "crop=1280:720" in vf
    assert "mod(t*540,1640)" in vf
    assert fallback == "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720"


def test_build_avatar_command_without_portrait_has_no_fallback() -> None:
    command, fallback = build_avatar_ffmpeg_command(
        portrait_path=None,
        voice_path=Path("voice.wav"),
        has_voice=False,
        camera_style="medium",
        transition_style="fade",
        asset_count=0,
        caption_text="Caption",
        branding_text="BrandX",
        output_path=Path("out.mp4"),
    )

    assert any("sine=frequency=600" in part for part in command)
    vf = _vf_value(command)
    assert "drawbox=x='540+20*sin(t*1.2)'" in vf
    assert "fade=t=in:st=0:d=0.35" in vf
    assert fallback == ""
