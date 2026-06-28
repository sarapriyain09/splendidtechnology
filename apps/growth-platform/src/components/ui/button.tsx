import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary" | "destructive";
type ButtonSize = "default" | "sm";

function variantClass(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]";
    case "secondary":
      return "bg-[color:var(--surface-soft)] text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]";
    case "destructive":
      return "bg-red-600 text-white hover:bg-red-700";
    default:
      return "bg-[color:var(--accent)] text-white hover:brightness-110";
  }
}

function sizeClass(size: ButtonSize) {
  return size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-sm";
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          variantClass(variant),
          sizeClass(size),
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
