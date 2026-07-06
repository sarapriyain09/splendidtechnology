# Velynxia Commerce Roadmap (Amazon-First, 2026-2030)

Status: Working Plan
Date: 2026-07-05
Owner: Velynxia Commerce Team

## Mission
Build Velynxia Commerce as an Amazon-first operating platform for small businesses.

Version 1 objective:
- Help a business sell on Amazon with complete visibility from supplier to cash received.

Version 1 boundary:
- Do not replace Shopify.
- Do not replace ERP systems.
- Do not implement broad ERP features outside Amazon-selling workflows.

## Product Principles
- Amazon-first.
- Supplier-agnostic.
- Simple user interface.
- Fast workflow.
- AI-assisted where it speeds decisions.
- Modular architecture.
- Responsive design (desktop and mobile).

Every screen must answer one business question quickly.

## Core Modules and Primary Business Questions
1. Products
- Question: What am I selling?

2. Suppliers
- Question: Which suppliers can reliably support my Amazon catalog?

3. Inventory
- Question: What stock do I have and what will run out soon?

4. Sales Channels
- Question: How is Amazon performing versus other connected channels?

5. Orders
- Question: What must I dispatch today?

6. Delivery
- Question: Which shipments are at risk or delayed?

7. Cash Flow
- Question: How much money is available after fees, costs, and pending payouts?

8. Customer Support
- Question: What problems are customers reporting and what needs action now?

9. Marketing
- Question: Which Amazon campaigns are profitable?

## Version 1 Scope (Must Have)

### Products
- Central product catalog with SKU, ASIN, title, price, cost, and status.
- Product readiness checklist for Amazon listing quality.
- Product-level profitability snapshot (revenue, fees, COGS estimate).

### Suppliers
- Supplier master data (lead time, MOQ, payment terms, reliability score).
- Purchase order tracking linked to product SKUs.
- Supplier performance trends (on-time rate, defect rate).

### Inventory
- Stock ledger by SKU and location (own warehouse, in-transit, Amazon FBA/FBM states).
- Reorder suggestions using demand velocity and supplier lead time.
- Stock risk alerts (low stock, overstock, stranded stock).

### Sales Channels
- Amazon connection as first-class channel.
- Extensible channel model for future connectors without changing core modules.
- Channel performance view with daily sales, returns, and fees.

### Orders
- Unified order inbox (Amazon-first).
- Dispatch queue prioritized by ship-by deadlines.
- Exception queue for payment, address, and stock issues.

### Delivery
- Shipment lifecycle tracking from pick/pack to delivered.
- Carrier and fulfillment performance metrics.
- Delay detection and proactive status notifications.

### Cash Flow
- Cash timeline: expected Amazon payout, supplier due dates, and operating outflows.
- Margin waterfall: revenue -> Amazon fees -> logistics -> COGS -> net contribution.
- Short-horizon cash health indicator and alerts.

### Customer Support
- Ticket and case view from Amazon messages, returns, and complaints.
- Root-cause tagging (product issue, fulfillment issue, listing issue).
- SLA dashboard with priority sorting.

### Marketing
- Campaign performance ingestion from Amazon ads.
- Profitability metrics (ACOS, TACOS, ROAS, contribution margin).
- Budget and bid recommendation assistant.

## Explicit Out of Scope for Version 1
- Full general ledger and accounting suite.
- Advanced manufacturing MRP and production planning.
- Full CRM automation platform.
- HR, payroll, and fixed asset modules.
- Broad ERP replacement workflows.

## Technical Baseline
- Database: PostgreSQL.
- Backend: FastAPI (Python) with clear service boundaries.
- Frontend: Next.js + TypeScript.
- API contracts: Type-safe DTOs and validation.
- Architecture: Modular by domain with shared platform services.

Implementation direction:
- Keep module boundaries clean so capabilities can grow without rework.
- Use adapter patterns for Amazon and future external channels.
- Keep AI provider calls behind platform abstraction layers.

## UX Rules for Every Screen
- One primary question per screen.
- One primary action per screen.
- Time-to-answer target: under 10 seconds for operational views.
- Mobile-friendly action flows for owners and operators.
- Clear status, filters, and saved views by role.

## AI-Assisted Workflows (Version 1)
- Forecast assistant for reorder and stockout risk.
- Listing quality assistant for title, bullets, and content completeness.
- Support triage assistant for priority and root-cause suggestion.
- Marketing optimization assistant for campaign budget guidance.

Guardrails:
- AI suggestions are advisory, not autonomous posting.
- Human confirmation required for high-impact actions.

## Delivery Phases

## Phase 1: Amazon Selling Control Plane (0-6 months)
Priority modules:
- Products
- Suppliers
- Inventory
- Orders
- Delivery
- Cash Flow (core)

Success gates:
- Daily dispatch clarity for all active orders.
- Stockout rate reduced with reorder alerts.
- Owner can see available cash position and upcoming obligations.

## Phase 2: Operations Intelligence (6-12 months)
Priority modules:
- Customer Support
- Marketing
- Cash Flow (advanced)
- Sales Channels extensibility

Success gates:
- Faster support resolution and lower repeat complaint categories.
- Campaign decisions based on contribution margin, not only revenue.
- Cross-module operational dashboard for supplier-to-cash visibility.

## Phase 3: Expansion Readiness (12+ months)
Objectives:
- Add connectors, automation depth, and advanced planning.
- Prepare foundations for future Manufacturing ERP evolution.

Constraint:
- Preserve Amazon-first workflow quality while expanding capabilities.

## Architecture Guardrails
- Maintain modular domain architecture and avoid monolith-style coupling.
- Keep provider independence for AI, search, and external integrations.
- Ensure tenant isolation, RBAC, auditability, and observability.
- Design plugins/adapters so new channels and tools can be added safely.

## KPIs for Version 1
- Order dispatch SLA adherence.
- Stockout incidence and days out of stock.
- Inventory turnover and overstock rate.
- Contribution margin by SKU.
- Cash availability forecast accuracy.
- Support first-response and resolution times.
- Campaign profitability metrics (ACOS, TACOS, ROAS with margin context).

## Decision
Adopt this roadmap as the Commerce Version 1 operating baseline:
- Amazon-first,
- supplier-to-cash visibility,
- fast and simple workflows,
- no unnecessary ERP replacement scope.

Future evolution toward Manufacturing ERP remains intentional, but outside Version 1 delivery scope.
