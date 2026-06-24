import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type CheckoutPlan = "crm" | "growth" | "creator" | "professional" | "business" | "enterprise";
type TargetApp = "growth" | "aimedia";

type ProvisioningPayload = {
  stripeEventId: string;
  stripeSessionId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  customerEmail: string;
  customerName?: string;
  plan: CheckoutPlan;
  targetApp: TargetApp;
  paidAt: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const provisioningWebhookUrl = process.env.PI_PROVISIONING_WEBHOOK_URL;
const provisioningWebhookToken = process.env.PI_PROVISIONING_WEBHOOK_TOKEN;
const provisioningTimeoutMs = Number(process.env.PI_PROVISIONING_TIMEOUT_MS ?? 10000);

const stripeClient = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function isCheckoutPlan(value: string): value is CheckoutPlan {
  return ["crm", "growth", "creator", "professional", "business", "enterprise"].includes(value);
}

function isTargetApp(value: string): value is TargetApp {
  return value === "growth" || value === "aimedia";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendToProvisioningApi(payload: ProvisioningPayload) {
  if (!provisioningWebhookUrl) {
    throw new Error("PI_PROVISIONING_WEBHOOK_URL is not configured.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Idempotency-Key": payload.stripeSessionId,
  };

  if (provisioningWebhookToken) {
    headers.Authorization = `Bearer ${provisioningWebhookToken}`;
  }

  let lastError = "Unknown provisioning error.";

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(provisioningWebhookUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(provisioningTimeoutMs),
      });

      if (response.ok) {
        return;
      }

      const responseText = await response.text();
      lastError = `Provisioning endpoint returned ${response.status}: ${responseText}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Provisioning request failed.";
    }

    if (attempt < 3) {
      await sleep(attempt * 500);
    }
  }

  throw new Error(lastError);
}

async function getCustomerEmail(session: Stripe.Checkout.Session): Promise<string | null> {
  if (session.customer_details?.email) {
    return session.customer_details.email;
  }

  if (session.customer_email) {
    return session.customer_email;
  }

  if (!stripeClient || !session.customer || typeof session.customer !== "string") {
    return null;
  }

  const customer = await stripeClient.customers.retrieve(session.customer);
  if ("deleted" in customer && customer.deleted) {
    return null;
  }

  return customer.email ?? null;
}

export async function POST(request: Request) {
  if (!stripeClient || !stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripeClient.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: true, eventType: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "subscription") {
    return NextResponse.json({ received: true, ignored: true, reason: "non-subscription checkout" });
  }

  const planValue = session.metadata?.plan ?? "";
  const targetAppValue = session.metadata?.targetApp ?? "";

  if (!isCheckoutPlan(planValue) || !isTargetApp(targetAppValue)) {
    return NextResponse.json(
      {
        error: "Missing or invalid plan metadata. Ensure checkout session metadata includes plan and targetApp.",
      },
      { status: 400 }
    );
  }

  const customerEmail = await getCustomerEmail(session);
  if (!customerEmail) {
    return NextResponse.json({ error: "Customer email is missing on checkout session." }, { status: 400 });
  }

  const payload: ProvisioningPayload = {
    stripeEventId: event.id,
    stripeSessionId: session.id,
    stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
    stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : undefined,
    customerEmail,
    customerName: session.customer_details?.name ?? undefined,
    plan: planValue,
    targetApp: targetAppValue,
    paidAt: new Date().toISOString(),
  };

  try {
    await sendToProvisioningApi(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send provisioning job.";
    console.error("Stripe webhook provisioning error:", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ received: true, provisioned: true });
}
