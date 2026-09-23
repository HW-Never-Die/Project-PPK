# Design System & Guidelines (Website Kampus)

Dokumen ini berisi panduan desain (UI/UX) untuk pengembangan sistem pelaporan kampus. Desain diadaptasi dengan gaya modern, bersih, dan menggunakan layout berbasis top-navbar.

## 1. Color Palette

### Backgrounds
- **Global Background**: `#eeefe9` (Light grayish beige)
- **Surface / Card Background**: `#ffffff` (White)
- **Navbar Background**: `#e7e0da` (dengan opacity 80% + backdrop blur)
- **Table Header Background**: `#fdfdf8`

### Text Colors
- **Primary Text (Heading / Active)**: `#111827` atau `#23251d` (Dark Gray/Black)
- **Secondary Text (Subtitle / Inactive)**: `#4B5563` atau `#65675e` (Gray)

### Accents & Borders
- **Primary Accent (Buttons/Actions)**: `#eb9d2a` (Orange/Yellow)
- **Secondary Accent (Links/Icons)**: `#2f80fa` (Blue)
- **Borders (Cards, Inputs, Dividers)**: `#d1d5db`, `#bfc1b7`, atau `#E5E7EB`

---

## 2. Typography

Menggunakan font Sans-serif bawaan (serta `IBM Plex Sans Variable` pada beberapa komponen).

- **Page Title (H1)**
  - Size: `24px`
  - Weight: `800` (Extra Bold)
  - Color: `#111827`
  - Letter Spacing: `-0.5px`
- **Page Subtitle / Description**
  - Size: `16px`
  - Weight: `500` (Medium)
  - Color: `#4B5563`
- **Body / Table Data**
  - Size: `12px` - `14px`
  - Weight: `400` / `500`

---

## 3. Layout Structure

- **Navbar**: Posisi `sticky top-0 z-50`. Berada di dalam wrapper dengan padding, memusat, memiliki shadow ringan `[0_4px_12px_rgba(0,0,0,0.1)]` dan border `#d1d5db`.
- **Main Container**: `max-w-6xl mx-auto p-6`. Membatasi lebar konten agar tidak terlalu lebar di layar besar.
- **Card Wrapper (Dashboard Layout)**: Konten setiap halaman dibungkus dalam wadah putih:
  - Background: `bg-white` (`#ffffff`)
  - Border: `border border-[#d1d5db]`
  - Corner: `rounded-lg` (radius ~8px)
  - Shadow: `shadow-sm`
  - Padding: `p-6`

---

## 4. Components

### A. Buttons
- **Primary Action (Kirim, Buat Laporan)**:
  - Background: `#eb9d2a`
  - Text: `#23251d`
  - Border Radius: `4px`
  - Padding: `6px 14px` (atau sejenisnya)
  - Hover/Disabled state: Opacity turun atau berubah ke abu-abu (`#9ea096`).
- **Tab Navigation (Filter Laporan)**:
  - Inactive: Text `#6B7280`, Border bawah transparan.
  - Active: Text `#111827`, Font weight `700`, Border bawah `2px solid #111827`.

### B. Inputs & Selects (Forms)
- **Container**: `border 1px solid #bfc1b7`, `border-radius 4px`, `bg-white`.
- **Padding**: `6px 10px`.
- **Text**: `13px` / `14px`, warna `#23251d`.

### C. Tables
- **Header (`<thead>`)**: Background `#fdfdf8`, border bottom `#bfc1b7`, text bold/medium warna `#65675e`.
- **Row (`<tbody>`)**: Background `#ffffff`, border bottom `#eeefe9` antar baris. Text utama warna `#23251d`.
- **Thumbnail Foto**: Dimensi `100x70px`, `object-cover`, border abu-abu tipis, `rounded`.
