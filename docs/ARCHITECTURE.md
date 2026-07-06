# Velynxia Commerce Platform Architecture

RULE #1

Never create standalone pages.

Every feature belongs to one Product.

Every Product belongs to one Workspace.

The Product Workspace is the heart of the system.

RULE #2

Never duplicate data.

Products are created once.

All marketplaces (Amazon, Website, Shopify, eBay, Etsy) consume the same product data.

RULE #3

Never hardcode marketplace-specific logic into the Product.

Marketplace integrations are plugins/connectors.

RULE #4

The browser must never scroll.

Only internal panels and grids may scroll.

RULE #5

Always reuse the existing Velynxia layout, components, theme, authentication, and navigation.

## Vision

Velynxia Commerce Platform is a product-first enterprise system.

It is not an ecommerce storefront.

It is not a Shopify clone.

It is a Product Business Operating System (PBOS) for end-to-end product lifecycle execution.

It is a complete Product Business Management System that manages the full lifecycle from idea to customer feedback and next version.

Alternative strategic naming for external positioning: Velynxia Product Operating System (VPOS).

## Strategic Execution Decision

Pause CRM, ERP, and Product Intelligence as separate standalone applications.

Build one integrated Velynxia Commerce Platform with Products as the core domain.

AI Product Intelligence remains a module inside the unified platform, not a separate app.

## Portfolio Topology Decision

The product portfolio should be organized under these platform apps:

- Growth Platform
- Commerce Platform
- Website
- AI Studio
- Admin Console (future)

Everything else should be treated as modules/capabilities under these parent platforms, not as independent long-term standalone applications.

Committed capability grouping:

- Commerce Platform
	- Product Development
	- Manufacturing
	- Inventory
	- Marketplace
	- Orders
	- Accounting
	- Reports
- Growth Platform
	- CRM
	- Sales
	- Marketing
	- Customer Success
	- Automation
- AI Studio
	- Avatar
	- Video
	- Voice
	- Image
	- Documents
	- AI Agents

## Core Principle

The Product is the primary entity.

Users work with Products, not marketplaces.

Marketplaces and sales channels consume Product data via adapters.

## Product Lifecycle

Idea -> Product Finder -> Research -> Market Intelligence -> Review Intelligence -> AI Product Improvement -> Design -> Prototype -> Supplier -> Manufacturing -> Packaging -> Branding -> Product Approval -> Publish -> Orders -> Shipping -> Customer Feedback -> Version 2

## Platform Modules

- Products: product workspace, discovery, research, design, prototype, lifecycle
- Commerce: publish, channels, pricing, listings, orders, customers
- Operations: suppliers, manufacturing, inventory, fulfilment, shipping
- Business: CRM, accounting, reporting, planning and controls

## Strategic Platform Shape

The core platform is organized as:

- Dashboard (control plane and executive visibility)
- Products
- Commerce
- Operations
- Business

Products is the main application core. Commerce, Operations, and Business are connected domains that consume and enrich Product-centric data.

All domains operate on the same Product and shared business entities.

## Product Workspace Model

Every product opens a dedicated workspace with tabbed modules:

- Overview
- Research
- Competitors
- Reviews
- AI
- Design
- Prototype
- Manufacturing
- Supplier
- Inventory
- Cost
- Branding
- Marketing
- Sales
- Analytics
- History

Desktop behavior is fixed-viewport: no browser-level vertical scroll. Each workspace tab owns internal scrolling.

Product workspace is the primary working surface. The default navigation model is:

Dashboard -> Products -> Select Product -> Domain tabs (Commerce, Operations, Business capabilities)

## Data Model Direction

Shared core entities across modules:

- Product
- Product Version
- Supplier
- Inventory Item
- Order
- Customer
- Channel Listing
- Manufacturing Batch

The Product database is the source of truth. All channel publication is projection/synchronization from core Product records.

One inventory model must serve all channels (website, Amazon, B2B, marketplaces) through allocation and reservation logic.

## Integration Direction

Integrations are connector plugins, including:

- Amazon SP-API
- Shopify
- WooCommerce
- eBay
- Etsy
- Stripe
- PayPal
- Royal Mail / DPD / FedEx / DHL
- Xero / QuickBooks

Additional commerce connectors targeted by roadmap:

- TikTok Shop
- Facebook Shop

Connectors must be replaceable and isolated from Product domain logic.

Channel integrations should be enable/disable configurable at tenant level.

## Workflow Direction

Products move through governed lifecycle stages:

Idea -> Research -> Prototype -> Supplier -> Manufacturing -> Packaging -> Launch -> Sales -> Feedback -> Improvement -> Completed

All stage transitions should be auditable, role-aware, and automation-capable.

Commerce and operational workflows should be normalized through shared hubs:

- Order Hub: all inbound orders pass one canonical flow
- Inventory Hub: all stock movements pass one canonical flow
- Supplier/Manufacturing Hub: procurement to production to warehouse in one flow

## Phased Delivery Roadmap

Phase 1 - Product Readiness (current focus)

- Dashboard
- Product Management
- Product Finder
- Research
- AI Review Intelligence
- Product Improvement
- Cost Calculator
- Supplier
- Prototype
- Publish

Explicit Phase 1 exclusions:

- No Orders module
- No Inventory module
- No CRM module
- No ERP module

Phase 2 - Core Commerce Operations

- Inventory
- Orders
- Shipping
- Customers

Phase 3 - Channel Expansion

- Amazon SP-API integration
- Website channel integration
- B2B channel
- Marketing foundations

Phase 4 - Enterprise and Intelligence Expansion

- AI Agents
- Accounting
- CRM
- Advanced Analytics

## UI Direction

- Desktop-first enterprise shell
- Fixed header, left navigation, and contextual right panel
- Main workspace with tabs
- Internal scrollable grids and panels only
- Consistent design language across all modules

## Outcome Target

Velynxia should evolve as one integrated platform, not disconnected apps.

All new capabilities must integrate into Product Workspace and reuse shared platform services.

Home and decision flow should remain product-first, not order-first.

## Unified Platform Blueprint

Top-level user-facing suites:

- Dashboard
- Product Studio
- Commerce
- CRM
- ERP
- Accounting
- AI Agents
- Media Suite

Shared services that every suite must reuse:

- Authentication
- Products
- Customers
- Suppliers
- Inventory
- Documents
- Notifications
- AI Engine
- Reporting

No suite should create duplicate implementations of these shared services.