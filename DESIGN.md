# Design System & Guidelines (Eunomia OS — Website Kampus)

Dokumen ini berisi panduan desain (UI/UX) untuk **seluruh fitur** sistem kampus (Reservasi, Fasilitas, Laporan, dll). Diadaptasi dari implementasi fitur Reservasi sebagai referensi utama. Semua fitur baru **wajib** mengikuti token dan pola di bawah ini agar konsisten.

---

## 1. Color Palette

### 1.1 Backgrounds

| Token                 | Hex / Value               | Penggunaan                                                    |
| --------------------- | ------------------------- | ------------------------------------------------------------- |
| Global Background     | `#eeefe9`                 | Background halaman utama                                      |
| Surface / Card        | `#ffffff`                 | Card, form section, modal body, reservation row, input bg     |
| Section Surface       | `#fdfdf8`                 | Hero card, modal header/footer, stat card default, detail grid |
| Breadcrumb / Tab Bar  | `#f5f5f0`                 | Breadcrumb bar, tab container, icon bg netral, disabled slot  |
| Navbar                | `#e7e0da` (opacity 80%)   | Navbar + backdrop blur                                        |
| Summary Header        | `#23251d`                 | Header ringkasan (teks putih di atas bg gelap)                |
| Modal Overlay         | `rgba(0,0,0,0.35)`       | Backdrop modal + `backdrop-filter: blur(3px)`                 |

### 1.2 Text Colors

| Token          | Hex       | Penggunaan                                         |
| -------------- | --------- | -------------------------------------------------- |
| Near-black     | `#111827` | Heading H1                                         |
| Charcoal       | `#23251d` | Primary text, heading, breadcrumb aktif, stat value |
| Body Dark      | `#4B5563` | Subtitle / deskripsi halaman                       |
| Body Medium    | `#4d4f46` | Teks tombol netral, modal body, policy text        |
| Sage Gray      | `#65675e` | Breadcrumb, stat label, detail cell label, secondary |
| Muted          | `#9ea096` | Placeholder, disabled text, icon muted             |
| Placeholder    | `#b3b3af` | Fallback icon, disabled slot text                  |
| White          | `#ffffff` | Teks di atas bg gelap                              |

### 1.3 Accents & Brand

| Token            | Hex                        | Penggunaan                                        |
| ---------------- | -------------------------- | ------------------------------------------------- |
| Marigold         | `#eb9d2a`                  | Primary button, aksen utama, breadcrumb dot       |
| Marigold Hover   | `#df9323`                  | Hover primary button                              |
| Marigold Border  | `#d88c22`                  | Border primary button                             |
| Marigold Shadow  | `#b17816`                  | Box-shadow primary button, tag text, slot selected |
| Dark Amber       | `#cd8407`                  | Pending stat value                                |
| Amber Text       | `#b27d00`                  | Pending status text (detail)                      |
| Amber Light BG   | `rgba(235,157,42,0.12)`    | Badge bg, icon bg, time chip bg                   |
| Amber Border     | `rgba(235,157,42,0.25)`    | Warning banner border                             |
| Moss Green       | `#6aa84f`                  | Approved border/pill                              |
| Dark Green       | `#3d7a1c`                  | Approved stat value, success text                 |
| Green BG         | `rgba(106,168,79,0.12)`    | Approved icon bg, success circle                  |
| Flame Orange     | `#f54e00`                  | Rejected / danger text, danger button bg          |
| Flame Light BG   | `rgba(245,78,0,0.08)`      | Rejected icon bg                                  |
| Flame Border     | `rgba(245,78,0,0.25)`      | Error border, danger btn border                   |
| Signal Blue      | `#2f80fa`                  | Status "new" pill                                 |

### 1.4 Status Colors

Digunakan untuk **TagPill** (solid mode) di seluruh fitur:

