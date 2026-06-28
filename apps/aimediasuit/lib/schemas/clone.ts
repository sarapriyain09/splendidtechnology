import { z } from "zod";
import {
  cloneBackgroundList,
  cloneCategoryList,
  cloneEmotionList,
  cloneGenderList,
  videoAspectRatioList,
} from "@/types/media";

export const cloneProfileSchema = z.object({
  cloneName: z.string().min(2).max(80),
  language: z.string().min(2).max(40),
  accent: z.string().max(80).optional().default(""),
  speakingSpeed: z.number().min(0.5).max(2).default(1),
  gender: z.enum(cloneGenderList),
  defaultBackground: z.enum(cloneBackgroundList),
  avatarCategory: z.enum(cloneCategoryList),
});

export const cloneTrainSchema = cloneProfileSchema.extend({
  avatarCloneId: z.string().uuid(),
  voiceCloneId: z.string().uuid(),
});

export const cloneGenerateSchema = z.object({
  avatarCloneId: z.string().uuid(),
  voiceCloneId: z.string().uuid(),
  script: z.string().min(1).max(12000),
  scenesPerMinute: z.number().int().min(1).max(12).default(4),
  emotion: z.enum(cloneEmotionList).default("professional"),
  background: z.enum(cloneBackgroundList).optional(),
  music: z.enum(["none", "corporate", "motivational", "ambient", "upbeat"]).default("none"),
  subtitle: z.boolean().default(true),
  aspectRatio: z.enum(videoAspectRatioList).default("16:9"),
});

export type CloneTrainInput = z.infer<typeof cloneTrainSchema>;
export type CloneGenerateInput = z.infer<typeof cloneGenerateSchema>;
