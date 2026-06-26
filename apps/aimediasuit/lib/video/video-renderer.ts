import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { VoiceProviderFactory } from "@/lib/providers/voice-provider-factory";
import { readImageByPublicPath } from "@/lib/storage/image-storage";
import { saveVideoFile } from "@/lib/storage/video-storage";
import type { VoiceType } from "@/types/media";

export type RenderScene = {
  sceneNumber: number;
  duration: number;
  caption: string;
  voiceover: string;
  image: string;
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
  musicTrack: "none" | "corporate" | "motivational" | "ambient" | "upbeat";
  voiceVolume: number;
  musicVolume: number;
};

const musicTrackFiles: Record<Exclude<RenderOptions["musicTrack"], "none">, string> = {
  corporate: "corporate.mp3",
  motivational: "motivational.mp3",
  ambient: "ambient.mp3",
  upbeat: "upbeat.mp3",
};

const VIDEO_FPS = 24;
const X264_PRESET = "ultrafast";
const X264_CRF = "28";

function runCommand(command: string, args: string[], cwd?: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
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

function runCommandWithOutput(command: string, args: string[], cwd?: string) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr || `${command} exited with code ${code}`));
      }
    });
  });
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

function mapTransitionToXfade(transition: RenderScene["transition"]) {
  if (transition === "slideleft") return "slideleft";
  if (transition === "slideright") return "slideright";
  if (transition === "flash") return "fadeblack";
  return "fade";
}

function getTransitionDuration(transition: RenderScene["transition"]) {
  if (transition === "cut") return 0;
  if (transition === "flash") return 0.2;
  return 0.4;
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
    ]);
    return outputPath;
  } catch {
    return inputPath;
  }
}

async function generateSilentVoiceTrack(outputPath: string, durationSec: number) {
  await runCommand("ffmpeg", [
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
  ]);
}

