import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Call Management CRM for UK SMEs | Splendid Technology",
  description:
    "Call management CRM for UK SMEs to reduce missed calls, improve follow-up, and track customer conversations in one place.",
  alternates: {
    canonical: "/call-management-crm",
  },
};

export default function CallManagementCrmPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[#0b1f3a]">Call Management CRM</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
        Missed calls and unlogged conversations often become lost opportunities. A call management
        CRM helps your team route calls, log outcomes, and trigger follow-up tasks automatically.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-[#f7f7f7] p-6">
        <h2 className="text-xl font-bold text-[#0b1f3a]">Business impact</h2>
        <ul className="mt-4 space-y-2 text-sm text-black/75">
          <li>1. Fewer missed callbacks and delayed responses</li>
          <li>2. Better visibility of customer conversations</li>
          <li>3. Faster handoff from calls to quotations</li>
          <li>4. Stronger accountability across sales teams</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services/call-crm" className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3d91]">
          Explore Call CRM
        </Link>
        <Link href="/demo" className="rounded-lg border border-[#0b1f3a]/30 px-5 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5">
          Book a CRM Demo
        </Link>
      </div>
    </main>
  );
}
