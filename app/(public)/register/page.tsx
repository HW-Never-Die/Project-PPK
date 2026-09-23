"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
      const res = await fetch("/api/auth/register", {
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
    <div className="flex min-h-screen items-center justify-center bg-sandy-desk px-4">
      <div className="w-full max-w-md rounded-[6px] border border-warm-mist bg-paper-white">
        <div className="flex items-center justify-between border-b border-warm-mist px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-flame-orange/60" />
              <span className="h-3 w-3 rounded-full bg-marigold/60" />
              <span className="h-3 w-3 rounded-full bg-moss-green/60" />
            </div>
            <span className="text-micro font-medium text-sage-gray font-ibm-plex-sans-variable">
              register.tsx
            </span>
          </div>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-moss-green/15">
                <svg
                  className="h-6 w-6 text-moss-green"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-heading font-bold tracking-heading text-deep-moss mb-2">
                Registrasi Berhasil
              </h1>
              <p className="text-caption text-sage-gray mb-6">
                Akun kamu telah terdaftar. Silakan tunggu verifikasi dari admin
                sebelum bisa login.
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Kembali ke Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-heading-lg font-bold tracking-heading-lg text-deep-moss mb-2">
                Daftar Akun
              </h1>
              <p className="text-caption text-sage-gray mb-2">
                Buat akun baru untuk menggunakan sistem Eunomia
              </p>

              <div className="mb-6 rounded-md border border-marigold/30 bg-marigold/10 px-3 py-2 text-caption text-dark-amber">
                Akun yang didaftarkan secara mandiri perlu diverifikasi admin
                sebelum bisa login.
              </div>

              {generalError && (
                <div className="mb-4 rounded-md border border-flame-orange/30 bg-flame-orange/10 px-3 py-2 text-caption text-flame-orange">
                  {generalError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

              <p className="mt-6 text-center text-caption text-sage-gray">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-signal-blue underline underline-offset-2 decoration-signal-blue/50 hover:decoration-signal-blue"
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
