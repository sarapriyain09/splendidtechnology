import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { WorkflowService } from "@/apps/automation/services";
import type { WorkflowInput } from "@/apps/automation/types";

export async function GET(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const companyId = req.nextUrl.searchParams.get("companyId");

  try {
    const data = await WorkflowService.list(companyId || undefined);
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch workflows.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireSession();
  if (response) return response;

  const body = (await req.json().catch(() => ({}))) as Partial<WorkflowInput>;

  if (Object.prototype.hasOwnProperty.call(body, "id") || Object.prototype.hasOwnProperty.call(body, "uuid")) {
    return NextResponse.json({ error: "Manual id/uuid input is not allowed." }, { status: 400 });
  }

  try {
    const data = await WorkflowService.create({
      companyId: body.companyId ?? null,
      name: body.name ?? "",
      description: body.description ?? null,
      active: body.active ?? true,
      triggers: body.triggers ?? [],
      conditions: body.conditions ?? [],
      actions: body.actions ?? [],
    });

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create workflow.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
