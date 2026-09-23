"use client";

import { useState, useEffect, useReducer } from "react";
import ReservationTable from "@/components/reservations/ReservationTable";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  cancelReason: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
  facility: { id: number; name: string; type: string; location: string };
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
  const [refreshKey, forceRefresh] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;
    const params = activeTab ? `?status=${activeTab}` : "";
    fetch(`/api/reservations${params}`)
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
          Kelola Reservasi
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Proses persetujuan, penolakan, dan pembatalan darurat reservasi
        </p>
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
                whiteSpace: "nowrap",
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
          mode="petugas"
          onAction={forceRefresh}
        />
      )}
    </div>
  );
}
