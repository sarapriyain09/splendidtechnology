import type { FeatureKey } from "@prisma/client";
import { prisma } from "../services";
import { LICENSE_TIERS } from "./features";

interface LicenseRow {
  id: string;
}

interface UserIdResolution {
  id: number | bigint;
  id_text_legacy: string | null;
}

async function resolveUserId(userId: string): Promise<UserIdResolution | null> {
  const asNumber = Number(userId);
  if (Number.isFinite(asNumber)) {
    const rows = await prisma.$queryRawUnsafe<UserIdResolution[]>(
      `SELECT id, id_text_legacy FROM users WHERE id = $1 LIMIT 1`,
      asNumber,
    );
    return rows[0] ?? null;
  }

  const rows = await prisma.$queryRawUnsafe<UserIdResolution[]>(
    `SELECT id, id_text_legacy FROM users WHERE id_text_legacy = $1 LIMIT 1`,
    userId,
  );
  return rows[0] ?? null;
}

/** Idempotently create the license tiers and their feature grants. */
export async function seedLicenses(): Promise<void> {
  for (const tier of LICENSE_TIERS) {
    const seedId = `license-${tier.name.toLowerCase()}`;
    const licenses = await prisma.$queryRawUnsafe<LicenseRow[]>(
      `INSERT INTO licenses (id, name, "sortOrder", "createdAt", "updatedAt", uuid)
       VALUES ($1, $2, $3, now(), now(), gen_random_uuid())
       ON CONFLICT (name) DO UPDATE
         SET "sortOrder" = EXCLUDED."sortOrder",
             "updatedAt" = now()
       RETURNING id`,
      seedId,
      tier.name,
      tier.sortOrder,
    );
    const license = licenses[0];
    if (!license) continue;

    for (const feature of tier.features) {
      await prisma.$executeRawUnsafe(
        `INSERT INTO license_features ("licenseId", feature)
         VALUES ($1, $2::"FeatureKey")
         ON CONFLICT ("licenseId", feature) DO NOTHING`,
        license.id,
        feature,
      );
    }
  }
}

/** Assign a named license tier to a user (idempotent). */
export async function assignLicense(
  userId: string,
  licenseName: string,
): Promise<void> {
  const license = await prisma.$queryRawUnsafe<LicenseRow[]>(
    `SELECT id FROM licenses WHERE name = $1 LIMIT 1`,
    licenseName,
  );
  if (!license[0]) return;

  const resolved = await resolveUserId(userId);
  if (!resolved) return;

  await prisma.$executeRawUnsafe(
    `INSERT INTO user_licenses ("userId", "userId_text_legacy", "licenseId", "assignedAt")
     VALUES ($1, $2, $3, now())
     ON CONFLICT DO NOTHING`,
    Number(resolved.id),
    resolved.id_text_legacy,
    license[0].id,
  );
}

/**
 * Replace a user's current license assignments with one named tier.
 * Useful when payment state changes and access must match the active plan.
 */
export async function setPrimaryLicense(
  userId: string,
  licenseName: string,
): Promise<void> {
  const license = await prisma.$queryRawUnsafe<LicenseRow[]>(
    `SELECT id FROM licenses WHERE name = $1 LIMIT 1`,
    licenseName,
  );
  if (!license[0]) return;

  const resolved = await resolveUserId(userId);
  if (!resolved) return;

  await prisma.$executeRawUnsafe(
    `DELETE FROM user_licenses WHERE "userId" = $1`,
    Number(resolved.id),
  );

  await prisma.$executeRawUnsafe(
    `INSERT INTO user_licenses ("userId", "userId_text_legacy", "licenseId", "assignedAt")
     VALUES ($1, $2, $3, now())
     ON CONFLICT DO NOTHING`,
    Number(resolved.id),
    resolved.id_text_legacy,
    license[0].id,
  );
}

/** Union of all features granted across a user's assigned licenses. */
export async function getUserFeatures(userId: string): Promise<FeatureKey[]> {
  const resolved = await resolveUserId(userId);
  if (!resolved) return ["CRM"];

  const rows = await prisma.$queryRawUnsafe<Array<{ feature: string }>>(
    `SELECT lf.feature::text AS feature
       FROM user_licenses ul
       JOIN license_features lf ON lf."licenseId" = ul."licenseId"
      WHERE ul."userId" = $1`,
    Number(resolved.id),
  );

  const set = new Set<FeatureKey>();
  for (const row of rows) {
    set.add(row.feature as FeatureKey);
  }

  // CRM is enabled by default for any authenticated user.
  if (set.size === 0) set.add("CRM");

  return [...set];
}
