# PRD — Sistem Reservasi & Pelaporan Fasilitas Kampus

> **Nama Proyek:** Eunomia (sementara — akan diganti)
> **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Prisma · MySQL (Laragon)
> **Design System:** PostHog-inspired — lihat `DESIGN.md`

---

## 1. Latar Belakang

Kampus membutuhkan sistem terpusat untuk mengelola penggunaan fasilitas (ruang kelas, aula, laboratorium, alat, lapangan). Saat ini proses reservasi dan pelaporan kerusakan masih manual/terpisah, menyebabkan bentrok jadwal dan lambatnya penanganan kerusakan.

Sistem ini memungkinkan:
- Pengguna mengecek ketersediaan dan mengajukan reservasi fasilitas
- Pengguna melaporkan kerusakan/masalah fasilitas
- Petugas memproses reservasi dan laporan kerusakan secara terpusat
- Admin mengelola data master, user, dan melihat rekap

---

## 2. Aktor & Hak Akses

### 2.1 Pengunjung (tanpa login)
- Lihat daftar fasilitas & status ketersediaan per slot waktu (tersedia/tidak tersedia)
- Cari fasilitas berdasarkan tipe/lokasi/kapasitas
- TIDAK bisa lihat detail pemohon atau tujuan penggunaan
- TIDAK bisa reservasi atau lapor

### 2.2 Pengguna (mahasiswa/dosen/staf — login required)
- Semua hak pengunjung
- Ajukan reservasi pada rentang waktu tertentu + tujuan penggunaan
- Batalkan reservasi sendiri sebelum batas waktu
- Lihat riwayat & status reservasi sendiri (termasuk detail lengkap)
- Laporkan kerusakan/masalah fasilitas (kategori, deskripsi, foto)
- Lihat status laporan sendiri

### 2.3 Petugas (login required — didaftarkan oleh admin saja)
- Lihat dashboard/antrian reservasi & laporan yang menunggu diproses
- Approve/reject reservasi (sistem cegah bentrok jadwal)
- Cancel reservasi yang sudah disetujui (kondisi mendesak) + alasan
- Ubah status laporan (baru → diproses → selesai/ditolak) + catatan resolusi
- Tandai fasilitas "dalam perbaikan" / kembalikan ke aktif

### 2.4 Admin (login required)
- Kelola data fasilitas (tambah/edit/nonaktifkan)
- Daftarkan akun petugas (petugas TIDAK bisa registrasi mandiri)
- Daftarkan akun pengguna secara langsung
- Verifikasi/tolak akun pengguna hasil registrasi mandiri
- Lihat & export rekap okupansi fasilitas & frekuensi kerusakan (CSV/Excel/PDF)

---

## 3. Aturan Bisnis

### 3.1 Slot Waktu Reservasi
- Jam operasional: **07:00 – 20:00**
- Durasi slot tetap: **30 menit**
- Slot valid: 07:00-07:30, 07:30-08:00, ..., 19:30-20:00 (**total 26 slot/hari**)
- `start_time` dan `end_time` WAJIB kelipatan 30 menit dalam jam operasional
- Validasi di **server-side** (bukan hanya UI)
- Reservasi bisa mencakup beberapa slot berurutan (misal 08:00-10:00 = 4 slot)

### 3.2 Pencegahan Bentrok
- Saat petugas approve reservasi, sistem cek apakah ada reservasi lain yang sudah approved pada fasilitas & waktu yang sama
- Jika bentrok, approve DITOLAK oleh sistem

### 3.3 Pembatalan Reservasi
- Pengguna bisa batalkan reservasi sendiri yang berstatus **pending** atau **approved**, selama waktu reservasi belum lewat
- Petugas bisa batalkan reservasi approved dalam kondisi mendesak + wajib isi alasan

### 3.4 Registrasi & Verifikasi Akun
- Pengguna bisa registrasi mandiri → status akun **pending** → perlu verifikasi admin
- Akun pending TIDAK bisa login
- Petugas TIDAK bisa registrasi mandiri — hanya admin yang daftarkan
- Admin bisa daftarkan pengguna & petugas langsung (status langsung **verified**)

### 3.5 Status Fasilitas
| Status | Keterangan |
|---|---|
| `active` | Tersedia untuk reservasi |
| `maintenance` | Dalam perbaikan, tidak bisa direservasi |
| `inactive` | Dinonaktifkan oleh admin, tidak tampil untuk pengguna biasa |

