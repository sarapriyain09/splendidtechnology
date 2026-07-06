# C4 Level 3 - Component View (Agent Request Path)

## Agent Framework Components
- Request Gateway
- Tenant Context Resolver
- Agent Registry
- BaseAgent Lifecycle Engine
- Execution Logger

## Planner Components
- Intent Interpreter
- Task Decomposer
- Tool Estimator
- Workflow Selector

## Workflow Components
- Step Runner
- Condition Evaluator
- Retry and Backoff Policy
- Approval Checkpoint Handler
- Rollback or Compensation Handler

## Tool Manager Components
- Tool Registry
- Permission Guard
- Tool Executor

## RAG Components
- Connector Plugins
- Ingestion Orchestrator
- Chunker
- Embedding Adapter
- Vector Store Adapter
- Retriever
- Prompt Context Builder

## LLM Components
- Provider Interface
- Provider Adapters
- Model Router
- Fallback Strategy

## Cross-cutting Components
- Event Publisher and Subscriber
- Metrics and Monitoring
- Audit Trail Writer
- Security Policy Guard

## Diagram

```mermaid
flowchart LR
	RG[Request Gateway] --> TCR[Tenant Context Resolver]
	TCR --> AR[Agent Registry]
	AR --> BA[BaseAgent Lifecycle Engine]

	BA --> PI[Intent Interpreter]
	PI --> TD[Task Decomposer]
	TD --> WS[Workflow Selector]
	TD --> TE[Tool Estimator]

	WS --> SR[Step Runner]
	SR --> CE[Condition Evaluator]
	SR --> RB[Retry and Backoff Policy]
	SR --> AP[Approval Checkpoint Handler]
	SR --> RC[Rollback or Compensation Handler]

	SR --> TR[Tool Registry]
	TR --> PG[Permission Guard]
	PG --> TX[Tool Executor]

	SR --> CP[Connector Plugins]
	CP --> IO[Ingestion Orchestrator]
	IO --> CH[Chunker]
	CH --> EA[Embedding Adapter]
	EA --> VS[Vector Store Adapter]
	VS --> RT[Retriever]
	RT --> PCB[Prompt Context Builder]

	PCB --> PRI[Provider Interface]
	PRI --> PRA[Provider Adapters]
	PRI --> MR[Model Router]
	MR --> FS[Fallback Strategy]

	BA --> EP[Event Publisher and Subscriber]
	BA --> MON[Metrics and Monitoring]
	BA --> AUD[Audit Trail Writer]
	BA --> SPG[Security Policy Guard]
```
