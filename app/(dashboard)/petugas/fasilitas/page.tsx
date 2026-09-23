"use client";

import { useState, useEffect } from "react";
import TagPill from "@/components/ui/TagPill";
import { Building2 } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number | null;
  status: string;
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
    fetch("/api/facilities")
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
      await fetch(`/api/facilities/${facility.id}`, {
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
    padding: "8px 12px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 500,
    color: "#65675e",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    borderBottom: "1px solid #bfc1b7",
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "10px 12px",
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
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
          }}
        >
          Status Fasilitas
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Tandai fasilitas dalam perbaikan atau kembalikan ke aktif
        </p>
      </div>

      {loading ? (
        <div style={{ color: "#9ea096", fontSize: "14px", padding: "32px 0" }}>Memuat...</div>
      ) : facilities.length === 0 ? (
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #bfc1b7",
            borderRadius: "6px",
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
            border: "1px solid #bfc1b7",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdfdf8" }}>
                <th style={thStyle}>Foto</th>
                <th style={thStyle}>Nama Fasilitas</th>
                <th style={thStyle}>Tipe</th>
                <th style={thStyle}>Lokasi</th>
                <th style={thStyle}>Kapasitas</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id}>
                  <td style={tdStyle}>
                    <img 
                      src={`https://picsum.photos/seed/${f.id}/100/70`} 
                      alt="Fasilitas" 
                      className="rounded object-cover border border-gray-300 w-[100px] h-[70px]"
                    />
                  </td>
                  <td style={tdStyle}>{f.name}</td>
                  <td style={tdStyle}>{typeLabel[f.type] ?? f.type}</td>
                  <td style={tdStyle}>{f.location}</td>
                  <td style={tdStyle}>{f.capacity ?? "—"}</td>
                  <td style={tdStyle}><TagPill status={f.status} /></td>
                  <td style={tdStyle}>
                    {f.status !== "inactive" && (
                      <button
                        disabled={saving === f.id}
                        onClick={() => toggleStatus(f)}
                        style={{
                          padding: "4px 10px",
                          border: "1px solid",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: saving === f.id ? "not-allowed" : "pointer",
                          fontFamily: "'IBM Plex Sans Variable', sans-serif",
                          backgroundColor: "transparent",
                          borderColor: f.status === "maintenance" ? "#6aa84f" : "#eb9d2a",
                          color: f.status === "maintenance" ? "#6aa84f" : "#cd8407",
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
