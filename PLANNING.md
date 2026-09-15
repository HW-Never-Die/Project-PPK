# PLANNING — Pembagian Tugas & Tracking Pengembangan (Eunomia)

> **Metode Pembagian:** Full-stack Vertical Slice (4 Orang).
> Tiap anggota bertanggung jawab penuh atas Frontend (UI/Halaman), Backend (API Route), Query DB (Prisma), dan Validasi (Zod) untuk domain fiturnya masing-masing.
> **Database:** MySQL lokal masing-masing (Laragon di Windows, DBngin / Homebrew MySQL di Mac) menggunakan port standard `3306` dan skema database `eunomia`.

---

## Git & Branching Strategy

```
main          ← Production / presentasi demo (hanya di-merge dari dev)
 └── dev      ← Integration branch utama
      ├── feat/auth-foundation  (Zaidan)
      ├── feat/facilities       (Dewa)
      ├── feat/reservations     (Moses)
      └── feat/reports-admin    (Sulthon)
```

### Aturan Kerja Tim:
1. **Dilarang langsung commit ke `main` atau `dev`.** Selalu buat branch fitur masing-masing dari `dev`.
2. **Fondasi Bersama:** Zaidan mengerjakan Base Shared Foundation di branch `feat/auth-foundation` dan me-merge ke `dev` lebih dulu, agar Dewa, Moses, dan Sulthon mendapatkan tipe TypeScript, konstanta, dan UI primitives yang seragam.
3. **Mock Auth Selama Pengerjaan:** Sebelum Zaidan menyelesaikan middleware auth, Dewa, Moses, dan Sulthon menggunakan mock session user:
   ```ts
   // Sementara sampai lib/auth selesai
   const mockUser = { id: 3, role: "pengguna" as const };
   ```
4. **Merge ke `dev` via Pull Request / Review.** Selalu lakukan `git merge dev` ke branch lokal sebelum submit agar bebas conflict.

---

## 0. Shared Foundation (Tanggung Jawab: Zaidan di `dev`)
- [ ] `.gitignore`: Daftarkan `PRD.md`, `DESIGN.md`, `AI_RULES.md`, `PLANNING.md`, `FLOW.md`, `.env`
- [x] Install package inti: `jose`, `zod`, `lucide-react` (Sudah terinstall di `package.json`)
- [ ] Siapkan template `.env.example`
- [ ] Buat `types/index.ts` (Type User, Facility, Reservation, Report, APIResponse)
- [ ] Buat `lib/constants.ts` (Slot 30 menit, jam 07:00-20:00, Enum status/kategori)
- [ ] Buat `lib/utils.ts` (`cn`, helper format tanggal & jam Indonesia)
- [ ] Buat Base UI Primitives di `components/ui/` (Button, Input, Select, Modal, Table, TagPill/Badge) sesuai `DESIGN.md`
- [ ] Buat kerangka dasar shell dashboard `app/(dashboard)/layout.tsx` (Sidebar navigasi dinamis per role & Header)

---

## Pembagian Tugas 4 Orang

### Zaidan: Shared Foundation, Auth & Sesi, dan Manajemen User (Admin)
**Alasan Penugasan Fondasi:** Beban logika domain Zaidan paling ringkas dibandingkan logika slot anti-bentrok (Moses) dan multi-export/laporan (Sulthon). Struktur shell layout dashboard dan types berkaitan langsung dengan state otentikasi.

#### Fondasi & Shared:
- [ ] Buat shared types di `types/index.ts`
- [ ] Buat enum & time slot list di `lib/constants.ts`
- [ ] Buat utility helper di `lib/utils.ts`
- [ ] Buat reusable UI primitives di `components/ui/` (Button, Input, Modal, Table, TagPill)
- [ ] Buat kerangka shell `app/(dashboard)/layout.tsx` (Sidebar + Header + Role-based Nav)

#### Backend & Logika:
- [ ] `lib/auth.ts`: Helper hashing password (`bcryptjs`), sign & verify JWT token (`jose`), set/clear httpOnly cookie
- [ ] `lib/validations/auth.ts`: Skema validasi Zod untuk register & login
- [ ] `lib/validations/user.ts`: Skema validasi Zod untuk create user oleh admin & update status
- [ ] `middleware.ts`: Proteksi route berbasis cookie JWT dan role (`/pengguna/*`, `/petugas/*`, `/admin/*`)
- [ ] API `POST /api/auth/register`: Pendaftaran mandiri pengguna (default status: `pending`)
- [ ] API `POST /api/auth/login`: Verifikasi email & password (hanya akun status `verified` yang lolos)
- [ ] API `POST /api/auth/logout`: Menghapus session cookie
- [ ] API `GET /api/auth/me`: Mengambil data user yang sedang aktif
- [ ] API `GET /api/users`: List data user (filter role & status akun)
- [ ] API `POST /api/users`: Admin daftarkan petugas atau pengguna (langsung status `verified`)
- [ ] API `PATCH /api/users/[id]`: Admin verifikasi (`verified`) atau tolak (`rejected`) akun pending

