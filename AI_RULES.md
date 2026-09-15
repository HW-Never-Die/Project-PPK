# AI Rules — Eunomia Development

> Rules ini WAJIB dipatuhi oleh semua AI agent yang mengerjakan project ini.

---

## 1. Source of Truth

- **PRD.md** adalah sumber kebenaran untuk fitur, aturan bisnis, database schema, API, dan halaman.
- **DESIGN.md** adalah sumber kebenaran untuk design system (warna, tipografi, spacing, komponen, layout).
- **PLANNING.md** adalah sumber kebenaran untuk tahapan pengembangan dan tracking progress.
- **AI_RULES.md** (file ini) adalah sumber kebenaran untuk aturan pengembangan.
- Jangan berasumsi tanpa berlandaskan dokumen-dokumen ini. Jika informasi tidak ada di dokumen, **tanyakan ke user**.

---

## 2. Sebelum Mulai Mengerjakan

- Baca **PRD.md**, **DESIGN.md**, **AI_RULES.md**, dan **PLANNING.md** terlebih dahulu.
- Pahami konteks fitur yang akan dikerjakan dan hubungannya dengan fitur lain.
- Jika ada instruksi yang ambigu atau membingungkan, **langsung tanyakan ke user** — jangan asumsikan.

---

## 3. Saat Mengerjakan

### 3.1 Kode
- Ikuti konvensi kode yang sudah ada di codebase (style, naming, pattern).
- Gunakan library yang sudah ter-install. Jangan tambah dependency baru tanpa konfirmasi user.
- Semua UI harus mengikuti design system di **DESIGN.md** (warna, radius, font, spacing, komponen).
- Jangan tambahkan komentar di kode kecuali diminta user.
- Jangan buat abstraksi yang belum dibutuhkan (YAGNI).
- Jangan buat file baru jika bisa mengedit file yang sudah ada.

### 3.2 Testing & Verifikasi
- Setiap selesai membuat/mengubah sesuatu, **lakukan testing** (jalankan build, lint, atau test yang relevan).
- Jika ada error, **langsung fix** sebelum melanjutkan ke task berikutnya.
- Jangan anggap task selesai sebelum diverifikasi berjalan tanpa error.

### 3.3 Validasi
- Semua form penting harus punya validasi **client-side DAN server-side** (menggunakan Zod).
- Validasi slot waktu reservasi (kelipatan 30 menit, jam 07:00-20:00) WAJIB di server.
- Cek bentrok reservasi WAJIB di server saat approve.

---

## 4. Git & Version Control

### 4.1 Jangan Push Dokumen Acuan
File-file berikut **TIDAK BOLEH** di-push ke repository:
- `PRD.md`
- `DESIGN.md`
- `AI_RULES.md`
- `PLANNING.md`
- `AGENTS.md` (jika ada)

File-file ini sudah ditambahkan ke `.gitignore`.

### 4.2 Commit
- Jangan commit kecuali user secara eksplisit meminta.
- Tulis commit message yang jelas dan sesuai konteks perubahan.
- Jangan commit file secret (`.env`, key, password).

---

## 5. Komunikasi

- Jika ada **konflik** antara instruksi user dan dokumen acuan, **tanyakan ke user** mana yang benar.
- Jika menemukan **bug atau inkonsistensi** di dokumen acuan, laporkan ke user.
- Jangan memberikan penjelasan panjang yang tidak diminta. Langsung kerjakan.
- Jika task terlalu besar, pecah jadi sub-task dan konfirmasi prioritas ke user.

---

## 6. Design System (Ringkasan dari DESIGN.md)

Referensi cepat — detail lengkap ada di DESIGN.md:

- **Canvas:** Sandy Desk `#e1d7c2` (BUKAN pure white/gray)
- **Card/Window:** Paper White `#ffffff`, border `1px solid #bfc1b7`, radius `4px` (card) / `6px` (window)
- **Text:** Deep Moss `#23251d` (BUKAN pure black)
- **Primary CTA:** Amber Glow `#eb9d2a`, radius `4px`
- **Active/Link:** Signal Blue `#2f80fa`
- **Status tag:** Tag Pill dengan radius `9999px` (HANYA untuk tag kecil)
- **Font heading/body:** Open Runde (atau Inter Tight / DM Sans sebagai substitute)
- **Font UI/nav:** IBM Plex Sans Variable (atau Inter sebagai substitute)
- **JANGAN** pakai drop shadow pada card/window
- **JANGAN** pakai border-radius > 6px pada container
- **JANGAN** pakai pure black `#000000` untuk text

---

## 7. Urutan Prioritas Pengerjaan

Ikuti fase di PLANNING.md:
1. Foundation (DB, Prisma, seed)
2. Authentication (JWT, middleware, login/register)
3. Fasilitas (CRUD, ketersediaan slot, halaman publik)
4. Reservasi (create, validasi slot, cek bentrok, halaman pengguna & petugas)
5. Laporan (create, upload foto, halaman pengguna & petugas)
6. Admin Panel (kelola user, dashboard, rekap, export)
7. Polish (landing page, responsive, error handling)

Jangan loncat fase kecuali diminta user.

---

## 8. Checklist Sebelum Menandai Task Selesai

- [ ] Kode berjalan tanpa error (build & lint pass)
- [ ] Validasi client + server sudah ada untuk form yang relevan
- [ ] UI sesuai DESIGN.md
- [ ] Fitur sesuai spesifikasi di PRD.md
- [ ] Tidak ada secret/credential yang ter-expose
- [ ] Tidak ada dependency baru yang ditambah tanpa konfirmasi
