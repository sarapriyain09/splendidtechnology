# ADR 0008: Memory Service with Multi-Scope Abstraction
- Status: Accepted
- Date: 2026-06-29

## Context
Agent quality depends on short-term context, long-term preferences, and indexed business knowledge.
Memory logic distributed across applications leads to inconsistent retention and tenant isolation risks.

## Decision
Implement Memory as a dedicated platform service with abstraction for short-term, long-term, and knowledge memory scopes.
All memory access is tenant-scoped and contract-first.

## Consequences
- Consistent memory lifecycle and governance
- Clear separation from agent business logic
- Requires retention policy and storage backend abstractions

## Alternatives Considered
- Stateless agents only
- Per-application memory implementations

## Follow-up Actions
- Define MemoryProvider contracts
- Add retention, TTL, and archival policy framework
