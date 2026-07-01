# Velynxia Product Intelligence AI - Project Plan and Development Status

Last updated: 2026-07-01

## 1. Product Goal
Build an AI-assisted product research platform to evaluate product opportunities for Amazon UK/EU/US and B2B markets, with manufacturing and profitability intelligence for Velynxia-branded products.

## 2. Delivery Plan

### Phase 0 - Foundation and Architecture
Status: Completed

Scope:
- Create backend and frontend app structure
- Define core API contracts and domain schemas
- Set up database model bootstrap and service boundaries
- Add Agent Platform adapter boundary

Delivered:
- FastAPI backend scaffold with module endpoints
- Next.js frontend scaffold with dashboard shell
- SQLAlchemy setup for persistence
- Agent Platform client adapter

### Phase 1 - Governance, Context, and Reliability
Status: Completed

Scope:
- Enforce multi-tenant request context
- Add correlation ID propagation
- Add resilient fallback behavior for AI orchestration
- Establish baseline test coverage

Delivered:
- Required headers enforced on business endpoints
- Correlation ID middleware implemented
- Agent Platform calls include tenant/user/source/correlation context
- Fallback logic for unavailable Agent Platform
- Async API test suite with passing baseline

### Phase 2 - Core Discovery and Ingestion
Status: In Progress

Scope:
- Compliant discovery search from approved/public metadata connectors
- User-provided product import endpoint
- Source, market, and price filtering

Delivered:
- Discovery connector service wired into search endpoint
- User import endpoint for discovery records
- Filterable catalog logic (market, source, price, keyword/category)

Remaining in Phase 2:
- Replace placeholder catalog with real approved connector integrations
- Add connector-level observability and failure analytics
- Add pagination and sorting controls for discovery results

### Phase 3 - AI Intelligence Workflows
Status: In Progress

Scope:
- Route AI-heavy modules through Agent Platform prompt keys
- Keep deterministic math modules local
- Validate contract behavior and fallback outcomes

Delivered:
- AI routes wired for review analysis, opportunities, B2B, family generation, drawings/CNC, marketing, packaging
- Prompt key mapping documented
- Contract tests for Agent Platform success/fallback behavior

Remaining in Phase 3:
- Implement prompt version governance and release strategy
- Add per-prompt latency, token, and error telemetry
- Add approval gates for customer-facing generated content

### Phase 4 - Data Model Hardening and Reporting
Status: Planned

Scope:
- Introduce Alembic migrations
- Normalize storage for products, review clusters, opportunities, and reports
- Add PDF report generation endpoints

Planned deliverables:
- Migration scripts and schema versioning workflow
- Report generation pipeline (Opportunity, Manufacturing, Competitor, Business Case, Profit)
- Export APIs with traceability metadata

### Phase 5 - Frontend Productization
Status: Planned

Scope:
- Build full workflow UI for all modules
- Improve dashboard with real-time metrics and drill-down
- Add authenticated tenant-aware UX

Planned deliverables:
- Search + import flow UI
- Analysis workflow pages
- Reporting and exports UI
- Auth/session handling and permission-aware views

### Phase 6 - Production Readiness
Status: Planned

Scope:
- Security hardening
- Performance testing
- CI/CD quality gates
- Operational runbooks

Planned deliverables:
- SLO/SLA aligned monitoring dashboards
- Rate limiting and abuse safeguards
- Deployment playbooks and rollback paths
- Incident response and support procedures

## 3. Current Stage Snapshot
Current stage: Late Phase 2 / Phase 3 active integration

Summary:
- Platform skeleton is stable
- Governance and context propagation are implemented
- Agent Platform integration path is live with test-backed fallback behavior
- Discovery ingestion path exists and is ready for real connector replacement

## 4. Immediate Next Sprint Priorities
1. Replace placeholder discovery catalog with approved source adapters.
2. Add pagination/sorting/filter persistence for discovery APIs and frontend flow.
3. Add Alembic migrations and normalized tables for long-term analytics.
4. Add report generation service and initial PDF endpoints.
5. Add telemetry for prompt latency, token usage, and route-level performance.

## 5. Definition of Done for MVP
- End-to-end product discovery to opportunity scoring workflow is operational.
- AI-assisted modules run via Agent Platform (with fallback safety).
- Multi-tenant context and traceability headers are enforced.
- Core reports are exportable.
- Test suite passes consistently in CI with deterministic setup.
