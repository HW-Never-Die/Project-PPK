import { prisma } from "@/lib/db";
import { Building2, Users, Calendar, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

async function getMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalFacilities, totalUsers, reservationsThisMonth, reportsThisMonth, pendingUsers] =
    await Promise.all([
      prisma.facility.count({ where: { status: { not: "inactive" } } }),
      prisma.user.count({ where: { status: "verified" } }),
      prisma.reservation.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.report.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.user.count({ where: { status: "pending" } }),
    ]);

  return { totalFacilities, totalUsers, reservationsThisMonth, reportsThisMonth, pendingUsers };
}

async function getReportBreakdown() {
  const rows = await prisma.report.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  return rows;
}

async function getTopFacilities() {
  return prisma.reservation.groupBy({
    by: ["facilityId"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 5,
  });
}

export default async function AdminDashboardPage() {
  const [metrics, reportBreakdown, topFacilitiesRaw] = await Promise.all([
    getMetrics(),
    getReportBreakdown(),
    getTopFacilities(),
  ]);

  const facilityIds = topFacilitiesRaw.map((r) => r.facilityId);
  const facilities = await prisma.facility.findMany({
    where: { id: { in: facilityIds } },
    select: { id: true, name: true },
  });
  const facilityMap = Object.fromEntries(facilities.map((f) => [f.id, f.name]));

  const statCards = [
    { label: "Fasilitas Aktif", value: metrics.totalFacilities, icon: Building2, color: "#2f80fa" },
    { label: "Pengguna Terverifikasi", value: metrics.totalUsers, icon: Users, color: "#6aa84f" },
    { label: "Reservasi Bulan Ini", value: metrics.reservationsThisMonth, icon: Calendar, color: "#eb9d2a" },
    { label: "Laporan Bulan Ini", value: metrics.reportsThisMonth, icon: FileText, color: "#f54e00" },
  ];

  const statusLabel: Record<string, string> = {
    new: "Baru",
    in_progress: "Diproses",
    resolved: "Selesai",
    rejected: "Ditolak",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
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
          Dashboard Admin
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Metrik dan ringkasan sistem Eunomia
        </p>
      </div>

      {metrics.pendingUsers > 0 && (
        <div
          style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #eb9d2a",
            borderRadius: "4px",
            padding: "10px 14px",
            fontSize: "13px",
            color: "#23251d",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          Ada <strong>{metrics.pendingUsers}</strong> akun menunggu verifikasi.{" "}
          <a href="/admin/users" style={{ color: "#2f80fa", textDecoration: "underline" }}>
            Verifikasi sekarang
          </a>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #bfc1b7",
              borderRadius: "4px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Icon size={16} style={{ color }} />
              <span style={{ fontSize: "13px", color: "#65675e", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
                {label}
              </span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "#23251d", letterSpacing: "-0.6px", lineHeight: 1.2 }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #bfc1b7",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #bfc1b7" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#23251d" }}>Status Laporan</span>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {reportBreakdown.map((row) => (
              <div key={row.status} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#4d4f46", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
                  {statusLabel[row.status] ?? row.status}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#23251d" }}>{row._count.id}</span>
              </div>
            ))}
            {reportBreakdown.length === 0 && (
              <span style={{ color: "#9ea096", fontSize: "13px" }}>Belum ada laporan</span>
            )}
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
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #bfc1b7" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#23251d" }}>Fasilitas Terpopuler</span>
          </div>
          <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {topFacilitiesRaw.map((row, i) => (
              <div key={row.facilityId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", color: "#4d4f46", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
                  {i + 1}. {facilityMap[row.facilityId] ?? `ID ${row.facilityId}`}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#23251d" }}>{row._count.id}x</span>
              </div>
            ))}
            {topFacilitiesRaw.length === 0 && (
              <span style={{ color: "#9ea096", fontSize: "13px" }}>Belum ada reservasi</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
