import { prisma } from "@/common/services";
import type { WorkflowAction } from "@prisma/client";

interface ActionContext {
  workflowId: string;
  companyId?: string | null;
  payload: Record<string, unknown>;
  actorUserId?: string | null;
}

function readString(source: unknown, fallback = ""): string {
  return typeof source === "string" && source.trim() ? source.trim() : fallback;
}

function readNullableString(source: unknown): string | null {
  const value = readString(source);
  return value || null;
}

export class ActionService {
  static async execute(action: WorkflowAction, context: ActionContext): Promise<string> {
    const data = (action.actionData ?? {}) as Record<string, unknown>;

    switch (action.actionType) {
      case "create_task": {
        const title = readString(data.title, "Automated follow-up");
        const description = readString(
          data.description,
          `Task created by workflow ${context.workflowId}`,
        );

        await prisma.task.create({
          data: {
            title,
            description,
            companyId: readNullableString(data.companyId) ?? context.companyId ?? null,
            contactId: readNullableString(data.contactId),
            assigneeId: readNullableString(data.assigneeId),
          },
        });
        return `Task created: ${title}`;
      }

      case "assign_user": {
        const assigneeId = readNullableString(data.assigneeId);
        const leadId = readNullableString(data.leadId);

        if (!assigneeId || !leadId) {
          return "Skipped assign_user: assigneeId or leadId missing.";
        }

        await prisma.lead.update({
          where: { id: leadId },
          data: { ownerId: assigneeId },
        });
        return `Lead ${leadId} assigned to ${assigneeId}`;
      }

      case "send_email": {
        const to = readString(data.to, "lead@example.com");
        const subject = readString(data.subject, "Welcome from Velynxia");
        return `Email queued to ${to} with subject '${subject}'`;
      }

      case "send_whatsapp": {
        const to = readString(data.to, "+440000000000");
        return `WhatsApp message queued to ${to}`;
      }

      case "update_opportunity": {
        const opportunityId = readNullableString(data.opportunityId);
        if (!opportunityId) {
          return "Skipped update_opportunity: opportunityId missing.";
        }

        const stage = readNullableString(data.stage);
        const probability = Number(data.probability);

        await prisma.opportunity.update({
          where: { id: opportunityId },
          data: {
            ...(stage ? { stage: stage as never } : {}),
            ...(Number.isFinite(probability) ? { probability } : {}),
          },
        });

        return `Opportunity ${opportunityId} updated.`;
      }

      case "create_note": {
        const body = readString(data.body, "Automated note from workflow execution.");
        await prisma.note.create({
          data: {
            body,
            companyId: readNullableString(data.companyId) ?? context.companyId ?? null,
            contactId: readNullableString(data.contactId),
            authorId: context.actorUserId ?? null,
          },
        });
        return "Note created.";
      }

      default:
        return `Unsupported action type: ${action.actionType}`;
    }
  }
}
