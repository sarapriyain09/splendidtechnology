import type { Prisma } from "@prisma/client";
import { prisma } from "@/common/services";
import type { DashboardRecord, WidgetRecord } from "../types";

function toInputJson(value: Record<string, unknown> | null | undefined): Prisma.InputJsonValue | undefined {
  if (value === null || value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}

function toDashboardRecord(item: {
  id: string;
  companyId: string | null;
  name: string;
  layout: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}): DashboardRecord {
  return {
    id: item.id,
    companyId: item.companyId,
    name: item.name,
    layout: (item.layout as Record<string, unknown> | null) ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

function toWidgetRecord(item: {
  id: string;
  dashboardId: string;
  widgetType: string;
  config: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}): WidgetRecord {
  return {
    id: item.id,
    dashboardId: item.dashboardId,
    widgetType: item.widgetType,
    config: (item.config as Record<string, unknown> | null) ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export class DashboardService {
  private async tableExists(tableName: string): Promise<boolean> {
    const rows = await prisma.$queryRaw<Array<{ exists: boolean }>>`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = ${tableName}
      ) AS "exists"
    `;
    return rows[0]?.exists ?? false;
  }

  async list(companyId?: string | null) {
    if (!(await this.tableExists("dashboards"))) {
      return [];
    }
    const data = await prisma.dashboard.findMany({
      where: { companyId: companyId || undefined },
      include: { widgets: true },
      orderBy: { updatedAt: "desc" },
    });

    return data.map((item) => ({
      ...toDashboardRecord(item),
      widgets: item.widgets.map(toWidgetRecord),
    }));
  }

  async create(input: {
    companyId?: string | null;
    name: string;
    layout?: Record<string, unknown> | null;
    widgets?: Array<{ widgetType: string; config?: Record<string, unknown> | null }>;
  }) {
    const created = await prisma.dashboard.create({
      data: {
        companyId: input.companyId || null,
        name: input.name,
        layout: toInputJson(input.layout),
        widgets: input.widgets?.length
          ? {
              create: input.widgets.map((widget) => ({
                widgetType: widget.widgetType,
                config: toInputJson(widget.config),
              })),
            }
          : undefined,
      },
      include: { widgets: true },
    });

    return {
      ...toDashboardRecord(created),
      widgets: created.widgets.map(toWidgetRecord),
    };
  }

  async update(
    id: string,
    input: {
      companyId?: string | null;
      name?: string;
      layout?: Record<string, unknown> | null;
      widgets?: Array<{ widgetType: string; config?: Record<string, unknown> | null }>;
    },
  ) {
    await prisma.dashboard.update({
      where: { id },
      data: {
        companyId: input.companyId,
        name: input.name,
        layout: toInputJson(input.layout),
      },
    });

    if (input.widgets) {
      await prisma.widget.deleteMany({ where: { dashboardId: id } });
      if (input.widgets.length) {
        await prisma.widget.createMany({
          data: input.widgets.map((widget) => ({
            dashboardId: id,
            widgetType: widget.widgetType,
            config: toInputJson(widget.config),
          })),
        });
      }
    }

    return this.getById(id);
  }

  async getById(id: string) {
    const dashboard = await prisma.dashboard.findUnique({
      where: { id },
      include: { widgets: true },
    });

    if (!dashboard) return null;

    return {
      ...toDashboardRecord(dashboard),
      widgets: dashboard.widgets.map(toWidgetRecord),
    };
  }

  async remove(id: string) {
    await prisma.dashboard.delete({ where: { id } });
  }
}
