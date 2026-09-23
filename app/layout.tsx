import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Website Kampus - Sistem Pelaporan",
  description: "Sistem Pelaporan Kerusakan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#eeefe9] font-sans text-[#111]">
        {/* Navbar */}
        <div className="sticky top-0 z-50 w-full px-2 pt-2">
           <div className="bg-[#e7e0da]/80 backdrop-blur-md px-4 py-2 border border-[#d1d5db] rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)] mx-auto w-full max-w-full">
              <div className="flex justify-between items-center w-full">
                <div className="flex gap-2 h-full items-center w-full">
                  <Link
                    aria-current="page"
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-base font-semibold text-black hover:bg-black/5"
                    href="/"
                  >
                    <div className="flex items-center font-extrabold text-2xl tracking-tight">
                      Logo Kampus
                    </div>
                  </Link>
                  <div className="hidden md:flex flex-wrap items-center gap-1 ml-4 flex-1">
                    <span className="text-sm font-bold ml-2 text-gray-500 uppercase tracking-wider">Petugas:</span>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas">Dashboard</Link>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas/laporan">Kelola Laporan</Link>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/petugas/fasilitas">Fasilitas</Link>

                    <span className="text-sm font-bold ml-4 text-gray-500 uppercase tracking-wider">Pengguna:</span>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/pengguna/laporan">Riwayat</Link>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/pengguna/laporan/buat">Buat Lapor</Link>

                    <span className="text-sm font-bold ml-4 text-gray-500 uppercase tracking-wider">Admin:</span>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/admin">Dashboard</Link>
                    <Link className="flex items-center px-3 py-2 text-[14px] font-semibold rounded hover:bg-black/5 transition-colors" href="/admin/rekap">Export Data</Link>
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
