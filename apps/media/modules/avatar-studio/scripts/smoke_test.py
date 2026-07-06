#!/usr/bin/env python3
"""Basic smoke checks for Avatar Studio public deployment."""

from __future__ import annotations

import datetime as dt
import json
import os
import smtplib
import sys
from email.message import EmailMessage
from pathlib import Path
import urllib.error
import urllib.request


def fetch(url: str) -> tuple[int, str]:
    req = urllib.request.Request(url, headers={"User-Agent": "avatar-smoke-test/1.0"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        body = resp.read().decode("utf-8", errors="replace")
        return resp.status, body


def env_bool(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def load_state(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {}


def save_state(path: Path, state: dict[str, str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(state), encoding="utf-8")


def send_alert(subject: str, body: str) -> bool:
    to_addr = os.getenv("ALERT_EMAIL_TO", "admin@velynxia.com").strip()
    from_addr = os.getenv("ALERT_EMAIL_FROM", "").strip()
    smtp_host = os.getenv("SMTP_HOST", "").strip()
    smtp_user = os.getenv("SMTP_USERNAME", "").strip()
    smtp_pass = os.getenv("SMTP_PASSWORD", "").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    use_tls = env_bool("SMTP_USE_TLS", True)

    if not (to_addr and from_addr and smtp_host and smtp_user and smtp_pass):
        print(
            "WARN alert skipped: set ALERT_EMAIL_FROM, SMTP_HOST, SMTP_USERNAME, SMTP_PASSWORD"
        )
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg.set_content(body)

    if use_tls:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    else:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

    print(f"ALERT sent to {to_addr}")
    return True


def check_frontend(base_url: str) -> bool:
    status, _ = fetch(base_url)
    if status != 200:
        print(f"FAIL frontend {base_url} -> {status}")
        return False
    print(f"PASS frontend {base_url} -> {status}")
    return True


def check_api_health(base_url: str) -> bool:
    url = f"{base_url.rstrip('/')}/api/health"
    status, body = fetch(url)
    if status != 200:
        print(f"FAIL api health {url} -> {status}")
        return False
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        print(f"FAIL api health {url} -> non-JSON response")
        return False
    if payload.get("status") != "ok":
        print(f"FAIL api health {url} -> unexpected payload {payload}")
        return False
    print(f"PASS api health {url} -> {status}")
    return True


def check_projects(base_url: str) -> bool:
    url = f"{base_url.rstrip('/')}/api/projects"
    status, body = fetch(url)
    if status != 200:
        print(f"FAIL projects {url} -> {status}")
        return False
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        print(f"FAIL projects {url} -> non-JSON response")
        return False
    if "projects" not in payload:
        print(f"FAIL projects {url} -> missing 'projects' key")
        return False
    print(f"PASS projects {url} -> {status}")
    return True


def handle_alerts(base_url: str, status: str, details: str) -> None:
    if not env_bool("ALERT_EMAIL_ENABLED", True):
        return

    state_path = Path(os.getenv("ALERT_STATE_FILE", ".smoke_monitor_state.json"))
    state = load_state(state_path)
    previous = state.get("status", "unknown")

    now = dt.datetime.now(dt.timezone.utc).isoformat()
    host = base_url.rstrip("/")
    if status == "fail":
        send_alert(
            subject=f"[Avatar Studio] Smoke Check FAILED - {host}",
            body=f"Time (UTC): {now}\nTarget: {host}\n\n{details}",
        )
    elif previous == "fail" and env_bool("ALERT_EMAIL_ON_RECOVERY", True):
        send_alert(
            subject=f"[Avatar Studio] Smoke Check RECOVERED - {host}",
            body=f"Time (UTC): {now}\nTarget: {host}\n\nAll smoke checks passed.",
        )

    state["status"] = status
    state["last_run_utc"] = now
    save_state(state_path, state)


def main() -> int:
    base_url = os.getenv("AVATAR_BASE_URL", "https://avatar.velynxia.com").strip()

    if not base_url.startswith(("http://", "https://")):
        print("FAIL AVATAR_BASE_URL must start with http:// or https://")
        handle_alerts(base_url, "fail", "Invalid AVATAR_BASE_URL")
        return 2

    checks = [
        check_frontend(base_url),
        check_api_health(base_url),
        check_projects(base_url),
    ]

    if all(checks):
        print("SMOKE TEST PASSED")
        handle_alerts(base_url, "pass", "All checks passed")
        return 0

    print("SMOKE TEST FAILED")
    handle_alerts(base_url, "fail", "One or more smoke checks failed")
    return 1


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (urllib.error.URLError, TimeoutError) as exc:
        print(f"FAIL request error: {exc}")
        base_url = os.getenv("AVATAR_BASE_URL", "https://avatar.velynxia.com").strip()
        handle_alerts(base_url, "fail", f"Request error: {exc}")
        raise SystemExit(1)
