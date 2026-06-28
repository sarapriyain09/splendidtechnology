import bcrypt from "bcryptjs";
import { prisma } from "@/common/services";
import type { FeatureKey, UserRole } from "@prisma/client";
import {
  assignLicense,
  getUserFeatures,
  seedLicenses,
} from "@/common/licensing/license-service";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  features: FeatureKey[];
}

const ADMIN_EMAIL = "admin@velynxia.com";
const LEGACY_ADMIN_EMAIL = "admin@velynxia.com";

interface DbUserRow {
  id: number | bigint | string;
  name: string | null;
  email: string;
  role: UserRole;
  password_hash: string | null;
  is_active: boolean | null;
  id_text_legacy: string | null;
}

function toAuthId(id: number | bigint | string): string {
  return String(id);
}

// Seeds the default platform admin once. Safe to call repeatedly. If a legacy
// admin exists from before the Velynxia rebrand, it is migrated to the new
// email so its password and license assignment are preserved.
export async function seedAdmin(): Promise<void> {
  const existing = await prisma.$queryRawUnsafe<DbUserRow[]>(
    `SELECT id, name, email, role,
            "passwordHash" AS password_hash,
            "isActive" AS is_active,
            id_text_legacy
       FROM users
      WHERE email = $1
      LIMIT 1`,
    ADMIN_EMAIL,
  );
  if (existing.length > 0) return;

  const legacy = await prisma.$queryRawUnsafe<DbUserRow[]>(
    `SELECT id, name, email, role,
            "passwordHash" AS password_hash,
            "isActive" AS is_active,
            id_text_legacy
       FROM users
      WHERE email = $1
      LIMIT 1`,
    LEGACY_ADMIN_EMAIL,
  );
  if (legacy.length > 0) {
    await prisma.$executeRawUnsafe(
      `UPDATE users SET email = $1, "updatedAt" = now(), updated_at = now() WHERE id = $2`,
      ADMIN_EMAIL,
      Number(legacy[0].id),
    );
    console.log(`✓ Admin migrated: ${LEGACY_ADMIN_EMAIL} -> ${ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash("Velynxia2024!", 12);
  await prisma.$executeRawUnsafe(
    `INSERT INTO users (
        id_text_legacy,
        uuid,
        name,
        email,
        role,
        "passwordHash",
        "isActive",
        "createdAt",
        "updatedAt",
        created_at,
        updated_at,
        is_deleted,
        version
      )
      VALUES (
        $1,
        gen_random_uuid(),
        $2,
        $3,
        $4::"UserRole",
        $5,
        true,
        now(),
        now(),
        now(),
        now(),
        false,
        1
      )`,
    "admin-text-legacy",
    "Admin",
    ADMIN_EMAIL,
    "ADMIN",
    passwordHash,
  );
  console.log(`✓ Default admin created: ${ADMIN_EMAIL} / Velynxia2024!`);
}

/**
 * Idempotently prepares the platform: license tiers, default admin, and the
 * admin's Enterprise license (so the admin can see every app).
 */
export async function bootstrapPlatform(): Promise<void> {
  await seedLicenses();
  await seedAdmin();

  const admin = await prisma.$queryRawUnsafe<Array<{ id: number | bigint }>>(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    ADMIN_EMAIL,
  );
  if (admin.length > 0) await assignLicense(String(admin[0].id), "Enterprise");
}

export async function verifyUser(
  email: string,
  password: string,
): Promise<AuthUser | null> {
  const rows = await prisma.$queryRawUnsafe<DbUserRow[]>(
    `SELECT id, name, email, role,
            "passwordHash" AS password_hash,
            "isActive" AS is_active,
            id_text_legacy
       FROM users
      WHERE email = $1
      LIMIT 1`,
    email,
  );
  const user = rows[0];
  if (!user || !user.password_hash || !user.is_active) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  const features = await getUserFeatures(toAuthId(user.id));

  return {
    id: toAuthId(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
    features,
  };
}
