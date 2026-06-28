import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { ReportService } from "@/apps/analytics/services";

const service = new ReportService();

function isMissingTableError(message: string): boolean {
  return message.includes("does not exist in the current database");
}

export async function GET() {
  const { session, response } = await requireSession();
  if (!session) return response;

  try {
    const [data, preview] = await Promise.all([service.list(), service.runTablePreview()]);
    return NextResponse.json({ data, preview });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load reports";
    if (isMissingTableError(message)) {
      return NextResponse.json({ data: [], preview: [] });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { session, response } = await requireSession();
  if (!session) return response;

  try {
    const body = (await request.json()) as {
      id?: string;
      uuid?: string;
      companyId?: string | null;
      name?: string;
      query?: Record<string, unknown> | null;
    };

    if (Object.prototype.hasOwnProperty.call(body, "id") || Object.prototype.hasOwnProperty.call(body, "uuid")) {
      return NextResponse.json({ error: "Manual id/uuid input is not allowed" }, { status: 400 });
    }

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const data = await service.create({
      companyId: body.companyId,
      name: body.name.trim(),
      query: body.query,
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
