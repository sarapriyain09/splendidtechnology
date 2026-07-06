# Agents

Business agents should stay thin and inherit from `base/BaseAgent`.

## Recommended Pattern

1. Define agent config manifest in `app-agents/*.yaml`.
2. Implement small domain class extending `BaseAgent`.
3. Override only:
- `plan()` for domain-specific planning
- `validateResult()` for domain-specific guardrails
4. Register the agent in `registry/AgentRegistry`.

## Current Examples

- `agents/sales/SalesAgent.ts`
- `agents/proposal/ProposalAgent.ts`

## Goal

Keep shared lifecycle behavior in framework code so new agents require minimal custom logic.
