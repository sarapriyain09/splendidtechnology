# Velynxia Commerce Amazon-First V1 PostgreSQL Schema Draft

Last updated: 2026-07-05
Owner: Commerce Platform Team
Status: Draft for implementation planning

## 1) Purpose
Define a PostgreSQL-first data model for Velynxia Commerce Version 1 with strict Amazon-selling scope:
- supplier to cash visibility
- no unnecessary ERP expansion
- modular domain boundaries

This draft maps directly to V1 modules:
- Products
- Suppliers
- Inventory
- Sales Channels
- Orders
- Delivery
- Cash Flow
- Customer Support
- Marketing

## 2) Core Data Rules
- Multi-tenant by default: every domain table includes tenant_id.
- Canonical product model: one product record, channel projections via mapping tables.
- Append-friendly ledgers: inventory and financial movements are recorded as immutable transactions.
- Auditability: all mutating operations are traceable.
- Idempotent ingest: external sync writes must tolerate retries.

## 3) Shared Conventions
### 3.1 Common Columns
Use in all primary domain tables unless a clear exception exists:
- id UUID primary key
- tenant_id UUID not null
- created_at TIMESTAMPTZ not null default now()
- updated_at TIMESTAMPTZ not null default now()
- created_by VARCHAR(100) null
- updated_by VARCHAR(100) null
- source_module VARCHAR(100) null
- is_deleted BOOLEAN not null default false

### 3.2 Multi-Tenant Index Pattern
For operational filtering speed, add composite indexes beginning with tenant_id.
Example pattern:
- (tenant_id, status)
- (tenant_id, created_at desc)
- (tenant_id, external_ref)

### 3.3 Money and Quantity Types
- Monetary values: NUMERIC(18, 4)
- Quantities: NUMERIC(18, 4)
- Rates/ratios: NUMERIC(9, 6)

### 3.4 State Columns
Use VARCHAR status fields with CHECK constraints or lookup tables.
Avoid database enums for faster iterative releases.

## 4) Module-by-Module Tables

## 4.1 Products
### products
Purpose:
- Canonical product registry for all channels.

Columns:
- id, tenant_id, sku, product_name, brand_name, category_name
- product_status (draft, ready, active, paused, archived)
- default_currency
- cost_amount, sale_price_amount
- readiness_score NUMERIC(5,2)

Constraints and indexes:
- unique (tenant_id, sku)
- index (tenant_id, product_status)
- index (tenant_id, readiness_score)

### product_variants
Purpose:
- Variant-level options tied to one product.

Columns:
- id, tenant_id, product_id
- variant_sku, option_values_json JSONB
- barcode, weight_kg, dimensions_json JSONB
- variant_status

Constraints and indexes:
- foreign key product_id references products(id)
- unique (tenant_id, variant_sku)
- index (tenant_id, product_id)

### product_channel_listings
Purpose:
- Channel projection and listing identity mapping.

Columns:
- id, tenant_id, product_id, variant_id null
- channel_id
- asin_or_listing_id VARCHAR(100)
- listing_status
- last_sync_at TIMESTAMPTZ
- listing_payload_json JSONB

Constraints and indexes:
- unique (tenant_id, channel_id, asin_or_listing_id)
- index (tenant_id, product_id, channel_id)

## 4.2 Suppliers
### suppliers
Purpose:
- Supplier master records and performance attributes.

Columns:
- id, tenant_id, supplier_code, supplier_name
- country_code, payment_terms_days, moq_default
- lead_time_days_default, reliability_score NUMERIC(5,2)
- supplier_status

Constraints and indexes:
- unique (tenant_id, supplier_code)
- index (tenant_id, supplier_status)

### supplier_products
Purpose:
- Product-to-supplier sourcing options.

Columns:
- id, tenant_id, supplier_id, product_id
- supplier_sku
- unit_cost_amount, currency_code
- lead_time_days, moq
- is_preferred BOOLEAN

