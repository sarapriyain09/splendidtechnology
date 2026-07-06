import type { Prisma } from "@prisma/client";
import { prisma } from "@/common/services";
import type { ReportRecord } from "../types";

function toInputJson(value: Record<string, unknown> | null | undefined): Prisma.InputJsonValue | undefined {
  if (value === null || value === undefined) return undefined;
  return value as Prisma.InputJsonValue;
}

function toRecord(item: {
  id: string;
  companyId: string | null;
  name: string;
  query: Prisma.JsonValue | null;
  createdAt: Date;
  updatedAt: Date;
}): ReportRecord {
  return {
    id: item.id,
    companyId: item.companyId,
    name: item.name,
    query: (item.query as Record<string, unknown> | null) ?? null,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export class ReportService {
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
    if (!(await this.tableExists("reports"))) {
      return [];
    }
    const data = await prisma.report.findMany({
      where: { companyId: companyId || undefined },
      orderBy: { updatedAt: "desc" },
    });
    return data.map(toRecord);
  }

  async create(input: {
    companyId?: string | null;
    name: string;
    query?: Record<string, unknown> | null;
  }) {
    const created = await prisma.report.create({
      data: {
        companyId: input.companyId || null,
        name: input.name,
        query: toInputJson(input.query),
      },
    });
    return toRecord(created);
  }

  async getById(id: string) {
    const report = await prisma.report.findUnique({ where: { id } });
    return report ? toRecord(report) : null;
  }

  async update(
    id: string,
    input: {
      companyId?: string | null;
      name?: string;
      query?: Record<string, unknown> | null;
    },
  ) {
    const updated = await prisma.report.update({
      where: { id },
      data: {
        companyId: input.companyId,
        name: input.name,
        query: toInputJson(input.query),
      },
    });
    return toRecord(updated);
  }

  async remove(id: string) {
    await prisma.report.delete({ where: { id } });
  }

  async runTablePreview(companyId?: string | null) {
    const rows = await prisma.opportunity.findMany({
      where: { companyId: companyId || undefined },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: {
        name: true,
        stage: true,
        amount: true,
        updatedAt: true,
        company: { select: { name: true } },
      },
    });

    return rows.map((row) => ({
      name: row.name,
      company: row.company?.name ?? "-",
      stage: row.stage,
      amount: row.amount ? Number(row.amount.toString()) : 0,
      updatedAt: row.updatedAt.toISOString(),
    }));
  }
}
