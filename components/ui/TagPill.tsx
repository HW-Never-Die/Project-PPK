type TagPillVariant = "new" | "in_progress" | "resolved" | "rejected" | "pending" | "approved" | "cancelled" | "active" | "maintenance" | "inactive" | "default";

const variantStyles: Record<TagPillVariant, { bg: string; color: string }> = {
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
  default: { bg: "#e5e7e0", color: "#4d4f46" },
};

const labelMap: Record<TagPillVariant, string> = {
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
  default: "-",
};

export default function TagPill({ status }: { status: string }) {
  const key = (status as TagPillVariant) in variantStyles ? (status as TagPillVariant) : "default";
  const { bg, color } = variantStyles[key];
  return (
    <span
      style={{
        backgroundColor: bg,
        color,
        borderRadius: "9999px",
        padding: "2px 8px",
        fontSize: "12px",
        fontWeight: 400,
        fontFamily: "'IBM Plex Sans Variable', sans-serif",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {labelMap[key]}
    </span>
  );
}
