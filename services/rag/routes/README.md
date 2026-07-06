# Routes

Route layer for RAG service APIs.

Current route registration entrypoint:
- `ragRoutes.ts` via `registerRAGRoutes(server, ragProvider)`

Suggested initial endpoints:
- POST /rag/search
- POST /rag/index
- PUT /rag/document/:id
- DELETE /rag/document/:id
