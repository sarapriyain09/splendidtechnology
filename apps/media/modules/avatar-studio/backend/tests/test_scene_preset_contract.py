from __future__ import annotations

import re
from pathlib import Path

from app.services.scene_planner_config import (
    SCENE_CAMERA_OPTIONS,
    SCENE_CAPTION_STYLE_OPTIONS,
    SCENE_DEFAULTS,
    SCENE_DOMAIN_DETECTION_ORDER,
    SCENE_DOMAIN_KEYWORDS,
    SCENE_MUSIC_OPTIONS,
    SCENE_ROLE_DURATION_SECONDS,
    SCENE_TRANSITION_OPTIONS,
    SCENE_VOICE_PRESET_OPTIONS,
)


def _read_frontend_scene_config() -> str:
    avatar_studio_root = Path(__file__).resolve().parents[2]
    config_path = avatar_studio_root / "frontend" / "lib" / "scene-config.ts"
    return config_path.read_text(encoding="utf-8")


def _extract_export_block(source: str, export_name: str) -> str:
    marker = f"export const {export_name}"
    marker_index = source.find(marker)
    if marker_index < 0:
        raise AssertionError(f"Missing export '{export_name}' in frontend scene config")

    opening_index = source.find("{", marker_index)
    if opening_index < 0:
        raise AssertionError(f"Missing object start for export '{export_name}'")

    depth = 0
    for idx in range(opening_index, len(source)):
        char = source[idx]
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return source[opening_index + 1 : idx]

    raise AssertionError(f"Missing object end for export '{export_name}'")


def _extract_string_array(source: str, export_name: str) -> list[str]:
    pattern = re.compile(rf"export const {export_name}[^=]*=\s*\[(.*?)\]\s*(?:as const)?;", re.DOTALL)
    match = pattern.search(source)
    if not match:
        raise AssertionError(f"Missing array export '{export_name}' in frontend scene config")
    return re.findall(r'"([^\"]+)"', match.group(1))


def _extract_domain_keywords(source: str) -> dict[str, list[str]]:
    body = _extract_export_block(source, "SCENE_DOMAIN_KEYWORDS")
    keywords: dict[str, list[str]] = {}
    line_pattern = re.compile(r"^\s*(\w+):\s*\[(.*?)\],?\s*$")

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = line_pattern.match(line)
        if not match:
            raise AssertionError(f"Unexpected SCENE_DOMAIN_KEYWORDS line format: {raw_line}")
        domain = match.group(1)
        tokens = re.findall(r'"([^\"]+)"', match.group(2))
        keywords[domain] = tokens
    return keywords


def _extract_role_duration_seconds(source: str) -> dict[str, dict[str, int]]:
    body = _extract_export_block(source, "SCENE_ROLE_DURATION_SECONDS")
    durations: dict[str, dict[str, int]] = {}
    line_pattern = re.compile(r"^\s*(\w+):\s*\{\s*hook:\s*(\d+),\s*body:\s*(\d+),\s*cta:\s*(\d+)\s*\},?\s*$")

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = line_pattern.match(line)
        if not match:
            raise AssertionError(f"Unexpected SCENE_ROLE_DURATION_SECONDS line format: {raw_line}")
        domain = match.group(1)
        durations[domain] = {
            "hook": int(match.group(2)),
            "body": int(match.group(3)),
            "cta": int(match.group(4)),
        }
    return durations


def _extract_scene_defaults(source: str) -> dict[str, str]:
    body = _extract_export_block(source, "SCENE_DEFAULTS")
    result: dict[str, str] = {}
    line_pattern = re.compile(r"^\s*(\w+):\s*(.+?),?\s*$")

    option_map = {
        "SCENE_MUSIC_OPTIONS": _extract_string_array(source, "SCENE_MUSIC_OPTIONS"),
        "SCENE_CAMERA_OPTIONS": _extract_string_array(source, "SCENE_CAMERA_OPTIONS"),
        "SCENE_TRANSITION_OPTIONS": _extract_string_array(source, "SCENE_TRANSITION_OPTIONS"),
        "SCENE_CAPTION_STYLE_OPTIONS": _extract_string_array(source, "SCENE_CAPTION_STYLE_OPTIONS"),
        "SCENE_VOICE_PRESET_OPTIONS": _extract_string_array(source, "SCENE_VOICE_PRESET_OPTIONS"),
    }

    key_aliases = {
        "captionStyle": "caption_style",
    }

    for raw_line in body.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        match = line_pattern.match(line)
        if not match:
            raise AssertionError(f"Unexpected SCENE_DEFAULTS line format: {raw_line}")
        key = key_aliases.get(match.group(1), match.group(1))
        value = match.group(2)

        option_ref = re.match(r"^(\w+)\[(\d+)\]$", value)
        if option_ref and option_ref.group(1) in option_map:
            option_name = option_ref.group(1)
            option_index = int(option_ref.group(2))
            result[key] = option_map[option_name][option_index]
            continue

        literal = re.match(r'^"([^\"]+)"$', value)
        if literal:
            result[key] = literal.group(1)
            continue

        raise AssertionError(f"Unsupported SCENE_DEFAULTS value format: {value}")

    return result


def test_frontend_and_backend_scene_preset_contracts_match() -> None:
    source = _read_frontend_scene_config()

    assert _extract_string_array(source, "SCENE_MUSIC_OPTIONS") == list(SCENE_MUSIC_OPTIONS)
    assert _extract_string_array(source, "SCENE_CAMERA_OPTIONS") == list(SCENE_CAMERA_OPTIONS)
    assert _extract_string_array(source, "SCENE_TRANSITION_OPTIONS") == list(SCENE_TRANSITION_OPTIONS)
    assert _extract_string_array(source, "SCENE_CAPTION_STYLE_OPTIONS") == list(SCENE_CAPTION_STYLE_OPTIONS)
    assert _extract_string_array(source, "SCENE_VOICE_PRESET_OPTIONS") == list(SCENE_VOICE_PRESET_OPTIONS)

    frontend_domain_order = _extract_string_array(source, "SCENE_DOMAIN_DETECTION_ORDER")
    assert frontend_domain_order == list(SCENE_DOMAIN_DETECTION_ORDER)

    frontend_keywords = _extract_domain_keywords(source)
    backend_keywords = {
        domain: list(tokens)
        for domain, tokens in SCENE_DOMAIN_KEYWORDS.items()
        if domain != "general"
    }
    assert frontend_keywords == backend_keywords

    frontend_role_durations = _extract_role_duration_seconds(source)
    assert frontend_role_durations == SCENE_ROLE_DURATION_SECONDS

    frontend_defaults = _extract_scene_defaults(source)
    assert frontend_defaults == SCENE_DEFAULTS
