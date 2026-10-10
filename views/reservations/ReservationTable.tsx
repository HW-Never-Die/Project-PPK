"use client";

import { useState } from "react";
import Image from "next/image";
import TagPill from "@/views/ui/TagPill";
import {
  FileText,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  X,
  Users,
  Eye,
  Check,
  AlertTriangle,
  Building2,
  User,
  ShieldAlert,
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
  user?: { id: number; name: string; email: string };
  facility: {
    id: number;
    name: string;
    type: string;
    location: string;
    imageUrl?: string | null;
    capacity?: number | null;
  };
  processor?: { id: number; name: string } | null;
};

type Props = {
  reservations: Reservation[];
  mode: "pengguna" | "petugas";
  activeTab?: string;
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
  } catch {
    /* noop */
  }
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

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  } catch {
    return iso;
  }
}

const facilityTypeLabels: Record<string, string> = {
  ruang_kelas: "Ruang Kelas",
  aula: "Aula Kampus",
  laboratorium: "Laboratorium",
  alat: "Peralatan",
  lapangan: "Lapangan Olahraga",
};

const statusColor: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "rgba(235,157,42,0.1)", text: "#b27d00", border: "rgba(235,157,42,0.3)" },
  approved: { bg: "rgba(106,168,79,0.1)", text: "#3d7a1c", border: "rgba(106,168,79,0.3)" },
  rejected: { bg: "rgba(245,78,0,0.08)", text: "#f54e00", border: "rgba(245,78,0,0.25)" },
  cancelled: { bg: "rgba(158,160,150,0.1)", text: "#65675e", border: "rgba(158,160,150,0.3)" },
};

const statusLabelMap: Record<string, string> = {
  pending: "menunggu",
  approved: "disetujui",
  rejected: "ditolak",
  cancelled: "dibatalkan",
};

const MAX_VISIBLE = 5;

type ActionBtnVariant = "neutral" | "primary" | "danger" | "ghost";

function ActionBtn({
  variant = "neutral",
  disabled,
  onClick,
  children,
  title,
}: {
  variant?: ActionBtnVariant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  title?: string;
}) {
  const styles: Record<ActionBtnVariant, { bg: string; color: string; border: string; shadow: string; hoverBg: string }> = {
    primary: {
      bg: "#eb9d2a",
      color: "#23251d",
      border: "1px solid #d88c22",
      shadow: "0 2px 0 0 #b17816",
      hoverBg: "#df9323",
    },
    neutral: {
      bg: "#ffffff",
      color: "#4d4f46",
      border: "1px solid #d1d5db",
      shadow: "0 2px 0 0 #d1d1c9",
      hoverBg: "#f5f5f0",
    },
    danger: {
      bg: "#fef2f2",
      color: "#f54e00",
      border: "1px solid rgba(245,78,0,0.25)",
      shadow: "0 2px 0 0 rgba(245,78,0,0.25)",
      hoverBg: "#fee2e2",
    },
    ghost: {
      bg: "transparent",
      color: "#65675e",
      border: "1px solid transparent",
      shadow: "none",
      hoverBg: "#f5f5f0",
    },
  };

  const s = styles[variant];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        padding: "5px 12px",
        border: s.border,
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'IBM Plex Sans Variable', sans-serif",
        transition: "all 0.1s ease",
        backgroundColor: disabled ? "#e5e7e0" : s.bg,
        color: disabled ? "#9ea096" : s.color,
        boxShadow: disabled ? "none" : s.shadow,
        position: "relative",
        top: "0px",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = s.hoverBg;
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = s.bg;
          e.currentTarget.style.top = "0px";
          e.currentTarget.style.boxShadow = s.shadow;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.top = "1.5px";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          e.currentTarget.style.top = "0px";
          e.currentTarget.style.boxShadow = s.shadow;
        }
      }}
    >
      {children}
    </button>
  );
}

