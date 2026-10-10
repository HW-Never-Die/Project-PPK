"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

type Facility = {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  status: string;
};

type SlotAvailability = {
  time: string;
  label: string;
  available: boolean;
};

const facilityTypeLabels: Record<string, string> = {
  ruang_kelas: "Ruang Kelas",
  aula: "Aula Utama",
  laboratorium: "Laboratorium",
  alat: "Peralatan",
  lapangan: "Lapangan Olahraga",
};

const SLOTS: SlotAvailability[] = Array.from({ length: 26 }, (_, i) => {
  const startH = Math.floor((7 * 60 + i * 30) / 60);
  const startM = (7 * 60 + i * 30) % 60;
  const endH = Math.floor((7 * 60 + (i + 1) * 30) / 60);
  const endM = (7 * 60 + (i + 1) * 30) % 60;
  const fmt = (h: number, m: number) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  return {
    time: fmt(startH, startM),
    label: `${fmt(startH, startM)} - ${fmt(endH, endM)}`,
    available: true,
  };
});

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #bfc1b7",
  borderRadius: "6px",
  fontSize: "13px",
  color: "#23251d",
  backgroundColor: "#ffffff",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
  outline: "none",
  transition: "border-color 0.15s ease",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#23251d",
  marginBottom: "6px",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
};

