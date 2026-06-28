# Velynxia AI Media Suite - Phased Development Plan

Date: 2026-06-27

This document defines a practical, phased architecture and delivery plan for Velynxia AI Media Suite.

Companion execution templates:
- docs/strategy/velynxia-ai-media-suite-implementation-issue-templates.md
- docs/strategy/velynxia-ai-media-suite-ready-to-paste-github-issues-phases-1-10.md
- docs/strategy/issues/README.md

Strategic principle:
- Do not train a foundation model from scratch.
- Build one Velynxia AI platform that orchestrates best-in-class open-source and commercial models behind a single API.

## 1) Target Platform Architecture

### North-star architecture

```text
                    Velynxia AI Platform
                           |
     +---------------------+---------------------+
     |                     |                     |
  Web App              Mobile App          CRM/Automation
     |                     |                     |
     +-------------- API Gateway ---------------+
                           |
               Authentication and Billing
                           |
        +------------------+-------------------+
        |                  |                   |
    LLM Engine        Voice Engine      Image Engine
        |                  |                   |
        +------------ Automation Engine --------+
                           |
                    Workflow Builder
                           |
                     Database and Storage
```

### Core architectural goals

- Single Velynxia API surface for all AI services.
- Provider-agnostic routing for model portability.
- Unified auth, billing, analytics, and quotas.
- Separation of concerns:
  - Frontend delivery and UX
  - AI orchestration and routing
  - Workflow automation and integrations
  - Data, storage, and observability

## 2) Phase 1 - AI Gateway Foundation

Build api.velynxia.com as the unified service entrypoint.

### API surface

- /chat
- /image
- /voice
- /video
- /automation
- /documents

### Why this phase first

- One API key model for clients.
- Centralized usage tracking and billing.
- Easier provider switching over time.
- Shared caching and quota enforcement.
- Better reliability and governance.

### Phase 1 deliverables

- API gateway service (FastAPI).
- Request authentication (JWT/OAuth).
- Usage metering middleware.
- Per-tenant rate limiting and quotas.
- Request/response logging with trace IDs.
- Basic billing hooks (subscription tier checks).

## 3) Phase 2 - LLM Engine and Router

Enable chat, reasoning, and document-style prompting through a model router.

### Candidate models

- Llama 3.3
- Qwen 3
- Mistral
- DeepSeek
- Commercial fallback (for premium quality or edge cases)

### LLM routing concept

```text
POST /chat
   -> LLM Router
      -> Qwen or Llama or Mistral or OpenAI-compatible provider
```

### Routing policy (initial)

- Route by task class: chat, analysis, coding, summarization.
- Route by latency/price budget in user plan.
- Route by reliability health score.
- Support fallback chain on timeout/error.

### Phase 2 deliverables

- LLM provider adapters.
- Router policy module.
- Prompt templating + versioning.
- Conversation token accounting.
- Safety and moderation hooks.

## 4) Phase 3 - Voice AI (STT, TTS, Voice Profiles)

Voice stack has three capabilities:

### Speech-to-text

- Models: Whisper, Faster-Whisper.
- Output: timestamped transcript + confidence scores.

### Text-to-speech

- Models: Piper, XTTS.
- Output: downloadable audio and stream support.

### Voice profile workflow

```text
Upload voice sample -> Train/create voice profile -> Store profile -> Reuse in media generation
```

### Phase 3 deliverables

- /voice/transcribe endpoint.
- /voice/speak endpoint.
- Voice profile CRUD and secure storage.
- Consent and governance controls for cloning.

## 5) Phase 4 - Image Generation Pipeline

Add production image generation for media workflows.

### Candidate models

- FLUX
- Stable Diffusion XL

### Image workflow

```text
Prompt -> Generate -> Optional Upscale -> Download/Store
```

### Phase 4 deliverables

- /image/generate endpoint.
- Prompt safety filters.
- Job queue for asynchronous generation.
- Asset storage + signed delivery URLs.
- Optional background removal and edits.

## 6) Phase 5 - Video Generation Pipeline

Introduce staged, composable video generation.

### Video workflow

```text
Prompt -> Storyboard -> Images -> Animation -> Voice -> Music -> MP4
```

### Phase 5 deliverables

- /video/create endpoint with async job orchestration.
- Scene graph/storyboard data model.
- Integration points for open-source and commercial video APIs.
- Render pipeline status tracking.

## 7) Phase 6 - Automation Engine

Position automation as a core business-value feature.

### Automation pattern

```text
Trigger -> AI -> Decision -> Action
```

### Example business workflow

```text
Email arrives -> Summarize -> Create CRM lead -> Assign owner -> Send WhatsApp -> Create calendar event
```

### Integration targets

- Gmail
- Outlook
- Slack
- Teams
- CRM
- WhatsApp
- Shopify
- WordPress

### Phase 6 deliverables

