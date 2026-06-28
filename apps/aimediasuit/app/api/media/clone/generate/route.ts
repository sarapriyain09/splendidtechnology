import { CloneStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { parseStringArrayField } from "@/lib/clone/metadata";
import { prisma } from "@/lib/db/prisma";
import { cloneGenerateSchema } from "@/lib/schemas/clone";
import { VoiceProviderFactory } from "@/lib/providers/voice-provider-factory";
import { saveAudioFile } from "@/lib/storage/audio-storage";
import { readImageByPublicPath } from "@/lib/storage/image-storage";
import { renderVideo } from "@/lib/video/video-renderer";

export const runtime = "nodejs";

function isMissingMediaToolingError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return (
    message.includes("ffmpeg ENOENT") ||
    message.includes("ffprobe ENOENT") ||
    message.includes("FFmpeg is not installed")
  );
}

function emotionToLeadIn(emotion: string) {
  if (emotion === "excited") return 0.2;
  if (emotion === "calm") return 0.5;
  return 0.35;
}

function emotionToVoiceSpeed(emotion: string) {
  if (emotion === "excited") return 1.12;
  if (emotion === "serious") return 0.95;
  if (emotion === "calm") return 0.9;
  return 1;
}

function statusFromRenderOutput(outputVideo: string | null) {
  return outputVideo ? CloneStatus.READY : CloneStatus.FAILED;
}

function mediaImageSegments(path: string) {
  if (!path.startsWith("/media/image/")) {
    return null;
  }

  const relative = path.replace("/media/image/", "");
  if (!relative || relative.includes("..")) {
    return null;
  }

  return relative.split("/").filter(Boolean);
}

async function canReadImagePath(path: string) {
  const segments = mediaImageSegments(path);
  if (!segments) {
    return false;
  }

  try {
    await readImageByPublicPath(segments);
    return true;
  } catch {
    return false;
  }
}

async function resolveSceneImages(avatarClone: { previewImage: string | null; photoFolder: string }) {
  const photoUrls = parseStringArrayField(avatarClone.photoFolder);
  const candidates = [avatarClone.previewImage ?? "", ...photoUrls]
    .map((item) => item.trim())
    .filter(Boolean);

  const uniqueCandidates = [...new Set(candidates)];
  const validImages: string[] = [];

  for (const candidate of uniqueCandidates) {
    if (await canReadImagePath(candidate)) {
      validImages.push(candidate);
    }
  }

  return validImages;
}

