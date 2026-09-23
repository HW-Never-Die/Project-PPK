"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ReportTable from "@/components/reports/ReportTable";
import { Plus } from "lucide-react";

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

export default function RiwayatLaporanPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/reports/my")
      .then((r) => r.json())
      .then((d) => setReports(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? reports.filter((r) => r.status === filter) : reports;

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
            Laporan Saya
          </h1>
          <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
            Riwayat laporan kerusakan yang Anda kirim
          </p>
        </div>
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
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          <Plus size={14} /> Buat Laporan
        </Link>
      </div>

      <div style={{ marginBottom: "12px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {["", "new", "in_progress", "resolved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "4px 10px",
              borderRadius: "4px",
              border: "1px solid #bfc1b7",
              backgroundColor: filter === s ? "#23251d" : "#ffffff",
              color: filter === s ? "#ffffff" : "#4d4f46",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            {s === "" ? "Semua" : s === "new" ? "Baru" : s === "in_progress" ? "Diproses" : s === "resolved" ? "Selesai" : "Ditolak"}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: "#9ea096", fontSize: "14px", padding: "32px 0" }}>Memuat...</div>
      ) : (
        <ReportTable reports={filtered} mode="user" />
      )}
    </div>
  );
}
