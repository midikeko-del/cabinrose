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
- Menu penuh kini poster imej: `img/menu/page-01…15.webp` (master JPG di
  `img/menu/`), dipapar bertindan penuh-lebar & boleh skrol dalam modal
  `#menuPenuh`. Tukar menu = ganti poster, jalankan `towebp.php`, kemas kini FAQ.
- Imej bulatan lama (`dessert-menu.webp` / `food-menu.webp` / `drinks-menu.webp`)
  kini **yatim** sejak menu terjana kod dibuang — boleh padam atau guna semula.

---

## Fakta perniagaan (sah Julai 2026)

- **TIADA sijil halal JAKIM.** Perniagaan **tidak** memegang pensijilan halal
  JAKIM (owner sahkan Julai 2026). **Jangan sekali-kali** dakwa "bersijil halal
  JAKIM" / "JAKIM halal certified" atau melabel "halal" — di Malaysia itu
  kesalahan di bawah Akta Perihal Dagangan. Isyarat benar & dibenarkan:
  **"dimiliki dan diuruskan oleh Muslim Bumiputera"**.
- Alamat: L 94-1, Jalan Raja Udang 3, River Front, 24000 Kemaman
- Tel / WhatsApp: **013-964 2739**
- Deposit tempahan (SOP owner Julai 2026, dikuatkuasakan borang tempahan):
  - Pelanggan WAJIB pilih jenis (meja kafe / event space) dahulu — borang
    hanya keluar selepas jenis dipilih.
  - Peraturan deposit KEDUA-DUA jenis ikut pax: **10+ pax → min RM200**,
    **50+ pax → min RM500**; bawah 10 pax deposit pilihan.
  - Akaun meja kafe: Public Bank **3817408419** (CABIN ROSE STATION ENT) +
    QR DuitNow `img/qr-duitnow.jpg`.
  - Akaun event space: Public Bank **3824353114** (CR STUDIO ENTERPRISE) —
    nombor akaun sahaja, tiada QR.
  - Aliran bayaran manual: pelanggan transfer + hantar resit melalui WhatsApp.
- Waktu: Sabtu–Khamis 11:00–23:00 · Jumaat 15:00–23:00
- Koordinat (dalam schema `geo`): **4.217934, 103.422286**
- Google Search Console: disahkan melalui `google40ff26ddefb29d20.html` di root.
  **Jangan padam fail itu** — verifikasi akan gugur.

Harga dalam FAQ mesti sepadan dengan menu sebenar. Sumber menu kini ialah
**poster imej** di `img/menu/page-01…15.webp` (bukan lagi data `MENU` terjana
kod — dibuang Julai 2026). Kalau harga berubah, ganti poster **dan** kemas kini
teks harga dalam FAQ (`faq.a6`/`faq.a7`) supaya kekal jujur.

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

**Jangan kongsi satu kumpulan `concurrency` untuk larian webhook.** Bila owner
hantar album Telegram, beberapa larian `repository_dispatch` tercetus dalam
saat yang sama. Kalau semua berkongsi satu kumpulan concurrency, GitHub
**membatalkan larian "pending"** (walau `cancel-in-progress: false`) — gambar
tercicir senyap. Sebab itu `weekly-agent.yml` beri setiap mesej Telegram
kumpulan UNIK (`tg-<message_id>`); larian berjadual sahaja berkongsi kumpulan.
Larian selari yang terhasil dikendali oleh gelung pull-rebase+push retry.

**Bila menguji dalam browser automasi:** kalau `document.hidden === true`, Chrome
**tidak melukis**. Akibatnya screenshot kosong/timeout, `loading="lazy"` tak
pernah muat (`naturalWidth` 0), IntersectionObserver tak cetus jadi `.reveal`
kekal tersembunyi, dan `getComputedStyle` boleh pulangkan nilai basi. **Semak
`document.visibilityState` dahulu sebelum menyimpulkan laman rosak.** Sahkan
imej dengan `fetch()` + `new Image()` decode.

---

## Galeri: manifest-driven — jangan sunting blok AUTO-GALLERY

