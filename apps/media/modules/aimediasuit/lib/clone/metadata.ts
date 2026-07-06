import type { AvatarClone, CloneProject, Prisma, VoiceClone } from "@prisma/client";
import type { AvatarCloneItem, CloneProjectItem, VoiceCloneItem } from "@/types/media";

export function parseStringArrayField(value: string | null | undefined) {
  if (!value) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value) as { photos?: string[]; files?: string[]; audio?: string[] };
    if (Array.isArray(parsed.photos)) {
      return parsed.photos.filter((item) => typeof item === "string");
    }

    if (Array.isArray(parsed.files)) {
      return parsed.files.filter((item) => typeof item === "string");
    }

    if (Array.isArray(parsed.audio)) {
      return parsed.audio.filter((item) => typeof item === "string");
    }
  } catch {
    // Fallback to legacy single-path mode.
  }

  return value ? [value] : [];
}

export function buildPhotosFolderField(photoUrls: string[]) {
  return JSON.stringify({ photos: photoUrls });
}

export function buildVoiceFolderField(audioUrls: string[]) {
  return JSON.stringify({ audio: audioUrls });
}

export function toAvatarCloneItem(row: AvatarClone): AvatarCloneItem {
  const photos = parseStringArrayField(row.photoFolder);

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    status: row.status,
    photoUrls: photos,
    photoCount: photos.length,
    trainingVideo: row.trainingVideo,
    previewImage: row.previewImage,
    language: row.language,
    accent: row.accent,
    speakingSpeed: row.speakingSpeed ? Number(row.speakingSpeed) : null,
    gender: row.gender as AvatarCloneItem["gender"],
    defaultBackground: row.defaultBackground as AvatarCloneItem["defaultBackground"],
    avatarCategory: row.category as AvatarCloneItem["avatarCategory"],
    avatarModelPath: row.avatarModelPath,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toVoiceCloneItem(row: VoiceClone): VoiceCloneItem {
  const audio = parseStringArrayField(row.audioFolder);

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    status: row.status,
    audioUrls: audio,
    duration: row.duration,
    language: row.language,
    voiceModelPath: row.voiceModelPath,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toCloneProjectItem(row: CloneProject): CloneProjectItem {
  return {
    id: row.id,
    userId: row.userId,
    avatarCloneId: row.avatarCloneId,
    voiceCloneId: row.voiceCloneId,
    script: row.script,
    background: row.background,
    music: row.music,
    subtitle: row.subtitle,
    outputVideo: row.outputVideo,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toDecimal(value: number) {
  return value as Prisma.Decimal | number;
}
