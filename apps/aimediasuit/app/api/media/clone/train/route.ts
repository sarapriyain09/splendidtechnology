import { CloneStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { toDecimal, toAvatarCloneItem, toVoiceCloneItem } from "@/lib/clone/metadata";
import { prisma } from "@/lib/db/prisma";
import { cloneTrainSchema } from "@/lib/schemas/clone";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);

  try {
    const input = cloneTrainSchema.parse(await request.json());

    const [avatarClone, voiceClone] = await Promise.all([
      prisma.avatarClone.findFirst({ where: { id: input.avatarCloneId, userId } }),
      prisma.voiceClone.findFirst({ where: { id: input.voiceCloneId, userId } }),
    ]);

    if (!avatarClone || !voiceClone) {
      return NextResponse.json({ error: "Clone assets not found for this user." }, { status: 404 });
    }

    if (!avatarClone.trainingVideo) {
      return NextResponse.json({ error: "Training video is required before training." }, { status: 400 });
    }

    const processing = await Promise.all([
      prisma.avatarClone.update({
        where: { id: avatarClone.id },
        data: {
          status: CloneStatus.TRAINING,
          name: input.cloneName,
          language: input.language,
          accent: input.accent || null,
          speakingSpeed: toDecimal(input.speakingSpeed),
          gender: input.gender,
          defaultBackground: input.defaultBackground,
          category: input.avatarCategory,
        },
      }),
      prisma.voiceClone.update({
        where: { id: voiceClone.id },
        data: {
          status: CloneStatus.TRAINING,
          name: `${input.cloneName} Voice`,
          language: input.language,
        },
      }),
    ]);

    // Placeholder model paths for queue/worker handoff; real trainer writes these paths later.
    const [readyAvatar, readyVoice] = await Promise.all([
      prisma.avatarClone.update({
        where: { id: processing[0].id },
        data: {
          status: CloneStatus.READY,
          avatarModelPath: `/models/avatar/${processing[0].id}`,
        },
      }),
      prisma.voiceClone.update({
        where: { id: processing[1].id },
        data: {
          status: CloneStatus.READY,
          voiceModelPath: `/models/voice/${processing[1].id}`,
        },
      }),
    ]);

    return NextResponse.json({
      avatarClone: toAvatarCloneItem(readyAvatar),
      voiceClone: toVoiceCloneItem(readyVoice),
      timeline: [
        "Uploading...",
        "Processing...",
        "Training Face...",
        "Training Voice...",
        "Ready",
      ],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start clone training.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
