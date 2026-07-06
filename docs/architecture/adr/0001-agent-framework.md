# ADR 0001: Generic Agent Framework as Shared Core
- Status: Accepted
- Date: 2026-06-29

## Context
Velynxia needs multiple domain agents across CRM, Sales, Marketing, Media, Accounting, Analytics, Support, and future Engineering modules.
Building each agent independently would duplicate lifecycle logic and increase maintenance cost.

## Decision
Adopt a shared Generic Agent Framework with base abstractions for lifecycle, tools, memory, and events.
Domain agents stay thin and provide only domain planning and guardrails.

## Consequences
- Faster addition of new agents
- Consistent governance and observability
- Reduced duplicated logic
- Initial framework investment required

## Alternatives Considered
- Fully custom per-agent implementations
- Single monolithic super-agent with prompt routing

## Follow-up Actions
- Maintain framework contracts under services/agent-platform/contracts
- Enforce plugin registration through registry patterns
