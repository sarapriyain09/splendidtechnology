import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/common/auth";
import { AutomationEngine } from "@/apps/automation/services";
import type { WorkflowEvent } from "@/apps/automation/types";

export async function POST(req: NextRequest) {
  const { session, response } = await requireSession();
  if (response) return response;

  const body = (await req.json().catch(() => ({}))) as Partial<WorkflowEvent>;

  if (!body.eventName) {
    return NextResponse.json({ error: "eventName is required." }, { status: 400 });
  }

  try {
    const result = await AutomationEngine.processEvent(
      {
        eventName: body.eventName,
        companyId: body.companyId ?? null,
        payload: body.payload ?? {},
      },
      session.user.id ?? null,
    );

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process automation event.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
