# Velynxia Commerce Platform - Phase 2 Epics Backlog

Last updated: 2026-07-03

## Purpose

Translate Commerce Platform Phase 2 architecture into a prioritized execution backlog.

This backlog is intentionally scoped for Phase 2 start readiness and should not displace the active 90-day focus on Growth Platform and AI Media Suite.

## Prioritization Model

Priority levels:
- P0: Must start first to unlock platform correctness and later epics
- P1: High-value functional capability that depends on P0 foundations
- P2: Important expansion capability after core flows are stable
- P3: Strategic optimization and scale enhancements

## Epic Backlog

### EPIC-COM-001 (P0): Canonical Product Core and Domain Contracts

Objective:
- Establish Product Studio as canonical product core with stable contracts for downstream modules.

Scope:
- Product, Category, Brand, Variant, Media, Attribute, Specification models
- Product approval state machine and lifecycle status
- Product projection contract for marketplace payload transformations

Acceptance outcomes:
- Single canonical product record drives all channel projections
- Versioned API contracts published for Product Studio domain
- Product approval gates are auditable and role-aware

Dependencies:
- Existing platform auth, tenancy, and audit conventions

### EPIC-COM-002 (P0): Connector Framework for Import and Publish

Objective:
- Deliver pluggable connector architecture for imports and marketplace publishing.

Scope:
- Connector interfaces and manifest format
- Import adapter baseline: CSV, Temu import, Alibaba import
- Publish adapter baseline: Amazon, eBay, Shopify, WooCommerce, Etsy
- Connector observability: latency, failures, retries, DLQ hooks

Acceptance outcomes:
- Adapters can be enabled/disabled per tenant
- Import and publish run through one connector abstraction
- No channel-specific logic inside product core services

Dependencies:
- EPIC-COM-001
- Shared event bus and plugin conventions

Current scaffold:
- CSV import connector contract implementation: backend/app/services/connectors/csv_import_connector.py
- Amazon publish connector contract implementation: backend/app/services/connectors/amazon_publish_connector.py
- Connector tests: backend/tests/test_csv_import_connector.py
- Connector tests: backend/tests/test_amazon_publish_connector.py

### EPIC-COM-003 (P1): Product Intelligence Enrichment Pipeline

Objective:
- Add AI enrichment workflow from imported product to optimized listing package.

Scope:
- Title, description, keyword, SEO enrichment services
- Price recommendation and margin calculator services
- Product scoring and competitor snapshot analysis
- Approval checkpoints for customer-facing generated content

Acceptance outcomes:
- One-click enrichment produces structured listing package
- Deterministic pricing/margin logic remains local and testable
- AI orchestration uses shared Agent Platform abstractions only

Dependencies:
- EPIC-COM-001
- EPIC-COM-002
- Shared agent platform prompt management

### EPIC-COM-004 (P1): Marketplace Hub Publication Workflow

Objective:
- Operationalize end-to-end publish workflow from Product Studio to channel listings.

Scope:
- Publish readiness board by product and channel
- Listing projection generation and validation rules
- Publication job orchestration and status tracking
- Sync status, partial failure handling, and retry paths

Acceptance outcomes:
- Product can be published to at least one enabled marketplace
- Publication status is traceable per product-channel pair
- Failures are recoverable through controlled retry operations

Dependencies:
- EPIC-COM-001
- EPIC-COM-002
- EPIC-COM-003

### EPIC-COM-005 (P1): Unified Orders and Inventory Foundations

Objective:
- Converge channel demand and stock operations into canonical workflows.

Scope:
- Unified order queue and order lifecycle
- Inventory balances, reservations, incoming stock, transaction ledger
- Low-stock and reorder threshold events
- Supplier tie-in for replenishment recommendation signals

Acceptance outcomes:
- Orders from enabled channels land in one queue
- Inventory movements are event-driven and auditable
- Stock and order models are product-linked and tenant-scoped

Dependencies:
- EPIC-COM-001
- EPIC-COM-002
- Marketplace publication flows from EPIC-COM-004

### EPIC-COM-006 (P2): Supplier Hub and Sourcing Intelligence

Objective:
- Build supplier workflows linked directly to product and replenishment operations.

Scope:
- Supplier profiles, terms, MOQ, lead time, certification records
- Product-supplier linkage and preferred supplier policies
- Supplier recommendation signals from cost, lead-time, and quality inputs

Acceptance outcomes:
- Supplier data is usable in purchasing and replenishment decisions
- Product-level sourcing options are traceable and comparable

Dependencies:
- EPIC-COM-001
- EPIC-COM-005

### EPIC-COM-007 (P2): AI Commerce Decisioning Services

Objective:
- Provide decision intelligence on pricing, demand, inventory, and growth actions.

Scope:
- Demand prediction and inventory forecast services
- Auto pricing guardrail engine
- Product and supplier recommendation services
- AI assistant for commerce workflows (read-safe by default)

Acceptance outcomes:
- Forecast and recommendation outputs are explainable and auditable
- Decision outputs integrate into Product Studio, Marketplace Hub, and Inventory views

Dependencies:
- EPIC-COM-003
- EPIC-COM-005
- EPIC-COM-006

### EPIC-COM-008 (P2): Commerce Analytics and Performance Intelligence

Objective:
- Build channel-to-profit visibility across product, operations, and inventory.

Scope:
- Revenue, profit, margin, order, and product performance metrics
- Marketplace comparative performance dashboards
- Inventory turnover and stock efficiency analytics
- Drill-down telemetry for connector and enrichment workflows

Acceptance outcomes:
- Teams can monitor profitability by product and marketplace
- Analytics are derived from canonical operational entities and events

Dependencies:
- EPIC-COM-004
- EPIC-COM-005
- EPIC-COM-007

### EPIC-COM-009 (P3): Enterprise Hardening and Scale Readiness

Objective:
- Prepare Commerce Platform for high-scale production operations.

Scope:
- Workflow SLOs, alerting, and incident runbooks
- Rate limiting, abuse controls, and policy guardrails
- Performance/load testing and capacity planning
- Deployment and rollback automation

Acceptance outcomes:
- Production reliability targets are measurable and enforced
- Operational runbooks and rollback playbooks are validated

Dependencies:
- EPIC-COM-001 through EPIC-COM-008

## Recommended Implementation Sequence

1. EPIC-COM-001
2. EPIC-COM-002
3. EPIC-COM-003 and EPIC-COM-004 (parallel after connector baseline)
4. EPIC-COM-005
5. EPIC-COM-006 and EPIC-COM-008
6. EPIC-COM-007
7. EPIC-COM-009

## Phase 2 Start Gate

Begin active implementation when:
- 90-day focus milestones for CRM, Sales, Marketing, and AI Media Suite are met
- Shared platform services are stable for reuse
- Commerce import-enrich-publish loop is approved as next strategic execution program

## Interface-First Contract Stubs

Initial contract stubs are available in backend:

- app/contracts/connector_contracts.py
- app/contracts/product_projection.py
- app/contracts/__init__.py

Validation tests:

- tests/test_phase2_contract_stubs.py
