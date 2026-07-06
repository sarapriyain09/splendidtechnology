import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 text-sm text-[color:var(--text)] outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
