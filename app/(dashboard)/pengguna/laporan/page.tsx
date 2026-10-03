"use client";

import { useEffect, useState, useReducer, useMemo } from "react";
import Link from "next/link";
import ReportTable from "@/components/reports/ReportTable";
import SkyscraperBackground from "@/components/reservations/SkyscraperBackground";
import {
  Plus,
  Search,
  X,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Info,
} from "lucide-react";

interface Report {
  id: number;
  category: string;
  description: string;
  status: string;
  photoUrl?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  facility?: { name: string; location: string };
}

const TABS = [
  { key: "", label: "Semua" },
  { key: "new", label: "Menunggu Persetujuan" },
  { key: "in_progress", label: "Diproses" },
  { key: "resolved", label: "Selesai" },
  { key: "rejected", label: "Ditolak" },
];

export default function RiwayatLaporanPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reports/my")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setReports(d.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setReports([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const stats = useMemo(() => {
    const total = reports.length;
    const active = reports.filter((r) => r.status === "new" || r.status === "in_progress").length;
    const resolved = reports.filter((r) => r.status === "resolved").length;
    const rejected = reports.filter((r) => r.status === "rejected").length;
    return { total, active, resolved, rejected };
  }, [reports]);

  const activeCount = stats.active;
  const canCreate = activeCount < 3;

  const filtered = useMemo(() => {
    let list = reports;
    if (activeTab) list = list.filter((r) => r.status === activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (r) =>
        r.facility?.name.toLowerCase().includes(q) ||
        r.facility?.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        String(r.id).includes(q)
    );
  }, [reports, activeTab, searchQuery]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      <SkyscraperBackground />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: "#f5f5f0",
          borderRadius: "6px",
          border: "1px solid #e5e7e0",
          fontSize: "12px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          color: "#65675e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#eb9d2a",
            }}
          />
          <Link href="/pengguna" style={{ color: "#23251d", textDecoration: "none", fontWeight: 600 }}>
            Eunomia OS
          </Link>
          <span>/</span>
          <span>Pelaporan Fasilitas</span>
          <span>/</span>
          <span style={{ color: "#23251d", fontWeight: 500 }}>Laporan Saya</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              border: "1px solid #bfc1b7",
            }}
          />
          <span
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              border: "1px solid #bfc1b7",
            }}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#fdfdf8",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: "620px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "2px 8px",
              borderRadius: "4px",
              backgroundColor: "rgba(235,157,42,0.12)",
              color: "#b17816",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              marginBottom: "8px",
            }}
          >
            <ShieldCheck size={13} />
            Fasilitas Kampus FSM Undip
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
              margin: "0 0 6px 0",
              fontFamily: "'Open Runde', sans-serif",
            }}
          >
            Pelaporan Kerusakan Fasilitas
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#4B5563",
              fontWeight: 400,
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              lineHeight: "1.5",
              margin: 0,
            }}
          >
            Pantau dan kelola laporan kerusakan atau masalah fasilitas yang Anda laporkan. Maksimal 3 laporan aktif secara bersamaan.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
          <Link
            href={canCreate ? "/pengguna/laporan/buat" : "#"}
            onClick={(e) => { if (!canCreate) e.preventDefault(); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              backgroundColor: canCreate ? "#eb9d2a" : "#9ea096",
              color: "#23251d",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              border: canCreate ? "1px solid #d88c22" : "1px solid #8a8c83",
              boxShadow: canCreate ? "0 2.5px 0 0 #b17816" : "none",
              position: "relative",
              top: "0px",
              transition: "all 0.1s ease",
              cursor: canCreate ? "pointer" : "not-allowed",
              opacity: canCreate ? 1 : 0.7,
            }}
            onMouseEnter={(e) => { if (canCreate) e.currentTarget.style.backgroundColor = "#df9323"; }}
            onMouseLeave={(e) => {
              if (canCreate) {
                e.currentTarget.style.backgroundColor = "#eb9d2a";
                e.currentTarget.style.top = "0px";
                e.currentTarget.style.boxShadow = "0 2.5px 0 0 #b17816";
              }
            }}
            onMouseDown={(e) => { if (canCreate) { e.currentTarget.style.top = "1.5px"; e.currentTarget.style.boxShadow = "none"; } }}
            onMouseUp={(e) => { if (canCreate) { e.currentTarget.style.top = "0px"; e.currentTarget.style.boxShadow = "0 2.5px 0 0 #b17816"; } }}
          >
            <Plus size={15} /> Buat Laporan
          </Link>
          {!canCreate && (
            <span style={{ fontSize: "11px", color: "#9ea096", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Batas 3 laporan aktif tercapai
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "10px",
        }}
      >
        {[
          {
            key: "",
            icon: <FileText size={18} />,
            iconBg: "#eeefe9",
            iconColor: "#23251d",
            label: "Total Laporan",
            value: stats.total,
            activeBorder: "#23251d",
            activeBg: "#ffffff",
          },
          {
            key: "new",
            icon: <Clock size={18} />,
            iconBg: "rgba(235,157,42,0.12)",
            iconColor: "#cd8407",
            label: "Menunggu / Diproses",
            value: stats.active,
            activeBorder: "#eb9d2a",
            activeBg: "#fdfaf3",
          },
          {
            key: "resolved",
            icon: <CheckCircle2 size={18} />,
            iconBg: "rgba(106,168,79,0.12)",
            iconColor: "#3d7a1c",
            label: "Selesai",
            value: stats.resolved,
            activeBorder: "#6aa84f",
            activeBg: "#f6faf3",
          },
          {
            key: "rejected",
            icon: <AlertCircle size={18} />,
            iconBg: "rgba(245,78,0,0.08)",
            iconColor: "#f54e00",
            label: "Ditolak",
            value: stats.rejected,
            activeBorder: "#f54e00",
            activeBg: "#fef8f6",
          },
        ].map((card) => {
          const isActive = activeTab === card.key || (card.key === "new" && (activeTab === "new" || activeTab === "in_progress"));
          return (
            <div
              key={card.key}
              onClick={() => setActiveTab(card.key)}
              style={{
                backgroundColor: isActive ? card.activeBg : "#fdfdf8",
                border: isActive ? `1.5px solid ${card.activeBorder}` : "1px solid #e5e7e0",
                borderRadius: "8px",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  backgroundColor: card.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
                  {card.label}
                </div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: card.iconColor, fontFamily: "'Open Runde', sans-serif" }}>
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!canCreate && (
        <div
          style={{
            backgroundColor: "#fdfaf3",
            border: "1px solid rgba(235,157,42,0.25)",
            borderRadius: "6px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "4px",
              backgroundColor: "rgba(235,157,42,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#b17816",
              flexShrink: 0,
            }}
          >
            <Info size={14} />
          </span>
          <div style={{ fontSize: "13px", color: "#4d4f46", fontFamily: "'IBM Plex Sans Variable', sans-serif", lineHeight: 1.4 }}>
            <strong>Batas laporan aktif tercapai.</strong> Anda memiliki {activeCount} laporan yang masih aktif. Laporan baru dapat dibuat setelah laporan aktif diselesaikan oleh petugas.
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "4px",
            backgroundColor: "#f5f5f0",
            padding: "3px",
            borderRadius: "6px",
            border: "1px solid #e5e7e0",
            overflowX: "auto",
            maxWidth: "100%",
          }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: active ? 600 : 500,
                  border: "none",
                  borderRadius: "4px",
                  background: active ? "#ffffff" : "transparent",
                  color: active ? "#23251d" : "#65675e",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ position: "relative", minWidth: "240px", flex: "1 1 240px", maxWidth: "340px" }}>
          <Search
            size={14}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ea096",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari fasilitas, lokasi, atau deskripsi..."
            style={{
              width: "100%",
              padding: "7px 10px 7px 30px",
              backgroundColor: "#ffffff",
              border: "1px solid #bfc1b7",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#23251d",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ea096",
                padding: "2px",
                display: "flex",
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes laporanTabFade {
          0% { opacity: 0; transform: translateY(3px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .laporan-tab-content {
          animation: laporanTabFade 0.16s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
      `}</style>

      <div
        style={{
          minHeight: "560px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <div
            style={{
              flex: 1,
              minHeight: "560px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ea096",
              fontSize: "14px",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7e0",
            }}
          >
            Memuat riwayat laporan...
          </div>
        ) : (
          <div
            key={activeTab}
            className="laporan-tab-content"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <ReportTable reports={filtered} mode="user" />
          </div>
        )}
      </div>
    </div>
  );
}
