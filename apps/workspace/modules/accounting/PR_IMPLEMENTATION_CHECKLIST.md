# Accounting Feature PR Checklist

Use this checklist for every accounting feature PR. A PR should not be merged until all applicable items are complete.

Related standards:
- ACCOUNTING_STANDARDS.md
- BUILD_PLAN.md

## 1) Scope and Architecture

- [ ] Scope is clearly defined and limited to the feature goal.
- [ ] Changes follow module boundaries (frontend/backend/domain) without duplicated business logic.
- [ ] Accounting logic remains in services/domain layers, not UI.
- [ ] No direct account balance mutation is introduced.

## 2) Data Model and Tenancy

- [ ] Migration(s) added or updated where schema changes are required.
- [ ] Every new financial table includes mandatory audit/ownership columns.
- [ ] All read/write queries are company-scoped.
- [ ] Soft-delete behavior is preserved where applicable.

## 3) Double-Entry and Posting Rules

- [ ] Financial transactions post through the Accounting Engine.
- [ ] Journal entries are balanced (debits == credits).
- [ ] Posted entries are immutable.
- [ ] Corrections are reversal + repost, not direct mutation.
- [ ] Posting templates align to standard UK accounting flows.

## 4) VAT and Tax Handling

- [ ] Transaction lines store net, VAT rate, VAT amount, gross, and tax code.
- [ ] VAT rate behavior matches supported UK VAT categories.
- [ ] No invalid tax codes are accepted.
- [ ] Manual VAT overrides are permission-protected when present.

## 5) Audit and Record Keeping

- [ ] Audit events are emitted for create/update/post/deactivate/reverse actions.
- [ ] Audit payload includes actor, timestamp, entity, action, old/new values where relevant.
- [ ] Digital records remain traceable to source module and reference IDs.

## 6) API and Security

- [ ] RBAC and permission checks cover all new endpoints/actions.
- [ ] Cross-company access attempts are blocked.
- [ ] API response contracts remain consistent.
- [ ] Validation prevents unbalanced journals and invalid financial states.

## 7) Frontend and Workflow Integrity

- [ ] UI states reflect accounting lifecycle correctly (draft, posted, paid, etc. where applicable).
- [ ] UI does not bypass backend accounting controls.
- [ ] Empty/loading/error states are handled cleanly.
- [ ] User actions that affect accounting are explicit and confirmable.

## 8) Testing and Verification

- [ ] Unit tests added/updated for validators and domain rules.
- [ ] Integration tests added/updated for API behavior and tenancy boundaries.
- [ ] At least one test verifies balanced posting for the new financial flow.
- [ ] Existing accounting test suite passes.
- [ ] Manual QA scenario executed for the full feature lifecycle.

## 9) Documentation and Release Readiness

- [ ] README or module docs updated for behavior/API changes.
- [ ] BUILD_PLAN/standards references updated if scope changed.
- [ ] Any assumptions, limitations, or follow-up tasks are documented.
- [ ] PR description includes accounting impact summary and test evidence.
