# ADR 0012: Commerce Platform Phase-2 Architecture Reservation
- Status: Accepted
- Date: 2026-07-03

## Context
Velynxia is executing a 90-day focus on Growth Platform and AI Media Suite capabilities.
Commerce Platform is a planned Phase 2 program, but structural decisions are needed now to prevent future rework.

The platform direction requires:
- Product-centric domain modeling
- Connector-based marketplace integrations
- AI capability consumption through shared platform abstractions
- Multi-tenant, event-driven, auditable workflows

Without architecture reservation now, future Commerce implementation risks:
- duplicate product and channel models
- channel-specific logic embedded in product core services
- incompatible workflow orchestration across domains

## Decision
Reserve and adopt the Commerce Platform module architecture now, while deferring full implementation to Phase 2.

Commerce Platform container boundaries are:
- Dashboard
- Product Studio (canonical product core)
- Supplier Hub
- Marketplace Hub
- Inventory
- Orders
- Customers
- AI Commerce
- Analytics

Architecture rules:
1. Product is the canonical source of truth.
2. Marketplace records are projections/adapters, not primary product records.
3. Import and publish integrations use pluggable connector contracts.
4. AI capabilities are consumed through shared Agent Platform abstractions.
5. Cross-module coordination uses events and tenant-scoped contracts.

Reserved operating workflow contract:
Import Product -> AI Enrichment -> Price/Margin Recommendation -> Publish -> Orders -> Profit/Inventory Intelligence.

## Consequences
Positive:
- Phase 2 can start faster with stable boundaries and reduced redesign risk.
- Product Studio, Product Intelligence, and AI Commerce can evolve independently behind contracts.
- Marketplace expansion remains pluggable and provider/channel-independent.

Trade-offs:
- Additional upfront architecture artifacts to maintain.
- Implementation teams must adhere to contract-first boundaries even during rapid prototyping.

## Alternatives Considered
1. Build Commerce incrementally without reserved architecture and refactor later.
2. Split Product Intelligence into a separate long-term standalone app.
3. Treat each marketplace as an independent product domain model.

## Follow-up Actions
1. Keep Commerce Platform implementation in Phase 2 scope while preserving current 90-day focus.
2. Maintain C4 container and schema-blueprint alignment for Commerce domains.
3. Define connector interfaces for import and publish flows before adapter implementations.
4. Define canonical Product projection contracts for channel payload transformations.
5. Track Phase-2 readiness gate in strategy and roadmap docs.
