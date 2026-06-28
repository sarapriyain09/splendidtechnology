import { NextResponse } from "next/server";
import { saveAudioFile } from "@/lib/storage/audio-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 30 * 1024 * 1024;

function isMp3File(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return type === "audio/mpeg" || type === "audio/mp3" || name.endsWith(".mp3");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Music file is required." }, { status: 400 });
    }

    if (!isMp3File(file)) {
      return NextResponse.json({ error: "Only MP3 uploads are supported right now." }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Music file must be between 1 byte and 30 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveAudioFile(buffer);

    return NextResponse.json({
      audioUrl: saved.urlPath,
      size: file.size,
      fileName: file.name,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}