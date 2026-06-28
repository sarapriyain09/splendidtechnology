import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
