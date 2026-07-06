# ADR 0010: Approval Engine for Human-in-the-Loop Workflows
- Status: Accepted
- Date: 2026-06-29

## Context
Certain business actions require manual approval and auditable decision trails.
Without a shared approval model, apps implement ad hoc pause and resume behavior.

## Decision
Introduce an Approval Engine integrated with Workflow Engine for pause, resume, escalation, and multi-level approvals.
Approval state is persisted and event-driven.

## Consequences
- Stronger governance for sensitive operations
- Reusable approval flows across modules
- Additional complexity around timeout and escalation policies

## Alternatives Considered
- Synchronous approval checks in application controllers
- Manual out-of-band approvals without workflow state

## Follow-up Actions
- Define ApprovalState schema and transition rules
- Add SLA and escalation strategy for pending approvals
