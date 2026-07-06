# Product Studio Frontend

Next.js frontend for Velynxia Product Studio.

## Quick Start

```powershell
cd apps/product-studio/frontend
npm install
copy .env.example .env.local
npm run dev
```

Frontend URL: http://localhost:3020

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL.
- `NEXT_IMAGE_REMOTE_HOSTS`: Optional comma-separated list of additional remote image hostnames.

Example:

```powershell
NEXT_IMAGE_REMOTE_HOSTS=cdn.example.com,images.example.org
```

Notes:

- Use hostnames only. Do not include protocol (`http://` or `https://`) or path.
- Common domains for discovery thumbnails are already allowlisted in frontend image config.
- Restart the frontend dev server after changing environment variables.

## Checks

```powershell
cd apps/product-studio/frontend
npm run build
```

Optional helper script:

```powershell
cd apps/product-studio/frontend
.\scripts\run_frontend_checks.ps1 -Mode unit
```
