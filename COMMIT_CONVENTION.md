# Konvensi Commit Message

## Format

```
<type>(<scope>): <subject>

<body> (opsional)
```

## Type

| Type | Kapan Digunakan |
|---|---|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan dokumentasi saja |
| `style` | Perubahan tampilan/UI (bukan logic) |
| `refactor` | Refactor kode tanpa tambah fitur atau fix bug |
| `chore` | Setup, config, dependency, hal teknis non-fitur |
| `test` | Menambah atau memperbaiki test |
| `perf` | Peningkatan performa |

## Scope (Opsional)

Bagian sistem yang diubah:

| Scope | Keterangan |
|---|---|
| `auth` | Login, register, logout, middleware |
| `facility` | CRUD fasilitas, ketersediaan slot |
| `reservation` | Reservasi (create, approve, cancel, dll) |
| `report` | Laporan kerusakan |
| `admin` | Panel admin (user management, rekap, export) |
| `ui` | Komponen UI umum (Button, Modal, Table, dll) |
| `db` | Database, schema, migration, seed |
| `api` | API route umum |
| `layout` | Navbar, Sidebar, Footer, layout |

## Rules

- Subject ditulis **bahasa Indonesia**, huruf kecil, tanpa titik di akhir
- Maksimal **72 karakter** untuk baris pertama
- Gunakan kata kerja imperatif: "tambah", "perbaiki", "ubah", "hapus" (bukan "menambahkan" atau "ditambahkan")
- Body opsional — gunakan jika perlu penjelasan tambahan

## Contoh

```bash
# Fitur baru
git commit -m "feat(auth): tambah halaman login dan register"
git commit -m "feat(reservation): tambah form buat reservasi dengan slot picker"
git commit -m "feat(report): tambah upload foto pada form laporan"
git commit -m "feat(admin): tambah export rekap ke CSV dan PDF"
git commit -m "feat(facility): tambah filter fasilitas berdasarkan tipe dan lokasi"

# Bug fix
git commit -m "fix(reservation): perbaiki validasi slot waktu tidak kelipatan 30 menit"
git commit -m "fix(auth): perbaiki redirect setelah login gagal"
git commit -m "fix(ui): perbaiki tombol approve tidak muncul di mobile"

# Style / UI
git commit -m "style(ui): sesuaikan warna button dengan design system"
git commit -m "style(layout): perbaiki spacing sidebar sesuai DESIGN.md"

# Refactor
git commit -m "refactor(api): pisahkan validasi reservasi ke file terpisah"
git commit -m "refactor(auth): ganti auth context ke server component"

# Chore / Setup
git commit -m "chore(db): setup prisma dan buat initial migration"
git commit -m "chore: install dependency bcryptjs, jose, zod"
git commit -m "chore: tambah commit convention ke COMMIT_CONVENTION.md"

# Docs
git commit -m "docs: tambah PRD dan planning"
git commit -m "docs: update PLANNING.md fase 1 selesai"

# Test
git commit -m "test(reservation): tambah test validasi slot waktu"

# Performa
git commit -m "perf(facility): tambah index pada query ketersediaan slot"
```

## Commit Pertama (saat ini)

```bash
git add -A
git commit -m "chore: setup project planning (PRD, design system, ai rules)"
```
