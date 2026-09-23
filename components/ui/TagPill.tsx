import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type TagPillVariant =
  | "new"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "pending"
  | "approved"
  | "cancelled"
  | "active"
  | "maintenance"
  | "inactive"
  | "verified"
  | "default";

const labelMap: Record<string, string> = {
  new: "Baru",
  in_progress: "Diproses",
  resolved: "Selesai",
  rejected: "Ditolak",
  pending: "Menunggu",
  approved: "Disetujui",
  cancelled: "Dibatalkan",
  active: "Aktif",
  maintenance: "Perbaikan",
  inactive: "Nonaktif",
  verified: "Terverifikasi",
  default: "-",
};

const variantStyles: Record<string, { bg: string; color: string }> = {
  new: { bg: "#2f80fa", color: "#ffffff" },
  in_progress: { bg: "#eb9d2a", color: "#23251d" },
  resolved: { bg: "#6aa84f", color: "#ffffff" },
  rejected: { bg: "#f54e00", color: "#ffffff" },
  pending: { bg: "#eb9d2a", color: "#23251d" },
  approved: { bg: "#6aa84f", color: "#ffffff" },
  cancelled: { bg: "#9ea096", color: "#ffffff" },
  active: { bg: "#6aa84f", color: "#ffffff" },
  maintenance: { bg: "#eb9d2a", color: "#23251d" },
  inactive: { bg: "#9ea096", color: "#ffffff" },
  verified: { bg: "#6aa84f", color: "#ffffff" },
  default: { bg: "#e5e7e0", color: "#4d4f46" },
};

const variantClasses: Record<string, string> = {
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

export type TagPillProps = {
  status?: string;
  variant?: TagPillVariant | string;
  children?: ReactNode;
  className?: string;
};

export default function TagPill({
  status,
  variant,
  children,
  className,
}: TagPillProps) {
  const key = status || variant || "default";

  if (children !== undefined || (!status && variant)) {
    const cls = variantClasses[key] || variantClasses.default;
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-micro font-medium whitespace-nowrap",
          cls,
          className
        )}
      >
        {children ?? labelMap[key] ?? key}
      </span>
    );
  }

  const style = variantStyles[key] || variantStyles.default;
  return (
    <span
      className={cn("inline-block whitespace-nowrap text-xs font-normal", className)}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: "9999px",
        padding: "2px 8px",
        fontSize: "12px",
        fontFamily: "'IBM Plex Sans Variable', sans-serif",
      }}
    >
      {labelMap[key] || key}
    </span>
  );
}
