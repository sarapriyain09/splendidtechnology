# ADR 0005: LLM Provider Abstraction Layer
- Status: Accepted
- Date: 2026-06-29

## Context
Business continuity, cost control, and model quality require flexibility across multiple LLM providers.
Hardcoding provider APIs in agents would increase migration effort and risk.

## Decision
All model access must pass through a provider abstraction layer.
Agents depend on LLMProvider interface only.

## Consequences
- Provider portability and fallback capability
- Improved testability through mock providers
- Requires additional adapter maintenance

## Alternatives Considered
- Direct provider SDK calls in each module
- Single provider lock-in

## Follow-up Actions
- Define LLM request and response contracts
- Add policy-based model routing and fallback behavior
