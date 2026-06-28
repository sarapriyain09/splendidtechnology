import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, normalize, sep } from "node:path";

const configuredStorageRoot = process.env.STORAGE_ROOT;
const processStorageRoot = join(process.cwd(), "storage");
const standaloneStorageFromAppRoot = join(process.cwd(), ".next", "standalone", "storage");
const standaloneStorageRoot = process.cwd().includes(`${sep}.next${sep}standalone`)
  ? join(process.cwd(), "..", "..", "storage")
  : null;
const fallbackStorageRoot = join(tmpdir(), "aimedia-storage");

function getStorageRootCandidates() {
  const values = [
    configuredStorageRoot,
    processStorageRoot,
    standaloneStorageFromAppRoot,
    standaloneStorageRoot,
    fallbackStorageRoot,
  ].filter((value): value is string => typeof value === "string" && value.length > 0);

  return [...new Set(values)];
}

async function resolveStorageRoot() {
  const candidates = getStorageRootCandidates();

  for (const candidate of candidates) {
    try {
      await mkdir(candidate, { recursive: true });
      return candidate;
    } catch {
      // Try next candidate when current root is not writable.
    }
  }

  throw new Error("No writable storage root available.");
}

function getDatePath(date: Date) {
  const yyyy = date.getUTCFullYear().toString();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return { yyyy, mm, dd };
}

export async function saveVideoFile(content: Buffer, now = new Date(), extension: "mp4" | "webm" = "mp4") {
  const { yyyy, mm, dd } = getDatePath(now);
  const filename = `${crypto.randomUUID()}.${extension}`;
  const relativeFolder = join("video", yyyy, mm, dd);
  const relativeFilePath = join(relativeFolder, filename);
  const roots = getStorageRootCandidates();
  const writtenPaths: string[] = [];

  for (const root of roots) {
    try {
      const absoluteFolder = join(root, relativeFolder);
      await mkdir(absoluteFolder, { recursive: true });
      const absolutePath = join(absoluteFolder, filename);
      await writeFile(absolutePath, content);
      writtenPaths.push(absolutePath);
    } catch {
      // Continue writing to the next storage root.
    }
  }

  if (writtenPaths.length === 0) {
    throw new Error("No writable storage root available.");
  }

  const urlPath = `/media/video/${yyyy}/${mm}/${dd}/${filename}`;
  return { absolutePath: writtenPaths[0], urlPath, relativeFilePath };
}

export async function saveVideoFileFromPath(sourcePath: string, now = new Date(), extension: "mp4" | "webm" = "mp4") {
  const { yyyy, mm, dd } = getDatePath(now);
  const filename = `${crypto.randomUUID()}.${extension}`;
  const relativeFolder = join("video", yyyy, mm, dd);
  const roots = getStorageRootCandidates();
  const copiedPaths: string[] = [];

  for (const root of roots) {
    try {
      const absoluteFolder = join(root, relativeFolder);
      await mkdir(absoluteFolder, { recursive: true });
      const absolutePath = join(absoluteFolder, filename);
      await copyFile(sourcePath, absolutePath);
      copiedPaths.push(absolutePath);
    } catch {
      // Continue writing to the next storage root.
    }
  }

  if (copiedPaths.length === 0) {
    throw new Error("No writable storage root available.");
  }

  const urlPath = `/media/video/${yyyy}/${mm}/${dd}/${filename}`;
  return { absolutePath: copiedPaths[0], urlPath };
}

export async function readVideoByPublicPath(pathSegments: string[]) {
  if (pathSegments.some((segment) => segment.includes(".."))) {
    throw new Error("Invalid file path");
  }

  const safePath = normalize(pathSegments.join(sep));
  const roots = getStorageRootCandidates();

  for (const storageRoot of roots) {
    const absolutePath = join(storageRoot, "video", safePath);
    try {
      const file = await readFile(absolutePath);
      const details = await stat(absolutePath);
      return { file, size: details.size };
    } catch {
      // Try next storage root.
    }
  }

  throw new Error(`Video file not found for path: ${safePath}`);
}

export async function deleteVideoByPublicUrl(outputUrl: string) {
  const parsed = outputUrl.replace(/^https?:\/\/[^/]+/i, "");
  if (!parsed.startsWith("/media/video/")) {
    return;
  }

  const relative = parsed.replace("/media/video/", "");
  if (relative.includes("..")) {
    return;
  }

  const roots = getStorageRootCandidates();
  await Promise.all(
    roots.map(async (storageRoot) => {
      const absolutePath = join(storageRoot, "video", normalize(relative));
      await rm(absolutePath, { force: true });
    }),
  );
}
