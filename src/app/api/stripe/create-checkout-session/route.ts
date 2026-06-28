import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl } from "@/lib/site-url";

type CheckoutPlan = "creator" | "professional" | "business" | "enterprise";

type TargetApp = "aimedia";

const stripePriceConfigByPlan: Record<
  CheckoutPlan,
  {
    lookupKey: string;
    priceId?: string;
    productId?: string;
  }
> = {
  creator: {
    lookupKey: process.env.STRIPE_LOOKUP_CREATOR ?? "velynxia_ai_creator_monthly",
    priceId: process.env.STRIPE_PRICE_ID_CREATOR,
    productId: process.env.STRIPE_PRODUCT_ID_CREATOR,
  },
  professional: {
    lookupKey: process.env.STRIPE_LOOKUP_PROFESSIONAL ?? "velynxia_ai_professional_monthly",
    priceId: process.env.STRIPE_PRICE_ID_PROFESSIONAL,
    productId: process.env.STRIPE_PRODUCT_ID_PROFESSIONAL,
  },
  business: {
    lookupKey: process.env.STRIPE_LOOKUP_BUSINESS ?? "velynxia_ai_business_monthly",
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS,
    productId: process.env.STRIPE_PRODUCT_ID_BUSINESS,
  },
  enterprise: {
    lookupKey: process.env.STRIPE_LOOKUP_ENTERPRISE ?? "velynxia_ai_enterprise_monthly",
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE,
    productId: process.env.STRIPE_PRODUCT_ID_ENTERPRISE,
  },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeClient = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function getTargetApp(): TargetApp {
  return "aimedia";
}

function isCheckoutPlan(value: string): value is CheckoutPlan {
  return value in stripePriceConfigByPlan;
}

export async function POST(request: Request) {
  if (!stripeClient) {
    return NextResponse.json({ error: "Stripe is not configured on the server." }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { plan?: string } | null;
  const selectedPlan = (body?.plan ?? "").toLowerCase();

  if (!isCheckoutPlan(selectedPlan)) {
    return NextResponse.json({ error: "Invalid pricing plan." }, { status: 400 });
  }

  const stripeConfig = stripePriceConfigByPlan[selectedPlan];
  const lookupKey = stripeConfig.lookupKey;

  try {
    let selectedPrice: Stripe.Price | null = null;

    if (stripeConfig.priceId) {
      const resolvedPrice = await stripeClient.prices.retrieve(stripeConfig.priceId);
      if (resolvedPrice.active) {
        selectedPrice = resolvedPrice;
      }
    }

    if (!selectedPrice) {
      const prices = await stripeClient.prices.list({
        lookup_keys: [lookupKey],
        active: true,
        limit: 1,
        expand: ["data.product"],
      });
      selectedPrice = prices.data[0] ?? null;
    }

    if (!selectedPrice && stripeConfig.productId) {
      const productPrices = await stripeClient.prices.list({
        product: stripeConfig.productId,
        active: true,
        type: "recurring",
        limit: 100,
      });

      selectedPrice =
        productPrices.data.find((price) => price.recurring?.interval === "month") ??
        productPrices.data[0] ??
        null;
    }

    if (!selectedPrice) {
      return NextResponse.json(
        {
          error: `No active price found for plan '${selectedPlan}'. Configure STRIPE_PRICE_ID_${selectedPlan.toUpperCase()}, STRIPE_PRODUCT_ID_${selectedPlan.toUpperCase()}, or set lookup key '${lookupKey}' on an active Stripe price.`,
        },
        { status: 400 }
      );
    }

    const siteUrl = getSiteUrl();
    const targetApp = getTargetApp();

    const session = await stripeClient.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: selectedPrice.id, quantity: 1 }],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_creation: "always",
      metadata: {
        plan: selectedPlan,
        targetApp,
      },
      success_url: `${siteUrl}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
