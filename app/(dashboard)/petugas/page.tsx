import { prisma } from "@/lib/db";
import Link from "next/link";
import { Calendar, FileText, ArrowRight } from "lucide-react";
import TagPill from "@/components/ui/TagPill";

export const dynamic = "force-dynamic";

async function getStats() {
  const [pendingReservations, newReports] = await Promise.all([
    prisma.reservation.count({ where: { status: "pending" } }),
    prisma.report.count({ where: { status: "new" } }),
  ]);
  return { pendingReservations, newReports };
}

async function getRecentReports() {
  return prisma.report.findMany({
    where: { status: "new" },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      facility: { select: { name: true } },
      user: { select: { name: true } },
    },
  });
}

export default async function PetugasDashboardPage() {
  const [stats, recentReports] = await Promise.all([getStats(), getRecentReports()]);

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
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
          }}
        >
          Dashboard Petugas
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Ringkasan antrian yang perlu ditindaklanjuti
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={16} style={{ color: "#2f80fa" }} />
            <span style={{ fontSize: "13px", color: "#65675e", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Reservasi Pending
            </span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {stats.pendingReservations}
          </div>
          <Link
            href="/petugas/reservasi"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#2f80fa",
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            Lihat semua <ArrowRight size={12} />
          </Link>
        </div>

        <div style={cardBase}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={16} style={{ color: "#f54e00" }} />
            <span style={{ fontSize: "13px", color: "#65675e", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Laporan Baru
            </span>
          </div>
          <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
            {stats.newReports}
          </div>
          <Link
            href="/petugas/laporan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              color: "#2f80fa",
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            Lihat semua <ArrowRight size={12} />
          </Link>
        </div>
      </div>

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
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#23251d" }}>Laporan Terbaru</span>
          <Link
            href="/petugas/laporan"
            style={{
              fontSize: "12px",
              color: "#2f80fa",
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            Lihat semua
          </Link>
        </div>
        {recentReports.length === 0 ? (
          <div style={{ padding: "32px", textAlign: "center", color: "#9ea096", fontSize: "13px" }}>
            Tidak ada laporan baru
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdfdf8" }}>
                {["Fasilitas", "Kategori", "Pelapor", "Status", "Tanggal"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 12px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "#65675e",
                      borderBottom: "1px solid #bfc1b7",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
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
                  {[
                    r.facility.name,
                    r.category,
                    r.user.name,
                  ].map((val, i) => (
                    <td
                      key={i}
                      style={{
                        padding: "10px 12px",
                        fontSize: "13px",
                        color: "#23251d",
                        borderBottom: "1px solid #eeefe9",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      {val}
                    </td>
                  ))}
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #eeefe9" }}>
                    <TagPill status={r.status} />
                  </td>
                  <td
                    style={{
                      padding: "10px 12px",
                      fontSize: "13px",
                      color: "#65675e",
                      borderBottom: "1px solid #eeefe9",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
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
