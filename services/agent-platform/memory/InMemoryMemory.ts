import { BaseMemory, MemoryRecord, MemoryScope } from "../base/BaseMemory";
import { TenantContext } from "../contracts/agent.types";

/**
 * In-memory memory adapter for local development and tests.
 */
export class InMemoryMemory extends BaseMemory {
  private readonly store = new Map<string, MemoryRecord>();

  public async read(context: TenantContext, scope: MemoryScope, key: string): Promise<MemoryRecord | null> {
    const id = this.buildId(context.tenantId, scope, key);
    return this.store.get(id) ?? null;
  }

  public async write(context: TenantContext, record: MemoryRecord): Promise<void> {
    const id = this.buildId(context.tenantId, record.scope, record.key);
    this.store.set(id, record);
  }

  public async search(
    context: TenantContext,
    scope: MemoryScope,
    query: string,
    limit: number
  ): Promise<MemoryRecord[]> {
    const normalizedQuery = query.toLowerCase();

    return Array.from(this.store.entries())
      .filter(([id]) => id.startsWith(`${context.tenantId}:${scope}:`))
      .map(([, record]) => record)
      .filter((record) => JSON.stringify(record.value).toLowerCase().includes(normalizedQuery))
      .slice(0, limit);
  }

  private buildId(tenantId: string, scope: MemoryScope, key: string): string {
    return `${tenantId}:${scope}:${key}`;
  }
}
