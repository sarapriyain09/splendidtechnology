import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SUPPORTED_ACTIONS, type WorkflowActionInput } from "../types";

interface ActionBuilderProps {
  value: WorkflowActionInput[];
  onChange: (actions: WorkflowActionInput[]) => void;
}

export function ActionBuilder({ value, onChange }: ActionBuilderProps) {
  function addAction() {
    onChange([
      ...value,
      {
        actionType: "create_task",
        actionData: { title: "Follow up", description: "Auto-generated task" },
      },
    ]);
  }

  function updateAction(index: number, patch: Partial<WorkflowActionInput>) {
    onChange(value.map((action, idx) => (idx === index ? { ...action, ...patch } : action)));
  }

  function updateActionData(index: number, rawValue: string) {
    try {
      const parsed = rawValue.trim() ? (JSON.parse(rawValue) as Record<string, unknown>) : {};
      updateAction(index, { actionData: parsed });
    } catch {
      // Keep old value while user is typing invalid JSON.
    }
  }

  function removeAction(index: number) {
    onChange(value.filter((_, idx) => idx !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Actions</Label>
        <Button type="button" size="sm" variant="outline" onClick={addAction}>
          Add action
        </Button>
      </div>
      <div className="space-y-2">
        {value.map((action, index) => (
          <div key={`${action.actionType}-${index}`} className="space-y-2 rounded-md border border-slate-200 p-3">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
              <Select
                className="md:col-span-10"
                value={action.actionType}
                onChange={(e) =>
                  updateAction(index, { actionType: e.target.value as WorkflowActionInput["actionType"] })
                }
              >
                {SUPPORTED_ACTIONS.map((actionType) => (
                  <option key={actionType} value={actionType}>
                    {actionType}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                className="md:col-span-2"
                size="sm"
                variant="destructive"
                onClick={() => removeAction(index)}
              >
                Remove
              </Button>
            </div>
            <Input
              defaultValue={JSON.stringify(action.actionData ?? {}, null, 0)}
              onChange={(e) => updateActionData(index, e.target.value)}
              placeholder='{"title":"Follow up"}'
            />
            <p className="text-xs text-slate-500">Action data is JSON. Example: {"{"}"assigneeId":"user_123"{"}"}.</p>
          </div>
        ))}
        {!value.length && <p className="text-sm text-slate-500">Add at least one action to run when trigger and conditions match.</p>}
      </div>
    </div>
  );
}
