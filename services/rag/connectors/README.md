# Connectors

Connector plugins import knowledge from external systems into RAG.

## Current Implementation
- `MarkdownConnector.ts` reads `.md` files and maps them to `RAGDocument`.

Initial connector targets:
- CRM
- Sales
- Accounting
- PostgreSQL
- PDF
- Word
- Excel
- Markdown
- Website
- AI Media Assets

Connectors should implement `KnowledgeConnector` from `types/rag.types.ts`.
