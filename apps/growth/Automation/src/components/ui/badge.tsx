import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive";
}

function variantClass(variant: NonNullable<BadgeProps["variant"]>) {
  switch (variant) {
    case "secondary":
      return "bg-slate-100 text-slate-700";
    case "destructive":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
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
