"use client";

import { useState, useEffect } from "react";
import TagPill from "@/views/ui/TagPill";
import { Building2 } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  status: string;
  imageUrl?: string | null;
}

const typeLabel: Record<string, string> = {
  ruang_kelas: "Ruang Kelas",
  aula: "Aula",
  laboratorium: "Laboratorium",
  alat: "Alat",
  lapangan: "Lapangan",
};

export default function PetugasFasilitasPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/controller/facilities")
      .then((r) => r.json())
      .then((d) => {
        if (!ignore) setFacilities(d.data ?? []);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function toggleStatus(facility: Facility) {
    const next = facility.status === "maintenance" ? "active" : "maintenance";
    setSaving(facility.id);
    try {
      await fetch(`/controller/facilities/${facility.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      setFacilities((prev) =>
        prev.map((f) => (f.id === facility.id ? { ...f, status: next } : f))
      );
    } finally {
      setSaving(null);
    }
  }

  const thStyle: React.CSSProperties = {
    padding: "10px 14px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "#65675e",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    borderBottom: "1px solid #e5e7e0",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 14px",
    textAlign: "center",
    fontSize: "13px",
    color: "#23251d",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    borderBottom: "1px solid #eeefe9",
    verticalAlign: "middle",
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
            fontFamily: "'Open Runde', sans-serif",
          }}
        >
          Status Fasilitas
        </h1>
        <p style={{ fontSize: "14px", color: "#4B5563", fontWeight: 400, fontFamily: "'IBM Plex Sans Variable', sans-serif", lineHeight: 1.5 }}>
          Tandai fasilitas dalam perbaikan atau kembalikan ke aktif
        </p>
      </div>

      {loading ? (
        <div style={{ color: "#9ea096", fontSize: "14px", padding: "32px 0" }}>Memuat...</div>
      ) : facilities.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7e0",
            borderRadius: "8px",
            padding: "48px 32px",
            textAlign: "center",
            color: "#9ea096",
            fontSize: "14px",
          }}
        >
          <Building2 size={32} style={{ margin: "0 auto 12px", color: "#bfc1b7" }} />
          Tidak ada fasilitas
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7e0",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdfdf8" }}>
                <th style={thStyle}>Nama Fasilitas</th>
                <th style={thStyle}>Tipe</th>
                <th style={thStyle}>Lokasi</th>
                <th style={thStyle}>Kapasitas</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => {
                return (
                <tr key={f.id}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{f.name}</td>
                  <td style={tdStyle}>{typeLabel[f.type] ?? f.type}</td>
                  <td style={tdStyle}>{f.location}</td>
                  <td style={tdStyle}>{f.capacity ? `${f.capacity} orang` : "—"}</td>
                  <td style={tdStyle}><TagPill status={f.status} /></td>
                  <td style={tdStyle}>
                    {f.status !== "inactive" && (
                      <button
                        disabled={saving === f.id}
                        onClick={() => toggleStatus(f)}
                        style={{
                          position: "relative",
                          top: 0,
                          padding: "5px 12px",
                          border: `1px solid ${f.status === "maintenance" ? "#6aa84f" : "#d88c22"}`,
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: saving === f.id ? "not-allowed" : "pointer",
                          fontFamily: "'IBM Plex Sans Variable', sans-serif",
                          backgroundColor: f.status === "maintenance" ? "#f6faf3" : "#fdfaf3",
                          color: f.status === "maintenance" ? "#3d7a1c" : "#cd8407",
                          boxShadow: "0 2px 0 0 rgba(0,0,0,0.08)",
                          transition: "all 0.1s ease",
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.top = "1.5px";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.top = "0px";
                          e.currentTarget.style.boxShadow = "0 2px 0 0 rgba(0,0,0,0.08)";
                        }}
                      >
                        {saving === f.id
                          ? "..."
                          : f.status === "maintenance"
                          ? "Kembalikan ke Aktif"
                          : "Tandai Perbaikan"}
                      </button>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
