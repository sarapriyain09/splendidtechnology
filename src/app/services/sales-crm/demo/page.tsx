import type { Metadata } from "next";
import Link from "next/link";
import { CrmDemoForm } from "./CrmDemoForm";

type Props = { searchParams: Promise<{ plan?: string }> };

export const metadata: Metadata = {
  title: "Request a Free CRM Demo",
  description:
    "Request free demo access to our Prospect-to-Quote CRM. We'll set up a personalised account on crm.velynxia.com tailored to your industry and sales process.",
  alternates: {
    canonical: "/services/sales-crm/demo",
  },
  openGraph: {
    type: "website",
    title: "Request a Free CRM Demo",
    description:
      "Get a personalised demo account on crm.velynxia.com — set up to match your industry and sales workflow.",
    url: "https://www.velynxia.com/services/sales-crm/demo",
  },
};

const included = [
  "Personalised setup — configured for your industry",
  "Live demo account on crm.velynxia.com",
  "Lead & contact management out of the box",
  "Quote generation tailored to your workflow",
  "Follow-up reminders & pipeline tracking",
  "Login details sent within 1 business day",
];

export default async function CrmDemoPage({ searchParams }: Props) {
  const { plan = "" } = await searchParams;
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <nav className="mb-6 flex items-center gap-2 text-xs text-white/40">
            <Link href="/services/sales-crm" className="hover:text-white/70 transition-colors">Sales CRM</Link>
            <span>/</span>
            <span className="text-white/70">Request Demo</span>
          </nav>
          <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
            Free Demo Access
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Try the CRM — Personalised for Your Business
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            We don&apos;t just hand you a generic login. We configure your demo account around your
            industry, your prospects, and your quoting process — then send you access within 1 business day.
          </p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {included.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm text-white/70">
                <span className="mt-0.5 font-bold text-green-400">✔</span> {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Form + Side info ── */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_340px]">

            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#0b1f3a]">Request your demo account</h2>
              <p className="mt-2 text-sm text-black/50">
                Tell us about your business and what you need — we&apos;ll customise the CRM before you log in.
              </p>
              <div className="mt-8">
                <CrmDemoForm defaultPlan={plan} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* What happens next */}
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600">What happens next</p>
                <ol className="mt-4 space-y-4">
                  {[
                    { step: "1", title: "You submit this form", desc: "Takes less than 2 minutes." },
                    { step: "2", title: "We configure your account", desc: "We set up your pipeline, quote templates, and prospect fields for your industry." },
                    { step: "3", title: "You receive login details", desc: "Email with your username and password for crm.velynxia.com." },
                    { step: "4", title: "We walk you through it", desc: "Optional 20-minute call to show you around and answer questions." },
                  ].map((item) => (
                    <li key={item.step} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">{item.step}</span>
                      <div>
                        <p className="text-sm font-semibold text-[#0b1f3a]">{item.title}</p>
                        <p className="text-xs text-black/50">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* No card required */}
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <p className="text-sm font-bold text-green-800">No payment required</p>
                <p className="mt-1 text-xs text-green-700">
                  Your demo is completely free. If you decide to continue, we&apos;ll agree the right plan together.
                </p>
              </div>

              {/* Plans reminder */}
              <div className="rounded-2xl border border-black/10 bg-[#f7f7f7] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-black/40">Plans from</p>
                <p className="mt-1 text-2xl font-bold text-[#0b1f3a]">£9<span className="text-sm font-normal text-black/40">/mo</span></p>
                <p className="mt-1 text-xs text-black/50">Or £99 setup + £15/mo with full onboarding.</p>
                <Link href="/services/sales-crm#pricing" className="mt-3 inline-block text-xs font-semibold text-green-600 hover:underline">
                  View all plans →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
