import { GenerationStatus } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { generateTextFromPrompt } from "@/lib/ai/text-generation";
import { prisma } from "@/lib/db/prisma";
import { generateVideoSchema } from "@/lib/schemas/video";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

function buildPrompt(input: {
  topic: string;
  audience: string;
  style: string;
  aspectRatio: string;
  durationSec: number;
  prompt: string;
  includeVoiceover: boolean;
}) {
  const targetScenes = Math.max(4, Math.min(12, Math.round(input.durationSec / 10)));

  return [
    "You are an expert video creative director.",
    `Create a ${input.style} video plan for ${input.audience}.`,
    `Topic: ${input.topic}.`,
    `Aspect ratio: ${input.aspectRatio}.`,
    `Duration: around ${input.durationSec} seconds.`,
    `Target scenes: ${targetScenes}.`,
    "Return plain text in this structure:",
    "Scene 1: <Scene title>",
    "- Visual: <shot direction>",
    "- Caption: <on-screen text>",
    input.includeVoiceover ? "- Voiceover: <narration line>" : "Do not include voiceover lines.",
    "Keep each scene concise and production-ready.",
    "User request:",
    input.prompt,
  ].join("\n");
}

function estimateSceneCount(text: string) {
  const matches = text.match(/(^|\n)\s*Scene\s+\d+\s*:/gi);
  if (matches && matches.length > 0) {
    return matches.length;
  }

  return Math.max(1, Math.round(text.length / 280));
}

function buildFallbackVideoPlan(input: {
  topic: string;
  audience: string;
  style: string;
  durationSec: number;
  prompt: string;
  includeVoiceover: boolean;
}) {
  const targetScenes = Math.max(4, Math.min(12, Math.round(input.durationSec / 10)));
  const promptHint = input.prompt.trim().slice(0, 180);

  const scenes: string[] = [];
  for (let i = 1; i <= targetScenes; i += 1) {
    const phase =
      i === 1
        ? "Hook"
        : i === targetScenes
          ? "Call to Action"
          : i <= Math.ceil(targetScenes / 2)
            ? "Problem"
            : "Solution";

    const caption =
      i === 1
        ? `${input.topic}: Why it matters now`
        : i === targetScenes
          ? `Take the next step for ${input.audience}`
          : `${phase}: ${input.topic}`;

    const visual = `${input.style} scene for ${input.audience}, ${phase.toLowerCase()} focus, clean composition.`;
    const voiceover =
      i === 1
        ? `Today we explore ${input.topic} and why it matters for ${input.audience}.`
        : i === targetScenes
          ? `Start now and turn ${input.topic} into measurable business results.`
          : `This ${phase.toLowerCase()} moment builds momentum toward a clear outcome.`;

    scenes.push(
      [
        `Scene ${i}: ${phase}`,
        `- Visual: ${visual}`,
        `- Caption: ${caption}`,
        input.includeVoiceover ? `- Voiceover: ${voiceover}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }

  const suffix = promptHint ? `\n\nUser request context: ${promptHint}` : "";
  return scenes.join("\n\n") + suffix;
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const input = generateVideoSchema.parse(raw);
    const userId = await resolveUserId(request);
    const resolvedTitle = input.title || input.topic.slice(0, 80);

    const prompt = buildPrompt(input);
    let outputText = "";
    let ai = { provider: "fallback", model: "video-plan-fallback" };
    try {
      const generation = await generateTextFromPrompt({
        prompt,
        model: process.env.AI_TEXT_PROVIDER === "ollama" ? process.env.OLLAMA_TEXT_MODEL : process.env.OPENAI_TEXT_MODEL,
      });
      ai = { provider: generation.provider, model: generation.modelSelected };
      outputText = generation.text;
      if (!outputText) {
        outputText = buildFallbackVideoPlan(input);
        ai = { provider: "fallback", model: "video-plan-fallback" };
      }
    } catch {
      outputText = buildFallbackVideoPlan(input);
      ai = { provider: "fallback", model: "video-plan-fallback" };
    }

    const sceneCount = estimateSceneCount(outputText);

    if (process.env.DATABASE_URL) {
      try {
        const created = await prisma.videoGeneration.create({
          data: {
            userId,
            title: resolvedTitle,
            topic: input.topic,
            audience: input.audience,
            style: input.style,
            aspectRatio: input.aspectRatio,
            durationSec: input.durationSec,
            prompt: input.prompt,
            outputText,
            sceneCount,
            includeVoiceover: input.includeVoiceover,
            status: GenerationStatus.COMPLETED,
          },
        });

        return NextResponse.json({
          id: created.id,
          title: created.title,
          outputText: created.outputText,
          sceneCount: created.sceneCount,
          includeVoiceover: created.includeVoiceover,
          outputUrl: created.outputUrl,
          isFavorite: created.isFavorite,
          status: created.status,
          createdAt: created.createdAt.toISOString(),
          generatedAt: created.createdAt.toISOString(),
          meta: {
            topic: created.topic,
            audience: created.audience,
            style: created.style,
            aspectRatio: created.aspectRatio,
            durationSec: created.durationSec,
            ai,
          },
        });
      } catch {
        // Return generated content without persistence if database is unavailable.
      }
    }

    return NextResponse.json({
      id: randomUUID(),
      title: resolvedTitle || "Untitled Video",
      outputText,
      sceneCount,
      includeVoiceover: input.includeVoiceover,
      outputUrl: null,
      isFavorite: false,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      meta: {
        topic: input.topic,
        audience: input.audience,
        style: input.style,
        aspectRatio: input.aspectRatio,
        durationSec: input.durationSec,
        ai,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate video plan.";
    return jsonError(message, 400);
  }
}
