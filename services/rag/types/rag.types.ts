export type TenantScope = {
  tenantId: string;
  userId?: string;
  module?: string;
  permissionScope?: string[];
};

export type RAGDocument = {
  id: string;
  tenantId: string;
  module: string;
  source: string;
  title?: string;
  content: string;
  tags?: string[];
  version?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RAGChunk = {
  id: string;
  documentId: string;
  tenantId: string;
  index: number;
  text: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
};

export type RAGSearchOptions = {
  tenantId: string;
  module?: string;
  topK?: number;
  tags?: string[];
  minScore?: number;
};

export type RAGSearchResult = {
  chunkId: string;
  documentId: string;
  score: number;
  text: string;
  metadata: Record<string, unknown>;
};

export interface RAGProvider {
  search(query: string, options?: RAGSearchOptions): Promise<RAGSearchResult[]>;
  index(document: RAGDocument): Promise<void>;
  update(document: RAGDocument): Promise<void>;
  delete(documentId: string, scope: TenantScope): Promise<void>;
}

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

export interface VectorStore {
  add(chunks: RAGChunk[]): Promise<void>;
  update(chunks: RAGChunk[]): Promise<void>;
  delete(documentId: string, scope: TenantScope): Promise<void>;
  search(queryVector: number[], options?: RAGSearchOptions): Promise<RAGSearchResult[]>;
}

export interface KnowledgeConnector {
  id: string;
  supports(source: string): boolean;
  fetch(documentRef: string, scope: TenantScope): Promise<RAGDocument>;
}

export interface ChunkingStrategy {
  id: string;
  chunk(document: RAGDocument): Promise<RAGChunk[]>;
}
