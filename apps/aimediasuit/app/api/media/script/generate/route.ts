import { NextRequest, NextResponse } from "next/server";
import { GenerationStatus, ScriptGoal, ScriptLength, ScriptTone } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { resolveUserId } from "@/lib/auth/user-id";
import { generateTextFromPrompt } from "@/lib/ai/text-generation";
import { generateScriptSchema } from "@/lib/schemas/script";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

function buildPrompt(input: {
  goal: string;
  tone: string;
  length: string;
  audience: string;
  prompt: string;
  callToAction?: string;
}) {
  const targetWordCount = input.length === "short" ? "80-140" : input.length === "medium" ? "180-260" : "320-450";

  return [
    "You are an expert marketing copywriter.",
    `Create a ${input.goal} script with a ${input.tone} tone for ${input.audience}.`,
    `Target length: ${targetWordCount} words.`,
    "Use clear structure with headline and body. Keep it practical and conversion-focused.",
    input.callToAction ? `Include this CTA naturally near the end: ${input.callToAction}` : "Include a strong CTA at the end.",
    "User request:",
    input.prompt,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const input = generateScriptSchema.parse(raw);
    const userId = await resolveUserId(request);
    const resolvedTitle = input.title || input.prompt.slice(0, 80);

    const prompt = buildPrompt(input);
    const generation = await generateTextFromPrompt({
      prompt,
      model: process.env.AI_TEXT_PROVIDER === "ollama" ? process.env.OLLAMA_TEXT_MODEL : process.env.OPENAI_TEXT_MODEL,
    });
    const ai = { provider: generation.provider, model: generation.modelSelected };
    const script = generation.text;
    if (!script) {
      return jsonError("Script generation returned empty output.", 500);
    }

    if (process.env.DATABASE_URL) {
      try {
        const created = await prisma.scriptGeneration.create({
          data: {
            userId,
            title: resolvedTitle,
            prompt: input.prompt,
            outputText: script,
            goal: input.goal as ScriptGoal,
            tone: input.tone as ScriptTone,
            length: input.length as ScriptLength,
            audience: input.audience,
            callToAction: input.callToAction || null,
            status: GenerationStatus.COMPLETED,
          },
        });

        return NextResponse.json({
          id: created.id,
          title: created.title,
          prompt: created.prompt,
          script: created.outputText,
          outputText: created.outputText,
          generatedAt: created.createdAt.toISOString(),
          createdAt: created.createdAt.toISOString(),
          status: created.status,
          isFavorite: created.isFavorite,
          meta: {
            goal: created.goal,
            tone: created.tone,
            length: created.length,
            audience: created.audience,
            callToAction: created.callToAction,
            ai,
          },
        });
      } catch {
        // Fall back to non-persistent response when DB is unavailable.
      }
    }

    return NextResponse.json({
      id: randomUUID(),
      title: resolvedTitle || "Untitled Script",
      prompt: input.prompt,
      script,
      outputText: script,
      generatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      status: "COMPLETED",
      isFavorite: false,
      meta: {
        goal: input.goal,
        tone: input.tone,
        length: input.length,
        audience: input.audience,
        callToAction: input.callToAction || null,
        ai,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate script.";
    return jsonError(message, 400);
  }
}