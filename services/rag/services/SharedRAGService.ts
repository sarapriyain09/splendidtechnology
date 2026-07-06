import {
  ChunkingStrategy,
  EmbeddingProvider,
  RAGDocument,
  RAGProvider,
  RAGSearchOptions,
  RAGSearchResult,
  TenantScope,
  VectorStore,
} from "../types";

/**
 * Shared RAG provider implementation composed from chunking, embeddings, and vector storage abstractions.
 */
export class SharedRAGService implements RAGProvider {
  public constructor(
    private readonly chunkingStrategy: ChunkingStrategy,
    private readonly embeddingProvider: EmbeddingProvider,
    private readonly vectorStore: VectorStore
  ) {}

  public async search(query: string, options?: RAGSearchOptions): Promise<RAGSearchResult[]> {
    if (!options?.tenantId) {
      throw new Error("RAG search requires tenantId.");
    }

    const queryEmbedding = await this.embeddingProvider.embed(query);
    return this.vectorStore.search(queryEmbedding, options);
  }

  public async index(document: RAGDocument): Promise<void> {
    const chunks = await this.chunkingStrategy.chunk(document);

    for (const chunk of chunks) {
      chunk.embedding = await this.embeddingProvider.embed(chunk.text);
    }

    await this.vectorStore.add(chunks);
  }

  public async update(document: RAGDocument): Promise<void> {
    const chunks = await this.chunkingStrategy.chunk(document);

    for (const chunk of chunks) {
      chunk.embedding = await this.embeddingProvider.embed(chunk.text);
    }

    await this.vectorStore.update(chunks);
  }

  public async delete(documentId: string, scope: TenantScope): Promise<void> {
    await this.vectorStore.delete(documentId, scope);
  }
}
