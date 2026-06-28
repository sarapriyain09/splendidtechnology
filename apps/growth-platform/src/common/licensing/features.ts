import type { FeatureKey } from "@prisma/client";

export const FEATURE_KEYS: FeatureKey[] = [
  "CRM",
  "SALES",
  "CALLCRM",
  "MARKETING",
  "AUTOMATION",
  "ANALYTICS",
];

export interface LicenseTier {
  name: string;
  sortOrder: number;
  features: FeatureKey[];
}

// CRM is enabled by default on every tier.
export const LICENSE_TIERS: LicenseTier[] = [
  { name: "Starter", sortOrder: 0, features: ["CRM"] },
  { name: "Growth", sortOrder: 1, features: ["CRM", "SALES"] },
  { name: "Engagement", sortOrder: 2, features: ["CRM", "SALES", "CALLCRM"] },
  {
    name: "Professional",
    sortOrder: 3,
    features: ["CRM", "SALES", "CALLCRM", "MARKETING"],
  },
  {
    name: "Enterprise",
    sortOrder: 4,
    features: ["CRM", "SALES", "CALLCRM", "MARKETING", "AUTOMATION", "ANALYTICS"],
  },
];

export function hasFeature(
  features: readonly string[] | undefined | null,
  key: FeatureKey,
): boolean {
  return !!features?.includes(key);
}
