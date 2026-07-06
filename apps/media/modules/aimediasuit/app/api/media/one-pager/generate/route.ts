import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTextFromPrompt } from "@/lib/ai/text-generation";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations";

const schema = z.object({
  brandName: z.string().min(1).max(120),
  productName: z.string().min(1).max(120),
  audience: z.string().min(1).max(220),
  offerSummary: z.string().min(1).max(2000),
  tone: z.string().min(1).max(120),
  callToAction: z.string().min(1).max(120),
  keyPoints: z.array(z.string().min(1).max(280)).min(1).max(12),
  platform: z.enum(["linkedin", "facebook"]).default("linkedin"),
  contentLength: z.enum(["short", "medium", "long"]).default("medium"),
  sizePreset: z
    .enum([
      "linkedin-square",
      "linkedin-landscape",
      "facebook-square",
      "facebook-landscape",
      "facebook-story",
    ])
    .default("linkedin-square"),
  includeImage: z.boolean().optional().default(true),
});

type OnePagerPayload = {
  title: string;
  subtitle: string;
  intro: string;
  sections: Array<{ heading: string; text: string }>;
  benefits: string[];
  ctaLabel: string;
  ctaText: string;
  imagePrompt: string;
  platform: "linkedin" | "facebook";
  contentLength: "short" | "medium" | "long";
  sizePreset:
    | "linkedin-square"
    | "linkedin-landscape"
    | "facebook-square"
    | "facebook-landscape"
    | "facebook-story";
};

type OnePagerGenerationResult = {
  content: OnePagerPayload;
  ai: { provider: "openai" | "ollama"; model: string };
};

function extractJsonBlock(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  return match?.[0] ?? "";
}

function sanitizePayload(payload: Partial<OnePagerPayload>, fallbackCta: string): OnePagerPayload {
  const sections = Array.isArray(payload.sections)
    ? payload.sections
        .map((section) => ({
          heading: String(section?.heading ?? "").trim(),
          text: String(section?.text ?? "").trim(),
        }))
        .filter((section) => section.heading && section.text)
        .slice(0, 6)
    : [];

  const benefits = Array.isArray(payload.benefits)
    ? payload.benefits.map((benefit) => String(benefit).trim()).filter(Boolean).slice(0, 8)
    : [];

  return {
    title: String(payload.title ?? "One Pager").trim() || "One Pager",
    subtitle: String(payload.subtitle ?? "Marketing Snapshot").trim() || "Marketing Snapshot",
    intro: String(payload.intro ?? "").trim() || "A focused one-page overview of your offer.",
    sections,
    benefits,
    ctaLabel: String(payload.ctaLabel ?? fallbackCta).trim() || fallbackCta,
    ctaText: String(payload.ctaText ?? "Ready to take the next step?").trim() || "Ready to take the next step?",
    imagePrompt: String(payload.imagePrompt ?? "").trim(),
    platform: payload.platform === "facebook" ? "facebook" : "linkedin",
    contentLength: payload.contentLength === "short" || payload.contentLength === "long" ? payload.contentLength : "medium",
    sizePreset:
      payload.sizePreset === "linkedin-landscape" ||
      payload.sizePreset === "facebook-square" ||
      payload.sizePreset === "facebook-landscape" ||
      payload.sizePreset === "facebook-story"
        ? payload.sizePreset
        : "linkedin-square",
  };
}

function fallbackPayload(input: z.infer<typeof schema>): OnePagerPayload {
  return {
    title: `${input.brandName} • ${input.productName}`,
    subtitle: `${input.productName} for ${input.audience}`,
    intro: input.offerSummary,
    sections: [
      { heading: "What It Solves", text: input.offerSummary },
      { heading: "Who It Is For", text: input.audience },
    ],
    benefits: input.keyPoints,
    ctaLabel: input.callToAction,
    ctaText: `Start now with ${input.brandName} and accelerate results.`,
    imagePrompt: `${input.brandName} ${input.productName} hero visual, ${input.tone}, modern campaign poster, premium lighting`,
    platform: input.platform,
    contentLength: input.contentLength,
    sizePreset: input.sizePreset,
  };
}

