# Velynxia Agent Platform - Initial Structure

## Decision

Do not start with a separate standalone Agents application.
Build Agentic AI as a shared platform service used by all Velynxia apps.

## Why this approach

- Avoid duplicate auth and duplicate API layers
- Reuse memory, workflows, and tooling across products
- Enable cross-app flows (for example Sales + CRM + Accounting)
- Keep user experience unified inside each app

## Platform Layers

1. Applications layer
- growth-platform
- aimediasuit
- accounting
- avatar-studio
- website (future selective use)

2. Shared Agent Platform layer
- orchestrator
- planner
- memory
- llm gateway
- tool registry
- workflows
- knowledge base
- registry

3. Infrastructure layer
- PostgreSQL
- Redis
- object/file storage
- provider APIs
- Raspberry Pi runtime footprint where needed

## Initial Repository Structure

```text
apps/
  accounting/
  aimediasuit/
  avatar-studio/
  growth-platform/

services/
  agent-platform/
    orchestrator/
    planner/
    memory/
    llm/
    tools/
    workflows/
    knowledge-base/
    registry/
    contracts/
    app-agents/

shared/
  agent-sdk/
```

## Agent Ownership Model

Each app has its own domain agents, registered in `services/agent-platform/app-agents/`.

- growth-platform: prospecting, follow-up, proposal
- aimediasuit: script, video, publishing
- accounting: reconciliation, VAT review, reminders
- avatar-studio: script, training, publishing

## Execution Rules (Initial)

- Every agent call must pass through the orchestrator
- Every tool call must be permission-checked
- Every tool call must be audit logged
- Memory must be tenant-scoped
- Cross-app access must be explicit and policy-driven

## Delivery Plan

1. Sprint 1: contracts, registry schema, app manifests
2. Sprint 2: orchestrator MVP and basic tool registry
3. Sprint 3: memory adapters and workflow runner
4. Sprint 4: knowledge retrieval and observability
5. Sprint 5: admin module inside platform settings (not separate app)

## Future Expansion

Only create a separate Agents product when one of these is required:

- third-party agent marketplace
- enterprise-level billing for agents
- external developer publishing workflow
- standalone commercial agent offering

## Related Execution Plan

For immediate rollout and KPI governance, see:
- `docs/strategy/agentic-ai-90-day-scorecard.md`
