# Eunomia — Reservasi & Pelaporan Fasilitas Kampus Terpadu

Platform terpusat untuk mahasiswa, dosen, dan staf Fakultas Sains dan Matematika
Universitas Diponegoro (FSM Undip) untuk reservasi fasilitas kampus dan pelaporan
kendala sarana prasarana dalam satu sistem terintegrasi.

## Tujuan

Menggantikan proses peminjaman ruangan manual (catat kertas / chat) dengan sistem
digital yang transparan: ketersediaan slot waktu terlihat jelas, pengajuan tercatat,
dan laporan kerusakan terdokumentasi dengan foto.

## Fitur

**Pengguna (mahasiswa / dosen / staf)**

- Katalog 20 fasilitas kampus: aula, 3 lab komputer, 10 ruang kelas, 3 lapangan
  olahraga, 3 alat elektronik — lengkap dengan foto, lokasi, dan kapasitas
- Reservasi fasilitas dengan slot waktu operasional 07:00–20:00 yang transparan
- Riwayat reservasi + pembatalan mandiri
- Pelaporan kerusakan / kebersihan / keamanan fasilitas disertai foto
- Riwayat laporan + status penanganan

**Petugas**

- Verifikasi (approve / reject) pengajuan reservasi
- Penanganan laporan fasilitas (in_progress / resolved / rejected)
- Update status fasilitas (active / maintenance / inactive)

**Admin**

- Verifikasi akun pengguna baru (pending → verified / rejected)
- CRUD fasilitas + upload foto
- Kelola seluruh pengguna, reservasi, dan laporan
- Rekap data + export Excel / PDF

**Sistem**

- Auth JWT (cookie httpOnly) dengan 3 role: `admin`, `petugas`, `pengguna`
- Proteksi route per role via middleware
- Upload foto laporan (tersimpan di `public/uploads`)

## Teknologi

Next.js 16 (App Router) · React 19 · Prisma 5 · MySQL · Tailwind CSS 4

## Cara Menjalankan

### 1. Syarat

- Node.js 20+
- MySQL berjalan (XAMPP / Laragon / standalone)

### 2. Buat database

```sql
CREATE DATABASE eunomia;
```

### 3. Buat file `.env`

Lihat panduan lengkap di **[ENV.md](./ENV.md)** — di situ dijelaskan variabel apa
saja yang wajib diganti (user MySQL, nama DB, JWT secret).

### 4. Install, migrate, seed, jalan

```powershell
npm install
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Buka http://localhost:3000 di browser.

### 5. Akun bawaan (setelah seed)

| Email | Password | Role |
|---|---|---|
| `admin@eunomia.ac.id` | `admin123` | admin |
| `petugas1@eunomia.ac.id` | `petugas123` | petugas |
| `budi@student.ac.id` | `user123` | pengguna |

Registrasi akun baru berstatus `pending` dan harus diverifikasi admin dulu
sebelum bisa login.
