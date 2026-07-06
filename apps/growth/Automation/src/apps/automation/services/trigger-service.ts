import { prisma } from "@/common/services";
import type { WorkflowCondition, Workflow } from "@prisma/client";
import type { SupportedEventName } from "../types";

function getFieldValue(payload: Record<string, unknown>, fieldPath: string): unknown {
  return fieldPath.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, payload);
}

function toComparable(value: unknown): number | string {
  if (typeof value === "number") return value;
  const asNumber = Number(value);
  if (!Number.isNaN(asNumber)) return asNumber;
  return String(value ?? "").toLowerCase();
}

function evaluateCondition(condition: WorkflowCondition, payload: Record<string, unknown>) {
  const leftRaw = getFieldValue(payload, condition.field);
  const rightRaw = condition.value;

  const leftComparable = toComparable(leftRaw);
  const rightComparable = toComparable(rightRaw);

  switch (condition.operator) {
    case "=":
      return leftComparable === rightComparable;
    case "!=":
      return leftComparable !== rightComparable;
    case "contains":
      return String(leftRaw ?? "").toLowerCase().includes(String(rightRaw).toLowerCase());
    case "greater_than":
      return Number(leftComparable) > Number(rightComparable);
    case "less_than":
      return Number(leftComparable) < Number(rightComparable);
    default:
      return false;
  }
}

export class TriggerService {
  static async matchingWorkflows(eventName: SupportedEventName, companyId?: string | null) {
    return prisma.workflow.findMany({
      where: {
        active: true,
        ...(companyId ? { companyId } : {}),
        triggers: {
          some: {
            eventName,
          },
        },
      },
      include: {
        triggers: true,
        conditions: true,
        actions: true,
      },
    });
  }

  static evaluateConditions(
    workflow: Workflow & { conditions: WorkflowCondition[] },
    payload: Record<string, unknown>,
  ) {
    if (!workflow.conditions.length) return true;
    return workflow.conditions.every((condition) => evaluateCondition(condition, payload));
  }
}
