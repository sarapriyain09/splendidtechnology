# Velynxia Commerce Amazon-First V1 Epics Backlog

Last updated: 2026-07-05
Owner: Commerce Platform Team
Status: Execution baseline

## Objective
Deliver Version 1 of Velynxia Commerce focused on one outcome:
- help a small business sell on Amazon with complete visibility from supplier to cash received.

## Scope Guardrails
In scope:
- Products, Suppliers, Inventory, Sales Channels, Orders, Delivery, Cash Flow, Customer Support, Marketing.

Out of scope for V1:
- Full ERP replacement.
- Full accounting suite/GL implementation.
- Manufacturing MRP and production planning.
- Full CRM automation platform.

## Prioritization Model
- P0: Must-have to run Amazon operations end-to-end.
- P1: High-value operational intelligence after core control plane is stable.
- P2: Optimization and scale hardening for post-launch maturity.

## Epic Backlog

### EPIC-AMZ-V1-001 (P0): Product Workspace Core
Business question:
- What am I selling?

Scope:
- Canonical product model (SKU, ASIN, title, brand, variant, cost, sale price, status).
- Product readiness checklist for Amazon listing completeness.
- Product profitability summary fields (revenue, fees, COGS estimate, contribution).
- Product lifecycle states: draft, ready, active, paused, archived.

Acceptance criteria:
- Product records are unique per tenant and SKU.
- Product readiness score is visible and filterable in the workspace.
- Product detail view loads in under 2 seconds for 95th percentile queries.
- No channel-specific logic is embedded in the core product domain model.

Dependencies:
- Existing auth, tenancy, audit standards.

### EPIC-AMZ-V1-002 (P0): Supplier Hub Foundation
Business question:
- Which suppliers can reliably support my catalog?

Scope:
- Supplier profile model (lead time, MOQ, terms, payment days, reliability score).
- Product-supplier mapping with preferred supplier policy.
- Purchase order status tracking from draft to received.
- Supplier reliability metrics (on-time, defect, fill rate).

Acceptance criteria:
- Each active product can be linked to at least one supplier.
- Supplier reliability score updates from purchase order outcomes.
- Buyer can compare supplier options by landed cost and lead time in one view.
- Supplier data is fully tenant-scoped and auditable.

Dependencies:
- EPIC-AMZ-V1-001.

### EPIC-AMZ-V1-003 (P0): Inventory Ledger and Replenishment
Business question:
- What stock do I have?

Scope:
- Inventory ledger by SKU and location (on-hand, reserved, in-transit, Amazon states).
- Reorder policy by SKU using lead time and demand velocity.
- Low-stock, overstock, and stockout risk alerts.
- Stock movement traceability for adjustments, receipts, and dispatches.

Acceptance criteria:
- Inventory position is recalculated from ledger transactions, not mutable balance fields.
- Reorder recommendation includes suggested quantity and suggested order date.
- Stock risk alerts are generated at least daily and are actionable.
- Stock view answers current available quantity within one click from product workspace.

Dependencies:
- EPIC-AMZ-V1-001.
- EPIC-AMZ-V1-002.

### EPIC-AMZ-V1-004 (P0): Amazon Connector and Sales Channel Adapter
Business question:
- How is Amazon performing as my primary channel?

Scope:
- Amazon connector for order, fee, payout, and campaign data ingestion.
- Channel adapter contract to support future connectors without core model changes.
- Connector observability (latency, success, retries, dead-letter counts).
- Scheduled sync jobs with idempotent ingestion behavior.

Acceptance criteria:
- Amazon sync jobs are idempotent and can be re-run safely.
- Connector failures are visible in an operator-facing error queue.
- Channel adapter contract supports adding at least one new channel without product schema changes.
- No direct provider logic is embedded in core business services.

Dependencies:
- EPIC-AMZ-V1-001.

### EPIC-AMZ-V1-005 (P0): Orders Dispatch Control Plane
Business question:
- What must I dispatch today?

Scope:
- Unified Amazon-first order inbox.
- Dispatch queue sorted by ship-by deadline and priority.
- Exception queue for stock, address, and payment issues.
- Order lifecycle states from received to closed.

Acceptance criteria:
- Dispatch list can be filtered to today, overdue, and blocked in one screen.
- Exceptions require reason code and owner before closure.
- 100% of imported orders are traceable to source channel and sync batch.
- Mobile layout supports pick/pack/dispatch updates without horizontal overflow.

Dependencies:
- EPIC-AMZ-V1-003.
- EPIC-AMZ-V1-004.

### EPIC-AMZ-V1-006 (P0): Delivery Tracking and Risk Monitor
Business question:
- Which shipments are at risk or delayed?

Scope:
- Shipment entity and status timeline (packed, handed over, in transit, delivered, issue).
- Carrier SLA monitoring and delay detection.
- Delivery exception workflows with owner assignment.
- Customer-facing status note templates.

Acceptance criteria:
- Shipment timeline is visible from order detail without navigation jumps.
- Delayed shipments are auto-flagged by SLA rule and appear in risk queue.
- Delivery exception resolution time is measurable and reportable.
- Carrier performance can be viewed by on-time percentage and average delay.

Dependencies:
- EPIC-AMZ-V1-005.

### EPIC-AMZ-V1-007 (P0): Cash Flow Core and Payout Visibility
Business question:
- How much money is available?

