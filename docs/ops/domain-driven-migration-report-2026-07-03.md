# Domain-Driven Monorepo Migration Report

Date: 2026-07-03
Status: Completed (with documented manual follow-up)

## Objective

Refactor repository layout from multiple standalone apps into domain-driven platform applications while preserving runtime compatibility during transition.

## New Application Topology

- apps/website
- apps/workspace
- apps/admin
- apps/engineering
- apps/commerce
- apps/growth
- apps/media

## Folder Moves Completed

| Source | Destination | Status |
| --- | --- | --- |
| apps/admin-console | apps/admin | moved |
| apps/engineering-platform | apps/engineering | moved |
| apps/commerce-platform | apps/commerce | moved |
| apps/growth-platform | apps/growth | moved |
| apps/accounting | apps/workspace/modules/accounting | moved |
| apps/product-studio | apps/commerce/modules/product-studio | moved |
| apps/ai-studio | apps/media/modules/ai-studio | moved |
| apps/aimediasuit | apps/media/modules/aimediasuit | moved |
| apps/avatar-studio | apps/media/modules/avatar-studio | moved |
| apps/product-intelligence-ai | packages/ai-core/product-intelligence-ai | moved |
| services/api | services/api-gateway | moved |
| services/reporting-service | services/analytics-service | moved |
| services/scheduler-service | services/workflow-service | moved |

## New Shared Package Folders Created

- packages/ui (existing)
- packages/auth (existing)
- packages/database (existing)
- packages/api-client (existing)
- packages/shared (created)
- packages/ai-core (created; legacy product-intelligence-ai moved inside)
- packages/engineering-core (created)
- packages/commerce-core (created)
- packages/media-core (created)
- packages/growth-core (created)

## Module Scaffolds Created

Engineering modules under apps/engineering/modules:
- dashboard
- projects
- torsional
- rotor-dynamics
- thermal
- electromagnetic
- structural
- digital-twin
- materials
- reports
- settings

Growth modules under apps/growth/modules:
- dashboard
- crm
- sales
- marketing
- automation
- support
- analytics

Commerce modules under apps/commerce/modules:
- dashboard
- catalog
- inventory
- pricing
- manufacturing
- orders
- suppliers
- analytics
- product-studio (moved)

Media modules under apps/media/modules:
- dashboard
- video
- avatar
- voice
- image
- subtitle
- presentation
- assets
- ai-studio (moved)
- aimediasuit (moved)
- avatar-studio (moved)

## Updated Imports and Path References

### Updated build/runtime paths

- .vscode/tasks.json
  - apps/accounting/* -> apps/workspace/modules/accounting/*
  - apps/commerce-platform/* -> apps/commerce/*
- .vscode/launch.json
  - apps/accounting/* -> apps/workspace/modules/accounting/*
- .github/workflows/commerce-platform-ci.yml
  - apps/commerce-platform/* -> apps/commerce/*
- scripts/reset-growth-admin-password.js
  - apps/growth-platform -> apps/growth

### Updated TypeScript aliases

In tsconfig.json, added:
- @velynxia/ui/*
- @velynxia/auth/*
- @velynxia/database/*
- @velynxia/api-client/*
- @velynxia/shared/*
- @velynxia/ai-core/*
- @velynxia/engineering-core/*
- @velynxia/commerce-core/*
- @velynxia/media-core/*
- @velynxia/growth-core/*

### Updated governance/instructions

- .github/instructions/product-commerce-platform.instructions.md
  - applyTo: apps/commerce/**
  - scope text updated from apps/commerce-platform to apps/commerce
- .github/pull_request_template.md
  - accounting gate paths updated to apps/workspace/modules/accounting

## API and Routing Preservation Approach

- Existing application codebases were moved with directory contents preserved.
- Legacy media app code remains intact under apps/media/modules/* to avoid immediate route/API breakage.
- Commerce and Growth runtime paths were updated in tasks/CI to align with new locations.

## Manual Steps Required

1. Remaining documentation references
- Update stale references to old app paths in docs and module READMEs where historical notes still mention previous locations.

2. Legacy local process/task state
- Restart local dev processes and VS Code tasks after folder moves.
- If any terminal still points to deleted paths, re-run from new app directories.

3. CI/job naming cleanup
- Optional: rename workflow file .github/workflows/commerce-platform-ci.yml to commerce-ci.yml while keeping the same job logic.

4. Product Intelligence extraction hardening
- product-intelligence-ai has been relocated to packages/ai-core/product-intelligence-ai.
- Next step: extract reusable libraries from that code into package-level modules (contracts, adapters, prompt keys, report utilities), then replace app-level direct dependencies.

5. Launch/debug template updates in downstream workspaces
- If external workspace/task files exist outside this repo, update their cwd paths to new app directories.

## Validation Summary

- Verified new top-level app folders exist: admin, engineering, commerce, growth, media, workspace, website.
- Verified required service folders exist: api-gateway, auth-service, ai-service, notification-service, analytics-service, workflow-service.
- Verified required package folders exist: ui, auth, database, api-client, shared, ai-core, engineering-core, commerce-core, media-core, growth-core.
