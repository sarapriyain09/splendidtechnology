import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { prisma } from "@/common/services";
import { DashboardService } from "@/apps/analytics/services";

const service = new DashboardService();

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { session, response } = await requireSession();
  if (!session) return response;

  const { uuid } = await params;

  try {
    const table = await prisma.$queryRawUnsafe<Array<{ reg: string | null }>>(
      "select to_regclass('dashboards')::text as reg",
    );
    if (!table[0]?.reg) {
      return NextResponse.json({ error: "Dashboards table not available." }, { status: 404 });
    }

    const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
      'SELECT id FROM dashboards WHERE uuid = $1::uuid LIMIT 1',
      uuid,
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
    }

    const data = await service.getById(rows[0].id);
    if (!data) {
      return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch dashboard";
    if (message.toLowerCase().includes("invalid input syntax for type uuid")) {
      return NextResponse.json({ error: "Invalid uuid format." }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
