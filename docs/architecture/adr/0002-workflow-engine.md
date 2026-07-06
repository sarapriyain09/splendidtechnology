# ADR 0002: Reusable Workflow Engine with Approval and Compensation
- Status: Accepted
- Date: 2026-06-29

## Context
Business processes such as enquiry-to-quote require multi-step execution, approvals, retry behavior, and auditable state.
Hardcoding workflow logic inside agents creates drift and limited reuse.

## Decision
Adopt a reusable workflow engine as a first-class platform service.
Workflows are declarative and externalized from domain agents.

## Consequences
- Shared orchestration and policy controls
- Better failure handling and rollback support
- Slightly higher upfront modeling complexity

## Alternatives Considered
- Agent-local imperative orchestration
- App-local workflow orchestration per module

## Follow-up Actions
- Define workflow contracts and state model
- Integrate approval checkpoints and pause-resume behavior
