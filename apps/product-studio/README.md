# Velynxia Product Studio

AI-powered product research platform for Amazon UK/EU/US and B2B markets.

Project planning and stage tracking:
- [PROJECT_PLAN_AND_STATUS.md](PROJECT_PLAN_AND_STATUS.md)

## Release Notes

### 2026-07-01

- Added idempotent Product DB save flow at `POST /api/v1/database/save` with stable response contract fields: `id`, `created`, `already_exists`.
- Added normalized uniqueness behavior for save keys (tenant + source + product + market) to prevent duplicate records from case/whitespace variants.
- Added saved-state lookup endpoint `POST /api/v1/database/saved-status` and frontend badge persistence so saved rows remain visibly `Saved` after reload/search.
- Added Alembic migration scaffolding and initial `saved_discovery_records` migration for deterministic schema setup.
- Added browser e2e coverage for discovery save persistence and saved/unsaved row actionability behavior.
- Added CI workflow for Product Studio pull requests to run backend pytest and frontend Playwright checks.
- Updated backend timestamp defaults to timezone-aware UTC and added regression coverage to keep that behavior stable.
- Added discovery bulk-save endpoint `POST /api/v1/database/save-bulk` with per-item results and aggregate counts.
- Added multi-select discovery UX with row checkboxes, select-all for visible unsaved rows, and `Save Selected (N)` action.
- Enhanced Saved Records UX with filter/search, summary metric cards, row highlighting, and a details side panel.
- Added dedicated Playwright coverage for bulk-save selection flow and post-save lock behavior.
- Added scoped git hygiene for local generated artifacts via `apps/product-studio/.gitignore`.

## Scope Covered

- Product Discovery with structured data output
- Review Analysis for top pain points
- Opportunity concept generation (3 concepts)
- Manufacturing cost and profit estimation
- Competition analysis and score
- Weighted product opportunity scoring (0-100)
- B2B market suggestions
- Product family roadmap generation
- Manufacturing drawing and CNC recommendations
- Marketing content generation
- Packaging recommendation
- Product analysis persistence and dashboard metrics

## Architecture

- Frontend: React (Next.js) + TypeScript + Tailwind
- Backend: FastAPI (Python)
- Database: SQLAlchemy abstraction with SQLite for local tests/dev and PostgreSQL for Raspberry Pi deployment
- AI Integration: Agent Platform adapter boundary (`app/services/agent_platform_client.py`)

## Compliance Guardrails

- No direct scraping in MVP implementation
- Use public/allowed connectors and user-provided data imports
- Keep AI orchestration behind shared Agent Platform integration boundary

## Required API Headers

All non-health backend endpoints require request context headers for tenancy, identity, and traceability:

- `X-Tenant-Id`
- `X-User-Id`
- `X-User-Role`
- `X-Request-Source`
- `X-Correlation-Id` (optional on inbound; auto-generated if omitted and returned in response headers)

## Authentication Modes

Backend supports two request-auth modes controlled by `AUTH_MODE`:

- `context` (default): validates request context headers only
- `jwt`: requires `Authorization: Bearer <access_token>` and validates token claims against context headers

JWT settings:

- `JWT_SECRET_KEY`
- `JWT_ALGORITHM` (default `HS256`)
- `JWT_ACCESS_TOKEN_EXP_MINUTES` (default `60`)

Login endpoint:

- `POST /api/v1/auth/login`
- Demo users:
	- `owner@velynxia.local` / `StrongPass123!`
	- `analyst@velynxia.local` / `StrongPass123!`

## Folder Layout

- `backend/`: FastAPI APIs for all core modules + PostgreSQL persistence
- `frontend/`: Dashboard and module-ready UI shell

## Run Backend

```powershell
cd apps/product-studio/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8011
```

For local machines without PostgreSQL, use the SQLite local profile:

```powershell
cd apps/product-studio/backend
copy .env.local.sqlite.example .env
uvicorn app.main:app --reload --port 8011
```

Or use the helper script:

```powershell
cd apps/product-studio/backend
.\scripts\start_backend.ps1 -Mode sqlite
```

For Raspberry Pi / PostgreSQL deployment profile:

```powershell
cd apps/product-studio/backend
copy .env.raspberry.example .env
uvicorn app.main:app --reload --port 8011
```

Or use the helper script with an explicit PostgreSQL URL:

```powershell
cd apps/product-studio/backend
.\scripts\start_backend.ps1 -Mode postgres -PostgresUrl "postgresql+psycopg://<db_user>:<db_password>@<db_host>:5432/velynxia_product_intelligence"
```

## Local Testing Database Strategy

- Local pytest runs are configured to use SQLite automatically via `backend/tests/conftest.py`.
- Raspberry Pi deployment should use PostgreSQL via `DATABASE_URL` in environment config.
- This lets local development and CI run without requiring a local Postgres instance.
- If `DATABASE_URL` is explicitly set before running pytest, tests will use that database instead of the SQLite default.

Run backend tests locally (SQLite):

```powershell
cd apps/product-studio/backend
& d:\Splendid-Technology\Velynxia\.venv\Scripts\python.exe -m pytest -q
```

Or use the helper script (SQLite default):

```powershell
cd apps/product-studio/backend
.\scripts\run_backend_tests.ps1
```

