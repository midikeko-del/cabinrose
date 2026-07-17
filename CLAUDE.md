# Cabin Rose Station — laman rasmi

Kafe western di River Front, Kemaman, Terengganu (sejak 2019). Laman statik,
tiada backend, tiada build step selain dua skrip PHP dalam `tools/`.

- **Live:** https://cabinrose.my (GitHub Pages, domain custom, HTTPS dikuatkuasakan)
- **Repo:** github.com/midikeko-del/cabinrose, branch `main`
- **Deploy:** push ke `main` → live dalam ~15–60 saat. Tiada CI.
- **Dev tempatan:** XAMPP, `http://localhost/cabinrose/`

---

## ⚠️ `en/index.html` ialah fail TERJANA — jangan sunting

`index.html` (Bahasa Melayu) ialah **sumber tunggal**. Versi Inggeris dijana:

```bash
php tools/build-en.php     # index.html  ->  en/index.html
```

Sunting `en/index.html` terus = kerja anda hilang pada jana berikutnya.

**Selepas mengubah apa-apa kandungan dalam `index.html`, jalankan skrip itu dan
commit hasilnya.** Skrip menarik teks Inggeris daripada kamus `I18N.en` dalam
`js/main.js`, jadi terjemahan hidup di satu tempat sahaja.

Skrip juga membina semula blok `<script id="faq-schema">` dalam bahasa Inggeris.
Ini bukan kosmetik: **FAQ schema mesti sepadan tepat dengan teks yang pelawat
nampak**, atau Google mengabaikannya. Tanpa langkah ini `/en/` akan menghantar
schema BM di bawah teks Inggeris.

Skrip beri amaran bila corak kepala tak dijumpai atau bilangan soalan tak
sepadan. **Jangan abaikan amaran** — ia bermakna output senyap-senyap salah.

Nota: fail guna **CRLF**. Corak multi-baris dalam skrip mesti regex, bukan
padanan literal dengan `\n`.

---

## Bahasa ditentukan oleh URL, bukan localStorage

| URL | Bahasa | `<html lang>` |
|---|---|---|
| `/` | Bahasa Melayu | `ms` |
| `/en/` | English | `en` |

`langFromPath()` dalam `js/main.js` membaca `location.pathname`. Toggle bahasa
**menavigasi** antara URL (relatif: `en/` dan `../`, supaya subfolder XAMPP
tempatan turut berfungsi).

**Jangan kembalikan localStorage.** Kod lama menyimpan pilihan bahasa; kalau
pilihan tersimpan menang, BM boleh terpapar di `/en/` — bercanggah dengan apa
yang Google indeks di URL tersebut.

hreflang (`ms` / `en` / `x-default`) bertimbal balik pada kedua-dua halaman dan
canonical merujuk diri sendiri. Kalau menambah halaman, kekalkan corak ini dan
kemas kini `sitemap.xml`.

---

## Imej: WebP sahaja

```bash
php tools/towebp.php       # img/*.jpg|png  ->  img/*.webp + img/og-image.jpg
```

JPEG/PNG asal ialah **master** — kekal dalam repo, skrip sentiasa baca
daripadanya, jadi selamat dijalankan berulang (output identik bait demi bait).
Laman hanya merujuk `.webp`.

Mesin dev **tiada `cwebp` mahupun ImageMagick** — skrip guna GD dalam PHP XAMPP.

Menambah imej baru: masukkan dalam `$jobs` (`tools/towebp.php`), jalankan
skrip, kemudian rujuk nama `.webp` itu dalam HTML/CSS/JS.

Perkara yang perlu diketahui:
- **Nama output mesti eksplisit.** `drinks.jpg` dan `drinks.png` ialah dua imej
  berbeza yang berkongsi batang nama. Skrip gagal awal kalau dua sumber menuju
  satu output — dahulu ia senyap-senyap menimpa.
- **WebP boleh jadi lebih besar** untuk JPEG kecil yang sudah termampat elok.
  Skrip beri amaran; kecilkan dimensi atau kekal guna fail asal.
