import { createWriteStream } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { VoiceProviderFactory } from "@/lib/providers/voice-provider-factory";
import { readAudioByPublicPath } from "@/lib/storage/audio-storage";
import { readImageByPublicPath } from "@/lib/storage/image-storage";
import { saveVideoFileFromPath } from "@/lib/storage/video-storage";
import type { VoiceType } from "@/types/media";

export type RenderScene = {
  sceneNumber: number;
  duration: number;
  caption: string;
  voiceover: string;
  image: string;
  voiceVolume?: number;
  musicVolume?: number;
  transition: "cut" | "fade" | "crossfade" | "slideleft" | "slideright" | "zoomin" | "zoomout" | "flash";
};

export type RenderOptions = {
  scenes: RenderScene[];
  aspectRatio: "16:9" | "9:16" | "1:1";
  quality: "1080p" | "720p";
  voice: VoiceType;
  speed: number;
  speechLeadInSec: number;
  speechTailSec: number;
  includeSubtitles: boolean;
  musicTrack: "none" | "corporate" | "motivational" | "ambient" | "upbeat" | "uploaded";
  uploadedMusicUrl?: string;
  voiceVolume: number;
  musicVolume: number;
};

type PresetMusicTrack = Exclude<RenderOptions["musicTrack"], "none" | "uploaded">;

const musicTrackFiles: Record<PresetMusicTrack, string> = {
  corporate: "corporate.mp3",
  motivational: "motivational.mp3",
  ambient: "ambient.mp3",
  upbeat: "upbeat.mp3",
};

const VIDEO_FPS = 24;
const X264_PRESET = "ultrafast";
const X264_CRF = "28";
const MAX_CAPTURED_OUTPUT_LINES = 500;

class TailLineBuffer {
  private readonly maxLines: number;
  private readonly lines: string[] = [];
  private partial = "";

  constructor(maxLines: number) {
    this.maxLines = maxLines;
  }

  append(chunk: Buffer | string) {
    const incoming = typeof chunk === "string" ? chunk : chunk.toString("utf8");
    if (!incoming) {
      return;
    }

    const normalized = incoming.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const combined = this.partial + normalized;
    const segments = combined.split("\n");
    this.partial = segments.pop() ?? "";

    for (const segment of segments) {
      this.lines.push(segment);
      if (this.lines.length > this.maxLines) {
        this.lines.shift();
      }
    }
  }

  toString() {
    const output = this.partial ? [...this.lines, this.partial] : [...this.lines];
    return output.join("\n").trim();
  }
}

type ProcessCapture = {
  stdout: string;
  stderr: string;
};

function buildProcessError(command: string, exitCode: number | null, stderrTail: string, stdoutTail: string) {
  const header = `${command} exited with code ${exitCode ?? "unknown"}`;
  const details = stderrTail || stdoutTail;
  return details ? `${header}\n${details}` : header;
}

async function runProcess(command: string, args: string[], cwd?: string, logFilePath?: string) {
  const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
  const stdoutTail = new TailLineBuffer(MAX_CAPTURED_OUTPUT_LINES);
  const stderrTail = new TailLineBuffer(MAX_CAPTURED_OUTPUT_LINES);
  const logStream = logFilePath ? createWriteStream(logFilePath, { flags: "a" }) : null;

  if (logStream) {
    logStream.write(`\n--- ${new Date().toISOString()} ${command} ${args.join(" ")} ---\n`);
  }

  child.stdout.on("data", (chunk) => {
    stdoutTail.append(chunk);
    if (logStream) {
      logStream.write(chunk);
    }
  });

  child.stderr.on("data", (chunk) => {
    stderrTail.append(chunk);
    if (logStream) {
      logStream.write(chunk);
    }
  });

  const outcome = await Promise.race([
    once(child, "exit").then(([code]) => ({ type: "exit" as const, code: code as number | null })),
    once(child, "error").then(([error]) => ({ type: "error" as const, error: error as Error })),
  ]);

  if (logStream) {
    const logOutcome = outcome.type === "exit" ? outcome.code ?? "unknown" : `error: ${outcome.error.message}`;
    logStream.write(`\n--- process result: ${logOutcome} ---\n`);
    await new Promise<void>((resolve) => {
      logStream.end(() => resolve());
    });
  }

  if (outcome.type === "error") {
    throw outcome.error;
  }

  return {
    exitCode: outcome.code,
    stdoutTail: stdoutTail.toString(),
    stderrTail: stderrTail.toString(),
  };
}

