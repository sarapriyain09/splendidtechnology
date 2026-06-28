# Week 1 Daily GitHub Issues (Owner + Shiva)

Date: 2026-06-27

Use one issue per day. Copy each block into a new GitHub issue.

## Day 1 Issue - Setup and Contract Lock

Title:
Week 1 Day 1 - API Contract Lock and Gateway Bootstrap

Labels:
phase-1, week-1, api-gateway, priority-high

Assignees:
- @sarapriyain09
- @Machspeed12

Body:

### Objective
Lock API contracts and bootstrap the gateway with basic startup readiness.

### Owner tasks (@sarapriyain09)
- [ ] Finalize endpoint contracts for /chat, /documents, /image (stub), /voice (stub).
- [ ] Define canonical response envelope and error schema.
- [ ] Publish contract notes in issue comments.

### Shiva tasks (@Machspeed12)
- [ ] Scaffold gateway module and route structure.
- [ ] Add /health and /ready endpoints.
- [ ] Confirm app starts locally with a clean boot.

### Acceptance criteria
- [ ] API contract approved and documented.
- [ ] Local gateway starts successfully.
- [ ] Health endpoints return successful responses.

## Day 2 Issue - Middleware Foundations

Title:
Week 1 Day 2 - Auth, Trace IDs, and Error Handling

Labels:
phase-1, week-1, middleware, priority-high

Assignees:
- @sarapriyain09
- @Machspeed12

Body:

### Objective
Establish authentication flow, request tracing, and standardized error handling.

### Owner tasks (@sarapriyain09)
- [ ] Confirm JWT validation strategy and tenant context model.
- [ ] Review and approve middleware interfaces.

### Shiva tasks (@Machspeed12)
- [ ] Implement trace ID middleware for all inbound requests.
- [ ] Add centralized error handler with unified error envelope.
- [ ] Ensure trace ID is included in error responses.

### Acceptance criteria
- [ ] Protected routes enforce authentication.
- [ ] Every request has a trace ID in logs/responses.
- [ ] Error format is consistent across failure paths.

## Day 3 Issue - Quotas and Metering

Title:
Week 1 Day 3 - Tenant Quotas, Rate Limiting, and Usage Events

Labels:
phase-1, week-1, quotas, metering, priority-high

Assignees:
- @sarapriyain09
- @Machspeed12

Body:

### Objective
Add policy controls for per-tenant usage and emit consistent metering telemetry.

### Owner tasks (@sarapriyain09)
- [ ] Validate plan-tier quota policy.
- [ ] Approve usage event schema.

### Shiva tasks (@Machspeed12)
- [ ] Implement rate-limit middleware.
- [ ] Implement quota checks per tenant plan.
- [ ] Emit usage events for success and failure paths.

### Acceptance criteria
- [ ] Quota/rate limit violations return deterministic 429 payloads.
- [ ] Usage events include endpoint, latency, status, and tenant context.
- [ ] Logging and metering outputs are reviewable in staging/local logs.

## Day 4 Issue - Staging Integration

Title:
Week 1 Day 4 - Staging Deploy and Smoke Validation

Labels:
phase-1, week-1, staging, validation, priority-high

Assignees:
- @sarapriyain09
- @Machspeed12

Body:

### Objective
Deploy Phase 1 baseline to staging and validate auth + quota + observability behavior.

### Owner tasks (@sarapriyain09)
- [ ] Configure staging env variables and secret bindings.
- [ ] Validate expected auth and quota behavior.

### Shiva tasks (@Machspeed12)
- [ ] Deploy gateway branch to staging.
- [ ] Create smoke-test checklist and run initial pass.
- [ ] Capture trace IDs for sample requests.

### Acceptance criteria
- [ ] Staging gateway is reachable and healthy.
- [ ] Auth and quota behavior matches policy.
- [ ] Smoke test checklist is documented and repeatable.

## Day 5 Issue - Hardening and Sign-off

Title:
Week 1 Day 5 - Defect Fixes, Sign-off, and Week 2 Handoff

Labels:
phase-1, week-1, hardening, handoff, priority-high

Assignees:
- @sarapriyain09
- @Machspeed12

Body:

### Objective
Close defects, confirm Week 1 acceptance criteria, and prepare Phase 2 kickoff.

### Owner tasks (@sarapriyain09)
- [ ] Lead final review and Week 1 sign-off.
- [ ] Open Week 2 starter issues for Phase 2 router work.

### Shiva tasks (@Machspeed12)
- [ ] Resolve staging defects and finalize fixes.
- [ ] Finalize ops notes and troubleshooting steps.

### Acceptance criteria
- [ ] Week 1 success criteria are fully met.
- [ ] No open P0/P1 defects for gateway baseline.
- [ ] Week 2 backlog is created with owners assigned.

## Suggested Project Tracking Fields

- Milestone: Phase 1 Gateway Core
- Sprint: Week 1
- Status: Backlog | In Progress | In Review | Done
- Reporting: Daily standup update linked in issue comments