Slaid galeri dalam `index.html` (antara `<!-- AUTO-GALLERY:START -->` dan
`<!-- AUTO-GALLERY:END -->`) DIJANA daripada `img/gallery.json`:

```bash
php tools/build-gallery.php    # gallery.json -> blok galeri index.html
php tools/build-en.php         # WAJIB selepas itu
```

- Susunan manifest = susunan paparan; **terbaru di DEPAN**. Had **30** imej —
  lebihan di hujung (paling lama) digugurkan dari paparan (fail tidak dipadam).
- Terjemahan alt EN datang dari medan `altEn` manifest — `build-en.php` membaca
  manifest, jadi jangan tambah alt galeri ke `$attrText` lagi.
- `pos` (object-position CSS) menentukan crop dalam kotak 340×260 — gambar
  menegak dari telefon selalunya perlukan `center 70%`/`center bottom` supaya
  subjek tak terpotong.

## Automasi galeri Telegram (GitHub Actions + agent.py)

Owner pos gambar dalam group Telegram → laman auto kemas kini.
Satu ejen Python (`agent.py`), satu workflow (`.github/workflows/weekly-agent.yml`)
dengan **tiga pencetus** — mod dipilih ikut `github.event_name`/`schedule`:

- **webhook (LALUAN UTAMA, serta-merta)** — `python agent.py webhook`.
  Cloudflare Worker (`worker/`) terima webhook Telegram bila owner pos gambar
  atau hantar `/notis`, lalu cetus workflow ini (`repository_dispatch:
  telegram-update`) dengan mesej dalam `client_payload.message` (dihantar ke
  ejen sebagai env `TELEGRAM_MESSAGE`). `process_message` proses SATU mesej:
  `/notis` → popup terus; gambar → `incoming/`. Popup naik ~1 minit, tak tunggu
  jadual. Gambar galeri yang ditangkap juga picu ringkasan Telegram serta-merta
  (`notify_incoming_queue` → `analyze_incoming`): senarai giliran `incoming/` +
  anggaran mana akan terbit/duplikat/kabur, guna peraturan sama macam publish
  (read-only, tak ubah fail). Hanya laluan webhook (`notify=True`); fetch polling
  senyap supaya larian backlog tak membanjiri group.
  Pasang: lihat `worker/SETUP.md` (perlu GitHub PAT + akaun Cloudflare,
  kedua-dua percuma). **Webhook & getUpdates saling eksklusif di Telegram** —
  sebab itu fetch di bawah kini jaring keselamatan sahaja.
- **fetch (harian 15:00 UTC, jaring keselamatan)** — `python agent.py fetch`
  polling getUpdates ke `incoming/` + `/notis`. Bila webhook aktif, getUpdates
  pulang **409** dan ejen **langkau senyap** (bukan gagal). Offset dalam
  `state/telegram-offset.txt`.
- **publish (harian 00:00 MYT)** — `python agent.py publish`:
  `incoming/` kosong → skip senyap (tiada commit, tiada notifikasi). Kalau ada,
  5 TERBARU ditapis **computer vision percuma** (tiada API berbayar):
  kabur (varians Laplacian; teruk → tolak, sikit → sharpen), duplikat (dHash
  lawan galeri sedia ada → skip), auto-center (pusat tenaga Sobel → medan
  `pos` manifest). Lulus → proses (900px, unsharp, sedikit kontras — resipi
  sama galeri) ke `img/auto/`, masuk depan manifest, kemudian workflow jalankan
  `build-gallery.php` + `build-en.php` (PHP masa BUILD sahaja — Pages hidang
  statik), commit+push, notifikasi ringkasan ke group Telegram
  (`state/last-run.txt`).
- Secrets repo diperlukan: `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID` sahaja.
  Bot mesti dalam group dengan privacy mode dimatikan (@BotFather /setprivacy).
  (Worker Cloudflare simpan rahsianya sendiri: GitHub PAT + secret webhook —
  bukan dalam repo, lihat `worker/SETUP.md`.)
