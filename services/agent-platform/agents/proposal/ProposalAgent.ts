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

const proposalAgentConfig: AgentConfig = {
  id: "proposal-agent",
  name: "Proposal Agent",
  description: "Generate draft proposals and route quote requests for approval.",
  tools: ["crm.opportunity.create", "email.send"],
  promptKey: "sales/proposal-agent-v1",
  memory: {
    shortTerm: true,
    longTerm: true,
    knowledge: true,
  },
  approval: {
    requiredFor: ["quote.send"],
  },
  events: {
    listen: ["quote.requested"],
    publish: ["quote.drafted", "quote.approval.requested"],
  },
};

/**
 * Example proposal plugin that relies on framework lifecycle and shared tools.
 */
export class ProposalAgent extends BaseAgent {
  public constructor(memory: BaseMemory, eventBus: EventBus, tools: BaseTool[]) {
    super(proposalAgentConfig, tools, memory, eventBus);
  }

  public async plan(_context: TenantContext, input: AgentInput): Promise<AgentPlanResult> {
    const leadEmail = String(input.payload["leadEmail"] ?? "");
    const leadName = String(input.payload["leadName"] ?? "Unknown Lead");
    const estimatedValue = Number(input.payload["estimatedValue"] ?? 0);

    return {
      steps: [
        { id: "step-1", title: "Create opportunity record", action: "create_opportunity" },
        { id: "step-2", title: "Draft proposal summary", action: "draft_quote" },
        {
          id: "step-3",
          title: "Request approval for quote send",
          action: "request_approval",
          requiresApproval: true,
        },
      ],
      selectedTools: [
        {
          tool: "crm.opportunity.create",
          reason: "Create proposal context in CRM before sending quote draft",
          input: {
            contactEmail: leadEmail,
            companyName: leadName,
            estimatedValue,
          },
        },
        {
          tool: "email.send",
          reason: "Send draft proposal acknowledgement to lead",
          input: {
            to: leadEmail,
            subject: "Your Velynxia proposal is being prepared",
            body: `Hi ${leadName}, we are preparing your proposal and will share it after approval.`,
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
    const missingCrmWrite = !results.some((item) => item.tool === "crm.opportunity.create" && item.success);
    if (missingCrmWrite) {
      throw new Error("ProposalAgent validation failed: CRM opportunity was not created.");
    }
  }
}
