from __future__ import annotations

import json
import logging
import os
import uuid
from typing import AsyncGenerator, Optional

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field


def _env(name: str, default: str) -> str:
    value = os.getenv(name)
    return value if value else default


OLLAMA_BASE_URL = _env("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
MODEL_FALLBACKS = [
    m.strip() for m in _env("OLLAMA_MODEL_FALLBACKS", "qwen2.5:7b,gemma3:4b").split(",") if m.strip()
]
DEFAULT_TIMEOUT_SECONDS = float(_env("OLLAMA_TIMEOUT_SECONDS", "60"))

logging.basicConfig(
    level=getattr(logging, _env("LOG_LEVEL", "INFO").upper(), logging.INFO),
    format="%(asctime)s %(levelname)s trace_id=%(trace_id)s %(message)s",
)
LOGGER = logging.getLogger("ai-gateway")

app = FastAPI(title="Velynxia AI Gateway (FastAPI + Ollama)", version="1.0.0")


class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, description="User prompt to send to model")
    model: Optional[str] = Field(None, description="Preferred model tag, optional")
    stream: bool = Field(False, description="Return streamed NDJSON when true")
    timeout_seconds: Optional[float] = Field(None, gt=0, le=300)
    temperature: Optional[float] = Field(None, ge=0, le=2)


class ErrorEnvelope(BaseModel):
    code: str
    message: str
    trace_id: str
    details: Optional[dict] = None


def _error_response(status_code: int, code: str, message: str, trace_id: str, details: Optional[dict] = None) -> JSONResponse:
    payload = {"error": ErrorEnvelope(code=code, message=message, trace_id=trace_id, details=details).model_dump()}
    return JSONResponse(status_code=status_code, content=payload)


@app.middleware("http")
async def trace_middleware(request: Request, call_next):
    trace_id = request.headers.get("x-trace-id") or str(uuid.uuid4())
    request.state.trace_id = trace_id

    adapter = logging.LoggerAdapter(LOGGER, {"trace_id": trace_id})
    adapter.info("request_start method=%s path=%s", request.method, request.url.path)

    response = await call_next(request)
    response.headers["x-trace-id"] = trace_id

    adapter.info("request_end method=%s path=%s status=%s", request.method, request.url.path, response.status_code)
    return response


@app.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@app.get("/ready")
async def ready(request: Request):
    trace_id = request.state.trace_id
    adapter = logging.LoggerAdapter(LOGGER, {"trace_id": trace_id})

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            response.raise_for_status()
            data = response.json()
            models = [m.get("name") for m in data.get("models", [])]
            return {"status": "ready", "ollama_models": models}
    except Exception as exc:  # noqa: BLE001
        adapter.exception("ready_check_failed")
        return _error_response(
            503,
            "OLLAMA_UNAVAILABLE",
            "Ollama is unreachable or returned an error.",
            trace_id,
            {"exception": str(exc)},
        )


def _candidate_models(preferred: Optional[str]) -> list[str]:
    if preferred:
        return [preferred] + [m for m in MODEL_FALLBACKS if m != preferred]
    return MODEL_FALLBACKS


async def _stream_generate(
    trace_id: str,
    payload: dict,
    timeout_seconds: float,
) -> AsyncGenerator[bytes, None]:
    adapter = logging.LoggerAdapter(LOGGER, {"trace_id": trace_id})
    adapter.info("ollama_stream_start model=%s", payload.get("model"))

    timeout = httpx.Timeout(timeout_seconds)
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream("POST", f"{OLLAMA_BASE_URL}/api/generate", json=payload) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line:
                    continue
                yield (line + "\n").encode("utf-8")


@app.post("/chat")
async def chat(request: Request, body: ChatRequest):
    trace_id = request.state.trace_id
    adapter = logging.LoggerAdapter(LOGGER, {"trace_id": trace_id})
    timeout_seconds = body.timeout_seconds or DEFAULT_TIMEOUT_SECONDS

    models_to_try = _candidate_models(body.model)
    if not models_to_try:
        return _error_response(
            500,
            "MODEL_CONFIG_INVALID",
            "No models configured. Set OLLAMA_MODEL_FALLBACKS.",
            trace_id,
        )

    for index, model_name in enumerate(models_to_try):
        payload = {
            "model": model_name,
            "prompt": body.prompt,
            "stream": body.stream,
        }
        if body.temperature is not None:
            payload["options"] = {"temperature": body.temperature}

        try:
            adapter.info("ollama_attempt model=%s attempt=%s", model_name, index + 1)

            if body.stream:
                stream = _stream_generate(trace_id=trace_id, payload=payload, timeout_seconds=timeout_seconds)
                headers = {"x-model-selected": model_name, "x-trace-id": trace_id}
                return StreamingResponse(stream, media_type="application/x-ndjson", headers=headers)

            timeout = httpx.Timeout(timeout_seconds)
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(f"{OLLAMA_BASE_URL}/api/generate", json=payload)
                response.raise_for_status()
                data = response.json()

            return {
                "trace_id": trace_id,
                "model_selected": model_name,
                "response": data.get("response", ""),
                "done": bool(data.get("done", True)),
                "raw": data,
            }
        except httpx.TimeoutException:
            adapter.warning("ollama_timeout model=%s timeout_seconds=%s", model_name, timeout_seconds)
            if index == len(models_to_try) - 1:
                return _error_response(
                    504,
                    "LLM_TIMEOUT",
                    "All configured models timed out.",
                    trace_id,
                    {"timeout_seconds": timeout_seconds, "models_tried": models_to_try},
                )
        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            adapter.warning("ollama_http_error model=%s status=%s", model_name, status)
            if index == len(models_to_try) - 1:
                details = {
                    "status_code": status,
                    "response_body": exc.response.text,
                    "models_tried": models_to_try,
                }
                return _error_response(502, "OLLAMA_HTTP_ERROR", "Model provider returned an error.", trace_id, details)
        except Exception as exc:  # noqa: BLE001
            adapter.exception("ollama_unexpected_error model=%s", model_name)
            if index == len(models_to_try) - 1:
                return _error_response(
                    500,
                    "LLM_UNEXPECTED_ERROR",
                    "Unexpected error while generating model response.",
                    trace_id,
                    {"exception": str(exc), "models_tried": models_to_try},
                )

    return _error_response(500, "UNREACHABLE", "Unexpected routing state reached.", trace_id)


@app.get("/")
async def root() -> dict:
    return {
        "service": "velynxia-ai-gateway-fastapi",
        "endpoints": ["GET /health", "GET /ready", "POST /chat"],
        "fallback_models": MODEL_FALLBACKS,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=_env("HOST", "0.0.0.0"),
        port=int(_env("PORT", "8001")),
        reload=False,
        log_level=_env("LOG_LEVEL", "info"),
    )
