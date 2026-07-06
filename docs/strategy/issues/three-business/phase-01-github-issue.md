# Velynxia Three-Business Strategy - Phase 1 GitHub Issue

Date: 2026-07-04

## Issue 1 - Phase 1: 2026-2027 Foundation and Revenue Quality

Title:
Phase 1 - Business 1 Revenue Engine Stabilization (Growth + AI Media + Commerce)

Labels:
strategy, portfolio, business-1, saas, phase-1, priority-high

Assignees (suggested):
- Owner: Portfolio Lead
- Support: Growth Platform Lead
- Support: AI Media Lead
- Support: Commerce Platform Lead
- Support: Agent Platform Lead

Body:

### Objective
Build reliable recurring SaaS execution so Business 1 can fund Business 2 with predictable cash flow and delivery discipline.

### Scope
- Complete core workflows and reliability in Growth Platform and AI Media Suite.
- Keep Commerce Platform product-centric and execution-ready.
- Enforce platform observability, tenant safety, and AI integration governance.

### Engineering and product checklist
- [ ] Finalize top-priority Business 1 workflows and remove critical UX blockers.
- [ ] Enforce Agent Platform adapter boundary across app-level AI calls.
- [ ] Implement plan-aware quota and rate-limit behavior for production tenants.
- [ ] Standardize correlation IDs and structured logs across Business 1 requests.
- [ ] Publish reliability SLOs (availability, latency, error budget) per app.
- [ ] Add portfolio dashboard for latency, success rate, token/cost usage, and adoption.
- [ ] Validate tenant isolation and RBAC pathways for all customer-facing modules.
- [ ] Complete onboarding and retention lifecycle instrumentation.

### Acceptance criteria
- [ ] Sustained recurring revenue trend over at least two consecutive quarters.
- [ ] Retention and onboarding KPIs hit agreed portfolio threshold.
- [ ] Reliability targets consistently met for Growth, AI Media, and Commerce surfaces.
- [ ] No direct app-to-provider AI calls remain in audited Business 1 code paths.

### Non-functional requirements
- [ ] Error budget policy documented and actively used in release planning.
- [ ] Incident runbooks published for auth, quota, and platform degradation scenarios.
- [ ] Security review completed for tenant scoping and role enforcement.

### Dependencies
- Shared Agent Platform service stability.
- Shared auth, billing entitlement, and observability stack.

### Risks
- Fragmented metrics between apps can hide revenue quality issues.
- Fast feature delivery may regress reliability unless SLO-gated.

### Definition of done
- [ ] Quarterly review confirms Business 1 phase-gate passed.
- [ ] Capacity allocation for Phase 2 approved with explicit funding model.
