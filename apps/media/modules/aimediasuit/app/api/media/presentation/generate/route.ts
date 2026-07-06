import { GenerationStatus, PresentationGoal, PresentationLength, PresentationTone, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { generateTextFromPrompt } from "@/lib/ai/text-generation";
import { prisma } from "@/lib/db/prisma";
import { generatePresentationSchema } from "@/lib/schemas/presentation";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

function buildPrompt(input: {
  goal: string;
  tone: string;
  length: string;
  audience: string;
  topic: string;
  prompt: string;
  includeSpeakerNotes: boolean;
}) {
  const targetSlides = input.length === "short" ? "6-8" : input.length === "medium" ? "10-14" : "15-20";

  return [
    "You are an expert presentation strategist.",
    `Create a ${input.goal} presentation deck in a ${input.tone} tone for ${input.audience}.`,
    `Topic: ${input.topic}.`,
    `Target slides: ${targetSlides}.`,
    "Return output in plain text using this structure exactly:",
    "Slide 1: <Title>",
    "- Bullet 1",
    "- Bullet 2",
    input.includeSpeakerNotes ? "Speaker Notes: <short notes>" : "Do not include speaker notes.",
    "Include a strong opening and a clear closing CTA.",
    "User request:",
    input.prompt,
  ].join("\n");
}

function estimateSlideCount(text: string) {
  const matches = text.match(/(^|\n)\s*Slide\s+\d+\s*:/gi);
  if (matches && matches.length > 0) {
    return matches.length;
  }

  return Math.max(1, Math.round(text.length / 400));
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const input = generatePresentationSchema.parse(raw);
    const userId = await resolveUserId(request);
    const resolvedTitle = input.title || input.topic.slice(0, 80);

    const prompt = buildPrompt(input);
    const generation = await generateTextFromPrompt({
      prompt,
      model: process.env.AI_TEXT_PROVIDER === "ollama" ? process.env.OLLAMA_TEXT_MODEL : process.env.OPENAI_TEXT_MODEL,
    });
    const ai = { provider: generation.provider, model: generation.modelSelected };
    const outputText = generation.text;
    if (!outputText) {
      return jsonError("Presentation generation returned empty output.", 500);
    }

    const slideCount = estimateSlideCount(outputText);

    if (process.env.DATABASE_URL) {
      try {
        const created = await prisma.presentationGeneration.create({
          data: {
            userId,
            title: resolvedTitle,
            goal: input.goal as PresentationGoal,
            tone: input.tone as PresentationTone,
            length: input.length as PresentationLength,
            audience: input.audience,
            topic: input.topic,
            prompt: input.prompt,
            outputText,
            slideCount,
            includeSpeakerNotes: input.includeSpeakerNotes,
            visualStyle: input.visualStyle,
            imagePrompt: input.imagePrompt || null,
            images: [],
            subtitleSourceLanguage: input.subtitleSourceLanguage,
            subtitleTargetLanguages: input.subtitleTargetLanguages,
            subtitleCues: [],
            subtitleTranslations: {},
            voiceoverText: "",
            voiceover: Prisma.JsonNull,
            status: GenerationStatus.COMPLETED,
          },
        });

        return NextResponse.json({
          id: created.id,
          title: created.title,
          outputText: created.outputText,
          slideCount: created.slideCount,
          includeSpeakerNotes: created.includeSpeakerNotes,
          visualStyle: created.visualStyle,
          imagePrompt: created.imagePrompt,
          images: [],
          subtitleSourceLanguage: created.subtitleSourceLanguage,
          subtitleTargetLanguages: created.subtitleTargetLanguages,
          subtitleCues: [],
          subtitleTranslations: {},
          voiceoverText: created.voiceoverText,
          voiceover: created.voiceover,
          isFavorite: created.isFavorite,
          status: created.status,
          createdAt: created.createdAt.toISOString(),
          generatedAt: created.createdAt.toISOString(),
          meta: {
            goal: created.goal,
            tone: created.tone,
            length: created.length,
            audience: created.audience,
            topic: created.topic,
            ai,
          },
        });
      } catch {
        // Fall back to non-persistent response when DB is unavailable.
      }
    }

    return NextResponse.json({
      id: randomUUID(),
      title: resolvedTitle || "Untitled Presentation",
      outputText,
      slideCount,
      includeSpeakerNotes: input.includeSpeakerNotes,
      visualStyle: input.visualStyle,
      imagePrompt: input.imagePrompt || null,
      images: [],
      subtitleSourceLanguage: input.subtitleSourceLanguage,
      subtitleTargetLanguages: input.subtitleTargetLanguages,
      subtitleCues: [],
      subtitleTranslations: {},
      voiceoverText: "",
      voiceover: null,
      isFavorite: false,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      meta: {
        goal: input.goal,
        tone: input.tone,
        length: input.length,
        audience: input.audience,
        topic: input.topic,
        ai,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate presentation.";
    return jsonError(message, 400);
  }
}
