# Agent Platform (Initial Structure)

This folder is the shared Agent Platform service for all Velynxia applications.

## Goal

Provide one reusable AI foundation instead of creating a separate standalone "Agents app".

## Platform Scope

- Orchestrate multi-step agent tasks
- Plan tasks and choose tools
- Store memory across runs
- Manage model routing and provider fallback
- Register and execute tools
- Run reusable workflows
- Support app-specific agent definitions

## Current Directory Layout

- `orchestrator/` request lifecycle, execution state, retries
- `planner/` decomposition and step planning
- `memory/` short-term and long-term memory adapters
- `llm/` provider gateway, prompt templates, model policies
- `tools/` tool registry and app tool adapters
- `workflows/` reusable flow definitions
- `knowledge-base/` retrieval adapters and indexing contracts
- `registry/` agent metadata and permissions model
- `contracts/` shared interfaces and schemas
- `app-agents/` app-specific agent manifests
- `base/` generic framework classes (`BaseAgent`, `BaseTool`, `BaseMemory`, `BaseWorkflow`)
- `events/` event contracts and event bus implementation
- `agents/` thin domain agent implementations built on `base/`
- `prompts/` versioned domain prompts (do not hardcode in agents)
- `types/` re-export surface for shared contracts

## App Integration Model

Applications call the Agent Platform using contracts in `contracts/`.
Each app owns its own agent manifests in `app-agents/`.

## Phase Plan

1. Phase 0: contracts and manifests
2. Phase 1: orchestrator + tool registry MVP
3. Phase 2: memory + workflows
4. Phase 3: knowledge base + monitoring
5. Phase 4: admin module (agents, permissions, usage)

## Generic Framework Principle

The platform should keep most logic in shared framework layers.

- Shared framework: lifecycle, tools, memory, workflows, events, logging, errors
- Domain agents: only planning logic, domain guardrails, and config

Target: new agents should require minimal custom code and avoid core framework changes.

## Non-Goals (Initial)

- No standalone user-facing Agents product
- No marketplace in v1
- No third-party plugin ecosystem in v1
