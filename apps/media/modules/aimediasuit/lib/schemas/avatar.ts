import { z } from "zod";
import {
  avatarAspectRatioList,
  avatarBackgroundList,
  avatarLanguageList,
  avatarPresetList,
  avatarRenderModeList,
} from "@/types/media";

const mediaPathOrUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .default("")
  .refine((value) => {
    if (!value) {
      return true;
    }

    if (value.startsWith("/")) {
      return true;
    }

    return /^https?:\/\//i.test(value);
  }, "Must be an absolute URL (http/https) or an app path starting with '/'.");

export const generateAvatarSchema = z.object({
  title: z.string().max(120).optional().default(""),
  script: z.string().min(1).max(12000),
  preset: z.enum(avatarPresetList),
  background: z.enum(avatarBackgroundList),
  language: z.enum(avatarLanguageList),
  aspectRatio: z.enum(avatarAspectRatioList).optional().default("16:9"),
  voiceAudioUrl: mediaPathOrUrl,
  backgroundImageUrl: mediaPathOrUrl,
  renderMode: z.enum(avatarRenderModeList).optional().default("sync"),
});

export type GenerateAvatarInput = z.infer<typeof generateAvatarSchema>;
