# Velynxia AI Media Suite - Ready-to-Paste GitHub Issues (Phases 1-10)

Date: 2026-06-27

These are copy-ready issue bodies for immediate execution.

Owner guidance used:
- AI Platform Lead: FastAPI gateway, auth, quotas, routing, billing hooks.
- LLM Engineer: provider adapters, routing policy, token/cost controls.
- Voice/Media Engineer: STT/TTS pipeline, voice profiles, asset handling.
- Pi/Automation Engineer: webhook workers, queue workers, integration reliability.
- Frontend Lead: dashboard integration, status visibility, QA support.

## Issue 1 - Phase 1: AI Gateway Foundation

Title:
Phase 1 - AI Gateway Foundation (api.velynxia.com)

Labels:
ai-platform, backend, api-gateway, phase-1, priority-high

Assignees (suggested):
- Owner: AI Platform Lead
- Support: Pi/Automation Engineer
- Support: Frontend Lead

Body:

### Objective
Build the unified Velynxia API gateway so all AI requests flow through one authenticated, metered, quota-aware backend.

### Scope
- FastAPI gateway skeleton and base endpoints.
- Auth middleware (JWT/OAuth).
- Tenant quotas and rate limiting.
- Usage metering and traceable request logging.
- Billing entitlement checks.

### Engineering checklist
- [ ] Create FastAPI gateway service with shared middleware stack.
- [ ] Implement routes:
  - [ ] /chat
  - [ ] /image
  - [ ] /voice
  - [ ] /video
  - [ ] /automation
  - [ ] /documents
- [ ] Add JWT/OAuth verification middleware.
- [ ] Add tenant context extraction and policy checks.
- [ ] Add rate limit + quota middleware (tenant plan aware).
- [ ] Add usage event logging (tenant, endpoint, model class, token count, latency, status).
- [ ] Add billing entitlement middleware (plan capability guard).
- [ ] Add health/readiness endpoints and deployment smoke test.
- [ ] Add standard error envelope and correlation ID in all responses.

### Acceptance criteria
- [ ] Unauthenticated requests fail with consistent 401/403 responses.
- [ ] Quota exceeded requests fail with deterministic 429 response payload.
- [ ] Every request produces a trace ID and usage event.
- [ ] Billing guard blocks disallowed features by plan.
- [ ] Base route smoke tests pass in staging.

### Non-functional requirements
- [ ] Metrics exported (request rate, p95 latency, error rate, quota hit rate).
- [ ] Alerts configured for 5xx spikes and latency threshold breaches.
- [ ] Runbook published for gateway outage, auth failure, and quota misconfiguration.

### Dependencies
- PostgreSQL availability for usage and tenant metadata.
- Redis availability for rate-limit counters.

### Risks
- Inconsistent tenant identity across services.
- Hidden latency overhead from middleware chain.

### Definition of done
- [ ] Staging deployment signed off.
- [ ] Production deployment completed.
- [ ] Post-release validation completed with real tenant traffic sample.

## Issue 2 - Phase 2: LLM Engine and Router

Title:
Phase 2 - LLM Engine and Router (Policy + Fallback)

Labels:
ai-platform, llm, routing, phase-2, priority-high

Assignees (suggested):
- Owner: LLM Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Deliver provider-agnostic LLM routing with policy-based model selection, fallback handling, and usage/cost controls.

### Scope
- Open-source + commercial provider adapters.
- Task-aware router policy.
- Timeout and fallback chain.
- Token accounting and cost estimation.
- Prompt template integration.

### Engineering checklist
- [ ] Implement at least two provider adapters:
  - [ ] Open-source model endpoint (e.g., Qwen/Llama/Mistral host)
  - [ ] Commercial fallback adapter
- [ ] Implement task classifier (chat, summarize, analyze, coding).
- [ ] Build routing policy by latency budget, quality target, and plan constraints.
- [ ] Add timeout, retry, and fallback chain handling.
- [ ] Add token accounting for prompt/completion per request.
- [ ] Add cost estimator and persist cost telemetry.
- [ ] Integrate prompt template lookup/version pinning.
- [ ] Add safety/moderation hooks pre- and post-generation.
- [ ] Add synthetic test harness for provider outage simulation.

### Acceptance criteria
- [ ] Router selects expected model for policy test fixtures.
- [ ] On provider timeout, fallback returns a successful response in defined SLA.
- [ ] Token usage and estimated cost are logged for all responses.
- [ ] Unsafe prompts/responses are intercepted by moderation controls.
- [ ] Feature can be toggled per tenant/plan.

