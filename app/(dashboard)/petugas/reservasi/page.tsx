"use client";

import { useState, useEffect, useReducer, useMemo } from "react";
import ReservationTable from "@/views/reservations/ReservationTable";
import SkyscraperBackground from "@/views/reservations/SkyscraperBackground";
import Link from "next/link";
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  cancelReason: string | null;
  rejectReason: string | null;
  processedAt: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
  facility: { id: number; name: string; type: string; location: string; imageUrl?: string | null; capacity?: number | null };
  processor?: { id: number; name: string } | null;
};

const TABS = [
  { key: "pending", label: "Menunggu Persetujuan" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
  { key: "cancelled", label: "Dibatalkan" },
  { key: "", label: "Semua" },
];

export default function KelolaReservasiPetugasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reservations")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setReservations(d.data || []);
      })
      .catch(() => {
        if (!cancelled) setReservations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const filteredReservations = useMemo(() => {
    let list = reservations;
    if (activeTab) {
      list = list.filter((r) => r.status === activeTab);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (r) =>
        r.facility.name.toLowerCase().includes(q) ||
        r.facility.location.toLowerCase().includes(q) ||
        r.purpose.toLowerCase().includes(q) ||
        r.user.name.toLowerCase().includes(q) ||
        r.user.email.toLowerCase().includes(q) ||
        String(r.id).includes(q)
    );
  }, [reservations, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const approved = reservations.filter((r) => r.status === "approved").length;
    const rejectedOrCancelled = reservations.filter(
      (r) => r.status === "rejected" || r.status === "cancelled"
    ).length;
    return { total, pending, approved, rejectedOrCancelled };
  }, [reservations]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="reservation-page-wrapper" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
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
          <Link href="/petugas" style={{ color: "#23251d", textDecoration: "none", fontWeight: 600 }}>
            Eunomia OS
          </Link>
          <span>/</span>
          <span>Panel Petugas</span>
          <span>/</span>
          <span style={{ color: "#23251d", fontWeight: 500 }}>Kelola Reservasi</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            title="Maximize"
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              border: "1px solid #bfc1b7",
            }}
          />
          <span
            title="Close"
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
        <div style={{ maxWidth: "680px" }}>
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
              textTransform: "uppercase",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              marginBottom: "8px",
            }}
          >
            <ShieldCheck size={13} />
            Moderasi Jadwal Peminjaman
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
            Kelola Pengajuan Reservasi
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
            Tinjau, setujui, tolak, atau lakukan pembatalan darurat pada jadwal fasilitas FSM yang diajukan mahasiswa dan civitas.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "10px",
        }}
      >
        <div
          onClick={() => handleTabChange("pending")}
          style={{
            backgroundColor: activeTab === "pending" ? "#fdfaf3" : "#fdfdf8",
            border: activeTab === "pending" ? "1.5px solid #eb9d2a" : "1px solid #e5e7e0",
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
              backgroundColor: "rgba(235,157,42,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#cd8407",
            }}
          >
            <Clock size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Antrean Menunggu
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#cd8407", fontFamily: "'Open Runde', sans-serif" }}>
              {stats.pending}
            </div>
          </div>
        </div>

        <div
          onClick={() => handleTabChange("approved")}
          style={{
            backgroundColor: activeTab === "approved" ? "#f6faf3" : "#fdfdf8",
            border: activeTab === "approved" ? "1.5px solid #6aa84f" : "1px solid #e5e7e0",
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
              backgroundColor: "rgba(106,168,79,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3d7a1c",
            }}
          >
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Telah Disetujui
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#3d7a1c", fontFamily: "'Open Runde', sans-serif" }}>
              {stats.approved}
            </div>
          </div>
        </div>

        <div
          onClick={() => handleTabChange("rejected")}
          style={{
            backgroundColor: activeTab === "rejected" || activeTab === "cancelled" ? "#fef8f6" : "#fdfdf8",
            border: activeTab === "rejected" || activeTab === "cancelled" ? "1.5px solid #f54e00" : "1px solid #e5e7e0",
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
              backgroundColor: "rgba(245,78,0,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f54e00",
            }}
          >
            <AlertCircle size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Ditolak / Batal
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#f54e00", fontFamily: "'Open Runde', sans-serif" }}>
              {stats.rejectedOrCancelled}
            </div>
          </div>
        </div>

        <div
          onClick={() => handleTabChange("")}
          style={{
            backgroundColor: activeTab === "" ? "#ffffff" : "#fdfdf8",
            border: activeTab === "" ? "1.5px solid #23251d" : "1px solid #e5e7e0",
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
              backgroundColor: "#eeefe9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#23251d",
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
              Semua Pengajuan
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#23251d", fontFamily: "'Open Runde', sans-serif" }}>
              {stats.total}
            </div>
          </div>
        </div>
      </div>

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
                onClick={() => handleTabChange(tab.key)}
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
            placeholder="Cari pemohon, fasilitas, atau ID..."
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
        @keyframes reservationTabFade {
          0% {
            opacity: 0;
            transform: translateY(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reservation-tab-content {
          animation: reservationTabFade 0.16s cubic-bezier(0.16, 1, 0.3, 1);
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
            Memuat data moderasi reservasi...
          </div>
        ) : (
          <div
            key={activeTab}
            className="reservation-tab-content"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <ReservationTable
              reservations={filteredReservations}
              mode="petugas"
              activeTab={activeTab}
              onAction={forceRefresh}
            />
          </div>
        )}
      </div>
    </div>
  );
}