---
applyTo: "services/rag/**"
---

# Velynxia Shared RAG Platform Instructions

## Objective
Design and implement a reusable Retrieval-Augmented Generation service for all Velynxia applications including CRM, Sales, Marketing, AI Media Suite, Accounting, Analytics, Support, and future Engineering modules.

Treat RAG as a platform service, not per-agent custom logic.

## Platform Position
Applications consume AI through Agent Platform.
Agent Platform consumes RAG through an abstraction.
RAG must be independent from any specific LLM provider.

## Required RAG API Surface
RAG services should expose a simple provider interface:
- search
- index
- delete
- update

Agents and app modules must never query vector storage directly.

## Folder Structure
Use this structure for `services/rag/**`:

- controllers
- services
- connectors
- indexers
- chunking
- embeddings
- vector-store
- retrievers
- prompt-builder
- cache
- models
- types
- routes

## Core Interfaces
Define and keep stable contracts from day one.

```ts
export interface RAGProvider {
  search(query: string, options?: Record<string, unknown>): Promise<RAGResult[]>;
  index(document: RAGDocument): Promise<void>;
  update(document: RAGDocument): Promise<void>;
  delete(documentId: string): Promise<void>;
}

export interface EmbeddingProvider {
  embed(text: string): Promise<number[]>;
}

export interface VectorStore {
  add(chunks: RAGChunk[]): Promise<void>;
  update(chunks: RAGChunk[]): Promise<void>;
  delete(documentId: string): Promise<void>;
  search(queryVector: number[], options?: Record<string, unknown>): Promise<RAGChunk[]>;
}
```

The Agent Framework should depend on interfaces, not implementations.

## Connector Plugin Model
Design knowledge connectors as plugins.

Initial connector classes to support:
- CRM connector
- Sales connector
- Accounting connector
- PostgreSQL connector
- PDF connector
- Word connector
- Excel connector
- Markdown connector
- Website connector
- AI Media Asset connector

Adding a connector must not require changing core RAG engine code.

## Document Processing Pipeline
Every document should pass through staged processing:
1. Import
2. Extract text
3. Clean
4. Chunk
5. Generate embeddings
6. Store vectors
7. Store metadata

Each stage must be a separable service module.

## Chunking Requirements
Support configurable strategies:
- fixed-size
- sentence-based
- section-based

Each chunk must include metadata:
- documentId
- source
- module
- tenantId
- createdAt
- updatedAt

## Embedding Layer
Embedder implementations must be provider-pluggable.
Planned providers include OpenAI, Gemini, and local models.

## Vector Store Layer
Vector store must be abstracted.

First implementation:
- PostgreSQL with pgvector

Future implementations must be swappable without changing retrieval pipeline logic.

## Retrieval Pipeline
Use this structure:
1. User question
2. Query embedding
3. Vector search
4. Metadata filter
5. Top-k selection
6. Prompt builder context assembly

Separate retrieval logic from LLM prompt construction.

## Prompt Builder
Prompt builder must:
- select top N chunks
- remove duplicates
- enforce token limits
- produce deterministic context blocks

## Multi-Tenant Security
Every retrieval operation must enforce:
- tenantId
- user permission scope
- module permission scope

Never return cross-tenant data.

## Metadata Requirements
Each indexed document must store:
- documentId
- module
- tenantId
- source
- tags
- version
- createdBy
- createdAt
- updatedDate

## Performance Requirements
Include performance primitives from the start:
- embedding cache
- query cache
- background indexing
- incremental indexing
- batch processing

Do not regenerate embeddings when source content has not changed.

## Event Integration
RAG service should subscribe to platform events and update index automatically.

Example events:
- customer.created
- quote.updated
- invoice.generated
- document.uploaded
- product.updated

## Logging and Observability
Log the following per retrieval run:
- query
- retrieved documents
- retrieval latency
- embedding latency
- token counts
- LLM response latency when used

Use structured logs and correlation IDs.

## Future Expansion
Design for:
- hybrid search (vector plus keyword)
- multiple vector stores
- knowledge graphs
- image embeddings
- audio embeddings
- video embeddings
- cross-module search

## Engineering Standards
- TypeScript strict mode
- SOLID design
- dependency injection
- no circular dependencies
- clean controller/service separation
- testable modules with clear interfaces
- consistent typed error handling

## Expected Outcome
RAG capabilities should be reusable across all agents and apps through stable interfaces.
Replacing embedding providers, vector stores, or retrieval strategies should require minimal changes outside RAG implementation modules.
