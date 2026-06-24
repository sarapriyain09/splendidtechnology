"use client";

import { useState } from "react";
import Link from "next/link";
import {
  aiMediaFeatureMatrix,
  aiMediaSuitePlans,
  growthPlatformPlans,
  type ProductTab,
} from "@/lib/pricing";

type CheckoutPlan = "crm" | "growth" | "creator" | "professional" | "business" | "enterprise";

const growthCheckoutPlanByName: Record<string, CheckoutPlan | undefined> = {
  CRM: "crm",
  Growth: "growth",
};

const aiMediaCheckoutPlanByName: Record<string, CheckoutPlan | undefined> = {
  Creator: "creator",
  Professional: "professional",
  Business: "business",
  Enterprise: "enterprise",
};

export function PricingSwitcher() {
  const [activeTab, setActiveTab] = useState<ProductTab>("growth");
  const [loadingPlan, setLoadingPlan] = useState<CheckoutPlan | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const startCheckout = async (plan: CheckoutPlan) => {
    setCheckoutError(null);
    setLoadingPlan(plan);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await response.json().catch(() => null)) as { error?: string; url?: string } | null;

      if (!response.ok || !data?.url) {
        setCheckoutError(data?.error ?? "Unable to start checkout right now. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setCheckoutError("Unable to start checkout right now. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-[#dbe7ff] bg-white p-3 shadow-[0_12px_36px_rgba(14,39,87,0.08)] sm:p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab("growth")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${{
              growth: "bg-[#0b1f3a] text-white",
              "ai-media": "bg-[#f3f7ff] text-[#23457e] hover:bg-[#eaf2ff]",
            }[activeTab]}`}
          >
            Growth Platform
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ai-media")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${{
              "ai-media": "bg-[#0b1f3a] text-white",
              growth: "bg-[#f3f7ff] text-[#23457e] hover:bg-[#eaf2ff]",
            }[activeTab]}`}
          >
            AI Media Suite
          </button>
        </div>
      </div>

      {checkoutError ? (
        <p className="mt-4 rounded-xl border border-[#ffd9d2] bg-[#fff7f5] px-4 py-3 text-sm text-[#8f2f1f]">{checkoutError}</p>
      ) : null}

      {activeTab === "growth" ? (
        <GrowthPricingContent loadingPlan={loadingPlan} onCheckout={startCheckout} />
      ) : (
        <AiMediaPricingContent loadingPlan={loadingPlan} onCheckout={startCheckout} />
      )}
    </section>
  );
}

