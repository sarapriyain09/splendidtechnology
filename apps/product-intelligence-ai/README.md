# Velynxia Product Intelligence AI

AI-powered product research platform for Amazon UK/EU/US and B2B markets.

Project planning and stage tracking:
- [PROJECT_PLAN_AND_STATUS.md](PROJECT_PLAN_AND_STATUS.md)

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
- Database: PostgreSQL (SQLAlchemy)
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

## Folder Layout

- `backend/`: FastAPI APIs for all core modules + PostgreSQL persistence
- `frontend/`: Dashboard and module-ready UI shell

## Run Backend

```powershell
cd apps/product-intelligence-ai/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8011
```

## Database Migrations (Alembic)

Run migrations from `apps/product-intelligence-ai/backend`:

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
cd apps/product-intelligence-ai/frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend URL: `http://localhost:3020`
Backend URL: `http://localhost:8011`

## Next Implementation Steps

1. Replace placeholder discovery data with compliant connector services.
2. Wire review and opportunity modules to `services/agent-platform` prompt keys.
3. Add auth, tenant scoping, correlation IDs, and role checks per app adapter standard.
4. Add Alembic migrations and normalized product/review/cost tables.
5. Implement PDF report generator and export endpoints.

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
