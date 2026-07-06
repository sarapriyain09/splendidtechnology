# ADR 0011: Plugin Framework for Extensibility
- Status: Accepted
- Date: 2026-06-29

## Context
The platform must evolve quickly by adding agents, tools, connectors, and providers with minimal core changes.
Direct registration in core code creates coupling and slows expansion.

## Decision
Adopt a Plugin Framework where agents, tools, workflows, connectors, and providers are packaged as pluggable modules registered through contracts.
Core services depend on interfaces and discovery metadata.

## Consequences
- Faster capability expansion and partner integrations
- Reduced core framework churn
- Requires plugin compatibility/version governance

## Alternatives Considered
- Static registrations in core source
- Module-specific extension points only

## Follow-up Actions
- Define plugin manifest schema and lifecycle hooks
- Add compatibility checks and plugin health signals
