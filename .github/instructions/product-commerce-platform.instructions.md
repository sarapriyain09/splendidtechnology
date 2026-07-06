---
applyTo: "apps/commerce/**"
---

# Velynxia Product Commerce Platform Instruction

## Scope

These instructions apply to all implementation work under apps/commerce.

## Core Identity

Treat Product Studio as the foundation of Velynxia Commerce Platform.

Do not design this application as a storefront clone or marketplace-specific tool.

## Product-Centric Rule

- Product is the primary entity.
- Every feature must attach to a Product context.
- Users should manage products first, channels second.

## Workspace Rule

- Never create disconnected standalone pages.
- Build features inside the Product Workspace model.
- Preserve fixed viewport desktop shell with internal scroll regions only.

## Data and Integration Rules

- Do not duplicate Product data per channel.
- Keep one canonical Product record and project to channels.
- Implement Amazon, Shopify, Website, eBay, Etsy, and other channel behavior through connectors/adapters.
- Never hardcode channel-specific business rules into core Product domain models.

## Module Direction

Implementation should align with platform module families:

- Product Studio
- Commerce
- Operations
- Business
- AI

Favor shared contracts and reusable services over per-module custom data flows.

## UX Rule

- Maintain enterprise desktop layout consistency.
- Browser-level scroll must remain disabled.
- Tabs, panels, and data grids use internal scrolling.

## Architecture Alignment

- Keep Product Workspace as the center of the app.
- Reuse existing Velynxia components, navigation, auth, and theme patterns.
- Avoid duplicate modules and parallel feature implementations.

## Delivery Rule

For new features, define:

- product lifecycle stage impact
- shared entity usage (Product, Supplier, Inventory, Customer, Order)
- connector/plugin boundaries
- workspace tab integration point

No feature should bypass Product context.