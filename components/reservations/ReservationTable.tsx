"use client";

import { useState } from "react";
import TagPill from "@/components/ui/TagPill";
import { FileText } from "lucide-react";

type Reservation = {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  cancelReason: string | null;
  createdAt: string;
  user?: { id: number; name: string; email: string };
  facility: { id: number; name: string; type: string; location: string };
  processor?: { id: number; name: string } | null;
};

type Props = {
  reservations: Reservation[];
  mode: "pengguna" | "petugas";
  onAction?: () => void;
};

function formatTime(isoOrTime: string): string {
  try {
    const d = new Date(isoOrTime);
    if (!isNaN(d.getTime())) {
      const h = String(d.getUTCHours()).padStart(2, "0");
      const m = String(d.getUTCMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    }
  } catch { /* noop */ }
  return isoOrTime;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return iso;
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
  verticalAlign: "top",
};

const smallBtnStyle: React.CSSProperties = {
  padding: "4px 10px",
  border: "none",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
};

export default function ReservationTable({ reservations, mode, onAction }: Props) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [cancelModal, setCancelModal] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [detailModal, setDetailModal] = useState<Reservation | null>(null);
  const [error, setError] = useState("");

  const handleAction = async (
    id: number,
    action: "approve" | "reject" | "cancel",
    reason?: string
  ) => {
    setActionLoading(id);
    setError("");
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, cancelReason: reason }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memproses aksi");
        return;
      }

      setCancelModal(null);
      setCancelReason("");
      onAction?.();
    } catch {
      setError("Kesalahan jaringan");
    } finally {
      setActionLoading(null);
    }
  };

  if (reservations.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #bfc1b7",
          borderRadius: "6px",
          padding: "48px 32px",
          textAlign: "center",
          color: "#9ea096",
          fontSize: "14px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
        }}
      >
        <FileText size={32} style={{ margin: "0 auto 12px", color: "#bfc1b7" }} />
        Belum ada reservasi
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            color: "#f54e00",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #bfc1b7",
          borderRadius: "6px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#fdfdf8" }}>
                {mode === "petugas" && <th style={thStyle}>Pemohon</th>}
                <th style={thStyle}>Fasilitas</th>
                <th style={thStyle}>Tanggal</th>
                <th style={thStyle}>Waktu</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} style={{ transition: "background 0.15s" }}>
                  {mode === "petugas" && (
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500 }}>{r.user?.name}</div>
                      <div style={{ fontSize: "11px", color: "#65675e" }}>{r.user?.email}</div>
                    </td>
                  )}
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500 }}>{r.facility.name}</div>
                    <div style={{ fontSize: "11px", color: "#65675e" }}>{r.facility.location}</div>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatDate(r.date)}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                    {formatTime(r.startTime)} - {formatTime(r.endTime)}
                  </td>
                  <td style={tdStyle}>
                    <TagPill status={r.status} />
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setDetailModal(r)}
                        style={{
                          ...smallBtnStyle,
                          backgroundColor: "transparent",
                          border: "1px solid #bfc1b7",
                          color: "#4d4f46",
                        }}
                      >
                        Detail
                      </button>

                      {mode === "petugas" && r.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() => handleAction(r.id, "approve")}
                            style={{
                              ...smallBtnStyle,
                              backgroundColor: "#eb9d2a",
                              color: "#23251d",
                            }}
                          >
                            {actionLoading === r.id ? "..." : "Setujui"}
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() => handleAction(r.id, "reject")}
                            style={{
                              ...smallBtnStyle,
                              backgroundColor: "transparent",
                              border: "1px solid #f54e00",
                              color: "#f54e00",
                            }}
                          >
                            Tolak
                          </button>
                        </>
                      )}

                      {mode === "petugas" && r.status === "approved" && (
                        <button
                          type="button"
                          onClick={() => setCancelModal(r.id)}
                          style={{
                            ...smallBtnStyle,
                            backgroundColor: "transparent",
                            border: "1px solid #f54e00",
                            color: "#f54e00",
                          }}
                        >
                          Batalkan
                        </button>
                      )}

                      {mode === "pengguna" &&
                        (r.status === "pending" || r.status === "approved") && (
                          <button
                            type="button"
                            disabled={actionLoading === r.id}
                            onClick={() => handleAction(r.id, "cancel")}
                            style={{
                              ...smallBtnStyle,
                              backgroundColor: "transparent",
                              border: "1px solid #f54e00",
                              color: "#f54e00",
                            }}
                          >
                            {actionLoading === r.id ? "..." : "Batalkan"}
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {cancelModal && (
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
              Pembatalan Darurat
            </h2>
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "rgba(235,157,42,0.1)",
                border: "1px solid rgba(235,157,42,0.3)",
                borderRadius: "4px",
                color: "#4d4f46",
                fontSize: "13px",
                marginBottom: "12px",
              }}
            >
              Pembatalan darurat akan membatalkan reservasi yang sudah disetujui.
              Alasan pembatalan wajib diisi.
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#4d4f46",
                  marginBottom: "4px",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Alasan Pembatalan
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="Jelaskan alasan pembatalan darurat..."
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
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
              <button
                type="button"
                onClick={() => {
                  setCancelModal(null);
                  setCancelReason("");
                }}
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
                type="button"
                disabled={cancelReason.length < 5 || actionLoading !== null}
                onClick={() => handleAction(cancelModal, "cancel", cancelReason)}
                style={{
                  padding: "6px 12px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: cancelReason.length < 5 || actionLoading !== null ? "#9ea096" : "#f54e00",
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: cancelReason.length < 5 || actionLoading !== null ? "not-allowed" : "pointer",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                {actionLoading ? "Memproses..." : "Konfirmasi Pembatalan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {detailModal && (
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
              maxWidth: "480px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#23251d" }}>
                Detail Reservasi #{detailModal.id}
              </h2>
              <button
                type="button"
                onClick={() => setDetailModal(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#65675e",
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <DetailRow label="Fasilitas" value={detailModal.facility.name} />
              <DetailRow label="Lokasi" value={detailModal.facility.location} />
              <DetailRow label="Tanggal" value={formatDate(detailModal.date)} />
              <DetailRow
                label="Waktu"
                value={`${formatTime(detailModal.startTime)} - ${formatTime(detailModal.endTime)}`}
              />
              <DetailRow label="Tujuan" value={detailModal.purpose} />
              <DetailRow label="Status" value={detailModal.status} />
              {detailModal.user && (
                <DetailRow label="Pemohon" value={`${detailModal.user.name} (${detailModal.user.email})`} />
              )}
              {detailModal.processor && (
                <DetailRow label="Diproses oleh" value={detailModal.processor.name} />
              )}
              {detailModal.cancelReason && (
                <DetailRow label="Alasan Batal" value={detailModal.cancelReason} />
              )}
              <DetailRow label="Diajukan" value={formatDate(detailModal.createdAt)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "12px" }}>
      <span
        style={{
          width: "110px",
          flexShrink: 0,
          fontSize: "13px",
          fontWeight: 500,
          color: "#65675e",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
        }}
      >
        {label}
      </span>
      <span style={{ color: "#23251d" }}>{value}</span>
    </div>
  );
}
