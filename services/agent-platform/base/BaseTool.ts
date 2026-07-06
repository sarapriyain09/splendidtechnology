import { TenantContext } from "../contracts/agent.types";

export type ToolInput = Record<string, unknown>;
export type ToolOutput = Record<string, unknown>;

/**
 * Base abstraction for reusable platform tools.
 */
export abstract class BaseTool {
  public abstract readonly id: string;
  public abstract readonly description: string;

  public async execute(context: TenantContext, input: ToolInput): Promise<ToolOutput> {
    this.validateContext(context);
    return this.run(context, input);
  }

  protected abstract run(context: TenantContext, input: ToolInput): Promise<ToolOutput>;

  protected validateContext(context: TenantContext): void {
    if (!context.tenantId || !context.userId || !context.correlationId) {
      throw new Error("Invalid tenant context for tool execution.");
    }
  }
}