export default function ReservationForm({ initialFacilityId }: { initialFacilityId?: number }) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [facilityId, setFacilityId] = useState<number | "">(initialFacilityId || "");
  const [date, setDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [purpose, setPurpose] = useState("");
  const [slots, setSlots] = useState<SlotAvailability[]>(SLOTS);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/controller/facilities")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const active = (d.data || []).filter((f: Facility) => f.status === "active");
        setFacilities(active);
      })
      .catch(() => {
        if (!cancelled) setFacilities([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markPastSlots = (slotList: SlotAvailability[], selectedDate: string): SlotAvailability[] => {
    const now = new Date();
    const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = nowWIB.toISOString().split("T")[0];
    if (selectedDate !== today) return slotList;
    const nowMins = nowWIB.getUTCHours() * 60 + nowWIB.getUTCMinutes();
    return slotList.map((slot) => {
      const [h, m] = slot.time.split(":").map(Number);
      if (h * 60 + m <= nowMins) return { ...slot, available: false };
      return slot;
    });
  };

  useEffect(() => {
    if (!facilityId || !date) {
      Promise.resolve().then(() => {
        setSlots(SLOTS);
        setSelectedSlots([]);
        setLoadingSlots(false);
      });
      return;
    }

    let cancelled = false;
    fetch(`/controller/facilities/${facilityId}/availability?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        let parsed: SlotAvailability[];
        if (d.data?.slots && Array.isArray(d.data.slots)) {
          parsed = d.data.slots.map(
            (s: { startTime: string; endTime: string; available: boolean }) => ({
              time: s.startTime,
              label: `${s.startTime} - ${s.endTime}`,
              available: s.available,
            })
          );
        } else {
          parsed = SLOTS;
        }
        setSlots(markPastSlots(parsed, date));
        setSelectedSlots([]);
      })
      .catch(() => {
        if (!cancelled) setSlots(markPastSlots(SLOTS, date));
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [facilityId, date]);

  const selectedFacility = useMemo(() => {
    if (!facilityId) return null;
    return facilities.find((f) => f.id === Number(facilityId)) || null;
  }, [facilities, facilityId]);

  const minDateStr = useMemo(() => {
    const now = new Date();
    const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    wib.setUTCDate(wib.getUTCDate() + 3);
    return wib.toISOString().split("T")[0];
  }, []);

  const minDateFormatted = useMemo(() => {
    try {
      const d = new Date(minDateStr + "T00:00:00.000Z");
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return minDateStr;
    }
  }, [minDateStr]);

  const dateFormatted = useMemo(() => {
    if (!date) return "";
    try {
      const d = new Date(date + "T00:00:00.000Z");
      return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch {
      return date;
    }
  }, [date]);

  const timeRangeSummary = useMemo(() => {
    if (selectedSlots.length === 0) return null;
    const sorted = [...selectedSlots].sort((a, b) => a - b);
    const startSlot = sorted[0];
    const endSlot = sorted[sorted.length - 1];
    const startTime = slots[startSlot].time;
    const endH = Math.floor((7 * 60 + (endSlot + 1) * 30) / 60);
    const endM = (7 * 60 + (endSlot + 1) * 30) % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    const totalMinutes = (endSlot - startSlot + 1) * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const durationLabel =
      hours > 0 ? `${hours} Jam${minutes > 0 ? ` ${minutes} Menit` : ""}` : `${minutes} Menit`;
    return {
      startTime,
      endTime,
      durationLabel,
      slotsCount: sorted.length,
    };
  }, [selectedSlots, slots]);

  const handleFacilityChange = (value: string) => {
    setFacilityId(value ? Number(value) : "");
    if (value && date) setLoadingSlots(true);
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    if (facilityId && value) setLoadingSlots(true);
  };

  const toggleSlot = (index: number) => {
    if (!slots[index].available) return;

    setSelectedSlots((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }

      if (prev.length === 0) return [index];

      const all = [...prev, index].sort((a, b) => a - b);
      const min = all[0];
      const max = all[all.length - 1];

      const contiguous: number[] = [];
      for (let i = min; i <= max; i++) {
        if (!slots[i].available) {
          setError("Slot yang dipilih harus berurutan dan tersedia");
          return prev;
        }
        contiguous.push(i);
      }

      setError("");
      return contiguous;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const missing: string[] = [];
    if (!facilityId) missing.push("Fasilitas");
    if (!date) missing.push("Tanggal");
    if (selectedSlots.length === 0) missing.push("Slot Waktu");
    if (!purpose || purpose.trim().length < 10) missing.push("Tujuan Penggunaan (min. 10 karakter)");
    if (missing.length > 0) {
      setError("Silakan lengkapi: " + missing.join(", "));
      return;
    }

    const sorted = [...selectedSlots].sort((a, b) => a - b);
    const startTime = slots[sorted[0]].time;
    const lastSlot = sorted[sorted.length - 1];
    const endH = Math.floor((7 * 60 + (lastSlot + 1) * 30) / 60);
    const endM = (7 * 60 + (lastSlot + 1) * 30) % 60;
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

    setLoading(true);
    try {
      const res = await fetch("/controller/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityId: Number(facilityId),
          date,
          startTime,
          endTime,
          purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mengajukan reservasi");
        return;
      }

      setSuccess("Pengajuan reservasi berhasil dikirim! Menunggu peninjauan petugas FSM.");
      setFacilityId("");
      setDate("");
      setSelectedSlots([]);
      setPurpose("");
      setSlots(SLOTS);
    } catch {
      setError("Terjadi kesalahan jaringan saat mengirim data");
    } finally {
      setLoading(false);
    }
  };

  const morningSlots = slots.slice(0, 10);
  const afternoonSlots = slots.slice(10, 18);
  const eveningSlots = slots.slice(18, 26);

  if (success) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          padding: "48px 32px",
          textAlign: "center",
          maxWidth: "540px",
          margin: "20px auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(106,168,79,0.12)",
            color: "#3d7a1c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <CheckCircle2 size={32} />
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#23251d",
            marginBottom: "8px",
            fontFamily: "'Open Runde', sans-serif",
          }}
        >
          Reservasi Berhasil Diajukan
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "#65675e",
            lineHeight: "1.6",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            marginBottom: "24px",
          }}
        >
          {success} Pantau status persetujuan secara langsung melalui riwayat reservasi Anda.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setSuccess("")}
            style={{
              padding: "8px 18px",
              backgroundColor: "#ffffff",
              color: "#4d4f46",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              transition: "all 0.15s ease",
            }}
          >
            Buat Reservasi Baru
          </button>

          <Link
            href="/pengguna/reservasi"
            style={{
              padding: "8px 20px",
              backgroundColor: "#eb9d2a",
              color: "#23251d",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              border: "1px solid #d88c22",
              transition: "all 0.15s ease",
            }}
          >
            Lihat Riwayat Saya <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .reservation-form-grid {
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 880px) {
          .reservation-form-grid {
            grid-template-columns: 1fr !important;
          }
          .reservation-summary-sticky {
            position: static !important;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              marginBottom: "16px",
              padding: "10px 14px",
              backgroundColor: "#fef2f2",
              border: "1px solid rgba(245,78,0,0.25)",
              borderRadius: "6px",
              color: "#f54e00",
              fontSize: "13px",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <div className="reservation-form-grid">
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#23251d",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  1
                </span>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#23251d",
                    margin: 0,
                    fontFamily: "'Open Runde', sans-serif",
                  }}
                >
                  Pilih Fasilitas Kampus
                </h3>
              </div>

              <div style={{ marginBottom: selectedFacility ? "12px" : 0 }}>
                <label style={labelStyle}>Nama Fasilitas / Ruangan</label>
                <select
                  value={facilityId}
                  onChange={(e) => handleFacilityChange(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Pilih fasilitas yang ingin dipinjam...</option>
                  {facilities.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.location} {f.capacity ? `(${f.capacity} Orang)` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFacility && (
                <div
                  style={{
                    backgroundColor: "#fdfdf8",
                    border: "1px solid #e5e7e0",
                    borderRadius: "6px",
                    padding: "10px 12px",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "72px",
                      height: "56px",
                      borderRadius: "4px",
                      backgroundColor: "#f5f5f0",
                      position: "relative",
                      overflow: "hidden",
                      flexShrink: 0,
                      border: "1px solid #e5e7e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedFacility.imageUrl ? (
                      <Image
                        src={selectedFacility.imageUrl}
                        alt={selectedFacility.name}
                        fill
                        sizes="72px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <Building2 size={22} style={{ color: "#b3b3af" }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#b17816",
                          backgroundColor: "rgba(235,157,42,0.12)",
                          padding: "1px 5px",
                          borderRadius: "3px",
                          fontFamily: "'Source Code Pro', monospace",
                          textTransform: "uppercase",
                        }}
                      >
                        {facilityTypeLabels[selectedFacility.type] || selectedFacility.type}
                      </span>
                      {selectedFacility.capacity && (
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#65675e",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Users size={11} />
                          {selectedFacility.capacity} Kursi
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#23251d" }}>
                      {selectedFacility.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#65675e", display: "flex", alignItems: "center", gap: "4px" }}>
                      <MapPin size={11} style={{ color: "#9ea096" }} />
                      {selectedFacility.location}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#23251d",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  2
                </span>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#23251d",
                    margin: 0,
                    fontFamily: "'Open Runde', sans-serif",
                  }}
                >
                  Pilih Tanggal Kegiatan
                </h3>
              </div>

              <div>
                <label style={labelStyle}>Tanggal Pemakaian (Minimal H-3)</label>
                <input
                  type="date"
                  value={date}
                  min={minDateStr}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={inputStyle}
                />
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "12px",
                    color: "#65675e",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <Calendar size={13} style={{ color: "#eb9d2a" }} />
                  <span>
                    Batas paling awal pengajuan: <strong>{minDateFormatted}</strong>.
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "#23251d",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    3
                  </span>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#23251d",
                      margin: 0,
                      fontFamily: "'Open Runde', sans-serif",
                    }}
                  >
                    Pilih Slot Waktu (07:00 – 20:00 WIB)
                  </h3>
                </div>

                {selectedSlots.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#b17816",
                        backgroundColor: "rgba(235,157,42,0.12)",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      {selectedSlots.length} slot dipilih
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlots([]);
                        setError("");
                      }}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "11px",
                        fontWeight: 600,
                        color: "#f54e00",
                        backgroundColor: "#fef2f2",
                        border: "1px solid rgba(245,78,0,0.2)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        padding: "2px 7px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      <RotateCcw size={11} /> Reset
                    </button>
                  </div>
                )}
              </div>

              {!facilityId || !date ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px 16px",
                    color: "#9ea096",
                    fontSize: "13px",
                    backgroundColor: "#fdfdf8",
                    border: "1px dashed #bfc1b7",
                    borderRadius: "6px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  Pilih fasilitas dan tanggal terlebih dahulu untuk memeriksa ketersediaan slot waktu.
                </div>
              ) : loadingSlots ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 0",
                    color: "#9ea096",
                    fontSize: "13px",
                    backgroundColor: "#fdfdf8",
                    border: "1px solid #e5e7e0",
                    borderRadius: "6px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  Memeriksa ketersediaan ruangan...
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      fontSize: "11px",
                      color: "#65675e",
                      paddingBottom: "8px",
                      borderBottom: "1px solid #eeefe9",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "2px", border: "1px solid #bfc1b7", backgroundColor: "#ffffff" }} />
                      Tersedia
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "2px", border: "1px solid #eb9d2a", backgroundColor: "#fdf5e6" }} />
                      Dipilih
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "2px", border: "1px solid #e5e7e0", backgroundColor: "#f5f5f0" }} />
                      Terisi / Lewat
                    </span>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#65675e",
                        marginBottom: "6px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      Sesi Pagi (07:00 – 12:00)
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: "6px" }}>
                      {morningSlots.map((slot, idx) => (
                        <SlotChip
                          key={slot.time}
                          slot={slot}
                          isSelected={selectedSlots.includes(idx)}
                          onToggle={() => toggleSlot(idx)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#65675e",
                        marginBottom: "6px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      Sesi Siang (12:00 – 16:00)
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: "6px" }}>
                      {afternoonSlots.map((slot, idx) => {
                        const actualIdx = idx + 10;
                        return (
                          <SlotChip
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedSlots.includes(actualIdx)}
                            onToggle={() => toggleSlot(actualIdx)}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#65675e",
                        marginBottom: "6px",
                        fontFamily: "'IBM Plex Sans Variable', sans-serif",
                      }}
                    >
                      Sesi Sore & Malam (16:00 – 20:00)
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))", gap: "6px" }}>
                      {eveningSlots.map((slot, idx) => {
                        const actualIdx = idx + 18;
                        return (
                          <SlotChip
                            key={slot.time}
                            slot={slot}
                            isSelected={selectedSlots.includes(actualIdx)}
                            onToggle={() => toggleSlot(actualIdx)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: "#23251d",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  4
                </span>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#23251d",
                    margin: 0,
                    fontFamily: "'Open Runde', sans-serif",
                  }}
                >
                  Tujuan & Rencana Penggunaan
                </h3>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Deskripsi Kegiatan</label>
                  <span
                    style={{
                      fontSize: "11px",
                      color: purpose.trim().length >= 10 ? "#3d7a1c" : "#9ea096",
                      fontFamily: "'Source Code Pro', monospace",
                    }}
                  >
                    {purpose.trim().length} / 10 karakter min.
                  </span>
                </div>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  placeholder="Jelaskan agenda kegiatan, nama kegiatan/mata kuliah, atau rincian pemakaian fasilitas..."
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.5" }}
                />
              </div>
            </div>
          </div>

          <div className="reservation-summary-sticky" style={{ position: "sticky", top: "80px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  backgroundColor: "#23251d",
                  color: "#ffffff",
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={15} style={{ color: "#eb9d2a" }} />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                      fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    }}
                  >
                    Ringkasan Reservasi
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#23251d",
                    backgroundColor: "#eb9d2a",
                    padding: "1px 6px",
                    borderRadius: "3px",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  DRAFT
                </span>
              </div>

              <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#65675e", textTransform: "uppercase", marginBottom: "2px" }}>
                    Fasilitas Terpilih
                  </div>
                  {selectedFacility ? (
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#23251d", fontFamily: "'Open Runde', sans-serif" }}>
                        {selectedFacility.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#65675e", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <MapPin size={11} style={{ color: "#9ea096" }} />
                        {selectedFacility.location}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#9ea096", fontStyle: "italic" }}>
                      Belum memilih fasilitas
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px dashed #e5e7e0", paddingTop: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#65675e", textTransform: "uppercase", marginBottom: "2px" }}>
                    Waktu Pelaksanaan
                  </div>
                  {date ? (
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#23251d", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Calendar size={13} style={{ color: "#eb9d2a" }} />
                      {dateFormatted}
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#9ea096", fontStyle: "italic" }}>
                      Tanggal belum dipilih
                    </div>
                  )}

                  {timeRangeSummary ? (
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#b17816",
                        fontFamily: "'Source Code Pro', monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: "rgba(235,157,42,0.12)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                      }}
                    >
                      <Clock size={12} />
                      {timeRangeSummary.startTime} – {timeRangeSummary.endTime} WIB ({timeRangeSummary.durationLabel})
                    </div>
                  ) : (
                    <div style={{ fontSize: "12px", color: "#9ea096", fontStyle: "italic", marginTop: "4px" }}>
                      Slot waktu belum dipilih
                    </div>
                  )}
                </div>

                {purpose.trim().length > 0 && (
                  <div style={{ borderTop: "1px dashed #e5e7e0", paddingTop: "12px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "#65675e", textTransform: "uppercase", marginBottom: "2px" }}>
                      Keperluan
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#4d4f46",
                        lineHeight: "1.4",
                        maxHeight: "56px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {purpose}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: "#fdfaf3",
                    border: "1px solid rgba(235,157,42,0.25)",
                    borderRadius: "6px",
                    padding: "10px",
                    fontSize: "11px",
                    color: "#4d4f46",
                    lineHeight: "1.4",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <ShieldCheck size={13} style={{ color: "#eb9d2a", flexShrink: 0, marginTop: "1px" }} />
                  <span>
                    Pastikan jadwal sudah tepat. Pembatalan mandiri hanya dilayani maksimal H-3 sebelum tanggal pemakaian.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !facilityId || !date || selectedSlots.length === 0 || purpose.trim().length < 10}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    backgroundColor:
                      loading || !facilityId || !date || selectedSlots.length === 0 || purpose.trim().length < 10
                        ? "#d1d5db"
                        : "#eb9d2a",
                    color:
                      loading || !facilityId || !date || selectedSlots.length === 0 || purpose.trim().length < 10
                        ? "#9ea096"
                        : "#23251d",
                    border:
                      loading || !facilityId || !date || selectedSlots.length === 0 || purpose.trim().length < 10
                        ? "1px solid transparent"
                        : "1px solid #d88c22",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor:
                      loading || !facilityId || !date || selectedSlots.length === 0 || purpose.trim().length < 10
                        ? "not-allowed"
                        : "pointer",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FileText size={15} />
                  {loading ? "Mengirim Reservasi..." : "Kirim Pengajuan Reservasi"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

function SlotChip({
  slot,
  isSelected,
  onToggle,
}: {
  slot: SlotAvailability;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const isAvailable = slot.available;

  return (
    <button
      type="button"
      disabled={!isAvailable}
      onClick={onToggle}
      style={{
        padding: "6px 4px",
        fontSize: "11px",
        fontWeight: isSelected ? 700 : 500,
        fontFamily: "'Source Code Pro', monospace",
        border: isSelected
          ? "1.5px solid #eb9d2a"
          : isAvailable
            ? "1px solid #d1d5db"
            : "1px solid #e5e7e0",
        borderRadius: "4px",
        backgroundColor: isSelected
          ? "#fdf5e6"
          : isAvailable
            ? "#ffffff"
            : "#f5f5f0",
        color: isSelected
          ? "#b17816"
          : isAvailable
            ? "#23251d"
            : "#b3b3af",
        cursor: isAvailable ? "pointer" : "not-allowed",
        textAlign: "center",
        transition: "all 0.1s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }}
    >
      {isSelected && <Check size={11} style={{ color: "#b17816" }} />}
      <span>{slot.label || slot.time}</span>
    </button>
  );
}