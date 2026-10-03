"use client";

import { Suspense } from "react";
import ReservationForm from "@/components/reservations/ReservationForm";
import SkyscraperBackground from "@/components/reservations/SkyscraperBackground";
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
    <div className="reservation-page-wrapper" style={{ width: "100%", margin: "0 auto" }}>
      <SkyscraperBackground />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: "#f5f5f0",
          borderRadius: "6px",
          border: "1px solid #e5e7e0",
          fontSize: "12px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          color: "#65675e",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#eb9d2a",
            }}
          />
          <Link href="/pengguna" style={{ color: "#23251d", textDecoration: "none", fontWeight: 600 }}>
            Eunomia OS
          </Link>
          <span>/</span>
          <Link href="/pengguna/reservasi" style={{ color: "#65675e", textDecoration: "none" }}>
            Riwayat Reservasi
          </Link>
          <span>/</span>
          <span style={{ color: "#23251d", fontWeight: 500 }}>Formulir Baru</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            title="Maximize"
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              border: "1px solid #bfc1b7",
            }}
          />
          <span
            title="Close"
            style={{
              display: "inline-block",
              width: "10px",
              height: "10px",
              borderRadius: "2px",
              border: "1px solid #bfc1b7",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "18px" }}>
        <Link
          href="/pengguna/reservasi"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "#4d4f46",
            textDecoration: "none",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            marginBottom: "12px",
            padding: "5px 12px",
            fontWeight: 500,
            backgroundColor: "#f5f5f0",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            boxShadow: "0 2px 0 0 #d1d1c9",
            position: "relative",
            top: "0px",
            transition: "all 0.1s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#eeefe9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f0";
            e.currentTarget.style.top = "0px";
            e.currentTarget.style.boxShadow = "0 2px 0 0 #d1d1c9";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.top = "1.5px";
            e.currentTarget.style.boxShadow = "none";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.top = "0px";
            e.currentTarget.style.boxShadow = "0 2px 0 0 #d1d1c9";
          }}
        >
          <ArrowLeft size={13} /> Kembali ke Riwayat
        </Link>
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
          Ajukan Reservasi Fasilitas
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#4B5563",
            fontWeight: 400,
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            lineHeight: "1.5",
            margin: 0,
          }}
        >
          Pilih fasilitas, tanggal kegiatan (minimal H-3), serta rentang slot waktu yang ingin dipinjam.
        </p>
      </div>

      <Suspense
        fallback={
          <div
            style={{
              padding: "48px 0",
              textAlign: "center",
              fontSize: "14px",
              color: "#9ea096",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e5e7e0",
            }}
          >
            Memuat formulir peminjaman...
          </div>
        }
      >
        <BuatReservasiContent />
      </Suspense>
    </div>
  );
}