async function runCommand(command: string, args: string[], cwd?: string, logFilePath?: string) {
  const result = await runProcess(command, args, cwd, logFilePath);
  if (result.exitCode !== 0) {
    throw new Error(buildProcessError(command, result.exitCode, result.stderrTail, result.stdoutTail));
  }
}

async function runCommandWithOutput(command: string, args: string[], cwd?: string, logFilePath?: string) {
  const result = await runProcess(command, args, cwd, logFilePath);
  if (result.exitCode !== 0) {
    throw new Error(buildProcessError(command, result.exitCode, result.stderrTail, result.stdoutTail));
  }

  return {
    stdout: result.stdoutTail,
    stderr: result.stderrTail,
  } satisfies ProcessCapture;
}

function commandLogPath(workingDir: string, name: string, sceneIndex?: number) {
  const safe = name.replace(/[^a-z0-9-_]/gi, "-").toLowerCase();
  return join(workingDir, sceneIndex ? `${safe}-scene-${sceneIndex}.log` : `${safe}.log`);
}

async function runFfmpeg(workingDir: string, name: string, args: string[], sceneIndex?: number) {
  await runCommand("ffmpeg", args, undefined, commandLogPath(workingDir, name, sceneIndex));
}

async function runFfprobe(workingDir: string, name: string, args: string[]) {
  return runCommandWithOutput("ffprobe", args, undefined, commandLogPath(workingDir, name));
}

async function runFastProbe(command: string, args: string[]) {
  const result = await runProcess(command, args);
  if (result.exitCode !== 0) {
    throw new Error(buildProcessError(command, result.exitCode, result.stderrTail, result.stdoutTail));
  }

  return result;
}

async function hasBinary(command: string, versionArg = "-version") {
  try {
    await runFastProbe(command, [versionArg]);
    return true;
  } catch {
    return false;
  }
}

function parsePositiveNumber(value: string) {
  const firstLine = value.split(/\r?\n/).find((line) => line.trim().length > 0) ?? "";
  const parsed = Number.parseFloat(firstLine.trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

async function getProbeDurationSec(workingDir: string, sourcePath: string, logName: string) {
  try {
    const { stdout } = await runFfprobe(workingDir, logName, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      sourcePath,
    ]);

    return parsePositiveNumber(stdout);
  } catch {
    return null;
  }
}

function getResolution(aspectRatio: RenderOptions["aspectRatio"], quality: RenderOptions["quality"]) {
  if (aspectRatio === "9:16") {
    return quality === "1080p" ? { width: 1080, height: 1920 } : { width: 720, height: 1280 };
  }

  if (aspectRatio === "1:1") {
    return quality === "1080p" ? { width: 1080, height: 1080 } : { width: 720, height: 720 };
  }

  return quality === "1080p" ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
}

function getImageMotionFilter(scene: RenderScene, width: number, height: number, fps: number, duration: number) {
  const frameCount = Math.max(1, Math.round(duration * fps));

  if (scene.transition === "zoomout") {
    return `zoompan=z='if(lte(on,1),1.12,max(zoom-0.0015,1.0))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=${width}x${height}:fps=${fps},format=yuv420p`;
  }

  return `zoompan=z='min(zoom+0.0015,1.12)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=${width}x${height}:fps=${fps},format=yuv420p`;
}

function normalizeVoiceText(inputText: string) {
  return inputText
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\.\.\.+/g, ".")
    .replace(/[!?]{2,}/g, ".")
    .trim();
}

async function normalizeVoiceTrack(inputPath: string, outputPath: string) {
  try {
    const logPath = `${outputPath}.ffmpeg.log`;
    await runCommand("ffmpeg", [
      "-y",
      "-i",
      inputPath,
      "-af",
      "silenceremove=start_periods=1:start_silence=0.08:start_threshold=-46dB:stop_periods=-1:stop_duration=0.25:stop_threshold=-46dB,highpass=f=90,lowpass=f=7800,acompressor=threshold=-20dB:ratio=3.5:attack=5:release=100:makeup=4,loudnorm=I=-16:TP=-1.5:LRA=11",
      "-c:a",
      "libmp3lame",
      "-q:a",
      "2",
      outputPath,
    ], undefined, logPath);
    return outputPath;
  } catch {
    return inputPath;
  }
}

