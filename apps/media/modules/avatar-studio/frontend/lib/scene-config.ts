export const SCENE_MUSIC_OPTIONS = ["none", "ambient", "cinematic", "corporate", "energetic"] as const;
export const SCENE_CAMERA_OPTIONS = ["static", "close-up", "medium", "wide"] as const;
export const SCENE_TRANSITION_OPTIONS = ["cut", "fade", "wipe", "slide"] as const;
export const SCENE_CAPTION_STYLE_OPTIONS = ["default", "bold", "highlight", "minimal"] as const;
export const SCENE_VOICE_PRESET_OPTIONS = ["default", "energetic", "sales", "professional", "technical", "motivational"] as const;

export type SceneRole = "hook" | "body" | "cta";
export type PromptDomain = "social" | "commerce" | "saas" | "industrial" | "finance" | "general";

export const SCENE_DOMAIN_DETECTION_ORDER: readonly Exclude<PromptDomain, "general">[] = [
  "social",
  "commerce",
  "saas",
  "industrial",
  "finance",
];

export const SCENE_DOMAIN_KEYWORDS: Record<Exclude<PromptDomain, "general">, readonly string[]> = {
  social: ["tiktok", "reel", "short", "youtube short", "instagram"],
  commerce: ["shop", "commerce", "ecommerce", "checkout", "catalog"],
  saas: ["crm", "saas", "product", "demo", "onboarding"],
  industrial: ["engineering", "factory", "maintenance", "industrial"],
  finance: ["finance", "accounting", "invoice", "vat", "tax"],
};

export const SCENE_ROLE_DURATION_SECONDS: Record<PromptDomain, Record<SceneRole, number>> = {
  social: { hook: 5, body: 10, cta: 5 },
  commerce: { hook: 6, body: 14, cta: 6 },
  saas: { hook: 6, body: 16, cta: 6 },
  industrial: { hook: 7, body: 16, cta: 6 },
  finance: { hook: 7, body: 15, cta: 6 },
  general: { hook: 6, body: 16, cta: 6 },
};

export const SCENE_DEFAULTS = {
  music: SCENE_MUSIC_OPTIONS[0],
  camera: SCENE_CAMERA_OPTIONS[0],
  transition: SCENE_TRANSITION_OPTIONS[0],
  captionStyle: SCENE_CAPTION_STYLE_OPTIONS[0],
  voice: SCENE_VOICE_PRESET_OPTIONS[0],
} as const;
