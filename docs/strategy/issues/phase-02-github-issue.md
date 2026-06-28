# Velynxia AI Media Suite - Phase 2 GitHub Issue

Date: 2026-06-27

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
