# FLOW — Panduan Eksekusi Tim & Branching Strategy (Eunomia)

Dokumen ini berisi panduan teknis **langkah pasti** untuk Zaidan, Dewa, Moses, dan Sulthon agar dapat bekerja secara **paralel di waktu yang sama** dari perangkat masing-masing tanpa merusak repository dan tanpa merge conflict.

---

## 1. Aturan Branching & Workflow Konkurensi

Semua anggota bekerja di branch fitur masing-masing yang di-branch dari `dev`.

```
main (Production)
  ▲
  └── dev (Integration Branch)
        ├── feat/auth-foundation  --> [Zaidan]
        ├── feat/facilities       --> [Dewa]
        ├── feat/reservations     --> [Moses]
        └── feat/reports-admin    --> [Sulthon]
```

### 1.1 Golden Rules Mencegah Kerusakan Repo:
1. **Dilarang keras edit file di luar domain fitur masing-masing.** 
   - Zaidan: `app/api/auth`, `app/api/users`, `app/(public)/login`, `app/(public)/register`, `app/(dashboard)/admin/users`, `middleware.ts`, `lib/auth.ts`, dan shared foundation.
   - Dewa: `app/page.tsx`, `app/api/facilities`, `app/(public)/facilities`, `app/(dashboard)/admin/fasilitas`, komponen fasilitas.
   - Moses: `app/api/reservations`, `app/(dashboard)/pengguna/reservasi`, `app/(dashboard)/petugas/reservasi`, komponen reservasi.
   - Sulthon: `app/api/reports`, `app/api/upload`, `app/api/export`, `app/(dashboard)/pengguna/laporan`, `app/(dashboard)/petugas/laporan`, `app/(dashboard)/petugas/fasilitas`, `app/(dashboard)/admin/rekap`, `app/(dashboard)/admin/page.tsx`, `app/(dashboard)/petugas/page.tsx`.
2. **Jangan ubah `prisma/schema.prisma` sendiri-sendiri.** Skema database sudah dikunci dan sudah dimigrasi di awal.
3. **Sebelum push branch:** Wajib lakukan `git fetch origin && git merge origin/dev` di lokal, jalankan `npm run lint`, dan pastikan tidak ada conflict.

---

## 2. Setup Device Lokal (Lakukan Sekali di Awal)

### Pengguna Windows (Laragon) & Pengguna Mac (DBngin / Homebrew):
1. **Nyalakan MySQL:**
   - **Windows:** Buka Laragon -> Klik *Start All* (MySQL port 3306). Buat database bernama `eunomia` lewat HeidiSQL/phpMyAdmin.
   - **Mac:** Buka DBngin -> New Service MySQL 8.0 (Port 3306) -> Start. Atau via terminal: `brew services start mysql`. Buat database bernama `eunomia`.
2. **Setup Codebase:**
   ```bash
   git clone https://github.com/HW-Never-Die/Project-PPK.git
   cd Project-PPK
   git checkout dev
   npm install
   ```
3. **Konfigurasi `.env`:**
   Buat file `.env` di root project:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/eunomia"
   JWT_SECRET="eunomia_jwt_secret_key_super_aman_2026"
   ```
4. **Sinkronisasi Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
   *(Data seed 4 user default dan 7 fasilitas kampus akan otomatis terisi)*

---

## 3. Langkah Pasti untuk Masing-Masing Anggota

---

### [Zaidan] — `feat/auth-foundation`
> **Fokus:** Shared Foundation, Otentikasi JWT, Proteksi Rute (Middleware), dan Verifikasi User Admin.

#### Urutan Kerja:
1. **Buat Branch:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/auth-foundation
   ```
2. **Langkah 1 (Shared Foundation):**
   * Buat `.env.example`.
   * Update `.gitignore`: tambahkan `PRD.md`, `DESIGN.md`, `AI_RULES.md`, `PLANNING.md`, `FLOW.md`.
   * Buat `types/index.ts`: Definisi type TypeScript User, Facility, Reservation, Report, AuthUser, APIResponse.
   * Buat `lib/constants.ts`: Enum status, jam operasional (07:00–20:00), 26 slot waktu 30 menit.
   * Buat `lib/utils.ts`: Helper `cn()`, format tanggal & jam Indonesia (`Intl`).
   * Buat Base UI di `components/ui/`: `Button.tsx`, `Input.tsx`, `Select.tsx`, `Modal.tsx`, `Table.tsx`, `TagPill.tsx`.
   * Buat Shell Layout `app/(dashboard)/layout.tsx`: Sidebar file-manager style & header dengan role switcher/nav dinamis.
   * **Commit & Push Fondasi Awal:** Beri tahu tim agar Dewa, Moses, dan Sulthon bisa segera `git pull origin dev`.