function GrowthPricingContent({
  loadingPlan,
  onCheckout,
}: {
  loadingPlan: CheckoutPlan | null;
  onCheckout: (plan: CheckoutPlan) => Promise<void>;
}) {
  return (
    <div className="mt-9">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Velynxia Product Family</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0e1629] sm:text-4xl">Growth Platform</h2>
        <p className="mt-3 text-sm leading-6 text-[#4a5a7a]">
          CRM, Sales, CallCRM, Marketing, Automation, and Analytics in one operating platform for customer growth.
        </p>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {growthPlatformPlans.map((plan) => (
          <article key={plan.name} className="flex flex-col rounded-2xl border border-[#dce8ff] bg-[linear-gradient(165deg,#ffffff_0%,#f4f9ff_100%)] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46618f]">{plan.name}</p>
            <h3 className="mt-2 text-3xl font-bold text-[#0f1f3b]">{plan.price}</h3>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6d93]">Suitable for</p>
            <ul className="mt-2 space-y-1.5 text-sm text-[#425375]">
              {plan.suitableFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#5a82d6]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6d93]">Includes</p>
            <ul className="mt-2 flex-1 space-y-1.5 text-sm text-[#425375]">
              {plan.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-[#2f7a47]" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {growthCheckoutPlanByName[plan.name] ? (
              <button
                type="button"
                onClick={() => onCheckout(growthCheckoutPlanByName[plan.name] as CheckoutPlan)}
                disabled={loadingPlan === growthCheckoutPlanByName[plan.name]}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0f56dd] disabled:cursor-not-allowed disabled:bg-[#87adf3]"
              >
                {loadingPlan === growthCheckoutPlanByName[plan.name] ? "Redirecting..." : "Checkout"}
              </button>
            ) : (
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1f6dff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f56dd]"
              >
                {plan.ctaLabel}
              </Link>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function AiMediaPricingContent({
  loadingPlan,
  onCheckout,
}: {
  loadingPlan: CheckoutPlan | null;
  onCheckout: (plan: CheckoutPlan) => Promise<void>;
}) {
  return (
    <div className="mt-9">
      <div className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#46618f]">Velynxia Product Family</p>
        <h2 className="mt-2 text-3xl font-bold text-[#0e1629] sm:text-4xl">AI Media Suite</h2>
        <p className="mt-2 text-base font-semibold text-[#1c335e]">Create Content. Faster. Smarter.</p>
        <p className="mt-3 text-sm leading-6 text-[#4a5a7a]">
          Generate scripts, voiceovers, presentations, podcasts, subtitles, videos and AI avatars from one platform.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-[#ffd8b0] bg-[#fff7ef] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9a5a22]">Launch Recommendation (Next 90 Days)</p>
        <p className="mt-2 text-sm leading-6 text-[#7a4b1f]">
          AI Media Suite is in Early Access for Creator, Professional, and Business plans. Avatar Studio remains marked as coming soon while advanced workflows continue to mature.
        </p>
      </div>

      <div className="mt-7 grid gap-4 xl:grid-cols-2">
        {aiMediaSuitePlans.map((plan) => (
          <article key={plan.name} className="flex flex-col rounded-2xl border border-[#dce8ff] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#46618f]">{plan.name}</p>
            <h3 className="mt-2 text-3xl font-bold text-[#0f1f3b]">{plan.price}</h3>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6d93]">Suitable for</p>
            <ul className="mt-2 grid gap-1.5 text-sm text-[#425375] sm:grid-cols-2">
              {plan.suitableFor.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#5a82d6]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6d93]">Includes</p>
            <ul className="mt-2 grid gap-1.5 text-sm text-[#425375] sm:grid-cols-2">
              {plan.includes.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-[#2f7a47]" aria-hidden="true">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-[#e2ecff] bg-[#f8fbff] px-3 py-2 text-sm text-[#2d4470]">
              <p>{plan.generationLimit}</p>
              {plan.support ? <p className="mt-1 font-semibold">{plan.support}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => onCheckout(aiMediaCheckoutPlanByName[plan.name] as CheckoutPlan)}
              disabled={loadingPlan === aiMediaCheckoutPlanByName[plan.name]}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-[#cfe0ff] bg-white px-4 py-2 text-sm font-semibold text-[#2c4d87] transition hover:bg-[#f4f8ff] disabled:cursor-not-allowed disabled:bg-[#eef3ff] disabled:text-[#7f8dab]"
            >
              {loadingPlan === aiMediaCheckoutPlanByName[plan.name] ? "Redirecting..." : "Start subscription"}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl border border-[#dce8ff] bg-white">
        <div className="border-b border-[#dce8ff] bg-[#f8fbff] px-4 py-3">
          <h3 className="text-lg font-bold text-[#13284d]">Feature Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f3f8ff] text-left text-[#27497f]">
                <th className="border-b border-[#dce8ff] px-4 py-3 font-semibold">Studio</th>
                <th className="border-b border-[#dce8ff] px-4 py-3 font-semibold">Creator</th>
                <th className="border-b border-[#dce8ff] px-4 py-3 font-semibold">Professional</th>
                <th className="border-b border-[#dce8ff] px-4 py-3 font-semibold">Business</th>
                <th className="border-b border-[#dce8ff] px-4 py-3 font-semibold">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {aiMediaFeatureMatrix.map((row) => (
                <tr key={row.studio} className="odd:bg-white even:bg-[#fbfdff]">
                  <td className="border-b border-[#edf3ff] px-4 py-3 font-semibold text-[#20345f]">{row.studio}</td>
                  <td className="border-b border-[#edf3ff] px-4 py-3 text-[#3f547a]">{row.availability.Creator ? "Yes" : "No"}</td>
                  <td className="border-b border-[#edf3ff] px-4 py-3 text-[#3f547a]">{row.availability.Professional ? "Yes" : "No"}</td>
                  <td className="border-b border-[#edf3ff] px-4 py-3 text-[#3f547a]">{row.availability.Business ? "Yes" : "No"}</td>
                  <td className="border-b border-[#edf3ff] px-4 py-3 text-[#3f547a]">{row.availability.Enterprise ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
