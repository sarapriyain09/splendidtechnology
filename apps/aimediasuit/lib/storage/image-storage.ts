import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, normalize, sep } from "node:path";

const configuredStorageRoot = process.env.STORAGE_ROOT;
const processStorageRoot = join(process.cwd(), "storage");
const standaloneStorageRoot = process.cwd().includes(`${sep}.next${sep}standalone`)
  ? join(process.cwd(), "..", "..", "storage")
  : null;
const fallbackStorageRoot = join(tmpdir(), "aimedia-storage");

function getStorageRootCandidates() {
  return [configuredStorageRoot, standaloneStorageRoot, processStorageRoot, fallbackStorageRoot].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
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

function sanitizeExtension(extension: string) {
  const raw = extension.trim().toLowerCase().replace(/^\./, "");
  if (raw === "jpg") {
    return "jpeg";
  }

  const allowed = new Set(["png", "jpeg", "webp", "gif"]);
  return allowed.has(raw) ? raw : "png";
}

export async function saveImageFile(content: Buffer, extension = "png", now = new Date()) {
  const storageRoot = await resolveStorageRoot();
  const { yyyy, mm, dd } = getDatePath(now);
  const relativeFolder = join("image", yyyy, mm, dd);
  const absoluteFolder = join(storageRoot, relativeFolder);
  await mkdir(absoluteFolder, { recursive: true });

  const ext = sanitizeExtension(extension);
  const filename = `${crypto.randomUUID()}.${ext}`;
  const absolutePath = join(absoluteFolder, filename);
  await writeFile(absolutePath, content);

  const urlPath = `/media/image/${yyyy}/${mm}/${dd}/${filename}`;
  return { absolutePath, urlPath, extension: ext };
}

export async function readImageByPublicPath(pathSegments: string[]) {
  if (pathSegments.some((segment) => segment.includes(".."))) {
    throw new Error("Invalid file path");
  }

  const safePath = normalize(pathSegments.join(sep));
  const roots = getStorageRootCandidates();

  for (const storageRoot of roots) {
    const absolutePath = join(storageRoot, "image", safePath);
    try {
      const file = await readFile(absolutePath);
      const details = await stat(absolutePath);
      return { file, size: details.size, absolutePath };
    } catch {
      // Try next storage root.
    }
  }

  throw new Error(`Image file not found for path: ${safePath}`);
}

export async function deleteImageByPublicUrl(outputUrl: string) {
  const storageRoot = await resolveStorageRoot();
  const parsed = outputUrl.replace(/^https?:\/\/[^/]+/i, "");
  if (!parsed.startsWith("/media/image/")) {
    return;
  }

  const relative = parsed.replace("/media/image/", "");
  if (relative.includes("..")) {
    return;
  }

  const absolutePath = join(storageRoot, "image", normalize(relative));
  await rm(absolutePath, { force: true });
}
