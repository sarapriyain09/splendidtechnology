import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SUPPORTED_OPERATORS, type WorkflowConditionInput } from "../types";

interface ConditionBuilderProps {
  value: WorkflowConditionInput[];
  onChange: (conditions: WorkflowConditionInput[]) => void;
}

export function ConditionBuilder({ value, onChange }: ConditionBuilderProps) {
  function addCondition() {
    onChange([...value, { field: "payload.source", operator: "=", value: "website" }]);
  }

  function updateCondition(index: number, patch: Partial<WorkflowConditionInput>) {
    onChange(value.map((condition, idx) => (idx === index ? { ...condition, ...patch } : condition)));
  }

  function removeCondition(index: number) {
    onChange(value.filter((_, idx) => idx !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Conditions</Label>
        <Button type="button" size="sm" variant="outline" onClick={addCondition}>
          Add condition
        </Button>
      </div>
      <div className="space-y-2">
        {value.map((condition, index) => (
          <div key={`${condition.field}-${index}`} className="grid grid-cols-1 gap-2 rounded-md border border-slate-200 p-3 md:grid-cols-12">
            <Input
              className="md:col-span-5"
              value={condition.field}
              onChange={(e) => updateCondition(index, { field: e.target.value })}
              placeholder="payload.source"
            />
            <Select
              className="md:col-span-3"
              value={condition.operator}
              onChange={(e) =>
                updateCondition(index, { operator: e.target.value as WorkflowConditionInput["operator"] })
              }
            >
              {SUPPORTED_OPERATORS.map((operator) => (
                <option key={operator} value={operator}>
                  {operator}
                </option>
              ))}
            </Select>
            <Input
              className="md:col-span-3"
              value={condition.value}
              onChange={(e) => updateCondition(index, { value: e.target.value })}
              placeholder="value"
            />
            <Button
              type="button"
              className="md:col-span-1"
              size="sm"
              variant="destructive"
              onClick={() => removeCondition(index)}
            >
              x
            </Button>
          </div>
        ))}
        {!value.length && <p className="text-sm text-slate-500">No conditions. Workflow runs for every trigger event.</p>}
      </div>
    </div>
  );
}
