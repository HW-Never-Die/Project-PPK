"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/views/ui/Button";
import Input from "@/views/ui/Input";
import { useAuth } from "@/views/AuthProvider";
import { ROLE_DEFAULT_ROUTES } from "@/app/model/constants";

/**
 * DESIGN.md — Login page
 * Global BG: #eeefe9, Card: bg #ffffff, radius 8px, border #d1d5db, shadow
 * H1: 22px, weight 800, letterSpacing -0.5px, color #111827
 * Subtitle: 14px, color #4B5563
 * Error Banner: §4.12 — bg #fef2f2, border rgba(245,78,0,0.25), radius 6px
 */
export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
          setGeneralError(data.error || "Login gagal");
        }
        return;
      }

      await refresh();
      const role = data.data.role as string;
      router.push(ROLE_DEFAULT_ROUTES[role] || "/");
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eeefe9",
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
          {/* H1 — §2.2: 22px, weight 800, letterSpacing -0.5px */}
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
            Masuk
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#4B5563",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              marginBottom: "24px",
            }}
          >
            Masuk ke akun Eunomia untuk mengelola reservasi dan laporan
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
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
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
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
            <Button type="submit" loading={loading} className="w-full mt-2">
              Masuk
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
            Belum punya akun?{" "}
            <Link
              href="/register"
              style={{
                color: "#2f80fa",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
