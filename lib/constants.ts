export const OPERATING_HOURS = {
  start: 7,
  end: 20,
} as const;

export const SLOT_DURATION_MINUTES = 30;

export const TIME_SLOTS: string[] = [];
for (let h = OPERATING_HOURS.start; h < OPERATING_HOURS.end; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${String(h).padStart(2, "0")}:30`);
}

export const SLOT_END_TIMES: string[] = [
  ...TIME_SLOTS.slice(1),
  `${String(OPERATING_HOURS.end).padStart(2, "0")}:00`,
];

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  petugas: "Petugas",
  pengguna: "Pengguna",
};

export const USER_STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu Verifikasi",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

export const FACILITY_TYPE_LABELS: Record<string, string> = {
  ruang_kelas: "Ruang Kelas",
  aula: "Aula",
  laboratorium: "Laboratorium",
  alat: "Alat",
  lapangan: "Lapangan",
};

export const FACILITY_STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  maintenance: "Dalam Perbaikan",
  inactive: "Nonaktif",
};

export const RESERVATION_STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export const REPORT_CATEGORY_LABELS: Record<string, string> = {
  kerusakan: "Kerusakan",
  kebersihan: "Kebersihan",
  keamanan: "Keamanan",
  lainnya: "Lainnya",
};

export const REPORT_STATUS_LABELS: Record<string, string> = {
  new: "Baru",
  in_progress: "Sedang Ditangani",
  resolved: "Selesai",
  rejected: "Ditolak",
};

export const ROLE_DEFAULT_ROUTES: Record<string, string> = {
  admin: "/admin/users",
  petugas: "/petugas",
  pengguna: "/pengguna/reservasi",
};
