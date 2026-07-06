import { CloneStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { buildPhotosFolderField } from "@/lib/clone/metadata";
import { extractFramesFromVideo, inspectVideo } from "@/lib/clone/media-inspector";
import { prisma } from "@/lib/db/prisma";
import { saveImageFile } from "@/lib/storage/image-storage";
import { saveVideoFile } from "@/lib/storage/video-storage";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 1024 * 1024 * 1024;

function detectVideoExtension(file: File) {
  const type = file.type.toLowerCase();
  const lowerName = file.name.toLowerCase();

  if (type === "video/mp4" || lowerName.endsWith(".mp4")) {
    return "mp4" as const;
  }

  if (type === "video/webm" || lowerName.endsWith(".webm")) {
    return "webm" as const;
  }

  return null;
}

function isMissingBinaryError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("ffprobe ENOENT") || message.includes("ffprobe exited");
}

function isMissingFfmpegError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("ffmpeg ENOENT") || message.includes("ffmpeg exited");
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);

  try {
    const formData = await request.formData();
    const cloneId = String(formData.get("cloneId") ?? "").trim();
    const cloneNameRaw = String(formData.get("cloneName") ?? "").trim();
    const languageRaw = String(formData.get("language") ?? "english").trim();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Training video file is required." }, { status: 400 });
    }

    const extension = detectVideoExtension(file);
    if (!extension) {
      return NextResponse.json({ error: "Only MP4 and WebM training video are supported." }, { status: 400 });
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Training video must be between 1 byte and 1 GB." }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = await saveVideoFile(bytes, new Date(), extension);

    let meta = {
      durationSec: 0,
      width: 0,
      height: 0,
      fps: 0,
    };
    let warning: string | null = null;

    try {
      meta = await inspectVideo(bytes, extension);
    } catch (error) {
      if (isMissingBinaryError(error)) {
        warning = "ffprobe is not available; returned fallback metadata. Install FFmpeg/ffprobe for duration, resolution, and FPS detection.";
      } else {
        throw error;
      }
    }

    let resolvedCloneId = cloneId;

    if (!resolvedCloneId) {
      let extractedFrames: Buffer[] = [];
      try {
        extractedFrames = await extractFramesFromVideo(bytes, extension, 20, meta.durationSec);
      } catch (error) {
        if (isMissingFfmpegError(error)) {
          return NextResponse.json(
            { error: "FFmpeg is required to auto-extract photos from video. Install FFmpeg or upload photos manually." },
            { status: 400 },
          );
        }
        throw error;
      }

      if (extractedFrames.length < 20) {
        return NextResponse.json(
          { error: "Could not extract enough photo frames from video. Please upload photos manually." },
          { status: 400 },
        );
      }

      const uploadedFrameUrls: string[] = [];
      for (const frame of extractedFrames.slice(0, 20)) {
        const stored = await saveImageFile(frame, "jpeg");
        uploadedFrameUrls.push(stored.urlPath);
      }

      const now = new Date();
      const displayName = cloneNameRaw || `Clone ${now.toISOString().slice(0, 10)}`;
      const created = await prisma.avatarClone.create({
        data: {
          userId,
          name: displayName,
          status: CloneStatus.UPLOADING,
          photoFolder: buildPhotosFolderField(uploadedFrameUrls),
          previewImage: uploadedFrameUrls[0] ?? null,
          language: languageRaw || "english",
          trainingVideo: saved.urlPath,
        },
      });

      resolvedCloneId = created.id;
    } else {
      await prisma.avatarClone.update({
        where: { id: resolvedCloneId },
        data: { trainingVideo: saved.urlPath },
      });
    }

    return NextResponse.json({
      cloneId: resolvedCloneId,
      trainingVideo: saved.urlPath,
      media: {
        durationSec: meta.durationSec,
        durationMin: meta.durationSec / 60,
        width: meta.width,
        height: meta.height,
        fps: meta.fps,
      },
      recommendation: {
        minMinutes: 1,
        maxMinutes: 2,
      },
      bootstrap: {
        createdFromVideoOnly: !cloneId,
        extractedPhotoCount: !cloneId ? 20 : 0,
      },
      warning,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload training video.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
