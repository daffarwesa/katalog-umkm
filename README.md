# Katalog UMKM + Order WhatsApp

Aplikasi katalog produk online untuk UMKM **Leles Dos Hermanos** yang dibangun dengan Next.js 16 App Router, Tailwind CSS 4, dan Supabase. Memungkinkan calon pembeli melihat katalog produk terkini, membaca detail produk, dan langsung memesan via WhatsApp secara instan dengan format pesan otomatis. Dilengkapi panel admin yang aman untuk mengelola toko.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdaffarwesa%2Fkatalog-umkm&project-name=katalog-umkm&repository-name=katalog-umkm)

---

## Status Fitur (US-01 sampai US-06 Selesai 100%)

- [x] **US-01: Katalog dari database** — Menampilkan seluruh produk dari tabel `produk` di Supabase secara server-side rendering, format rupiah, dan penanganan error/tabel kosong.
- [x] **US-02: Detail produk** — Halaman dinamis `/produk/[id]` membaca data produk dari database dan memanggil `notFound()` jika produk tidak ditemukan atau ID tidak valid.
- [x] **US-03: Pesan via WhatsApp** — Tombol "Pesan via WhatsApp" membuka tautan `wa.me` ke nomor toko dengan pesan otomatis berisi nama dan harga produk dalam format rupiah di tab baru.
- [x] **US-04: Login admin** — Autentikasi admin berbasis Supabase Auth dengan `@supabase/ssr` dan session cookies melalui Server Action di `app/admin/actions.js`. Tombol "Keluar" mengakhiri sesi dan kembali ke `/admin/login`.
- [x] **US-05: Ganti password** — Form ganti password untuk admin yang sedang login dengan validasi server (minimal 8 karakter dan verifikasi konfirmasi password).
- [x] **US-06: Proteksi halaman admin** — Memproteksi seluruh rute `/admin` (kecuali `/admin/login`) menggunakan `proxy.js` (pengganti `middleware.js` di Next.js 16) serta verifikasi sesi admin di setiap Server Action.
- [x] **Peningkatan Tambahan** — Tautan langsung "Masuk sebagai admin" di footer terhubung ke `/admin/login`.

---

## Langkah Menjalankan Proyek

1. **Clone repo ke laptop:**
   ```bash
   git clone https://github.com/daffarwesa/katalog-umkm.git
   cd katalog-umkm
   npm install
   ```

2. **Atur Environment Variable:**
   Salin `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Isi nilainya dari dashboard Supabase (**Project Settings > API**):
   ```env
   SUPABASE_URL="https://<project-id>.supabase.co"
   SUPABASE_PUBLISHABLE_KEY="<anon-key>"
   SUPABASE_SECRET_KEY="<service-role-key>"
   ```

3. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

4. **Build untuk produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## Struktur Folder & File Utama

| File / Folder | Keterangan |
| --- | --- |
| `proxy.js` | Middleware Next.js 16 untuk memproteksi seluruh rute `/admin` |
| `app/page.jsx` | Katalog produk (Server Component membaca Supabase) |
| `app/produk/[id]/page.jsx` | Halaman detail produk dinamis |
| `app/admin/login/page.jsx` | Halaman login admin |
| `app/admin/password/page.jsx` | Halaman ganti password admin |
| `app/admin/actions.js` | Server Actions untuk login, logout, dan ganti password |
| `lib/supabase/server.js` | Koneksi Supabase server publik (`SUPABASE_SECRET_KEY`) |
| `lib/supabase/session.js` | Koneksi sesi admin `@supabase/ssr` (`SUPABASE_PUBLISHABLE_KEY` + cookies) |
| `lib/toko.js` | Profil usaha (nama toko, WhatsApp, alamat, jam operasional) |
| `components/` | Komponen antarmuka (KartuProduk, TombolWhatsApp, NavAdmin, dll.) |
| `PROMPTS.md` | Jurnal prompt lengkap selama pengerjaan |

---

## Tentang Aplikasi Ini

- **Nama usaha:** Leles Dos Hermanos
- **Pembuat:** Daffa Wesa (daffawesa)
- **Link repository:** [https://github.com/daffarwesa/katalog-umkm](https://github.com/daffarwesa/katalog-umkm)
- **Link deployment Vercel:** [https://katalog-umkm-daffarwesa.vercel.app](https://katalog-umkm-daffarwesa.vercel.app)
- **Fitur yang diselesaikan:** US-01 sampai US-06 (seluruh jalur wajib) + tautan footer terintegrasi.
