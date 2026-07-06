import { basename } from "node:path";
import { readFile } from "node:fs/promises";
import { KnowledgeConnector, RAGDocument, TenantScope } from "../types";

/**
 * Connector plugin for Markdown knowledge sources.
 */
export class MarkdownConnector implements KnowledgeConnector {
  public readonly id = "connector.markdown";

  public supports(source: string): boolean {
    return source.toLowerCase() === "markdown";
  }

  public async fetch(documentRef: string, scope: TenantScope): Promise<RAGDocument> {
    if (!scope.tenantId) {
      throw new Error("Tenant scope is required for markdown connector fetch.");
    }

    const content = await readFile(documentRef, "utf-8");
    const fileName = basename(documentRef);
    const now = new Date().toISOString();

    return {
      id: `md:${scope.tenantId}:${fileName}`,
      tenantId: scope.tenantId,
      module: scope.module ?? "knowledge",
      source: "markdown",
      title: fileName,
      content,
      tags: ["markdown", "imported"],
      version: "1",
      createdBy: scope.userId ?? "system",
      createdAt: now,
      updatedAt: now,
    };
  }
}
