import { Prisma } from "@prisma/client";
import { prisma } from "@/common/services";
import type { AnalyticsCharts, DateRangeKey, KPIData } from "../types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toNumber(value: Prisma.Decimal | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number(value.toString());
}

function getRangeStart(range: DateRangeKey): Date {
  const now = new Date();
  if (range === "7d") return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === "30d") return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (range === "90d") return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  return new Date(now.getFullYear() - 1, now.getMonth(), 1);
}

function buildWindowWhere(companyId: string | null | undefined, range: DateRangeKey) {
  const gte = getRangeStart(range);
  return {
    companyId: companyId || undefined,
    createdAt: { gte },
  } as const;
}

export class AnalyticsMetricsService {
  async getKpis(range: DateRangeKey, companyId?: string | null): Promise<KPIData> {
    const leadWhere = buildWindowWhere(companyId, range);
    const opportunityWhere = buildWindowWhere(companyId, range);

    const [totalLeads, openOpportunities, wonDeals, overdueTasks, revenueAgg] = await Promise.all([
      prisma.lead.count({ where: leadWhere }),
      prisma.opportunity.count({
        where: {
          ...opportunityWhere,
          stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] },
        },
      }),
      prisma.opportunity.count({
        where: {
          ...opportunityWhere,
          stage: "CLOSED_WON",
        },
      }),
      prisma.task.count({
        where: {
          companyId: companyId || undefined,
          dueAt: { lt: new Date() },
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          companyId: companyId || undefined,
          status: { in: ["CONFIRMED", "FULFILLED"] },
          placedAt: { gte: getRangeStart(range) },
        },
      }),
    ]);

    const revenue = toNumber(revenueAgg._sum.total);
    const conversionRate = totalLeads > 0 ? (wonDeals / totalLeads) * 100 : 0;

    return {
      totalLeads,
      openOpportunities,
      wonDeals,
      revenue,
      conversionRate: Number(conversionRate.toFixed(2)),
      tasksOverdue: overdueTasks,
    };
  }

  async getCharts(range: DateRangeKey, companyId?: string | null): Promise<AnalyticsCharts> {
    const from = getRangeStart(range);

    const [opportunities, leadsBySource, opportunitiesByStage, campaigns, emailCampaigns, smsCampaigns, orders] =
      await Promise.all([
        prisma.opportunity.findMany({
          where: {
            companyId: companyId || undefined,
            createdAt: { gte: from },
          },
          select: { stage: true, amount: true },
        }),
        prisma.lead.groupBy({
          by: ["source"],
          _count: { _all: true },
          where: {
            companyId: companyId || undefined,
            createdAt: { gte: from },
          },
        }),
        prisma.opportunity.groupBy({
          by: ["stage"],
          _count: { _all: true },
          where: {
            companyId: companyId || undefined,
            createdAt: { gte: from },
          },
        }),
        prisma.campaign.groupBy({
          by: ["channel"],
          _count: { _all: true },
          where: { createdAt: { gte: from } },
        }),
        prisma.emailCampaign.count({ where: { sentAt: { gte: from } } }),
        prisma.sMSCampaign.count({ where: { sentAt: { gte: from } } }),
        prisma.order.findMany({
          where: {
            companyId: companyId || undefined,
            status: { in: ["CONFIRMED", "FULFILLED"] },
            placedAt: { gte: from },
          },
          select: { placedAt: true, total: true },
        }),
      ]);

    const salesPipelineFunnel = opportunities.reduce<Array<{ stage: string; count: number; amount: number }>>(
      (acc, row) => {
        const stage = row.stage;
        const existing = acc.find((item) => item.stage === stage);
        if (existing) {
          existing.count += 1;
          existing.amount += toNumber(row.amount);
        } else {
          acc.push({ stage, count: 1, amount: toNumber(row.amount) });
        }
        return acc;
      },
      [],
    );

    const monthlyMap = new Map<string, number>();
    for (let i = 0; i < 12; i += 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyMap.set(key, 0);
    }
    for (const order of orders) {
      if (!order.placedAt) continue;
      const key = `${order.placedAt.getFullYear()}-${String(order.placedAt.getMonth() + 1).padStart(2, "0")}`;
      if (!monthlyMap.has(key)) continue;
      monthlyMap.set(key, (monthlyMap.get(key) || 0) + toNumber(order.total));
    }

    const monthlyRevenueTrend = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([key, revenue]) => {
        const [year, month] = key.split("-");
        const monthLabel = MONTHS[Math.max(0, Number(month) - 1)] || month;
        return { month: `${monthLabel} ${year.slice(2)}`, revenue: Number(revenue.toFixed(2)) };
      });

    const leadSourceDistribution = leadsBySource
      .filter((row) => row.source)
      .map((row) => ({ name: row.source || "unknown", value: row._count._all }));

    const opportunitiesByStageData = opportunitiesByStage.map((row) => ({
      name: row.stage,
      value: row._count._all,
    }));

    const sentByChannel: Record<string, number> = {
      EMAIL: emailCampaigns,
      SMS: smsCampaigns,
    };

    const campaignPerformance = campaigns.map((row) => ({
      channel: row.channel,
      campaigns: row._count._all,
      sent: sentByChannel[row.channel] || 0,
    }));

    return {
      salesPipelineFunnel,
      monthlyRevenueTrend,
      leadSourceDistribution,
      opportunitiesByStage: opportunitiesByStageData,
      campaignPerformance,
    };
  }
}
