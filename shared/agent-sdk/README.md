# Shared Agent SDK (Initial)

Shared code and helpers for app teams integrating with Agent Platform.

Planned contents:

- request/response DTOs
- auth helpers
- tool call client
- retry and timeout policies
- tracing helpers

Usage rule:

App code should depend on this SDK instead of re-implementing agent integration logic.
