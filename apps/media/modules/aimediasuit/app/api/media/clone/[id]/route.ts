import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { prisma } from "@/lib/db/prisma";
import { deleteVideoByPublicUrl } from "@/lib/storage/video-storage";

type Params = {
  params: Promise<{ id: string }>;
};

export const runtime = "nodejs";

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);
  const { id } = await params;

  try {
    const found = await prisma.avatarClone.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!found) {
      return NextResponse.json({ error: "Clone not found." }, { status: 404 });
    }

    const projects = await prisma.cloneProject.findMany({
      where: { avatarCloneId: found.id, userId },
      select: { outputVideo: true },
    });

    await Promise.all(
      projects
        .map((item) => item.outputVideo)
        .filter((value): value is string => Boolean(value))
        .map((url) => deleteVideoByPublicUrl(url).catch(() => undefined)),
    );

    await prisma.avatarClone.delete({ where: { id: found.id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Database is unavailable." }, { status: 503 });
  }
}
