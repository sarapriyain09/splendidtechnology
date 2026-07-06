# Velynxia Commerce Platform - Phase 2 Architecture Blueprint

Last updated: 2026-07-03

## Purpose

Reserve a future Commerce Platform architecture now, without expanding current 90-day execution scope.

This document defines module boundaries, workflow contracts, and data model direction so Phase 2 can start without restructuring the overall Velynxia platform.

## Platform Position

Velynxia portfolio:

- Growth Platform
- AI Media Suite
- Commerce Platform

Commerce Platform role:

- Source products
- Enrich product data with AI
- Publish across marketplaces
- Track revenue, margin, inventory, and operational performance

## Commerce Platform Structure

- Dashboard
- Product Studio
- Supplier Hub
- Marketplace Hub
- Inventory
- Orders
- Customers
- AI Commerce
- Analytics

## Product Studio (Core Domain)

Product Studio is the canonical source of truth for product entities.

Core modules:

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

Initial import channels:

- Temu (import)
- Alibaba (import)
- CSV import

## Product Intelligence (Differentiation Layer)

Reserved capability set:

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

## AI Commerce (Operational Intelligence Layer)

Reserved capability set:

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

## Marketplace Hub

Target connectors:

- Amazon
- eBay
- Shopify
- WooCommerce
- TikTok Shop
- Etsy
- Facebook Marketplace
- Temu (import)
- Alibaba (import)

Operating model:

Import Product -> AI Optimize -> Publish

## Workflow Contracts

### Import to Publish Contract

Import Product -> AI Description -> AI Images -> AI Keywords -> AI Pricing -> Publish -> Orders -> AI Analytics

### Feedback Loop Contract

Marketplace Sales + Reviews + Returns + Inventory Signals -> Product Intelligence + AI Commerce -> Recommendations -> Product/Price/Stock Actions

## Data Model Reservation

Canonical table groups to reserve in schema planning:

- products
- categories
- brands
- product_images
- product_variants
- product_attributes
- suppliers
- marketplaces
- marketplace_products
- orders
- order_items
- inventory
- inventory_transactions
- pricing_rules
- reviews
- product_ai_analysis
- competitor_products

## Integration and Governance Rules

- Product remains canonical; marketplace records are projections.
- Connector adapters are pluggable; no channel-specific logic inside core product services.
- AI modules are accessed via Agent Platform abstractions; no direct provider calls in business modules.
- Multi-tenant context is mandatory for all APIs and events.
- Event-driven coordination preferred for cross-module workflows.

## Delivery Strategy Recommendation

Current recommendation is to avoid full build now.

Near-term execution focus stays on:

1. CRM
2. Sales
3. Marketing
4. AI Media Suite

Commerce Platform remains architecture-reserved Phase 2.

## Phase 2 Start Gate

Start Commerce Platform implementation when at least one of the following conditions is met:

- Current 90-day core focus milestones are complete
- Shared platform services (agent, workflow, analytics, events) are stable for reuse
- Product import and enrichment use case is prioritized as next revenue engine

Execution backlog reference:

- apps/commerce-platform/PHASE2_EPICS_BACKLOG.md
