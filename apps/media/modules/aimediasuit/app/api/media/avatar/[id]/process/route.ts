import { GenerationStatus, ModuleType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { buildAvatarHistoryItem, buildAvatarInputText, parseAvatarInputText } from "@/lib/avatar/metadata";
import { resolveAvatarVoiceAudioUrl } from "@/lib/avatar/avatar-voice";
import { renderAvatarPlaceholder } from "@/lib/avatar/avatar-renderer";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, { params }: Params) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);
  const { id } = await params;

  try {
    const found = await prisma.mediaGeneration.findFirst({
      where: {
        id,
        userId,
        moduleType: ModuleType.AVATAR,
      },
    });

    if (!found) {
      return NextResponse.json({ error: "Avatar generation not found." }, { status: 404 });
    }

    if (found.status === GenerationStatus.PROCESSING) {
      return NextResponse.json({ error: "Avatar job is already processing." }, { status: 409 });
    }

    if (found.status === GenerationStatus.COMPLETED && found.outputUrl) {
      return NextResponse.json({
        ...buildAvatarHistoryItem(found),
        processedAt: new Date().toISOString(),
        meta: {
          phase: "phase-2",
          render: "already-completed",
        },
      });
    }

    const processing = await prisma.mediaGeneration.update({
      where: { id: found.id },
      data: { status: GenerationStatus.PROCESSING },
    });

    const parsed = parseAvatarInputText(processing.inputText);

    try {
      const resolvedVoiceAudioUrl = await resolveAvatarVoiceAudioUrl({
        script: parsed.script,
        voiceAudioUrl: parsed.voiceAudioUrl ?? "",
        voice: "alloy",
        speed: 1,
      });

      const rendered = await renderAvatarPlaceholder({
        script: parsed.script,
        preset: parsed.preset,
        background: parsed.background,
        aspectRatio: parsed.aspectRatio,
        voiceAudioUrl: resolvedVoiceAudioUrl,
        backgroundImageUrl: parsed.backgroundImageUrl ?? "",
        requestOrigin: request.nextUrl.origin,
      });

      const completed = await prisma.mediaGeneration.update({
        where: { id: processing.id },
        data: {
          inputText: buildAvatarInputText({
            script: parsed.script,
            preset: parsed.preset,
            background: parsed.background,
            language: parsed.language,
            aspectRatio: parsed.aspectRatio,
            voiceAudioUrl: resolvedVoiceAudioUrl,
            backgroundImageUrl: parsed.backgroundImageUrl ?? "",
            renderMode: parsed.renderMode,
          }),
          outputUrl: rendered.outputUrl,
          duration: rendered.duration,
          status: GenerationStatus.COMPLETED,
        },
      });

      return NextResponse.json({
        ...buildAvatarHistoryItem(completed),
        processedAt: new Date().toISOString(),
        meta: {
          phase: "phase-2",
          render: rendered.engine,
        },
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Avatar render failed.";
      console.error("[avatar-process] render failed:", reason);

      const failed = await prisma.mediaGeneration.update({
        where: { id: processing.id },
        data: { status: GenerationStatus.FAILED },
      });

      return NextResponse.json({
        ...buildAvatarHistoryItem(failed),
        processedAt: new Date().toISOString(),
        error: reason,
        meta: {
          phase: "phase-2",
          render: "failed",
        },
      });
    }
  } catch {
    return NextResponse.json({ error: "Database is unavailable." }, { status: 503 });
  }
}
