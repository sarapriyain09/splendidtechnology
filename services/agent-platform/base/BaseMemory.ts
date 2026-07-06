import { TenantContext } from "../contracts/agent.types";

export type MemoryScope = "short-term" | "long-term" | "knowledge";

export type MemoryRecord = {
  scope: MemoryScope;
  key: string;
  value: Record<string, unknown>;
  createdAt: string;
};

/**
 * Base abstraction for tenant-scoped memory providers.
 */
export abstract class BaseMemory {
  public abstract read(context: TenantContext, scope: MemoryScope, key: string): Promise<MemoryRecord | null>;

  public abstract write(context: TenantContext, record: MemoryRecord): Promise<void>;

  public abstract search(
    context: TenantContext,
    scope: MemoryScope,
    query: string,
    limit: number
  ): Promise<MemoryRecord[]>;
}
