"use client";

import { useState, useEffect } from "react";

type Facility = {
  id: number;
  name: string;
  type: string;
  location: string;
  status: string;
};

type SlotAvailability = {
  time: string;
  label: string;
  available: boolean;
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
  padding: "6px 10px",
  border: "1px solid #bfc1b7",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#23251d",
  backgroundColor: "#ffffff",
  fontFamily: "'IBM Plex Sans Variable', sans-serif",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#4d4f46",
  marginBottom: "4px",
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
    fetch("/api/facilities")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const active = (d.data || []).filter((f: Facility) => f.status === "active");
        setFacilities(active);
      })
      .catch(() => { if (!cancelled) setFacilities([]); });
    return () => { cancelled = true; };
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
    fetch(`/api/facilities/${facilityId}/availability?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        let parsed: SlotAvailability[];
        if (d.data?.slots && Array.isArray(d.data.slots)) {
          parsed = d.data.slots.map((s: { startTime: string; endTime: string; available: boolean }) => ({
            time: s.startTime,
            label: `${s.startTime} - ${s.endTime}`,
            available: s.available,
          }));
        } else {
          parsed = SLOTS;
        }
        setSlots(markPastSlots(parsed, date));
        setSelectedSlots([]);
      })
      .catch(() => { if (!cancelled) setSlots(markPastSlots(SLOTS, date)); })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });
    return () => { cancelled = true; };
  }, [facilityId, date]);

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

    if (!facilityId || !date || selectedSlots.length === 0 || !purpose) {
      setError("Lengkapi semua field");
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
      const res = await fetch("/api/reservations", {
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

      setSuccess("Reservasi berhasil diajukan! Status: Menunggu persetujuan.");
      setFacilityId("");
      setDate("");
      setSelectedSlots([]);
      setPurpose("");
      setSlots(SLOTS);
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #bfc1b7",
        borderRadius: "6px",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {error && (
        <div
          style={{
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
      {success && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: "4px",
            color: "#6aa84f",
            fontSize: "13px",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={labelStyle}>Fasilitas</label>
          <select
            value={facilityId}
            onChange={(e) => handleFacilityChange(e.target.value)}
            style={inputStyle}
          >
            <option value="">Pilih fasilitas...</option>
            {facilities.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Tanggal</label>
          <input
            type="date"
            value={date}
            min={todayStr}
            onChange={(e) => handleDateChange(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
         <div style={{ marginBottom: "4px" }}>
           <label style={{ ...labelStyle, marginBottom: 0 }}>Pilih Slot Waktu</label>
         </div>

        {loadingSlots ? (
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#9ea096",
              fontSize: "13px",
              border: "1px solid #bfc1b7",
              borderRadius: "4px",
              backgroundColor: "#fdfdf8",
            }}
          >
            Memuat ketersediaan...
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "6px",
              border: "1px solid #bfc1b7",
              borderRadius: "4px",
              backgroundColor: "#fdfdf8",
              padding: "12px",
            }}
          >
            {slots.map((slot, i) => {
              const isSelected = selectedSlots.includes(i);
              const isAvailable = slot.available;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => toggleSlot(i)}
                  style={{
                    padding: "6px 4px",
                    fontSize: "11px",
                    fontWeight: 500,
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                    border: isSelected
                      ? "1px solid #eb9d2a"
                      : "1px solid #bfc1b7",
                    borderRadius: "4px",
                    backgroundColor: isSelected
                      ? "#eb9d2a"
                      : isAvailable
                        ? "#ffffff"
                        : "#e5e7e0",
                    color: isSelected
                      ? "#23251d"
                      : isAvailable
                        ? "#4d4f46"
                        : "#9ea096",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    textDecoration: isAvailable ? "none" : "line-through",
                    textAlign: "center",
                  }}
                >
                  {slot.label || slot.time}
                </button>
              );
            })}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: selectedSlots.length > 0 ? "#cd8407" : "#9ea096",
                backgroundColor: selectedSlots.length > 0 ? "rgba(235,157,42,0.15)" : "rgba(158,160,150,0.1)",
                padding: "6px 4px",
                borderRadius: "4px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selectedSlots.length} slot dipilih
            </span>
            <button
              type="button"
              disabled={selectedSlots.length === 0}
              onClick={() => { setSelectedSlots([]); setError(""); }}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: selectedSlots.length > 0 ? "#b91c1c" : "#9ea096",
                backgroundColor: selectedSlots.length > 0 ? "rgba(185,28,28,0.1)" : "rgba(158,160,150,0.1)",
                border: selectedSlots.length > 0 ? "1px solid rgba(185,28,28,0.25)" : "1px solid #bfc1b7",
                padding: "6px 4px",
                borderRadius: "4px",
                cursor: selectedSlots.length > 0 ? "pointer" : "not-allowed",
                fontFamily: "'IBM Plex Sans Variable', sans-serif",
                textAlign: "center",
              }}
            >
              Hapus Semua
            </button>
          </div>
        )}
      </div>

      <div>
        <label style={labelStyle}>Tujuan Penggunaan</label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={3}
          placeholder="Jelaskan tujuan penggunaan fasilitas (Minimal 10 karakter)"
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
        <button
          type="submit"
          disabled={loading || selectedSlots.length === 0}
          style={{
            padding: "6px 16px",
            backgroundColor: loading || selectedSlots.length === 0 ? "#9ea096" : "#eb9d2a",
            color: "#23251d",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: loading || selectedSlots.length === 0 ? "not-allowed" : "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {loading ? "Mengirim..." : "Ajukan Reservasi"}
        </button>
      </div>
    </form>
  );
}
