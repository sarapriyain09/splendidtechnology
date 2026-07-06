export type TenantContext = {
  tenantId: string;
  userId: string;
  role: string;
  correlationId: string;
  sourceModule: string;
};

export type AgentInput = {
  intent: string;
  payload: Record<string, unknown>;
};

export type ToolSelection = {
  tool: string;
  reason: string;
  input: Record<string, unknown>;
};

export type AgentPlanStep = {
  id: string;
  title: string;
  action: string;
  requiresApproval?: boolean;
};

export type AgentPlanResult = {
  steps: AgentPlanStep[];
  selectedTools: ToolSelection[];
};

export type ToolExecutionResult = {
  tool: string;
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
};

export type AgentExecuteResult = {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  tools: ToolExecutionResult[];
  publishedEvents: string[];
};

export type AgentSummaryResult = {
  summary: string;
  confidence: number;
};

export type AgentConfig = {
  id: string;
  name: string;
  description: string;
  tools: string[];
  promptKey: string;
  memory: {
    shortTerm: boolean;
    longTerm: boolean;
    knowledge: boolean;
  };
  approval: {
    requiredFor: string[];
  };
  events: {
    listen: string[];
    publish: string[];
  };
};

export interface Agent {
  id: string;
  name: string;
  description: string;
  execute(context: TenantContext, input: AgentInput): Promise<AgentExecuteResult>;
  plan(context: TenantContext, input: AgentInput): Promise<AgentPlanResult>;
  useTools(context: TenantContext, plan: AgentPlanResult): Promise<ToolExecutionResult[]>;
  remember(context: TenantContext, input: AgentInput, result: AgentExecuteResult): Promise<void>;
  summarize(context: TenantContext, input: AgentInput, result: AgentExecuteResult): Promise<AgentSummaryResult>;
}
