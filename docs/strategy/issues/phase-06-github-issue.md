# Velynxia AI Media Suite - Phase 6 GitHub Issue

Date: 2026-06-27

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
