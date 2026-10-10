"use client";

import { useState, useEffect, useReducer, useMemo } from "react";
import ReservationTable from "@/components/reservations/ReservationTable";
import SkyscraperBackground from "@/components/reservations/SkyscraperBackground";
import Link from "next/link";
import {
  CalendarPlus,
  Info,
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronRight,
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
  facility: { id: number; name: string; type: string; location: string; imageUrl?: string | null };
  processor?: { id: number; name: string } | null;
};

const TABS = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
  { key: "cancelled", label: "Dibatalkan" },
];

export default function RiwayatReservasiPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showPolicyBanner, setShowPolicyBanner] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const isDismissed = localStorage.getItem("reservasi_policy_banner_dismissed");
        if (!isDismissed) {
          setShowPolicyBanner(true);
        }
      } catch {
        setShowPolicyBanner(true);
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleDismissPolicyBanner = () => {
    setShowPolicyBanner(false);
    try {
      localStorage.setItem("reservasi_policy_banner_dismissed", "1");
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reservations/my")
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

  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const approved = reservations.filter((r) => r.status === "approved").length;
    const rejectedOrCancelled = reservations.filter(
      (r) => r.status === "rejected" || r.status === "cancelled"
    ).length;
    return { total, pending, approved, rejectedOrCancelled };
  }, [reservations]);

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
        String(r.id).includes(q)
    );
  }, [reservations, activeTab, searchQuery]);

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
          <Link href="/pengguna" style={{ color: "#23251d", textDecoration: "none", fontWeight: 600 }}>
            Eunomia OS
          </Link>
          <span>/</span>
          <span>Peminjaman Fasilitas</span>
          <span>/</span>
          <span style={{ color: "#23251d", fontWeight: 500 }}>Riwayat Reservasi</span>
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
            Peminjaman Fasilitas Kampus
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
            Kelola dan pantau seluruh jadwal peminjaman ruang kelas, aula, serta laboratorium. Pastikan pengajuan dilakukan minimal 3 hari sebelum kegiatan (H-3).
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#4d4f46",
              cursor: "pointer",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              transition: "all 0.1s ease",
              boxShadow: "0 2px 0 0 #d1d1c9",
              position: "relative",
              top: "0px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f0";
              e.currentTarget.style.borderColor = "#bfc1b7";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#ffffff";
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.top = "0px";
              e.currentTarget.style.boxShadow = "0 2px 0 0 #d1d1c9";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.top = "1.5px";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.top = "0px";
              e.currentTarget.style.boxShadow = "0 2px 0 0 #d1d1c9";
            }}
          >
            <Info size={14} style={{ color: "#eb9d2a" }} />
            Ketentuan H-3
          </button>

          <Link
            href="/pengguna/reservasi/buat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 16px",
              backgroundColor: "#eb9d2a",
              color: "#23251d",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              border: "1px solid #d88c22",
              boxShadow: "0 2.5px 0 0 #b17816",
              position: "relative",
              top: "0px",
              transition: "all 0.1s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#df9323";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#eb9d2a";
              e.currentTarget.style.top = "0px";
              e.currentTarget.style.boxShadow = "0 2.5px 0 0 #b17816";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.top = "1.5px";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.top = "0px";
              e.currentTarget.style.boxShadow = "0 2.5px 0 0 #b17816";
            }}
          >
            <CalendarPlus size={15} /> Ajukan Reservasi
          </Link>
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
              Total Pengajuan
            </div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#23251d", fontFamily: "'Open Runde', sans-serif" }}>
              {stats.total}
            </div>
          </div>
        </div>

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
              Menunggu Petugas
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
      </div>

      {showPolicyBanner && (
        <div
          style={{
            backgroundColor: "#fdfaf3",
            border: "1px solid rgba(235,157,42,0.25)",
            borderRadius: "6px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              <strong>Ketentuan H-3:</strong> Pengajuan dan pembatalan reservasi diproses paling lambat <strong>3 hari sebelum kegiatan</strong>. Jam operasional fasilitas pukul <strong>07:00 – 20:00 WIB</strong>.
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismissPolicyBanner}
            style={{
              background: "none",
              border: "none",
              color: "#9ea096",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Tutup banner"
          >
            <X size={15} />
          </button>
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
            placeholder="Cari fasilitas, lokasi, atau keperluan..."
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
        body > .relative.z-0:has(.reservation-page-wrapper) {
          z-index: auto;
        }
        @keyframes reservationTabFade {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        .reservation-tab-content {
          animation: reservationTabFade 0.16s cubic-bezier(0.16, 1, 0.3, 1);
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
            Memuat riwayat reservasi...
          </div>
        ) : (
          <div
            key={activeTab}
            className="reservation-tab-content"
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <ReservationTable
              reservations={filteredReservations}
              mode="pengguna"
              activeTab={activeTab}
              onAction={forceRefresh}
            />
          </div>
        )}
      </div>

      {showGuideModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            backdropFilter: "blur(3px)",
            padding: "24px 16px",
            overflowY: "auto",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowGuideModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "calc(100vh - 80px)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
              border: "1px solid #d1d5db",
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: "1px solid #e5e7e0",
                backgroundColor: "#fdfdf8",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(235,157,42,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Info size={15} style={{ color: "#eb9d2a" }} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#23251d",
                      margin: 0,
                      fontFamily: "'Open Runde', sans-serif",
                    }}
                  >
                    Petunjuk Peminjaman Fasilitas
                  </h2>
                  <div style={{ fontSize: "11px", color: "#65675e", fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
                    Fakultas Sains dan Matematika Undip
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#65675e",
                  padding: "4px",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
              <div
                style={{
                  backgroundColor: "#fdfaf3",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  border: "1px solid rgba(235,157,42,0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#23251d",
                    marginBottom: "4px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ChevronRight size={13} style={{ color: "#eb9d2a" }} />
                  Batas Waktu Pengajuan (Minimal H-3)
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#4d4f46",
                    lineHeight: "1.5",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  Pengajuan reservasi wajib diajukan paling lambat 3 hari kalender sebelum tanggal pemakaian agar petugas memiliki waktu cukup untuk meninjau ketersediaan ruangan.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#fef7f4",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  border: "1px solid rgba(245,78,0,0.18)",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#23251d",
                    marginBottom: "4px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ChevronRight size={13} style={{ color: "#f54e00" }} />
                  Batas Waktu Pembatalan (Maksimal H-3)
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#4d4f46",
                    lineHeight: "1.5",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  Pembatalan mandiri hanya dapat dilakukan paling lambat H-3 sebelum tanggal kegiatan. Pembatalan mendadak harus berkoordinasi langsung dengan pihak pengelola fasilitas.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#f5f5f0",
                  borderRadius: "8px",
                  padding: "12px 14px",
                  border: "1px solid #e5e7e0",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#23251d",
                    marginBottom: "4px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ChevronRight size={13} style={{ color: "#65675e" }} />
                  Jam Operasional & Kelipatan Slot
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#4d4f46",
                    lineHeight: "1.5",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  Fasilitas dapat dipinjam mulai pukul 07:00 hingga 20:00 WIB dalam kelipatan 30 menit. Slot waktu yang dipilih dalam satu pengajuan harus berkesinambungan.
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #e5e7e0",
                display: "flex",
                justifyContent: "flex-end",
                backgroundColor: "#fdfdf8",
              }}
            >
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                style={{
                  padding: "7px 16px",
                  backgroundColor: "#eb9d2a",
                  color: "#23251d",
                  border: "1px solid #d88c22",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}