- CV tak faham kandungan (tak boleh beza screenshot/gambar peribadi dari
  makanan) — hanya kabur/duplikat/crop. Kalau gambar tak sesuai terlepas,
  `git revert` commit auto itu dan padam entri manifest + fail `img/auto/`.
- Alt text automasi adalah generik; boleh diperelok manual dalam
  `img/gallery.json` bila-bila masa (jalankan semula build-gallery + build-en).

## Notis/promosi popup Telegram (`/notis`)

Owner hantar **gambar flyer** dalam group Telegram dengan caption:

```
/notis 30/7/2026
```

- Tarikh (terima `D/M/YY`, `D/M/YYYY`, pemisah `/`, `-`, atau `.`) ialah
  tarikh **tamat** — popup hilang automatik selepas itu, owner tak perlu
  buat apa-apa. `/notis off` buang serta-merta sebelum tamat.
- Dikendali dalam `process_message` (dipanggil oleh `mode_webhook` DAN
  `mode_fetch`, bukan `mode_publish`) — **serta-merta**, tak tunggu larian
  publish. Laluan biasa: webhook Telegram → Worker → `repository_dispatch` →
  ejen, dalam ~1 minit. Flyer TIDAK melalui penapisan CV galeri
  (kabur/duplikat/auto-center) — ia grafik reka bentuk sengaja, bukan calon
  galeri.
- Bot balas TERUS ke group (bukan tunggu notifikasi workflow):
  kejayaan, atau amaran kalau `/notis` tanpa gambar / tanpa tarikh /
  tarikh tak sah / tarikh dah lepas.
- Sumber tunggal: `img/notis.json` (medan `active`, `null` = tiada notis).
  `tools/build-notis.php` menyuntik/mengosongkan blok popup dalam
  `index.html` antara `<!-- AUTO-NOTIS:START/END -->`, kemudian **WAJIB**
  `build-en.php`. Skrip ini dijalankan pada **setiap** larian (webhook, fetch,
  publish) — sebab itu notis tamat tempoh tergugur automatik dalam masa
  ≤1 hari walaupun tiada arahan Telegram baru (semakan `expiry >= hari-ini`
  berlaku setiap kali dijalankan).
- Popup dipaparkan **setiap kali laman dimuat** (bukan sekali per pelawat —
  tiada localStorage, atas permintaan owner), butang tutup besar di bucu.
  Imej flyer papar **penuh tanpa dipotong** (bukan cover-crop macam galeri).
- Kalau notis tak sesuai terlanjur naik: `/notis off` dari Telegram (segera,
  tak perlu tunggu deploy), atau `git revert` commit berkaitan.
- `write_notis_active` (`agent.py`) padam fail flyer LAMA (jpg+webp) dari
  `img/notis/` secara automatik bila digantikan notis baru atau `/notis off`
  — hanya satu notis aktif pada satu masa, jadi tiada sebab simpan flyer
  yatim dalam repo.

## Kad "Yang wajib cuba" Telegram (`/wajibcuba`)

Owner tukar mana-mana **4 kad bento** di seksyen "Yang wajib cuba" (imej +
nama + deskripsi) dengan hantar **gambar hidangan** + caption:

```
/wajibcuba 2 | Nasi Buttermilk | Buttermilk Rice | Ayam crispy sos buttermilk | Crispy chicken in buttermilk sauce
```

- Format: `/wajibcuba <1-4> | nama BM | nama EN | desc BM | desc EN` — 4 medan
  teks WAJIB, dipisah `|`. Tag/badge pilihan: tambah `| tag BM | tag EN` di
  hujung (biasanya slot 1 sahaja, cth "Paling laris"). Tag DIKEKALKAN jika tak
  diberi — untuk buang, hantar dua medan tag kosong.
- **Slot 1** = panel besar bergambar penuh (imej ialah `<img class=cell-feature-bg>`,
  bukan latar CSS lagi — sebab itu boleh ditukar dari manifest). **Slot 4** =
  kad lebar. Slot 2-3 = kad biasa.
