import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunomia — Sistem Fasilitas & Pelaporan Kampus FSM Undip",
  description: "Sistem Reservasi & Pelaporan Fasilitas Kampus Terpadu FSM Undip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#eeefe9] font-sans text-[#23251d]">
        {/* Navbar */}
        <div className="sticky top-0 z-50 w-full px-2 pt-2">
          <div className="bg-[#e7e0da]/85 backdrop-blur-md px-4 py-2 border border-[#d1d5db] rounded shadow-[0_4px_12px_rgba(0,0,0,0.06)] mx-auto w-full max-w-7xl">
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-4 h-full items-center w-full">
                <Link
                  aria-current="page"
                  className="flex items-center gap-2.5 rounded px-2 py-1 hover:bg-black/5 transition-colors"
                  href="/"
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

                <div className="hidden md:flex flex-wrap items-center gap-1 ml-2 flex-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Publik:</span>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/facilities">Katalog Fasilitas</Link>

                  <span className="text-xs font-bold ml-3 text-gray-500 uppercase tracking-wider">Petugas:</span>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas">Dashboard</Link>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas/laporan">Kelola Laporan</Link>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas/fasilitas">Status Fasilitas</Link>

                  <span className="text-xs font-bold ml-3 text-gray-500 uppercase tracking-wider">Pengguna:</span>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/pengguna/laporan">Riwayat Lapor</Link>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/pengguna/laporan/buat">Buat Lapor</Link>

                  <span className="text-xs font-bold ml-3 text-gray-500 uppercase tracking-wider">Admin:</span>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/admin">Dashboard</Link>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/admin/fasilitas">Kelola Fasilitas</Link>
                  <Link className="flex items-center px-2.5 py-1.5 text-[13px] font-semibold rounded hover:bg-black/5 transition-colors" href="/admin/rekap">Export Rekap</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
