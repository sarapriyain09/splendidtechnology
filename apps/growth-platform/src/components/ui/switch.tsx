import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <label className={cn("relative inline-flex cursor-pointer items-center", className)}>
      <input ref={ref} type="checkbox" className="peer sr-only" {...props} />
      <span className="h-6 w-11 rounded-full bg-[color:var(--surface-hover)] transition peer-checked:bg-[color:var(--accent)]" />
      <span className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[color:var(--surface)] transition peer-checked:translate-x-5" />
    </label>
  );
});

Switch.displayName = "Switch";