### Non-functional requirements
- [ ] P95 response latency target for /chat documented and met in staging.
- [ ] Cost guardrails enforce plan-level budget ceiling behavior.
- [ ] Routing decisions are explainable via logs/audit fields.

### Dependencies
- Phase 1 gateway middleware and usage schema.
- Prompt template schema (minimum viable form).

### Risks
- Quality variance across providers for same prompt.
- Cost regressions if fallback policy is too aggressive.

### Definition of done
- [ ] Staging load test passes under expected concurrency.
- [ ] Provider failover drill completed.
- [ ] Production rollout completed behind feature flag.

## Issue 3 - Phase 3: Voice AI (STT, TTS, Voice Profiles)

Title:
Phase 3 - Voice AI Stack (Transcribe, Speak, Profiles)

Labels:
ai-media, voice, stt, tts, phase-3, priority-high

Assignees (suggested):
- Owner: Voice/Media Engineer
- Support: AI Platform Lead
- Support: Pi/Automation Engineer

Body:

### Objective
Ship production voice capabilities for transcription, speech synthesis, and reusable voice profiles.

### Scope
- /voice/transcribe (Whisper/Faster-Whisper style adapter).
- /voice/speak (Piper/XTTS style adapter).
- Voice profile management and secure media asset storage.
- Consent/audit controls for cloning workflows.

### Engineering checklist
- [ ] Implement /voice/transcribe endpoint with async option for long files.
- [ ] Implement /voice/speak endpoint with selectable voice profile.
- [ ] Implement voice profile CRUD API.
- [ ] Add secure upload handling for reference audio.
- [ ] Add object storage integration for source and generated audio.
- [ ] Add signed URL access with short TTL for downloads.
- [ ] Add consent capture fields and immutable audit log for cloning actions.
- [ ] Add worker queue for long-running STT/TTS jobs.
- [ ] Add webhook/callback or polling endpoint for async job status.

### Acceptance criteria
- [ ] Uploaded speech is transcribed with timestamps and confidence scores.
- [ ] Text input produces playable audio output in target formats.
- [ ] Voice profile can be created and used in synthesis requests.
- [ ] Cross-tenant media access is blocked by policy.
- [ ] Consent is mandatory for clone-enabled workflows.

### Non-functional requirements
- [ ] Throughput baseline captured for 30-second and 5-minute audio samples.
- [ ] Queue retries and dead-letter behavior validated.
- [ ] Audio processing error taxonomy documented and monitored.

### Dependencies
- Phase 1 gateway auth/quota/metering.
- Storage bucket and lifecycle policy.
- Queue infrastructure (Redis Streams or RabbitMQ).

### Risks
- High compute cost for long audio workloads.
- Legal/compliance edge cases for voice cloning.

### Definition of done
- [ ] End-to-end demo passes: upload sample -> create profile -> generate speech.
- [ ] Compliance wording and consent UX signed off.
- [ ] Staging and production rollouts completed with monitoring.

## Issue 4 - Phase 4: Image Generation Pipeline

Title:
Phase 4 - Image Generation Pipeline (Async + Safety + Asset Delivery)

Labels:
ai-media, image-generation, queue, phase-4, priority-high

Assignees (suggested):
- Owner: Voice/Media Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Deliver a production-grade image pipeline with asynchronous jobs, prompt safety controls, and secure asset delivery.

### Scope
- /image/generate endpoint.
- Async queue workers for generation and post-processing.
- Safety and policy checks.
- Signed URL asset delivery.

### Engineering checklist
- [ ] Implement /image/generate endpoint with request validation.
- [ ] Add async job orchestration and job status endpoints.
- [ ] Integrate model adapters for FLUX and SDXL-compatible backends.
- [ ] Add prompt safety classifier and blocked-category handling.
- [ ] Add post-processing stages:
  - [ ] Upscale
  - [ ] Optional background removal
- [ ] Store generated assets with metadata (model, seed, dimensions, cost).
- [ ] Return short-lived signed URLs for asset access.
- [ ] Add retry strategy and dead-letter handling for failed jobs.

### Acceptance criteria
- [ ] Generation requests return job ID and initial queued status.
- [ ] Job lifecycle transitions are visible (queued -> running -> completed/failed).
- [ ] Unsafe prompts are rejected with policy-aligned responses.
- [ ] Completed jobs return valid image URLs and metadata.
- [ ] Expired signed URLs are unusable after TTL.

