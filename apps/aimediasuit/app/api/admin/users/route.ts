import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";
import { createStoredUser } from "@/lib/auth/user-store";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@velynxia.com").trim().toLowerCase();
const ADMIN_USER_ID = process.env.ADMIN_USER_ID ?? "11111111-1111-1111-1111-111111111111";
const INTERNAL_USER_SYNC_TOKEN = process.env.INTERNAL_USER_SYNC_TOKEN ?? process.env.PROVISIONING_API_TOKEN;

function isEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value);
}

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const [scheme, token] = (authHeader ?? "").split(" ");
  if (INTERNAL_USER_SYNC_TOKEN && scheme?.toLowerCase() === "bearer" && token === INTERNAL_USER_SYNC_TOKEN) {
    return { ok: true as const };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { ok: false as const, response: jsonError("Unauthorized", 401) };
  }

  const userEmail = session.user.email?.trim().toLowerCase() ?? "";
  const isAdmin = session.user.id === ADMIN_USER_ID || userEmail === ADMIN_EMAIL;
  if (!isAdmin) {
    return { ok: false as const, response: jsonError("Forbidden", 403) };
  }

  return { ok: true as const };
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin(request);
    if (!guard.ok) {
      return guard.response;
    }

    const raw = (await request.json().catch(() => null)) as
      | { email?: string; password?: string; name?: string }
      | null;

    const email = raw?.email?.trim().toLowerCase() ?? "";
    const password = raw?.password ?? "";
    const name = raw?.name?.trim() ?? "";

    if (!isEmail(email)) {
      return jsonError("Valid email is required.", 400);
    }

    if (password.length < 8) {
      return jsonError("Password must be at least 8 characters.", 400);
    }

    const created = await createStoredUser({ email, password, name, role: "USER" });
    return NextResponse.json({ ok: true, user: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user.";
    return jsonError(message, 400);
  }
}
