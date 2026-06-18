import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Splendid Growth Platform Pricing | Splendid Technology",
  description:
    "Simple modular pricing for SMEs: base CRM plus Sales, CallCRM, Marketing, Automation, and Analytics apps.",
  alternates: {
    canonical: "/pricing",
  },
};

const platformPlans = [
  {
    name: "Starter",
    price: "£19/user/month",
    idealFor: "Ideal for small businesses starting with customer management.",
    includedApps: ["CRM"],
    features: [
      "Contacts",
      "Companies",
      "Activities",
      "Tasks",
      "Notes",
      "Documents",
    ],
  },
  {
    name: "Growth",
    price: "£39/user/month",
    idealFor: "Ideal for growing sales teams.",
    includedApps: ["CRM", "Sales"],
    features: [
      "Leads",
      "Opportunities",
      "Pipeline",
      "Quotations",
      "Forecasts",
    ],
  },
  {
    name: "Engagement",
    price: "£59/user/month",
    idealFor: "Ideal for outbound sales teams.",
    includedApps: ["CRM", "Sales", "CallCRM"],
    features: [
      "Click-to-call",
      "Call campaigns",
      "Call logging",
      "Agent dashboard",
      "Telephony charges separate",
    ],
  },
  {
    name: "Marketing Pro",
    price: "£79/user/month",
    idealFor: "Ideal for companies generating leads continuously.",
    includedApps: ["CRM", "Sales", "CallCRM", "Marketing"],
    features: [
      "LinkedIn campaigns",
      "Email campaigns",
      "SMS campaigns",
      "Forms",
      "Landing pages",
      "Newsletters",
    ],
  },
  {
    name: "AI Growth",
    price: "£99/user/month",
    idealFor: "Ideal for companies wanting AI-driven growth.",
    includedApps: ["CRM", "Sales", "CallCRM", "Marketing", "Automation"],
    features: [
      "AI assistant",
      "Meeting summaries",
      "Email generation",
      "Workflow builder",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    idealFor: "Designed for complex teams and advanced rollout requirements.",
    includedApps: ["All apps"],
    features: [
      "Analytics",
      "Custom integrations",
      "API access",
      "Multi-company",
      "White-label",
      "Dedicated support",
    ],
  },
];

const offerPoints = [
  "14-day free trial",
  "No setup fee",
  "Monthly or annual billing",
  "Annual plan = 2 months free",
];

export default function PricingPage() {
  return (
    <div className="bg-[#f7faff]">
      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">Splendid Growth Platform Pricing</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Simple, Modular Pricing for SMEs</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Start with a base platform and scale with the apps you need. Designed to stay clear, flexible, and affordable.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0b1f3a]">Platform Plans</h2>
        <p className="mt-2 text-sm text-slate-600">Choose the plan that matches your current growth stage.</p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {platformPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.name === "AI Growth"
                  ? "border-green-500 bg-[#0b1f3a] text-white shadow-lg"
                  : "border-[#d8e4ff] bg-white"
              }`}
            >
              {plan.name === "AI Growth" && (
                <span className="absolute -top-3 left-6 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                  Recommended
                </span>
              )}
              <p className={`text-xs font-semibold uppercase tracking-widest ${plan.name === "AI Growth" ? "text-green-300" : "text-[#4c6188]"}`}>
                {plan.name}
              </p>
              <p className={`mt-2 text-3xl font-bold ${plan.name === "AI Growth" ? "text-white" : "text-[#0b1f3a]"}`}>
                {plan.price}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {plan.includedApps.map((app) => (
                  <span
                    key={app}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      plan.name === "AI Growth" ? "bg-white/15 text-white" : "bg-[#edf4ff] text-[#23457e]"
                    }`}
                  >
                    {app}
                  </span>
                ))}
              </div>
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className={`flex items-start gap-2 text-sm ${plan.name === "AI Growth" ? "text-slate-200" : "text-slate-700"}`}>
                    <span className="mt-0.5 text-green-500">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <p className={`mt-4 text-sm ${plan.name === "AI Growth" ? "text-slate-300" : "text-slate-600"}`}>
                {plan.idealFor}
              </p>
              <Link
                href="/contact"
                className={`mt-8 block rounded-full py-2.5 text-center text-sm font-semibold ${
                  plan.name === "AI Growth"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border border-[#0b1f3a] text-[#0b1f3a] hover:bg-slate-50"
                }`}
              >
                {index === platformPlans.length - 1 ? "Talk to Sales" : "Start Free Trial"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#0b1f3a]">Included in Every Plan</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {offerPoints.map((item) => (
            <div key={item} className="rounded-xl border border-[#dbe7ff] bg-white px-4 py-3 text-sm font-medium text-[#2a446f]">
              &#10003; {item}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">Competitive Positioning</p>
          <h2 className="text-3xl font-bold">Built to Be Simpler and More Affordable for SMEs</h2>
          <p className="mt-4 max-w-3xl text-slate-300">
            This pricing keeps Splendid below enterprise-heavy platforms while differentiating through stronger outbound engagement with CallCRM and integrated workflows.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Start 14-Day Free Trial
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