| Status         | Background  | Text      |
| -------------- | ----------- | --------- |
| pending        | `#eb9d2a`   | `#23251d` |
| approved       | `#6aa84f`   | `#ffffff` |
| rejected       | `#f54e00`   | `#ffffff` |
| cancelled      | `#9ea096`   | `#ffffff` |
| new            | `#2f80fa`   | `#ffffff` |
| in_progress    | `#eb9d2a`   | `#23251d` |
| resolved       | `#6aa84f`   | `#ffffff` |
| active         | `#6aa84f`   | `#ffffff` |
| maintenance    | `#eb9d2a`   | `#23251d` |
| inactive       | `#9ea096`   | `#ffffff` |
| verified       | `#6aa84f`   | `#ffffff` |
| default        | `#e5e7e0`   | `#4d4f46` |

Status colors untuk **reason box / detail** (translucent):

| Status    | BG                          | Text      | Border                        |
| --------- | --------------------------- | --------- | ----------------------------- |
| pending   | `rgba(235,157,42,0.1)`     | `#b27d00` | `rgba(235,157,42,0.3)`       |
| approved  | `rgba(106,168,79,0.1)`     | `#3d7a1c` | `rgba(106,168,79,0.3)`       |
| rejected  | `rgba(245,78,0,0.08)`      | `#f54e00` | `rgba(245,78,0,0.25)`        |
| cancelled | `rgba(158,160,150,0.1)`    | `#65675e` | `rgba(158,160,150,0.3)`      |

### 1.5 Borders

| Token          | Value       | Penggunaan                            |
| -------------- | ----------- | ------------------------------------- |
| Default        | `#e5e7e0`   | Card/section border, stat card inaktif |
| Medium         | `#d1d5db`   | Hero card, form card, neutral button   |
| Input          | `#bfc1b7`   | Input/textarea, window control         |
| Neutral Shadow | `#d1d1c9`   | Box-shadow neutral button              |
| Separator      | `#eeefe9`   | Divider antar row                      |

---

## 2. Typography

### 2.1 Font Families

