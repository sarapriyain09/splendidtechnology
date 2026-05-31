import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ExpApp — Free Household Budget & Net Worth Planner | Splendid Technology",
  description:
    "ExpApp is a free household budget planner and net worth tracker. Capture monthly income, track expenses, manage EMI loan repayments, and see exactly what you have left over — free forever.",
  keywords: [
    "free household budget planner uk",
    "free net worth tracker uk",
    "monthly expense tracker uk",
    "emi budget planner",
    "personal finance app uk",
    "expapp",
    "free money planner",
    "income and expense tracker uk",
  ],
  alternates: { canonical: "/products/expapp-money-planner" },
};

const features = [
  {
    icon: "💰",
    title: "Budget Planner",
    desc: "Capture all your monthly income sources and household expenses in one place. See your total income, expenses, EMI commitments, and leftover cash at a glance.",
  },
  {
    icon: "📈",
    title: "Net Worth Tracker",
    desc: "Track your household net worth over time. Add assets and liabilities to get a clear picture of your overall financial position.",
  },
  {
    icon: "🏦",
    title: "EMI & Loan Tracking",
    desc: "Log all your monthly EMI payments — mortgages, car finance, personal loans — and see the total debt repayment obligation alongside your budget.",
  },
  {
    icon: "📅",
    title: "Monthly Expense History",
    desc: "Record individual expenses day-by-day and review your spending history month by month to spot trends and stay on track.",
  },
  {
    icon: "🔐",
    title: "Secure Accounts",
    desc: "Sign up for a free account to save your data securely and access your budget from any device — your data stays yours.",
  },
  {
    icon: "✅",
    title: "Free Forever",
    desc: "ExpApp is completely free to use with no hidden charges, no paywalls, and no subscription. Household budgeting made simple and accessible.",
  },
];

const howItWorks = [
  { step: "1", title: "Create a free account", desc: "Sign up in seconds — no credit card required." },
  { step: "2", title: "Add your income", desc: "Enter your salary, rental income, freelance earnings, or any other monthly income." },
  { step: "3", title: "Log your expenses & EMIs", desc: "Add fixed and variable expenses alongside any loan or EMI commitments." },
  { step: "4", title: "See what's left over", desc: "Instantly see your monthly surplus, net worth, and total EMI burden on one clean dashboard." },
];

export default function ExpAppPage() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="bg-[#0b1f3a] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-green-400">
              Product — Free
            </p>
            <p className="inline-block rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-blue-300">
              Live
            </p>
          </div>
          <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            ExpApp — Household Budget &amp; Net Worth Planner
          </h1>
          <p className="mt-2 text-lg font-medium text-green-400">Free personal finance app · No subscription required</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-7 text-white/80">
            A free web app for managing your household finances. Track monthly income, expenses,
            EMI repayments, and net worth — all in one simple dashboard. No spreadsheets, no
            complexity, no cost.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://expapp.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Open ExpApp — It&apos;s Free
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing callout */}
      <section className="bg-green-50 border-b border-green-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-green-800">100% Free — no credit card, no subscription</p>
            <p className="mt-0.5 text-xs text-green-700">ExpApp is free forever. Create an account and start budgeting in minutes.</p>
          </div>
          <a
            href="https://expapp.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-green-700"
          >
            Get Started Free &rarr;
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#0b1f3a]">What ExpApp Does</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">
            Everything you need to stay on top of your household finances, without the complexity of traditional personal finance tools.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-3 text-base font-bold text-[#0b1f3a]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-black/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f7f7f7] py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">How It Works</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((s) => (
              <div key={s.step} className="rounded-2xl border border-black/10 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0b1f3a] text-sm font-bold text-white">
                  {s.step}
                </span>
                <h3 className="mt-4 text-sm font-bold text-[#0b1f3a]">{s.title}</h3>
                <p className="mt-2 text-xs leading-5 text-black/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracked items */}
      <section className="py-14">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0b1f3a]">What You Can Track</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-green-700">Income</h3>
              <ul className="mt-3 space-y-1.5">
                {["Salary & wages", "Rental income", "Freelance earnings", "Investment dividends", "Benefits & allowances"].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="font-bold text-green-600">✔</span> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-700">Expenses</h3>
              <ul className="mt-3 space-y-1.5">
                {["Household bills", "Groceries & food", "Subscriptions", "Insurance", "Transport costs"].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="font-bold text-amber-500">✔</span> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-700">EMI &amp; Loans</h3>
              <ul className="mt-3 space-y-1.5">
                {["Mortgage repayments", "Car finance", "Personal loans", "Credit card minimums", "Student loan payments"].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-black/70">
                    <span className="font-bold text-blue-500">✔</span> {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0b1f3a] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-green-400">Free to Use</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-bold text-white">
            Start budgeting smarter today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/60">
            ExpApp takes minutes to set up. No spreadsheets, no complex software — just a
            clear view of your household finances. Free forever.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://expapp.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-green-600 px-7 py-3 font-bold text-white hover:bg-green-700"
            >
              Open ExpApp Free
            </a>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-7 py-3 font-bold text-white hover:bg-white/10"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