async function getAudioDurationSec(inputPath: string) {
  try {
    const { stdout } = await runCommandWithOutput("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);

    const value = Number.parseFloat(stdout.trim());
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
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

  if (!/^https?:\/\//i.test(input)) {
    return input;
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

async function getMediaDurationSec(inputPath: string) {
  try {
    const { stdout } = await runCommandWithOutput("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);

    const value = Number.parseFloat(stdout.trim());
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

function buildFallbackMusicSource(track: Exclude<RenderOptions["musicTrack"], "none">) {
  if (track === "ambient") {
    return "anoisesrc=color=pink:amplitude=0.05";
  }

  if (track === "motivational") {
    return "sine=f=196:r=44100,asplit=2[a][b];[a]tremolo=f=5:d=0.6[a1];[b]sine=f=293.66:r=44100,volume=0.35[b1];[a1][b1]amix=inputs=2";
  }

  if (track === "upbeat") {
    return "sine=f=220:r=44100,asplit=2[a][b];[a]tremolo=f=8:d=0.65[a1];[b]sine=f=329.63:r=44100,volume=0.45[b1];[a1][b1]amix=inputs=2";
  }

  return "sine=f=164.81:r=44100";
}

async function ensureMusicTrackPath(
  track: Exclude<RenderOptions["musicTrack"], "none">,
  workingDir: string,
  videoPath: string,
) {
  const musicDir = await resolveWritableMusicDir();
  const configuredPath = musicDir ? join(musicDir, musicTrackFiles[track]) : null;
  if (configuredPath && (await exists(configuredPath))) {
    return configuredPath;
  }

  const fallbackPath = join(workingDir, `${track}-fallback.mp3`);
  const duration = Math.max(8, Math.ceil((await getMediaDurationSec(videoPath)) ?? 20));

  await runCommand("ffmpeg", [
    "-y",
    "-f",
    "lavfi",
    "-i",
    buildFallbackMusicSource(track),
    "-t",
    String(duration),
    "-af",
    "highpass=f=80,lowpass=f=7000,volume=0.28",
    "-c:a",
    "libmp3lame",
    "-q:a",
    "4",
    fallbackPath,
  ]);

  return fallbackPath;
}

export async function renderVideo(options: RenderOptions) {
  const hasFfmpeg = await runCommand("ffmpeg", ["-version"]).then(
    () => true,
    () => false,
  );

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
        await generateSilentVoiceTrack(voicePath, fallbackVoiceDuration);
      }

      const normalizedVoicePath = await normalizeVoiceTrack(voicePath, join(workingDir, `scene-${sceneIndex}.clean.mp3`));
      const measuredVoiceSec = await getAudioDurationSec(normalizedVoicePath);
      const estimatedVoiceSec = Math.max(1, voiceText.length / 14);

      const leadInSec = Math.max(0, options.speechLeadInSec ?? 0);
      const tailSec = Math.max(0, options.speechTailSec ?? 0);
      const voiceSec = measuredVoiceSec ?? estimatedVoiceSec;
      const duration = Math.max(1, Math.ceil(Math.max(scene.duration || 6, leadInSec + voiceSec + tailSec)));
      effectiveSceneDurations.push(duration);
      const leadInMs = Math.round(leadInSec * 1000);

      const localImagePath = await downloadIfUrl(scene.image || "", imagePath).catch(() => "");
      const fadeDuration = Math.min(0.35, Math.max(0, duration - 0.15));
      const shouldFade = scene.transition !== "cut";
      const fps = VIDEO_FPS;
      const imageMotionFilter = getImageMotionFilter(scene, width, height, fps, duration);
      const sceneVideoFilter = shouldFade
        ? `${imageMotionFilter},fade=t=in:st=0:d=${fadeDuration},fade=t=out:st=${Math.max(0, duration - fadeDuration)}:d=${fadeDuration}`
        : imageMotionFilter;
      const sceneAudioFilter = `${leadInMs > 0 ? `adelay=${leadInMs}|${leadInMs},` : ""}apad,atrim=0:${duration}`;

      if (localImagePath) {
        await runCommand("ffmpeg", [
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
          sceneAudioFilter,
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
        ]);
      } else {
        await runCommand("ffmpeg", [
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
          sceneAudioFilter,
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
        ]);
      }

      sceneVideos.push(videoPath);
    }

    const hasRichTransitions = sceneVideos.length > 1 && options.scenes.some((scene) => scene.transition !== "cut");
    const joinedPath = join(workingDir, "joined.mp4");

    if (!hasRichTransitions) {
      const concatPath = join(workingDir, "concat.txt");
      const concatContents = sceneVideos.map((file) => `file '${file.replace(/'/g, "'\\''")}'`).join("\n");
      await writeFile(concatPath, concatContents, "utf-8");

      await runCommand("ffmpeg", [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatPath,
        "-c",
        "copy",
        joinedPath,
      ]);
    } else {
      const transitionArgs = sceneVideos.flatMap((file) => ["-i", file]);
      const videoOps: string[] = [];
      const audioOps: string[] = [];

      let currentVideoLabel = "[0:v]";
      let currentAudioLabel = "[0:a]";
      let timeline = Math.max(1, effectiveSceneDurations[0] ?? options.scenes[0]?.duration ?? 1);

      for (let i = 1; i < sceneVideos.length; i += 1) {
        const nextVideoLabel = `[${i}:v]`;
        const nextAudioLabel = `[${i}:a]`;
        const outVideoLabel = `[v${i}]`;
        const outAudioLabel = `[a${i}]`;
        const transition = options.scenes[i]?.transition ?? "crossfade";
        const duration = Math.max(0, getTransitionDuration(transition));

        if (duration <= 0 || transition === "cut") {
          videoOps.push(`${currentVideoLabel}${nextVideoLabel}concat=n=2:v=1:a=0${outVideoLabel}`);
          audioOps.push(`${currentAudioLabel}${nextAudioLabel}concat=n=2:v=0:a=1${outAudioLabel}`);
          timeline += Math.max(1, effectiveSceneDurations[i] ?? options.scenes[i]?.duration ?? 1);
        } else {
          const xfadeType = mapTransitionToXfade(transition);
          const offset = Math.max(0, timeline - duration);
          videoOps.push(
            `${currentVideoLabel}${nextVideoLabel}xfade=transition=${xfadeType}:duration=${duration}:offset=${offset}${outVideoLabel}`,
          );
          audioOps.push(`${currentAudioLabel}${nextAudioLabel}acrossfade=d=${duration}:c1=tri:c2=tri${outAudioLabel}`);
          timeline += Math.max(1, effectiveSceneDurations[i] ?? options.scenes[i]?.duration ?? 1) - duration;
        }

        currentVideoLabel = outVideoLabel;
        currentAudioLabel = outAudioLabel;
      }

      const filterComplex = [...videoOps, ...audioOps].join(";");
      await runCommand("ffmpeg", [
        "-y",
        ...transitionArgs,
        "-filter_complex",
        filterComplex,
        "-map",
        currentVideoLabel,
        "-map",
        currentAudioLabel,
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
    }

    let currentPath = joinedPath;
    if (options.includeSubtitles) {
      const subtitlePath = join(workingDir, "output.srt");
      await writeSubtitlesFile(subtitlePath, options.scenes, effectiveSceneDurations);
      const subtitledPath = join(workingDir, "subtitled.mp4");
      await runCommand("ffmpeg", [
        "-y",
        "-i",
        currentPath,
        "-vf",
        `subtitles=${subtitlePath}`,
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
      const musicPath = await ensureMusicTrackPath(options.musicTrack, workingDir, currentPath);
      const mixedPath = join(workingDir, "mixed.mp4");
      await runCommand("ffmpeg", [
        "-y",
        "-stream_loop",
        "-1",
        "-i",
        musicPath,
        "-i",
        currentPath,
        "-filter_complex",
        `[0:a]volume=${Math.max(0, options.musicVolume / 100)}[m];[1:a]volume=${Math.max(0, options.voiceVolume / 100)}[v];[m][v]amix=inputs=2:duration=shortest:dropout_transition=2[aout]`,
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
      currentPath = mixedPath;
    }

    const finalBuffer = await readFile(currentPath);
    const { urlPath } = await saveVideoFile(finalBuffer);

    return {
      outputUrl: urlPath,
      sceneCount: options.scenes.length,
      totalDurationSec: effectiveSceneDurations.reduce((sum, item) => sum + Math.max(1, item), 0),
    };
  } finally {
    await rm(workingDir, { recursive: true, force: true });
  }
}