### 3.6 Status Reservasi
| Status | Keterangan |
|---|---|
| `pending` | Menunggu persetujuan petugas |
| `approved` | Disetujui |
| `rejected` | Ditolak petugas |
| `cancelled` | Dibatalkan (oleh pengguna sendiri atau petugas) |

### 3.7 Status Laporan
| Status | Keterangan |
|---|---|
| `new` | Baru dilaporkan |
| `in_progress` | Sedang ditangani |
| `resolved` | Selesai diperbaiki |
| `rejected` | Ditolak (bukan kerusakan valid) |

---

## 4. User Stories

| No | User Story | Aktor |
|---|---|---|
| 1 | Melihat daftar fasilitas beserta status ketersediaan per slot waktu (tersedia/tidak tersedia), tanpa detail pemohon/tujuan | Pengunjung/Pengguna |
| 2 | Mencari fasilitas berdasarkan tipe/lokasi/kapasitas | Pengunjung/Pengguna |
| 3 | Mengajukan reservasi pada rentang waktu tertentu dengan tujuan penggunaan | Pengguna |
| 4 | Membatalkan reservasi sendiri sebelum batas waktu | Pengguna |
| 5 | Melihat riwayat dan status reservasi sendiri, termasuk detail lengkap | Pengguna |
| 6 | Melaporkan kerusakan/masalah fasilitas (kategori, deskripsi, foto) | Pengguna |
| 7 | Melihat status laporan sendiri | Pengguna |
| 8 | Melihat dashboard/antrian reservasi dan laporan yang menunggu diproses | Petugas |
| 9 | Menyetujui/menolak reservasi; sistem cegah bentrok jadwal | Petugas |
| 10 | Membatalkan reservasi approved (kondisi mendesak) + alasan | Petugas |
| 11 | Mengubah status laporan (baru/diproses/selesai/ditolak) + catatan resolusi | Petugas |
| 12 | Menandai fasilitas "dalam perbaikan" / kembalikan ke aktif | Petugas |
| 13 | Mendaftarkan akun petugas (petugas tidak bisa registrasi mandiri) | Admin |
| 14 | Mendaftarkan akun pengguna secara langsung | Admin |
| 15 | Memverifikasi/menolak akun pengguna hasil registrasi mandiri | Admin |
| 16 | Mengelola data fasilitas (tambah/edit/nonaktifkan) | Admin |
| 17 | Melihat & mengekspor rekap okupansi dan frekuensi kerusakan (CSV/Excel/PDF) | Admin |

---

## 5. Rancangan Database

### 5.1 Tabel `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, AI | |
| name | VARCHAR(100) | Nama lengkap |
| email | VARCHAR(100), UNIQUE | Email login |
| password | VARCHAR(255) | Bcrypt hash |
| role | ENUM(admin, petugas, pengguna) | |
| status | ENUM(pending, verified, rejected) | Status verifikasi akun |
| created_at | DATETIME | Default: now |
| updated_at | DATETIME | Auto-update |

