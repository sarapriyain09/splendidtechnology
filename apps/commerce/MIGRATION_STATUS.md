# Commerce Platform Migration Status

## Goal
Move from apps/product-studio to apps/commerce as the canonical app path.

## Current State
- Commerce platform architecture and phased roadmap are active.
- Runtime implementation is active under apps/commerce.
- Product Studio path is now treated as legacy transition space.

## Next Migration Steps
1. Keep CI, scripts, and docs pinned to apps/commerce paths.
2. Complete remaining naming cleanup from Product Studio identifiers where appropriate.
3. Smoke test routes, API, and data contract behavior.
4. Decommission legacy product-studio runtime artifacts once no dependency remains.

## Cutover Criterion
- All frontend and backend tests pass under apps/commerce paths.
- Dev, build, and deploy scripts use apps/commerce.
- Production deployment points to apps/commerce.

