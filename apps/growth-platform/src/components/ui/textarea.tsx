import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--text)] outline-none ring-[color:var(--border)] placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)] focus:ring-2",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
