import { BaseAgent } from "../../base/BaseAgent";
import { BaseMemory } from "../../base/BaseMemory";
import { BaseTool } from "../../base/BaseTool";
import {
  AgentConfig,
  AgentInput,
  AgentPlanResult,
  TenantContext,
  ToolExecutionResult,
} from "../../contracts/agent.types";
import { EventBus } from "../../events/EventBus";

const salesAgentConfig: AgentConfig = {
  id: "sales-agent",
  name: "Sales Agent",
  description: "Find and qualify opportunities, then draft outreach actions.",
  tools: ["email.send"],
  promptKey: "sales/sales-agent-v1",
  memory: {
    shortTerm: true,
    longTerm: true,
    knowledge: false,
  },
  approval: {
    requiredFor: ["quote.send"],
  },
  events: {
    listen: ["lead.created", "meeting.completed"],
    publish: ["opportunity.created", "quote.requested"],
  },
};

/**
 * Example plugin agent that only provides domain planning and validation logic.
 */
export class SalesAgent extends BaseAgent {
  public constructor(memory: BaseMemory, eventBus: EventBus, tools: BaseTool[]) {
    super(salesAgentConfig, tools, memory, eventBus);
  }

  public async plan(_context: TenantContext, input: AgentInput): Promise<AgentPlanResult> {
    const leadEmail = String(input.payload["leadEmail"] ?? "");
    const leadName = String(input.payload["leadName"] ?? "there");

    return {
      steps: [
        { id: "step-1", title: "Analyze lead context", action: "qualify_lead" },
        { id: "step-2", title: "Prepare outreach", action: "draft_email" },
        { id: "step-3", title: "Create opportunity", action: "publish_event" },
      ],
      selectedTools: [
        {
          tool: "email.send",
          reason: "Send first-touch outreach to qualified lead",
          input: {
            to: leadEmail,
            subject: "Quick intro from Velynxia",
            body: `Hi ${leadName}, thanks for your interest. We can help with your sales workflow.`,
          },
        },
      ],
    };
  }

  protected async validateResult(
    _context: TenantContext,
    _input: AgentInput,
    _plan: AgentPlanResult,
    results: ToolExecutionResult[]
  ): Promise<void> {
    const successfulCalls = results.filter((item) => item.success).length;
    if (successfulCalls === 0) {
      throw new Error("SalesAgent execution failed: no successful tool calls.");
    }
  }
}
