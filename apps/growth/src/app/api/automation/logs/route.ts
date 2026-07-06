import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { WorkflowService } from "@/apps/automation/services";

export async function GET(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const workflowId = req.nextUrl.searchParams.get("workflowId") || undefined;

  try {
    const data = await WorkflowService.logs(workflowId);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch logs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