function getWordRange(length: z.infer<typeof schema>["contentLength"]): string {
  if (length === "short") return "40-80";
  if (length === "long") return "180-260";
  return "90-150";
}

function resolveImageSize(sizePreset: z.infer<typeof schema>["sizePreset"]): "1024x1024" | "1536x1024" | "1024x1536" {
  if (sizePreset === "facebook-story") {
    return "1024x1536";
  }

  if (sizePreset === "linkedin-landscape" || sizePreset === "facebook-landscape") {
    return "1536x1024";
  }

  return "1024x1024";
}

async function generateOnePagerText(input: z.infer<typeof schema>): Promise<OnePagerGenerationResult> {
  const wordRange = getWordRange(input.contentLength);

  const prompt = [
    "You are a senior conversion copywriter and creative strategist.",
    "Generate social-ready one-page marketing content in JSON only.",
    "Return strict JSON with fields:",
    "title, subtitle, intro, sections (array of {heading,text}), benefits (array), ctaLabel, ctaText, imagePrompt, platform, contentLength, sizePreset.",
    "No markdown, no code fences, no extra keys.",
    `Brand: ${input.brandName}`,
    `Product: ${input.productName}`,
    `Audience: ${input.audience}`,
    `Offer summary: ${input.offerSummary}`,
    `Tone: ${input.tone}`,
    `Primary platform: ${input.platform}`,
    `Target content length: ${input.contentLength} (${wordRange} words total)` ,
    `Canvas preset: ${input.sizePreset}`,
    "Write plainly and clearly so it reads naturally as a LinkedIn/Facebook post graphic.",
    `CTA label: ${input.callToAction}`,
    `Key points: ${input.keyPoints.join(" | ")}`,
    "Keep copy scannable, emotionally clear, and campaign-ready.",
  ].join("\n");

  const generation = await generateTextFromPrompt({
    prompt,
    model: process.env.AI_TEXT_PROVIDER === "ollama" ? process.env.OLLAMA_TEXT_MODEL : process.env.OPENAI_TEXT_MODEL,
  });
  const ai = { provider: generation.provider, model: generation.modelSelected };
  const text = generation.text;
  const jsonText = extractJsonBlock(text);

  if (!jsonText) {
    return { content: fallbackPayload(input), ai };
  }

  try {
    const parsed = JSON.parse(jsonText) as Partial<OnePagerPayload>;
    return { content: sanitizePayload(parsed, input.callToAction), ai };
  } catch {
    return { content: fallbackPayload(input), ai };
  }
}

async function generateImage(
  imagePrompt: string,
  sizePreset: z.infer<typeof schema>["sizePreset"],
  apiKey: string,
): Promise<string | null> {
  const size = resolveImageSize(sizePreset);
  if (!imagePrompt.trim()) {
    return null;
  }

  const response = await fetch(OPENAI_IMAGES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1",
      prompt: imagePrompt,
      n: 1,
      size,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };

  const first = data.data?.[0];
  if (!first) {
    return null;
  }

  if (typeof first.url === "string") {
    return first.url;
  }

  if (typeof first.b64_json === "string") {
    return `data:image/png;base64,${first.b64_json}`;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const generated = await generateOnePagerText(input);
    const content = generated.content;

    let imageUrl: string | null = null;
    if (input.includeImage) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return jsonError("OPENAI_API_KEY is missing for image generation.", 500);
      }
      imageUrl = await generateImage(content.imagePrompt, input.sizePreset, apiKey);
    }

    return NextResponse.json({
      ...content,
      imageUrl,
      ai: generated.ai,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate one-pager.";
    return jsonError(message, 400);
  }
}