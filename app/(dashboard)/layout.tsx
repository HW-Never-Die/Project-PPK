"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";
import {
  LayoutDashboard,
  CalendarCheck,
  AlertTriangle,
  Building2,
  Users,
  FileBarChart,
  LogOut,
  Loader2,
} from "lucide-react";
import type { ReactNode } from "react";

type NavLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navByRole: Record<string, NavLink[]> = {
  pengguna: [
    {
      label: "Reservasi",
      href: "/pengguna/reservasi",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
      label: "Buat Reservasi",
      href: "/pengguna/reservasi/buat",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
      label: "Laporan",
      href: "/pengguna/laporan",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      label: "Buat Laporan",
      href: "/pengguna/laporan/buat",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ],
  petugas: [
    {
      label: "Dashboard",
      href: "/petugas",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Reservasi",
      href: "/petugas/reservasi",
      icon: <CalendarCheck className="h-5 w-5" />,
    },
    {
      label: "Laporan",
      href: "/petugas/laporan",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      label: "Fasilitas",
      href: "/petugas/fasilitas",
      icon: <Building2 className="h-5 w-5" />,
    },
  ],
  admin: [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Fasilitas",
      href: "/admin/fasilitas",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Kelola User",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Rekap & Export",
      href: "/admin/rekap",
      icon: <FileBarChart className="h-5 w-5" />,
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sandy-desk">
        <Loader2 className="h-8 w-8 animate-spin text-amber-glow" />
      </div>
    );
  }

  if (!user) return null;

  const links = navByRole[user.role] || [];

  return (
    <div className="flex min-h-screen bg-sandy-desk">
      <aside className="flex w-56 flex-col border-r border-warm-mist bg-paper-white">
        <div className="border-b border-warm-mist px-4 py-4">
          <h2 className="text-subheading font-bold tracking-subheading text-deep-moss">
            Eunomia
          </h2>
          <p className="text-micro text-sage-gray mt-0.5">
            {ROLE_LABELS[user.role]}
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-caption font-medium font-ibm-plex-sans-variable transition-colors duration-150",
                  isActive
                    ? "bg-pale-stone text-signal-blue"
                    : "text-olive-char hover:bg-pale-stone hover:text-deep-moss"
                )}
              >
                <span
                  className={cn(
                    isActive ? "text-signal-blue" : "text-olive-char"
                  )}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-warm-mist p-2">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-caption font-medium font-ibm-plex-sans-variable text-olive-char hover:bg-pale-stone hover:text-deep-moss transition-colors duration-150 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-warm-mist bg-paper-white px-6 py-3">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-caption font-medium text-deep-moss">
                {user.name}
              </p>
              <p className="text-micro text-sage-gray">{user.email}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-glow text-micro font-bold text-deep-moss">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
