# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
```
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.
```

**Hasil:**
- Membuat file `lib/supabase/server.js` dan `lib/supabase/index.js` untuk membuat klien Supabase di sisi server menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY`.
- Mengubah `app/page.jsx` menjadi Server Component asinkron yang mengambil seluruh produk dari tabel `produk` di Supabase.
- Menampilkan produk dengan komponen `KartuProduk`.
- Menangani kondisi jika gagal memuat produk (menampilkan pesan error) dan jika tabel kosong (menampilkan teks "Belum ada produk").
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menambahkan normalisasi format `SUPABASE_URL` pada koneksi server untuk mencegah error PostgREST (`PGRST125`) jika URL berakhiran `/rest/v1/` atau terdapat trailing slash.

## US-02 Detail produk

**Prompt:**
```
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.
```

**Hasil:**
- Mengubah `app/produk/[id]/page.jsx` menjadi Server Component asinkron yang membaca `params.id` (`await params`).
- Mengambil satu data produk dari tabel `produk` di Supabase berdasarkan ID menggunakan `.eq('id', id).maybeSingle()`.
- Menampilkan foto, kategori, nama, harga (format rupiah), deskripsi, dan tombol WhatsApp.
- Memanggil `notFound()` saat produk tidak ditemukan atau ID tidak valid.
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menggunakan `maybeSingle()` dan penanganan error Supabase sehingga ID non-numerik (misal `/produk/abc`) maupun ID yang tidak ada (misal `/produk/99999`) langsung mengarah ke halaman 404 tanpa unhandled server exception.

## US-03 Pesan via WhatsApp

**Prompt:**
```
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

allow all, jangan commit dan ngepush sendiri
```

**Hasil:**
- Mengubah elemen tombol pada `components/TombolWhatsApp.jsx` menjadi tag tautan (`<a>`) yang mengarah ke `https://wa.me/<nomor>?text=<pesan>`.
- Nomor tujuan diambil dari `lib/toko.js`.
- Pesan otomatis memuat nama produk dan harga dalam format rupiah (`formatRupiah`), di-encode dengan `encodeURIComponent`.
- Tautan dibuka di tab baru menggunakan `target="_blank"` dan `rel="noopener noreferrer"`.
- Gaya visual tombol tetap dipertahankan.
- Memastikan `CatatanBelumAktif` sudah bersih dari halaman detail produk.

**Perbaikan:**
- Membersihkan karakter non-digit pada nomor WhatsApp (`replace(/\D/g, "")`) untuk memastikan format nomor internasional valid saat diarahkan ke WhatsApp.

## US-04 Login admin

**Prompt:**
```
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.
```

**Hasil:**
- Membuat file `lib/supabase/session.js` menggunakan `@supabase/ssr` (`createServerClient`) bersama `cookies` dari `next/headers` untuk koneksi sesi admin (`SUPABASE_PUBLISHABLE_KEY`).
- Membuat Server Action `login` dan `logout` di `app/admin/actions.js`.
- Menghubungkan form di `app/admin/login/page.jsx` dengan hook `useActionState`.
- Menampilkan pesan error saat login gagal dan mengalihkan ke `/admin` jika berhasil.
- Menghubungkan tombol "Keluar" di `components/NavAdmin.jsx` ke Server Action `logout` via form submit tanpa mengubah tampilan navigasi.
- Menghapus komponen `CatatanBelumAktif` dari halaman login.

**Perbaikan:**
- Mengatur Server Action `login` agar dapat menerima input baik dari `useActionState` maupun form submission standar.

## US-05 Ganti password

**Prompt:**
```
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.
```

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js`.
- Melakukan validasi di server: password minimal 8 karakter dan harus sama dengan konfirmasi.
- Memeriksa sesi admin yang sedang login di server via `supabase.auth.getUser()`.
- Memperbarui password menggunakan `supabase.auth.updateUser({ password: passwordBaru })`.
- Menghubungkan form di `app/admin/password/page.jsx` menggunakan `useActionState` untuk menampilkan pesan sukses atau pesan error.
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menambahkan penanganan pesan sukses dan error yang informatif di atas form dengan mempertahankan tata letak tombol submit.

## US-06 Proteksi halaman admin

**Prompt:**
```
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.
```

**Hasil:**
- Membuat file `proxy.js` di root proyek untuk memproteksi seluruh rute `/admin` menggunakan `@supabase/ssr`.
- Mengalihkan pengunjung yang belum login (atau sesi tidak valid) ke `/admin/login`.
- Mengecualikan rute `/admin/login` agar form login tetap bisa diakses publik.
- Memastikan Server Action yang mengubah data memeriksa sesi admin di server sebelum eksekusi.
- Menghapus komponen `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:**
- Mengekspor `proxy` sebagai named export `proxy`, named export `middleware`, dan default export dengan config matcher `/admin/:path*` agar kompatibel penuh dengan konvensi proxy Next.js 16.

## Debugging dan fitur bonus

### Menghubungkan tautan admin di Footer **[SENDIRI]**

**Prompt:**
```
sambungkan login itu dengan footer masuk ke admin
```

**Hasil:**
- Mengubah tautan "Masuk sebagai admin" di `components/Footer.jsx` yang sebelumnya mengarah ke `/admin` menjadi mengarah langsung ke `/admin/login`.

**Perbaikan:**
- Mengarahkan pengunjung umum yang ingin login langsung ke halaman login `/admin/login` melalui footer situs.

**Prompt:**
```
sambungkan login itu dengan footer masuk ke admin
```

**Hasil:**
- Mengubah tautan "Masuk sebagai admin" di `components/Footer.jsx` yang sebelumnya mengarah ke `/admin` menjadi mengarah langsung ke `/admin/login`.

**Perbaikan:**
- Mengarahkan pengunjung umum yang ingin login langsung ke halaman login `/admin/login` melalui footer situs.