async function generateSilentVoiceTrack(outputPath: string, durationSec: number, workingDir: string, sceneIndex: number) {
  await runFfmpeg(workingDir, "scene-silent-voice", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    "anullsrc=r=44100:cl=stereo",
    "-t",
    String(Math.max(1, durationSec)),
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    outputPath,
  ], sceneIndex);
}

async function getAudioDurationSec(inputPath: string, workingDir: string, sceneIndex?: number) {
  const logName = sceneIndex ? `scene-duration-${sceneIndex}` : "audio-duration";
  return getProbeDurationSec(workingDir, inputPath, logName);
}

async function writeSubtitlesFile(filePath: string, scenes: RenderScene[], durationsSec?: number[]) {
  let t = 0;
  const chunks: string[] = [];

  const toSrtTime = (seconds: number) => {
    const totalMs = Math.max(0, Math.round(seconds * 1000));
    const hh = Math.floor(totalMs / 3600000)
      .toString()
      .padStart(2, "0");
    const mm = Math.floor((totalMs % 3600000) / 60000)
      .toString()
      .padStart(2, "0");
    const ss = Math.floor((totalMs % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    const mmm = (totalMs % 1000).toString().padStart(3, "0");
    return `${hh}:${mm}:${ss},${mmm}`;
  };

  scenes.forEach((scene, index) => {
    const start = t;
    const end = t + Math.max(1, durationsSec?.[index] ?? scene.duration);
    t = end;

    const line = scene.caption?.trim() || " ";
    chunks.push(`${index + 1}\n${toSrtTime(start)} --> ${toSrtTime(end)}\n${line}\n`);
  });

  await writeFile(filePath, chunks.join("\n"), "utf-8");
}

async function downloadIfUrl(input: string, outputPath: string) {
  if (input.startsWith("data:image/")) {
    const match = input.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid data URL image payload.");
    }

    const bytes = Buffer.from(match[1], "base64");
    await writeFile(outputPath, bytes);
    return outputPath;
  }

  if (input.startsWith("/media/image/")) {
    const relative = input.replace(/^\/media\/image\//, "");
    const segments = relative.split("/").filter(Boolean);
    if (segments.length > 0) {
      const { file } = await readImageByPublicPath(segments);
      await writeFile(outputPath, file);
      return outputPath;
    }
  }

  if (input.startsWith("/")) {
    const relative = input.replace(/^\/+/, "");
    if (!relative.includes("..")) {
      const publicPath = join(process.cwd(), "public", relative);
      try {
        const bytes = await readFile(publicPath);
        await writeFile(outputPath, bytes);
        return outputPath;
      } catch {
        // Continue and try URL-based loading path.
      }
    }
  }

  if (!/^https?:\/\//i.test(input)) {
    throw new Error("Unsupported scene image path. Use Browse Local Image, /media/image URL, data:image payload, or https URL.");
  }

  const response = await fetch(input);
  if (!response.ok) {
    throw new Error(`Failed to fetch scene image: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
  return outputPath;
}

async function exists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function resolveWritableMusicDir() {
  const candidates = [
    join(process.cwd(), "storage", "music"),
    join(tmpdir(), "aimedia-storage", "music"),
  ];

  for (const candidate of candidates) {
    try {
      await mkdir(candidate, { recursive: true });
      return candidate;
    } catch {
      // Try next candidate when current path is not writable.
    }
  }

  return null;
}

async function getMediaDurationSec(inputPath: string, workingDir: string) {
  return getProbeDurationSec(workingDir, inputPath, "media-duration");
}

function buildFallbackMusicSource(track: PresetMusicTrack) {
  if (track === "ambient") {
    return "anoisesrc=color=pink:amplitude=0.22";
  }

  if (track === "motivational") {
    return "sine=f=196:r=44100[a0];sine=f=293.66:r=44100,volume=0.35[a1];[a0][a1]amix=inputs=2";
  }

  if (track === "upbeat") {
    return "sine=f=220:r=44100[a0];sine=f=329.63:r=44100,volume=0.45[a1];[a0][a1]amix=inputs=2";
  }

  return "sine=f=164.81:r=44100";
}

async function ensureMusicTrackPath(
  track: PresetMusicTrack,
  workingDir: string,
  videoPath: string,
) {
  const musicDir = await resolveWritableMusicDir();
  const configuredPath = musicDir ? join(musicDir, musicTrackFiles[track]) : null;
  if (configuredPath && (await exists(configuredPath))) {
    return configuredPath;
  }

  const fallbackPath = join(workingDir, `${track}-fallback.mp3`);
  const duration = Math.max(8, Math.ceil((await getMediaDurationSec(videoPath, workingDir)) ?? 20));

  await runFfmpeg(workingDir, `music-${track}-fallback`, [
    "-y",
    "-f",
    "lavfi",
    "-i",
    buildFallbackMusicSource(track),
    "-t",
    String(duration),
    "-af",
    "highpass=f=80,lowpass=f=9000,volume=0.9",
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    fallbackPath,
  ]);

  return fallbackPath;
}

async function resolveUploadedMusicPath(uploadedMusicUrl: string, workingDir: string) {
  const input = uploadedMusicUrl.trim();
  if (!input) {
    throw new Error("Uploaded music URL is empty.");
  }

  const outputPath = join(workingDir, "uploaded-music.mp3");

  if (input.startsWith("/media/audio/")) {
    const relative = input.replace(/^\/media\/audio\//, "");
    const segments = relative.split("/").filter(Boolean);
    if (segments.length === 0) {
      throw new Error("Invalid uploaded music path.");
    }

    const { file } = await readAudioByPublicPath(segments);
    await writeFile(outputPath, file);
    return outputPath;
  }

  if (!/^https?:\/\//i.test(input)) {
    throw new Error("Uploaded music must be a /media/audio URL or https URL.");
  }

  const response = await fetch(input);
  if (!response.ok) {
    throw new Error(`Failed to fetch uploaded music: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(outputPath, bytes);
  return outputPath;
}

function buildPerSceneMusicExpr(scenes: RenderScene[], effectiveSceneDurations: number[]) {
  if (scenes.length === 0) {
    return "1";
  }

  let cursor = 0;
  const segments = scenes.map((scene, index) => {
    const duration = Math.max(1, effectiveSceneDurations[index] ?? scene.duration ?? 1);
    const start = Number(cursor.toFixed(3));
    const end = Number((cursor + duration).toFixed(3));
    cursor += duration;
    const gain = Math.max(0, (scene.musicVolume ?? 100) / 100);
    return { start, end, gain };
  });

  let expr = `${segments[segments.length - 1].gain}`;
  for (let i = segments.length - 2; i >= 0; i -= 1) {
    const segment = segments[i];
    expr = `if(between(t,${segment.start},${segment.end}),${segment.gain},${expr})`;
  }

  return expr;
}

export function escapeFfmpegFilterPath(inputPath: string) {
  return inputPath
    .replace(/\\/g, "/")
    .replace(/:/g, "\\:")
    .replace(/'/g, "\\'")
    .replace(/,/g, "\\,");
}

export async function renderVideo(options: RenderOptions) {
  const hasFfmpeg = await hasBinary("ffmpeg");

  if (!hasFfmpeg) {
    throw new Error("FFmpeg is not installed on the server.");
  }

  if (options.scenes.length === 0) {
    throw new Error("At least one scene is required.");
  }

  const workingDir = await mkdtemp(join(tmpdir(), "aimedia-video-"));

  try {
    const { width, height } = getResolution(options.aspectRatio, options.quality);
    const provider = VoiceProviderFactory.resolve();

    const sceneVideos: string[] = [];
    const effectiveSceneDurations: number[] = [];
    for (let i = 0; i < options.scenes.length; i += 1) {
      const scene = options.scenes[i];
      const sceneIndex = i + 1;

      const voicePath = join(workingDir, `scene-${sceneIndex}.mp3`);
      const imagePath = join(workingDir, `scene-${sceneIndex}.img`);
      const videoPath = join(workingDir, `scene-${sceneIndex}.mp4`);

      const rawVoiceText = scene.voiceover?.trim() || scene.caption?.trim() || `Scene ${sceneIndex}`;
      const voiceText = normalizeVoiceText(rawVoiceText);
      const fallbackVoiceDuration = Math.max(1, voiceText.length / Math.max(0.5, options.speed) / 14);

      try {
        const voiceMp3 = await provider.generateSpeechMp3(voiceText, options.voice, options.speed);
        await writeFile(voicePath, voiceMp3);
      } catch {
        // Continue rendering with silent narration timing when TTS is unavailable (e.g. billing issues).
        await generateSilentVoiceTrack(voicePath, fallbackVoiceDuration, workingDir, sceneIndex);
      }

      const normalizedVoicePath = await normalizeVoiceTrack(voicePath, join(workingDir, `scene-${sceneIndex}.clean.mp3`));
      const measuredVoiceSec = await getAudioDurationSec(normalizedVoicePath, workingDir, sceneIndex);
      const estimatedVoiceSec = Math.max(1, voiceText.length / 14);

      const leadInSec = Math.max(0, options.speechLeadInSec ?? 0);
      const tailSec = Math.max(0, options.speechTailSec ?? 0);
      const voiceSec = measuredVoiceSec ?? estimatedVoiceSec;
      const duration = Math.max(1, Math.ceil(Math.max(scene.duration || 6, leadInSec + voiceSec + tailSec)));
      effectiveSceneDurations.push(duration);
      const leadInMs = Math.round(leadInSec * 1000);

      const hasSceneImage = Boolean(scene.image?.trim());
      const localImagePath = hasSceneImage
        ? await downloadIfUrl(scene.image || "", imagePath).catch((error) => {
            const message = error instanceof Error ? error.message : "Unknown image loading error.";
            throw new Error(`Scene ${sceneIndex} image could not be loaded: ${message}`);
          })
        : "";
      const fadeDuration = Math.min(0.35, Math.max(0, duration - 0.15));
      const shouldFade = scene.transition !== "cut";
      const fps = VIDEO_FPS;
      const imageMotionFilter = getImageMotionFilter(scene, width, height, fps, duration);
      const sceneVideoFilter = shouldFade
        ? `${imageMotionFilter},fade=t=in:st=0:d=${fadeDuration},fade=t=out:st=${Math.max(0, duration - fadeDuration)}:d=${fadeDuration}`
        : imageMotionFilter;
      const sceneAudioFilter = `${leadInMs > 0 ? `adelay=${leadInMs}|${leadInMs},` : ""}apad,atrim=0:${duration}`;
      const sceneVoiceGain = Math.max(0, (scene.voiceVolume ?? 100) / 100);
      const sceneAudioFilterWithVolume = `volume=${sceneVoiceGain},${sceneAudioFilter}`;

      if (localImagePath) {
        await runFfmpeg(workingDir, "scene-video-image", [
          "-y",
          "-loop",
          "1",
          "-framerate",
          String(fps),
          "-i",
          localImagePath,
          "-i",
          normalizedVoicePath,
          "-vf",
          sceneVideoFilter,
          "-af",
          sceneAudioFilterWithVolume,
          "-t",
          String(duration),
          "-c:v",
          "libx264",
          "-preset",
          X264_PRESET,
          "-crf",
          X264_CRF,
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          videoPath,
        ], sceneIndex);
      } else {
        await runFfmpeg(workingDir, "scene-video-color", [
          "-y",
          "-f",
          "lavfi",
          "-i",
          `color=c=black:s=${width}x${height}:d=${duration}`,
          "-i",
          normalizedVoicePath,
          "-vf",
          shouldFade
            ? `fade=t=in:st=0:d=${fadeDuration},fade=t=out:st=${Math.max(0, duration - fadeDuration)}:d=${fadeDuration},format=yuv420p`
            : "format=yuv420p",
          "-af",
          sceneAudioFilterWithVolume,
          "-r",
          String(fps),
          "-c:v",
          "libx264",
          "-preset",
          X264_PRESET,
          "-crf",
          X264_CRF,
          "-pix_fmt",
          "yuv420p",
          "-c:a",
          "aac",
          videoPath,
        ], sceneIndex);
      }

      sceneVideos.push(videoPath);
    }

    const joinedPath = join(workingDir, "joined.mp4");
    const concatArgs = sceneVideos.flatMap((file) => ["-i", file]);
    const concatInputs = sceneVideos.map((_, index) => `[${index}:v][${index}:a]`).join("");
    const concatFilter = `${concatInputs}concat=n=${sceneVideos.length}:v=1:a=1[vout][aout]`;

    await runFfmpeg(workingDir, "concat-scenes", [
      "-y",
      ...concatArgs,
      "-filter_complex",
      concatFilter,
      "-map",
      "[vout]",
      "-map",
      "[aout]",
      "-c:v",
      "libx264",
      "-preset",
      X264_PRESET,
      "-crf",
      X264_CRF,
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      joinedPath,
    ]);

    let currentPath = joinedPath;
    if (options.includeSubtitles) {
      const subtitlePath = join(workingDir, "output.srt");
      await writeSubtitlesFile(subtitlePath, options.scenes, effectiveSceneDurations);
      const subtitledPath = join(workingDir, "subtitled.mp4");
      const escapedSubtitlePath = escapeFfmpegFilterPath(subtitlePath);
      await runFfmpeg(workingDir, "burn-subtitles", [
        "-y",
        "-i",
        currentPath,
        "-vf",
        `subtitles='${escapedSubtitlePath}'`,
        "-c:v",
        "libx264",
        "-preset",
        X264_PRESET,
        "-crf",
        X264_CRF,
        "-c:a",
        "copy",
        subtitledPath,
      ]);
      currentPath = subtitledPath;
    }

    if (options.musicTrack !== "none") {
      let musicPath: string;
      if (options.musicTrack === "uploaded") {
        try {
          musicPath = await resolveUploadedMusicPath(options.uploadedMusicUrl ?? "", workingDir);
        } catch {
          // If uploaded file is missing, keep final build reliable with a preset fallback track.
          musicPath = await ensureMusicTrackPath("corporate", workingDir, currentPath);
        }
      } else {
        musicPath = await ensureMusicTrackPath(options.musicTrack, workingDir, currentPath);
      }
      const mixedPath = join(workingDir, "mixed.mp4");
      const musicGain = Math.max(0, options.musicVolume / 100);
      const voiceGain = Math.max(0, options.voiceVolume / 100);
      const perSceneMusicExpr = buildPerSceneMusicExpr(options.scenes, effectiveSceneDurations);
      const mixWithPerSceneFilter = [
        "-y",
        "-stream_loop",
        "-1",
        "-i",
        musicPath,
        "-i",
        currentPath,
        "-filter_complex",
        `[0:a]volume='(${musicGain})*(${perSceneMusicExpr})':eval=frame[m];[1:a]volume=${voiceGain}:eval=frame[v];[m][v]amix=inputs=2:duration=shortest:dropout_transition=2:normalize=0,alimiter=limit=0.97[aout]`,
        "-map",
        "1:v:0",
        "-map",
        "[aout]",
        "-c:v",
        "copy",
        "-c:a",
        "aac",
        "-shortest",
        mixedPath,
      ];

      try {
        await runFfmpeg(workingDir, "mix-music-per-scene", mixWithPerSceneFilter);
      } catch {
        // Fallback for ffmpeg builds that cannot parse complex expression-based volume filters.
        await runFfmpeg(workingDir, "mix-music-fallback", [
          "-y",
          "-stream_loop",
          "-1",
          "-i",
          musicPath,
          "-i",
          currentPath,
          "-filter_complex",
          `[0:a]volume=${musicGain}[m];[1:a]volume=${voiceGain}[v];[m][v]amix=inputs=2:duration=shortest:dropout_transition=2:normalize=0,alimiter=limit=0.97[aout]`,
          "-map",
          "1:v:0",
          "-map",
          "[aout]",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "-shortest",
          mixedPath,
        ]);
      }
      currentPath = mixedPath;
    }

    const { urlPath } = await saveVideoFileFromPath(currentPath);

    return {
      outputUrl: urlPath,
      sceneCount: options.scenes.length,
      totalDurationSec: effectiveSceneDurations.reduce((sum, item) => sum + Math.max(1, item), 0),
    };
  } finally {
    await rm(workingDir, { recursive: true, force: true });
  }
}
