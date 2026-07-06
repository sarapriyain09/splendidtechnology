# ADR 0006: Planner as a Replaceable Core Service
- Status: Accepted
- Date: 2026-06-29

## Context
Agent requests require consistent goal interpretation, decomposition, and execution planning.
Embedding planning logic in controllers or domain agents causes duplicated logic and inconsistent orchestration quality.

## Decision
Adopt a dedicated Planner service with contract-driven inputs and outputs.
The planner produces execution plans that select workflow, tools, and target agent while remaining replaceable.

## Consequences
- Better planning consistency across modules
- Independent evolution of planning strategies and models
- Additional contract and observability requirements

## Alternatives Considered
- Planner logic embedded in each domain agent
- Controller-level imperative planning

## Follow-up Actions
- Define stable Planner interface and ExecutionPlan schema
- Add planner telemetry (latency, confidence, fallback reason)
