import { TenantContext } from "../../contracts/agent.types";
import { BaseTool, ToolInput, ToolOutput } from "../../base/BaseTool";

type EmailPayload = {
  to: string;
  subject: string;
  body: string;
};

/**
 * Mock email tool used for local agent platform flows.
 */
export class EmailTool extends BaseTool {
  public readonly id = "email.send";
  public readonly description = "Send outbound emails through the platform email adapter.";

  protected async run(_context: TenantContext, input: ToolInput): Promise<ToolOutput> {
    const payload = input as Partial<EmailPayload>;

    if (!payload.to || !payload.subject || !payload.body) {
      throw new Error("Email payload is missing required fields: to, subject, body.");
    }

    return {
      deliveryId: `mock-email-${Date.now()}`,
      status: "queued",
      to: payload.to,
      subject: payload.subject,
    };
  }
}
