from __future__ import annotations

import subprocess
from dataclasses import dataclass
from time import perf_counter
from collections.abc import Callable

RunResult = subprocess.CompletedProcess[str]
RunCommand = Callable[..., RunResult]


@dataclass
class RenderExecutionTelemetry:
    attempt_count: int
    fallback_used: bool
    duration_ms: int

    def to_dict(self) -> dict[str, int | bool]:
        return {
            "attemptCount": self.attempt_count,
            "fallbackUsed": self.fallback_used,
            "durationMs": self.duration_ms,
        }


class FfmpegRenderExecutor:
    def __init__(self, runner: RunCommand | None = None) -> None:
        self._runner: RunCommand = runner or subprocess.run

    def _run(self, command: list[str]) -> RunResult:
        return self._runner(command, capture_output=True, text=True, check=False)

    @staticmethod
    def _inject_vf_fallback(command: list[str], fallback_filter_chain: str) -> list[str] | None:
        if not fallback_filter_chain:
            return None
        if "-vf" not in command:
            return None

        fallback_command = list(command)
        vf_index = fallback_command.index("-vf") + 1
        if vf_index >= len(fallback_command):
            return None

        fallback_command[vf_index] = fallback_filter_chain
        return fallback_command

    def execute(self, command: list[str], fallback_filter_chain: str = "") -> RunResult:
        completed, _ = self.execute_with_telemetry(command, fallback_filter_chain)
        return completed

    def execute_with_telemetry(
        self,
        command: list[str],
        fallback_filter_chain: str = "",
    ) -> tuple[RunResult, RenderExecutionTelemetry]:
        started = perf_counter()
        attempt_count = 1
        fallback_used = False

        completed = self._run(command)
        if completed.returncode == 0:
            duration_ms = int((perf_counter() - started) * 1000)
            telemetry = RenderExecutionTelemetry(
                attempt_count=attempt_count,
                fallback_used=fallback_used,
                duration_ms=duration_ms,
            )
            return completed, telemetry

        fallback_command = self._inject_vf_fallback(command, fallback_filter_chain)
        if fallback_command is None:
            duration_ms = int((perf_counter() - started) * 1000)
            telemetry = RenderExecutionTelemetry(
                attempt_count=attempt_count,
                fallback_used=fallback_used,
                duration_ms=duration_ms,
            )
            return completed, telemetry

        fallback_used = True
        attempt_count += 1
        fallback_completed = self._run(fallback_command)
        duration_ms = int((perf_counter() - started) * 1000)
        telemetry = RenderExecutionTelemetry(
            attempt_count=attempt_count,
            fallback_used=fallback_used,
            duration_ms=duration_ms,
        )
        return fallback_completed, telemetry
