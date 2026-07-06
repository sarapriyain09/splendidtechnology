---
applyTo: "services/agent-platform/**"
---

# Velynxia Agent Platform Architecture Instructions

## Objective
Build a reusable Agent Platform shared by Velynxia applications including CRM, Sales, Marketing, AI Media Suite, Accounting, Analytics, and Support.

The Agent Platform is not a standalone product UI. It is a backend capability layer consumed by applications.

## Layered Architecture

Applications
- CRM
- Sales
- Marketing
- AI Media Suite
- Accounting
- Analytics
- Support

Agent Platform
- Controller and API layer
- Agent orchestration layer
- Registry and workflow layer
- Memory and knowledge layer

Shared Services
- Auth and tenant context
- Logging and observability
- Queue and event bus
- File and media services

Data Layer
- PostgreSQL
- Redis optional

## Platform Structure
Use this structure under services/agent-platform.

- controllers
- services
- agents
- memory
- planner
- tools
- prompts
- workflows
- knowledge
- models
- types
- middleware
- routes
- utils

## Technology Defaults
- Backend runtime: Node.js
- API framework: Fastify preferred, Express acceptable
- Language: TypeScript strict mode
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT with tenant context
- Cache: Redis optional
- Queue: BullMQ optional
- Storage: local file storage initially
- LLM provider layer: abstract interface supporting OpenAI, Gemini, Claude, and local models later
- Must run in Docker and directly on Raspberry Pi 5

## Agent Contract
Every agent must implement a common interface and avoid duplicating platform logic.

```ts
export interface Agent {
  id: string;
  name: string;
  description: string;
  execute(input: AgentExecuteInput): Promise<AgentExecuteResult>;
  plan(input: AgentPlanInput): Promise<AgentPlanResult>;
  useTools(input: AgentToolInput): Promise<AgentToolResult>;
  remember(input: AgentMemoryInput): Promise<void>;
  summarize(input: AgentSummaryInput): Promise<AgentSummaryResult>;
}
```

Use composition for shared behavior and keep agent classes thin.

## Agent Registry
- Provide a registry that discovers and registers agents.
- Support adding new agent classes without modifying core framework.
- Support domain agents such as CRM, Sales, Marketing, Media, Support, Proposal.

## Tool Registry
- Tools are reusable modules.
- Agents call tools instead of accessing databases directly.
- Include initial tool contracts for CRM, Email, Calendar, File, Database, WhatsApp, Voice, Avatar, Search.

## Workflow Engine
Implement multi-step execution flow:
1. Receive request
2. Plan
3. Select agent
4. Select tools
5. Execute
6. Validate
7. Save memory
8. Return response

Design workflows so multi-agent chaining is supported without refactoring.

## Event-Driven Architecture Requirement
Prefer event-based collaboration over direct agent-to-agent calls.

Use domain events such as:
- lead.created
- quote.approved
- invoice.overdue
- video.generated
- customer.registered

Requirements:
- Strongly typed event contracts
- Idempotent consumers
- Dead-letter handling
- Correlation IDs across workflow steps

## Memory Model
Implement three abstract memory layers:
- Short-term: conversation context
- Long-term: user and tenant preferences
- Knowledge: business and domain data

Memory APIs must remain provider-agnostic so vector stores can be introduced later.

## Prompt Management
- Do not hardcode prompts in agent classes.
- Store prompts under prompts by domain.
- Support prompt versioning and safe fallback.

Suggested layout:
- prompts/crm
- prompts/sales
- prompts/marketing
- prompts/media
- prompts/support

## Logging and Observability
Every execution must log:
- Agent name
- Tenant and user
- Execution time
- Token usage
- Tools used
- Success or failure
- Error details

Use structured logging and consistent error envelopes.

## Security and Multi-Tenancy
- Enforce tenant-scoped access in every query and tool action.
- Never expose secrets in logs or responses.
- Sanitize tool inputs and prompt inputs.
- Require explicit permission checks for mutating actions.

## Scalability Targets
Design for future support of:
- Multi-agent collaboration
- Human approval workflows
- Scheduled agents
- Event-driven execution
- Plugin architecture
- Agent marketplace
- Multi-LLM providers
- Enterprise multi-tenancy

## Coding Standards
- TypeScript strict mode enabled
- SOLID design
- Dependency injection for core services
- No circular dependencies
- Keep business logic out of controllers
- Reusable and testable service modules
- JSDoc on exported classes and functions
- Consistent typed error handling

## Expected Outcome
Adding a new business agent should only require:
1. New class implementing Agent
2. Registration through discovery or registry config
3. Domain prompts and required tools

Core platform code should not need changes for routine agent additions.