#### Frontend & UI:
- [ ] Auth Context / Client State: State user login untuk navigasi UI
- [ ] Halaman Login (`app/(public)/login/page.tsx`): Form login di dalam Application Window style PostHog
- [ ] Halaman Registrasi (`app/(public)/register/page.tsx`): Form registrasi mandiri + banner info verifikasi
- [ ] Halaman Admin Kelola User (`app/(dashboard)/admin/users/page.tsx`):
  - Tab "Menunggu Verifikasi" & "Semua User"
  - Aksi tombol verifikasi / tolak user
  - Modal form admin buat akun baru (petugas/pengguna)

---

### Dewa: Katalog Fasilitas, Ketersediaan Slot, & Landing Page
**Fokus:** Eksplorasi fasilitas publik, kalender ketersediaan, manajemen fasilitas oleh admin, serta landing page sistem (menggantikan boilerplate Next.js).

#### Backend & Logika:
- [ ] `lib/validations/facility.ts`: Skema validasi Zod untuk data fasilitas
- [ ] API `GET /api/facilities`: Katalog fasilitas publik dengan filter tipe, lokasi, dan kapasitas
- [ ] API `GET /api/facilities/[id]`: Detail informasi spesifik fasilitas
- [ ] API `GET /api/facilities/[id]/availability?date=YYYY-MM-DD`: Cek daftar 26 slot waktu (07:00–20:00) yang terisi vs kosong
- [ ] API `POST /api/facilities`: Admin membuat fasilitas baru
- [ ] API `PUT /api/facilities/[id]`: Admin memperbarui detail fasilitas
- [ ] API `PATCH /api/facilities/[id]`: Update status fasilitas (`active`, `maintenance`, `inactive`)

#### Frontend & UI:
- [ ] **Landing Page (`app/page.tsx`)**:
  - Hapus dan rombak total boilerplate default Vercel/Next.js
  - Implementasikan Hero section PostHog (Sandy Desk canvas `#e1d7c2`, Paper White window `#ffffff`, hairline border `1px solid #bfc1b7`)
  - Primary Amber CTA "Lihat Fasilitas" & Outlined Gold "Login"
- [ ] Komponen `FacilityCard.tsx`: Menampilkan foto, kapasitas, tipe, dan status fasilitas
- [ ] Komponen `FacilityFilter.tsx`: Search bar dan filter tipe/lokasi/kapasitas
- [ ] Komponen `SlotGrid.tsx`: Visual matrix 26 slot (30 menit) menampilkan status ketersediaan tanpa ekspos data pemohon
- [ ] Halaman Publik Fasilitas (`app/(public)/facilities/page.tsx`):
  - Grid daftar fasilitas + integrasi filter & pencarian
  - Modal / drawer ketersediaan slot per tanggal
- [ ] Halaman Admin Fasilitas (`app/(dashboard)/admin/fasilitas/page.tsx`):
  - Tabel master data fasilitas
  - Form modal tambah & edit fasilitas
  - Aksi nonaktifkan / aktifkan fasilitas

---

### Moses: Sistem Alur Reservasi (Pengguna & Petugas)
**Fokus:** Booking fasilitas per slot 30 menit, validasi anti-bentrok server-side, approval petugas, dan pembatalan.

#### Backend & Logika:
- [ ] `lib/validations/reservation.ts`:
  - Validasi waktu kelipatan 30 menit
  - Validasi rentang jam operasional (07:00–20:00)
  - Validasi `start_time` < `end_time`
  - Validasi tanggal tidak boleh di masa lalu
- [ ] API `POST /api/reservations`:
  - Pembuatan reservasi oleh pengguna (status default: `pending`)
  - Validasi server memastikan fasilitas `active`
