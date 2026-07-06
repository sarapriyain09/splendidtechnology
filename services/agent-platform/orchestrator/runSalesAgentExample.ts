import { AgentInput, TenantContext } from "../contracts/agent.types";
import { EventBus } from "../events/EventBus";
import { InMemoryMemory } from "../memory/InMemoryMemory";
import { AgentRegistry } from "../registry/AgentRegistry";
import { SalesAgent } from "../agents/sales/SalesAgent";
import { EmailTool } from "../tools/email/EmailTool";

/**
 * End-to-end example showing how a plugin agent executes through shared framework layers.
 */
export async function runSalesAgentExample(): Promise<{
  publishedEvents: string[];
  summary: string;
}> {
  const eventBus = new EventBus();
  const memory = new InMemoryMemory();
  const registry = new AgentRegistry();

  const observedEvents: string[] = [];
  eventBus.subscribe("opportunity.created", async (event) => {
    observedEvents.push(event.name);
  });
  eventBus.subscribe("quote.requested", async (event) => {
    observedEvents.push(event.name);
  });

  const salesAgent = new SalesAgent(memory, eventBus, [new EmailTool()]);
  registry.register(salesAgent);

  const context: TenantContext = {
    tenantId: "tenant-acme",
    userId: "user-raj",
    role: "owner",
    correlationId: "corr-sales-001",
    sourceModule: "growth-platform",
  };

  const input: AgentInput = {
    intent: "qualify_and_outreach_lead",
    payload: {
      leadName: "ABC Engineering",
      leadEmail: "hello@abcengineering.co.uk",
    },
  };

  const result = await registry.get("sales-agent").execute(context, input);
  const summary = await registry.get("sales-agent").summarize(context, input, result);

  return {
    publishedEvents: observedEvents,
    summary: summary.summary,
  };
}
