# Panduan Environment Variable Eunomia

## Pengaturan Awal

Untuk menjalankan program Eunomia, kamu perlu membuat file `.env` di root folder proyek dan mengisi konfigurasi berikut.

---

## File `.env`

Buat file baru bernama **`.env`** (tanpa ekstensi) di root folder `Project-PPK`, lalu isi dengan:

```env
DATABASE_URL="mysql://DB_USER:DB_PASS@localhost:3306/DB_NAME"
JWT_SECRET="GANTI_MIN_16_KARAKTER_ACAK"
```

### Bagian wajib diganti

1. **`DB_USER`** → username MySQL kamu (umum: `root`)
2. **`DB_PASS`** → password MySQL kamu (kosongkan jika tanpa password: `root@`)
3. **`DB_NAME`** → nama database (wajib buat dulu: `eunomia`)
4. **`JWT_SECRET`** → string acak bebas, min 16 karakter, contoh: `abc123XYZ...`

### Penjelasan Variabel

1. **`DATABASE_URL`** – URL koneksi ke database MySQL
   - Format: `mysql://USER:@HOST:PORT/NAMA_DB`
   - Ganti `root:` jika username DB bukan `root`
   - Pastikan database bernama **eunomia** sudah dibuat dulu

2. **`JWT_SECRET`** – Kunci untuk enkripsi token login
   - Gunakan string panjang acak (minimal 16 karakter)
   - Jangan share secrets ini ke orang lain

3. **`NODE_ENV`** – Mode Node.js (`development` atau `production`)
   - Untuk development pakai `development`

---

## Cara Membuat Database

```sql
-- Login MySQL via command line
mysql -u root -p

-- Buat database eunomia
CREATE DATABASE eunomia;

-- Keluar
EXIT;
```

Atau via phpMyAdmin, buat database baru dengan nama **eunomia**.

---

## Setup Program Step by Step

Ikuti langkah-langkah ini secara berurutan:

1. **Clone/Extract ZIP** → buka folder `Project-PPK-main`
2. **Buat file `.env`** → isi sesuai template di atas
3. **Install dependency**:  
   ```powershell
   npm install
   ```
4. **Jalankan migration & seed database**:  
   ```powershell
   npx prisma migrate deploy
   npx prisma db seed
   ```
5. **Start development server**:  
   ```powershell
   npm run dev
   ```
6. **Akses aplikasi**:  
   Buka browser → http://localhost:3000

---

## Akun Default setelah Seed

Setelah jalankan `npx prisma db seed`, akun berikut otomatis dibuat:

| Nama              | Email                          | Password | Role       |
|-------------------|--------------------------------|----------|------------|
| Administrator     | admin@eunomia.ac.id            | admin123 | admin      |
| Petugas Satu      | petugas1@eunomia.ac.id         | petugas123 | petugas    |
| Budi Santoso      | budi@student.ac.id             | user123  | pengguna   |
| Siti Rahayu       | siti@student.ac.id             | user123  | pengguna   |

Semua status akun adalah **verified** (siap login).

---

## Verifikasi Berhasil

Jika sukses, terminal akan menampilkan:

```
Seed completed: 20 facilities created.
🚀 Ready in Xms
```

Dan browser menunjukkan halaman login Eunomia.

---

## Troubleshooting

### Error `DATABASE_URL tidak valid`

- Pastikan service MySQL aktif
- Cek username/password akses database benar
- Pastikan port 3306 terbuka

### Error `Module not found @/app/model/db`

- Jalankan `npm install` ulang
- Delete `node_modules` dan `package-lock.json`, instal ulang

### Server tidak jalan `Port 3000 sudah dipakai`

- Tutup semua instance Next.js lainnya
- Atau ganti port dengan edit `next.config.ts` (opsional)

---

## Catatan Keamanan

- Simpan file `.env` di tempat aman, jangan upload ke public GitHub
- Jika accidentally ter-upload, segera ubah `JWT_SECRET` dan rotate credential

---

© Eunomia Project – Undip FSM Facility Reservation System
