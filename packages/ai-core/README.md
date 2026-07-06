# @velynxia/ai-core

Reusable AI capabilities shared across Engineering, Commerce, Growth, and Media apps.

Current state:
- Legacy Product Intelligence implementation moved to `packages/ai-core/product-intelligence-ai`.

Target extraction layers:
- prompt contracts
- orchestration adapters
- scoring and recommendation utilities
- report generation helpers
- app-specific adapter bindings

Integration rule:
- App modules consume AI through adapter boundaries and shared contracts, not provider-specific SDK calls in feature code.
