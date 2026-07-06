import { NextRequest, NextResponse } from "next/server";
import { readImageByPublicPath } from "@/lib/storage/image-storage";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ path: string[] }>;
};

function getContentType(fileName: string) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { path } = await params;
    const { file, size } = await readImageByPublicPath(path);
    const fileName = path[path.length - 1] ?? "image";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": getContentType(fileName),
        "Content-Length": size.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