- [ ] API `GET /api/reservations/my`: Mengambil riwayat pemesanan milik user yang sedang login
- [ ] API `GET /api/reservations`: Mengambil semua antrian reservasi (filter status) untuk Petugas & Admin
- [ ] API `GET /api/reservations/[id]`: Detail reservasi lengkap
- [ ] API `PATCH /api/reservations/[id]`:
  - **Algoritma Server Anti-Bentrok:** Saat petugas approve, cek apakah ada reservasi approved lain yang overlap pada fasilitas dan tanggal yang sama
  - Pembatalan oleh pengguna (hanya jika waktu belum lewat)
  - Pembatalan mendesak oleh petugas (wajib menyertakan `cancel_reason`)

#### Frontend & UI:
- [ ] Komponen `ReservationForm.tsx`: Pemilihan fasilitas, tanggal, dan multi-slot interaktif
- [ ] Komponen `ReservationTable.tsx`: Tabel reservasi dengan badge status & aksi
- [ ] Halaman Ajukan Reservasi (`app/(dashboard)/pengguna/reservasi/buat/page.tsx`): Form pemesanan dengan SlotGrid interaktif
- [ ] Halaman Riwayat Reservasi Pengguna (`app/(dashboard)/pengguna/reservasi/page.tsx`):
  - List riwayat pemesanan
  - Tombol batalkan reservasi
- [ ] Halaman Kelola Reservasi Petugas (`app/(dashboard)/petugas/reservasi/page.tsx`):
  - Tabel antrian reservasi pending
  - Tombol aksi Approve & Reject
  - Modal pembatalan darurat dengan isian alasan pembatalan

---

### Sulthon: Pelaporan Kerusakan, Status Perbaikan, Dashboard, & Rekap Export
**Fokus:** Pelaporan masalah dan upload bukti fisik, pemeliharaan fasilitas, dashboard ringkasan, serta export data.

#### Backend & Logika:
- [ ] `lib/validations/report.ts`: Validasi Zod kategori laporan dan deskripsi masalah
- [ ] API `POST /api/upload`: Upload file foto kerusakan ke `/public/uploads/`
- [ ] API `POST /api/reports`: Pelaporan kerusakan oleh pengguna
- [ ] API `GET /api/reports/my`: Riwayat laporan pengguna yang sedang login
- [ ] API `GET /api/reports`: Antrian laporan untuk petugas & admin
- [ ] API `GET /api/reports/[id]`: Detail laporan beserta foto
- [ ] API `PATCH /api/reports/[id]`: Petugas update status (`new` → `in_progress` → `resolved`/`rejected`) + catatan resolusi
- [ ] API Dashboard Analytics: Query agregasi total reservasi, antrian pending, dan frekuensi kerusakan
- [ ] API `GET /api/export`: Endpoint generate data rekap okupansi & kerusakan format CSV, Excel (`exceljs`), dan PDF (`jspdf`)

#### Frontend & UI:
- [ ] Komponen `ReportForm.tsx`: Input kategori kerusakan, textarea deskripsi, dan upload foto dengan preview
- [ ] Komponen `ReportTable.tsx`: List laporan dengan badge status
- [ ] Halaman Buat Laporan (`app/(dashboard)/pengguna/laporan/buat/page.tsx`)
- [ ] Halaman Riwayat Laporan Pengguna (`app/(dashboard)/pengguna/laporan/page.tsx`)
- [ ] Halaman Kelola Laporan Petugas (`app/(dashboard)/petugas/laporan/page.tsx`): Update status investigasi & input catatan resolusi
- [ ] Halaman Kelola Status Pemeliharaan Fasilitas (`app/(dashboard)/petugas/fasilitas/page.tsx`): Toggle status fasilitas ke `maintenance` / `active`
- [ ] Dashboard Petugas (`app/(dashboard)/petugas/page.tsx`): Card ringkasan antrian reservasi & laporan
- [ ] Dashboard Admin (`app/(dashboard)/admin/page.tsx`): Metrik okupansi, total user, dan grafik ringkas
- [ ] Halaman Rekap & Export Admin (`app/(dashboard)/admin/rekap/page.tsx`): Filter tanggal, preview tabel, dan tombol download CSV/Excel/PDF

---

## Tracking Progress Tim

| Anggota | Domain Utama | Status Branch | Test & Lint | Selesai |
|---|---|---|---|---|
| **Zaidan** | Shared Foundation, Auth & User Management | `feat/auth-foundation` | ⬜ Belum | ⬜ 0% |
| **Dewa** | Fasilitas & Landing Page | `feat/facilities` | ⬜ Belum | ⬜ 0% |
| **Moses** | Sistem Reservasi | `feat/reservations` | ⬜ Belum | ⬜ 0% |
| **Sulthon** | Laporan, Dashboard, Export | `feat/reports-admin` | ⬜ Belum | ⬜ 0% |