function splitScriptIntoScenes(script: string, scenesPerMinute: number) {
  const clean = script.trim().replace(/\s+/g, " ");
  if (!clean) {
    return [] as string[];
  }

  const words = clean.split(" ");
  const estimatedMinutes = Math.max(words.length / 130, 0.2);
  const sceneCount = Math.max(1, Math.round(estimatedMinutes * scenesPerMinute));
  const chunkSize = Math.max(6, Math.ceil(words.length / sceneCount));
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);

  try {
    const input = cloneGenerateSchema.parse(await request.json());

    const [avatarClone, voiceClone] = await Promise.all([
      prisma.avatarClone.findFirst({ where: { id: input.avatarCloneId, userId } }),
      prisma.voiceClone.findFirst({ where: { id: input.voiceCloneId, userId } }),
    ]);

    if (!avatarClone || !voiceClone) {
      return NextResponse.json({ error: "Clone profile not found." }, { status: 404 });
    }

    if (avatarClone.status !== CloneStatus.READY || voiceClone.status !== CloneStatus.READY) {
      return NextResponse.json({ error: "Clone profile is not ready yet." }, { status: 409 });
    }

    const sceneImages = await resolveSceneImages(avatarClone);
    if (sceneImages.length === 0) {
      return NextResponse.json(
        {
          error:
            "Selected clone images are missing on server. Please re-upload clone photos or upload a new training video to rebuild clone media.",
        },
        { status: 409 },
      );
    }

    const scriptScenes = splitScriptIntoScenes(input.script, input.scenesPerMinute);
    if (scriptScenes.length === 0) {
      return NextResponse.json({ error: "Script is empty." }, { status: 400 });
    }

    const createdProject = await prisma.cloneProject.create({
      data: {
        userId,
        avatarCloneId: avatarClone.id,
        voiceCloneId: voiceClone.id,
        script: input.script,
        background: input.background ?? avatarClone.defaultBackground,
        music: input.music,
        subtitle: input.subtitle,
        status: CloneStatus.PROCESSING,
      },
    });

    const voiceProvider = VoiceProviderFactory.resolve();
    const mp3Bytes = await voiceProvider.generateSpeechMp3(
      input.script,
      "alloy",
      emotionToVoiceSpeed(input.emotion),
    );
    const savedVoice = await saveAudioFile(mp3Bytes);

    const primarySceneImage = sceneImages[0] ?? null;
    if (primarySceneImage && primarySceneImage !== avatarClone.previewImage) {
      await prisma.avatarClone.update({
        where: { id: avatarClone.id },
        data: { previewImage: primarySceneImage },
      }).catch(() => undefined);
    }

    try {
      const rendered = await renderVideo({
        scenes: scriptScenes.map((sceneText, index) => ({
          sceneNumber: index + 1,
          duration: Math.max(6, Math.round(sceneText.trim().split(/\s+/).length / 2.4)),
          caption: sceneText,
          voiceover: sceneText,
          image: sceneImages[index % sceneImages.length] ?? "",
          transition: "crossfade",
        })),
        aspectRatio: input.aspectRatio,
        quality: "1080p",
        voice: "alloy",
        speed: emotionToVoiceSpeed(input.emotion),
        speechLeadInSec: emotionToLeadIn(input.emotion),
        speechTailSec: 0.7,
        includeSubtitles: input.subtitle,
        musicTrack: input.music,
        voiceVolume: 100,
        musicVolume: 35,
      });

      const outputVideo = rendered.outputUrl;

      const completed = await prisma.cloneProject.update({
        where: { id: createdProject.id },
        data: {
          outputVideo,
          status: statusFromRenderOutput(outputVideo),
        },
      });

      return NextResponse.json({
        projectId: completed.id,
        status: completed.status,
        outputVideo: completed.outputVideo,
        meta: {
          cloneName: avatarClone.name,
          voiceCloneName: voiceClone.name,
          background: completed.background,
          music: completed.music,
          subtitle: completed.subtitle,
          aspectRatio: input.aspectRatio,
          emotion: input.emotion,
          sceneCount: scriptScenes.length,
          scenesPerMinute: input.scenesPerMinute,
          voicePreviewUrl: savedVoice.urlPath,
        },
        createdAt: completed.createdAt.toISOString(),
        updatedAt: completed.updatedAt.toISOString(),
      });
    } catch (error) {
      if (isMissingMediaToolingError(error)) {
        const queued = await prisma.cloneProject.update({
          where: { id: createdProject.id },
          data: { status: CloneStatus.PENDING },
        });

        return NextResponse.json(
          {
            projectId: queued.id,
            status: queued.status,
            outputVideo: queued.outputVideo,
            meta: {
              cloneName: avatarClone.name,
              voiceCloneName: voiceClone.name,
              background: queued.background,
              music: queued.music,
              subtitle: queued.subtitle,
              aspectRatio: input.aspectRatio,
              emotion: input.emotion,
              sceneCount: scriptScenes.length,
              scenesPerMinute: input.scenesPerMinute,
              voicePreviewUrl: savedVoice.urlPath,
            },
            warning:
              "FFmpeg/ffprobe is not available on this host. Project is kept in PENDING and can be processed by a worker environment with media tooling installed.",
            createdAt: queued.createdAt.toISOString(),
            updatedAt: queued.updatedAt.toISOString(),
          },
          { status: 202 },
        );
      }

      const failed = await prisma.cloneProject.update({
        where: { id: createdProject.id },
        data: { status: CloneStatus.FAILED },
      });

      const message = error instanceof Error ? error.message : "Failed to render clone project.";
      return NextResponse.json(
        {
          error: message,
          projectId: failed.id,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate clone video.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