3. **Langkah 2 (Backend Auth & Middleware):**
   * Buat `lib/validations/auth.ts` (schema login, register).
   * Buat `lib/validations/user.ts` (schema admin create & update user).
   * Buat `lib/auth.ts` (sign & verify JWT menggunakan `jose`, set cookie httpOnly `token`).
   * Buat `middleware.ts` (cek cookie, decode role, redirect jika tidak berhak).
   * Buat API Route:
     - `app/api/auth/register/route.ts` (status: `pending`)
     - `app/api/auth/login/route.ts` (cek email, password `bcryptjs`, hanya status `verified` yang lolos)
     - `app/api/auth/logout/route.ts` (clear cookie)
     - `app/api/auth/me/route.ts` (return data user login)
     - `app/api/users/route.ts` (GET list user, POST buat user `verified`)
     - `app/api/users/[id]/route.ts` (PATCH verifikasi atau tolak user)
4. **Langkah 3 (Frontend Auth & Admin User):**
   * Buat Auth Context / Provider di React untuk menyimpan status user.
   * Buat halaman `app/(public)/login/page.tsx` (Application Window style).
   * Buat halaman `app/(public)/register/page.tsx` (Form + notice akun perlu diverifikasi).
   * Buat halaman `app/(dashboard)/admin/users/page.tsx` (Tabel tab "Menunggu Verifikasi" dan "Semua User", tombol aksi verifikasi/tolak, modal tambah user).
5. **Verifikasi & Merge:**
   ```bash
   npm run lint && npm run build
   git commit -m "feat(auth): complete shared foundation, auth, and user management"
   git push origin feat/auth-foundation
   ```

---

### [Dewa] — `feat/facilities`
> **Fokus:** Katalog Fasilitas Publik, Ketersediaan Slot Interaktif, CRUD Fasilitas Admin, dan Landing Page Sistem.

#### Urutan Kerja:
1. **Buat Branch:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/facilities
   ```
   *(Sebelum Zaidan selesai merge shared files, gunakan mock komponen sederhana atau mock layout)*
2. **Langkah 1 (Backend Fasilitas):**
   * Buat `lib/validations/facility.ts` (schema Zod create & update fasilitas).
   * Buat API Route:
     - `app/api/facilities/route.ts`:
       * `GET`: List fasilitas dengan query filter `type`, `location`, `capacity`, `search`.
       * `POST`: Admin buat fasilitas baru.
     - `app/api/facilities/[id]/route.ts`:
       * `GET`: Detail spesifik fasilitas.
       * `PUT`: Admin update data fasilitas.
       * `PATCH`: Update status fasilitas (`active`, `maintenance`, `inactive`).
     - `app/api/facilities/[id]/availability/route.ts`:
       * `GET`: Menerima query param `?date=YYYY-MM-DD`. Menghitung 26 slot waktu dari 07:00-20:00, bandingkan dengan reservasi yang berstatus `approved` pada tanggal tersebut. Return status per slot: `{ time: "07:00 - 07:30", available: boolean }`.
3. **Langkah 2 (Komponen Fasilitas):**
   * Buat `components/facilities/FacilityCard.tsx` (Card paper white, tag pill tipe, kapasitas, status).
   * Buat `components/facilities/FacilityFilter.tsx` (Search bar + dropdown tipe & kapasitas).
   * Buat `components/facilities/SlotGrid.tsx` (Visual matrix 26 slot ketersediaan: hijau/abu-abu).
4. **Langkah 3 (Frontend Halaman):**
   * **Rombak `app/page.tsx`:** Hapus total template Vercel. Bangun Hero section PostHog (`Sandy Desk` canvas, Application Window, Amber CTA "Lihat Fasilitas", Outlined Button "Login").
   * Buat `app/(public)/facilities/page.tsx`: Grid katalog fasilitas, search bar, filter, dan modal cek ketersediaan slot per tanggal.
   * Buat `app/(dashboard)/admin/fasilitas/page.tsx`: Tabel master fasilitas kampus, tombol tambah fasilitas, modal form edit, dan toggle aktif/nonaktif.
5. **Verifikasi & Merge:**
   ```bash
   git merge origin/dev
   npm run lint && npm run build
   git commit -m "feat(facilities): complete landing page, public catalog, slot availability, and admin facilities"
   git push origin feat/facilities
   ```

---

### [Moses] — `feat/reservations`
> **Fokus:** Alur Booking Fasilitas, Validasi Slot 30 Menit, Algoritma Server Anti-Bentrok, dan Approval Petugas.

#### Urutan Kerja:
1. **Buat Branch:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/reservations
   ```
