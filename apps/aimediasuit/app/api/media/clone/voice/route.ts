import { CloneStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { buildVoiceFolderField, toVoiceCloneItem } from "@/lib/clone/metadata";
import { convertWavToMp3, extractAudioFromVideoToMp3, inspectAudioDuration } from "@/lib/clone/media-inspector";
import { prisma } from "@/lib/db/prisma";
import { saveAudioFile } from "@/lib/storage/audio-storage";

export const runtime = "nodejs";

const MIN_DURATION_SEC = 60;
const MAX_FILE_SIZE = 200 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 1024 * 1024 * 1024;

function isMissingBinaryError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("ffprobe ENOENT") || message.includes("ffprobe exited");
}

function estimateDurationSecFromSize(sizeInBytes: number, type: "mp3" | "wav" | "mp4" | "webm") {
  // Conservative bitrate assumptions for fallback-only environments.
  const bytesPerSecond =
    type === "wav" ? 176_400 :
    type === "mp4" || type === "webm" ? 250_000 :
    16_000;
  return Math.max(1, Math.round(sizeInBytes / bytesPerSecond));
}

function detectAudioType(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type === "audio/mpeg" || name.endsWith(".mp3")) {
    return "mp3" as const;
  }

  if (type === "audio/wav" || type === "audio/x-wav" || name.endsWith(".wav")) {
    return "wav" as const;
  }

  if (type === "audio/webm") {
    return "webm" as const;
  }

  if (type === "video/mp4" || name.endsWith(".mp4")) {
    return "mp4" as const;
  }

  if (type === "video/webm" || name.endsWith(".webm")) {
    return "webm" as const;
  }

  return null;
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);

  try {
    const formData = await request.formData();
    const cloneName = String(formData.get("name") ?? "My Voice Clone").trim() || "My Voice Clone";
    const language = String(formData.get("language") ?? "english").trim() || "english";
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Voice file is required." }, { status: 400 });
    }

    const type = detectAudioType(file);
    if (!type) {
      return NextResponse.json({ error: "Only WAV, MP3, MP4, and WebM files are supported." }, { status: 400 });
    }

    const maxAllowedSize = type === "mp4" || type === "webm" ? MAX_VIDEO_FILE_SIZE : MAX_FILE_SIZE;
    if (file.size <= 0 || file.size > maxAllowedSize) {
      const message =
        type === "mp4" || type === "webm"
          ? "Video voice sample must be between 1 byte and 1 GB."
          : "Voice file must be between 1 byte and 200 MB.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    let durationSec = 0;
    let warning: string | null = null;
    let mp3Bytes: Buffer;

    if (type === "mp4" || type === "webm") {
      try {
        mp3Bytes = await extractAudioFromVideoToMp3(bytes, type);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error ?? "");
        if (message.includes("ffmpeg ENOENT") || message.includes("ffmpeg exited")) {
          return NextResponse.json(
            { error: "FFmpeg is required to extract audio from video files. Install FFmpeg and try again." },
            { status: 400 },
          );
        }
        throw error;
      }
    } else {
      mp3Bytes = type === "wav" ? await convertWavToMp3(bytes) : bytes;
    }

    try {
      durationSec = await inspectAudioDuration(mp3Bytes, "mp3");
    } catch (error) {
      if (isMissingBinaryError(error)) {
        durationSec = estimateDurationSecFromSize(file.size, type);
        warning = "ffprobe is not available; duration was estimated from file size. Install FFmpeg/ffprobe for precise duration checks.";
      } else {
        throw error;
      }
    }

    if (durationSec < MIN_DURATION_SEC) {
      return NextResponse.json(
        { error: "Voice sample must be at least 1 minute long." },
        { status: 400 },
      );
    }

    const saved = await saveAudioFile(mp3Bytes);

    const created = await prisma.voiceClone.create({
      data: {
        userId,
        name: cloneName,
        audioFolder: buildVoiceFolderField([saved.urlPath]),
        duration: Math.round(durationSec),
        language,
        status: CloneStatus.UPLOADING,
      },
    });

    return NextResponse.json({
      voiceClone: toVoiceCloneItem(created),
      recommendation: {
        minMinutes: 1,
        recommendedMinMinutes: 1,
        recommendedMaxMinutes: 2,
      },
      player: {
        url: saved.urlPath,
      },
      warning,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload voice clone sample.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
