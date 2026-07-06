import { NextResponse } from "next/server";
import { saveImageFile } from "@/lib/storage/image-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function extensionFromFile(file: File) {
  const byType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpeg",
    "image/webp": "webp",
    "image/gif": "gif",
  };

  const fromType = byType[file.type.toLowerCase()];
  if (fromType) {
    return fromType;
  }

  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".png")) return "png";
  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) return "jpeg";
  if (fileName.endsWith(".webp")) return "webp";
  if (fileName.endsWith(".gif")) return "gif";

  return "png";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.toLowerCase().startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Image must be between 1 byte and 15 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveImageFile(buffer, extensionFromFile(file));

    return NextResponse.json({
      imageUrl: saved.urlPath,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}