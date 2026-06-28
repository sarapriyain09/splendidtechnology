"use client";

import type { DateRangeKey } from "../types";

interface DateFilterProps {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;
}

const OPTIONS: Array<{ value: DateRangeKey; label: string }> = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
];

export function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-600">
      Date range
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value as DateRangeKey)}
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