2. **Langkah 1 (Validasi & Backend Reservasi):**
   * Buat `lib/validations/reservation.ts`:
     - Validasi waktu kelipatan 30 menit (`07:00`, `07:30`, dst).
     - Validasi rentang jam operasional (07:00 s.d. 20:00).
     - Validasi `startTime < endTime`.
     - Validasi tanggal tidak boleh tanggal lampau.
   * Buat API Route:
     - `app/api/reservations/route.ts`:
       * `GET`: Petugas/Admin mengambil daftar semua reservasi (filter `status`).
       * `POST`: Pengguna membuat reservasi baru (default status: `pending`). Validasi fasilitas harus `active`.
     - `app/api/reservations/my/route.ts`:
       * `GET`: Pengguna mengambil riwayat reservasi miliknya sendiri.
     - `app/api/reservations/[id]/route.ts`:
       * `GET`: Detail reservasi.
       * `PATCH`: 
         - **Jika Aksi Approve (Petugas):** WAJIB jalankan query cek bentrok: Apakah ada reservasi lain pada `facility_id` dan `date` yang sama dengan status `approved` yang rentang waktunya bertabrakan (`startTime < existingEndTime && endTime > existingStartTime`). Jika bentrok, tolak dengan HTTP 409 Conflict.
         - **Jika Aksi Cancel (Pengguna):** Hanya boleh jika status masih pending/approved dan waktu belum lewat.
         - **Jika Aksi Cancel Mendesak (Petugas):** Wajib menyertakan `cancel_reason`.
3. **Langkah 2 (Komponen Reservasi):**
   * Buat `components/reservations/ReservationForm.tsx`: Pemilihan fasilitas, datepicker, selector slot 30 menit, textarea tujuan.
   * Buat `components/reservations/ReservationTable.tsx`: Tabel reservasi, tag status warna PostHog, tombol batalkan / review.
4. **Langkah 3 (Frontend Halaman):**
   * Buat `app/(dashboard)/pengguna/reservasi/buat/page.tsx`: Form reservasi interaktif.
   * Buat `app/(dashboard)/pengguna/reservasi/page.tsx`: Riwayat pemesanan pengguna + tombol batalkan.
   * Buat `app/(dashboard)/petugas/reservasi/page.tsx`: Antrian approval reservasi masuk, tombol Approve & Reject, modal pembatalan darurat + input alasan.
5. **Verifikasi & Merge:**
   ```bash
   git merge origin/dev
   npm run lint && npm run build
   git commit -m "feat(reservations): complete reservation flow with server anti-conflict check and officer management"
   git push origin feat/reservations
   ```

---

### [Sulthon] — `feat/reports-admin`
> **Fokus:** Pelaporan Kerusakan + Upload Foto, Toggle Maintenance Fasilitas, Dashboard Ringkasan, dan Rekap Export (CSV/Excel/PDF).