- `hero_food.webp` ialah **elemen LCP**. Ia dirujuk dari CSS, jadi pelayar hanya
  menemuinya lewat — sebab itu ia di-`preload` dengan `fetchpriority="high"`
  dalam `<head>`. Kekalkan.
- Imej modal menu (`*-menu.webp`, 200px) dipapar sebagai bulatan 44px sahaja.

---

## Fakta perniagaan (sah Julai 2026)

- **TIADA sijil halal JAKIM.** Perniagaan **tidak** memegang pensijilan halal
  JAKIM (owner sahkan Julai 2026). **Jangan sekali-kali** dakwa "bersijil halal
  JAKIM" / "JAKIM halal certified" atau melabel "halal" — di Malaysia itu
  kesalahan di bawah Akta Perihal Dagangan. Isyarat benar & dibenarkan:
  **"dimiliki dan diuruskan oleh Muslim Bumiputera"**.
- Alamat: L 94-1, Jalan Raja Udang 3, River Front, 24000 Kemaman
- Tel / WhatsApp: **013-964 2739**
- Waktu: Sabtu–Khamis 11:00–23:00 · Jumaat 15:00–23:00
- Koordinat (dalam schema `geo`): **4.217934, 103.422286**
- Google Search Console: disahkan melalui `google40ff26ddefb29d20.html` di root.
  **Jangan padam fail itu** — verifikasi akan gugur.

Harga dalam FAQ diambil daripada data `MENU` sebenar dalam `js/main.js`. Kalau
harga berubah, kemas kini kedua-duanya supaya kekal jujur.

---

## Reka bentuk

Monokrom minimalis (permintaan pemilik) dengan aksen dusty rose (`--accent`).
Butang = pill penuh; kad/imej = radius 10px. Tema light/dark automatik ikut
sistem. **Foto kekal warna asal — jangan grayscale.**

Butang tempahan hijau (`.btn-book`, `#25d366`) sengaja lain daripada butang
utama hitam: ia warna jenama WhatsApp dan menuju ke WhatsApp.

---

## Perangkap

**Jangan letak filter CSS pada iframe Google Maps.** `filter: grayscale()` dsb.
menjadikan iframe kosong sepenuhnya.

**Jangan guna `&` dalam teks FAQ.** HTML perlukan `&amp;`, JSON-LD perlukan `&`
mentah. Beza itu sahaja memecahkan padanan schema yang Google semak.

**Push ke github.com kerap gagal sementara** (`Failed to connect port 443`)
walaupun `curl` ke hos sama berjaya. Cuba semula 2–3 kali; biasanya menjadi.

**Bila menguji dalam browser automasi:** kalau `document.hidden === true`, Chrome
**tidak melukis**. Akibatnya screenshot kosong/timeout, `loading="lazy"` tak
pernah muat (`naturalWidth` 0), IntersectionObserver tak cetus jadi `.reveal`
kekal tersembunyi, dan `getComputedStyle` boleh pulangkan nilai basi. **Semak
`document.visibilityState` dahulu sebelum menyimpulkan laman rosak.** Sahkan
imej dengan `fetch()` + `new Image()` decode.

---

## Struktur

```
index.html              Sumber BM (satu halaman)
en/index.html           TERJANA — jangan sunting
css/style.css           Semua gaya
js/main.js              i18n, nav, reveal, modal menu, borang tempahan
img/                    *.jpg/png = master · *.webp = dihidangkan
tools/build-en.php      Jana en/index.html
tools/towebp.php        Jana WebP + og-image
sitemap.xml             Kedua-dua URL + alternates hreflang
CNAME                   cabinrose.my
.nojekyll               Matikan pemprosesan Jekyll
google40ff…html         Verifikasi Search Console — jangan padam
```

## Senarai semak sebelum commit

1. Ubah `index.html` / `js/main.js`?  → `php tools/build-en.php`
2. Tambah atau ganti imej?           → `php tools/towebp.php`
3. Tambah URL baru?                  → kemas kini `sitemap.xml` + hreflang
4. Uji **kedua-dua** `/` dan `/en/`
