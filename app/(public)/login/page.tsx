"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/components/AuthProvider";
import { ROLE_DEFAULT_ROUTES } from "@/lib/constants";

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
    <div className="flex min-h-screen items-center justify-center bg-sandy-desk px-4">
      <div className="w-full max-w-md rounded-[6px] border border-warm-mist bg-paper-white">
        <div className="p-8">
          <h1 className="text-heading-lg font-bold tracking-heading-lg text-deep-moss mb-2">
            Masuk
          </h1>
          <p className="text-caption text-sage-gray mb-6">
            Masuk ke akun Eunomia untuk mengelola reservasi dan laporan
          </p>

          {generalError && (
            <div className="mb-4 rounded-md border border-flame-orange/30 bg-flame-orange/10 px-3 py-2 text-caption text-flame-orange">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <p className="mt-6 text-center text-caption text-sage-gray">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-signal-blue underline underline-offset-2 decoration-signal-blue/50 hover:decoration-signal-blue"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
