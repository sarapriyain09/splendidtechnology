---
applyTo: "**"
---

# Velynxia Agentic AI Platform Master Instruction v1.0

## Objective
Design and implement Velynxia as a modular, enterprise-grade Agentic AI platform.

The platform must support:
- CRM
- Sales
- Marketing
- AI Media Suite
- Accounting
- Analytics
- Support
- Future Engineering modules

The architecture must be reusable, plugin-based, event-driven, multi-tenant, and provider-independent.

Do not tightly couple business modules to AI providers, vector stores, or database-specific implementations.

## Canonical Layering

Applications

-> Generic Agent Framework

-> Planner

-> Workflow Engine

-> Tool Manager

-> RAG Platform

-> LLM Provider Layer

-> Infrastructure

Every application should use the same Agent Framework primitives.

## Structural Direction
Preferred top-level structure for platform evolution:
- platform/agent-framework
- platform/planner
- platform/workflow
- platform/rag
- platform/tools
- platform/memory
- platform/prompts
- platform/llm
- platform/approvals
- platform/scheduler
- platform/events
- platform/plugins
- platform/monitoring
- platform/security
- platform/analytics
- shared/
- apps/

In current repository layout, map these concerns under existing `services/**`, `shared/**`, and `apps/**` without duplicating core platform logic.

## Generic Agent Framework Rules
- Business agents must remain thin and contain only domain-specific behavior.
- Shared lifecycle concerns belong in base framework services.
- Base lifecycle includes planning, memory, tool selection, prompt loading, workflow execution, validation, logging, event publishing, and error handling.

Prefer composition over deep inheritance when practical.

## Planner Rules
Planner is a replaceable component that:
- understands user goal
- decomposes tasks
- estimates tools
- selects workflow
- selects agent
- returns an execution plan

No planner logic should be hardcoded in controllers.

## Workflow Engine Rules
Workflows must be reusable and externalized from agents.
Support:
- task orchestration
- conditional branches
- parallel steps
- retry and backoff
- rollback or compensation
- human approval checkpoints
- event publishing

Do not embed workflow definitions directly inside business agents.

## Tool Framework Rules
Tools are reusable adapters. Agents must call tools and must not directly access external systems or storage internals.

Examples include CRM, email, calendar, WhatsApp, database, storage, search, avatar, video, PDF.

## RAG Platform Rules
RAG is a shared service and must not be implemented independently by each agent.

RAG responsibilities:
- ingestion
- chunking
- embedding generation
- vector indexing
- retrieval
- prompt context building

Use provider and store abstractions so implementations can be replaced.

## Memory Rules
Support and abstract:
- short-term conversational memory
- long-term user or tenant preference memory
- knowledge memory from business documents and records

Do not tie memory interfaces to one backend implementation.

## LLM Provider Rules
All LLM usage must go through a provider abstraction.
Support OpenAI, Gemini, Claude, and local models without changing business-agent code.

Agents must never call model vendors directly.

## Event Bus Rules
Use event-driven coordination.
Agents publish and subscribe to events; avoid direct agent-to-agent invocation.

Examples:
- lead.created
- quote.created
- invoice.generated
- customer.updated
- video.generated

## Scheduler and Background Jobs
Support cron-style schedules, recurring workflows, and background agent execution.

## Approval Engine Rules
Support human-in-the-loop workflows with multi-level approvals.
Workflows must support pause and resume around approval states.

## Prompt Management Rules
Prompts must be externalized, versioned, and testable.
Never hardcode prompts in business agent classes.

## Plugin Framework Rules
Treat agents, tools, workflows, LLM providers, RAG connectors, prompt packs, and event handlers as pluggable modules.
Adding plugins should require minimal to no changes in core framework.

## Monitoring and Analytics
Track at minimum:
- execution latency
- token usage
- estimated cost
- success rate
- workflow duration
- tool latency
- errors

Provide structured logs and dashboard-friendly metrics.

## Security and Multi-Tenancy
Enforce:
- tenant isolation
- JWT authentication
- RBAC
- audit logging
- prompt-injection safeguards
- rate limiting
- secret hygiene

Cross-tenant data access is never allowed.

## Design Patterns and Code Quality
Use TypeScript strict mode and apply SOLID principles.
Prefer dependency injection and interface-based design.

Pattern guidance:
- repository pattern
- factory pattern
- strategy pattern
- command pattern
- observer pattern
- plugin pattern

Avoid:
- business logic in controllers
- circular dependencies
- hardcoded prompts
- hardcoded provider APIs
- hardcoded SQL in agents

## Core Interface-First Rule
All modules should depend on contracts, not concrete implementations.

Minimum core interfaces:
- Agent
- Planner
- Workflow
- Tool
- Memory
- RAGProvider
- LLMProvider
- EventBus

## Delivery and Design-First Rule
Before major implementation, produce and maintain:
- ADRs per major component
- C4 documentation (context, container, component)
- sequence diagrams for core request paths
- schema blueprint for agents, workflows, prompts, memory, events, and audit logs

## Expected Outcome
Adding a new business capability should require only:
1. new agent configuration
2. registration with platform
3. assignment of tools, workflows, prompts, and permissions

Core framework should remain unchanged for routine business expansion.
