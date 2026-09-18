import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type TagVariant =
  | "pending"
  | "verified"
  | "rejected"
  | "approved"
  | "cancelled"
  | "new"
  | "in_progress"
  | "resolved"
  | "active"
  | "maintenance"
  | "inactive"
  | "default";

const variantStyles: Record<TagVariant, string> = {
  pending: "bg-marigold/15 text-dark-amber",
  verified: "bg-moss-green/15 text-moss-green",
  approved: "bg-moss-green/15 text-moss-green",
  resolved: "bg-moss-green/15 text-moss-green",
  active: "bg-moss-green/15 text-moss-green",
  rejected: "bg-flame-orange/15 text-flame-orange",
  cancelled: "bg-flame-orange/15 text-flame-orange",
  inactive: "bg-ash-green/15 text-sage-gray",
  new: "bg-signal-blue/15 text-signal-blue",
  in_progress: "bg-marigold/15 text-dark-amber",
  maintenance: "bg-marigold/15 text-dark-amber",
  default: "bg-soft-linen text-olive-char",
};

type TagPillProps = {
  variant?: TagVariant;
  children: ReactNode;
  className?: string;
};

export default function TagPill({
  variant = "default",
  children,
  className,
}: TagPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-micro font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
