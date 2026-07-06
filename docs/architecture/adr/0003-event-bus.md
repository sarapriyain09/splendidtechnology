# ADR 0003: Event-Driven Agent Collaboration
- Status: Accepted
- Date: 2026-06-29

## Context
Direct agent-to-agent invocation creates tight coupling and brittle dependencies.
Velynxia needs scalable cross-module collaboration and asynchronous processing.

## Decision
Use event-driven communication as default for inter-agent and cross-module collaboration.
Agents publish domain events and subscribe through typed contracts.

## Consequences
- Loose coupling and easier extensibility
- Better support for asynchronous workflows
- Requires idempotency, DLQ strategy, and event observability

## Alternatives Considered
- Synchronous orchestration chains only
- Direct service calls between agents

## Follow-up Actions
- Enforce correlation IDs and schema versioning
- Add dead-letter handling and replay strategy
