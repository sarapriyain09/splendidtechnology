import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { saveVideoFile } from "@/lib/storage/video-storage";
import type { AvatarAspectRatio, AvatarBackground, AvatarPreset } from "@/types/media";

function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr || `${command} exited with code ${code}`));
      }
    });
  });
}

async function commandExists(command: string) {
  try {
    await runCommand(command, ["-version"]);
    return true;
  } catch {
    return false;
  }
}

function getResolution(aspectRatio: AvatarAspectRatio) {
  if (aspectRatio === "9:16") {
    return { width: 1080, height: 1920 };
  }

  return { width: 1920, height: 1080 };
}

async function downloadToFile(url: string, targetPath: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch asset: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(targetPath, bytes);
}

function resolveAssetUrl(urlOrPath: string, requestOrigin: string) {
  const trimmed = urlOrPath.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const configuredInternalOrigin = process.env.INTERNAL_ASSET_ORIGIN?.trim();
  const defaultInternalOrigin = `http://127.0.0.1:${process.env.PORT || "8080"}`;
  const internalOrigin = configuredInternalOrigin && /^https?:\/\//i.test(configuredInternalOrigin)
    ? configuredInternalOrigin
    : defaultInternalOrigin;

  if (trimmed.startsWith("/")) {
    return new URL(trimmed, internalOrigin).toString();
  }

  return new URL(`/${trimmed}`, internalOrigin).toString();
}

function getBackgroundColor(background: AvatarBackground) {
  if (background === "office") {
    return "#24478f";
  }

  if (background === "classroom") {
    return "#5c4433";
  }

  if (background === "home") {
    return "#2d5c4b";
  }

  return "#1f2a5a";
}

function getDefaultBackgroundImagePath(background: AvatarBackground) {
  if (background === "office") {
    return "/avatar-backgrounds/office.svg";
  }

  if (background === "classroom") {
    return "/avatar-backgrounds/classroom.svg";
  }

  if (background === "home") {
    return "/avatar-backgrounds/home.svg";
  }

  return "/avatar-backgrounds/studio.svg";
}

export async function renderAvatarPlaceholder(input: {
  script: string;
  preset: AvatarPreset;
  background: AvatarBackground;
  aspectRatio: AvatarAspectRatio;
  voiceAudioUrl: string;
  backgroundImageUrl: string;
  requestOrigin: string;
}) {
  const hasFfmpeg = await commandExists("ffmpeg");
  if (!hasFfmpeg) {
    throw new Error("FFmpeg is not installed on the server.");
  }

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-avatar-"));

  try {
    const outFile = join(workDir, `avatar-${randomUUID()}.mp4`);
    const imagePath = join(workDir, `bg-${randomUUID()}.img`);
    const voicePath = join(workDir, `voice-${randomUUID()}.mp3`);
    const estimatedDuration = Math.max(8, Math.round(input.script.trim().split(/\s+/).filter(Boolean).length / 2.4));
    const { width, height } = getResolution(input.aspectRatio);
    const backgroundColor = getBackgroundColor(input.background);

    const effectiveBackgroundImageUrl = input.backgroundImageUrl.trim() || getDefaultBackgroundImagePath(input.background);
    const hasBackground = Boolean(effectiveBackgroundImageUrl);
    const hasVoice = Boolean(input.voiceAudioUrl.trim());

    if (hasBackground) {
      const bgUrl = resolveAssetUrl(effectiveBackgroundImageUrl, input.requestOrigin);
      await downloadToFile(bgUrl, imagePath);
    }

    if (hasVoice) {
      const voiceUrl = resolveAssetUrl(input.voiceAudioUrl, input.requestOrigin);
      await downloadToFile(voiceUrl, voicePath);
    }

    const scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,format=yuv420p`;

    if (hasBackground && hasVoice) {
      await runCommand("ffmpeg", [
        "-y",
        "-loop",
        "1",
        "-i",
        imagePath,
        "-i",
        voicePath,
        "-vf",
        scaleFilter,
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        outFile,
      ]);
    } else if (hasBackground && !hasVoice) {
      await runCommand("ffmpeg", [
        "-y",
        "-loop",
        "1",
        "-i",
        imagePath,
        "-f",
        "lavfi",
        "-i",
        "anullsrc=r=44100:cl=stereo",
        "-vf",
        scaleFilter,
        "-t",
        String(estimatedDuration),
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        outFile,
      ]);
    } else if (!hasBackground && hasVoice) {
      await runCommand("ffmpeg", [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `color=c=${backgroundColor}:s=${width}x${height}:d=${estimatedDuration}`,
        "-i",
        voicePath,
        "-vf",
        "format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        outFile,
      ]);
    } else {
      await runCommand("ffmpeg", [
        "-y",
        "-f",
        "lavfi",
        "-i",
        `color=c=${backgroundColor}:s=${width}x${height}:d=${estimatedDuration}`,
        "-f",
        "lavfi",
        "-i",
        "anullsrc=r=44100:cl=stereo",
        "-vf",
        "format=yuv420p",
        "-t",
        String(estimatedDuration),
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-shortest",
        outFile,
      ]);
    }

    const outputBuffer = await readFile(outFile);
    const saved = await saveVideoFile(outputBuffer);

    return {
      outputUrl: saved.urlPath,
      duration: estimatedDuration,
      engine: "ffmpeg-placeholder",
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
