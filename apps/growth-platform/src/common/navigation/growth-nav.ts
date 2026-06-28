import type { FeatureKey } from "@prisma/client";

const PLATFORM_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.velynxia.com";

export interface NavItem {
  label: string;
  href: string;
  /** Feature required to see this item. `null` means always visible. */
  feature: FeatureKey | null;
  /** When true the href points to a separate hosted app (full navigation). */
  external?: boolean;
}

// Each app is an independent application hosted on its own URL. The platform is
// only a shell: the menu links out to the existing apps, sharing the same
// database, users and auth. URLs are overridable per-environment so they can be
// rebranded to *.velynxia.com without code changes.
const APP_URLS = {
  crm:
    process.env.NEXT_PUBLIC_CRM_URL ?? "https://crm.velynxia.com",
  sales:
    process.env.NEXT_PUBLIC_SALES_URL ??
    "https://sales.velynxia.com",
  callcrm:
    process.env.NEXT_PUBLIC_CALLCRM_URL ??
    "https://callcrm.velynxia.com",
  marketing:
    process.env.NEXT_PUBLIC_MARKETING_URL ??
    "https://marketing.velynxia.com",
  automation:
    process.env.NEXT_PUBLIC_AUTOMATION_URL ??
    "https://automation.velynxia.com",
  analytics:
    process.env.NEXT_PUBLIC_ANALYTICS_URL ??
    "https://analytics.velynxia.com",
  aimedia:
    process.env.NEXT_PUBLIC_AIMEDIA_URL ??
    `${PLATFORM_APP_URL}/aimedia`,
} as const;

const APP_ENTRY_URLS = {
  crm:
    process.env.NEXT_PUBLIC_CRM_ENTRY_URL ?? `${APP_URLS.crm}`,
  sales:
    process.env.NEXT_PUBLIC_SALES_ENTRY_URL ?? `${APP_URLS.sales}`,
  callcrm:
    process.env.NEXT_PUBLIC_CALLCRM_ENTRY_URL ?? `${APP_URLS.callcrm}`,
  marketing:
    process.env.NEXT_PUBLIC_MARKETING_ENTRY_URL ?? `${APP_URLS.marketing}`,
  automation:
    process.env.NEXT_PUBLIC_AUTOMATION_ENTRY_URL ?? `${APP_URLS.automation}/app`,
  analytics:
    process.env.NEXT_PUBLIC_ANALYTICS_ENTRY_URL ?? `${APP_URLS.analytics}/app`,
  aimedia:
    process.env.NEXT_PUBLIC_AIMEDIA_ENTRY_URL ?? `${APP_URLS.aimedia}`,
} as const;

// Dashboard and Settings are always visible; every other item is gated by the
// user's license features. CRM/Sales/CallCRM/Marketing/Automation/Analytics
// open hosted apps.
export const GROWTH_NAV: NavItem[] = [
  { label: "Dashboard", href: "/app/dashboard", feature: null },
  { label: "CRM", href: APP_ENTRY_URLS.crm, feature: "CRM", external: true },
  { label: "Sales", href: APP_ENTRY_URLS.sales, feature: "SALES", external: true },
  { label: "CallCRM", href: APP_ENTRY_URLS.callcrm, feature: "CALLCRM", external: true },
  { label: "Marketing", href: APP_ENTRY_URLS.marketing, feature: "MARKETING", external: true },
  { label: "Automation", href: APP_ENTRY_URLS.automation, feature: "AUTOMATION", external: true },
  { label: "Analytics", href: APP_ENTRY_URLS.analytics, feature: "ANALYTICS", external: true },
  { label: "AImedia", href: APP_ENTRY_URLS.aimedia, feature: null, external: true },
  { label: "Settings", href: "/app/settings", feature: null },
];

export function visibleNavItems(features: readonly string[] | undefined | null): NavItem[] {
  return GROWTH_NAV.filter(
    (item) => item.feature === null || !!features?.includes(item.feature),
  );
}

