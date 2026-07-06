# Memory

Memory adapters used by all agents.

Initial layers:

- session memory: request/run-local context
- app memory: per-application context
- org memory: cross-app context where allowed

## Current Example

- `InMemoryMemory.ts` provides a local tenant-scoped adapter for development and tests.

Guardrails:

- tenant isolation required
- explicit retention policy required
- audit trail for writes/updates
