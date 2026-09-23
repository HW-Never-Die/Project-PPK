"use client";

import { useState } from "react";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface PreviewRow {
  [key: string]: string;
}

export default function AdminRekapPage() {
  const [reportType, setReportType] = useState<"occupancy" | "damage">("occupancy");
  const [from, setFrom] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [to, setTo] = useState(() => new Date().toISOString().split("T")[0] ?? "");
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    padding: "6px 10px",
    border: "1px solid #bfc1b7",
    borderRadius: "4px",
    fontSize: "13px",
    color: "#23251d",
    backgroundColor: "#ffffff",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#65675e",
    marginBottom: "4px",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
  };

  async function loadPreview() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/export?format=csv&report=${reportType}&from=${from}&to=${to}`);
      if (!res.ok) throw new Error("Gagal memuat preview");
      const text = await res.text();
      const lines = text.trim().split("\n");
      if (lines.length < 1) { setPreview([]); return; }
      const headers = lines[0]?.split(",").map((h) => h.replace(/"/g, "")) ?? [];
      const rows: PreviewRow[] = lines.slice(1, 11).map((line) => {
        const vals = line.split(",").map((v) => v.replace(/"/g, ""));
        return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? ""]));
      });
      setPreview(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  function download(format: "csv" | "excel" | "pdf") {
    const url = `/api/export?format=${format}&report=${reportType}&from=${from}&to=${to}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `rekap-${reportType}.${format === "excel" ? "xlsx" : format}`;
    a.click();
  }

  const thStyle: React.CSSProperties = {
    padding: "8px 10px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 500,
    color: "#65675e",
    borderBottom: "1px solid #bfc1b7",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "8px 10px",
    fontSize: "12px",
    color: "#23251d",
    borderBottom: "1px solid #eeefe9",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
          }}
        >
          Rekap & Export
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Ekspor data okupansi dan laporan kerusakan
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #bfc1b7",
          borderRadius: "6px",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={labelStyle}>Jenis Rekap</label>
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value as "occupancy" | "damage"); setPreview(null); }}
              style={inputStyle}
            >
              <option value="occupancy">Okupansi Fasilitas (Reservasi)</option>
              <option value="damage">Frekuensi Kerusakan (Laporan)</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Dari Tanggal</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Sampai Tanggal</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
          </div>

          <button
            onClick={loadPreview}
            disabled={loading}
            style={{
              padding: "6px 14px",
              backgroundColor: loading ? "#9ea096" : "#23251d",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            {loading ? "Memuat..." : "Tampilkan"}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              borderRadius: "4px",
              color: "#f54e00",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            borderTop: "1px solid #eeefe9",
            paddingTop: "16px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "13px", color: "#65675e", fontFamily: "'IBM Plex Sans Variable', sans-serif", alignSelf: "center" }}>
            Unduh:
          </span>
          {[
            { format: "csv" as const, label: "CSV", icon: FileText, color: "#6aa84f" },
            { format: "excel" as const, label: "Excel", icon: FileSpreadsheet, color: "#2f80fa" },
            { format: "pdf" as const, label: "PDF", icon: File, color: "#f54e00" },
          ].map(({ format, label, icon: Icon, color }) => (
            <button
              key={format}
              onClick={() => download(format)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                border: `1px solid ${color}`,
                borderRadius: "4px",
                backgroundColor: "transparent",
                color,
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "'IBM Plex Sans Variable', sans-serif",
              }}
            >
              <Icon size={13} />
              {label}
              <Download size={12} />
            </button>
          ))}
        </div>
      </div>

      {preview !== null && (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #bfc1b7",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #bfc1b7",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#23251d" }}>
              Preview Data{preview.length === 10 ? " (10 baris pertama)" : ` (${preview.length} baris)`}
            </span>
          </div>

          {preview.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#9ea096", fontSize: "13px" }}>
              Tidak ada data untuk rentang tanggal ini
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#fdfdf8" }}>
                    {Object.keys(preview[0] ?? {}).map((h) => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j} style={tdStyle}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
