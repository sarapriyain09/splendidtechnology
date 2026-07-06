import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { getSession } from "@/common/auth";
import { getUserFeatures, LICENSE_TIERS, seedLicenses, setPrimaryLicense } from "@/common/licensing";
import { prisma } from "@/common/services";

type ProvisionTargetResult = {
  target: string;
  ok: boolean;
  status?: number;
  error?: string;
};

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user?.id) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorised" }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const };
}

function getProvisionTargets() {
  return (process.env.CROSS_APP_USER_CREATE_TARGETS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

async function provisionAcrossApps(input: {
  email: string;
  password: string;
  name: string | null;
}) {
  const token = process.env.CROSS_APP_USER_SYNC_TOKEN;
  const targets = getProvisionTargets();
  if (!token || targets.length === 0) {
    return [] as ProvisionTargetResult[];
  }

  const responses = await Promise.all(
    targets.map(async (target) => {
      try {
        const response = await fetch(target, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: input.email,
            password: input.password,
            name: input.name ?? undefined,
          }),
          cache: "no-store",
        });

        if (response.ok || response.status === 400 || response.status === 409) {
          return {
            target,
            ok: true,
            status: response.status,
          } satisfies ProvisionTargetResult;
        }

        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        return {
          target,
          ok: false,
          status: response.status,
          error: payload.error ?? `Provision failed with ${response.status}`,
        } satisfies ProvisionTargetResult;
      } catch (error) {
        return {
          target,
          ok: false,
          error: error instanceof Error ? error.message : "Network error",
        } satisfies ProvisionTargetResult;
      }
    }),
  );

  return responses;
}

export async function GET() {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    await seedLicenses();

    const rows = await prisma.$queryRawUnsafe<Array<{
      id: number | bigint | string;
      name: string | null;
      email: string;
      role: UserRole;
      is_active: boolean | null;
      license_name: string | null;
    }>>(
      `SELECT DISTINCT ON (u.id)
              u.id,
              u.name,
              u.email,
              u.role,
              u."isActive" AS is_active,
              l.name AS license_name
         FROM users u
         LEFT JOIN user_licenses ul ON ul."userId" = u.id
         LEFT JOIN licenses l ON l.id = ul."licenseId"
        WHERE COALESCE(u.is_deleted, false) = false
        ORDER BY u.id, l."sortOrder" DESC NULLS LAST, ul."assignedAt" DESC NULLS LAST`,
    );

    const users = await Promise.all(
      rows.map(async (row) => {
        const features = await getUserFeatures(String(row.id));
        return {
          id: String(row.id),
          name: row.name,
          email: row.email,
          role: row.role,
          isActive: Boolean(row.is_active ?? true),
          license: row.license_name,
          features,
        };
      }),
    );

    users.sort((a, b) => a.email.localeCompare(b.email));

    return NextResponse.json({
      ok: true,
      users,
      licenseTiers: LICENSE_TIERS.map((tier) => ({
        name: tier.name,
        features: tier.features,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load users.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      licenseName?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    const licenseName = body.licenseName?.trim() ?? "";

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const isTierValid = LICENSE_TIERS.some((tier) => tier.name === licenseName);
    if (!isTierValid) {
      return NextResponse.json({ error: "Valid license tier is required." }, { status: 400 });
    }

    await seedLicenses();

    const userRows = await prisma.$queryRawUnsafe<Array<{ id: number | bigint | string }>>(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      email,
    );
    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const userId = String(userRows[0].id);
    await setPrimaryLicense(userId, licenseName);
    const features = await getUserFeatures(userId);

    return NextResponse.json({ ok: true, email, licenseName, features });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to assign modules.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await requireAdmin();
    if (!access.ok) return access.response;

    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
      name?: string;
      role?: "ADMIN" | "USER";
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const name = body.name?.trim() || null;
    const role: UserRole = body.role === "ADMIN" ? "ADMIN" : "USER";

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.$queryRawUnsafe<Array<{ id: number | bigint | string }>>(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      email,
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
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
      randomUUID(),
      name,
      email,
      role,
      passwordHash,
    );

    const createdRows = await prisma.$queryRawUnsafe<Array<{
      id: number | bigint | string;
      email: string;
      name: string | null;
      role: UserRole;
    }>>(
      `SELECT id, email, name, role FROM users WHERE email = $1 LIMIT 1`,
      email,
    );

    const created = createdRows[0];
    if (created) {
      await seedLicenses();
      await setPrimaryLicense(String(created.id), "Starter");
    }
    const crossApp = await provisionAcrossApps({ email, password, name });

    return NextResponse.json({
      ok: true,
      user: created
        ? {
            id: String(created.id),
            email: created.email,
            name: created.name,
            role: created.role,
          }
        : { email, name, role },
      crossApp,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    if (!isEmail(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    const userRows = await prisma.$queryRawUnsafe<Array<{
      id: number | bigint | string;
      role: UserRole;
      email: string;
    }>>(
      `SELECT id, role, email
         FROM users
        WHERE email = $1
          AND COALESCE(is_deleted, false) = false
        LIMIT 1`,
      email,
    );

    if (userRows.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = userRows[0];
    const targetUserId = String(user.id);
    if (targetUserId === String(session.user.id)) {
      return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });
    }

    if (user.role === "ADMIN") {
      const adminCountRows = await prisma.$queryRawUnsafe<Array<{ count: number | bigint | string }>>(
        `SELECT COUNT(*)::bigint AS count
           FROM users
          WHERE role = 'ADMIN'::"UserRole"
            AND COALESCE(is_deleted, false) = false`,
      );
      const adminCount = Number(adminCountRows[0]?.count ?? 0);
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin account." },
          { status: 400 },
        );
      }
    }

    await prisma.$executeRawUnsafe(`DELETE FROM user_licenses WHERE "userId" = $1`, user.id);
    await prisma.$executeRawUnsafe(
      `UPDATE users
          SET "isActive" = false,
              is_deleted = true,
              "updatedAt" = now(),
              updated_at = now()
        WHERE id = $1`,
      user.id,
    );

    return NextResponse.json({ ok: true, email: user.email });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete user.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
