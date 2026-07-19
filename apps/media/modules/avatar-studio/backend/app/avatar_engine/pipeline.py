from __future__ import annotations

from collections.abc import Callable
from time import perf_counter

from app.avatar_engine.models import RenderJobStatus


class PipelineTracker:
    def __init__(self, on_stage: Callable[[RenderJobStatus], None]) -> None:
        self._on_stage = on_stage
        self._marks: dict[str, float] = {}

    def mark(self, stage: RenderJobStatus) -> None:
        self._marks[stage.value] = perf_counter()
        self._on_stage(stage)

    def durations(self) -> dict[str, float]:
        ordered = [
            RenderJobStatus.LOADING_MODELS,
            RenderJobStatus.ANIMATING_FACE,
            RenderJobStatus.LIP_SYNC,
            RenderJobStatus.RENDERING,
        ]
        result: dict[str, float] = {}
        for prev, cur in zip(ordered, ordered[1:]):
            if prev.value in self._marks and cur.value in self._marks:
                result[f"{prev.value}->{cur.value}"] = round(self._marks[cur.value] - self._marks[prev.value], 4)
        return result