- Dikendali dalam `handle_wajibcuba` (`agent.py`), **serta-merta** dalam larian
  webhook (gambar `/wajibcuba` TIDAK masuk `incoming/`/galeri). Bot balas ke
  group: kejayaan, atau ralat spesifik (slot bukan 1-4 / medan teks kurang /
  tiada gambar / muat turun gagal).
- Sumber tunggal: `img/wajibcuba.json` (array `items`, 4 slot). Foto diproses
  (lebar 1000px, unsharp halus + kontras — resipi foto galeri) ke
  `img/wajibcuba/slot<N>-<uniq>.{jpg,webp}`. `write_wajibcuba_slot` padam imej
  slot LAMA — **tapi hanya jika dalam `img/wajibcuba/`**, supaya master galeri
  kongsi (imej awal spt `img/corndog.webp`) tak terpadam.
- **Dwibahasa**: `tools/render-wajibcuba.php` (fungsi kongsi) jana blok BM
  (`build-wajibcuba.php` → `index.html`) DAN EN (`build-en.php` → `en/index.html`)
  dari manifest yang **sama** — jadi `/en/` sentiasa padan. Blok ini **tiada
  data-i18n** (teks EN datang dari manifest, bukan kamus `js/main.js`). Antara
  penanda `<!-- AUTO-WAJIBCUBA:START/END -->` — jangan sunting manual.
- `build-wajibcuba.php` dijalankan pada **setiap** larian workflow (self-heal,
  idempotent), kemudian **WAJIB** `build-en.php`.
- Kalau kad tak sesuai terlanjur naik: hantar `/wajibcuba <slot>` baru, atau
  `git revert` commit berkaitan.

## Struktur

```
index.html              Sumber BM (satu halaman)
en/index.html           TERJANA — jangan sunting
css/style.css           Semua gaya
js/main.js              i18n, nav, reveal, modal menu, borang tempahan
img/                    *.jpg/png = master · *.webp = dihidangkan
img/gallery.json        Manifest galeri (susunan, alt, pos) — sumber tunggal
img/auto/               Imej galeri dari automasi Telegram
img/notis.json          Manifest popup notis/promosi aktif — sumber tunggal
img/notis/              Flyer notis dari arahan Telegram /notis
img/wajibcuba.json      Manifest 4 kad "Yang wajib cuba" — sumber tunggal
img/wajibcuba/          Foto kad dari arahan Telegram /wajibcuba
incoming/               Gambar Telegram menunggu penerbitan harian
state/                  Offset Telegram + ringkasan larian automasi
agent.py                Ejen: webhook/fetch Telegram + penapisan CV + notis + manifest
requirements.txt        Dependencies Python untuk agent.py
worker/                 Cloudflare Worker webhook Telegram + panduan (SETUP.md)
tools/build-en.php      Jana en/index.html
tools/build-gallery.php Jana blok galeri daripada gallery.json
tools/build-notis.php   Jana/kosongkan popup notis daripada notis.json
tools/build-wajibcuba.php Jana kad "Yang wajib cuba" (BM) daripada wajibcuba.json
tools/render-wajibcuba.php Fungsi render kongsi (BM+EN) untuk kad wajib cuba
tools/towebp.php        Jana WebP + og-image
.github/workflows/      weekly-agent.yml (webhook + fetch harian + publish harian)
sitemap.xml             Kedua-dua URL + alternates hreflang
CNAME                   cabinrose.my
.nojekyll               Matikan pemprosesan Jekyll
google40ff…html         Verifikasi Search Console — jangan padam
```

## Senarai semak sebelum commit

1. Ubah `index.html` / `js/main.js`?  → `php tools/build-en.php`
2. Ubah galeri?                       → edit `img/gallery.json` →
   `php tools/build-gallery.php` → `php tools/build-en.php`
2b. Ubah kad "wajib cuba"?           → edit `img/wajibcuba.json` →
   `php tools/build-wajibcuba.php` → `php tools/build-en.php`
3. Tambah atau ganti imej?           → `php tools/towebp.php`
4. Tambah URL baru?                  → kemas kini `sitemap.xml` + hreflang
5. Uji **kedua-dua** `/` dan `/en/`
