"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-glow text-deep-moss hover:bg-dark-amber border-transparent",
  secondary:
    "bg-transparent text-burnished-gold border-burnished-gold hover:bg-soft-linen",
  ghost:
    "bg-transparent text-deep-moss border-transparent hover:bg-pale-stone",
  danger:
    "bg-flame-orange text-white border-transparent hover:opacity-90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-micro",
  md: "px-3 py-1.5 text-caption",
  lg: "px-4 py-2 text-body",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md border font-ibm-plex-sans-variable font-medium transition-colors duration-150 cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
