export type AgentEvent<TPayload extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  version: string;
  tenantId: string;
  correlationId: string;
  timestamp: string;
  payload: TPayload;
};

export type EventHandler<TPayload extends Record<string, unknown> = Record<string, unknown>> = (
  event: AgentEvent<TPayload>
) => Promise<void>;

export type EventSubscription = {
  eventName: string;
  handlerId: string;
};
