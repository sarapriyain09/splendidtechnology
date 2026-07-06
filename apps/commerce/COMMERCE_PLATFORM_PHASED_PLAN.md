# Velynxia Commerce Platform - Detailed Phased Plan

## Objective

Build one integrated commerce operating platform with Products as the core domain and shared data services across Commerce, Operations, and Business.

Portfolio alignment rule:
- Top-level parent apps are Growth Platform, Commerce Platform, Website, and AI Studio (with Admin Console as future platform app).
- Other capabilities should be implemented under these parents as modules.

Canonical app namespace target: apps/commerce.
Current implementation base: apps/commerce.

## Platform Structure

- Dashboard (control plane)
- Product Studio (core)
- Supplier Hub
- Marketplace Hub
- Inventory
- Orders
- Customers
- AI Commerce
- Analytics

## Domain Mapping

The Commerce Platform keeps Products as the canonical core entity and organizes features into three working layers:

- Product Core Layer
   - Product Management
   - Categories
   - Brands
   - Variants
   - Images
   - Product Description
   - Pricing
   - Attributes
   - Specifications
   - SEO
   - Documents
   - Product Approval
- Commerce Operations Layer
   - Supplier Hub
   - Marketplace Hub
   - Inventory
   - Orders
   - Customers
- Intelligence Layer
   - Product Intelligence
   - AI Commerce
   - Analytics

## Principles

- Product-first navigation and workflows
- Single source of truth for Product, Order, Inventory, Customer, Supplier
- Connector-based channel integrations (no channel-owned core data)
- Fixed viewport desktop shell with internal scrolling only

## Phase 1 - Product Readiness + Core Commerce Foundation

Status: In progress

### Scope

- Dashboard
- Products
- Categories and Collections
- Suppliers
- Inventory foundations
- Orders foundations
- Commerce publishing foundations

### Phase 1 Deliverables

1. Dashboard control plane with Product, Commerce, Operations, Business visibility.
2. Product workspace baseline with lifecycle stages and shared tabs.
3. Product catalog data model including variants, media, pricing, cost, dimensions, supplier links.
4. Supplier management baseline (MOQ, lead time, terms, certificates, source country).
5. Inventory baseline (available, reserved, incoming, reorder thresholds).
6. Unified order queue baseline (manual and connector-ready ingestion).
7. Commerce publication baseline with channel readiness status per product.

### Phase 1 Out of Scope

- Full Amazon SP-API sync flows
- Full shipping carrier orchestration
- Advanced CRM automation
- Full accounting engine integration

### Phase 1 Acceptance Criteria

1. User can create one product and manage its full readiness checklist.
2. Product can be marked Ready to Sell only when required readiness gates pass.
3. Product holds one canonical record reused by all channel projections.
4. Inventory and Orders data models exist and are linked to Product.
5. Dashboard surfaces Product-centric KPIs and module-level status.

## Phase 2 - Commerce Platform Expansion (Reserved)

Status: Reserved by architecture, not active delivery scope

### Scope

- Product Studio hardening across full product lifecycle modules
- Supplier Hub baseline with sourcing workflows and supplier scoring
- Marketplace Hub adapters (Amazon, eBay, Shopify, WooCommerce, TikTok Shop, Etsy, Facebook Marketplace)
- Import adapters for Temu and Alibaba (import only in first cut)
- Product Intelligence module set
- AI Commerce orchestration module set
- Inventory and Orders workflow expansion
- Commerce analytics baseline across marketplace, profitability, and stock telemetry

### Outcomes

1. Users can import products from approved connectors and CSV into Product Studio.
2. Product Intelligence can enrich imported products with AI-generated title, description, keywords, and pricing suggestions.
3. Marketplace Hub can publish optimized product projections from one canonical product record.
4. Orders and inventory events from channels converge into unified operational flows.

### Reserved Workflow Contract

Import Product -> AI Enrichment -> Price/Margin Recommendation -> Publish -> Orders -> Profit/Inventory Intelligence

This contract is reserved now so implementation later does not require structural refactors.

## Phase 3 - Growth and Business Operations

### Scope

- Marketing workflows
- Accounting integration layer
- CRM workflows
- Analytics expansion

### Outcomes

1. Closed loop from Product to Revenue to Profitability analytics.
2. Business module aligns customer, finance, and marketing telemetry.

## Phase 4 - AI and Automation

### Scope

- AI agents for product, pricing, and demand workflows
- Automation pipelines
- Forecasting and demand planning

### Outcomes

1. AI-assisted recommendations integrated directly into product workspaces.
2. Automated planning cycles for inventory, pricing, and launch actions.

## Product Intelligence (Reserved Capability Set)

- AI Product Description
- AI Title Generator
- Keyword Generator
- SEO Optimizer
- Competitor Analysis
- Price Recommendation
- Margin Calculator
- Review Analysis
- Image Enhancement
- Translation
- Product Scoring

## AI Commerce (Reserved Capability Set)

- Product Research
- Product Recommendation
- Product Classification
- Product Matching
- Image Recognition
- Auto Pricing
- Profit Analysis
- Demand Prediction
- Inventory Forecast
- Supplier Recommendation
- Customer Recommendation
- AI Assistant

## Sprint 0 (Start Now)

Status: Started

1. Align platform naming and shell copy to Velynxia Commerce Platform.
2. Add dashboard domain control cards: Products, Commerce, Operations, Business.
3. Keep existing routes stable while preparing module mapping refactor.
4. Create phased implementation document in repository.

## Sprint 1 (Next)

Status: In progress

1. Introduce explicit domain routes:
   - /products
   - /commerce
   - /operations
   - /business
2. Add Product readiness checklist model and UI.
3. Add Category and Collection model + CRUD endpoints.
4. Add Supplier profile and product-supplier linkage.
5. Add Inventory baseline model and product stock cards.

Progress notes:

1. Domain routes are now active in left navigation for Products, Commerce, Operations, and Business.
2. Product Readiness Checklist UI is added to Products workspace as the first readiness baseline.
3. Product catalog foundation APIs are implemented for Categories, Collections, Products, and Product-Supplier links.
4. Products workspace now includes a Catalog Setup panel to create categories, collections, and products.
5. Backend and frontend test suites pass after these changes.

## Sprint 2 (Next)

1. Add unified order queue model and UI shell.
2. Add order status lifecycle and basic transitions.
3. Add publish readiness status board per product.
4. Add channel connector configuration placeholders (disabled by default).

## Risks and Mitigations

1. Risk: scope creep from adding too many channels too early.
   Mitigation: keep connectors adapter-only in Phase 1, no deep sync flows.
2. Risk: duplicate data models across modules.
   Mitigation: enforce Product-centric contracts and shared entities first.
3. Risk: UI fragmentation from feature-by-feature pages.
   Mitigation: keep Product workspace and fixed enterprise shell as governing pattern.