- Event/trigger framework.
- Node-based workflow execution engine.
- Integration connector SDK.
- Retry, idempotency, and dead-letter handling.

## 8) Phase 7 - Prompt Library

Externalize prompts from code into managed templates.

### Prompt schema

- prompt_id
- template
- variables
- model preferences
- version and owner

### Example

```text
Marketing Post -> Company Name + Target Audience + Platform -> Generate
```

### Phase 7 deliverables

- Prompt template CRUD APIs.
- Variable validation rules.
- Template version control and rollback.
- Team sharing permissions.

## 9) Phase 8 - AI Memory (RAG Context Layer)

Move from full-history context to retrieval-based context injection.

### Memory flow

```text
User data -> Database + Vector DB -> Retrieve relevant context -> Inject into LLM request
```

### Phase 8 deliverables

- Embedding pipeline.
- Vector index management.
- Retrieval policies and ranking.
- Tenant isolation and privacy controls.

## 10) Phase 9 - Specialized AI Agents

Ship role-specific agents with distinct tools and prompt policies.

### Candidate agents

- Sales Agent
- Marketing Agent
- Image Agent
- Video Agent
- Finance Agent
- Coding Agent
- Customer Support Agent
- SEO Agent
- Proposal Writer Agent

### Phase 9 deliverables

- Agent runtime + tool registry.
- Agent-specific guardrails.
- Shared memory and task handoff protocols.

## 11) Phase 10 - Multi-Model Intelligent Router

Abstract model selection from users.

### Router behavior

```text
Request type -> Router -> Best engine
Chat -> Qwen/Llama
Image -> FLUX/SDXL
Voice -> XTTS
Speech -> Whisper
Automation -> Workflow Engine
```

### Phase 10 deliverables

- Real-time route optimization by SLA/cost/performance.
- Dynamic failover and provider degradation handling.
- A/B routing experiments and quality scoring.

## 12) Technology Stack (Recommended)

- Frontend: React + Next.js
- Backend: FastAPI (Python)
- Auth: JWT/OAuth
- Database: PostgreSQL
- Cache: Redis
- Queue: RabbitMQ or Redis Streams
- Storage: MinIO or S3-compatible object storage
- Vector DB: Qdrant
- AI orchestration: LangGraph (or equivalent)
- Containerization: Docker
- Reverse proxy/API edge: Nginx
- Monitoring: Grafana + Prometheus

## 13) Suggested Repository Structure

```text
velynxia-ai/
  backend/
    chat/
    image/
    voice/
    automation/
    video/
    auth/
    billing/
    agents/
    workflows/
  frontend/
    dashboard/
    studio/
    chatbot/
    automation/
    settings/
  models/
  storage/
  prompts/
  vector_db/
```

## 14) Deployment Topology for Current Velynxia Setup

This aligns with the current architecture direction:

- Next.js frontend remains on Vercel.
- FastAPI AI gateway runs as a dedicated backend service.
- PostgreSQL stores users, prompt templates, usage metadata, and workflow state.
- Raspberry Pi continues hosting CRM/automation services and integration workers.
- GPU-heavy inference runs on cloud GPU or dedicated AI server.

### Practical split of responsibilities

- Raspberry Pi:
  - Webhooks
  - CRM sync
  - Automation workers
  - Low-compute orchestration tasks
- GPU/cloud node:
  - LLM inference
  - Image/video generation
  - Batch media rendering

## 15) 12-Month Execution Roadmap

### Months 1-2

- AI Gateway
- User accounts and API auth
- Chat API
- Prompt library v1

### Months 3-4

- Image generation
- AI Media Studio workflows
- Background removal
- Core image editing pipeline

### Months 5-6

- Speech-to-text
- Text-to-speech
- Voice profile creation/cloning
- AI avatar support foundations

### Months 7-8

- Workflow automation engine
- Email and CRM integrations
- First specialized agents

### Months 9-10

- Video generation pipeline
- AI presenter/video composition
- Social media publishing integration

### Months 11-12

- Multi-agent collaboration
- Team workspaces and roles
- Billing and subscription maturity
- Prompt/template/workflow marketplace

## 16) Delivery Milestones and Exit Criteria

Use these criteria to mark each phase complete:

- Functional: endpoints and workflows are production-usable.
- Reliability: fallback and retry behavior is validated.
- Security: auth, tenant isolation, and auditability are in place.
- Cost control: request metering and budget limits are enforced.
- Observability: metrics, traces, and alert thresholds are active.

## 17) Immediate Next Build Sequence

1. Stand up FastAPI API gateway skeleton with /chat and /documents first.
2. Add auth, quota middleware, and usage metering.
3. Integrate one open-source LLM plus one commercial fallback.
4. Implement prompt library tables and API.
5. Add Redis caching and queue-based async job pattern to prepare for image/voice/video.

This sequence gives Velynxia a strong platform core before expanding to high-cost media generation services.