### Non-functional requirements
- [ ] Queue throughput baseline documented.
- [ ] Generation failure reasons classified and measurable.
- [ ] Cost-per-image telemetry visible in dashboard.

### Dependencies
- Phase 1 gateway and usage metering.
- Queue infrastructure and object storage.

### Risks
- GPU compute spikes under concurrent generation load.
- False positives in prompt safety filtering.

### Definition of done
- [ ] End-to-end flow validated from dashboard prompt submission to download.
- [ ] Staging load test passes for agreed concurrency target.
- [ ] Production rollout with alerts and rollback plan completed.

## Issue 5 - Phase 5: Video Generation Pipeline

Title:
Phase 5 - Video Generation Pipeline (Storyboard to MP4)

Labels:
ai-media, video-generation, orchestration, phase-5, priority-high

Assignees (suggested):
- Owner: Voice/Media Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Launch a staged video pipeline that composes storyboard, visuals, animation, voice, and audio into final MP4 outputs.

### Scope
- /video/create endpoint with async orchestration.
- Scene/storyboard data model.
- Multi-stage rendering with resumable retries.
- Final artifact storage and retrieval.

### Engineering checklist
- [ ] Implement /video/create endpoint and request schema.
- [ ] Create scene graph/storyboard schema (shots, durations, narration, transitions).
- [ ] Build render pipeline stages:
  - [ ] Storyboard generation
  - [ ] Image generation
  - [ ] Animation/compositing
  - [ ] Voiceover generation
  - [ ] Music layer
  - [ ] Final mux/export to MP4
- [ ] Add stage-level retry and resume from failed stage.
- [ ] Persist run logs and stage diagnostics per video job.
- [ ] Add status polling and optional webhook callback for completion.

### Acceptance criteria
- [ ] Prompt-driven job produces downloadable MP4 in staging.
- [ ] Failed stage retries without rerunning successful prior stages.
- [ ] Output duration is within defined tolerance of storyboard duration.
- [ ] Job status and failure diagnostics are visible through API.
- [ ] Final video is stored with signed URL retrieval.

### Non-functional requirements
- [ ] Render SLA defined by duration tiers.
- [ ] Retry/backoff strategy validated under synthetic failures.
- [ ] Storage lifecycle policy configured for intermediates vs final outputs.

### Dependencies
- Phases 3 and 4 services (voice + image).
- Queue and storage infrastructure.

### Risks
- Pipeline complexity causing long tail failure modes.
- Unpredictable render times under heavy load.

### Definition of done
- [ ] Reference template project shipped in AI Media Studio.
- [ ] Support runbook for stuck/failed renders published.
- [ ] Controlled production rollout completed.

## Issue 6 - Phase 6: Automation Engine

Title:
Phase 6 - Automation Engine and Connector Framework

Labels:
automation, integrations, workflow-engine, phase-6, priority-high

Assignees (suggested):
- Owner: Pi/Automation Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Ship a trigger -> AI -> action workflow engine with reliable connectors and execution visibility.

### Scope
- Workflow runtime and node execution.
- Connector SDK and initial integrations.
- Idempotency, retries, dead-letter queue, and replay.
- Execution audit trail and operational monitoring.

### Engineering checklist
- [ ] Build workflow runtime with node types (trigger, transform, AI, condition, action).
- [ ] Add connector SDK with auth abstraction.
- [ ] Implement initial connectors:
  - [ ] Gmail
  - [ ] Outlook
  - [ ] CRM
  - [ ] WhatsApp
  - [ ] Calendar
- [ ] Add idempotency keys for event-driven workflows.
- [ ] Add retry policy and dead-letter queue handling.
- [ ] Add execution logs and replay endpoint.
- [ ] Add Pi worker integration for webhook and low-compute background tasks.

### Acceptance criteria
- [ ] Reference workflow succeeds: email arrives -> summarize -> create CRM lead -> assign owner -> send message -> create calendar event.
- [ ] Duplicate trigger events do not produce duplicate actions.
- [ ] Failed actions are retried and then dead-lettered when exhausted.
- [ ] Node-level execution history is queryable for debugging.
- [ ] Connector auth errors are surfaced with actionable diagnostics.

### Non-functional requirements
- [ ] Workflow success/failure rate metrics are dashboarded.
- [ ] Queue backlog alerts configured.
- [ ] Credential rotation procedure documented.

### Dependencies
- Phase 1 gateway auth and tenant context.
- Existing Pi-hosted CRM/automation services.
- Queue and webhook ingress.

