import * as React from "react";
import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--text)] outline-none ring-[color:var(--border)] focus:border-[color:var(--accent)] focus:ring-2",
          className,
        )}
        {...props}
      />
    );
  },
);

Select.displayName = "Select";
