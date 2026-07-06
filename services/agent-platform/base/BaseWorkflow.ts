import { AgentInput, AgentPlanResult, TenantContext, ToolExecutionResult } from "../contracts/agent.types";

export type WorkflowState = {
  context: TenantContext;
  input: AgentInput;
  plan: AgentPlanResult;
  toolResults: ToolExecutionResult[];
};

/**
 * Base abstraction for multi-step workflow execution.
 */
export abstract class BaseWorkflow {
  public abstract readonly id: string;
  public abstract readonly description: string;

  public async run(state: WorkflowState): Promise<WorkflowState> {
    return this.execute(state);
  }

  protected abstract execute(state: WorkflowState): Promise<WorkflowState>;
}
