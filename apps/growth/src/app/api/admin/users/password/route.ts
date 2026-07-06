import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/common/auth";
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

function getProvisionTargets() {
  return (process.env.CROSS_APP_USER_PASSWORD_TARGETS ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

async function syncPasswordAcrossApps(input: { email: string; newPassword: string }) {
  const token = process.env.CROSS_APP_USER_SYNC_TOKEN;
  const targets = getProvisionTargets();
  if (!token || targets.length === 0) {
    return [] as ProvisionTargetResult[];
  }

  const responses = await Promise.all(
    targets.map(async (target) => {
      try {
        const response = await fetch(target, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input),
          cache: "no-store",
        });

        if (response.ok || response.status === 404) {
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
          error: payload.error ?? `Password sync failed with ${response.status}`,
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

export async function PATCH(request: NextRequest) {
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
      newPassword?: string;
    };

    const email = body.email?.trim().toLowerCase() ?? "";
    const newPassword = body.newPassword ?? "";

    if (!isEmail(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.$queryRawUnsafe<Array<{ id: number | bigint | string }>>(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      email,
    );
    if (existing.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.$executeRawUnsafe(
      `UPDATE users
          SET "passwordHash" = $1,
              "isActive" = true,
              "updatedAt" = now(),
              updated_at = now()
        WHERE email = $2`,
      passwordHash,
      email,
    );

    const crossApp = await syncPasswordAcrossApps({ email, newPassword });

    return NextResponse.json({ ok: true, email, crossApp });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update password.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
