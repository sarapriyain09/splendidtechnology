import {
  SCENE_DEFAULTS,
  SCENE_DOMAIN_DETECTION_ORDER,
  SCENE_DOMAIN_KEYWORDS,
  SCENE_ROLE_DURATION_SECONDS,
  type PromptDomain,
  type SceneRole,
} from "@/lib/scene-config";

export type SceneDefaults = {
  durationSeconds: number;
  background: string;
  voice: string;
  captionStyle: string;
  camera: string;
  transition: string;
  assets: string[];
};

function inferPromptDomain(prompt: string): PromptDomain {
  const value = prompt.toLowerCase();
  for (const domain of SCENE_DOMAIN_DETECTION_ORDER) {
    const keywords = SCENE_DOMAIN_KEYWORDS[domain];
    if (keywords.some((token) => value.includes(token))) {
      return domain;
    }
  }
  return "general";
}

function inferRoleByPosition(nextIndex: number): SceneRole {
  if (nextIndex <= 1) {
    return "hook";
  }
  if (nextIndex === 2) {
    return "body";
  }
  if (nextIndex === 3) {
    return "cta";
  }
  return "body";
}

function inferDurationSeconds(domain: PromptDomain, role: SceneRole): number {
  return SCENE_ROLE_DURATION_SECONDS[domain][role];
}

function inferBackground(domain: PromptDomain, role: SceneRole): string {
  if (domain === "social") {
    return "social";
  }
  if (domain === "saas") {
    return "office";
  }
  if (domain === "industrial") {
    return "industrial";
  }
  if (domain === "finance") {
    return "corporate";
  }
  if (domain === "commerce") {
    if (role === "hook") {
      return "showroom";
    }
    if (role === "cta") {
      return "brand";
    }
    return "product-table";
  }
  if (role === "hook") {
    return "studio";
  }
  if (role === "cta") {
    return "brand";
  }
  return "office";
}

function inferVoice(domain: PromptDomain, role: SceneRole): string {
  if (domain === "social") {
    return "energetic";
  }
  if (domain === "commerce") {
    return "sales";
  }
  if (domain === "finance") {
    return "professional";
  }
  if (domain === "industrial") {
    return "technical";
  }
  if (role === "cta") {
    return "motivational";
  }
  return SCENE_DEFAULTS.voice;
}

function inferCaptionStyle(domain: PromptDomain, role: SceneRole): string {
  if (domain === "social") {
    return "bold";
  }
  if (role === "cta") {
    return "highlight";
  }
  return SCENE_DEFAULTS.captionStyle;
}

function inferAssets(domain: PromptDomain, role: SceneRole): string[] {
  const assets: string[] = [];
  if (domain === "social") {
    assets.push("captions-template-vertical.json");
  }
  if (domain === "commerce") {
    assets.push("product-grid.png", "checkout-flow.png");
  }
  if (domain === "finance") {
    assets.push("revenue-chart.png", "invoice-preview.png");
  }
  if (domain === "saas") {
    assets.push("product-shot.png");
  }
  if (domain === "industrial") {
    assets.push("sensor-graph.png");
  }
  if (role === "cta") {
    assets.push("brand-logo.png");
  }
  return Array.from(new Set(assets));
}

export function buildSceneDefaults(contextPrompt: string, nextIndex: number): SceneDefaults {
  const domain = inferPromptDomain(contextPrompt);
  const role = inferRoleByPosition(nextIndex);
  return {
    durationSeconds: inferDurationSeconds(domain, role),
    background: inferBackground(domain, role),
    voice: inferVoice(domain, role),
    captionStyle: inferCaptionStyle(domain, role),
    camera: role === "body" ? "medium" : "close-up",
    transition: role === "hook" ? "cut" : role === "cta" ? "wipe" : "fade",
    assets: inferAssets(domain, role),
  };
}