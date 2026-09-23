"use client";

import { useState, useEffect } from "react";
import ReportTable from "@/components/reports/ReportTable";

interface Report {
  id: number;
  category: string;
  description: string;
  status: string;
  photoUrl?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  facility?: { name: string; location: string };
  user?: { name: string };
  processor?: { name: string } | null;
}

export default function PetugasLaporanPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("new");
  const [notesModal, setNotesModal] = useState<{ id: number; status: string } | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/reports${filter ? `?status=${filter}` : ""}`)
      .then((r) => r.json())
      .then((d) => {
        if (!ignore) setReports(d.data ?? []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [filter, reloadKey]);

  const load = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  async function handleUpdateStatus(id: number, status: string, _notes: string) {
    if (status === "resolved" || status === "in_progress") {
      setNotesModal({ id, status });
      setNotes("");
      return;
    }
    await submitUpdate(id, status, "");
  }

  async function submitUpdate(id: number, status: string, resolution_notes: string) {
    setSaving(true);
    try {
      await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolution_notes }),
      });
      load();
    } finally {
      setSaving(false);
      setNotesModal(null);
      setNotes("");
    }
  }

  const filterTabs = [
    { value: "new", label: "Baru" },
    { value: "in_progress", label: "Diproses" },
    { value: "resolved", label: "Selesai" },
    { value: "rejected", label: "Ditolak" },
    { value: "", label: "Semua" },
  ];

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
          Kelola Laporan
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Tangani laporan kerusakan dan masalah fasilitas
        </p>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #E5E7EB",
          marginBottom: "16px",
          gap: "16px"
        }}
      >
        {filterTabs.map((t) => {
          const active = filter === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setFilter(t.value)}
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
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ color: "#9ea096", fontSize: "14px", padding: "32px 0" }}>Memuat...</div>
      ) : (
        <ReportTable reports={reports} mode="officer" onUpdateStatus={handleUpdateStatus} />
      )}

      {notesModal && (
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
              borderRadius: "6px",
              padding: "24px",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#23251d",
                marginBottom: "12px",
              }}
            >
              Catatan Resolusi
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan catatan penanganan (opsional)"
              rows={4}
              style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid #bfc1b7",
                borderRadius: "4px",
                fontSize: "14px",
                color: "#23251d",
                backgroundColor: "#ffffff",
                fontFamily: "'IBM Plex Sans Variable', sans-serif",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button
                onClick={() => { setNotesModal(null); setNotes(""); }}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #bfc1b7",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  color: "#4d4f46",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Batal
              </button>
              <button
                disabled={saving}
                onClick={() => submitUpdate(notesModal.id, notesModal.status, notes)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: saving ? "#9ea096" : "#eb9d2a",
                  color: "#23251d",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
