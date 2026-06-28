# Velynxia AI Media Suite - Implementation Issue Templates

Date: 2026-06-27

Use these templates to create one execution issue per phase.

For immediate kickoff issues (already prefilled for Phases 1-3), see:
- docs/strategy/velynxia-ai-media-suite-ready-to-paste-github-issues-phases-1-10.md
- docs/strategy/issues/README.md

How to use:
1. Create a new GitHub issue.
2. Copy one phase block below.
3. Assign owner and target sprint.
4. Keep checkboxes updated during delivery.

## Template Fields (for every phase)

- Owner:
- Reviewers:
- Sprint:
- Target release:
- Dependencies:
- Risks:
- Status: Planned | In Progress | Blocked | Done

## Phase 1 - AI Gateway Foundation

Title: Phase 1 - AI Gateway Foundation (api.velynxia.com)

Owner:
Reviewers:
Sprint:
Target release:
Dependencies:
Risks:
Status:

Objective:
Build a single API gateway with auth, quotas, usage metering, and billing hooks.

Engineering checklist:
- [ ] Create FastAPI gateway service skeleton.
- [ ] Implement routes: /chat, /image, /voice, /video, /automation, /documents.
- [ ] Add JWT/OAuth authentication middleware.
- [ ] Add tenant-aware rate limiting and quota enforcement.
- [ ] Add usage metering middleware (tokens, requests, model class, latency).
- [ ] Add trace ID logging and standardized error envelopes.
- [ ] Add billing entitlement check middleware.
- [ ] Add health/readiness endpoints for deployment.

Acceptance tests:
- [ ] Unauthorized requests are rejected with consistent 401/403 responses.
- [ ] Per-tenant quotas are enforced with deterministic 429 responses.
- [ ] Usage events are persisted and queryable by tenant and endpoint.
- [ ] Gateway routes return correlation IDs and structured errors.
- [ ] Smoke test passes for all base routes.

Definition of done:
- [ ] Production deployment completed.
- [ ] Runbook added for common gateway failures.
- [ ] Metrics and alerts enabled.

## Phase 2 - LLM Engine and Router

Title: Phase 2 - LLM Engine and Router

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 1
Risks:
Status:

Objective:
Introduce provider adapters and policy-based LLM routing with fallbacks.

Engineering checklist:
- [ ] Implement provider adapters for at least one open-source and one commercial model.
- [ ] Create task classifier (chat, summarize, analyze, coding).
- [ ] Build router policy based on latency, cost, and quality.
- [ ] Implement fallback chain and timeout handling.
- [ ] Add token accounting and per-request cost estimation.
- [ ] Add prompt template loading and version references.
- [ ] Add moderation/safety hook before and after model calls.

Acceptance tests:
- [ ] Router selects expected model per policy fixtures.
- [ ] Fallback is triggered on simulated timeout and still returns successful output.
- [ ] Token and cost usage are logged for every successful and failed request.
- [ ] Moderation blocks unsafe payload classes and returns controlled response.

Definition of done:
- [ ] P95 latency target documented and met in staging.
- [ ] Cost budget guardrails enforce plan-level constraints.
- [ ] Provider outage drill completed.

## Phase 3 - Voice AI (STT, TTS, Voice Profiles)

Title: Phase 3 - Voice AI Stack

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 1
Risks:
Status:

Objective:
Deliver production voice pipeline: transcription, synthesis, and reusable voice profiles.

Engineering checklist:
- [ ] Add /voice/transcribe endpoint using Whisper/Faster-Whisper adapter.
- [ ] Add /voice/speak endpoint using Piper/XTTS adapter.
- [ ] Implement voice profile CRUD (create, list, update, delete).
- [ ] Add secure storage for uploaded voice samples and generated audio.
- [ ] Add consent capture and audit logs for voice cloning.
- [ ] Add async processing for long transcription/synthesis jobs.

Acceptance tests:
- [ ] Audio upload transcribes with timestamps and confidence values.
- [ ] TTS endpoint generates playable audio in supported format.
- [ ] Voice profile can be created and reused across requests.
- [ ] Access to voice assets is tenant-scoped and signed URL protected.
- [ ] Consent requirement is enforced for cloning flows.

