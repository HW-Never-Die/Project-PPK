import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import {
  FileText,
  Building2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import TagPill from "@/components/ui/TagPill";

export const dynamic = "force-dynamic";

export default async function PenggunaDashboardPage() {
  const session = await getSession();
  const userId = session?.userId ?? 3; // fallback mock

  const [totalReports, inProgressReports, resolvedReports, recentReports, totalFacilities] =
    await Promise.all([
      prisma.report.count({ where: { userId } }),
      prisma.report.count({ where: { userId, status: "in_progress" } }),
      prisma.report.count({ where: { userId, status: "resolved" } }),
      prisma.report.findMany({
        where: { userId },
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          facility: { select: { name: true, location: true } },
        },
      }),
      prisma.facility.count({ where: { status: "active" } }),
    ]);

  const cardBase: React.CSSProperties = {
    backgroundColor: "#ffffff",
    border: "1px solid #bfc1b7",
    borderRadius: "4px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "8px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
          }}
        >
          Dashboard Mahasiswa / Pengguna
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Ringkasan aktivitas pelaporan dan ketersediaan fasilitas kampus FSM Undip
        </p>
      </div>

      {/* Action Shortcut Banner */}
      <div
        style={{
          backgroundColor: "#fffbeb",
          border: "1px solid #eb9d2a",
          borderRadius: "4px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertTriangle size={18} style={{ color: "#eb9d2a", flexShrink: 0 }} />
          <span style={{ fontSize: "13px", color: "#23251d" }}>
            Menemukan fasilitas rusak, kotor, atau bermasalah di lingkungan FSM?
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Link
            href="/pengguna/laporan/buat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: "#eb9d2a",
              color: "#23251d",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <Plus size={14} /> Buat Laporan
          </Link>
          <Link
            href="/facilities"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: "#ffffff",
              border: "1px solid #bfc1b7",
              color: "#23251d",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Building2 size={14} /> Cek Fasilitas
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={16} style={{ color: "#2f80fa" }} />
            <span style={{ fontSize: "13px", color: "#65675e" }}>Total Laporan Saya</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {totalReports}
          </div>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={16} style={{ color: "#eb9d2a" }} />
            <span style={{ fontSize: "13px", color: "#65675e" }}>Sedang Ditangani</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {inProgressReports}
          </div>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Building2 size={16} style={{ color: "#6aa84f" }} />
            <span style={{ fontSize: "13px", color: "#65675e" }}>Laporan Selesai</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {resolvedReports}
          </div>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Building2 size={16} style={{ color: "#111827" }} />
            <span style={{ fontSize: "13px", color: "#65675e" }}>Fasilitas Kampus Aktif</span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {totalFacilities}
          </div>
          <Link
            href="/facilities"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#2f80fa",
              textDecoration: "none",
            }}
          >
            Eksplorasi katalog <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Recent Reports List */}
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
            padding: "12px 16px",
            borderBottom: "1px solid #bfc1b7",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#23251d" }}>
            Laporan Kerusakan Terbaru Anda
          </span>
          <Link
            href="/pengguna/laporan"
            style={{
              fontSize: "12px",
              color: "#2f80fa",
              textDecoration: "none",
            }}
          >
            Lihat semua laporan
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#9ea096", fontSize: "13px" }}>
            Belum ada laporan yang dikirimkan.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdfdf8" }}>
                {["Fasilitas", "Kategori", "Status", "Tanggal"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#65675e",
                      borderBottom: "1px solid #bfc1b7",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => (
                <tr key={r.id}>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#23251d",
                      borderBottom: "1px solid #eeefe9",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{r.facility?.name}</div>
                    <div style={{ fontSize: "11px", color: "#65675e" }}>{r.facility?.location}</div>
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#23251d",
                      borderBottom: "1px solid #eeefe9",
                      textTransform: "capitalize",
                    }}
                  >
                    {r.category}
                  </td>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eeefe9" }}>
                    <TagPill status={r.status} />
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#65675e",
                      borderBottom: "1px solid #eeefe9",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(r.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}