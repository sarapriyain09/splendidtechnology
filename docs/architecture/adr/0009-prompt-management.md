# ADR 0009: Externalized Prompt Management with Versioning
- Status: Accepted
- Date: 2026-06-29

## Context
Prompt quality and safety are central to platform reliability.
Hardcoded prompts inside services reduce testability and make rollback difficult.

## Decision
Adopt a Prompt Management service where prompts are externalized, versioned, and testable.
Runtime prompt resolution is environment-aware and traceable through audit metadata.

## Consequences
- Safer prompt rollout and rollback paths
- Better observability and evaluation workflows
- Requires schema discipline for prompt variables and compatibility

## Alternatives Considered
- Prompt literals in source code
- Application-specific prompt stores

## Follow-up Actions
- Define PromptTemplate schema and validation
- Add prompt version pinning and experiment support
