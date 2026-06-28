# Velynxia AI Media Suite - Phase 7 GitHub Issue

Date: 2026-06-27

## Issue 7 - Phase 7: Prompt Library

Title:
Phase 7 - Prompt Library and Versioning

Labels:
ai-platform, prompts, template-management, phase-7, priority-medium

Assignees (suggested):
- Owner: LLM Engineer
- Support: AI Platform Lead
- Support: Frontend Lead

Body:

### Objective
Move prompts from hardcoded strings into a managed library with variable schemas, versioning, and permissions.

### Scope
- Prompt template CRUD and RBAC.
- Variable schema validation.
- Draft/publish lifecycle and rollback.
- Prompt usage analytics by template ID.

### Engineering checklist
- [ ] Create prompt data model (id, template, variables, owner, version, status).
- [ ] Implement prompt CRUD APIs with tenant and role checks.
- [ ] Add variable type validation, defaults, and required flags.
- [ ] Add draft/published state transitions and rollback endpoint.
- [ ] Integrate prompt lookup/version pinning into LLM execution flow.
- [ ] Add audit log for template changes.
- [ ] Add dashboard views for create/edit/publish and usage stats.

### Acceptance criteria
- [ ] Template renders valid final prompt from variable input.
- [ ] Invalid variables fail with clear validation errors.
- [ ] Rollback restores previously published template version.
- [ ] Unauthorized users cannot edit or publish templates.
- [ ] Usage analytics can be filtered by template ID and tenant.

### Non-functional requirements
- [ ] Edit history is immutable and queryable.
- [ ] Template fetch latency is within defined budget.
- [ ] Backward compatibility maintained for existing prompt callers.

### Dependencies
- Phase 2 router and prompt execution path.
- PostgreSQL schema migrations.

### Risks
- Prompt regression from uncontrolled template edits.
- Schema mismatch between template variables and frontend forms.

### Definition of done
- [ ] 10+ internal prompts migrated from code to prompt library.
- [ ] Prompt publishing process documented for team use.
- [ ] Production rollout completed with change audit enabled.
