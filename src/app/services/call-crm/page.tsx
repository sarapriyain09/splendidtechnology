import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CallCRM | Customer Call Management Software UK | Velynxia",
  description:
    "CallCRM helps businesses route, track, record, and follow up customer calls from one dashboard. Includes call routing, missed call alerts, call logs, and CRM sync.",
  alternates: {
    canonical: "/services/call-crm",
  },
};

const problems = [
  {
    title: "Missed Calls",
    desc: "Potential customers call, nobody answers, and opportunities are lost.",
  },
  {
    title: "Poor Call Routing",
    desc: "Calls are transferred multiple times before reaching the right person.",
  },
  {
    title: "No Visibility",
    desc: "Managers lack a clear view of call volume, missed calls, and response activity.",
  },
  {
    title: "Scattered Information",
    desc: "Call notes, follow-ups, and customer details are split across multiple tools.",
  },
];

const solutions = [
  "Smart call routing by team, department, or business rules",
  "Instant missed call alerts via email",
  "Call recording playback for quality and compliance",
  "Customer timeline with calls, notes, and activity",
  "CRM synchronization for aligned sales and support teams",
  "Team-wide call visibility and performance tracking",
];

const plans = [
  {
    name: "Starter",
    price: "GBP 49/mo",
    subtitle: "Perfect for small teams",
    features: [
      "Up to 2 users",
      "Inbound call routing",
      "Basic call logs",
      "Email notifications",
      "14-day call history",
      "Standard support",
    ],
  },
  {
    name: "Growth",
    price: "GBP 149/mo",
    subtitle: "Most popular for growing businesses",
    features: [
      "Up to 10 users",
      "Inbound and outbound workflows",
      "Call recording playback",
      "CRM integration",
      "Priority support",
      "90-day call history",
    ],
    featured: true,
  },
  {
    name: "Scale",
    price: "GBP 349/mo",
    subtitle: "Designed for larger teams",
    features: [
      "Up to 25 users",
      "Advanced routing and failover",
      "Team performance analytics",
      "Workflow automation",
      "Dedicated onboarding",
      "1-year call history",
    ],
  },
];

const faqs = [
  {
    q: "Do I need a Twilio account?",
    a: "Yes. CallCRM uses your Twilio account for telephony and call handling.",
  },
  {
    q: "Can I use my existing phone number?",
    a: "In most cases, yes. Existing numbers can usually be ported to Twilio.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams can be configured and operational within a few hours.",
  },
  {
    q: "Can we add users later?",
    a: "Yes. You can upgrade plan or add users at any time.",
  },
];

export default function CallCRMPage() {
  return (
    <div className="w-full">
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Services - CallCRM
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Never Miss a Customer Call Again
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            CallCRM helps your team route, track, record, and follow up customer calls with complete visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Book a Demo
            </Link>
            <Link
              href="/portfolio"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-black/10 shadow-xl">
            <Image
              src="/images/projects/callcrm.png"
              alt="CallCRM dashboard showing call activity and recent calls table"
              width={1280}
              height={768}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">The Problem</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {problems.map((item) => (
              <article key={item.title} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#0b1f3a]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">How CallCRM Solves It</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {solutions.map((item) => (
              <div key={item} className="rounded-xl border border-black/10 bg-white px-5 py-4 text-sm text-black/70">
                <span className="mr-2 font-bold text-green-600">+</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#f7f7f7] py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600">Pricing</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f3a]">Simple Plans for Growing Teams</h2>
            <p className="mt-3 text-sm text-black/60">Twilio usage charges are billed separately by Twilio. No long-term contracts.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-7 shadow-sm ${
                  plan.featured ? "border-green-500 bg-white shadow-lg" : "border-black/10 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    Most Popular
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">{plan.name}</p>
                <p className="mt-3 text-3xl font-bold text-[#0b1f3a]">{plan.price}</p>
                <p className="mt-1 text-xs text-black/50">{plan.subtitle}</p>
                <ul className="mt-6 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-black/70">
                      <span className="font-bold text-green-600">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-8 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold ${
                    plan.featured
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border border-black/20 text-[#0b1f3a] hover:bg-black/5"
                  }`}
                >
                  Start Free Trial
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/70">
            <p className="font-semibold text-[#0b1f3a]">Optional Add-ons</p>
            <ul className="mt-3 space-y-1">
              <li>Additional User: GBP 12/user/month</li>
              <li>Advanced Analytics Pack: GBP 39/month</li>
              <li>White-Glove Setup Service: GBP 299 one-time fee</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">Frequently Asked Questions</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <article key={faq.q} className="rounded-xl border border-black/10 bg-white p-5">
                <h3 className="text-sm font-bold text-[#0b1f3a]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{faq.a}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0b1f3a] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Ready to Improve Customer Call Management?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70">
            Stop losing opportunities due to missed calls and disconnected systems.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white hover:bg-green-700"
            >
              Book a Demo
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-white px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}