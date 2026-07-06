import { RAGChunk, RAGSearchOptions, RAGSearchResult, TenantScope, VectorStore } from "../types";

/**
 * In-memory vector store for local execution and contract testing.
 */
export class InMemoryVectorStore implements VectorStore {
  private readonly chunks: RAGChunk[] = [];

  public async add(chunks: RAGChunk[]): Promise<void> {
    this.chunks.push(...chunks);
  }

  public async update(chunks: RAGChunk[]): Promise<void> {
    for (const chunk of chunks) {
      const index = this.chunks.findIndex((existing) => existing.id === chunk.id && existing.tenantId === chunk.tenantId);
      if (index >= 0) {
        this.chunks[index] = chunk;
      } else {
        this.chunks.push(chunk);
      }
    }
  }

  public async delete(documentId: string, scope: TenantScope): Promise<void> {
    let i = this.chunks.length - 1;
    while (i >= 0) {
      const chunk = this.chunks[i];
      if (chunk.documentId === documentId && chunk.tenantId === scope.tenantId) {
        this.chunks.splice(i, 1);
      }
      i -= 1;
    }
  }

  public async search(queryVector: number[], options?: RAGSearchOptions): Promise<RAGSearchResult[]> {
    const tenantId = options?.tenantId;
    if (!tenantId) {
      throw new Error("Search requires tenantId.");
    }

    const topK = options?.topK ?? 5;
    const moduleFilter = options?.module;

    const scored = this.chunks
      .filter((chunk) => chunk.tenantId === tenantId)
      .filter((chunk) => (moduleFilter ? String(chunk.metadata.module ?? "") === moduleFilter : true))
      .map((chunk) => {
        const score = this.cosineSimilarity(queryVector, chunk.embedding ?? [0, 0, 0]);
        return {
          chunkId: chunk.id,
          documentId: chunk.documentId,
          score,
          text: chunk.text,
          metadata: chunk.metadata,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const minLength = Math.min(a.length, b.length);
    if (minLength === 0) {
      return 0;
    }

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLength; i += 1) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
