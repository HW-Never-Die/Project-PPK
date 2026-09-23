import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Building2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ClipboardList,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-start py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      {/* Hero Application Window (PostHog Style) */}
      <div className="w-full bg-white border border-[#bfc1b7] rounded-[6px] shadow-sm overflow-hidden mb-8">
        {/* Window Title Bar */}
        <div className="bg-[#fdfdf8] border-b border-[#bfc1b7] px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f54e00]/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#eb9d2a]/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#6aa84f]/70 inline-block" />
            <span className="text-[12px] font-mono text-[#65675e] ml-2">
              fsm-undip.ac.id/eunomia
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#65675e] uppercase tracking-wider">
            Sistem Informasi Fasilitas Terpadu
          </span>
        </div>

        {/* Hero Body */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#eeefe9] border border-[#bfc1b7] rounded-[4px] text-[12px] font-semibold text-[#23251d]">
              <Sparkles className="w-3.5 h-3.5 text-[#eb9d2a]" />
              Fakultas Sains dan Matematika Universitas Diponegoro
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight leading-tight">
              Reservasi &amp; Pelaporan Fasilitas Kampus Terpadu
            </h1>

            <p className="text-base text-[#4B5563] leading-relaxed">
              Platform modern terpusat untuk mahasiswa, dosen, dan staf FSM Undip.
              Cek 26 slot waktu operasional (07:00–20:00) secara transparan dan
              laporkan kendala sarana prasarana dalam satu sistem terintegrasi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/facilities"
                className="inline-flex items-center justify-center gap-2 bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] font-bold text-sm px-5 py-2.5 rounded-[4px] transition-colors shadow-xs"
              >
                <span>Lihat Fasilitas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pengguna/laporan/buat"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#fdfdf8] text-[#23251d] border border-[#bfc1b7] font-semibold text-sm px-5 py-2.5 rounded-[4px] transition-colors"
              >
                <span>Laporkan Kerusakan</span>
              </Link>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[16/9] w-full rounded-[4px] overflow-hidden border border-[#bfc1b7] bg-[#eeefe9]">
              <Image
                src="/images/hero-fsm.webp"
                alt="FSM Undip Banner"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs">
                  <p className="font-bold">Fakultas Sains dan Matematika</p>
                  <p className="text-gray-200 text-[11px]">Kampus Tembalang, Semarang</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
        {/* Card 1 */}
        <div className="bg-white border border-[#bfc1b7] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#111827] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-[4px] bg-[#eeefe9] border border-[#bfc1b7] flex items-center justify-center text-[#23251d] mb-3">
              <CalendarDays className="w-5 h-5 text-[#eb9d2a]" />
            </div>
            <h3 className="font-bold text-base text-[#111827] mb-1.5">
              26 Slot Waktu Anti-Bentrok
            </h3>
            <p className="text-[13px] text-[#65675e] leading-relaxed">
              Jadwal reservasi dibagi dalam interval 30 menit dari jam 07:00 hingga 20:00 dengan sistem proteksi jadwal bertabrakan.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eeefe9] mt-4">
            <Link
              href="/facilities"
              className="text-xs font-bold text-[#2f80fa] hover:underline inline-flex items-center gap-1"
            >
              Eksplorasi Katalog &rarr;
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#bfc1b7] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#111827] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-[4px] bg-[#eeefe9] border border-[#bfc1b7] flex items-center justify-center text-[#23251d] mb-3">
              <ClipboardList className="w-5 h-5 text-[#2f80fa]" />
            </div>
            <h3 className="font-bold text-base text-[#111827] mb-1.5">
              Pelaporan Kerusakan Cepat
            </h3>
            <p className="text-[13px] text-[#65675e] leading-relaxed">
              Laporkan kerusakan AC, proyektor, kelistrikan, atau kebersihan dengan bukti foto fisik dan pantau status penanganannya.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eeefe9] mt-4">
            <Link
              href="/pengguna/laporan"
              className="text-xs font-bold text-[#2f80fa] hover:underline inline-flex items-center gap-1"
            >
              Pantau Riwayat Laporan &rarr;
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#bfc1b7] rounded-[4px] p-5 flex flex-col justify-between hover:border-[#111827] transition-colors">
          <div>
            <div className="w-9 h-9 rounded-[4px] bg-[#eeefe9] border border-[#bfc1b7] flex items-center justify-center text-[#23251d] mb-3">
              <ShieldCheck className="w-5 h-5 text-[#6aa84f]" />
            </div>
            <h3 className="font-bold text-base text-[#111827] mb-1.5">
              Kelola Terpusat &amp; Transparan
            </h3>
            <p className="text-[13px] text-[#65675e] leading-relaxed">
              Petugas dan Admin memiliki dashboard terpadu untuk memverifikasi peminjaman, update investigasi perbaikan, serta rekap data.
            </p>
          </div>
          <div className="pt-4 border-t border-[#eeefe9] mt-4">
            <Link
              href="/admin/rekap"
              className="text-xs font-bold text-[#2f80fa] hover:underline inline-flex items-center gap-1"
            >
              Rekap Data &amp; Export &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="w-full bg-[#fdfdf8] border border-[#bfc1b7] rounded-[4px] p-4 mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[#65675e]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#eb9d2a]" /> Jam Operasional: 07:00 – 20:00 WIB
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5 text-[#2f80fa]" /> Kampus FSM Undip Tembalang
          </span>
        </div>
        <span className="text-[11px] font-mono">Eunomia Facility System v1.0</span>
      </div>
    </main>
  );
}
