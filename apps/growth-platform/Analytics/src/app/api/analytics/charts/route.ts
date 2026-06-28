import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { AnalyticsMetricsService } from "@/apps/analytics/services";
import type { DateRangeKey } from "@/apps/analytics/types";

const service = new AnalyticsMetricsService();

function rangeFromRequest(request: NextRequest): DateRangeKey {
  const value = request.nextUrl.searchParams.get("range");
  if (value === "7d" || value === "30d" || value === "90d" || value === "12m") return value;
  return "30d";
}

export async function GET(request: NextRequest) {
  const { session, response } = await requireSession();
  if (!session) return response;

  try {
    const range = rangeFromRequest(request);
    const data = await service.getCharts(range);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load charts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
