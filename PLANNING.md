# PLANNING — Tahapan Pengembangan & Tracking

> Tracking progress pengembangan. Update file ini setiap fase/task selesai.
> Detail fitur dan spesifikasi ada di **PRD.md**. Design system di **DESIGN.md**. Rules di **AI_RULES.md**.

---

## Fase 1: Foundation ✅
- [x] Install Prisma + `@prisma/client`
- [x] Setup `prisma/schema.prisma` (MySQL, 4 tabel: users, facilities, reservations, reports)
- [x] Konfigurasi `.env` (DATABASE_URL)
- [x] Jalankan `prisma migrate dev`
- [x] Buat `lib/db.ts` (Prisma client singleton)
- [x] Buat `prisma/seed.ts` (user default + fasilitas contoh)
- [x] Jalankan seed
- [x] Setup design tokens di `globals.css` (dari DESIGN.md — Tailwind v4 `@theme`)
- [ ] Install font (Open Runde / DM Sans substitute, IBM Plex Sans)

## Fase 2: Authentication ⬜
- [ ] Install `bcryptjs`, `jose`, `zod`
- [ ] Buat `lib/auth.ts` (JWT sign/verify, cookie helpers)
- [ ] Buat `lib/validations/auth.ts` (Zod schema login/register)
- [ ] Buat `lib/constants.ts` (enum values, slot waktu)
- [ ] API: `POST /api/auth/register`
- [ ] API: `POST /api/auth/login`
- [ ] API: `POST /api/auth/logout`
- [ ] API: `GET /api/auth/me`
- [ ] Buat `middleware.ts` (route protection by role)
- [ ] Halaman: `/login`
- [ ] Halaman: `/register`
- [ ] Auth context (client-side user state)

## Fase 3: Fasilitas ⬜
- [ ] Buat `lib/validations/facility.ts`
- [ ] API: `GET /api/facilities` (list + filter)
- [ ] API: `GET /api/facilities/[id]` (detail)
- [ ] API: `GET /api/facilities/[id]/availability` (slot per tanggal)
- [ ] API: `POST /api/facilities` (admin create)
- [ ] API: `PUT /api/facilities/[id]` (admin edit)
- [ ] API: `PATCH /api/facilities/[id]` (update status)
- [ ] Komponen: FacilityCard, FacilityFilter, SlotGrid
- [ ] Halaman publik: `/facilities` (daftar + filter + search)
- [ ] Halaman admin: `/admin/fasilitas` (CRUD)
- [ ] Halaman admin: `/admin/fasilitas/[id]` (edit)

## Fase 4: Reservasi ⬜
- [ ] Buat `lib/validations/reservation.ts` (termasuk validasi slot 30 menit)
- [ ] API: `POST /api/reservations` (create + validasi server)
- [ ] API: `GET /api/reservations` (list untuk petugas/admin)
- [ ] API: `GET /api/reservations/my` (riwayat pengguna)
- [ ] API: `GET /api/reservations/[id]` (detail)
- [ ] API: `PATCH /api/reservations/[id]` (approve/reject/cancel + cek bentrok)
- [ ] Komponen: ReservationForm, ReservationTable
- [ ] Halaman: `/pengguna/reservasi/buat`
- [ ] Halaman: `/pengguna/reservasi` (riwayat)
- [ ] Halaman: `/petugas/reservasi` (kelola)

## Fase 5: Laporan Kerusakan ⬜
- [ ] Buat `lib/validations/report.ts`
- [ ] API: `POST /api/upload` (upload foto)
- [ ] API: `POST /api/reports` (create)
- [ ] API: `GET /api/reports` (list untuk petugas/admin)
- [ ] API: `GET /api/reports/my` (riwayat pengguna)
- [ ] API: `GET /api/reports/[id]` (detail)
- [ ] API: `PATCH /api/reports/[id]` (update status + resolusi)
- [ ] Komponen: ReportForm, ReportTable
- [ ] Halaman: `/pengguna/laporan/buat`
- [ ] Halaman: `/pengguna/laporan` (riwayat)
- [ ] Halaman: `/petugas/laporan` (kelola)
- [ ] Halaman: `/petugas/fasilitas` (toggle maintenance)

## Fase 6: Admin Panel ⬜
- [ ] API: `GET /api/users` (list)
- [ ] API: `POST /api/users` (create pengguna/petugas)
- [ ] API: `PATCH /api/users/[id]` (verify/reject)
- [ ] Halaman: `/admin/users` (kelola user + verifikasi)
- [ ] Halaman: `/petugas` (dashboard)
- [ ] Halaman: `/admin` (dashboard)
- [ ] Install `papaparse`, `exceljs`, `jspdf` + `jspdf-autotable`
- [ ] API: `GET /api/export` (CSV/Excel/PDF)
- [ ] Halaman: `/admin/rekap` (rekap + export)

## Fase 7: Polish ⬜
- [ ] Landing page (`/`) sesuai design system
- [ ] Komponen layout: Navbar, Sidebar, Footer
- [ ] Dashboard layout (`(dashboard)/layout.tsx`)
- [ ] Responsive design
- [ ] Loading states & error handling
- [ ] Testing manual semua 17 user story
- [ ] Final review UI vs DESIGN.md
