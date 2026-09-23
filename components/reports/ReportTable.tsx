import TagPill from "@/components/ui/TagPill";
import { FileText } from "lucide-react";

interface Report {
  id: number;
  category: string;
  description: string;
  status: string;
  photoUrl?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  facility?: { name: string; location: string };
  user?: { name: string };
  processor?: { name: string } | null;
}

interface ReportTableProps {
  reports: Report[];
  mode?: "user" | "officer";
  onUpdateStatus?: (id: number, status: string, notes: string) => void;
}

const categoryLabel: Record<string, string> = {
  kerusakan: "Kerusakan",
  kebersihan: "Kebersihan",
  keamanan: "Keamanan",
  lainnya: "Lainnya",
};

export default function ReportTable({ reports, mode = "user", onUpdateStatus }: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #bfc1b7",
          borderRadius: "6px",
          padding: "48px 32px",
          textAlign: "center",
          color: "#9ea096",
          fontSize: "14px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
        }}
      >
        <FileText size={32} style={{ margin: "0 auto 12px", color: "#bfc1b7" }} />
        Tidak ada laporan
      </div>
    );
  }

  const thStyle: React.CSSProperties = {
    padding: "8px 12px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 500,
    color: "#65675e",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    borderBottom: "1px solid #bfc1b7",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "13px",
    color: "#23251d",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    borderBottom: "1px solid #eeefe9",
    verticalAlign: "top",
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #bfc1b7",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#fdfdf8" }}>
              <th style={thStyle}>Fasilitas</th>
              <th style={thStyle}>Kategori</th>
              <th style={thStyle}>Deskripsi</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Tanggal</th>
              {mode === "officer" && <th style={thStyle}>Pelapor</th>}
              {mode === "officer" && <th style={thStyle}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <ReportRow
                key={r.id}
                report={r}
                mode={mode}
                tdStyle={tdStyle}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportRow({
  report,
  mode,
  tdStyle,
  onUpdateStatus,
}: {
  report: Report;
  mode: "user" | "officer";
  tdStyle: React.CSSProperties;
  onUpdateStatus?: (id: number, status: string, notes: string) => void;
}) {
  return (
    <tr style={{ transition: "background 0.15s" }}>
      <td style={tdStyle}>{report.facility?.name ?? "-"}</td>
      <td style={tdStyle}>{categoryLabel[report.category] ?? report.category}</td>
      <td style={{ ...tdStyle, maxWidth: "240px" }}>
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {report.description}
        </span>
        {report.resolutionNotes && (
          <span style={{ display: "block", color: "#65675e", fontSize: "12px", marginTop: "2px" }}>
            Catatan: {report.resolutionNotes}
          </span>
        )}
      </td>
      <td style={tdStyle}>
        <TagPill status={report.status} />
      </td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
        {new Date(report.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
      </td>
      {mode === "officer" && <td style={tdStyle}>{report.user?.name ?? "-"}</td>}
      {mode === "officer" && onUpdateStatus && (
        <td style={tdStyle}>
          <OfficerActions report={report} onUpdateStatus={onUpdateStatus} />
        </td>
      )}
    </tr>
  );
}

function OfficerActions({
  report,
  onUpdateStatus,
}: {
  report: Report;
  onUpdateStatus: (id: number, status: string, notes: string) => void;
}) {
  const nextStatus: Record<string, string | null> = {
    new: "in_progress",
    in_progress: "resolved",
    resolved: null,
    rejected: null,
  };
  const nextLabel: Record<string, string> = {
    new: "Proses",
    in_progress: "Selesaikan",
  };
  const next = nextStatus[report.status];

  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {next && (
        <button
          onClick={() => onUpdateStatus(report.id, next, "")}
          style={{
            padding: "4px 10px",
            backgroundColor: "#eb9d2a",
            color: "#23251d",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {nextLabel[report.status]}
        </button>
      )}
      {report.status !== "rejected" && report.status !== "resolved" && (
        <button
          onClick={() => onUpdateStatus(report.id, "rejected", "")}
          style={{
            padding: "4px 10px",
            backgroundColor: "transparent",
            color: "#f54e00",
            border: "1px solid #f54e00",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          Tolak
        </button>
      )}
    </div>
  );
}