| Token    | Value                                         | Penggunaan                             |
| -------- | --------------------------------------------- | -------------------------------------- |
| Display  | `'Open Runde', sans-serif`                    | Heading (H1-H3), stat value, nama item |
| Sans     | `'IBM Plex Sans Variable', sans-serif`        | Body text, label, button, input        |
| Mono     | `'Source Code Pro', ui-monospace, monospace`   | Kode ID (RES-#), time range, counter   |

### 2.2 Font Sizes

| Penggunaan              | Size   |
| ----------------------- | ------ |
| Badge kecil / DRAFT     | `10px` |
| Tag, legend, stat label | `11px` |
| Breadcrumb, tab, body   | `12px` |
| Input, label, body      | `13px` |
| Subtitle, body          | `14px` |
| Card title, modal title | `15px` |
| Stat value              | `17px` |
| Success title           | `20px` |
| Page title (H1)         | `22px` |

### 2.3 Font Weights

| Weight | Penggunaan                                      |
| ------ | ----------------------------------------------- |
| `400`  | Body text, deskripsi                            |
| `500`  | Breadcrumb aktif, tab inaktif, slot available   |
| `600`  | Label, button, tab aktif, breadcrumb link       |
| `700`  | Stat value, heading, step number, mono tags     |
| `800`  | H1 (Page Title)                                 |

### 2.4 Letter Spacing

| Value    | Penggunaan                               |
| -------- | ---------------------------------------- |
| `-0.5px` | H1                                       |
| `0.2px`  | RES-# tag                                |
| `0.3px`  | Uppercase badge, detail section label    |
| `0.4px`  | Summary header                           |

### 2.5 Line Height

`1.4` (compact text), `1.5` (body), `1.6` (textarea / long text)

### 2.6 Text Transform

`uppercase` — badge, detail cell label, summary header, facility type label.

---

## 3. Layout Structure

### 3.1 Global Layout

- **Navbar**: `sticky top-0 z-50`, shadow `0 4px 12px rgba(0,0,0,0.1)`, border `#d1d5db`.
- **Main Container**: `max-w-6xl mx-auto p-6`.
- **Page Wrapper**: `display: flex; flex-direction: column; gap: 18px`.

### 3.2 Grid Patterns

| Pola                   | CSS                                              | Penggunaan        |
| ---------------------- | ------------------------------------------------ | ----------------- |
| Stat Card Grid         | `repeat(auto-fit, minmax(190px, 1fr))`, gap `10px` | Stats dashboard |
| Form Grid              | `1.25fr 0.75fr`, gap `20px` (< 880px: 1 col)    | Formulir          |
| Detail Grid (modal)    | `1fr 1fr`, gap `10px`                            | Detail modal      |
| Slot Grid              | `repeat(auto-fill, minmax(105px, 1fr))`, gap `6px` | Time slot picker |

### 3.3 Container Widths

| Komponen         | Max Width |
| ---------------- | --------- |
| Hero text        | `620px` – `680px` |
| Search input     | `340px` (min `240px`, flex `1 1 240px`) |
| Modal (kecil)    | `460px` |
| Modal (sedang)   | `480px` |
| Modal (besar)    | `540px` |
| Modal max-height | `calc(100vh - 80px)` atau `90vh` |
| Table container  | `minHeight: 560px` |

---

## 4. Components

### 4.1 Breadcrumb Bar

- BG: `#f5f5f0`, border `1px solid #e5e7e0`, radius `6px`, padding `6px 12px`.
- Font: `12px` IBM Plex Sans, color `#65675e`.
- Link aktif: `#23251d`, weight `600`. Current page: `#23251d`, weight `500`.
- Dot indicator: `8px` circle, bg `#eb9d2a`.
- Window controls (dekoratif): `10px` square, radius `2px`, border `1px solid #bfc1b7`.

### 4.2 Stat Cards

- BG default: `#fdfdf8`. BG aktif: warna status spesifik (misal `#fdfaf3` pending, `#f6faf3` approved, `#fef8f6` rejected).
- Border: `1px solid #e5e7e0` (inaktif) / `1.5px solid <statusColor>` (aktif).
- Radius `8px`, padding `12px 14px`, gap `12px`.
- Icon box: `36px` square, radius `6px`, bg status color 12% opacity.
- Label: `11px`, weight `500`, `#65675e`, IBM Plex.
- Value: `17px`, weight `700`, Open Runde, warna status.
- Grid: `repeat(auto-fit, minmax(190px, 1fr))`, gap `10px`.

### 4.3 Tab Bar

- Container: BG `#f5f5f0`, padding `3px`, radius `6px`, border `1px solid #e5e7e0`, gap `4px`.
- Tab button: padding `5px 12px`, `12px`, radius `4px`.
- **Aktif**: bg `#ffffff`, weight `600`, color `#23251d`, shadow `0 1px 2px rgba(0,0,0,0.06)`.
- **Inaktif**: bg `transparent`, weight `500`, color `#65675e`.
- Animasi konten: `reservationTabFade` — `0.16s cubic-bezier(0.16, 1, 0.3, 1)` (opacity 0→1, translateY 3px→0).

### 4.4 Buttons

#### Primary (CTA)

- BG `#eb9d2a`, color `#23251d`, border `1px solid #d88c22`, radius `6px`.
- Font `13px`, weight `600`, IBM Plex, padding `7px 16px`.
- Shadow `0 2.5px 0 0 #b17816`.
- Hover: bg `#df9323`.
- Press effect: `top: 0 → 1.5px`, shadow → `none`.

#### Neutral (Secondary)

- BG `#ffffff`, color `#4d4f46`, border `1px solid #d1d5db`, radius `6px`.
- Shadow `0 2px 0 0 #d1d1c9`.
- Hover: bg `#f5f5f0`, borderColor `#bfc1b7`.
- Press effect: sama dengan primary.

#### Danger

- BG `#fef2f2`, color `#f54e00`, border `1px solid rgba(245,78,0,0.25)`, radius `6px`.
- Shadow `0 2px 0 0 rgba(245,78,0,0.25)`.
- Hover: bg `#fee2e2`.

#### Ghost

- BG `transparent`, color `#65675e`, border `1px solid transparent`.
- Hover: bg `#f5f5f0`.

#### Disabled State (semua varian)

- BG `#d1d5db` atau `#e5e7e0`, color `#9ea096`, cursor `not-allowed`, shadow `none`.

#### Physical Press Pattern (wajib untuk semua tombol non-ghost)

```
Default  → top: 0px,   boxShadow: <value>
Hover    → bg berubah
MouseDown → top: 1.5px, boxShadow: none
MouseUp  → top: 0px,   boxShadow: <value>
```

### 4.5 Search Input

- Full-width, padding `7px 10px 7px 30px` (ruang ikon kiri).
- BG `#ffffff`, border `1px solid #bfc1b7`, radius `6px`, `13px`.
- Icon: absolute left `10px`, color `#9ea096`, `14px`.
- Clear button: absolute right `8px`, color `#9ea096`.

### 4.6 Form Inputs & Textarea

- Padding `9px 12px`, border `1px solid #bfc1b7`, radius `6px`, `13px`.
- BG `#ffffff`, color `#23251d`, transition `border-color 0.15s ease`.
- Label: `13px`, weight `600`, color `#23251d`, marginBottom `6px`.
- Textarea: padding `8px 12px`, lineHeight `1.5`, resize `vertical`.

### 4.7 Modals

- **Overlay**: fixed inset `0`, bg `rgba(0,0,0,0.35)`, z-index `100`, backdrop `blur(3px)`, padding `24px 16px`.
- **Card**: bg `#ffffff`, radius `10px` (kecil) atau `12px` (detail), maxWidth sesuai konteks.
- **Header**: bg `#fdfdf8`, padding `14px 20px`, borderBottom `1px solid #e5e7e0`.
  - Title: `15px`, weight `700`, Open Runde, color `#23251d`.
- **Body**: padding `16px 20px`.
- **Footer**: bg `#fdfdf8`, padding `12px 20px`, borderTop `1px solid #e5e7e0`.
- **Close button**: bg none, border none, color `#65675e`, padding `4px`, radius `4px`.
- Shadow: `0 18px 45px rgba(0,0,0,0.15)` (standar) atau `0 20px 50px rgba(0,0,0,0.15)` (detail).

### 4.8 TagPill (Status Pill)

- Radius `9999px`, padding `2px 8px`, `12px`, IBM Plex.
- Warna sesuai tabel Status Colors di §1.4.

### 4.9 Data Row / List Card

- BG `#ffffff`, border `1px solid #e5e7e0`, radius `8px`, padding `16px 18px`.
- Shadow default: `0 1px 2px rgba(0,0,0,0.02)`.
- Hover: borderColor `#bfc1b7`, shadow `0 3px 10px rgba(0,0,0,0.04)`.
- Image: `100px × 80px`, radius `6px`, bg `#f5f5f0`, border `1px solid #e5e7e0`.
- Title: `15px`, weight `700`, Open Runde.
- Metadata: `12px`, color `#65675e`, gap `12px`.
- Snippet row: bg `#fdfdf8`, padding `6px 10px`, radius `6px`, border `1px solid #e5e7e0`, line-clamp `2`.

### 4.10 Detail Cell (dalam modal / detail view)

- Label: `11px`, weight `600`, color `#65675e`, uppercase, IBM Plex, letterSpacing `0.3px`.
- Value: `13px`, weight `600`, color `#23251d`, IBM Plex (atau Source Code Pro jika mono).

### 4.11 Warning / Policy Banner

- BG `#fdfaf3`, border `1px solid rgba(235,157,42,0.25)`, radius `6px`, padding `10px 14px`.
- Icon box: `24px` square, radius `4px`, bg `rgba(235,157,42,0.15)`, color `#b17816`.
- Text: `13px`, color `#4d4f46`, lineHeight `1.4`.
- Dismiss: color `#9ea096`.

### 4.12 Error Banner

- BG `#fef2f2`, border `1px solid rgba(245,78,0,0.25)`, radius `6px`, padding `10px 14px`.
- Color `#f54e00`, `13px`.

### 4.13 ID Tag (kode unik)

- Font: `11px`, weight `700`, Source Code Pro.
- Color `#b17816`, bg `rgba(235,157,42,0.1)`, padding `1px 6px`, radius `4px`, letterSpacing `0.2px`.

### 4.14 Category Badge (uppercase)

- `11px`, weight `600`, uppercase, IBM Plex.
- BG `rgba(235,157,42,0.12)`, color `#b17816`, padding `2px 8px`, radius `4px`, letterSpacing `0.3px`.

### 4.15 Summary Card (sticky sidebar)

- Radius `8px`, border `1px solid #d1d5db`, shadow `0 2px 8px rgba(0,0,0,0.04)`.
- Sticky: `top: 80px`.
- Header: bg `#23251d`, color `#ffffff`, padding `12px 16px`, `12px`, weight `700`, letterSpacing `0.4px`, uppercase.
- Dividers: `1px dashed #e5e7e0`.

### 4.16 Success State Card

- BG `#ffffff`, radius `8px`, border `1px solid #d1d5db`, shadow `0 4px 16px rgba(0,0,0,0.04)`.
- Padding `48px 32px`, maxWidth `540px`, centered.
- Icon: `56px` circle, bg `rgba(106,168,79,0.12)`, color `#3d7a1c`.
- Title: `20px`, weight `700`, Open Runde.

### 4.17 Empty State

- Padding `48px 24px`, text centered.
- Icon container: `48px` square, radius `12px`, bg `#f5f5f0`, border `1px solid #e5e7e0`.
- Title: `14px`, weight `600`, color `#23251d`.
- Description: `13px`, color `#65675e`.

---

## 5. Transitions & Animations

### 5.1 Transitions

| Value                       | Penggunaan                         |
| --------------------------- | ---------------------------------- |
| `all 0.1s ease`             | Button, slot chip                  |
| `all 0.15s ease`            | Stat card, tab, form submit, modal |
| `border-color 0.15s ease`   | Form input                         |

### 5.2 Tab Content Animation

```css
@keyframes reservationTabFade {
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* duration: 0.16s, easing: cubic-bezier(0.16, 1, 0.3, 1) */
```

### 5.3 Accessibility

- Semua animasi dekoratif (cloud, parallax, beacon) harus dihentikan jika `prefers-reduced-motion: reduce`.

---

## 6. Spacing Quick Reference

### Padding umum

| Nilai          | Penggunaan                               |
| -------------- | ---------------------------------------- |
| `5px 12px`     | Tab button, action button                |
| `6px 12px`     | Breadcrumb bar                           |
| `7px 16px`     | Primary CTA, modal button               |
| `9px 12px`     | Form input                              |
| `10px 14px`    | Banner, info notice                      |
| `12px 14px`    | Stat card                                |
| `14px 20px`    | Modal header                             |
| `16px 18px`    | Data row                                 |
| `16px 20px`    | Modal body                               |
| `48px 32px`    | Success card, empty state                |

### Gap umum

`4px` (tab gap) · `6px` (slot grid, label-input) · `8px` (icon+text) · `10px` (stat grid, detail grid) · `12px` (metadata) · `16px` (legend items) · `18px` (page section) · `20px` (form grid)

---

## 7. Panduan untuk Fitur Baru

Saat mengembangkan fitur baru (Fasilitas, Laporan, dsb), gunakan panduan berikut:

1. **Gunakan token di atas** — jangan buat warna/font/spacing baru kecuali benar-benar diperlukan.
2. **Komponen yang sama, pola yang sama**:
   - Halaman list → gunakan **Data Row / List Card** (§4.9) + **Stat Cards** (§4.2) + **Tab Bar** (§4.3).
   - Halaman form → gunakan **Form Inputs** (§4.6) + **Breadcrumb Bar** (§4.1) + **Summary Card** (§4.15).
   - Detail view → gunakan **Modal** (§4.7) + **Detail Cell** (§4.10).
   - Status → gunakan **TagPill** (§4.8) dengan warna dari §1.4.
   - Notifikasi → gunakan **Warning Banner** (§4.11) atau **Error Banner** (§4.12).
3. **Physical press effect** wajib untuk semua tombol non-ghost (§4.4).
4. **Font family**: heading → Open Runde, body → IBM Plex Sans, kode → Source Code Pro.
5. **Border radius**: `4px` (kecil), `6px` (standar), `8px` (card), `10px`–`12px` (modal), `9999px` (pill).
6. **Shadow hierarchy**: `0.02` (row default) → `0.04` (hover/card) → `0.15` (modal).
