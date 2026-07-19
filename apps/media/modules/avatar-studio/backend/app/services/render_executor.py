from __future__ import annotations

import subprocess
from collections.abc import Callable

RunResult = subprocess.CompletedProcess[str]
RunCommand = Callable[..., RunResult]


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
        completed = self._run(command)
        if completed.returncode == 0:
            return completed

        fallback_command = self._inject_vf_fallback(command, fallback_filter_chain)
        if fallback_command is None:
            return completed

        return self._run(fallback_command)