Scope:
- Cash timeline for expected Amazon payouts, supplier dues, and key outflows.
- Fee-normalized margin waterfall (revenue -> marketplace fees -> logistics -> COGS -> contribution).
- Short-horizon cash warning indicators (7/14/30 day).
- Reconciliation-ready payout to order aggregation views.

Acceptance criteria:
- Owner can view expected available cash in one dashboard panel.
- Each payout line can drill down to source orders and fee components.
- Cash warning logic is configurable per tenant threshold.
- Cash summary refresh completes within operational SLA for daily decision use.

Dependencies:
- EPIC-AMZ-V1-004.
- EPIC-AMZ-V1-005.
- EPIC-AMZ-V1-006.

### EPIC-AMZ-V1-008 (P1): Customer Support Operations Desk
Business question:
- What problems are customers reporting?

Scope:
- Unified support case queue from Amazon messages, returns, and complaints.
- Root-cause taxonomy linked to product, delivery, or listing quality.
- SLA queue management and assignment workflow.
- Case-to-order and case-to-product linkage.

Acceptance criteria:
- New customer issues are triaged by severity and SLA target.
- Agents can resolve common issue types via predefined action templates.
- Root-cause trend report identifies top recurring issue categories weekly.
- Support case list and detail views are fully responsive.

Dependencies:
- EPIC-AMZ-V1-005.
- EPIC-AMZ-V1-006.

### EPIC-AMZ-V1-009 (P1): Amazon Marketing Profitability Workspace
Business question:
- Which Amazon campaigns are profitable?

Scope:
- Campaign ingestion from Amazon ads.
- Campaign and SKU-level performance metrics (ACOS, TACOS, ROAS, contribution margin).
- Budget pacing and bid recommendation panel.
- Campaign-to-product linking in product workspace.

Acceptance criteria:
- Campaign list supports profitability sort by contribution margin.
- Unprofitable campaigns are flagged with explainable reasons.
- Product detail includes campaign impact summary.
- Recommendation cards are advisory and require explicit user action.

Dependencies:
- EPIC-AMZ-V1-001.
- EPIC-AMZ-V1-004.
- EPIC-AMZ-V1-007.

### EPIC-AMZ-V1-010 (P1): AI-Assisted Decision Layer (Governed)
Business question:
- What should I do next?

Scope:
- Reorder assistant, listing quality assistant, support triage assistant, marketing optimization assistant.
- Agent Platform adapter integration for AI workflows.
- Human approval state handling for high-impact recommendations.
- Prompt key usage with versioned template references.

Acceptance criteria:
- AI interactions flow through shared Agent Platform adapter only.
- High-impact recommendations require explicit approval before execution.
- AI response latency and failure telemetry are captured for each workflow.
- Fallback behavior is present when AI service is unavailable.

Dependencies:
- EPIC-AMZ-V1-003.
- EPIC-AMZ-V1-008.
- EPIC-AMZ-V1-009.

### EPIC-AMZ-V1-011 (P2): Role-Based Operations Dashboard
Business question:
- Where do I need attention right now across supplier-to-cash?

Scope:
- Unified control-plane dashboard for owner, operations, and support roles.
- Configurable widgets for dispatch risk, stock risk, payout risk, support risk, and campaign risk.
- Saved filters and role-default views.
- Mobile and desktop responsive layout validation.

Acceptance criteria:
- Dashboard loads with role-relevant defaults under performance SLA.
- Each risk widget links directly to an actionable queue.
- Users can save and restore personal dashboard views.
- Dashboard supports both desktop and mobile breakpoints without usability regressions.

Dependencies:
- EPIC-AMZ-V1-005 through EPIC-AMZ-V1-010.

### EPIC-AMZ-V1-012 (P2): V1 Hardening, Auditability, and Release Readiness
Business question:
- Is the platform safe and reliable enough for daily operations?

Scope:
- RBAC hardening by module action.
- End-to-end audit trails for product, inventory, order, payout, and support mutations.
- SLO dashboards, alerting thresholds, retry policies, and incident runbooks.
- UAT checklist and release go/no-go criteria.

Acceptance criteria:
- Critical workflows meet agreed SLOs for reliability and response time.
- All mutating actions in scope are traceable by tenant, user, timestamp, and source module.
- Security and tenancy isolation tests pass for all P0 and P1 modules.
- Release checklist is complete and signed off by product and engineering leads.

Dependencies:
- EPIC-AMZ-V1-001 through EPIC-AMZ-V1-011.

## Recommended Sequence
1. EPIC-AMZ-V1-001
2. EPIC-AMZ-V1-002
3. EPIC-AMZ-V1-003 and EPIC-AMZ-V1-004
4. EPIC-AMZ-V1-005
5. EPIC-AMZ-V1-006
6. EPIC-AMZ-V1-007
7. EPIC-AMZ-V1-008 and EPIC-AMZ-V1-009
8. EPIC-AMZ-V1-010
9. EPIC-AMZ-V1-011
10. EPIC-AMZ-V1-012

## Program-Level Exit Criteria for V1
- Supplier-to-cash visibility is available daily in one platform.
- Operations team can dispatch, monitor risk, and resolve exceptions quickly.
- Owner can assess cash availability and campaign profitability from role-based dashboards.
- AI assistance accelerates decisions without bypassing governance.
- Platform remains Amazon-first and intentionally avoids unnecessary ERP scope.