import {
  Agent,
  AgentConfig,
  AgentExecuteResult,
  AgentInput,
  AgentPlanResult,
  AgentSummaryResult,
  TenantContext,
  ToolExecutionResult,
} from "../contracts/agent.types";
import { BaseMemory } from "./BaseMemory";
import { BaseTool } from "./BaseTool";
import { EventBus } from "../events/EventBus";

/**
 * Base agent lifecycle implementation.
 * Domain agents should provide planning and optional result validation rules.
 */
export abstract class BaseAgent implements Agent {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;

  protected readonly config: AgentConfig;
  protected readonly memory: BaseMemory;
  protected readonly eventBus: EventBus;
  protected readonly tools: Map<string, BaseTool>;

  protected constructor(config: AgentConfig, tools: BaseTool[], memory: BaseMemory, eventBus: EventBus) {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.memory = memory;
    this.eventBus = eventBus;
    this.tools = new Map(tools.map((tool) => [tool.id, tool]));
  }

  public async execute(context: TenantContext, input: AgentInput): Promise<AgentExecuteResult> {
    this.validateContext(context);

    const plan = await this.plan(context, input);
    const toolResults = await this.useTools(context, plan);

    await this.validateResult(context, input, plan, toolResults);

    const result: AgentExecuteResult = {
      success: toolResults.every((item) => item.success),
      message: "Execution completed",
      data: { planSteps: plan.steps.length },
      tools: toolResults,
      publishedEvents: [],
    };

    await this.remember(context, input, result);
    result.publishedEvents = await this.publishEvents(context, input, result);

    return result;
  }

  public abstract plan(context: TenantContext, input: AgentInput): Promise<AgentPlanResult>;

  public async useTools(context: TenantContext, plan: AgentPlanResult): Promise<ToolExecutionResult[]> {
    const outputs: ToolExecutionResult[] = [];

    for (const selection of plan.selectedTools) {
      const tool = this.tools.get(selection.tool);
      if (!tool) {
        outputs.push({
          tool: selection.tool,
          success: false,
          error: `Tool not available: ${selection.tool}`,
        });
        continue;
      }

      try {
        const output = await tool.execute(context, selection.input);
        outputs.push({ tool: selection.tool, success: true, output });
      } catch (error) {
        outputs.push({
          tool: selection.tool,
          success: false,
          error: error instanceof Error ? error.message : "Unknown tool execution error",
        });
      }
    }

    return outputs;
  }

  public async remember(context: TenantContext, input: AgentInput, result: AgentExecuteResult): Promise<void> {
    const enabled = this.config.memory.shortTerm || this.config.memory.longTerm;
    if (!enabled) {
      return;
    }

    await this.memory.write(context, {
      scope: "short-term",
      key: `${this.id}:${context.correlationId}`,
      value: {
        intent: input.intent,
        success: result.success,
        toolCount: result.tools.length,
      },
      createdAt: new Date().toISOString(),
    });
  }

  public async summarize(
    _context: TenantContext,
    input: AgentInput,
    result: AgentExecuteResult
  ): Promise<AgentSummaryResult> {
    return {
      summary: `${this.name} handled intent '${input.intent}' with ${result.tools.length} tool calls.`,
      confidence: result.success ? 0.85 : 0.45,
    };
  }

  protected async validateResult(
    _context: TenantContext,
    _input: AgentInput,
    _plan: AgentPlanResult,
    _results: ToolExecutionResult[]
  ): Promise<void> {
    return;
  }

  protected async publishEvents(
    context: TenantContext,
    input: AgentInput,
    result: AgentExecuteResult
  ): Promise<string[]> {
    const published: string[] = [];

    for (const eventName of this.config.events.publish) {
      await this.eventBus.publish({
        name: eventName,
        version: "1.0",
        tenantId: context.tenantId,
        correlationId: context.correlationId,
        timestamp: new Date().toISOString(),
        payload: {
          agentId: this.id,
          intent: input.intent,
          success: result.success,
        },
      });

      published.push(eventName);
    }

    return published;
  }

  private validateContext(context: TenantContext): void {
    if (!context.tenantId || !context.userId || !context.correlationId) {
      throw new Error("Missing tenant-scoped context for agent execution.");
    }
  }
}
