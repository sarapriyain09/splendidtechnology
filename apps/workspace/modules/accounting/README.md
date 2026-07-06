# Velynxia Accounting

Velynxia Accounting is a multi-tenant accounting module for UK SMEs.

The implementation baseline for accounting behavior is documented in `ACCOUNTING_STANDARDS.md`.

It follows ledger-first accounting rules:
- Double-entry only
- Balanced journals only
- No direct balance mutation
- Full audit trail for financial changes
- Company-scoped data access on every query

And standards-first accounting rules:
- UK-standard accounting workflows aligned to UK GAAP practice
- MTD-ready digital record keeping and VAT architecture
- General Ledger as the source of truth for reporting

## Current Status

This module is in active build.

Implemented:
- Backend auth endpoints (register/login/refresh/logout/me)
- Chart of Accounts API (list/create/update/deactivate)
- Default UK chart seeding on company registration
- Tenant and audit guardrails on account operations
- Integration tests for auth and company-scoped account access
- Frontend Next.js app with login and CoA list/create/edit/deactivate flows

## Module Scope (Phase 1)

- Authentication
- Dashboard summary
- Contacts (customer and supplier)
- Chart of Accounts
- Invoices
- Payments

## Tech Stack

Frontend:
- Next.js 15
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui
- TanStack Query

Backend:
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic

Security:
- JWT access token + refresh token
- RBAC (Owner, Accountant, Manager, Staff)

Infrastructure:
- Docker
- Redis
- Celery

## Project Layout

- backend: FastAPI service, models, services, routers, tests
- frontend: Next.js accounting UI app

## Shared Database

The backend is configured to use the shared PostgreSQL instance used by Growth Platform.

Environment file:
- backend/.env.example

Default connection (override in runtime env):
- DATABASE_URL=postgresql+psycopg://postgres:postgres@192.168.0.64:5432/velynxia_db

## Data Model Guardrails

Every accounting table must include:
- id (UUID)
- company_id
- created_at
- updated_at
- deleted_at
- created_by
- updated_by

Rules:
- Soft deletes only
- Never return or mutate data across companies
- All repository/service queries must filter by company_id

## Accounting Guardrails

- Journal entries must satisfy total_debits == total_credits
- Posted entries are immutable
- Corrections must use reversal + repost
- Account balances must be computed from journal lines

Required posting flows:
- Invoice: Dr Accounts Receivable, Cr Sales, Cr VAT Output
- Payment received: Dr Bank, Cr Accounts Receivable
- Supplier bill: Dr Expense, Dr VAT Input, Cr Accounts Payable
- Supplier payment: Dr Accounts Payable, Cr Bank

## API Response Standard

All endpoints should return:

{
  "success": true,
  "data": {},
  "message": ""
}

## Local Development

### Backend

1. Open folder: apps/workspace/modules/accounting/backend
2. Create env file from template: .env.example -> .env
3. Install dependencies:
   pip install -r requirements.txt
4. Run API:
   uvicorn app.main:app --reload --port 8010

### Frontend

1. Open folder: apps/workspace/modules/accounting/frontend
2. Install dependencies:
   npm install
3. Create env file from template: .env.example -> .env.local
4. Run UI:
   npm run dev

Default local URL:
- http://localhost:3015

## Quality Requirements

A financial feature is considered done only when:
1. Data model and migration are complete
2. Backend validation and command/query handlers are complete
3. Posting logic produces balanced journals
4. Audit events are recorded
5. Frontend workflow is complete
6. Unit and integration tests pass
7. Multi-tenant access control is verified
8. No cross-company leakage is possible

Operational checklist for implementation and review:
- PR_IMPLEMENTATION_CHECKLIST.md

## Build Plan

Detailed delivery plan is in BUILD_PLAN.md at this module root.