Constraints and indexes:
- unique (tenant_id, supplier_id, product_id)
- index (tenant_id, product_id, is_preferred)

### purchase_orders
Purpose:
- Purchase order header from draft to received.

Columns:
- id, tenant_id, po_number, supplier_id
- po_status (draft, approved, sent, partial_received, received, cancelled)
- order_date, expected_date, received_date
- total_amount, currency_code

Constraints and indexes:
- unique (tenant_id, po_number)
- index (tenant_id, supplier_id, po_status)

### purchase_order_lines
Purpose:
- Purchase order line details per product or variant.

Columns:
- id, tenant_id, purchase_order_id
- product_id, variant_id null
- ordered_qty, received_qty
- unit_cost_amount, line_total_amount

Constraints and indexes:
- foreign key purchase_order_id references purchase_orders(id)
- index (tenant_id, purchase_order_id)

## 4.3 Inventory
### inventory_locations
Purpose:
- Stock locations across own warehouse and Amazon-related locations.

Columns:
- id, tenant_id, location_code, location_name
- location_type (warehouse, fba, in_transit, returns, quarantined)
- location_status

Constraints and indexes:
- unique (tenant_id, location_code)
- index (tenant_id, location_type)

### inventory_ledger
Purpose:
- Immutable stock movement journal.

Columns:
- id, tenant_id
- product_id, variant_id null, location_id
- movement_type (receipt, reserve, release, dispatch, return, adjust)
- quantity_delta NUMERIC(18,4)
- unit_cost_amount null
- reference_type, reference_id
- occurred_at TIMESTAMPTZ

Constraints and indexes:
- check (quantity_delta <> 0)
- index (tenant_id, product_id, location_id, occurred_at desc)
- index (tenant_id, reference_type, reference_id)

### inventory_reorder_policies
Purpose:
- Replenishment settings by product or variant.

Columns:
- id, tenant_id, product_id, variant_id null
- min_stock_qty, target_stock_qty, reorder_qty
- lead_time_days
- safety_stock_qty

Constraints and indexes:
- unique (tenant_id, product_id, variant_id)

## 4.4 Sales Channels
### sales_channels
Purpose:
- Configured sales channels per tenant.

Columns:
- id, tenant_id
- channel_code (amazon, shopify, ebay, website)
- channel_name
- channel_status

Constraints and indexes:
- unique (tenant_id, channel_code)

### channel_connections
Purpose:
- Channel auth and configuration metadata.

Columns:
- id, tenant_id, channel_id
- connection_status
- external_seller_id
- config_json JSONB
- last_successful_sync_at TIMESTAMPTZ

Constraints and indexes:
- unique (tenant_id, channel_id)

### channel_sync_runs
Purpose:
- Sync observability and idempotency control.

Columns:
- id, tenant_id, channel_id
- sync_type (orders, fees, payouts, campaigns, listings)
- sync_status (started, succeeded, failed, partial)
- started_at, ended_at
- records_read, records_written, error_count
- idempotency_key VARCHAR(150)

Constraints and indexes:
- unique (tenant_id, channel_id, idempotency_key)
- index (tenant_id, sync_status, started_at desc)

## 4.5 Orders
### orders
Purpose:
- Unified order header for channel orders.

Columns:
- id, tenant_id
- channel_id, channel_order_id
- order_number
- order_status (received, allocated, packed, dispatched, delivered, cancelled, returned)
- order_date, ship_by_date
- buyer_name
- currency_code
- item_subtotal_amount, shipping_amount, tax_amount, fee_amount, total_amount

Constraints and indexes:
- unique (tenant_id, channel_id, channel_order_id)
- index (tenant_id, order_status, ship_by_date)

### order_lines
Purpose:
- Order line details tied to products and variants.

Columns:
- id, tenant_id, order_id
- product_id, variant_id null
- ordered_qty, fulfilled_qty
- unit_price_amount, line_total_amount