### 5.2 Tabel `facilities`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, AI | |
| name | VARCHAR(100) | Nama fasilitas |
| type | ENUM(ruang_kelas, aula, laboratorium, alat, lapangan) | |
| location | VARCHAR(200) | Gedung/lantai/area |
| capacity | INT, nullable | Kapasitas (nullable untuk tipe 'alat') |
| description | TEXT | Deskripsi lengkap |
| status | ENUM(active, maintenance, inactive) | Default: active |
| image_url | VARCHAR(500), nullable | Foto fasilitas |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### 5.3 Tabel `reservations`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, AI | |
| user_id | INT, FK → users | Pemohon |
| facility_id | INT, FK → facilities | Fasilitas yang dipesan |
| date | DATE | Tanggal reservasi |
| start_time | TIME | Waktu mulai (kelipatan 30 menit) |
| end_time | TIME | Waktu selesai (kelipatan 30 menit) |
| purpose | TEXT | Tujuan penggunaan |
| status | ENUM(pending, approved, rejected, cancelled) | Default: pending |
| cancel_reason | TEXT, nullable | Alasan pembatalan |
| processed_by | INT, FK → users, nullable | Petugas yang memproses |
| processed_at | DATETIME, nullable | Waktu diproses |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### 5.4 Tabel `reports`
| Kolom | Tipe | Keterangan |
|---|---|---|
| id | INT, PK, AI | |
| user_id | INT, FK → users | Pelapor |
| facility_id | INT, FK → facilities | Fasilitas yang dilaporkan |
| category | ENUM(kerusakan, kebersihan, keamanan, lainnya) | Kategori masalah |
| description | TEXT | Deskripsi masalah |
| photo_url | VARCHAR(500), nullable | URL foto |
| status | ENUM(new, in_progress, resolved, rejected) | Default: new |
| resolution_notes | TEXT, nullable | Catatan resolusi |
| processed_by | INT, FK → users, nullable | Petugas yang menangani |
| processed_at | DATETIME, nullable | Waktu ditangani |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### 5.5 Index
- `reservations`: composite index (`facility_id`, `date`, `start_time`, `end_time`, `status`) — cek bentrok
- `reservations`: index (`user_id`, `status`) — riwayat pengguna
- `reports`: index (`facility_id`, `status`) — dashboard petugas
- `reports`: index (`user_id`) — riwayat pelapor

---

## 6. Tech Stack & Dependencies

### 6.1 Sudah Ter-install
| Package | Versi |
|---|---|
| Next.js | 16.3.4 (App Router) |
| React | 19.2.8 |
| TypeScript | 5 |
| Tailwind CSS | 4 |
| ESLint | 9 |

### 6.2 Perlu Ditambahkan
| Package | Kegunaan |
|---|---|
| `prisma` (dev) | ORM CLI |
| `@prisma/client` | ORM runtime query builder |
| `bcryptjs` + `@types/bcryptjs` | Hash password |
| `jose` | JWT (zero-dependency, edge-compatible) |
| `zod` | Validasi schema (server & client) |
| `lucide-react` | Icon library |
| `papaparse` | Export CSV |
| `jspdf` + `jspdf-autotable` | Export PDF |
| `exceljs` | Export Excel |

### 6.3 Tidak Perlu Library Tambahan
| Kebutuhan | Solusi Native |
|---|---|
| File upload | Next.js API Route + `fs` → `/public/uploads/` |
| Auth middleware | Next.js Middleware (`middleware.ts`) |
| State management | React `useState` / `useContext` |
| Form handling | Native React forms |
| Date/time | Native `Date` + `Intl` API |

---

## 7. Struktur Folder

