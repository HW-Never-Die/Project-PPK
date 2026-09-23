import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sandy-desk px-4 text-center">
      <div className="w-full max-w-md rounded-[6px] border border-warm-mist bg-paper-white p-8">
        <div className="mb-2 font-mono text-sm font-semibold text-flame-orange">
          404 — HALAMAN TIDAK DITEMUKAN
        </div>
        <h1 className="mb-3 text-xl font-bold text-deep-moss">
          Modul Belum Dibuat
        </h1>
        <p className="mb-6 text-sm text-olive-char">
          Halaman ini belum tersedia atau sedang dikerjakan oleh rekan tim di branch lain.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/logout"
            className="inline-flex items-center justify-center rounded bg-amber-glow px-4 py-2 text-sm font-medium text-deep-moss hover:bg-dark-amber"
          >
            Keluar (Kembali ke Login)
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded border border-burnished-gold px-4 py-2 text-sm font-medium text-burnished-gold hover:bg-soft-linen"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
