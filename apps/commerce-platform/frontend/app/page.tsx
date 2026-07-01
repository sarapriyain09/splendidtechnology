import { EnterpriseShell } from "@/components/enterprise-shell";
import { MissionHomeWorkspace } from "@/components/mission-home-workspace";
import { fetchSavedAnalyses } from "@/lib/api";
import { PRODUCT_INTELLIGENCE_NAV_ITEMS } from "@/lib/design-system/navigation";

export default async function HomePage() {
  const recentItems = await fetchSavedAnalyses().catch(() => []);

  return (
    <EnterpriseShell
      moduleName="Velynxia Product Studio"
      navItems={PRODUCT_INTELLIGENCE_NAV_ITEMS}
      activeNavHref="/"
    >
      <div className="flex h-full min-h-0 flex-col gap-3">
        <MissionHomeWorkspace recentItems={recentItems} />
      </div>
    </EnterpriseShell>
  );
}
