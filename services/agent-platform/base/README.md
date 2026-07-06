# Base Framework

Shared framework primitives for all business agents.

## Components
- `BaseAgent` lifecycle: validate, plan, tool execution, verify, memory, publish events
- `BaseTool` common execution and tenant context validation
- `BaseMemory` provider abstraction for short-term, long-term, and knowledge memory
- `BaseWorkflow` abstraction for reusable execution templates

## Goal

Keep at least 90 percent of lifecycle and orchestration logic in shared framework code.
Business agents should only contribute domain plan logic and guardrails.