#### Urutan Kerja:
1. **Buat Branch & Install Dependency Export:**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feat/reports-admin
   npm install exceljs jspdf jspdf-autotable papaparse
   npm install --save-dev @types/papaparse
   ```
2. **Langkah 1 (Backend Laporan & Upload):**
   * Buat `lib/validations/report.ts` (schema kategori: `kerusakan`, `kebersihan`, `keamanan`, `lainnya`, deskripsi masalah).
   * Buat API Route `app/api/upload/route.ts`: Terima multipart form-data (gambar), simpan ke folder `/public/uploads/`, kembalikan URL file.
   * Buat API Route `app/api/reports/route.ts`:
     - `POST`: Pengguna kirim laporan (+ `photo_url`). Default status: `new`.
     - `GET`: Petugas/Admin ambil semua laporan.
   * Buat API Route `app/api/reports/my/route.ts`: Riwayat laporan milik user login.
   * Buat API Route `app/api/reports/[id]/route.ts`:
     - `GET`: Detail laporan.
     - `PATCH`: Petugas ubah status (`new` -> `in_progress` -> `resolved` / `rejected`) + simpan `resolution_notes`.
3. **Langkah 2 (Backend Export & Dashboard Analytics):**
   * Buat API Route `app/api/export/route.ts`:
     - Query data reservasi/okupansi atau rekap kerusakan berdasarkan filter tanggal.
     - Generate file sesuai param `?format=csv|excel|pdf` menggunakan `papaparse`, `exceljs`, atau `jspdf-autotable`. Return stream file download.
4. **Langkah 3 (Frontend Halaman):**
   * Buat `components/reports/ReportForm.tsx` (Form lapor + input file upload foto + preview).
   * Buat `components/reports/ReportTable.tsx` (Tabel laporan status pill).
   * Buat `app/(dashboard)/pengguna/laporan/buat/page.tsx`: Form lapor kerusakan.
   * Buat `app/(dashboard)/pengguna/laporan/page.tsx`: Riwayat laporan pengguna.
   * Buat `app/(dashboard)/petugas/laporan/page.tsx`: Antrian laporan, update progress investigasi, input catatan resolusi.
   * Buat `app/(dashboard)/petugas/fasilitas/page.tsx`: Daftar fasilitas dengan toggle switch `maintenance` / `active`.
   * Buat `app/(dashboard)/petugas/page.tsx`: Dashboard ringkasan (jumlah reservasi pending, laporan baru).
   * Buat `app/(dashboard)/admin/page.tsx`: Dashboard metrik sistem (total okupansi, pengguna aktif, grafik ringkas).
   * Buat `app/(dashboard)/admin/rekap/page.tsx`: Filter rentang waktu, preview data tabel, dan tombol download CSV, Excel, PDF.
5. **Verifikasi & Merge:**
   ```bash
   git merge origin/dev
   npm run lint && npm run build
   git commit -m "feat(reports-admin): complete damage reporting, officer dashboard, and multi-format export"
   git push origin feat/reports-admin
   ```

---

## 4. Prompt Siap Pakai untuk AI Agent Masing-Masing

Cukup copy teks di bawah ke AI Agent masing-masing:

### Prompt untuk AI Zaidan:
```text
Buka project ini dan kerjakan tugas Zaidan sesuai instruksi di FLOW.md dan PLANNING.md. Kamu bertanggung jawab atas branch feat/auth-foundation. Kerjakan:
1. Shared Foundation: types/index.ts, lib/constants.ts, lib/utils.ts, components/ui/ (Button, Input, Select, Modal, Table, TagPill), shell layout app/(dashboard)/layout.tsx, dan .env.example.
2. Auth & Middleware: lib/auth.ts (JWT jose + bcryptjs), middleware.ts route protection by role, endpoint API login, register, logout, me, dan API admin users.
3. Halaman Frontend: /login, /register, dan /admin/users.
Patuhi DESIGN.md (gaya PostHog, Sandy Desk #e1d7c2, Paper White #ffffff, border 1px #bfc1b7, font Open Runde / IBM Plex Sans). Pastikan npm run lint dan npm run build lolos 0 error.
```

### Prompt untuk AI Dewa:
```text
Buka project ini dan kerjakan tugas Dewa sesuai instruksi di FLOW.md dan PLANNING.md. Kamu bertanggung jawab atas branch feat/facilities. Kerjakan:
1. Backend Fasilitas: lib/validations/facility.ts, API GET/POST /api/facilities, GET/PUT/PATCH /api/facilities/[id], dan ketersediaan 26 slot waktu di GET /api/facilities/[id]/availability.
2. Komponen: FacilityCard, FacilityFilter, SlotGrid.
3. Halaman Frontend: Rombak total app/page.tsx menjadi Landing Page PostHog (Sandy desk, hero, CTA), buat halaman publik /facilities dengan modal slot, dan halaman admin /admin/fasilitas.
Patuhi DESIGN.md. Pastikan npm run lint dan npm run build lolos 0 error.
```

### Prompt untuk AI Moses:
```text
Buka project ini dan kerjakan tugas Moses sesuai instruksi di FLOW.md dan PLANNING.md. Kamu bertanggung jawab atas branch feat/reservations. Kerjakan:
1. Backend Reservasi: lib/validations/reservation.ts (validasi slot 30 menit, jam 07:00-20:00, tanggal valid), API POST/GET /api/reservations, GET /api/reservations/my, dan PATCH /api/reservations/[id] yang memiliki ALGORITMA SERVER ANTI-BENTROK saat approve.
2. Komponen: ReservationForm, ReservationTable.
3. Halaman Frontend: /pengguna/reservasi/buat, /pengguna/reservasi, dan kelola reservasi petugas di /petugas/reservasi.
Patuhi DESIGN.md. Pastikan npm run lint dan npm run build lolos 0 error.
```

### Prompt untuk AI Sulthon:
```text
Buka project ini dan kerjakan tugas Sulthon sesuai instruksi di FLOW.md dan PLANNING.md. Kamu bertanggung jawab atas branch feat/reports-admin. Kerjakan:
1. Install package export jika belum ada: exceljs, jspdf, jspdf-autotable, papaparse.
2. Backend Laporan & Export: lib/validations/report.ts, API upload foto /api/upload, API laporan /api/reports/*, toggle maintenance fasilitas, dan API export stream data /api/export (CSV, Excel, PDF).
3. Halaman Frontend: /pengguna/laporan/buat, /pengguna/laporan, /petugas/laporan, /petugas/fasilitas, dashboard /petugas, dashboard /admin, dan halaman /admin/rekap.
Patuhi DESIGN.md. Pastikan npm run lint dan npm run build lolos 0 error.
```
