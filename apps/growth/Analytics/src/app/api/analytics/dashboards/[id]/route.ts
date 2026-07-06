import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { DashboardService } from "@/apps/analytics/services";

const service = new DashboardService();

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSession();
  if (!session) return response;

  const { id } = await ctx.params;
  const data = await service.getById(id);
  if (!data) return NextResponse.json({ error: "Dashboard not found" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSession();
  if (!session) return response;

  try {
    const { id } = await ctx.params;
    const body = (await request.json()) as {
      id?: string;
      uuid?: string;
      companyId?: string | null;
      name?: string;
      layout?: Record<string, unknown> | null;
      widgets?: Array<{ widgetType: string; config?: Record<string, unknown> | null }>;
    };

    if (Object.prototype.hasOwnProperty.call(body, "id") || Object.prototype.hasOwnProperty.call(body, "uuid")) {
      return NextResponse.json({ error: "Manual id/uuid input is not allowed" }, { status: 400 });
    }

    const data = await service.update(id, body);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update dashboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { session, response } = await requireSession();
  if (!session) return response;

  const { id } = await ctx.params;
  await service.remove(id);
  return NextResponse.json({ ok: true });
}
