type GenerateTextParams = {
  prompt: string;
  model?: string;
  timeoutMs?: number;
};

export type TextGenerationResult = {
  text: string;
  provider: "openai" | "ollama";
  modelSelected: string;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function getOutputText(raw: unknown): string {
  if (!raw || typeof raw !== "object") {
    return "";
  }

  const candidate = raw as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: string }> }>;
    response?: unknown;
  };

  if (typeof candidate.output_text === "string") {
    return candidate.output_text.trim();
  }

  if (typeof candidate.response === "string") {
    return candidate.response.trim();
  }

  const textFromBlocks = candidate.output
    ?.flatMap((block) => block.content ?? [])
    .map((part) => part.text)
    .filter((part): part is string => typeof part === "string")
    .join("\n")
    .trim();

  return textFromBlocks ?? "";
}

function getProvider(): "openai" | "ollama" {
  const rawProvider = (process.env.AI_TEXT_PROVIDER ?? "openai").toLowerCase();
  return rawProvider === "ollama" ? "ollama" : "openai";
}

export async function generateTextFromPrompt(params: GenerateTextParams): Promise<TextGenerationResult> {
  const provider = getProvider();
  const timeoutMs = params.timeoutMs ?? Number(process.env.AI_TEXT_TIMEOUT_MS ?? "60000");

  if (provider === "ollama") {
    const gatewayUrl = process.env.OLLAMA_GATEWAY_CHAT_URL ?? "http://localhost:8001/chat";
    const model = params.model ?? process.env.OLLAMA_TEXT_MODEL;

    const response = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model,
        stream: false,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });

    const raw = await response.json().catch(() => null);
    if (!response.ok) {
      const errorMessage =
        (raw as { error?: { message?: string } } | null)?.error?.message ?? `Ollama gateway request failed with ${response.status}.`;
      throw new Error(errorMessage);
    }

    const text = getOutputText(raw);
    if (!text) {
      throw new Error("Ollama generation returned empty output.");
    }

    const modelSelected =
      ((raw as { model_selected?: string } | null)?.model_selected ?? model ?? process.env.OLLAMA_TEXT_MODEL ?? "ollama").toString();

    return {
      text,
      provider,
      modelSelected,
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const model = params.model ?? process.env.OPENAI_TEXT_MODEL ?? "gpt-4.1-mini";
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: params.prompt,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });

  const raw = await response.json().catch(() => null);
  if (!response.ok) {
    const rawError = raw ? JSON.stringify(raw) : `status=${response.status}`;
    throw new Error(`OpenAI request failed: ${response.status} ${rawError}`);
  }

  const text = getOutputText(raw);
  if (!text) {
    throw new Error("OpenAI generation returned empty output.");
  }

  return {
    text,
    provider,
    modelSelected: model,
  };
}
