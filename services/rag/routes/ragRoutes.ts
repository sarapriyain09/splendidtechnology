import { RAGController } from "../controllers";
import { RAGProvider } from "../types";
import { FastifyInstanceLike } from "./fastify.types";

/**
 * Registers RAG routes onto a Fastify-compatible instance.
 */
export function registerRAGRoutes(server: FastifyInstanceLike, ragProvider: RAGProvider): void {
  const controller = new RAGController(ragProvider);

  server.post("/rag/search", controller.search);
  server.post("/rag/index", controller.index);
  server.put("/rag/document", controller.update);
  server.delete("/rag/document/:documentId", controller.delete);
}
