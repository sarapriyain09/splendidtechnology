import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { EnterpriseShell } from "@/components/enterprise-shell";
import { fetchDashboardOverview } from "@/lib/api";
import { PRODUCT_INTELLIGENCE_NAV_ITEMS } from "@/lib/design-system/navigation";

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
    <EnterpriseShell
      moduleName="Product Studio"
      navItems={PRODUCT_INTELLIGENCE_NAV_ITEMS}
      activeNavHref="/"
    >
      <div className="flex h-full min-h-0 flex-col gap-3">
        <DashboardWorkspace overview={data} />
      </div>
    </EnterpriseShell>
  );
}