Definition of done:
- [ ] End-to-end demo flow passes (upload -> profile -> generate speech).
- [ ] Performance baseline documented for 30s and 5m audio files.
- [ ] Legal/compliance review complete for consent wording.

## Phase 4 - Image Generation Pipeline

Title: Phase 4 - Image Generation Pipeline

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 1
Risks:
Status:

Objective:
Provide asynchronous image generation with safety filters and asset delivery.

Engineering checklist:
- [ ] Implement /image/generate endpoint.
- [ ] Add job queue for async generation and progress tracking.
- [ ] Integrate model adapters (FLUX, SDXL).
- [ ] Add prompt safety checks and content policy handling.
- [ ] Add optional post-process step: upscale/background removal.
- [ ] Store outputs in object storage and return signed URLs.

Acceptance tests:
- [ ] Generation requests return job IDs and status transitions.
- [ ] Completed jobs provide valid image assets and metadata.
- [ ] Unsafe prompts are blocked with policy-aligned responses.
- [ ] Signed URLs expire correctly and cannot be reused after expiry.

Definition of done:
- [ ] Gallery UX can load generated assets from storage.
- [ ] Queue retry behavior validated under transient model failures.
- [ ] Cost-per-image metrics visible in dashboard.

## Phase 5 - Video Generation Pipeline

Title: Phase 5 - Video Generation Pipeline

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phases 3, 4
Risks:
Status:

Objective:
Ship composable video generation pipeline from prompt to MP4.

Engineering checklist:
- [ ] Implement /video/create endpoint with async orchestration.
- [ ] Create storyboard/scene schema for generated projects.
- [ ] Build stage execution: storyboard, image render, animation, voice, music, mux.
- [ ] Add resumable rendering and partial retry per stage.
- [ ] Add storage lifecycle for intermediate and final artifacts.
- [ ] Add webhook/callback for job completion.

Acceptance tests:
- [ ] Pipeline can produce MP4 from prompt in staging.
- [ ] Stage failure retries from failed stage, not full rerun.
- [ ] Output includes synchronized audio track and expected duration tolerance.
- [ ] Users can poll status and retrieve logs for failed jobs.

Definition of done:
- [ ] Baseline template project ships in AI Media Studio.
- [ ] Rendering SLA defined by duration tiers.
- [ ] Support playbook created for stuck jobs.

## Phase 6 - Automation Engine

Title: Phase 6 - Automation Engine and Connectors

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 1, existing CRM services on Pi
Risks:
Status:

Objective:
Enable trigger -> AI -> action workflows with connector framework.

Engineering checklist:
- [ ] Build workflow runtime with trigger, condition, transform, and action nodes.
- [ ] Add connector SDK with auth strategy abstraction.
- [ ] Implement initial connectors: Gmail, Outlook, CRM, WhatsApp, Calendar.
- [ ] Add retry, idempotency keys, and dead-letter queue.
- [ ] Add workflow execution logs and replay support.
- [ ] Add Pi-hosted worker integration for low-compute orchestration.

Acceptance tests:
- [ ] Email trigger workflow creates CRM lead and calendar event successfully.
- [ ] Duplicate events are ignored via idempotency strategy.
- [ ] Failed actions are retried and eventually land in dead-letter queue.
- [ ] Execution log shows node-by-node status with timestamps.

Definition of done:
- [ ] At least 3 production-grade workflow templates published.
- [ ] Connector credential rotation process documented.
- [ ] On-call alerts configured for queue backlog and failure rate.

## Phase 7 - Prompt Library

Title: Phase 7 - Prompt Library and Versioning

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 2
Risks:
Status:

Objective:
Move prompts into managed templates with variable schemas and version control.

Engineering checklist:
- [ ] Create prompt schema tables (id, template, variables, owner, version).
- [ ] Build CRUD APIs with role-based permissions.
- [ ] Add variable type validation and defaults.
- [ ] Add publish/draft lifecycle and rollback support.
- [ ] Link prompt templates to LLM router execution path.
- [ ] Add audit trail for prompt edits.

