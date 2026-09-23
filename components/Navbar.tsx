"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ROLE_LABELS } from "@/lib/constants";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const getDashboardHref = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "petugas") return "/petugas";
    return "/pengguna/laporan";
  };

  return (
    <div className="sticky top-0 z-50 w-full px-2 pt-2">
      <div className="bg-[#e7e0da]/85 backdrop-blur-md px-4 py-2 border border-[#d1d5db] rounded shadow-[0_4px_12px_rgba(0,0,0,0.06)] mx-auto w-full max-w-7xl">
        <div className="flex justify-between items-center w-full">
          {/* Left Brand + Nav */}
          <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded px-2 py-1 hover:bg-black/5 transition-colors shrink-0"
            >
              <Image
                src="/images/logo-fsm-undip.png"
                alt="Logo FSM Undip"
                width={130}
                height={30}
                className="h-7 w-auto object-contain"
                priority
              />
              <span className="font-extrabold text-lg tracking-tight text-[#111827] hidden sm:inline">
                Eunomia
              </span>
            </Link>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-0.5">
              <Link
                href="/facilities"
                className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                  pathname.startsWith("/facilities")
                    ? "bg-black/10 text-[#111827]"
                    : "text-[#23251d] hover:bg-black/5"
                }`}
              >
                Katalog Fasilitas
              </Link>

              {user?.role === "pengguna" && (
                <>
                  <Link
                    href="/pengguna/laporan"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname === "/pengguna/laporan"
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Riwayat Lapor
                  </Link>
                  <Link
                    href="/pengguna/laporan/buat"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname === "/pengguna/laporan/buat"
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Buat Lapor
                  </Link>
                </>
              )}

              {user?.role === "petugas" && (
                <>
                  <Link
                    href="/petugas"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname === "/petugas"
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/petugas/laporan"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname.startsWith("/petugas/laporan")
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Kelola Laporan
                  </Link>
                  <Link
                    href="/petugas/fasilitas"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname.startsWith("/petugas/fasilitas")
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Status Fasilitas
                  </Link>
                </>
              )}

              {user?.role === "admin" && (
                <>
                  <Link
                    href="/admin"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname === "/admin"
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/fasilitas"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname.startsWith("/admin/fasilitas")
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Kelola Fasilitas
                  </Link>
                  <Link
                    href="/admin/users"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname.startsWith("/admin/users")
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Kelola User
                  </Link>
                  <Link
                    href="/admin/rekap"
                    className={`px-2.5 py-1.5 text-[13px] font-semibold rounded transition-colors whitespace-nowrap ${
                      pathname.startsWith("/admin/rekap")
                        ? "bg-black/10 text-[#111827]"
                        : "text-[#23251d] hover:bg-black/5"
                    }`}
                  >
                    Export Rekap
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action / Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {loading ? (
              <div className="h-8 w-20 bg-black/5 rounded animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href={getDashboardHref()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-bold bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] rounded transition-colors"
                >
                  Buka Dashboard
                </Link>

                <div className="flex items-center gap-2 px-2.5 py-1 bg-white/70 border border-[#d1d5db] rounded text-left">
                  <div className="w-6 h-6 rounded-full bg-[#eeefe9] border border-[#bfc1b7] flex items-center justify-center text-[11px] font-bold text-[#23251d]">
                    {user.name?.charAt(0)?.toUpperCase() || <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <p className="text-[12px] font-bold text-[#111827] truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                      {ROLE_LABELS[user.role] || user.role}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 hover:text-red-600 hover:bg-black/5 rounded transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-[13px] font-semibold text-[#23251d] hover:bg-black/5 rounded transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-[13px] font-bold bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] rounded transition-colors shadow-xs"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