Constraints and indexes:
- index (tenant_id, order_id)
- index (tenant_id, product_id)

### order_exceptions
Purpose:
- Actionable order issue queue.

Columns:
- id, tenant_id, order_id
- exception_type (stock, address, payment, channel_sync, other)
- severity (low, medium, high, critical)
- owner_user_id
- exception_status (open, in_progress, resolved, dismissed)
- reason_code, resolution_notes

Constraints and indexes:
- index (tenant_id, exception_status, severity)
- index (tenant_id, owner_user_id, exception_status)

## 4.6 Delivery
### carriers
Purpose:
- Carrier definitions and SLA baselines.

Columns:
- id, tenant_id, carrier_code, carrier_name
- sla_days_default
- carrier_status

Constraints and indexes:
- unique (tenant_id, carrier_code)

### shipments
Purpose:
- Shipment header tied to orders.

Columns:
- id, tenant_id, order_id, carrier_id
- tracking_number
- shipment_status (packed, handed_over, in_transit, delivered, issue)
- shipped_at, delivered_at, promised_by_date

Constraints and indexes:
- unique (tenant_id, carrier_id, tracking_number)
- index (tenant_id, shipment_status, promised_by_date)

### shipment_events
Purpose:
- Shipment status timeline and delay analytics.

Columns:
- id, tenant_id, shipment_id
- event_type
- event_timestamp
- event_payload_json JSONB

Constraints and indexes:
- index (tenant_id, shipment_id, event_timestamp desc)

## 4.7 Cash Flow
### cash_transactions
Purpose:
- Unified inflow and outflow ledger for cash visibility.

Columns:
- id, tenant_id
- transaction_type (payout, supplier_payment, shipping_cost, ad_spend, adjustment)
- direction (inflow, outflow)
- amount, currency_code
- occurred_at
- reference_type, reference_id
- reconciliation_status (unreconciled, matched, reconciled)

Constraints and indexes:
- index (tenant_id, direction, occurred_at desc)
- index (tenant_id, reconciliation_status)

### amazon_payouts
Purpose:
- Amazon payout headers.

Columns:
- id, tenant_id, channel_id
- payout_reference
- payout_period_start, payout_period_end
- payout_date
- gross_amount, fee_amount, net_amount
- payout_status

Constraints and indexes:
- unique (tenant_id, channel_id, payout_reference)
- index (tenant_id, payout_date desc)

### amazon_payout_lines
Purpose:
- Payout drilldown by order or fee item.

Columns:
- id, tenant_id, amazon_payout_id
- line_type (order, refund, fee, adjustment)
- order_id null
- amount
- description

Constraints and indexes:
- index (tenant_id, amazon_payout_id)
- index (tenant_id, order_id)

## 4.8 Customer Support
### support_cases
Purpose:
- Customer issue queue linked to orders and products.

Columns:
- id, tenant_id
- channel_id, channel_case_id
- order_id null, product_id null
- case_type (message, return, complaint)
- severity
- case_status (new, triaged, in_progress, resolved, closed)
- assigned_user_id
- opened_at, resolved_at

Constraints and indexes:
- unique (tenant_id, channel_id, channel_case_id)
- index (tenant_id, case_status, severity)

### support_case_events
Purpose:
- Timeline of support interactions and actions.

Columns:
- id, tenant_id, support_case_id
- event_type
- event_timestamp
- event_payload_json JSONB

Constraints and indexes:
- index (tenant_id, support_case_id, event_timestamp desc)

### support_root_causes
Purpose:
- Root cause taxonomy and trend tracking.

Columns:
- id, tenant_id, support_case_id
- root_cause_code
- root_cause_notes
- tagged_at

Constraints and indexes:
- index (tenant_id, root_cause_code, tagged_at desc)

## 4.9 Marketing
### marketing_campaigns
Purpose:
- Campaign registry per channel.

