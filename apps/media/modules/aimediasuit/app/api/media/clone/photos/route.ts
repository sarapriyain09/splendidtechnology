import { CloneStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { resolveUserId } from "@/lib/auth/user-id";
import { inspectImage } from "@/lib/clone/media-inspector";
import { buildPhotosFolderField, toAvatarCloneItem } from "@/lib/clone/metadata";
import { prisma } from "@/lib/db/prisma";
import { saveImageFile } from "@/lib/storage/image-storage";

export const runtime = "nodejs";

const MAX_FILES = 50;
const MIN_FILES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 8192;

function getImageExtension(file: File) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (type === "image/png" || name.endsWith(".png")) return "png";
  if (type === "image/jpeg" || name.endsWith(".jpg") || name.endsWith(".jpeg")) return "jpeg";
  return null;
}

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 400 });
  }

  const userId = await resolveUserId(request);

  try {
    const formData = await request.formData();
    const cloneNameRaw = String(formData.get("cloneName") ?? "").trim();
    const languageRaw = String(formData.get("language") ?? "english").trim();
    const files = formData.getAll("files").filter((item): item is File => item instanceof File);

    if (files.length < MIN_FILES || files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Upload between ${MIN_FILES} and ${MAX_FILES} photos.` },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const extension = getImageExtension(file);
      if (!extension) {
        return NextResponse.json({ error: "Only JPG and PNG photos are supported." }, { status: 400 });
      }

      if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Each photo must be between 1 byte and 10 MB." }, { status: 400 });
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const metadata = await inspectImage(bytes, extension).catch((error) => {
        const message = error instanceof Error ? error.message : "Invalid image payload.";
        throw new Error(`Invalid image '${file.name}': ${message}`);
      });

      if (metadata.width > MAX_IMAGE_DIMENSION || metadata.height > MAX_IMAGE_DIMENSION) {
        return NextResponse.json(
          { error: `Photo '${file.name}' exceeds ${MAX_IMAGE_DIMENSION}px maximum dimension.` },
          { status: 400 },
        );
      }

      const saved = await saveImageFile(bytes, extension);
      uploadedUrls.push(saved.urlPath);
    }

    const now = new Date();
    const displayName = cloneNameRaw || `Clone ${now.toISOString().slice(0, 10)}`;

    const created = await prisma.avatarClone.create({
      data: {
        userId,
        name: displayName,
        status: CloneStatus.UPLOADING,
        photoFolder: buildPhotosFolderField(uploadedUrls),
        previewImage: uploadedUrls[0] ?? null,
        language: languageRaw || "english",
      },
    });

    return NextResponse.json({
      clone: toAvatarCloneItem(created),
      validation: {
        minPhotos: MIN_FILES,
        maxPhotos: MAX_FILES,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload photos.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
