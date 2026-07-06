export type DateRangeKey = "7d" | "30d" | "90d" | "12m";

export interface KPIData {
  totalLeads: number;
  openOpportunities: number;
  wonDeals: number;
  revenue: number;
  conversionRate: number;
  tasksOverdue: number;
}

export interface FunnelPoint {
  stage: string;
  count: number;
  amount: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
}

export interface DistributionPoint {
  name: string;
  value: number;
}

export interface CampaignPerformancePoint {
  channel: string;
  campaigns: number;
  sent: number;
}

export interface AnalyticsCharts {
  salesPipelineFunnel: FunnelPoint[];
  monthlyRevenueTrend: MonthlyRevenuePoint[];
  leadSourceDistribution: DistributionPoint[];
  opportunitiesByStage: DistributionPoint[];
  campaignPerformance: CampaignPerformancePoint[];
}

export interface DashboardRecord {
  id: string;
  companyId: string | null;
  name: string;
  layout: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface WidgetRecord {
  id: string;
  dashboardId: string;
  widgetType: string;
  config: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportRecord {
  id: string;
  companyId: string | null;
  name: string;
  query: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}