Columns:
- id, tenant_id, channel_id
- campaign_external_id
- campaign_name
- campaign_status
- budget_amount, currency_code
- start_date, end_date

Constraints and indexes:
- unique (tenant_id, channel_id, campaign_external_id)
- index (tenant_id, campaign_status)

### campaign_daily_metrics
Purpose:
- Daily campaign performance snapshots.

Columns:
- id, tenant_id, campaign_id
- metric_date
- impressions, clicks, spend_amount, sales_amount
- acos NUMERIC(9,6), tacos NUMERIC(9,6), roas NUMERIC(9,6)
- contribution_margin_amount

Constraints and indexes:
- unique (tenant_id, campaign_id, metric_date)
- index (tenant_id, metric_date desc)

### campaign_recommendations
Purpose:
- Advisory optimization suggestions.

Columns:
- id, tenant_id, campaign_id
- recommendation_type
- recommendation_reason
- recommended_action_json JSONB
- recommendation_status (open, accepted, rejected, expired)
- generated_at

Constraints and indexes:
- index (tenant_id, recommendation_status, generated_at desc)

## 5) Cross-Cutting Governance Tables
### audit_logs
Purpose:
- Immutable audit entries for critical mutations.

Columns:
- id, tenant_id
- entity_type, entity_id
- action_type
- previous_value_json JSONB
- new_value_json JSONB
- actor_user_id
- correlation_id
- occurred_at

Indexes:
- index (tenant_id, entity_type, entity_id, occurred_at desc)
- index (tenant_id, correlation_id)

### idempotency_keys
Purpose:
- Prevent duplicate writes in sync and command endpoints.

Columns:
- id, tenant_id
- idempotency_key
- request_hash
- response_hash
- expires_at

Constraints and indexes:
- unique (tenant_id, idempotency_key)

## 6) Recommended Materialized Views
Use for fast dashboard answers without altering source-of-truth tables.

### mv_inventory_position
Grouped by tenant_id + product_id + location_id.
Outputs:
- on_hand_qty
- reserved_qty
- available_qty

### mv_dispatch_today
Grouped by tenant_id and date.
Outputs:
- due_today_count
- overdue_count
- blocked_count

### mv_cash_30d_projection
Grouped by tenant_id and date bucket.
Outputs:
- projected_inflows
- projected_outflows
- projected_net

## 7) Migration Waves (Alembic)
Wave 1:
- products, product_variants, suppliers, supplier_products

Wave 2:
- inventory_locations, inventory_ledger, inventory_reorder_policies

Wave 3:
- sales_channels, channel_connections, channel_sync_runs, product_channel_listings

Wave 4:
- orders, order_lines, order_exceptions, carriers, shipments, shipment_events

Wave 5:
- amazon_payouts, amazon_payout_lines, cash_transactions

Wave 6:
- support_cases, support_case_events, support_root_causes

Wave 7:
- marketing_campaigns, campaign_daily_metrics, campaign_recommendations

Wave 8:
- audit_logs, idempotency_keys, materialized views

## 8) FastAPI and TypeScript Contract Notes
- Keep SQLAlchemy models aligned one-to-one with table boundaries above.
- Expose DTOs by module to avoid cross-module coupling.
- Require tenant context on every write and filtered read.
- For AI-assisted outputs, persist recommendation artifacts with explicit approval state.

## 9) V1 Non-Goals to Enforce in Schema Reviews
- No general ledger chart of accounts module in Commerce V1 schema.
- No manufacturing bill-of-materials and production routing tables.
- No broad CRM contact lifecycle beyond support case needs.

## 10) Open Decisions (to close before implementation)
1. Tenant key type alignment across portfolio services (UUID or string).
2. Whether product-level and variant-level cost should be split into separate history table in V1.
3. Channel credential secret storage boundary (DB reference only vs encrypted blob reference).
4. Retention period for high-volume event tables (shipment_events, support_case_events, channel_sync_runs).