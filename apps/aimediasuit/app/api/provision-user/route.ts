import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

type ProvisionPlan = "creator" | "professional" | "business" | "enterprise";

type ProvisionRequest = {
  stripeEventId?: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail: string;
  customerName?: string;
  plan: ProvisionPlan;
  targetApp?: "aimedia";
  paidAt?: string;
};

type ProvisionJob = {
  id: string;
  idempotencyKey: string;
  createdAt: string;
  status: "pending";
  source: "stripe";
  payload: ProvisionRequest;
};

const VALID_PLANS = new Set<ProvisionPlan>(["creator", "professional", "business", "enterprise"]);
const DATA_DIR = path.join(process.cwd(), ".data");
const JOBS_FILE = path.join(DATA_DIR, "provisioning-jobs.jsonl");
const KEYS_FILE = path.join(DATA_DIR, "provisioning-keys.json");

function normalizeToken(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer") return null;
  if (!token) return null;
  return token.trim();
}

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadIdempotencyKeys(): Promise<Set<string>> {
  try {
    const raw = await fs.readFile(KEYS_FILE, "utf8");
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed)) {
      return new Set<string>();
    }
    return new Set(parsed);
  } catch {
    return new Set<string>();
  }
}

async function saveIdempotencyKeys(keys: Set<string>) {
  await fs.writeFile(KEYS_FILE, JSON.stringify(Array.from(keys), null, 2), "utf8");
}

async function appendProvisionJob(job: ProvisionJob) {
  await fs.appendFile(JOBS_FILE, `${JSON.stringify(job)}\n`, "utf8");
}

export async function POST(request: NextRequest) {
  try {
    let expectedToken = process.env.PI_PROVISIONING_WEBHOOK_TOKEN;
    if (!expectedToken) {
      expectedToken = process.env.PROVISIONING_API_TOKEN;
    }

    if (!expectedToken) {
      return jsonError("Provisioning token is not configured on AI Media app.", 503);
    }

    const receivedToken = normalizeToken(request.headers.get("authorization"));
    if (!receivedToken || receivedToken !== expectedToken) {
      return jsonError("Unauthorized provisioning request.", 401);
    }

    const raw = (await request.json().catch(() => null)) as Partial<ProvisionRequest> | null;
    if (!raw) {
      return jsonError("Invalid JSON payload.", 400);
    }

    const customerEmail = (raw.customerEmail ?? "").trim().toLowerCase();
    const customerName = (raw.customerName ?? "").trim();
    const plan = (raw.plan ?? "") as ProvisionPlan;

    if (!customerEmail || !isValidEmail(customerEmail)) {
      return jsonError("Valid customerEmail is required.", 400);
    }

    if (!VALID_PLANS.has(plan)) {
      return jsonError("Invalid plan. Must be one of creator/professional/business/enterprise.", 400);
    }

    let idempotencyKey = request.headers.get("x-idempotency-key");
    if (!idempotencyKey || idempotencyKey.trim() === "") {
      const stripeSessionId = (raw.stripeSessionId ?? "").trim();
      if (stripeSessionId !== "") {
        idempotencyKey = stripeSessionId;
      }
    }

    if (!idempotencyKey || idempotencyKey.trim() === "") {
      idempotencyKey = `${customerEmail}:${plan}`;
    }

    await ensureDataDir();
    const keys = await loadIdempotencyKeys();

    if (keys.has(idempotencyKey)) {
      return NextResponse.json({ ok: true, duplicate: true, idempotencyKey });
    }

    const payload: ProvisionRequest = {
      stripeEventId: raw.stripeEventId,
      stripeSessionId: raw.stripeSessionId,
      stripeCustomerId: raw.stripeCustomerId,
      stripeSubscriptionId: raw.stripeSubscriptionId,
      customerEmail,
      plan,
      targetApp: "aimedia",
      paidAt: raw.paidAt,
    };

    if (customerName !== "") {
      payload.customerName = customerName;
    }

    const job: ProvisionJob = {
      id: randomUUID(),
      idempotencyKey,
      createdAt: new Date().toISOString(),
      status: "pending",
      source: "stripe",
      payload,
    };

    await appendProvisionJob(job);
    keys.add(idempotencyKey);
    await saveIdempotencyKeys(keys);

    return NextResponse.json({ ok: true, queued: true, jobId: job.id, idempotencyKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to queue provisioning job.";
    return jsonError(message, 500);
  }
}
