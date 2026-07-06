import type { KPIData, AnalyticsCharts } from "../types";
import { KPICard } from "./KPICard";
import { ChartCard } from "./ChartCard";

interface DashboardGridProps {
  kpis: KPIData;
  charts: AnalyticsCharts;
}

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DashboardGrid({ kpis, charts }: DashboardGridProps) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <KPICard title="Total Leads" value={String(kpis.totalLeads)} />
        <KPICard title="Open Opportunities" value={String(kpis.openOpportunities)} />
        <KPICard title="Won Deals" value={String(kpis.wonDeals)} />
        <KPICard title="Revenue" value={money(kpis.revenue)} />
        <KPICard title="Conversion Rate" value={`${kpis.conversionRate.toFixed(2)}%`} />
        <KPICard title="Tasks Overdue" value={String(kpis.tasksOverdue)} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard
          title="Sales Pipeline Funnel"
          variant="bar"
          data={charts.salesPipelineFunnel}
          xKey="stage"
          yKey="count"
        />
        <ChartCard
          title="Monthly Revenue Trend"
          variant="line"
          data={charts.monthlyRevenueTrend}
          xKey="month"
          yKey="revenue"
        />
        <ChartCard
          title="Lead Source Distribution"
          variant="pie"
          data={charts.leadSourceDistribution}
          xKey="name"
          yKey="value"
        />
        <ChartCard
          title="Opportunities by Stage"
          variant="bar"
          data={charts.opportunitiesByStage}
          xKey="name"
          yKey="value"
        />
        <ChartCard
          title="Campaign Performance"
          variant="bar"
          data={charts.campaignPerformance}
          xKey="channel"
          yKey="campaigns"
          secondaryYKey="sent"
        />
      </section>
    </div>
  );
}
