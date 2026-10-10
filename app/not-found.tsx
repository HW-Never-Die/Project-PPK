import Link from "next/link";
import Button from "@/views/ui/Button";

/**
 * DESIGN.md — 404 Not Found page
 * Uses Global BG #eeefe9, card bg #ffffff, radius 8px, border #d1d5db
 * Title: Open Runde, 20px (success-title size), weight 700
 * Code tag: Source Code Pro, 11px, weight 700
 * Buttons: uses Button component which implements §4.4
 */
export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eeefe9",
        padding: "16px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          padding: "48px 32px",
        }}
      >
        {/* Icon container — §4.17 Empty State */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: "rgba(245,78,0,0.08)",
            border: "1px solid rgba(245,78,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontFamily: "'Source Code Pro', monospace",
              fontWeight: 700,
              color: "#f54e00",
              letterSpacing: "0.2px",
            }}
          >
            404
          </span>
        </div>

        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#23251d",
            fontFamily: "'Open Runde', sans-serif",
            marginBottom: "8px",
          }}
        >
          Halaman Tidak Ditemukan
        </h1>

        <p
          style={{
            fontSize: "13px",
            color: "#65675e",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            marginBottom: "24px",
            lineHeight: 1.5,
          }}
        >
          Halaman ini belum tersedia atau sedang dikerjakan oleh rekan tim di
          branch lain.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link href="/">
            <Button variant="primary" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/logout">
            <Button variant="secondary" className="w-full">
              Keluar (Kembali ke Login)
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
