import { spawn } from "node:child_process";

function runCommandWithStdout(command: string, args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
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
        resolve(stdout);
      } else {
        reject(new Error(stderr || `${command} exited with code ${code}`));
      }
    });
  });
}

export async function inspectVideo(buffer: Buffer, extension: "mp4" | "webm" = "mp4") {
  const { mkdtemp, writeFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-video-"));
  const target = join(workDir, `${randomUUID()}.${extension}`);

  try {
    await writeFile(target, buffer);
    const raw = await runCommandWithStdout("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "stream=width,height,r_frame_rate:format=duration",
      "-of",
      "json",
      target,
    ]);

    const parsed = JSON.parse(raw) as {
      streams?: Array<{ width?: number; height?: number; r_frame_rate?: string }>;
      format?: { duration?: string };
    };

    const stream = parsed.streams?.[0] ?? {};
    const fpsRaw = stream.r_frame_rate ?? "0/1";
    const [num, den] = fpsRaw.split("/").map((value) => Number(value));
    const fps = den ? num / den : 0;
    const duration = Number(parsed.format?.duration ?? "0");

    return {
      durationSec: Number.isFinite(duration) ? duration : 0,
      width: stream.width ?? 0,
      height: stream.height ?? 0,
      fps: Number.isFinite(fps) ? fps : 0,
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function extractAudioFromVideoToMp3(videoBytes: Buffer, extension: "mp4" | "webm") {
  const { mkdtemp, writeFile, readFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-extract-"));
  const input = join(workDir, `${randomUUID()}.${extension}`);
  const output = join(workDir, `${randomUUID()}.mp3`);

  try {
    await writeFile(input, videoBytes);
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(
        "ffmpeg",
        ["-y", "-i", input, "-vn", "-acodec", "libmp3lame", "-q:a", "2", output],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      let stderr = "";
      ffmpeg.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      ffmpeg.on("error", reject);
      ffmpeg.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(stderr || `ffmpeg exited with code ${code}`));
        }
      });
    });

    return await readFile(output);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function extractFramesFromVideo(
  videoBytes: Buffer,
  extension: "mp4" | "webm",
  targetFrames = 20,
  durationSec?: number,
) {
  const { mkdtemp, writeFile, rm, readdir, readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-frames-"));
  const input = join(workDir, `${randomUUID()}.${extension}`);
  const outputPattern = join(workDir, "frame-%03d.jpg");

  try {
    await writeFile(input, videoBytes);

    const duration = Number.isFinite(durationSec ?? Number.NaN) && (durationSec ?? 0) > 0 ? (durationSec as number) : 60;
    const fpsValue = Math.max(0.05, Math.min(4, targetFrames / duration));

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn(
        "ffmpeg",
        [
          "-y",
          "-i",
          input,
          "-vf",
          `fps=${fpsValue.toFixed(4)}`,
          "-frames:v",
          String(targetFrames),
          outputPattern,
        ],
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      let stderr = "";
      ffmpeg.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      ffmpeg.on("error", reject);
      ffmpeg.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(stderr || `ffmpeg exited with code ${code}`));
        }
      });
    });

    const files = (await readdir(workDir))
      .filter((name) => name.startsWith("frame-") && name.endsWith(".jpg"))
      .sort();

    const frames = await Promise.all(files.map((name) => readFile(join(workDir, name))));
    return frames;
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function inspectImage(buffer: Buffer, extension: "png" | "jpeg") {
  const { mkdtemp, writeFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-image-"));
  const target = join(workDir, `${randomUUID()}.${extension === "jpeg" ? "jpg" : "png"}`);

  try {
    await writeFile(target, buffer);
    const raw = await runCommandWithStdout("ffprobe", [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,pix_fmt",
      "-of",
      "json",
      target,
    ]);

    const parsed = JSON.parse(raw) as {
      streams?: Array<{ width?: number; height?: number; pix_fmt?: string }>;
    };

    const stream = parsed.streams?.[0];
    const width = stream?.width ?? 0;
    const height = stream?.height ?? 0;

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      throw new Error("Image file is not decodable.");
    }

    return {
      width,
      height,
      pixelFormat: stream?.pix_fmt ?? "unknown",
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function inspectAudioDuration(buffer: Buffer, extension: "mp3" | "wav") {
  const { mkdtemp, writeFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-audio-"));
  const target = join(workDir, `${randomUUID()}.${extension}`);

  try {
    await writeFile(target, buffer);
    const output = await runCommandWithStdout("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      target,
    ]);

    const duration = Number(output.trim());
    return Number.isFinite(duration) ? duration : 0;
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}

export async function convertWavToMp3(wavBytes: Buffer) {
  const { mkdtemp, writeFile, readFile, rm } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const { tmpdir } = await import("node:os");
  const { randomUUID } = await import("node:crypto");

  const workDir = await mkdtemp(join(tmpdir(), "aimedia-clone-convert-"));
  const input = join(workDir, `${randomUUID()}.wav`);
  const output = join(workDir, `${randomUUID()}.mp3`);

  try {
    await writeFile(input, wavBytes);
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", ["-y", "-i", input, "-acodec", "libmp3lame", "-q:a", "2", output], {
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stderr = "";
      ffmpeg.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
      ffmpeg.on("error", reject);
      ffmpeg.on("exit", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(stderr || `ffmpeg exited with code ${code}`));
        }
      });
    });

    return await readFile(output);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
