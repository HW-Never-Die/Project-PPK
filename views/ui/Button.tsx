"use client";

import { cn } from "@/app/model/utils";
import { Loader2 } from "lucide-react";
import { useState, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

/**
 * DESIGN.md §4.4 — Button styles with physical press effect.
 *
 * Primary: bg #eb9d2a, color #23251d, border #d88c22, shadow 0 2.5px 0 0 #b17816
 * Neutral/Secondary: bg #ffffff, color #4d4f46, border #d1d5db, shadow 0 2px 0 0 #d1d1c9
 * Danger: bg #fef2f2, color #f54e00, border rgba(245,78,0,0.25), shadow 0 2px 0 0 rgba(245,78,0,0.25)
 * Ghost: bg transparent, color #65675e, no shadow
 */

const variantConfig: Record<
  ButtonVariant,
  {
    base: string;
    hover: string;
    shadow: string;
    pressOffset: string;
  }
> = {
  primary: {
    base: "text-[#23251d] border-[#d88c22]",
    hover: "",
    shadow: "0 2.5px 0 0 #b17816",
    pressOffset: "1.5px",
  },
  secondary: {
    base: "text-[#4d4f46] border-[#d1d5db]",
    hover: "",
    shadow: "0 2px 0 0 #d1d1c9",
    pressOffset: "1.5px",
  },
  danger: {
    base: "text-[#f54e00] border-[rgba(245,78,0,0.25)]",
    hover: "",
    shadow: "0 2px 0 0 rgba(245,78,0,0.25)",
    pressOffset: "1.5px",
  },
  ghost: {
    base: "text-[#65675e] border-transparent",
    hover: "",
    shadow: "none",
    pressOffset: "0",
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-[8px] py-[4px] text-micro",
  md: "px-[16px] py-[7px] text-sm",
  lg: "px-[20px] py-[9px] text-caption",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  style,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onMouseEnter,
  ...props
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const config = variantConfig[variant];
  const isDisabled = disabled || loading;
  const hasPress = variant !== "ghost" && !isDisabled;

  /* § 4.4 inline background colors — cleaner than Tailwind arbitrary values */
  const bgMap: Record<ButtonVariant, { default: string; hover: string }> = {
    primary: { default: "#eb9d2a", hover: "#df9323" },
    secondary: { default: "#ffffff", hover: "#f5f5f0" },
    danger: { default: "#fef2f2", hover: "#fee2e2" },
    ghost: { default: "transparent", hover: "#f5f5f0" },
  };

  const [hovered, setHovered] = useState(false);

  const computedBg = isDisabled
    ? "#e5e7e0"
    : hovered
      ? bgMap[variant].hover
      : bgMap[variant].default;

  const computedShadow =
    isDisabled || pressed ? "none" : config.shadow;

  const computedTop =
    hasPress && pressed ? config.pressOffset : "0px";

  return (
    <button
      {...props}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[6px] border font-ibm-plex-sans-variable font-semibold transition-all duration-100 ease-in-out cursor-pointer select-none",
        config.base,
        sizeStyles[size],
        isDisabled && "!text-[#9ea096] !cursor-not-allowed",
        className
      )}
      style={{
        backgroundColor: computedBg,
        boxShadow: computedShadow,
        top: computedTop,
        ...style,
      }}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        setPressed(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        if (hasPress) setPressed(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setPressed(false);
        onMouseUp?.(e);
      }}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
