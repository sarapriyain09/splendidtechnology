import { AgentInput, TenantContext } from "../contracts/agent.types";
import { EventBus } from "../events/EventBus";
import { InMemoryMemory } from "../memory/InMemoryMemory";
import { AgentRegistry } from "../registry/AgentRegistry";
import { SalesAgent } from "../agents/sales/SalesAgent";
import { ProposalAgent } from "../agents/proposal/ProposalAgent";
import { EmailTool } from "../tools/email/EmailTool";
import { CrmTool } from "../tools/crm/CrmTool";

/**
 * Demonstrates multi-agent collaboration from enquiry to quote draft.
 */
export async function runEnquiryToQuoteExample(): Promise<{
  publishedEvents: string[];
  salesSummary: string;
  proposalSummary: string;
}> {
  const eventBus = new EventBus();
  const memory = new InMemoryMemory();
  const registry = new AgentRegistry();

  const salesAgent = new SalesAgent(memory, eventBus, [new EmailTool()]);
  const proposalAgent = new ProposalAgent(memory, eventBus, [new CrmTool(), new EmailTool()]);

  registry.register(salesAgent);
  registry.register(proposalAgent);

  const publishedEvents: string[] = [];
  const context: TenantContext = {
    tenantId: "tenant-acme",
    userId: "user-raj",
    role: "owner",
    correlationId: "corr-enquiry-to-quote-001",
    sourceModule: "growth-platform",
  };

  const input: AgentInput = {
    intent: "enquiry_to_quote",
    payload: {
      leadName: "ABC Engineering",
      leadEmail: "hello@abcengineering.co.uk",
      estimatedValue: 18000,
    },
  };

  let proposalResultSummary = "Proposal agent not executed";

  eventBus.subscribe("quote.requested", async (event) => {
    publishedEvents.push(event.name);

    const proposalResult = await registry.get("proposal-agent").execute(context, {
      intent: "draft_quote_for_qualified_lead",
      payload: {
        leadName: input.payload["leadName"],
        leadEmail: input.payload["leadEmail"],
        estimatedValue: input.payload["estimatedValue"],
      },
    });

    const summary = await registry.get("proposal-agent").summarize(
      context,
      {
        intent: "draft_quote_for_qualified_lead",
        payload: event.payload,
      },
      proposalResult
    );

    proposalResultSummary = summary.summary;
    publishedEvents.push(...proposalResult.publishedEvents);
  });

  const salesResult = await registry.get("sales-agent").execute(context, input);
  publishedEvents.push(...salesResult.publishedEvents);

  const salesSummary = await registry.get("sales-agent").summarize(context, input, salesResult);

  return {
    publishedEvents,
    salesSummary: salesSummary.summary,
    proposalSummary: proposalResultSummary,
  };
}
