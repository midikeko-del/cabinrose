# Pasang webhook Telegram → Cloudflare Worker → GitHub Actions

Tujuan: bila owner hantar `/notis` (atau pos gambar) dalam group Telegram,
popup/gambar naik ke laman dalam **~1 minit**, bukan tunggu jadual GitHub yang
lambat. Semua percuma.

```
Telegram  →  Cloudflare Worker  →  GitHub Actions (repository_dispatch)  →  agent.py  →  laman
  (~1s)          (loceng pintu)              (cetus serta-merta)           (proses)
```

Ada **3 benda** yang perlu anda buat sekali sahaja (saya tak boleh buat sebab ia
libatkan akaun & kredensial anda). Lebih kurang 15 minit.

---

## 1. Cipta GitHub token (untuk Worker cetus Actions)

1. Buka <https://github.com/settings/personal-access-tokens/new> (fine-grained).
2. **Token name:** `cabinrose-telegram-worker`
3. **Expiration:** 1 tahun (atau custom).
4. **Repository access:** *Only select repositories* → pilih **cabinrose**.
5. **Permissions** → *Repository permissions* → **Contents** → **Read and write**.
   (Metadata: Read-only akan auto-terpilih — biarkan.)
6. **Generate token** → salin nilainya. Ia bermula `github_pat_...`.
   **Simpan sekejap** — kita guna di langkah 2.

---

## 2. Cipta Cloudflare Worker

Daftar akaun percuma di <https://dash.cloudflare.com/sign-up> (tak perlu kad
kredit). Kemudian pilih **satu** cara:

### Cara A — Dashboard (klik-klik, paling mudah)

1. Dashboard → **Workers & Pages** → **Create** → **Create Worker**.
2. Beri nama, cth `cabinrose-telegram` → **Deploy** (kod contoh dulu).
3. **Edit code** → padam semua → tampal isi penuh `worker/worker.js` → **Deploy**.
4. Buka Worker → **Settings** → **Variables and Secrets**, tambah:

   | Nama | Jenis | Nilai |
   |---|---|---|
   | `GH_TOKEN` | Secret (encrypt) | token dari langkah 1 (`github_pat_...`) |
   | `TG_WEBHOOK_SECRET` | Secret (encrypt) | rentetan rawak anda (lihat kotak bawah) |
   | `GH_OWNER` | Text | `midikeko-del` |
   | `GH_REPO` | Text | `cabinrose` |

   **Deploy** sekali lagi selepas tambah supaya berkuat kuasa.
5. Salin URL Worker anda, cth `https://cabinrose-telegram.<akaun>.workers.dev`.

### Cara B — Wrangler (baris arahan)

```bash
npm install -g wrangler
cd worker
wrangler login
wrangler secret put GH_TOKEN            # tampal token langkah 1
wrangler secret put TG_WEBHOOK_SECRET   # tampal rentetan rawak anda
wrangler deploy                         # cetak URL workers.dev anda
```

> **Rentetan rawak `TG_WEBHOOK_SECRET`:** apa-apa teks rawak 20–48 aksara
> (huruf/nombor). Cth jana: `openssl rand -hex 24`. Guna nilai **yang sama** di
> Worker (langkah 2) dan di setWebhook (langkah 3).

---

## 3. Daftar webhook pada Telegram

Ganti `<TOKEN>`, `<WORKER_URL>`, `<SECRET>` dengan nilai anda, jalankan sekali:

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  --data-urlencode "url=<WORKER_URL>" \
  --data-urlencode "secret_token=<SECRET>" \
  --data-urlencode 'allowed_updates=["message","channel_post"]'
```

Sepatutnya balas `{"ok":true,"result":true,"description":"Webhook was set"}`.

**Sahkan:**

```bash
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"
```

Tengok `"url"` betul dan `"pending_update_count"` kecil. Kalau ada
`"last_error_message"`, itu petunjuk masalah (cth secret tak sepadan → 403).

---

## Cuba

Hantar dalam group: gambar flyer + caption `/notis 30/12/2026`.
Bot patut balas dalam beberapa saat, dan dalam ~1 minit commit baru muncul di
`main` (`chore(auto): notis/gambar Telegram (webhook serta-merta)`) — popup live
di <https://cabinrose.my>.

## Nota penting

- **Webhook vs polling:** selepas webhook aktif, `getUpdates` (cron `fetch`
  harian) akan pulang *409 Conflict* — `agent.py` sengaja **langkau senyap**,
  jadi tiada larian gagal. Webhook jadi laluan utama; cron fetch cuma jaring
  keselamatan.
- **Galeri:** gambar biasa (tanpa `/notis`) kini juga masuk `incoming/` melalui
  webhook serta-merta, tapi masih **diterbitkan ke galeri pada larian publish
  harian** (00:00 MYT) seperti biasa — tapisan CV tak berubah.
- **Batalkan webhook** (kembali ke polling penuh):
  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/deleteWebhook"
  ```
- **Kos:** Worker free tier = 100,000 permintaan/hari; penggunaan sebenar
  beberapa sehari. Takkan kena bil.
