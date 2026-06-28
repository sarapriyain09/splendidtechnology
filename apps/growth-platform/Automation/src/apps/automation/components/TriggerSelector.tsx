import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SUPPORTED_EVENTS, type SupportedEventName } from "../types";

interface TriggerSelectorProps {
  value: SupportedEventName[];
  onChange: (events: SupportedEventName[]) => void;
}

export function TriggerSelector({ value, onChange }: TriggerSelectorProps) {
  const canAdd = value.length < SUPPORTED_EVENTS.length;

  function addTrigger(eventName: SupportedEventName) {
    if (value.includes(eventName)) return;
    onChange([...value, eventName]);
  }

  function removeTrigger(eventName: SupportedEventName) {
    onChange(value.filter((event) => event !== eventName));
  }

  return (
    <div className="space-y-2">
      <Label>Triggers</Label>
      <div className="flex gap-2">
        <Select
          value=""
          onChange={(e) => {
            const next = e.target.value as SupportedEventName;
            if (next) addTrigger(next);
          }}
          disabled={!canAdd}
        >
          <option value="">Add trigger...</option>
          {SUPPORTED_EVENTS.map((eventName) => (
            <option key={eventName} value={eventName} disabled={value.includes(eventName)}>
              {eventName}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((eventName) => (
          <Button
            key={eventName}
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => removeTrigger(eventName)}
          >
            {eventName} x
          </Button>
        ))}
      </div>
    </div>
  );
}
