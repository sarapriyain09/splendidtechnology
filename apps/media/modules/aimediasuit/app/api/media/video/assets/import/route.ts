import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveImageFile } from "@/lib/storage/image-storage";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const schema = z.object({
  sourceUrl: z.string().url().max(4000),
});

function extensionFromMime(contentType: string | null) {
  const value = (contentType ?? "").toLowerCase();
  if (value.includes("image/jpeg") || value.includes("image/jpg")) return "jpeg";
  if (value.includes("image/webp")) return "webp";
  if (value.includes("image/gif")) return "gif";
  return "png";
}

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());

    const response = await fetch(input.sourceUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "AIMediaSuit/1.0 (+https://aimedia.velynxia.com)",
      },
    });

    if (!response.ok) {
      return jsonError(`Failed to import image: ${response.status}`, 400);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("image/")) {
      return jsonError("Imported URL did not return an image.", 400);
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) {
      return jsonError("Imported image is empty.", 400);
    }

    const saved = await saveImageFile(bytes, extensionFromMime(contentType));

    return NextResponse.json({
      imageUrl: saved.urlPath,
      sourceUrl: input.sourceUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to import image.";
    return jsonError(message, 400);
  }
}