import { RAGDocument, RAGProvider, RAGSearchOptions, TenantScope } from "../types";
import { FastifyReplyLike, FastifyRequestLike } from "../routes/fastify.types";

type SearchBody = {
  query: string;
  options: RAGSearchOptions;
};

type DeleteParams = {
  documentId: string;
};

type DeleteBody = {
  scope: TenantScope;
};

/**
 * Thin controller that validates request shapes and delegates to RAG provider.
 */
export class RAGController {
  public constructor(private readonly ragProvider: RAGProvider) {}

  public search = async (request: FastifyRequestLike<SearchBody>, reply: FastifyReplyLike): Promise<unknown> => {
    const { query, options } = request.body;

    if (!query?.trim()) {
      return reply.code(400).send({ error: "query is required" });
    }

    if (!options?.tenantId) {
      return reply.code(400).send({ error: "options.tenantId is required" });
    }

    const results = await this.ragProvider.search(query, options);
    return reply.code(200).send({ results });
  };

  public index = async (request: FastifyRequestLike<RAGDocument>, reply: FastifyReplyLike): Promise<unknown> => {
    const document = request.body;

    if (!document?.id || !document?.tenantId || !document?.content) {
      return reply.code(400).send({ error: "document id, tenantId, and content are required" });
    }

    await this.ragProvider.index(document);
    return reply.code(202).send({ status: "queued", documentId: document.id });
  };

  public update = async (request: FastifyRequestLike<RAGDocument>, reply: FastifyReplyLike): Promise<unknown> => {
    const document = request.body;

    if (!document?.id || !document?.tenantId || !document?.content) {
      return reply.code(400).send({ error: "document id, tenantId, and content are required" });
    }

    await this.ragProvider.update(document);
    return reply.code(200).send({ status: "updated", documentId: document.id });
  };

  public delete = async (
    request: FastifyRequestLike<DeleteBody, DeleteParams>,
    reply: FastifyReplyLike
  ): Promise<unknown> => {
    const { documentId } = request.params;
    const { scope } = request.body;

    if (!documentId) {
      return reply.code(400).send({ error: "documentId is required" });
    }

    if (!scope?.tenantId) {
      return reply.code(400).send({ error: "scope.tenantId is required" });
    }

    await this.ragProvider.delete(documentId, scope);
    return reply.code(200).send({ status: "deleted", documentId });
  };
}
