import ReportForm from "@/components/reports/ReportForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BuatLaporanPage() {
  return (
    <div style={{ maxWidth: "680px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link
          href="/pengguna/laporan"
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
          Buat Laporan
        </h1>
        <p style={{ fontSize: "16px", color: "#4B5563", fontWeight: 500 }}>
          Laporkan kerusakan atau masalah fasilitas kampus
        </p>
      </div>
      <ReportForm />
    </div>
  );
}
