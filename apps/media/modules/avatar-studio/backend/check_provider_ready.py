from app.config import settings


def main() -> int:
    issues: list[str] = []
    avatar_provider = settings.avatar_provider.strip().lower()
    ai_provider = settings.ai_provider.strip().lower()
    voice_provider = settings.voice_provider.strip().lower()

    if avatar_provider in {"openai", "chatgpt"}:
        if not settings.openai_api_key.strip():
            issues.append("OPENAI_API_KEY is empty for AVATAR_PROVIDER=openai")
    elif avatar_provider == "gemini":
        if not settings.gemini_api_key.strip():
            issues.append("GEMINI_API_KEY is empty for AVATAR_PROVIDER=gemini")
    elif avatar_provider == "heygen":
        if not settings.heygen_api_key.strip():
            issues.append("HEYGEN_API_KEY is empty for AVATAR_PROVIDER=heygen")
        if not settings.heygen_default_avatar_id.strip():
            issues.append("HEYGEN_DEFAULT_AVATAR_ID is empty (recommended for local UUID avatars)")
    elif avatar_provider in {"local-lipsync", "lipsync", "lip-sync", "local"}:
        pass
    else:
        issues.append("AVATAR_PROVIDER must be openai, gemini, heygen, or local-lipsync")

    if ai_provider in {"openai", "chatgpt"} and not settings.openai_api_key.strip():
        issues.append("OPENAI_API_KEY is empty for AI_PROVIDER=openai")
    elif ai_provider == "gemini" and not settings.gemini_api_key.strip():
        issues.append("GEMINI_API_KEY is empty for AI_PROVIDER=gemini")
    elif ai_provider not in {"openai", "chatgpt", "gemini", "local", "local-llm"}:
        issues.append("AI_PROVIDER must be openai, gemini, or local")

    if voice_provider not in {"openai", "local", "system"}:
        issues.append("VOICE_PROVIDER must be openai, local, or system")

    if avatar_provider == "heygen" and settings.heygen_enable_dev_fallback:
        issues.append("HEYGEN_ENABLE_DEV_FALLBACK is enabled (set false to force real-provider-only mode)")

    if settings.app_base_url.startswith("http://localhost"):
        issues.append("APP_BASE_URL uses localhost (127.0.0.1 is recommended for local playback reliability)")

    print("Avatar Studio Provider Readiness")
    print(f"ai_provider={settings.ai_provider}")
    print(f"avatar_provider={settings.avatar_provider}")
    print(f"voice_provider={settings.voice_provider}")
    print(f"openai_model={settings.openai_model}")
    print(f"gemini_model={settings.gemini_model}")
    print(f"heygen_api_base_url={settings.heygen_api_base_url}")

    if not issues:
        print("READY: provider mode is fully configured")
        return 0

    print("NOT READY:")
    for item in issues:
        print(f"- {item}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
