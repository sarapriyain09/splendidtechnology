import { EmbeddingProvider } from "../types";

/**
 * Deterministic placeholder embedding provider for local development.
 */
export class NoopEmbeddingProvider implements EmbeddingProvider {
  public async embed(text: string): Promise<number[]> {
    let accumulator = 0;
    for (let i = 0; i < text.length; i += 1) {
      accumulator += text.charCodeAt(i);
    }

    return [
      Number((text.length % 997) / 997),
      Number((accumulator % 1543) / 1543),
      Number(((text.length * 31 + accumulator) % 2029) / 2029),
    ];
  }
}
