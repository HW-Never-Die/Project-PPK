"use client";

import { useState, useEffect, useReducer } from "react";
import ReservationTable from "@/components/reservations/ReservationTable";
import Link from "next/link";
import { Plus } from "lucide-react";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  cancelReason: string | null;
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
    </div>
  );
}
