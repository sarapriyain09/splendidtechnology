# Velynxia Accounting Build Plan

Date: 2026-06-28
Owner: Velynxia Accounting Engineering

## Objective

Deliver Velynxia Accounting as a production-grade, multi-tenant accounting module with UK standards-first architecture, ledger-first accounting, and MTD-ready VAT/reporting foundations.

## Delivery Principles

- Build vertically: database -> backend -> frontend -> tests
- Complete one module end-to-end before starting next
- Keep business logic in domain/services, not UI
- No duplicate business logic
- Every financial mutation is auditable
- Follow UK-standard accounting workflows that accountants expect
- Do not implement custom accounting methods that diverge from double-entry/ledger practice
- Keep HMRC integration boundaries modular (no HMRC API coupling inside core accounting logic)

## Standards Baseline

This module follows `ACCOUNTING_STANDARDS.md` as the implementation baseline.

## High-Level Phases

Phase 1 (MVP Core)
- Authentication
- Dashboard
- Contacts
- Chart of Accounts
- Invoices
- Payments

Phase 2 (Operational Accounting)
- Bills
- Expenses
- Bank Transactions
- Journal Entries

Phase 3 (Compliance and Reporting)
- Profit and Loss
- Balance Sheet
- Trial Balance
- VAT Report
- General Ledger, Aged Receivables, Aged Payables

Phase 4 (Advanced Integrations)
- AI Assistant features
- Open Banking integration
- HMRC MTD readiness

## Detailed Plan (Phase 1)

### Sprint 1: Foundations and Security

Scope:
- Create Alembic migration baseline
- Establish shared base model and tenant guardrails
- Implement auth: register, login, refresh, logout
- Implement RBAC role model and permission checks
- Add audit event service and middleware hooks

Deliverables:
- Stable auth API with token lifecycle
- company_id isolation enforced in query helpers
- audit events for auth and profile changes
- unit tests for auth and permission checks

Exit Criteria:
- Auth endpoints pass integration tests
- Unauthorized and cross-company requests blocked

### Sprint 2: Chart of Accounts (first complete module)

Scope:
- Account model and validation rules
- Seed default UK chart categories
- CRUD API for accounts
- Prevent hard-coded account IDs in business logic
- Frontend CoA list/create/edit flows

Deliverables:
- CoA API and frontend screens
- Account category constraints (assets/liabilities/equity/income/expenses)
- audit events for create/update/deactivate
- integration tests for company-scoped CoA access

Exit Criteria:
- CoA module complete end-to-end
- No cross-company account visibility

### Sprint 3: Contacts and Invoices

Scope:
- Customer/supplier contacts with payment terms and VAT number
- Invoice draft/sent/awaiting payment/paid/overdue/cancelled status flow
- Invoice line items with VAT handling
- Posting service for invoice journals

Deliverables:
- Contact and invoice APIs
- Invoice posting templates enforced
- Frontend contact and invoice workflows
- tests for invoice posting balance and VAT behavior

Exit Criteria:
- Invoice posting always balanced
- Posted invoice corrections done by reversal + repost

### Sprint 4: Payments and Dashboard

Scope:
- Payment capture and allocation to invoices
- Posting for payment received
- Dashboard aggregate widgets from journal data
- Skeletons and empty states for accounting pages

Deliverables:
- Payment APIs and UI
- Dashboard metrics from ledger-derived queries
- tests for partial payment behavior

Exit Criteria:
- Payment + invoice lifecycle works end-to-end
- Dashboard reconciles with seeded journal scenarios

## Data and Ledger Non-Negotiables

- All journal entries must balance
- Posted journal entries are immutable
- Account balances are derived only from journal lines
- Financial corrections are reversal + repost

## VAT Scope

Supported VAT rates:
- 20%
- 5%
- 0%
- Exempt

Phase 1 implementation:
- VAT capture and calculation on invoice and bill lines
- VAT output/input account mapping

Phase 3 implementation:
- VAT report and return dataset generation

## Testing Strategy

Unit tests:
- Domain rules and validators
- Posting logic per transaction type
- RBAC and permission checks

Integration tests:
- Auth flows
- CoA/contacts/invoice/payment APIs
- Multi-tenant isolation checks
- Journal balancing and immutability checks

Scenario tests:
- Invoice -> partial payment -> full payment
- Supplier bill -> payment
- VAT impact on trial balance and report inputs

## Definition of Done (Financial Features)

A feature is done only when:
1. Migration and schema updates are complete
2. Backend command/query handlers are complete
3. Posting produces balanced journals
4. Audit events are emitted
5. Frontend workflows are production-ready
6. Unit and integration tests pass
7. Multi-tenant constraints are verified
8. API documentation is updated

Execution checklist for every feature PR:
- PR_IMPLEMENTATION_CHECKLIST.md

## Immediate Next Tasks

1. Create Alembic setup and initial migration for company, user, membership, account, audit tables
2. Implement auth routers and token service in backend app
3. Implement CoA service and routers with company filters
4. Scaffold frontend app shell and auth pages
5. Add CI test commands for backend unit and integration tests
