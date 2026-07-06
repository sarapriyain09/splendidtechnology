import { ActionService } from "./action-service";
import { TriggerService } from "./trigger-service";
import { WorkflowService } from "./workflow-service";
import type { WorkflowEvent } from "../types";

export class AutomationEngine {
  static async processEvent(event: WorkflowEvent, actorUserId?: string | null) {
    const payload = event.payload ?? {};
    const workflows = await TriggerService.matchingWorkflows(event.eventName, event.companyId);

    const summary: Array<{ workflowId: string; status: string; message: string }> = [];

    for (const workflow of workflows) {
      try {
        const conditionsPassed = TriggerService.evaluateConditions(workflow, payload);
        if (!conditionsPassed) {
          const message = `Skipped: conditions did not match for event ${event.eventName}`;
          await WorkflowService.addLog(workflow.id, "skipped", message);
          summary.push({ workflowId: workflow.id, status: "skipped", message });
          continue;
        }

        const actionMessages: string[] = [];
        for (const action of workflow.actions) {
          const actionMessage = await ActionService.execute(action, {
            workflowId: workflow.id,
            companyId: workflow.companyId,
            payload,
            actorUserId,
          });
          actionMessages.push(actionMessage);
        }

        const message = actionMessages.join(" | ") || "No actions executed.";
        await WorkflowService.addLog(workflow.id, "success", message);
        summary.push({ workflowId: workflow.id, status: "success", message });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Execution failed";
        await WorkflowService.addLog(workflow.id, "failed", message);
        summary.push({ workflowId: workflow.id, status: "failed", message });
      }
    }

    return {
      eventName: event.eventName,
      matchedWorkflows: workflows.length,
      results: summary,
    };
  }
}