### Risks
- External API rate limits and connector reliability variance.
- Workflow side effects from non-idempotent downstream systems.

### Definition of done
- [ ] At least 3 production-ready workflow templates published.
- [ ] On-call runbook for integration failures completed.
- [ ] Production rollout completed with post-release validation.

## Issue 7 - Phase 7: Prompt Library

Title:
Phase 7 - Prompt Library and Versioning

Labels:
ai-platform, prompts, template-management, phase-7, priority-medium

Assignees (suggested):
- Owner: LLM Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Move prompts from hardcoded strings into a managed library with variable schemas, versioning, and permissions.

### Scope
- Prompt template CRUD and RBAC.
- Variable schema validation.
- Draft/publish lifecycle and rollback.
- Prompt usage analytics by template ID.

### Engineering checklist
- [ ] Create prompt data model (id, template, variables, owner, version, status).
- [ ] Implement prompt CRUD APIs with tenant and role checks.
- [ ] Add variable type validation, defaults, and required flags.
- [ ] Add draft/published state transitions and rollback endpoint.
- [ ] Integrate prompt lookup/version pinning into LLM execution flow.
- [ ] Add audit log for template changes.
- [ ] Add dashboard views for create/edit/publish and usage stats.

### Acceptance criteria
- [ ] Template renders valid final prompt from variable input.
- [ ] Invalid variables fail with clear validation errors.
- [ ] Rollback restores previously published template version.
- [ ] Unauthorized users cannot edit or publish templates.
- [ ] Usage analytics can be filtered by template ID and tenant.

### Non-functional requirements
- [ ] Edit history is immutable and queryable.
- [ ] Template fetch latency is within defined budget.
- [ ] Backward compatibility maintained for existing prompt callers.

### Dependencies
- Phase 2 router and prompt execution path.
- PostgreSQL schema migrations.

### Risks
- Prompt regression from uncontrolled template edits.
- Schema mismatch between template variables and frontend forms.

### Definition of done
- [ ] 10+ internal prompts migrated from code to prompt library.
- [ ] Prompt publishing process documented for team use.
- [ ] Production rollout completed with change audit enabled.

## Issue 8 - Phase 8: AI Memory (RAG)

Title:
Phase 8 - AI Memory and Retrieval Layer (RAG)

Labels:
ai-platform, rag, vector-db, phase-8, priority-medium

Assignees (suggested):
- Owner: LLM Engineer
- Support: AI Platform Lead
- Support: Pi/Automation Engineer

Body:

### Objective
Implement retrieval-augmented context injection to improve answer quality and reduce token overhead.

### Scope
- Ingestion and chunking pipeline.
- Embeddings and vector indexing.
- Retrieval API and ranking policy.
- Tenant isolation and retention controls.

### Engineering checklist
- [ ] Build ingestion pipeline (file/text/doc sources).
- [ ] Implement chunking strategy with metadata tagging.
- [ ] Generate embeddings and index in vector DB namespace per tenant.
- [ ] Implement retrieval API with top-k and ranking options.
- [ ] Add context packing logic for LLM requests.
- [ ] Add delete/update flows for source and derived vectors.
- [ ] Add retention policy and data erasure controls.
- [ ] Add relevance evaluation harness for seeded queries.

### Acceptance criteria
- [ ] Retrieval returns relevant chunks for benchmark queries.
- [ ] RAG-enabled responses outperform baseline in relevance scoring.
- [ ] Tenant boundaries prevent cross-tenant retrieval leakage.
- [ ] Deletion of source data removes associated vectors within SLA.
- [ ] Retrieval settings can be tuned per tenant/workspace.

### Non-functional requirements
- [ ] Retrieval latency target defined and met.
- [ ] Embedding and retrieval cost telemetry visible.
- [ ] Privacy controls reviewed and approved.

### Dependencies
- Vector DB provisioning and network connectivity.
- Phase 2 router integration points.

### Risks
- Low retrieval precision causing irrelevant context injection.
- Data governance complexity for long-term memory retention.

### Definition of done
- [ ] RAG evaluation suite added to CI/staging checks.
- [ ] Admin controls for memory retention exposed.
- [ ] Production rollout completed with monitoring and alerts.

## Issue 9 - Phase 9: Specialized AI Agents

Title:
Phase 9 - Specialized Agent Runtime and Tooling

Labels:
agents, ai-platform, orchestration, phase-9, priority-medium

Assignees (suggested):
- Owner: AI Platform Lead
- Support: LLM Engineer
- Support: Frontend Lead