```
ProjectPreUTS-PPK/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (publik)
│   ├── (public)/                 # Route group: halaman publik
│   │   ├── facilities/
│   │   │   └── page.tsx          # Daftar fasilitas + ketersediaan
│   │   ├── login/
│   │   │   └── page.tsx          # Form login
│   │   └── register/
│   │       └── page.tsx          # Form registrasi pengguna
│   ├── (dashboard)/              # Route group: halaman setelah login
│   │   ├── layout.tsx            # Dashboard layout (sidebar + header)
│   │   ├── pengguna/             # Halaman pengguna
│   │   │   ├── reservasi/
│   │   │   │   ├── page.tsx      # Riwayat reservasi
│   │   │   │   └── buat/
│   │   │   │       └── page.tsx  # Form ajukan reservasi
│   │   │   └── laporan/
│   │   │       ├── page.tsx      # Riwayat laporan
│   │   │       └── buat/
│   │   │           └── page.tsx  # Form buat laporan
│   │   ├── petugas/              # Halaman petugas
│   │   │   ├── page.tsx          # Dashboard antrian
│   │   │   ├── reservasi/
│   │   │   │   └── page.tsx      # Kelola reservasi
│   │   │   ├── laporan/
│   │   │   │   └── page.tsx      # Kelola laporan
│   │   │   └── fasilitas/
│   │   │       └── page.tsx      # Update status fasilitas
│   │   └── admin/                # Halaman admin
│   │       ├── page.tsx          # Dashboard admin
│   │       ├── fasilitas/
│   │       │   ├── page.tsx      # CRUD fasilitas
│   │       │   └── [id]/
│   │       │       └── page.tsx  # Edit fasilitas
│   │       ├── users/
│   │       │   └── page.tsx      # Kelola user + verifikasi
│   │       └── rekap/
│   │           └── page.tsx      # Rekap + export
│   └── api/                      # API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── facilities/
│       │   ├── route.ts          # GET list+search, POST create
│       │   └── [id]/
│       │       ├── route.ts      # GET, PUT, PATCH
│       │       └── availability/
│       │           └── route.ts  # GET ketersediaan slot
│       ├── reservations/
│       │   ├── route.ts          # GET list, POST create
│       │   ├── [id]/
│       │   │   └── route.ts      # GET, PATCH
│       │   └── my/
│       │       └── route.ts      # GET reservasi sendiri
│       ├── reports/
│       │   ├── route.ts          # GET list, POST create
│       │   ├── [id]/
│       │   │   └── route.ts      # GET, PATCH
│       │   └── my/
│       │       └── route.ts      # GET laporan sendiri
│       ├── users/
│       │   ├── route.ts          # GET list, POST create
│       │   └── [id]/
│       │       └── route.ts      # PATCH
│       ├── upload/
│       │   └── route.ts          # POST upload foto
│       └── export/
│           └── route.ts          # GET export rekap
├── components/                   # Komponen React reusable
│   ├── ui/                       # UI primitives (Button, Input, Select, Modal, Table, Badge, Card, Pagination)
│   ├── layout/                   # Navbar, Sidebar, Footer
│   ├── facilities/               # FacilityCard, FacilityFilter, SlotGrid
│   ├── reservations/             # ReservationForm, ReservationTable
│   └── reports/                  # ReportForm, ReportTable
├── lib/                          # Utilities & helpers
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # JWT sign/verify, session helpers
│   ├── validations/              # Zod schemas (auth, facility, reservation, report)
│   ├── constants.ts              # Slot waktu, jam operasional, enum values
│   └── utils.ts                  # Helper umum (formatDate, cn, dll)
├── config/
│   └── site.ts                   # Nama site, metadata
├── middleware.ts                  # Auth middleware (route protection by role)
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
├── public/
│   └── uploads/                  # Upload foto
├── types/
│   └── index.ts                  # Shared TypeScript types
├── PRD.md                        # Dokumen ini
├── DESIGN.md                     # Design system reference
├── AI_RULES.md                   # Rules untuk AI agent
└── PLANNING.md                   # Tahapan pengembangan & tracking
```

---

## 8. API Routes

### 8.1 Auth
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/auth/register` | Publik | Registrasi pengguna baru (status: pending) |
| POST | `/api/auth/login` | Publik | Login (cek status verified) |
| POST | `/api/auth/logout` | Login | Hapus session/cookie |
| GET | `/api/auth/me` | Login | Data user yang sedang login |

### 8.2 Facilities
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/facilities` | Publik | List fasilitas + filter (type, location, capacity) |
| GET | `/api/facilities/[id]` | Publik | Detail fasilitas |
| GET | `/api/facilities/[id]/availability?date=YYYY-MM-DD` | Publik | Ketersediaan slot per tanggal |
| POST | `/api/facilities` | Admin | Tambah fasilitas |
| PUT | `/api/facilities/[id]` | Admin | Edit fasilitas |
| PATCH | `/api/facilities/[id]` | Petugas/Admin | Update status (active/maintenance/inactive) |

### 8.3 Reservations
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/reservations` | Petugas/Admin | Semua reservasi (filter by status) |
| GET | `/api/reservations/my` | Pengguna | Reservasi milik user login |
| POST | `/api/reservations` | Pengguna | Ajukan reservasi baru |
| GET | `/api/reservations/[id]` | Pemilik/Petugas/Admin | Detail reservasi |
| PATCH | `/api/reservations/[id]` | Petugas/Pengguna | Update status (approve/reject/cancel) |

**Validasi server saat POST (buat reservasi):**
- `start_time` & `end_time` kelipatan 30 menit
- Dalam rentang 07:00-20:00
- `start_time` < `end_time`
- Tanggal tidak di masa lalu
- Fasilitas berstatus `active`

**Validasi server saat PATCH (approve):**
- Cek bentrok: tidak ada reservasi approved lain pada fasilitas + tanggal + waktu yang overlap

### 8.4 Reports
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/reports` | Petugas/Admin | Semua laporan (filter by status) |
| GET | `/api/reports/my` | Pengguna | Laporan milik user login |
| POST | `/api/reports` | Pengguna | Buat laporan baru |
| GET | `/api/reports/[id]` | Pemilik/Petugas/Admin | Detail laporan |
| PATCH | `/api/reports/[id]` | Petugas | Update status + catatan resolusi |

