import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive";
}

function variantClass(variant: NonNullable<BadgeProps["variant"]>) {
  switch (variant) {
    case "secondary":
      return "bg-[color:var(--surface-soft)] text-[color:var(--muted)]";
    case "destructive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-[color:var(--surface-hover)] text-[color:var(--accent)]";
  }
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variantClass(variant),
        className,
      )}
      {...props}
    />
  );
}
