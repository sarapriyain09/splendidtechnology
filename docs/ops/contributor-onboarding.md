# Contributor Onboarding (Velynxia)

Date: 2026-06-27

This guide is for onboarding new contributors such as Shiva.

## 1. Access Checklist

- GitHub repository access granted.
- Vercel project access granted (least privilege).
- Database and infrastructure access granted (dev/staging first).
- Raspberry Pi access created via separate SSH user (no shared credentials).

## 2. Branching and PR Rules

- Create feature branches from main.
- Use descriptive branch names, for example: feat/phase-1-gateway-auth.
- Open PRs with linked issue IDs.
- Require at least one reviewer before merge.
- Do not push directly to main.

## 3. Task Management

Use these phase issue docs:

- docs/strategy/issues/README.md
- docs/strategy/velynxia-ai-media-suite-ready-to-paste-github-issues-phases-1-10.md

## 4. Definition of Ready

Before starting a task:

- Issue scope is clear.
- Dependencies are identified.
- Acceptance criteria are measurable.
- Owner and target milestone are assigned.

## 5. Definition of Done

Before closing a task:

- Acceptance criteria are complete.
- Validation evidence is attached.
- Relevant docs/runbooks are updated.
- Monitoring and alerting implications are addressed.

## 6. Security Basics

- Never commit secrets.
- Use environment variables and secret stores.
- Rotate credentials when team access changes.
- Follow least-privilege access for all services.

## 7. Suggested First Assignments for Shiva

- Phase 1 support tasks: auth middleware, quota middleware, request tracing.
- Phase 2 support tasks: provider fallback testing and cost telemetry.
- Phase 6 preparation: connector reliability and idempotency strategy.

## 8. Week 1 Delivery Plan

- docs/ops/week-1-execution-plan-owner-shiva.md
