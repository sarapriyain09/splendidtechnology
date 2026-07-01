import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import { KpiCard } from "@/components/kpi-card";
import { fetchDashboardOverview } from "@/lib/api";

export default async function HomePage() {
  const data = await fetchDashboardOverview().catch(() => ({
    products_analysed: 0,
    top_opportunities: 0,
    avg_profit_estimate: 0,
    avg_competition: 0,
    avg_product_score: 0,
    b2b_opportunities: 0,
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
      <section className="rounded-3xl bg-slateDeep px-7 py-10 text-white shadow-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-mint">Velynxia Product Intelligence AI</p>
        <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Build Better Products for Amazon and B2B</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">
          Analyze market demand, competition, manufacturability, and profit potential across Amazon UK, EU, US,
          and B2B verticals without violating marketplace terms.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard title="Products Analysed" value={String(data.products_analysed)} hint="Total opportunities processed" />
        <KpiCard title="Top Opportunities" value={String(data.top_opportunities)} hint="Scored above 75" />
        <KpiCard title="Profit Estimate" value={`${data.avg_profit_estimate}%`} hint="Average modeled margin" />
        <KpiCard title="Competition" value={String(data.avg_competition)} hint="Average competition score" />
        <KpiCard title="Product Score" value={String(data.avg_product_score)} hint="Weighted opportunity score" />
        <KpiCard title="B2B Opportunities" value={String(data.b2b_opportunities)} hint="High-fit B2B candidates" />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Analysis Pipeline</h2>
          <ol className="mt-4 space-y-2 text-sm text-slate-700">
            <li>1. Product Discovery across allowed sources and user data imports.</li>
            <li>2. Review Analysis for pain points, quality failures, and packaging issues.</li>
            <li>3. Opportunity AI for improved product concepts and family roadmap.</li>
            <li>4. Manufacturing and Profit modeling by country and market.</li>
            <li>5. Competition and weighted Product Scoring for launch decisions.</li>
          </ol>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Core Modules Enabled</h2>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {[
              "Discovery",
              "Review AI",
              "Opportunity AI",
              "Costing",
              "Competition",
              "Scoring",
              "B2B AI",
              "Product Family",
              "Packaging",
              "Marketing",
              "Reports",
              "Product DB",
            ].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </article>
      </section>

      <DiscoveryWorkbench />
    </main>
  );
}
