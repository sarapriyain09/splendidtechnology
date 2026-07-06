# ADR 0007: Centralized Tool Manager and Permission Guard
- Status: Accepted
- Date: 2026-06-29

## Context
Agents need controlled access to external systems such as CRM, email, storage, and accounting operations.
Direct tool invocation from agents risks inconsistent authorization, logging, and runtime policies.

## Decision
Introduce a Tool Manager service responsible for registry lookup, permission checks, execution policies, and standardized result envelopes.
Agents invoke tools through Tool Manager contracts only.

## Consequences
- Unified guardrails and observability for tool usage
- Easier onboarding of new tool adapters
- Requires strict contract versioning and timeout policy management

## Alternatives Considered
- Direct agent-to-tool adapter invocation
- Application-local tool wrappers

## Follow-up Actions
- Define Tool contract and policy hooks
- Add latency, failure, and retry instrumentation per tool call
