import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "secondary" | "destructive";
type ButtonSize = "default" | "sm";

function variantClass(variant: ButtonVariant) {
  switch (variant) {
    case "outline":
      return "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50";
    case "secondary":
      return "bg-slate-100 text-slate-900 hover:bg-slate-200";
    case "destructive":
      return "bg-red-600 text-white hover:bg-red-700";
    default:
      return "bg-blue-600 text-white hover:bg-blue-700";
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
