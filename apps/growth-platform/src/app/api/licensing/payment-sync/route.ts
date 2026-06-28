import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/common/services";
import { LICENSE_TIERS, getUserFeatures, seedLicenses, setPrimaryLicense } from "@/common/licensing";

const PLAN_ALIASES: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  engagement: "Engagement",
  professional: "Professional",
  enterprise: "Enterprise",
  basic: "Starter",
  pro: "Professional",
  premium: "Enterprise",
};

interface PaymentSyncPayload {
  email?: string;
  userId?: string;
  licenseName?: string;
  plan?: string;
  status?: string;
}

function normalizeLicenseName(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  if (PLAN_ALIASES[lower]) return PLAN_ALIASES[lower];

  const exactTier = LICENSE_TIERS.find(
    (tier) => tier.name.toLowerCase() === lower,
  );
  return exactTier?.name ?? null;
}

function isPaidStatus(status: string | undefined): boolean {
  if (!status) return true;
  const normalized = status.trim().toLowerCase();
  return ["paid", "succeeded", "completed", "active"].includes(normalized);
}

async function findUserIdByEmail(email: string): Promise<string | null> {
  const rows = await prisma.$queryRawUnsafe<Array<{ id: number | bigint | string }>>(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    email,
  );
  const user = rows[0];
  return user ? String(user.id) : null;
}

export async function POST(req: NextRequest) {
  const expectedSecret = process.env.VELYNXIA_PAYMENT_SYNC_SECRET;
  const providedSecret = req.headers.get("x-velynxia-sync-secret");

  if (!expectedSecret) {
    return NextResponse.json(
      { error: "VELYNXIA_PAYMENT_SYNC_SECRET is not configured." },
      { status: 500 },
    );
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as PaymentSyncPayload;

  if (!isPaidStatus(body.status)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Payment not active." });
  }

  const licenseName = normalizeLicenseName(body.licenseName ?? body.plan);
  if (!licenseName) {
    return NextResponse.json(
      {
        error:
          "A valid licenseName or plan is required (Starter, Growth, Engagement, Professional, Enterprise).",
      },
      { status: 400 },
    );
  }

  const userId = body.userId?.trim()
    ? body.userId.trim()
    : body.email?.trim()
      ? await findUserIdByEmail(body.email.trim())
      : null;

  if (!userId) {
    return NextResponse.json(
      { error: "User not found. Provide a valid userId or email." },
      { status: 404 },
    );
  }

  await seedLicenses();
  await setPrimaryLicense(userId, licenseName);
  const features = await getUserFeatures(userId);

  return NextResponse.json({
    ok: true,
    userId,
    license: licenseName,
    features,
  });
}
