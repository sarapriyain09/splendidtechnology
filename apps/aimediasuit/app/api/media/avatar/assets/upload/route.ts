import { NextResponse } from "next/server";
import { saveAudioFile } from "@/lib/storage/audio-storage";
import { saveImageFile } from "@/lib/storage/image-storage";

export const runtime = "nodejs";

const MAX_AUDIO_FILE_SIZE = 30 * 1024 * 1024;
const MAX_IMAGE_FILE_SIZE = 15 * 1024 * 1024;

function extensionFromImage(file: File) {
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

function isMp3File(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type === "audio/mpeg" || type === "audio/mp3" || name.endsWith(".mp3");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") ?? "").toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (kind === "audio") {
      if (!isMp3File(file)) {
        return NextResponse.json({ error: "Only MP3 uploads are supported for voice audio." }, { status: 400 });
      }

      if (file.size <= 0 || file.size > MAX_AUDIO_FILE_SIZE) {
        return NextResponse.json({ error: "Audio file must be between 1 byte and 30 MB." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const saved = await saveAudioFile(buffer);
      return NextResponse.json({
        kind: "audio",
        url: saved.urlPath,
        size: file.size,
        fileName: file.name,
      });
    }

    if (kind === "image") {
      if (!file.type.toLowerCase().startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are supported for background image." }, { status: 400 });
      }

      if (file.size <= 0 || file.size > MAX_IMAGE_FILE_SIZE) {
        return NextResponse.json({ error: "Image file must be between 1 byte and 15 MB." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const saved = await saveImageFile(buffer, extensionFromImage(file));
      return NextResponse.json({
        kind: "image",
        url: saved.urlPath,
        size: file.size,
        fileName: file.name,
      });
    }

    return NextResponse.json({ error: "Invalid upload kind. Use 'audio' or 'image'." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}