### 8.5 Users
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| GET | `/api/users` | Admin | List user (filter by role, status) |
| POST | `/api/users` | Admin | Buat user (pengguna/petugas, status: verified) |
| PATCH | `/api/users/[id]` | Admin | Verify/reject/update user |

### 8.6 Upload & Export
| Method | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| POST | `/api/upload` | Pengguna | Upload foto (return URL) |
| GET | `/api/export?type=csv&report=occupancy` | Admin | Export rekap |

---

## 9. Halaman & UI Flow

### 9.1 Halaman Publik

**Landing Page** (`/`)
- Hero section dengan judul sistem dan deskripsi
- CTA: "Lihat Fasilitas" (Amber CTA Button) dan "Login"
- Menggunakan design system dari DESIGN.md (Sandy Desk canvas, Application Window)

**Daftar Fasilitas** (`/facilities`)
- Grid fasilitas dengan card (Product Feature Card dari DESIGN.md)
- Filter bar: tipe, lokasi, kapasitas
- Search bar
- Klik card → modal/page ketersediaan slot (SlotGrid 07:00-20:00)
- Slot menampilkan tersedia/tidak tersedia saja (tanpa detail pemohon)

**Login** (`/login`)
- Form dalam Application Window: email, password
- Link ke registrasi

**Registrasi** (`/register`)
- Form: nama, email, password, konfirmasi password
- Info text: akun perlu diverifikasi admin

### 9.2 Halaman Pengguna

**Buat Reservasi** (`/pengguna/reservasi/buat`)
- Pilih fasilitas (dropdown/search)
- Pilih tanggal (date picker)
- SlotGrid visual 07:00-20:00 (pilih slot, bisa multi-slot berurutan)
- Textarea tujuan penggunaan
- Submit button

**Riwayat Reservasi** (`/pengguna/reservasi`)
- Tabel: fasilitas, tanggal, waktu, status (Tag Pill), aksi
- Filter by status
- Tombol "Batalkan" untuk pending/approved yang belum lewat

**Buat Laporan** (`/pengguna/laporan/buat`)
- Pilih fasilitas, kategori, deskripsi, upload foto
- Submit

**Riwayat Laporan** (`/pengguna/laporan`)
- Tabel: fasilitas, kategori, status, tanggal
- Expand/detail: deskripsi, foto, catatan resolusi

### 9.3 Halaman Petugas

**Dashboard** (`/petugas`)
- Statistik cards: reservasi pending, laporan baru
- Antrian terbaru (reservasi + laporan)

**Kelola Reservasi** (`/petugas/reservasi`)
- Tabel reservasi (default: pending)
- Aksi: Approve, Reject, Cancel (dengan form alasan)

**Kelola Laporan** (`/petugas/laporan`)
- Tabel laporan (default: new)
- Aksi: ubah status + form catatan resolusi

**Kelola Status Fasilitas** (`/petugas/fasilitas`)
- List fasilitas dengan toggle maintenance/active

### 9.4 Halaman Admin

**Dashboard** (`/admin`)
- Statistik: total fasilitas, total user, reservasi bulan ini, laporan bulan ini

**Kelola Fasilitas** (`/admin/fasilitas`)
- Tabel + tombol tambah
- Aksi: edit, nonaktifkan/aktifkan

**Kelola User** (`/admin/users`)
- Tab: "Menunggu Verifikasi" / "Semua User"
- Aksi: verifikasi, tolak, buat user baru (form modal)

**Rekap & Export** (`/admin/rekap`)
- Pilih jenis: okupansi / frekuensi kerusakan
- Filter: rentang tanggal, fasilitas, lokasi
- Tabel rekap
- Tombol export: CSV, Excel, PDF

---

## 10. Auth & Middleware

### 10.1 Mekanisme
- Login → server buat JWT → simpan di **httpOnly cookie**
- Setiap request → middleware baca cookie → verify JWT → inject user info
- Logout → hapus cookie

