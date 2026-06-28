import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { toAvatarCloneItem, toCloneProjectItem, toVoiceCloneItem } from "@/lib/clone/metadata";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ clones: [], voiceClones: [], projects: [] });
  }

  const userId = await resolveUserId(request);

  try {
    const [clones, voiceClones, projects] = await Promise.all([
      prisma.avatarClone.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.voiceClone.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.cloneProject.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      clones: clones.map((row) => toAvatarCloneItem(row)),
      voiceClones: voiceClones.map((row) => toVoiceCloneItem(row)),
      projects: projects.map((row) => toCloneProjectItem(row)),
    });
  } catch {
    return NextResponse.json({ clones: [], voiceClones: [], projects: [] });
  }
}
