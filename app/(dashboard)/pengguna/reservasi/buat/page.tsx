"use client";

import { Suspense } from "react";
import ReservationForm from "@/components/reservations/ReservationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

function BuatReservasiContent() {
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facilityId");

  return (
    <ReservationForm initialFacilityId={facilityId ? Number(facilityId) : undefined} />
  );
}

export default function BuatReservasiPage() {
  return (
    <div style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/pengguna/reservasi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "13px",
            color: "#65675e",
            textDecoration: "none",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            marginBottom: "12px",
          }}
        >
          <ArrowLeft size={14} /> Kembali
        </Link>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            marginBottom: "4px",
          }}
        >
          Ajukan Reservasi
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Pilih fasilitas, tanggal, dan slot waktu yang tersedia
        </p>
      </div>
      <Suspense fallback={<div className="py-8 text-sm text-[#65675e]">Memuat formulir reservasi...</div>}>
        <BuatReservasiContent />
      </Suspense>
    </div>
  );
}
