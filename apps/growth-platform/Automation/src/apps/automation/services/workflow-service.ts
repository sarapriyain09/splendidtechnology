import { prisma } from "@/common/services";
import { Prisma } from "@prisma/client";
import {
  SUPPORTED_ACTIONS,
  SUPPORTED_EVENTS,
  SUPPORTED_OPERATORS,
  type WorkflowInput,
} from "../types";

function normalizeActionData(
  value: Record<string, unknown> | null | undefined,
): Prisma.InputJsonValue | Prisma.NullTypes.JsonNull {
  if (!value) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}

function assertValidWorkflowInput(input: WorkflowInput) {
  if (!input.name.trim()) {
    throw new Error("Workflow name is required.");
  }

  if (!input.triggers.length) {
    throw new Error("At least one trigger is required.");
  }

  if (!input.actions.length) {
    throw new Error("At least one action is required.");
  }

  for (const event of input.triggers) {
    if (!SUPPORTED_EVENTS.includes(event)) {
      throw new Error(`Unsupported trigger event: ${event}`);
    }
  }

  for (const condition of input.conditions) {
    if (!SUPPORTED_OPERATORS.includes(condition.operator)) {
      throw new Error(`Unsupported condition operator: ${condition.operator}`);
    }
  }

  for (const action of input.actions) {
    if (!SUPPORTED_ACTIONS.includes(action.actionType)) {
      throw new Error(`Unsupported action type: ${action.actionType}`);
    }
  }
}

export class WorkflowService {
  static async list(companyId?: string | null) {
    return prisma.workflow.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
    });
  }

  static async create(input: WorkflowInput) {
    assertValidWorkflowInput(input);

    return prisma.workflow.create({
      data: {
        companyId: input.companyId ?? null,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        active: input.active,
        triggers: {
          create: input.triggers.map((eventName) => ({ eventName })),
        },
        conditions: {
          create: input.conditions.map((condition) => ({
            field: condition.field,
            operator: condition.operator,
            value: condition.value,
          })),
        },
        actions: {
          create: input.actions.map((action) => ({
            actionType: action.actionType,
            actionData: normalizeActionData(action.actionData),
          })),
        },
      },
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
    });
  }

  static async update(id: string, input: WorkflowInput) {
    assertValidWorkflowInput(input);

    return prisma.$transaction(async (tx) => {
      await tx.workflowTrigger.deleteMany({ where: { workflowId: id } });
      await tx.workflowCondition.deleteMany({ where: { workflowId: id } });
      await tx.workflowAction.deleteMany({ where: { workflowId: id } });

      return tx.workflow.update({
        where: { id },
        data: {
          companyId: input.companyId ?? null,
          name: input.name.trim(),
          description: input.description?.trim() || null,
          active: input.active,
          triggers: {
            create: input.triggers.map((eventName) => ({ eventName })),
          },
          conditions: {
            create: input.conditions.map((condition) => ({
              field: condition.field,
              operator: condition.operator,
              value: condition.value,
            })),
          },
          actions: {
            create: input.actions.map((action) => ({
              actionType: action.actionType,
              actionData: normalizeActionData(action.actionData),
            })),
          },
        },
        include: {
          triggers: true,
          conditions: true,
          actions: true,
        },
      });
    });
  }

  static async remove(id: string) {
    return prisma.workflow.delete({ where: { id } });
  }

  static async addLog(workflowId: string, status: string, message: string) {
    return prisma.workflowLog.create({
      data: {
        workflowId,
        status,
        message,
      },
    });
  }

  static async logs(workflowId?: string) {
    return prisma.workflowLog.findMany({
      where: workflowId ? { workflowId } : undefined,
      include: {
        workflow: {
          select: { id: true, name: true },
        },
      },
      orderBy: { executedAt: "desc" },
      take: 200,
    });
  }
}
