import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { WorkflowService } from "@/apps/automation/services";
import type { WorkflowInput } from "@/apps/automation/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;

  try {
    const data = await WorkflowService.getById(id);
    if (!data) {
      return NextResponse.json({ error: "Workflow not found." }, { status: 404 });
    }
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch workflow.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Partial<WorkflowInput>;

  if (Object.prototype.hasOwnProperty.call(body, "id") || Object.prototype.hasOwnProperty.call(body, "uuid")) {
    return NextResponse.json({ error: "Manual id/uuid input is not allowed." }, { status: 400 });
  }

  try {
    const data = await WorkflowService.update(id, {
      companyId: body.companyId ?? null,
      name: body.name ?? "",
      description: body.description ?? null,
      active: body.active ?? true,
      triggers: body.triggers ?? [],
      conditions: body.conditions ?? [],
      actions: body.actions ?? [],
    });
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update workflow.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: RouteParams) {
  const { response } = await requireSession();
  if (response) return response;

  const { id } = await params;

  try {
    await WorkflowService.remove(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete workflow.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
