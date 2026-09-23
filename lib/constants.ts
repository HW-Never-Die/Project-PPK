export const OPERATING_HOURS = {
  start: 7,
  end: 20,
} as const;

export const OPERATIONAL_HOURS = {
  start: "07:00",
  end: "20:00",
} as const;

export const SLOT_DURATION_MINUTES = 30;

export interface TimeSlot {
  id: string; // e.g. "07:00-07:30"
  startTime: string; // "07:00"
  endTime: string; // "07:30"
  label: string; // "07:00 - 07:30"
  startMinutes: number;
  endMinutes: number;
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: "07:00-07:30", startTime: "07:00", endTime: "07:30", label: "07:00 - 07:30", startMinutes: 420, endMinutes: 450 },
  { id: "07:30-08:00", startTime: "07:30", endTime: "08:00", label: "07:30 - 08:00", startMinutes: 450, endMinutes: 480 },
  { id: "08:00-08:30", startTime: "08:00", endTime: "08:30", label: "08:00 - 08:30", startMinutes: 480, endMinutes: 510 },
  { id: "08:30-09:00", startTime: "08:30", endTime: "09:00", label: "08:30 - 09:00", startMinutes: 510, endMinutes: 540 },
  { id: "09:00-09:30", startTime: "09:00", endTime: "09:30", label: "09:00 - 09:30", startMinutes: 540, endMinutes: 570 },
  { id: "09:30-10:00", startTime: "09:30", endTime: "10:00", label: "09:30 - 10:00", startMinutes: 570, endMinutes: 600 },
  { id: "10:00-10:30", startTime: "10:00", endTime: "10:30", label: "10:00 - 10:30", startMinutes: 600, endMinutes: 630 },
  { id: "10:30-11:00", startTime: "10:30", endTime: "11:00", label: "10:30 - 11:00", startMinutes: 630, endMinutes: 660 },
  { id: "11:00-11:30", startTime: "11:00", endTime: "11:30", label: "11:00 - 11:30", startMinutes: 660, endMinutes: 690 },
  { id: "11:30-12:00", startTime: "11:30", endTime: "12:00", label: "11:30 - 12:00", startMinutes: 690, endMinutes: 720 },
  { id: "12:00-12:30", startTime: "12:00", endTime: "12:30", label: "12:00 - 12:30", startMinutes: 720, endMinutes: 750 },
  { id: "12:30-13:00", startTime: "12:30", endTime: "13:00", label: "12:30 - 13:00", startMinutes: 750, endMinutes: 780 },
  { id: "13:00-13:30", startTime: "13:00", endTime: "13:30", label: "13:00 - 13:30", startMinutes: 780, endMinutes: 810 },
  { id: "13:30-14:00", startTime: "13:30", endTime: "14:00", label: "13:30 - 14:00", startMinutes: 810, endMinutes: 840 },
  { id: "14:00-14:30", startTime: "14:00", endTime: "14:30", label: "14:00 - 14:30", startMinutes: 840, endMinutes: 870 },
  { id: "14:30-15:00", startTime: "14:30", endTime: "15:00", label: "14:30 - 15:00", startMinutes: 870, endMinutes: 900 },
  { id: "15:00-15:30", startTime: "15:00", endTime: "15:30", label: "15:00 - 15:30", startMinutes: 900, endMinutes: 930 },
  { id: "15:30-16:00", startTime: "15:30", endTime: "16:00", label: "15:30 - 16:00", startMinutes: 930, endMinutes: 960 },
  { id: "16:00-16:30", startTime: "16:00", endTime: "16:30", label: "16:00 - 16:30", startMinutes: 960, endMinutes: 990 },
  { id: "16:30-17:00", startTime: "16:30", endTime: "17:00", label: "16:30 - 17:00", startMinutes: 990, endMinutes: 1020 },
  { id: "17:00-17:30", startTime: "17:00", endTime: "17:30", label: "17:00 - 17:30", startMinutes: 1020, endMinutes: 1050 },
  { id: "17:30-18:00", startTime: "17:30", endTime: "18:00", label: "17:30 - 18:00", startMinutes: 1050, endMinutes: 1080 },
  { id: "18:00-18:30", startTime: "18:00", endTime: "18:30", label: "18:00 - 18:30", startMinutes: 1080, endMinutes: 1110 },
  { id: "18:30-19:00", startTime: "18:30", endTime: "19:00", label: "18:30 - 19:00", startMinutes: 1110, endMinutes: 1140 },
  { id: "19:00-19:30", startTime: "19:00", endTime: "19:30", label: "19:00 - 19:30", startMinutes: 1140, endMinutes: 1170 },
  { id: "19:30-20:00", startTime: "19:30", endTime: "20:00", label: "19:30 - 20:00", startMinutes: 1170, endMinutes: 1200 },
];

export const TIME_SLOT_STRINGS: string[] = TIME_SLOTS.map((s) => s.startTime);

export const SLOT_END_TIMES: string[] = [
  ...TIME_SLOT_STRINGS.slice(1),
  "20:00",
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
