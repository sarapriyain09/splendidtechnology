import subprocess

from app.services.render_executor import FfmpegRenderExecutor


def _completed(returncode: int, stderr: str = "") -> subprocess.CompletedProcess[str]:
    return subprocess.CompletedProcess(args=["ffmpeg"], returncode=returncode, stdout="", stderr=stderr)


def test_execute_returns_first_success_without_retry() -> None:
    calls: list[list[str]] = []

    def runner(command, capture_output, text, check):
        calls.append(list(command))
        return _completed(0)

    executor = FfmpegRenderExecutor(runner=runner)
    command = ["ffmpeg", "-y", "-vf", "A", "out.mp4"]

    result = executor.execute(command, "B")

    assert result.returncode == 0
    assert len(calls) == 1
    assert calls[0] == command

    detailed_result, telemetry = executor.execute_with_telemetry(command, "B")
    assert detailed_result.returncode == 0
    assert telemetry.attempt_count == 1
    assert telemetry.fallback_used is False
    assert telemetry.duration_ms >= 0


def test_execute_retries_with_fallback_when_first_run_fails() -> None:
    calls: list[list[str]] = []
    attempts = {"count": 0}

    def runner(command, capture_output, text, check):
        calls.append(list(command))
        attempts["count"] += 1
        if attempts["count"] == 1:
            return _completed(1, "first fail")
        return _completed(0)

    executor = FfmpegRenderExecutor(runner=runner)
    command = ["ffmpeg", "-y", "-vf", "PRIMARY", "out.mp4"]

    result = executor.execute(command, "FALLBACK")

    assert result.returncode == 0
    assert len(calls) == 2
    assert calls[0][3] == "PRIMARY"
    assert calls[1][3] == "FALLBACK"

    attempts["count"] = 0
    calls.clear()
    detailed_result, telemetry = executor.execute_with_telemetry(command, "FALLBACK")
    assert detailed_result.returncode == 0
    assert telemetry.attempt_count == 2
    assert telemetry.fallback_used is True
    assert telemetry.duration_ms >= 0


def test_execute_no_retry_when_fallback_missing() -> None:
    calls: list[list[str]] = []

    def runner(command, capture_output, text, check):
        calls.append(list(command))
        return _completed(1, "failure")

    executor = FfmpegRenderExecutor(runner=runner)
    command = ["ffmpeg", "-y", "-vf", "PRIMARY", "out.mp4"]

    result = executor.execute(command, "")

    assert result.returncode == 1
    assert len(calls) == 1


def test_execute_no_retry_when_vf_not_present() -> None:
    calls: list[list[str]] = []

    def runner(command, capture_output, text, check):
        calls.append(list(command))
        return _completed(1, "failure")

    executor = FfmpegRenderExecutor(runner=runner)
    command = ["ffmpeg", "-y", "-i", "in.wav", "out.mp4"]

    result = executor.execute(command, "FALLBACK")

    assert result.returncode == 1
    assert len(calls) == 1