Body:

### Objective
Launch role-specific agents with controlled tool access, task handoff, and traceable execution.

### Scope
- Agent runtime and profile definitions.
- Tool registry and permission matrix.
- Agent handoff protocol.
- Safety guardrails and auditability.

### Engineering checklist
- [ ] Implement agent runtime abstraction for multi-step tasks.
- [ ] Define initial agent profiles:
  - [ ] Sales Agent
  - [ ] Marketing Agent
  - [ ] SEO Agent
  - [ ] Support Agent
- [ ] Implement tool registry and per-agent authorization rules.
- [ ] Add inter-agent handoff with context packaging.
- [ ] Add output guardrails and restricted-content filters.
- [ ] Add detailed trace logs for agent plans, tool calls, and outcomes.
- [ ] Add integration tests for representative agent scenarios.

### Acceptance criteria
- [ ] Each agent completes at least one end-to-end use case successfully.
- [ ] Unauthorized tool calls are blocked and logged.
- [ ] Handoff between agents preserves required context.
- [ ] Guardrails prevent restricted output classes.
- [ ] Agent traces are queryable for debugging and review.

### Non-functional requirements
- [ ] Agent execution latency and success rate metrics published.
- [ ] Rate limiting prevents runaway tool loops.
- [ ] Incident playbook exists for agent misuse or regression.

### Dependencies
- Phases 2, 7, and 8 foundations.
- Tool APIs and connector stability.

### Risks
- Tool misuse due to insufficient permission granularity.
- Hallucinated action sequences creating operational risk.

### Definition of done
- [ ] Minimum 4 production agents enabled behind feature flags.
- [ ] CI includes agent behavior regression tests.
- [ ] Production rollout with controlled cohort completed.

## Issue 10 - Phase 10: Multi-Model Intelligent Router

Title:
Phase 10 - Multi-Model Intelligent Router (Cross-Engine Optimization)

Labels:
routing, ai-platform, optimization, phase-10, priority-medium

Assignees (suggested):
- Owner: AI Platform Lead
- Support: LLM Engineer
- Support: Voice/Media Engineer

Body:

### Objective
Automatically route each request to the best model/engine using cost, quality, latency, and reliability signals.

### Scope
- Unified policy engine for chat/image/voice/speech/automation.
- Real-time provider health scoring.
- Dynamic failover and canary routing.
- A/B routing experiments and quality scoring feedback.

### Engineering checklist
- [ ] Implement unified route decision engine across service types.
- [ ] Add provider health polling and degradation scoring.
- [ ] Add canary rollout controls and rollback switch.
- [ ] Add dynamic fallback and failover matrix per request type.
- [ ] Add A/B routing framework and quality score ingestion.
- [ ] Add route decision logs for explainability and audits.
- [ ] Add enterprise override policies for specific tenants.

### Acceptance criteria
- [ ] Router diverts traffic from degraded provider automatically.
- [ ] Canary traffic can be enabled/disabled without downtime.
- [ ] Route decision logs explain engine selection for sampled requests.
- [ ] Cost per successful request stays within configured budget windows.
- [ ] SLA targets met across at least two providers per request class.

### Non-functional requirements
- [ ] Routing SLOs are documented and monitored.
- [ ] Monthly provider performance reports generated from telemetry.
- [ ] Manual override controls available to operators.

### Dependencies
- Phases 2 through 9 service telemetry and adapters.
- Monitoring stack for quality and reliability signals.

### Risks
- Policy oscillation causing unstable route behavior.
- Insufficient quality signal fidelity for some workloads.

### Definition of done
- [ ] Operator-facing route control panel is functional.
- [ ] Incident drill for provider outage completed.
- [ ] Production rollout completed with post-release KPI review.

## Suggested Milestone Mapping

- Milestone 1: Phase 1 Gateway Core
- Milestone 2: Phase 2 LLM Routing
- Milestone 3: Phase 3 Voice Stack
- Milestone 4: Phase 4 Image Pipeline
- Milestone 5: Phase 5 Video Pipeline
- Milestone 6: Phase 6 Automation Engine
- Milestone 7: Phase 7 Prompt Library
- Milestone 8: Phase 8 AI Memory (RAG)
- Milestone 9: Phase 9 Specialized Agents
- Milestone 10: Phase 10 Multi-Model Router

## Suggested Project Board Columns

- Backlog
- Ready
- In Progress
- In Review
- Staging Validation
- Production Rollout
- Done
