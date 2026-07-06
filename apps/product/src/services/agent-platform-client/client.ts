export type AgentPlatformRequest<TPayload = Record<string, unknown>> = {
  tenantId: string;
  userId: string;
  role: string;
  sourceModule: string;
  correlationId: string;
  action: string;
  payload: TPayload;
  timeoutMs?: number;
};

export type AgentPlatformResponse<TData = Record<string, unknown>> = {
  requestId: string;
  correlationId: string;
  status: "draft" | "pending_approval" | "approved" | "rejected" | "executed" | "failed";
  data: TData;
  error?: string;
};

export class AgentPlatformClient {
  constructor(private readonly baseUrl = process.env.NEXT_PUBLIC_AGENT_PLATFORM_URL ?? "http://localhost:8080") {}

  async execute<TPayload extends Record<string, unknown>, TData extends Record<string, unknown>>(
    request: AgentPlatformRequest<TPayload>,
  ): Promise<AgentPlatformResponse<TData>> {
    const timeoutMs = request.timeoutMs ?? 12000;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/v1/agent/execute`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-tenant-id": request.tenantId,
          "x-user-id": request.userId,
          "x-user-role": request.role,
          "x-source-module": request.sourceModule,
          "x-correlation-id": request.correlationId,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      if (!response.ok) {
        return {
          requestId: crypto.randomUUID(),
          correlationId: request.correlationId,
          status: "failed",
          data: {} as TData,
          error: `agent_platform_http_${response.status}`,
        };
      }

      return (await response.json()) as AgentPlatformResponse<TData>;
    } catch {
      return {
        requestId: crypto.randomUUID(),
        correlationId: request.correlationId,
        status: "failed",
        data: {} as TData,
        error: "agent_platform_unreachable",
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
