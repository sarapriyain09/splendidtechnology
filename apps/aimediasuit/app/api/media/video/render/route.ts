import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { resolveUserId } from "@/lib/auth/user-id";
import { renderVideo } from "@/lib/video/video-renderer";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const MAX_SCENE_IMAGE_URL_LENGTH = 10_000;
const MAX_SCENE_IMAGE_DATA_URL_LENGTH = 8_000_000;
const MAX_UPLOADED_MUSIC_URL_LENGTH = 10_000;
const HEAVY_RENDER_SCENE_THRESHOLD = 8;

const sceneImageSchema = z
  .string()
  .optional()
  .default("")
  .superRefine((value, ctx) => {
    if (!value) {
      return;
    }

    const maxLength = value.startsWith("data:image/")
      ? MAX_SCENE_IMAGE_DATA_URL_LENGTH
      : MAX_SCENE_IMAGE_URL_LENGTH;

    if (value.length > maxLength) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        origin: "string",
        maximum: maxLength,
        inclusive: true,
        message: `Image payload is too large (max ${maxLength} characters).`,
      });
    }
  });

const renderSchema = z.object({
  videoId: z.string().uuid().optional(),
  scenes: z
    .array(
      z.object({
        sceneNumber: z.number().int().min(1),
        duration: z.number().int().min(1).max(60),
        caption: z.string().max(500).optional().default(""),
        voiceover: z.string().max(4000).optional().default(""),
        voiceVolume: z.number().min(0).max(200).optional().default(100),
        musicVolume: z.number().min(0).max(200).optional().default(100),
        image: sceneImageSchema,
        transition: z
          .enum(["cut", "fade", "crossfade", "slideleft", "slideright", "zoomin", "zoomout", "flash"])
          .optional()
          .default("crossfade"),
      }),
    )
    .min(1)
    .max(24),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).default("16:9"),
  quality: z.enum(["1080p", "720p"]).default("1080p"),
  voice: z.enum(["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer"]).default("alloy"),
  speed: z.number().min(0.5).max(2).default(1),
  speechLeadInSec: z.number().min(0).max(5).default(0.35),
  speechTailSec: z.number().min(0).max(8).default(0.7),
  includeSubtitles: z.boolean().default(true),
  musicTrack: z.enum(["none", "corporate", "motivational", "ambient", "upbeat", "uploaded"]).default("none"),
  uploadedMusicUrl: z.string().max(MAX_UPLOADED_MUSIC_URL_LENGTH).optional().default(""),
  voiceVolume: z.number().min(0).max(100).default(100),
  musicVolume: z.number().min(0).max(100).default(35),
}).superRefine((value, ctx) => {
  if (value.musicTrack === "uploaded" && !value.uploadedMusicUrl.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["uploadedMusicUrl"],
      message: "Upload music file first when using Uploaded track.",
    });
  }
});

export async function POST(request: NextRequest) {
  try {
    const input = renderSchema.parse(await request.json());
    const userId = await resolveUserId(request);

    const isHeavyRender = input.scenes.length >= HEAVY_RENDER_SCENE_THRESHOLD;
    const effectiveQuality = isHeavyRender ? "720p" : input.quality;
    const effectiveIncludeSubtitles = isHeavyRender ? false : input.includeSubtitles;

    const rendered = await renderVideo({
      scenes: input.scenes,
      aspectRatio: input.aspectRatio,
      quality: effectiveQuality,
      voice: input.voice,
      speed: input.speed,
      speechLeadInSec: input.speechLeadInSec,
      speechTailSec: input.speechTailSec,
      includeSubtitles: effectiveIncludeSubtitles,
      musicTrack: input.musicTrack,
      uploadedMusicUrl: input.uploadedMusicUrl,
      voiceVolume: input.voiceVolume,
      musicVolume: input.musicVolume,
    });

    if (input.videoId && process.env.DATABASE_URL) {
      try {
        const found = await prisma.videoGeneration.findFirst({
          where: {
            id: input.videoId,
            userId,
          },
          select: { id: true },
        });

        if (found) {
          await prisma.videoGeneration.update({
            where: { id: found.id },
            data: {
              outputUrl: rendered.outputUrl,
              sceneCount: rendered.sceneCount,
            },
          });
        }
      } catch {
        // Return rendered result even when persistence fails.
      }
    }

    return NextResponse.json({
      outputUrl: rendered.outputUrl,
      sceneCount: rendered.sceneCount,
      totalDurationSec: rendered.totalDurationSec,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to render video.";
    return jsonError(message, 400);
  }
}
