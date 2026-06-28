# FastAPI Ollama Gateway (AI Media Suite)

This is a lightweight FastAPI gateway for local Ollama models with:

- Model fallback routing
- Timeout handling
- Structured error responses
- Optional streaming mode

## 1) Install

From this folder:

pip install -r requirements.txt

## 2) Configure

Copy .env.example to .env and adjust values if needed:

- OLLAMA_BASE_URL (default: http://localhost:11434)
- OLLAMA_MODEL_FALLBACKS (default: qwen2.5:7b,gemma3:4b)
- OLLAMA_TIMEOUT_SECONDS (default: 60)
- HOST, PORT, LOG_LEVEL

## 3) Run

python main.py

or

uvicorn main:app --host 0.0.0.0 --port 8001

## 4) Test

Health:

curl http://localhost:8001/health

Readiness (checks Ollama /api/tags):

curl http://localhost:8001/ready

Chat (non-streaming):

curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Write a LinkedIn post about AI automation.","stream":false}'

Chat (streaming NDJSON):

curl -N -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Give me 5 startup ideas.","stream":true}'

## 5) Integration Notes

- Use POST /chat from your Next.js app or internal backend.
- Send x-trace-id header if you already use distributed tracing.
- If preferred model fails or times out, fallback models are tried in order.

## 6) Model Tag Note

Use valid Ollama model tags (for example gemma3:4b, qwen2.5:7b).
If a tag is not available locally, pull it first:

ollama run gemma3:4b
