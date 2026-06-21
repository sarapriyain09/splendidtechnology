const PRIMARY_SITE_URL = "https://www.velynxia.com";
const LEGACY_DOMAIN_PATTERN =
  /(^|\.)splendid(?:-technology|technology)\.(?:co\.uk|com)$/i;

function normalizeUrl(value: string): string {
  const candidate = value.includes("://") ? value : `https://${value}`;

  try {
    const url = new URL(candidate);

    if (LEGACY_DOMAIN_PATTERN.test(url.hostname)) {
      return PRIMARY_SITE_URL;
    }

    return `${url.protocol}//${url.host}`;
  } catch {
    return PRIMARY_SITE_URL;
  }
}

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalizeUrl(explicit);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) return normalizeUrl(`https://${vercelUrl}`);

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return PRIMARY_SITE_URL;
}
