export const SUPPORTED_EVENTS = [
  "contact.created",
  "lead.created",
  "deal.won",
  "deal.lost",
  "proposal.sent",
  "missed.call",
] as const;

export const SUPPORTED_OPERATORS = [
  "=",
  "!=",
  "contains",
  "greater_than",
  "less_than",
] as const;

export const SUPPORTED_ACTIONS = [
  "create_task",
  "assign_user",
  "send_email",
  "send_whatsapp",
  "update_opportunity",
  "create_note",
] as const;

export type SupportedEventName = (typeof SUPPORTED_EVENTS)[number];
export type SupportedOperator = (typeof SUPPORTED_OPERATORS)[number];
export type SupportedActionType = (typeof SUPPORTED_ACTIONS)[number];

export interface WorkflowConditionInput {
  field: string;
  operator: SupportedOperator;
  value: string;
}

export interface WorkflowActionInput {
  actionType: SupportedActionType;
  actionData?: Record<string, unknown> | null;
}

export interface WorkflowInput {
  companyId?: string | null;
  name: string;
  description?: string | null;
  active: boolean;
  triggers: SupportedEventName[];
  conditions: WorkflowConditionInput[];
  actions: WorkflowActionInput[];
}

export interface WorkflowEvent {
  eventName: SupportedEventName;
  companyId?: string | null;
  payload?: Record<string, unknown>;
}
