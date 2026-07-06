# Shared RAG Platform

Reusable Retrieval-Augmented Generation service for all Velynxia applications.

## Responsibilities
- Document ingestion and indexing
- Chunking and embeddings
- Vector search and metadata filtering
- Prompt context building
- Connector-based knowledge import

## Public Provider Interface
- `search(query, options)`
- `index(document)`
- `update(document)`
- `delete(documentId)`

## Design Rules
- Multi-tenant isolation is mandatory
- Agents must never query vector stores directly
- All provider and store integrations are abstraction-first
- Connector additions should not require core engine changes