Acceptance tests:
- [ ] Prompt template with variables renders valid final prompt.
- [ ] Invalid variable input is rejected with clear validation errors.
- [ ] Rollback restores prior published prompt version.
- [ ] Permission checks prevent unauthorized template edits.

Definition of done:
- [ ] Team can create and share templates in dashboard.
- [ ] 10+ internal prompts migrated out of application code.
- [ ] Prompt usage analytics visible per template ID.

## Phase 8 - AI Memory (RAG)

Title: Phase 8 - AI Memory and Retrieval Layer

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phase 2, vector DB provisioning
Risks:
Status:

Objective:
Improve contextual quality and efficiency via retrieval-augmented generation.

Engineering checklist:
- [ ] Implement document ingestion and chunking pipeline.
- [ ] Add embedding generation and vector indexing.
- [ ] Add retrieval API with top-k and hybrid ranking controls.
- [ ] Add tenant-level namespace isolation in vector store.
- [ ] Add context packing logic for router integration.
- [ ] Add retention and deletion policies for memory data.

Acceptance tests:
- [ ] Retrieval returns relevant chunks for seeded evaluation queries.
- [ ] LLM responses improve against baseline in relevance tests.
- [ ] Tenant A cannot access Tenant B vectors under any query path.
- [ ] Deletion requests remove vectors and source references within SLA.

Definition of done:
- [ ] RAG evaluation suite added to CI/staging.
- [ ] Memory retention controls exposed in settings.
- [ ] Retrieval cost and latency dashboards enabled.

## Phase 9 - Specialized AI Agents

Title: Phase 9 - Specialized Agent Runtime

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phases 2, 7, 8
Risks:
Status:

Objective:
Launch role-specific agents with tool access control and safe execution.

Engineering checklist:
- [ ] Build agent runtime with tool invocation framework.
- [ ] Define agent profiles (Sales, Marketing, SEO, Support, etc.).
- [ ] Add tool permission matrix per agent and tenant plan.
- [ ] Add handoff protocol for multi-step tasks across agents.
- [ ] Add guardrails and output policy enforcement.
- [ ] Add agent trace logging for debuggability.

Acceptance tests:
- [ ] Each agent completes representative scenario successfully.
- [ ] Unauthorized tool calls are blocked and logged.
- [ ] Handoff flow preserves context and completes task chain.
- [ ] Policy checks prevent restricted output classes.

Definition of done:
- [ ] Minimum 4 production agents exposed in UI/API.
- [ ] Agent behavior tests run in CI.
- [ ] Incident response guide for agent misuse documented.

## Phase 10 - Multi-Model Intelligent Router

Title: Phase 10 - Multi-Model Intelligent Router

Owner:
Reviewers:
Sprint:
Target release:
Dependencies: Phases 2, 3, 4, 5, 9
Risks:
Status:

Objective:
Automatically route requests to the best model/engine by SLA, quality, and cost.

Engineering checklist:
- [ ] Implement unified routing policy engine across chat/image/voice/speech/automation.
- [ ] Add real-time provider health and degradation scoring.
- [ ] Add dynamic failover and canary routing.
- [ ] Add A/B routing experiments and offline quality scoring ingestion.
- [ ] Add per-tenant policy overrides for enterprise plans.
- [ ] Add route decision audit logs for explainability.

Acceptance tests:
- [ ] Router shifts traffic away from degraded provider automatically.
- [ ] Canary rollout can be enabled and rolled back without downtime.
- [ ] Decision logs explain selected route for sampled requests.
- [ ] Cost per successful request remains within target budgets.

Definition of done:
- [ ] Routing control panel is available to internal operators.
- [ ] Monthly model performance review process established.
- [ ] SLOs published for each request class.

## Cross-Phase Non-Functional Checklist

Apply to every phase issue:

- [ ] Security review completed.
- [ ] Observability (metrics, logs, traces) implemented.
- [ ] Backward compatibility assessed.
- [ ] Cost impact estimated and approved.
- [ ] Runbook and rollback plan documented.
- [ ] Post-release validation completed in production.
