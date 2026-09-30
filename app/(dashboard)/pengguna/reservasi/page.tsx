"use client";

import { useState, useEffect, useReducer } from "react";
import ReservationTable from "@/components/reservations/ReservationTable";
import Link from "next/link";
import { Plus, Info, X } from "lucide-react";

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
  facility: { id: number; name: string; type: string; location: string };
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
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("reservasi_guide_dismissed");
    if (!dismissed) setShowGuide(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const params = activeTab ? `?status=${activeTab}` : "";
    fetch(`/api/reservations/my${params}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setReservations(d.data || []); })
      .catch(() => { if (!cancelled) setReservations([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeTab, refreshKey]);

  const handleTabChange = (key: string) => {
    setLoading(true);
    setActiveTab(key);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
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
            Riwayat Reservasi
          </h1>
          <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
            Daftar semua reservasi yang pernah kamu ajukan
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setShowGuide(true)}
            title="Petunjuk Reservasi"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              backgroundColor: "transparent",
              border: "1px solid #bfc1b7",
              borderRadius: "4px",
              cursor: "pointer",
              color: "#4d4f46",
            }}
          >
            <Info size={16} />
          </button>
          <Link
            href="/pengguna/reservasi/buat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              backgroundColor: "#eb9d2a",
              color: "#23251d",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            <Plus size={14} /> Reservasi Baru
          </Link>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "16px",
          gap: "16px",
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
                padding: "10px 4px",
                fontSize: "15px",
                fontWeight: active ? 700 : 500,
                border: "none",
                borderBottom: active ? "2px solid #111827" : "2px solid transparent",
                background: "transparent",
                color: active ? "#111827" : "#6B7280",
                cursor: "pointer",
                marginBottom: "-1px",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ color: "#9ea096", fontSize: "14px", padding: "32px 0" }}>Memuat...</div>
      ) : (
        <ReservationTable
          reservations={reservations}
          mode="pengguna"
          onAction={forceRefresh}
        />
      )}

      {showGuide && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #bfc1b7",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "480px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 24px",
                borderBottom: "1px solid #eeefe9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Info size={18} style={{ color: "#eb9d2a" }} />
                <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#23251d", margin: 0 }}>
                  Petunjuk Reservasi
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#65675e",
                  padding: "4px",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  backgroundColor: "rgba(235,157,42,0.08)",
                  border: "1px solid rgba(235,157,42,0.25)",
                  borderRadius: "6px",
                  padding: "12px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#23251d", marginBottom: "6px" }}>
                  Batas Waktu Pengajuan
                </div>
                <div style={{ fontSize: "13px", color: "#4d4f46", lineHeight: "1.6" }}>
                  Pengajuan reservasi harus dilakukan <strong>minimal 3 hari (H-3)</strong> sebelum tanggal kegiatan. Contoh: jika hari ini tanggal 27, maka tanggal terdekat yang dapat direservasi adalah tanggal 30.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "rgba(245,78,0,0.05)",
                  border: "1px solid rgba(245,78,0,0.2)",
                  borderRadius: "6px",
                  padding: "12px",
                }}
              >
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#23251d", marginBottom: "6px" }}>
                  Batas Waktu Pembatalan
                </div>
                <div style={{ fontSize: "13px", color: "#4d4f46", lineHeight: "1.6" }}>
                  Pembatalan reservasi juga hanya dapat dilakukan <strong>maksimal H-3</strong> sebelum tanggal kegiatan. Contoh: reservasi tanggal 30 hanya dapat dibatalkan sampai tanggal 27.
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#4d4f46",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      localStorage.setItem("reservasi_guide_dismissed", "1");
                    } else {
                      localStorage.removeItem("reservasi_guide_dismissed");
                    }
                  }}
                  style={{ accentColor: "#eb9d2a", width: "16px", height: "16px" }}
                />
                Jangan tampilkan lagi
              </label>
            </div>

            <div
              style={{
                padding: "12px 24px",
                borderTop: "1px solid #eeefe9",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                style={{
                  padding: "6px 16px",
                  backgroundColor: "#eb9d2a",
                  color: "#23251d",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
