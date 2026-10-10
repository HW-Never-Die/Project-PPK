"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/views/ui/Button";
import Input from "@/views/ui/Input";

/**
 * DESIGN.md — Register page
 * Same card styling as login.
 * Success state follows §4.16 — icon 56px circle, bg rgba(106,168,79,0.12), title 20px weight 700
 */
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const res = await fetch("/controller/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.errors)) {
            fieldErrors[key] = (msgs as string[])[0];
          }
          setErrors(fieldErrors);
        } else {
          setGeneralError(data.error || "Registrasi gagal");
        }
        return;
      }

      setSuccess(true);
    } catch {
      setGeneralError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        /* sky transparent for global SkyscraperBackground */
        // backgroundColor: "#eeefe9",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
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
        }}
      >
        <div style={{ padding: "32px" }}>
          {success ? (
            /* §4.16 Success State Card */
            <div style={{ textAlign: "center" }}>
              {/* Icon: 56px circle, bg rgba(106,168,79,0.12), color #3d7a1c */}
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(106,168,79,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3d7a1c"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Title: 20px, weight 700, Open Runde */}
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#23251d",
                  fontFamily: "'Open Runde', sans-serif",
                  marginBottom: "8px",
                }}
              >
                Registrasi Berhasil
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
                Akun kamu telah berhasil dibuat dan saat ini menunggu verifikasi
                oleh admin. Silakan tunggu hingga akun disetujui untuk dapat
                masuk ke sistem.
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Kembali ke Halaman Masuk
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* H1: 22px, weight 800, letterSpacing -0.5px, color #111827 */}
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.5px",
                  fontFamily: "'Open Runde', sans-serif",
                  marginBottom: "6px",
                }}
              >
                Daftar Akun
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#4B5563",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  marginBottom: "24px",
                }}
              >
                Buat akun baru untuk menggunakan sistem Eunomia
              </p>

              {/* Error Banner — §4.12 */}
              {generalError && (
                <div
                  style={{
                    marginBottom: "16px",
                    borderRadius: "6px",
                    border: "1px solid rgba(245,78,0,0.25)",
                    backgroundColor: "#fef2f2",
                    padding: "10px 14px",
                    fontSize: "13px",
                    color: "#f54e00",
                    fontFamily: "'IBM Plex Sans Variable', sans-serif",
                  }}
                >
                  {generalError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <Input
                  label="Nama Lengkap"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  required
                />
                <Input
                  label="Konfirmasi Password"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  required
                />
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full mt-2"
                >
                  Daftar
                </Button>
              </form>

              <p
                style={{
                  marginTop: "24px",
                  textAlign: "center",
                  fontSize: "13px",
                  color: "#65675e",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  style={{
                    color: "#2f80fa",
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                  }}
                >
                  Masuk di sini
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
