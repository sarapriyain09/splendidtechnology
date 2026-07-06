import { ChunkingStrategy, RAGChunk, RAGDocument } from "../types";

/**
 * Fixed-size chunking strategy with optional overlap.
 */
export class FixedChunkingStrategy implements ChunkingStrategy {
  public readonly id = "fixed-size";

  private readonly chunkSize: number;
  private readonly overlap: number;

  public constructor(chunkSize = 800, overlap = 120) {
    this.chunkSize = chunkSize;
    this.overlap = overlap;
  }

  public async chunk(document: RAGDocument): Promise<RAGChunk[]> {
    const text = document.content ?? "";
    const chunks: RAGChunk[] = [];

    if (!text.trim()) {
      return chunks;
    }

    let start = 0;
    let index = 0;

    while (start < text.length) {
      const end = Math.min(start + this.chunkSize, text.length);
      const slice = text.slice(start, end);
      chunks.push({
        id: `${document.id}:${index}`,
        documentId: document.id,
        tenantId: document.tenantId,
        index,
        text: slice,
        metadata: {
          source: document.source,
          module: document.module,
          tags: document.tags ?? [],
          createdAt: document.createdAt ?? new Date().toISOString(),
          updatedAt: document.updatedAt ?? new Date().toISOString(),
        },
      });

      if (end === text.length) {
        break;
      }

      start = Math.max(0, end - this.overlap);
      index += 1;
    }

    return chunks;
  }
}
