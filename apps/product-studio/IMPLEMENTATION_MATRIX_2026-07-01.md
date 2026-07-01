# Velynxia Product Intelligence Platform - Implementation Matrix (2026-07-01)

Status legend:
- Done: implemented and usable now
- Partial: basic endpoint or placeholder exists, but full module scope is incomplete
- Missing: not implemented yet

## Technology Stack Requirements

| Requirement | Status | Evidence |
|---|---|---|
| React + TypeScript frontend | Done | `frontend/app/page.tsx`, `frontend/package.json` |
| Tailwind CSS | Done | `frontend/app/globals.css`, Tailwind config |
| Shadcn UI | Missing | No shadcn setup/dependencies in `frontend/package.json` |
| FastAPI backend | Done | `backend/app/main.py`, `backend/app/api/routes.py` |
| PostgreSQL support | Partial | SQLAlchemy + psycopg + postgres URL default in `backend/app/core/config.py`; local SQLite fallback docs/tests |
| JWT authentication | Partial | Added `/api/v1/auth/login`, JWT token utilities, optional JWT validation path (`auth_mode`) |
| RBAC | Partial | Added role-gated dependencies on mutating routes via `require_roles(...)` |
| Local storage | Done | Frontend query persistence and saved-state behavior in `discovery-workbench.tsx` |
| S3-compatible storage (future) | Missing | Not implemented |
| OpenAI GPT / local LLM support | Partial | Agent platform adapter integration exists; no local LLM provider wiring in this app |
| Prompt templates | Partial | Prompt-key based calls to Agent Platform exist; no app-side prompt governance UI |
| Modular service-based REST architecture | Partial | Service boundaries + REST endpoints exist, but many business modules not yet modeled |
| Future agent support | Partial | Agent-platform adapter exists (`backend/app/services/agent_platform_client.py`) |

## Core Module Coverage

| Module | Status | Notes |
|---|---|---|
| Dashboard | Partial | KPI overview available; many required KPIs (launch, revenue, supplier, manufacturing status) missing |
| Product Research | Partial | Route and API-backed concept workflow exist; full product master lifecycle and persistence still missing |
| Market Intelligence | Partial | Route and competition analysis workflow exist; trend/seasonality depth missing |
| Review Intelligence | Partial | Route and review pain-point analysis workflow exist; no full review dataset management |
| Product Improvement AI | Partial | Opportunity concept generation and route exist; no structured design-variant workflow persistence |
| Manufacturing | Partial | Route and manufacturing recommendations exist; no factory/MOQ/lead-time module |
| Materials | Missing | No dedicated materials catalog/module |
| Manufacturing Process | Missing | No process selection model/module |
| Product Family | Partial | Family generation endpoint exists; no parent-child persistent model |
| Supplier Management | Partial | Supplier discovery route exists; no supplier CRUD/model |
| Prototype | Partial | Prototype family roadmap route exists; no CAD/prototype version tracking |
| Cost Calculator | Partial | Cost estimate endpoint exists; full ROI/break-even calculator workflow missing |
| B2B Opportunity | Partial | B2B suggestion endpoint exists; no industry pipeline and revenue modeling module |
| Risk Assessment | Missing | No dedicated risk engine/model |
| Compliance | Missing | No standards registry (UKCA/CE/RoHS/etc.) |
| Branding | Missing | No branding data model/workflow |
| AI Marketing | Partial | Marketing generation endpoint exists; no campaign/project management workflow |
| Inventory | Missing | No inventory model/module |
| Shipping | Missing | No shipping calculator/module |
| Product Score | Partial | Scoring endpoint exists; full color-coded lifecycle scoring UI incomplete |
| Decision Engine | Missing | No recommendation state machine with reasoning/history |
| Reports (PDF/Excel) | Partial | Reports route with saved-analysis summary exists; no PDF/Excel export pipeline |

## Future Integration Readiness

| Integration Goal | Status | Notes |
|---|---|---|
| Amazon SP-API | Missing | No connector implementation |
| Amazon Advertising API | Missing | No connector implementation |
| Alibaba / Temu / Shopify / eBay / Etsy | Missing | No production connectors (only local/public catalog connector abstraction) |
| Accounting / CRM / ERP | Missing | No outbound integration adapters yet |

## Highest-Priority Gaps (Execution Order)

1. Authentication hardening: switch from header-only context to mandatory JWT mode in production and wire frontend login session flow.
2. Product master data model: add persistent entities for product research, manufacturing, supplier, compliance, and prototype stages.
3. Decision engine and report pipeline: implement recommendation workflow and PDF/Excel exports.
4. Frontend hardening: add cross-route navigation smoke coverage and stabilize e2e/dev cache behavior.
5. Connector roadmap: replace placeholder discovery catalog with approved external connector adapters.

## Changes Completed in This Update

1. Added JWT foundation and optional enforcement path:
- `backend/app/core/security.py`
- `backend/app/core/config.py` (`auth_mode`, JWT settings)
- `backend/app/core/request_context.py` (token validation support)

2. Added RBAC dependency helper and route-level role checks for mutating operations:
- `backend/app/core/request_context.py`
- `backend/app/api/routes.py`

3. Added initial auth login endpoint and token response contract:
- `POST /api/v1/auth/login`
- `backend/app/schemas.py`
- `backend/app/api/routes.py`

4. Added JWT runtime and configuration completeness:
- Added `PyJWT` dependency in `backend/requirements.txt`
- Added auth/JWT environment keys to backend profile examples

5. Added auth and JWT-mode contract tests:
- `backend/tests/test_auth_and_rbac.py`
- Covers login success/failure, JWT-required mode, claim/header mismatch rejection

6. Delivered module-route frontend expansion with API-wired workflows:
- Sidebar navigation routes implemented for Dashboard, Product Research, Market Analysis, Review Intelligence, Manufacturing, Suppliers, Prototype, Cost Calculator, B2B, Reports, Settings
- New API-backed UI workbenches added for review, market, cost, b2b, manufacturing, product research, and prototype modules

7. Added e2e navigation smoke coverage:
- `frontend/tests/e2e/navigation-smoke.spec.ts`
- Verifies sidebar navigation opens each module route and expected headings render
- Latest run status: `1 passed`