export default function ReservationTable({ reservations, mode, activeTab = "", onAction }: Props) {
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [cancelModal, setCancelModal] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [rejectModal, setRejectModal] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailModal, setDetailModal] = useState<Reservation | null>(null);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [prevTab, setPrevTab] = useState(activeTab);

  if (activeTab !== prevTab) {
    setPrevTab(activeTab);
    setShowAll(false);
  }

  const skipLimit = mode === "petugas" && activeTab === "pending";
  const visibleReservations =
    skipLimit || showAll ? reservations : reservations.slice(0, MAX_VISIBLE);
  const hasMore = !skipLimit && reservations.length > MAX_VISIBLE;

  const canUserCancel = (r: Reservation): boolean => {
    const now = new Date();
    const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const todayStr = wib.toISOString().split("T")[0]!;
    const todayDate = new Date(todayStr + "T00:00:00.000Z");
    const resDate = new Date(new Date(r.date).toISOString().split("T")[0]! + "T00:00:00.000Z");
    const diff = Math.floor((resDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 3;
  };

  const handleAction = async (
    id: number,
    action: "approve" | "reject" | "cancel",
    reason?: string
  ) => {
    setActionLoading(id);
    setError("");
    try {
      const body: Record<string, unknown> = { action };
      if (action === "cancel") body.cancelReason = reason;
      if (action === "reject") body.rejectReason = reason;

      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal memproses aksi");
        return;
      }

      setCancelModal(null);
      setCancelReason("");
      setRejectModal(null);
      setRejectReason("");
      if (detailModal && detailModal.id === id) {
        setDetailModal(null);
      }
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
          minHeight: "560px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          border: "1px dashed #bfc1b7",
          borderRadius: "8px",
          padding: "48px 24px",
          textAlign: "center",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            backgroundColor: "#f5f5f0",
            border: "1px solid #e5e7e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
            color: "#9ea096",
          }}
        >
          <FileText size={24} />
        </div>
        <div
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#23251d",
            marginBottom: "4px",
            fontFamily: "'Open Runde', sans-serif",
          }}
        >
          Tidak ada data reservasi
        </div>
        <div style={{ fontSize: "13px", color: "#65675e", maxWidth: "360px", margin: "0 auto", lineHeight: "1.5" }}>
          {activeTab
            ? `Tidak ditemukan reservasi dengan status "${statusLabelMap[activeTab] || activeTab}" saat ini.`
            : "Belum ada pengajuan reservasi fasilitas. Silakan ajukan permohonan baru."}
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div
          style={{
            marginBottom: "14px",
            padding: "10px 14px",
            backgroundColor: "#fef2f2",
            border: "1px solid rgba(245,78,0,0.25)",
            borderRadius: "6px",
            color: "#f54e00",
            fontSize: "13px",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            style={{ background: "none", border: "none", color: "#f54e00", cursor: "pointer", padding: "2px" }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      <div
        style={{
          minHeight: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          boxSizing: "border-box",
        }}
      >
        {visibleReservations.map((r) => {
          const userCanCancel = canUserCancel(r);
          const hasImage = Boolean(r.facility.imageUrl);

          return (
            <div
              key={r.id}
              onClick={() => setDetailModal(r)}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7e0",
                borderRadius: "8px",
                padding: "16px 18px",
                transition: "all 0.15s ease",
                cursor: "pointer",
                display: "flex",
                gap: "16px",
                alignItems: "flex-start",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#bfc1b7";
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7e0";
                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.02)";
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "80px",
                  borderRadius: "6px",
                  backgroundColor: "#f5f5f0",
                  border: "1px solid #e5e7e0",
                  overflow: "hidden",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {hasImage ? (
                  <Image
                    src={r.facility.imageUrl!}
                    alt={r.facility.name}
                    fill
                    sizes="100px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Building2 size={26} style={{ color: "#b3b3af" }} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginBottom: "4px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span
                      style={{
                        fontFamily: "'Source Code Pro', ui-monospace, monospace",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#b17816",
                        backgroundColor: "rgba(235,157,42,0.1)",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        letterSpacing: "0.2px",
                      }}
                    >
                      RES-#{String(r.id).padStart(4, "0")}
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#65675e",
                        backgroundColor: "#f5f5f0",
                        padding: "1px 7px",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                        textTransform: "uppercase",
                      }}
                    >
                      {facilityTypeLabels[r.facility.type] || r.facility.type}
                    </span>

                    <TagPill status={r.status} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ActionBtn variant="neutral" onClick={() => setDetailModal(r)}>
                      <Eye size={13} />
                      Detail
                    </ActionBtn>

                    {mode === "petugas" && r.status === "pending" && (
                      <>
                        <ActionBtn
                          variant="primary"
                          disabled={actionLoading === r.id}
                          onClick={() => handleAction(r.id, "approve")}
                        >
                          <Check size={13} />
                          {actionLoading === r.id ? "..." : "Setujui"}
                        </ActionBtn>
                        <ActionBtn
                          variant="danger"
                          disabled={actionLoading === r.id}
                          onClick={() => setRejectModal(r.id)}
                        >
                          <X size={13} />
                          Tolak
                        </ActionBtn>
                      </>
                    )}

                    {mode === "petugas" && r.status === "approved" && (
                      <ActionBtn variant="danger" onClick={() => setCancelModal(r.id)}>
                        <AlertTriangle size={13} />
                        Batal Darurat
                      </ActionBtn>
                    )}

                    {mode === "pengguna" && r.status === "pending" && (
                      userCanCancel ? (
                        <ActionBtn
                          variant="danger"
                          disabled={actionLoading === r.id}
                          onClick={() => handleAction(r.id, "cancel")}
                        >
                          <X size={13} />
                          {actionLoading === r.id ? "..." : "Batalkan"}
                        </ActionBtn>
                      ) : (
                        <span
                          title="Batas pembatalan ditutup (wajib H-3)"
                          style={{
                            fontSize: "11px",
                            color: "#9ea096",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f0",
                            border: "1px solid #e5e7e0",
                            fontFamily: "'IBM Plex Sans Variable', sans-serif",
                          }}
                        >
                          Lewat H-3
                        </span>
                      )
                    )}

                    {mode === "pengguna" && r.status === "approved" && (
                      userCanCancel ? (
                        <ActionBtn variant="danger" onClick={() => setCancelModal(r.id)}>
                          <X size={13} />
                          Batalkan
                        </ActionBtn>
                      ) : (
                        <span
                          title="Batas pembatalan ditutup (wajib H-3)"
                          style={{
                            fontSize: "11px",
                            color: "#9ea096",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f0",
                            border: "1px solid #e5e7e0",
                            fontFamily: "'IBM Plex Sans Variable', sans-serif",
                          }}
                        >
                          Lewat H-3
                        </span>
                      )
                    )}
                  </div>
                </div>

                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#23251d",
                    margin: "0 0 6px 0",
                    fontFamily: "'Open Runde', sans-serif",
                  }}
                >
                  {r.facility.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "12px",
                    color: "#65675e",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={13} style={{ color: "#9ea096" }} />
                    {r.facility.location}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={13} style={{ color: "#9ea096" }} />
                    {formatDate(r.date)}
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontFamily: "'Source Code Pro', ui-monospace, monospace",
                      fontWeight: 600,
                      color: "#23251d",
                      backgroundColor: "rgba(235,157,42,0.12)",
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    <Clock size={12} style={{ color: "#b17816" }} />
                    {formatTime(r.startTime)} – {formatTime(r.endTime)} WIB
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#4d4f46",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    backgroundColor: "#fdfdf8",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid #e5e7e0",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ fontWeight: 600, color: "#65675e", marginRight: "6px" }}>Keperluan:</span>
                  {r.purpose}
                </div>

                {mode === "petugas" && r.user && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "11px",
                      color: "#65675e",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    }}
                  >
                    <User size={12} style={{ color: "#9ea096" }} />
                    Pemohon: <strong>{r.user.name}</strong> ({r.user.email})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            width: "100%",
            padding: "9px 0",
            marginTop: "10px",
            backgroundColor: "#ffffff",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#4d4f46",
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f0";
            e.currentTarget.style.borderColor = "#bfc1b7";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          <ChevronDown size={15} />
          Tampilkan {reservations.length - MAX_VISIBLE} reservasi lainnya
        </button>
      )}

      {cancelModal && (
        <ModalOverlay onClose={() => { setCancelModal(null); setCancelReason(""); }}>
          <ModalCard>
            <ModalHeader
              title={mode === "petugas" ? "Pembatalan Darurat Petugas" : "Batalkan Reservasi"}
              onClose={() => {
                setCancelModal(null);
                setCancelReason("");
              }}
            />
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#fdfaf3",
                  border: "1px solid rgba(235,157,42,0.25)",
                  borderRadius: "6px",
                  color: "#4d4f46",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                {mode === "petugas"
                  ? "Pembatalan darurat akan membatalkan reservasi yang telah disetujui. Berikan alasan pembatalan resmi."
                  : "Anda yakin ingin membatalkan reservasi ini? Masukkan alasan pembatalan minimal 5 karakter."}
              </div>
              <div>
                <label style={modalLabelStyle}>Alasan Pembatalan</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan alasan pembatalan..."
                  style={modalTextareaStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <ModalBtn
                  variant="secondary"
                  onClick={() => {
                    setCancelModal(null);
                    setCancelReason("");
                  }}
                >
                  Tutup
                </ModalBtn>
                <ModalBtn
                  variant="danger"
                  disabled={cancelReason.trim().length < 5 || actionLoading !== null}
                  onClick={() => handleAction(cancelModal, "cancel", cancelReason)}
                >
                  {actionLoading ? "Memproses..." : "Konfirmasi Pembatalan"}
                </ModalBtn>
              </div>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {rejectModal && (
        <ModalOverlay onClose={() => { setRejectModal(null); setRejectReason(""); }}>
          <ModalCard>
            <ModalHeader
              title="Tolak Pengajuan Reservasi"
              onClose={() => {
                setRejectModal(null);
                setRejectReason("");
              }}
            />
            <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#fef7f4",
                  border: "1px solid rgba(245,78,0,0.18)",
                  borderRadius: "6px",
                  color: "#4d4f46",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Berikan alasan penolakan agar pemohon dapat merevisi jadwal atau memilih fasilitas alternatif.
              </div>
              <div>
                <label style={modalLabelStyle}>Alasan Penolakan</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Contoh: Ruangan digunakan untuk agenda dinas universitas..."
                  style={modalTextareaStyle}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <ModalBtn
                  variant="secondary"
                  onClick={() => {
                    setRejectModal(null);
                    setRejectReason("");
                  }}
                >
                  Tutup
                </ModalBtn>
                <ModalBtn
                  variant="danger"
                  disabled={rejectReason.trim().length < 5 || actionLoading !== null}
                  onClick={() => handleAction(rejectModal, "reject", rejectReason)}
                >
                  {actionLoading ? "Memproses..." : "Konfirmasi Penolakan"}
                </ModalBtn>
              </div>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {detailModal && (() => {
        const sc = statusColor[detailModal.status] || statusColor.pending;
        const isProcessed = detailModal.status !== "pending";
        const hasImg = Boolean(detailModal.facility.imageUrl);

        return (
          <ModalOverlay onClose={() => setDetailModal(null)}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "540px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
                border: "1px solid #d1d5db",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
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
                  <span
                    style={{
                      fontFamily: "'Source Code Pro', monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#b17816",
                      backgroundColor: "rgba(235,157,42,0.1)",
                      padding: "2px 7px",
                      borderRadius: "4px",
                    }}
                  >
                    RES-#{String(detailModal.id).padStart(4, "0")}
                  </span>
                  <TagPill status={detailModal.status} />
                </div>
                <button
                  type="button"
                  onClick={() => setDetailModal(null)}
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

              <div style={{ padding: "18px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
                {hasImg && (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                      border: "1px solid #e5e7e0",
                    }}
                  >
                    <Image
                      src={detailModal.facility.imageUrl!}
                      alt={detailModal.facility.name}
                      fill
                      sizes="540px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}

                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#65675e", textTransform: "uppercase", marginBottom: "2px" }}>
                    {facilityTypeLabels[detailModal.facility.type] || detailModal.facility.type}
                  </div>
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "#23251d",
                      margin: 0,
                      fontFamily: "'Open Runde', sans-serif",
                    }}
                  >
                    {detailModal.facility.name}
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    backgroundColor: "#fdfdf8",
                    padding: "12px 14px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7e0",
                  }}
                >
                  <DetailCell label="Lokasi Gedung" value={detailModal.facility.location} />
                  <DetailCell
                    label="Kapasitas Ruangan"
                    value={
                      detailModal.facility.capacity ? `${detailModal.facility.capacity} Orang` : "Standar FSM"
                    }
                  />
                  <DetailCell label="Tanggal Kegiatan" value={formatDate(detailModal.date)} />
                  <DetailCell
                    label="Waktu Pemakaian"
                    value={`${formatTime(detailModal.startTime)} – ${formatTime(detailModal.endTime)} WIB`}
                    mono
                  />
                </div>

                <div
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7e0",
                    borderRadius: "8px",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#65675e",
                      marginBottom: "4px",
                      textTransform: "uppercase",
                      letterSpacing: "0.3px",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    }}
                  >
                    Tujuan & Rencana Penggunaan
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#23251d",
                      lineHeight: "1.5",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    }}
                  >
                    {detailModal.purpose}
                  </div>
                </div>

                {detailModal.user && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      backgroundColor: "#f5f5f0",
                      borderRadius: "6px",
                      border: "1px solid #e5e7e0",
                    }}
                  >
                    <Users size={16} style={{ color: "#65675e" }} />
                    <div style={{ fontSize: "12px", color: "#4d4f46" }}>
                      Pemohon: <strong>{detailModal.user.name}</strong> ({detailModal.user.email})
                    </div>
                  </div>
                )}

                <div style={{ borderTop: "1px solid #e5e7e0", paddingTop: "12px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    <DetailCell label="Waktu Diajukan" value={formatDateTime(detailModal.createdAt)} />
                    {isProcessed && detailModal.processedAt && (
                      <DetailCell
                        label={
                          detailModal.status === "approved"
                            ? "Waktu Disetujui"
                            : detailModal.status === "rejected"
                              ? "Waktu Ditolak"
                              : "Waktu Dibatalkan"
                        }
                        value={formatDateTime(detailModal.processedAt)}
                      />
                    )}
                  </div>
                  {isProcessed && detailModal.processor && (
                    <div style={{ marginTop: "8px" }}>
                      <DetailCell label="Petugas yang Menangani" value={detailModal.processor.name} />
                    </div>
                  )}
                </div>

                {(detailModal.cancelReason || detailModal.rejectReason) && (
                  <div
                    style={{
                      backgroundColor: sc.bg,
                      border: `1px solid ${sc.border}`,
                      borderRadius: "8px",
                      padding: "12px 14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: sc.text,
                        marginBottom: "4px",
                        letterSpacing: "0.2px",
                        textTransform: "uppercase",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      {detailModal.rejectReason ? "Alasan Penolakan Petugas" : "Catatan Pembatalan"}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#23251d",
                        lineHeight: "1.5",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      {detailModal.rejectReason || detailModal.cancelReason}
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: "12px 20px",
                  borderTop: "1px solid #e5e7e0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fdfdf8",
                }}
              >
                <div>
                  {mode === "pengguna" && detailModal.status === "pending" && canUserCancel(detailModal) && (
                    <ActionBtn
                      variant="danger"
                      onClick={() => {
                        const id = detailModal.id;
                        setDetailModal(null);
                        handleAction(id, "cancel");
                      }}
                    >
                      Batalkan Pengajuan
                    </ActionBtn>
                  )}
                  {mode === "pengguna" && detailModal.status === "approved" && canUserCancel(detailModal) && (
                    <ActionBtn
                      variant="danger"
                      onClick={() => {
                        const id = detailModal.id;
                        setDetailModal(null);
                        setCancelModal(id);
                      }}
                    >
                      Batalkan Reservasi
                    </ActionBtn>
                  )}
                </div>

                <ActionBtn variant="neutral" onClick={() => setDetailModal(null)}>
                  Tutup
                </ActionBtn>
              </div>
            </div>
          </ModalOverlay>
        );
      })()}
    </>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
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
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      {children}
    </div>
  );
}

function ModalCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "460px",
        overflow: "hidden",
        boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
        border: "1px solid #d1d5db",
      }}
    >
      {children}
    </div>
  );
}

function ModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
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
      <h2
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#23251d",
          margin: 0,
          fontFamily: "'Open Runde', sans-serif",
        }}
      >
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
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
  );
}

function ModalBtn({
  variant,
  disabled,
  onClick,
  children,
}: {
  variant: "secondary" | "danger";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isDanger = variant === "danger";
  const bg = isDanger ? (disabled ? "#e5e7e0" : "#f54e00") : "#ffffff";
  const color = isDanger ? (disabled ? "#9ea096" : "#ffffff") : "#4d4f46";
  const border = isDanger ? "none" : "1px solid #d1d5db";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "7px 16px",
        border,
        borderRadius: "6px",
        backgroundColor: bg,
        color: color,
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'IBM Plex Sans Variable', sans-serif",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

const modalLabelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  color: "#4d4f46",
  marginBottom: "5px",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
};

const modalTextareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #bfc1b7",
  borderRadius: "6px",
  fontSize: "13px",
  color: "#23251d",
  backgroundColor: "#ffffff",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
  resize: "vertical",
  boxSizing: "border-box",
  lineHeight: "1.5",
  outline: "none",
};

function DetailCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#65675e",
          marginBottom: "2px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#23251d",
          fontWeight: 600,
          fontFamily: mono
            ? "'Source Code Pro', ui-monospace, monospace"
            : "'IBM Plex Sans Variable', sans-serif",
        }}
      >
        {value}
      </div>
    </div>
  );
}