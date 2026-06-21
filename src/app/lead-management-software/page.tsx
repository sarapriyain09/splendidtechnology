import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lead Management Software UK | Velynxia",
  description:
    "Lead management software for UK SMEs to capture enquiries, assign owners, and improve conversion through consistent follow-up.",
  alternates: {
    canonical: "/lead-management-software",
  },
};

export default function LeadManagementSoftwarePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-[#0b1f3a]">Lead Management Software for UK SMEs</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-black/70">
        If leads are managed in spreadsheets and inboxes, follow-up gets missed. Lead management
        software gives your team a single workflow to capture, qualify, assign, and convert enquiries.
      </p>

      <div className="mt-8 rounded-2xl border border-black/10 bg-[#f7f7f7] p-6">
        <h2 className="text-xl font-bold text-[#0b1f3a]">What to implement first</h2>
        <ul className="mt-4 space-y-2 text-sm text-black/75">
          <li>1. Lead source tracking and qualification fields</li>
          <li>2. Pipeline stages with clear next-step rules</li>
          <li>3. Automated reminders for follow-up</li>
          <li>4. Weekly dashboard review for conversion performance</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/services/sales-crm" className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0b3d91]">
          See CRM Implementation
        </Link>
        <a href="https://democrm.velynxia.com/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-[#0b1f3a]/30 px-5 py-3 text-sm font-semibold text-[#0b1f3a] hover:bg-[#0b1f3a]/5">
          Try CRM Demo
        </a>
      </div>
    </main>
  );
}
