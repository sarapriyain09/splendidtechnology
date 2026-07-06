# ADR 0004: Shared RAG Platform Service
- Status: Accepted
- Date: 2026-06-29

## Context
Multiple agents require retrieval from business data and content assets.
Per-agent RAG implementations would fragment ingestion, indexing, and retrieval behavior.

## Decision
Implement a shared RAG platform service with connector plugins, staged ingestion, and provider-independent retrieval contracts.

## Consequences
- Consistent retrieval quality and governance
- Reusable indexing pipeline and connectors
- Requires clear tenant-scoped metadata model

## Alternatives Considered
- App-level RAG services
- Direct vector store access from agents

## Follow-up Actions
- Standardize RAGProvider, EmbeddingProvider, VectorStore contracts
- Implement PostgreSQL pgvector as initial vector backend