### 10.2 Route Protection
```
/pengguna/*                → role: pengguna (status: verified)
/petugas/*                 → role: petugas
/admin/*                   → role: admin
/api/reservations (POST)   → role: pengguna
/api/reports (POST)        → role: pengguna
/api/reservations (PATCH)  → role: petugas/pengguna (conditional)
/api/reports (PATCH)       → role: petugas
/api/users/*               → role: admin
/api/facilities (POST/PUT) → role: admin
/api/facilities (PATCH)    → role: petugas/admin
/api/export                → role: admin
```

---

## 11. Validasi

### 11.1 Client-side (Zod + React form)
- Semua form validasi real-time sebelum submit
- Pesan error per field

### 11.2 Server-side (Zod di API route)
- Semua API route validasi input dengan Zod schema
- Return 400 + detail field yang invalid

### 11.3 Validasi Khusus Reservasi (Server)
- `start_time` % 30 === 0
- `end_time` % 30 === 0
- `start_time` >= 07:00
- `end_time` <= 20:00
- `start_time` < `end_time`
- Tanggal >= hari ini
- Fasilitas status === 'active'
- Tidak bentrok dengan reservasi approved lain (saat approve)

---

## 12. Seed Data

### 12.1 User Default
| Nama | Email | Password | Role | Status |
|---|---|---|---|---|
| Administrator | admin@eunomia.ac.id | admin123 | admin | verified |
| Petugas Satu | petugas1@eunomia.ac.id | petugas123 | petugas | verified |
| Budi Santoso | budi@student.ac.id | user123 | pengguna | verified |
| Siti Rahayu | siti@student.ac.id | user123 | pengguna | pending |

### 12.2 Fasilitas Contoh
| Nama | Tipe | Lokasi | Kapasitas | Status |
|---|---|---|---|---|
| Ruang Kelas 101 | ruang_kelas | Gedung A, Lantai 1 | 40 | active |
| Ruang Kelas 202 | ruang_kelas | Gedung A, Lantai 2 | 35 | active |
| Aula Utama | aula | Gedung B, Lantai 1 | 200 | active |
| Lab Komputer 1 | laboratorium | Gedung C, Lantai 1 | 30 | active |
| Lab Fisika | laboratorium | Gedung C, Lantai 2 | 25 | active |
| Proyektor Portable #1 | alat | Gudang Gedung A | 1 | active |
| Lapangan Basket | lapangan | Area Olahraga | 50 | active |

---

## 13. User Story → Implementasi Mapping

| US | Deskripsi | API | Halaman |
|---|---|---|---|
| 1 | Lihat fasilitas + ketersediaan slot | `GET /api/facilities`, `GET /api/facilities/[id]/availability` | `/facilities` |
| 2 | Cari fasilitas | `GET /api/facilities?type=&location=&capacity=` | `/facilities` |
| 3 | Ajukan reservasi | `POST /api/reservations` | `/pengguna/reservasi/buat` |
| 4 | Batalkan reservasi sendiri | `PATCH /api/reservations/[id]` | `/pengguna/reservasi` |
| 5 | Riwayat reservasi | `GET /api/reservations/my` | `/pengguna/reservasi` |
| 6 | Lapor kerusakan | `POST /api/reports`, `POST /api/upload` | `/pengguna/laporan/buat` |
| 7 | Status laporan | `GET /api/reports/my` | `/pengguna/laporan` |
| 8 | Dashboard petugas | `GET /api/reservations?status=pending`, `GET /api/reports?status=new` | `/petugas` |
| 9 | Approve/reject reservasi | `PATCH /api/reservations/[id]` | `/petugas/reservasi` |
| 10 | Cancel reservasi mendesak | `PATCH /api/reservations/[id]` | `/petugas/reservasi` |
| 11 | Update status laporan | `PATCH /api/reports/[id]` | `/petugas/laporan` |
| 12 | Tandai maintenance | `PATCH /api/facilities/[id]` | `/petugas/fasilitas` |
| 13 | Daftarkan petugas | `POST /api/users` | `/admin/users` |
| 14 | Daftarkan pengguna | `POST /api/users` | `/admin/users` |
| 15 | Verifikasi akun | `PATCH /api/users/[id]` | `/admin/users` |
| 16 | Kelola fasilitas | `POST/PUT /api/facilities` | `/admin/fasilitas` |
| 17 | Rekap + export | `GET /api/export` | `/admin/rekap` |
