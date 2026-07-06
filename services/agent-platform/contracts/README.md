# Contracts

Shared contracts for Agent Platform integration.

Current contracts:

- `agent.types.ts`
	- `TenantContext`
	- `AgentInput`
	- `AgentConfig`
	- `AgentPlanResult`
	- `ToolExecutionResult`
	- `AgentExecuteResult`
	- `Agent` interface
- `event.types.ts`
	- `AgentEvent`
	- `EventHandler`
	- `EventSubscription`

Use these contracts to keep agent lifecycle, tool execution, and events consistent.

All apps should integrate through these contracts to avoid tight coupling.
