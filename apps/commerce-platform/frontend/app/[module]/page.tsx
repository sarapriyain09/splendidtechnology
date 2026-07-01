import { notFound } from "next/navigation";

import { CostCalculatorWorkbench } from "@/components/cost-calculator-workbench";
import { DiscoveryWorkbench } from "@/components/discovery-workbench";
import { ProductCatalogPanel } from "@/components/product-catalog-panel";
import { EnterpriseShell } from "@/components/enterprise-shell";
import { MarketAnalysisWorkbench } from "@/components/market-analysis-workbench";
import { ManufacturingWorkbench } from "@/components/manufacturing-workbench";
import { ProductReadinessChecklist } from "@/components/product-readiness-checklist";
import { ReportsWorkbench } from "@/components/reports-workbench";
import { ReviewIntelligenceWorkbench } from "@/components/review-intelligence-workbench";
import { SettingsWorkbench } from "@/components/settings-workbench";
import { SuppliersWorkbench } from "@/components/suppliers-workbench";
import { fetchSavedAnalyses } from "@/lib/api";
import { PRODUCT_INTELLIGENCE_NAV_ITEMS, getProductNavByHref } from "@/lib/design-system/navigation";

type ModulePageProps = {
  params: Promise<{
    module: string;
  }>;
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
  products: "Manage product readiness, discovery, and lifecycle execution from one product workspace.",
  reports: "Review exportable analytics and portfolio performance reports.",
  settings: "Configure module defaults, scoring preferences, and operational controls.",
  research: "Capture research notes, supplier observations, and product risks.",
  suppliers: "Manage supplier relationships, MOQ, lead times, and quality checkpoints.",
  manufacturing: "Track design-to-manufacturing decisions and production readiness.",
  marketing: "Prepare brand assets, listings, and launch campaigns for each product project.",
  sales: "Track channels, orders, and post-launch performance by product project.",
};

function PlaceholderModuleContent({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-700">{description}</p>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        This module route is active and ready for deeper workflow wiring. Use this screen to continue implementation with API-integrated widgets.
      </div>
    </section>
  );
}

export default async function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.module;
  const href = `/${slug}`;
  const navItem = getProductNavByHref(href);

  if (!navItem || slug === "") {
    notFound();
  }

  const isProductsScreen = slug === "products";
  const isResearchScreen = slug === "research" || slug === "commerce";
  const isSuppliersScreen = slug === "suppliers" || slug === "operations";
  const isManufacturingScreen = slug === "manufacturing";
  const isMarketingScreen = slug === "marketing";
  const isSalesScreen = slug === "sales" || slug === "business";
  const isReportsScreen = slug === "reports";
  const isSettingsScreen = slug === "settings";
  const description = MODULE_DESCRIPTIONS[slug] ?? "Module screen";
  const savedAnalyses = isReportsScreen ? await fetchSavedAnalyses().catch(() => []) : [];

  return (
    <EnterpriseShell
      moduleName="Velynxia Product Studio"
      navItems={PRODUCT_INTELLIGENCE_NAV_ITEMS}
      activeNavHref={href}
    >
      {isProductsScreen ? (
        <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_320px_320px]">
          <DiscoveryWorkbench />
          <ProductReadinessChecklist />
          <ProductCatalogPanel />
        </div>
      ) : isResearchScreen ? (
        <ReviewIntelligenceWorkbench />
      ) : isSuppliersScreen ? (
        <SuppliersWorkbench />
      ) : isManufacturingScreen ? (
        <ManufacturingWorkbench />
      ) : isMarketingScreen ? (
        <CostCalculatorWorkbench />
      ) : isSalesScreen ? (
        <MarketAnalysisWorkbench />
      ) : isReportsScreen ? (
        <ReportsWorkbench items={savedAnalyses} />
      ) : isSettingsScreen ? (
        <SettingsWorkbench />
      ) : (
        <PlaceholderModuleContent title={navItem.label} description={description} />
      )}
    </EnterpriseShell>
  );
}
