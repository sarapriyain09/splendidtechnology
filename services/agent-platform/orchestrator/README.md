# Orchestrator

Coordinates request execution lifecycle:


Future:

# Orchestrator
Coordinates request lifecycle, state transitions, retries, and execution policy.

## Example Flow

- `runSalesAgentExample.ts` demonstrates an end-to-end plugin flow:
	1. Build EventBus, Memory, and AgentRegistry
	2. Register `SalesAgent`
	3. Execute `sales-agent` with tenant-scoped context
	4. Publish and observe `opportunity.created` and `quote.requested` events
	5. Return summarized execution output

- `runEnquiryToQuoteExample.ts` demonstrates multi-agent collaboration:
	1. Register `SalesAgent` and `ProposalAgent`
	2. Execute sales flow for lead qualification and outreach
	3. Handle `quote.requested` event to trigger proposal flow
	4. Draft proposal context and emit quote lifecycle events