Run backend tests against an explicit PostgreSQL URL (for Raspberry/remote DB validation):

```powershell
cd apps/product-studio/backend
$env:DATABASE_URL="postgresql+psycopg://postgres:postgres@localhost:5432/velynxia_product_intelligence"
& d:\Splendid-Technology\Velynxia\.venv\Scripts\python.exe -m pytest -q
```

Or use the helper script in PostgreSQL mode:

```powershell
cd apps/product-studio/backend
.\scripts\run_backend_tests.ps1 -Mode postgres -PostgresUrl "postgresql+psycopg://postgres:postgres@localhost:5432/velynxia_product_intelligence"
```

## Database Migrations (Alembic)

Run migrations from `apps/product-studio/backend`:

```powershell
pip install -r requirements.txt
alembic -c alembic.ini upgrade head
```

Create a new migration revision:

```powershell
alembic -c alembic.ini revision -m "your message"
```

## Run Frontend

```powershell
cd apps/product-studio/frontend
npm install
copy .env.example .env.local
npm run dev
```

### Frontend Remote Image Hosts

Discovery thumbnails use Next.js image optimization and require remote host allowlisting.

Configure additional hosts in `frontend/.env.local`:

```powershell
NEXT_IMAGE_REMOTE_HOSTS=cdn.example.com,images.example.org
```

Notes:

- Keep values as comma-separated hostnames only (no `http://` or paths).
- Built-in defaults already include common sources such as Unsplash, Amazon, Etsy, Alibaba, and Shopify domains.
- Restart the frontend dev server after changing `NEXT_IMAGE_REMOTE_HOSTS`.

Run frontend checks with the helper script:

```powershell
cd apps/product-studio/frontend
.\scripts\run_frontend_checks.ps1 -Mode unit
```

Other modes:

```powershell
.\scripts\run_frontend_checks.ps1 -Mode e2e
.\scripts\run_frontend_checks.ps1 -Mode all
```

Frontend URL: `http://localhost:3020`
Backend URL: `http://localhost:8011`

## App-Level Quality Checks

Run backend + frontend checks together from the app root:

```powershell
cd apps/product-studio
.\scripts\run_quality_checks.ps1 -Mode local
```

Modes:

- `local`: backend SQLite tests + frontend unit tests
- `full`: backend SQLite tests + frontend unit and e2e tests

## Next Implementation Steps

1. Add additional compliant discovery providers (beyond local catalog-file connector) behind the connector abstraction.
2. Wire review and opportunity modules to `services/agent-platform` prompt keys.
3. Add auth, tenant scoping, correlation IDs, and role checks per app adapter standard.
4. Add Alembic migrations and normalized product/review/cost tables.
5. Implement PDF report generator and export endpoints.

## Discovery Connector Configuration

Discovery search is now provider-driven and defaults to a JSON catalog-file connector.

Backend environment variables:

- `DISCOVERY_CATALOG_PROVIDER` (`json_file` by default)
- `DISCOVERY_CATALOG_FILE` (relative to `backend/app/services/` unless absolute path)

Default catalog data file:

- `backend/app/services/data/public_catalog.json`

Example backend env file:

- `backend/.env.example`
- `backend/.env.local.sqlite.example` (local no-Postgres profile)
- `backend/.env.raspberry.example` (Raspberry/PostgreSQL profile)

## Agent Platform Prompt Keys

The backend AI-oriented endpoints are wired to these prompt keys:

- `product-intelligence.review-pain-points.v1`
- `product-intelligence.opportunity-concepts.v1`
- `product-intelligence.b2b-fit.v1`
- `product-intelligence.family-roadmap.v1`
- `product-intelligence.drawings-cnc.v1`
- `product-intelligence.marketing-content.v1`
- `product-intelligence.packaging-fba.v1`

## Discovery Search Query Controls

`POST /api/v1/discovery/search` supports:

- `keyword`
- `category`
- `market`
- `sources`
- `min_price`
- `max_price`
- `page`
- `page_size`
- `sort_by` (`title`, `price`, `rating`, `reviews`)
- `sort_order` (`asc`, `desc`)

Response metadata headers:

- `X-Total-Count`
- `X-Page`
- `X-Page-Size`
- `X-Sort-By`
- `X-Sort-Order`
- `X-Catalog-Row-Count`
- `X-Skipped-Row-Count`

## Product DB Save Idempotency

`POST /api/v1/database/save` is idempotent for the same tenant + source + product name + market.

Request body:

- `product_name`
- `source`
- `market`
- `opportunity_score`
- `estimated_profit_percent`
- `competition_score`

Response body:

- `id`
- `created`
- `already_exists`

## Saved Discovery Lookup

Use `POST /api/v1/database/saved-status` to resolve which discovery rows are already saved.

Request body:

- `items`: list of `{ source, title, market }`

Response body:

- `saved_row_keys`: list of UI row keys in the form `${source}-${title}`

## Frontend Context Header Environment Variables

Frontend requests can set context defaults via:

- `NEXT_PUBLIC_TENANT_ID`
- `NEXT_PUBLIC_USER_ID`
- `NEXT_PUBLIC_USER_ROLE`
- `NEXT_PUBLIC_REQUEST_SOURCE`
