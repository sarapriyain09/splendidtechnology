"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AnalyticsCharts, DashboardRecord, DateRangeKey, KPIData, ReportRecord } from "../types";
import { DashboardGrid } from "./DashboardGrid";
import { DateFilter } from "./DateFilter";
import { ReportTable } from "./ReportTable";

type TabKey = "dashboard" | "reports" | "saved";

const EMPTY_KPI: KPIData = {
  totalLeads: 0,
  openOpportunities: 0,
  wonDeals: 0,
  revenue: 0,
  conversionRate: 0,
  tasksOverdue: 0,
};

const EMPTY_CHARTS: AnalyticsCharts = {
  salesPipelineFunnel: [],
  monthlyRevenueTrend: [],
  leadSourceDistribution: [],
  opportunitiesByStage: [],
  campaignPerformance: [],
};

interface AnalyticsWorkspaceProps {
  initialTab?: TabKey;
}

export function AnalyticsWorkspace({ initialTab = "dashboard" }: AnalyticsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [range, setRange] = useState<DateRangeKey>("30d");
  const [kpis, setKpis] = useState<KPIData>(EMPTY_KPI);
  const [charts, setCharts] = useState<AnalyticsCharts>(EMPTY_CHARTS);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [dashboards, setDashboards] = useState<DashboardRecord[]>([]);
  const [rows, setRows] = useState<Array<Record<string, string | number>>>([]);
  const [reportName, setReportName] = useState("");
  const [dashboardName, setDashboardName] = useState("Main Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = useMemo(
    () => [
      { key: "dashboard", label: "Dashboard" },
      { key: "reports", label: "Reports" },
      { key: "saved", label: "Saved Reports" },
    ] as Array<{ key: TabKey; label: string }>,
    [],
  );

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [kpiRes, chartsRes, reportsRes, dashboardsRes] = await Promise.all([
        fetch(`/api/analytics/kpis?range=${range}`, { cache: "no-store" }),
        fetch(`/api/analytics/charts?range=${range}`, { cache: "no-store" }),
        fetch("/api/analytics/reports", { cache: "no-store" }),
        fetch("/api/analytics/dashboards", { cache: "no-store" }),
      ]);

      if (!kpiRes.ok || !chartsRes.ok || !reportsRes.ok || !dashboardsRes.ok) {
        throw new Error("Failed to load analytics data");
      }

      const kpiJson = (await kpiRes.json()) as { data: KPIData };
      const chartsJson = (await chartsRes.json()) as { data: AnalyticsCharts };
      const reportsJson = (await reportsRes.json()) as { data: ReportRecord[]; preview?: Array<Record<string, string | number>> };
      const dashboardsJson = (await dashboardsRes.json()) as { data: DashboardRecord[] };

      setKpis(kpiJson.data);
      setCharts(chartsJson.data);
      setReports(reportsJson.data || []);
      setRows(reportsJson.preview || []);
      setDashboards(dashboardsJson.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [range]);

  async function createReport() {
    if (!reportName.trim()) return;
    const res = await fetch("/api/analytics/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: reportName.trim(),
        query: { metric: "opportunities", range },
      }),
    });

    if (!res.ok) {
      setError("Failed to create report");
      return;
    }

    setReportName("");
    await loadData();
  }

  async function createDashboard() {
    if (!dashboardName.trim()) return;
    const res = await fetch("/api/analytics/dashboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: dashboardName.trim(),
        layout: { columns: 12, version: 1 },
        widgets: [
          { widgetType: "kpi.total_leads", config: { span: 4 } },
          { widgetType: "chart.monthly_revenue", config: { span: 8 } },
        ],
      }),
    });

    if (!res.ok) {
      setError("Failed to create dashboard");
      return;
    }

    await loadData();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
          <p className="text-sm text-slate-500">KPI dashboards, charts and report exports.</p>
        </div>
        <DateFilter value={range} onChange={setRange} />
      </div>

      <div className="flex gap-2">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            type="button"
            variant={activeTab === tab.key ? "default" : "outline"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading analytics data...</p> : null}

      {!loading && activeTab === "dashboard" ? <DashboardGrid kpis={kpis} charts={charts} /> : null}

      {!loading && activeTab === "reports" ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Report</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row">
              <Input
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Pipeline by stage"
              />
              <Button type="button" onClick={createReport}>Save Report</Button>
            </CardContent>
          </Card>

          <ReportTable rows={rows} title="Report Preview" />
        </div>
      ) : null}

      {!loading && activeTab === "saved" ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 md:flex-row">
              <Input
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                placeholder="Executive Overview"
              />
              <Button type="button" onClick={createDashboard}>Create Dashboard</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Saved Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {!reports.length ? <p className="text-sm text-slate-500">No saved reports.</p> : null}
              {reports.length ? (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <div key={report.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <p className="font-medium text-slate-900">{report.name}</p>
                      <p className="text-xs text-slate-500">Updated {new Date(report.updatedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              {!dashboards.length ? <p className="text-sm text-slate-500">No dashboards yet.</p> : null}
              {dashboards.length ? (
                <div className="space-y-2">
                  {dashboards.map((dashboard) => (
                    <div key={dashboard.id} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <p className="font-medium text-slate-900">{dashboard.name}</p>
                      <p className="text-xs text-slate-500">Updated {new Date(dashboard.updatedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
