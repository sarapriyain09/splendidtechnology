import { TenantContext } from "../../contracts/agent.types";
import { BaseTool, ToolInput, ToolOutput } from "../../base/BaseTool";

type CrmCreateOpportunityPayload = {
  contactEmail: string;
  companyName: string;
  estimatedValue?: number;
};

/**
 * Mock CRM tool for local end-to-end agent collaboration flows.
 */
export class CrmTool extends BaseTool {
  public readonly id = "crm.opportunity.create";
  public readonly description = "Create a CRM opportunity for a qualified lead.";

  protected async run(context: TenantContext, input: ToolInput): Promise<ToolOutput> {
    const payload = input as Partial<CrmCreateOpportunityPayload>;

    if (!payload.contactEmail || !payload.companyName) {
      throw new Error("CRM payload is missing required fields: contactEmail, companyName.");
    }

    return {
      opportunityId: `opp-${Date.now()}`,
      tenantId: context.tenantId,
      companyName: payload.companyName,
      contactEmail: payload.contactEmail,
      estimatedValue: payload.estimatedValue ?? 0,
      status: "open",
    };
  }
}
