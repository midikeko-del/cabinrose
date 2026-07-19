#!/usr/bin/env python3
"""Ejen galeri automatik Cabin Rose Station (dijalankan oleh GitHub Actions).

Dua mod:
  python agent.py fetch    - kutip gambar baru dari group Telegram ke incoming/
                             (dijalankan HARIAN: Telegram getUpdates hanya
                             menyimpan update ~24 jam, jadi fetcher harian
                             mengumpul dan publisher mingguan memproses)
  python agent.py publish  - ambil 5 gambar TERBARU dari incoming/, tapis
                             dengan computer vision (percuma, tiada API
                             berbayar), masukkan ke DEPAN img/gallery.json
                             (FIFO, had 30 diuruskan build-gallery.php)

Penapisan CV (semua dalam memori - tiada cache cakera):
  1. Kejelasan  - varians Laplacian; terlalu kabur -> TOLAK,
                  kabur sikit -> tajamkan (unsharp mask)
  2. Persamaan  - dHash lawan galeri sedia ada + kelompok semasa;
                  jarak Hamming rendah -> SKIP (duplikat/sudut hampir sama)
  3. Auto-center - pusat tenaga imej (magnitud Sobel) menentukan
                  object-position CSS supaya subjek nampak dalam
                  kotak galeri 340x260 (medan `pos` manifest)

Selepas mod publish, workflow WAJIB jalankan:
  php tools/build-gallery.php && php tools/build-en.php
(PHP jalan masa build sahaja - GitHub Pages hanya hidang HTML statik.)

Env diperlukan:
  fetch:   TELEGRAM_TOKEN, TELEGRAM_CHAT_ID
  publish: tiada (CV sepenuhnya tempatan)
"""

import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import cv2
import numpy as np
import requests
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent
INCOMING = ROOT / "incoming"
AUTO_DIR = ROOT / "img" / "auto"
MANIFEST = ROOT / "img" / "gallery.json"
NOTIS_DIR = ROOT / "img" / "notis"
NOTIS_MANIFEST = ROOT / "img" / "notis.json"
OFFSET_FILE = ROOT / "state" / "telegram-offset.txt"
SUMMARY_FILE = ROOT / "state" / "last-run.txt"

NOTIS_WIDTH = 1080     # flyer popup - lebih besar untuk teks tajam

MAX_BATCH = 6          # maks gambar diproses setiap larian publish (harian)
MAX_WIDTH = 900        # sama dengan resipi galeri sedia ada (towebp.php)
BLUR_REJECT = 30.0     # varians Laplacian bawah ini = kabur teruk -> tolak
BLUR_SHARPEN = 100.0   # bawah ini = kabur sikit -> tajamkan dahulu
DUP_DISTANCE = 10      # jarak Hamming dHash <= ini = duplikat -> skip
JPG_QUALITY = 92       # master
WEBP_QUALITY = 82      # dihidangkan

# Kapsyen alt lalai untuk gambar automasi (tiada AI kapsyen - CV tak faham
# kandungan). Sengaja NEUTRAL: gambar mungkin makanan, dalaman, atau bangunan,
# jadi elak dakwaan "makanan" yang boleh silap. Dipilih deterministik ikut
# hash imej dan tak berulang dalam satu larian, supaya beberapa gambar yang
# lulus serentak tak berkongsi alt yang sama. Perelok manual dalam
# img/gallery.json bila-bila masa jika mahu lebih spesifik.
CAPTIONS = [
    ("Suasana di Cabin Rose Station, kafe western di Kemaman",
     "The scene at Cabin Rose Station, a western cafe in Kemaman"),
    ("Sajian dan suasana terkini di Cabin Rose Station",
     "The latest food and atmosphere at Cabin Rose Station"),
    ("Sudut santai di Cabin Rose Station, Kemaman",
     "A cosy corner at Cabin Rose Station, Kemaman"),
    ("Detik terbaru di Cabin Rose Station",
     "A recent moment at Cabin Rose Station"),
    ("Tarikan terkini di Cabin Rose Station, River Front Kemaman",
     "The latest from Cabin Rose Station, River Front Kemaman"),
    ("Pengalaman santai di Cabin Rose Station",
     "The laid-back experience at Cabin Rose Station"),
    ("Kunjungan ke Cabin Rose Station, Kemaman",
     "A visit to Cabin Rose Station, Kemaman"),
    ("Cabin Rose Station, kafe western pilihan di Kemaman",
     "Cabin Rose Station, a favourite western cafe in Kemaman"),
]


def pick_caption(seed: int, used: set[int]) -> tuple[str, str]:
    """Pilih kapsyen deterministik ikut hash; elak ulangan dalam satu larian."""
    n = len(CAPTIONS)
    start = seed % n
    for i in range(n):
        idx = (start + i) % n
        if idx not in used:
            used.add(idx)
            return CAPTIONS[idx]
    return CAPTIONS[start]  # lebih gambar daripada kapsyen (jarang; > MAX_BATCH)


# ---------------------------------------------------------------- Telegram --

def tg_call(token: str, method: str, **params):
    r = requests.get(
        f"https://api.telegram.org/bot{token}/{method}", params=params, timeout=60
    )
    data = r.json()
    if not data.get("ok"):
        sys.exit(f"RALAT: {method} balas ralat: {str(data)[:300]}")
    return data["result"]


def tg_send(token: str, chat_id: str, text: str) -> None:
    """Hantar mesej balas ke group (maklum balas /notis). Gagal senyap."""
    try:
        requests.get(
            f"https://api.telegram.org/bot{token}/sendMessage",
            params={"chat_id": chat_id, "text": text}, timeout=30,
        )
    except requests.RequestException:
        pass


def download_photo(token: str, photo: dict) -> bytes | None:
    file_info = tg_call(token, "getFile", file_id=photo["file_id"])
    r = requests.get(
        f"https://api.telegram.org/file/bot{token}/{file_info['file_path']}",
        timeout=120,
    )
    return r.content if r.status_code == 200 and r.content else None


# --------------------------------------------------------------------- Notis --

def parse_notis_date(token: str) -> str | None:
    """'30/7/26' | '30-07-2026' | '30.7.2026' -> '2026-07-30' (ISO), atau None."""
    m = re.match(r"^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})$", token.strip())
    if not m:
        return None
    d, mo, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
    if y < 100:
        y += 2000
    try:
        return datetime(y, mo, d).strftime("%Y-%m-%d")
    except ValueError:
        return None


def write_notis_active(entry: dict | None) -> None:
    """Kemas kini medan 'active' notis.json (kekalkan komen). Padam flyer
    lama (jpg+webp) daripada repo bila digantikan/dibuang - jimat ruang,
    sebab hanya SATU notis aktif pada satu masa (lihat proses_notis)."""
    manifest = json.loads(NOTIS_MANIFEST.read_text(encoding="utf-8"))
    old = manifest.get("active")
    if old and old.get("src") and old.get("src") != (entry or {}).get("src"):
        old_path = ROOT / old["src"]
        for f in (old_path, old_path.with_suffix(".jpg")):
            if f.exists():
                f.unlink()
    manifest["active"] = entry
    NOTIS_MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def process_notis(jpeg_bytes: bytes, expiry_iso: str, uniq: str) -> dict:
    """Simpan flyer (master jpg + webp) & tulis notis.json. TIADA sharpen -
    flyer ialah grafik reka, penajaman merosakkan teks. Pulang entri."""
    NOTIS_DIR.mkdir(parents=True, exist_ok=True)
    img = Image.open(io.BytesIO(jpeg_bytes))
    img.load()
    img = img.convert("RGB")
    if img.width > NOTIS_WIDTH:
        ratio = NOTIS_WIDTH / img.width
        img = img.resize((NOTIS_WIDTH, round(img.height * ratio)), Image.LANCZOS)
    base = f"notis-{datetime.now(timezone.utc).strftime('%Y%m%d')}-{uniq}"
    img.save(NOTIS_DIR / f"{base}.jpg", quality=JPG_QUALITY)   # master
    img.save(NOTIS_DIR / f"{base}.webp", quality=WEBP_QUALITY)  # dihidangkan
    entry = {
        "src": f"img/notis/{base}.webp",
        "w": img.width, "h": img.height,
        "expiry": expiry_iso,
        "added": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
    }
    write_notis_active(entry)
    return entry


def handle_notis(cmd: str, msg: dict, token: str, chat_id: str) -> bool:
    """Kendali arahan /notis (dalam caption gambar atau teks). Balas maklum
    balas ke group. Pulang True jika notis.json berubah (perlu build+deploy)."""
    rest = cmd[len("/notis"):].strip()
    photo = msg["photo"][-1] if msg.get("photo") else None
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if rest.lower() == "off":
        write_notis_active(None)
        tg_send(token, chat_id, "✅ Notis dibuang dari laman.")
        print("NOTIS: dibuang (/notis off)")
        return True

    if not photo:
        tg_send(token, chat_id,
                "⚠️ /notis perlukan gambar flyer dilampirkan sekali. Hantar "
                "semula gambar + caption, cth: /notis 30/7/2026")
        print("NOTIS: ditolak - tiada gambar")
        return False

    if not rest:
        tg_send(token, chat_id,
                "⚠️ /notis perlukan tarikh tamat. Cth: /notis 30/7/2026")
        print("NOTIS: ditolak - tiada tarikh")
        return False

    expiry = parse_notis_date(rest)
    if expiry is None:
        tg_send(token, chat_id,
                f"⚠️ Tarikh '{rest}' tak sah. Guna hari/bulan/tahun, "
                "cth: /notis 30/7/2026")
        print(f"NOTIS: ditolak - tarikh tak sah '{rest}'")
        return False
    if expiry < today:
        tg_send(token, chat_id,
                f"⚠️ Tarikh {rest} dah lepas. Guna tarikh akan datang.")
        print(f"NOTIS: ditolak - tarikh lepas {expiry}")
        return False

    content = download_photo(token, photo)
    if not content:
        tg_send(token, chat_id, "⚠️ Gagal muat turun gambar flyer. Cuba lagi.")
        print("NOTIS: ditolak - muat turun gagal")
        return False

    uniq = re.sub(r"[^A-Za-z0-9_-]", "", photo["file_unique_id"])
    process_notis(content, expiry, uniq)
    tg_send(token, chat_id,
            f"✅ Notis dipasang di laman, akan tamat {expiry[8:10]}/{expiry[5:7]}/"
            f"{expiry[0:4]}. Guna /notis off untuk buang lebih awal.")
    print(f"NOTIS: dipasang, tamat {expiry}")
    return True


def process_message(msg: dict, token: str, chat_id: str,
                    notify: bool = False) -> str:
    """Proses SATU mesej Telegram - dikongsi oleh mode_fetch (polling) dan
    mode_webhook (push serta-merta). Arahan /notis dikendali terus; selainnya
    gambar disimpan ke incoming/ untuk larian publish. Pulang label log ringkas.

    notify=True (laluan webhook) hantar ringkasan giliran incoming/ ke Telegram
    serta-merta selepas gambar galeri disimpan. Dibiar False untuk polling fetch
    supaya larian backlog jaring-keselamatan tak membanjiri group."""
    if str(msg.get("chat", {}).get("id", "")) != str(chat_id):
        return "abai (chat lain)"

    # Teks (caption gambar atau mesej biasa) yang bermula /notis - dikendali
    # berasingan daripada aliran galeri, tak kira ada gambar atau tidak
    # (handle_notis sendiri balas ralat kalau gambar tiada/tarikh tak sah).
    text = (msg.get("caption") or msg.get("text") or "").strip()
    if text.lower().startswith("/notis"):
        handle_notis(text, msg, token, chat_id)
        return "notis dikendali"

    if not msg.get("photo"):
        return "abai (bukan gambar)"
    photo = msg["photo"][-1]  # saiz terbesar
    uniq = re.sub(r"[^A-Za-z0-9_-]", "", photo["file_unique_id"])
    date = datetime.fromtimestamp(int(msg["date"]), tz=timezone.utc).strftime("%Y%m%d")
    INCOMING.mkdir(exist_ok=True)
    dest = INCOMING / f"tg-{date}-{uniq}.jpg"
    if dest.exists():  # dedup harian
        return f"abai (duplikat {dest.name})"
    content = download_photo(token, photo)
    if not content:
        return f"AMARAN: gagal muat turun {uniq} - dilangkau"
    dest.write_bytes(content)
    if notify:
        notify_incoming_queue(token, chat_id, dest.name)
    return f"disimpan {dest.name} ({len(content) / 1024:.0f}KB)"


def _require_creds() -> tuple[str, str]:
    import os

    token = os.environ.get("TELEGRAM_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        sys.exit("RALAT: TELEGRAM_TOKEN / TELEGRAM_CHAT_ID tiada dalam env")
    return token, chat_id


def mode_fetch() -> None:
    """Polling getUpdates - kini JARING KESELAMATAN sahaja (laluan utama =
    webhook, lihat mode_webhook). Bila webhook aktif, getUpdates pulang 409
    'Conflict' - kita langkau senyap dan biar webhook uruskan."""
    token, chat_id = _require_creds()

    INCOMING.mkdir(exist_ok=True)
    OFFSET_FILE.parent.mkdir(exist_ok=True)
    offset = int(OFFSET_FILE.read_text().strip() or 0) if OFFSET_FILE.exists() else 0

    r = requests.get(
        f"https://api.telegram.org/bot{token}/getUpdates",
        params={"offset": offset + 1, "timeout": 0,
                "allowed_updates": '["message"]'},
        timeout=60,
    )
    data = r.json()
    if not data.get("ok"):
        if data.get("error_code") == 409:
            print("fetch: webhook aktif - getUpdates dilangkau (guna webhook)")
            return
        sys.exit(f"RALAT: getUpdates balas ralat: {str(data)[:300]}")
    updates = data["result"]

    saved, max_id = 0, offset
    for u in updates:
        max_id = max(max_id, int(u["update_id"]))
        result = process_message(u.get("message") or {}, token, chat_id)
        if result.startswith("disimpan"):
            saved += 1
        print(result)

    OFFSET_FILE.write_text(f"{max_id}\n")
    print(f"selesai: {len(updates)} update disemak, {saved} gambar baru, offset={max_id}")


def mode_webhook() -> None:
    """Proses satu mesej yang ditolak Telegram SERTA-MERTA melalui Cloudflare
    Worker (repository_dispatch). Mesej dihantar sebagai JSON dalam env
    TELEGRAM_MESSAGE oleh workflow (github.event.client_payload.message)."""
    import os

    token, chat_id = _require_creds()
    raw = (os.environ.get("TELEGRAM_MESSAGE") or "").strip()
    if not raw or raw == "null":
        sys.exit("RALAT: TELEGRAM_MESSAGE kosong (tiada client_payload.message)")
    try:
        msg = json.loads(raw)
    except json.JSONDecodeError as e:
        sys.exit(f"RALAT: TELEGRAM_MESSAGE bukan JSON sah: {e}")
    print(f"webhook: {process_message(msg, token, chat_id, notify=True)}")


# ---------------------------------------------------------- Computer vision --

def to_gray(img: Image.Image, max_dim: int = 800) -> np.ndarray:
    """Salinan kelabu yang dikecilkan untuk analisis (bukan untuk output)."""
    im = img.copy()
    im.thumbnail((max_dim, max_dim))
    return cv2.cvtColor(np.asarray(im.convert("RGB")), cv2.COLOR_RGB2GRAY)


def blur_score(img: Image.Image) -> float:
    return float(cv2.Laplacian(to_gray(img), cv2.CV_64F).var())


def dhash(img: Image.Image) -> int:
    """Hash persepsi 64-bit: duplikat/sudut hampir sama beri jarak Hamming kecil."""
    g = img.convert("L").resize((9, 8), Image.LANCZOS)
    px = np.asarray(g, dtype=np.int16)
    bits = (px[:, 1:] > px[:, :-1]).flatten()
    return int("".join("1" if b else "0" for b in bits), 2)


def hamming(a: int, b: int) -> int:
    return bin(a ^ b).count("1")


def subject_pos(img: Image.Image) -> str | None:
    """object-position CSS supaya subjek nampak dalam kotak galeri 340x260.

    Subjek dianggar dari pusat jisim peta tenaga (magnitud Sobel dilembutkan):
    makanan/subjek bertekstur menumpu tenaga, meja/langit kosong tidak. Ini
    punca asal isu 'gambar tak nampak makanan' - subjek foto menegak dari
    telefon selalunya di bahagian bawah bingkai, bukan di tengah.
    """
    g = to_gray(img).astype(np.float64)
    gx = cv2.Sobel(g, cv2.CV_64F, 1, 0)
    gy = cv2.Sobel(g, cv2.CV_64F, 0, 1)
    energy = cv2.GaussianBlur(np.hypot(gx, gy), (0, 0), sigmaX=15)
    total = energy.sum()
    if total <= 0:
        return None
    h, w = energy.shape
    ys, xs = np.mgrid[0:h, 0:w]
    cx = 100.0 * (energy * xs).sum() / total / (w - 1)
    cy = 100.0 * (energy * ys).sum() / total / (h - 1)
    # Kekang supaya crop tak melampau, dan lekat ke "center" jika hampir.
    cx = min(80.0, max(20.0, cx))
    cy = min(80.0, max(20.0, cy))
    x = "center" if 42 <= cx <= 58 else f"{cx:.0f}%"
    y = "center" if 42 <= cy <= 58 else f"{cy:.0f}%"
    if x == "center" and y == "center":
        return None  # lalai CSS sudah betul
    return f"{x} {y}"


def enhance(img: Image.Image, needs_sharpen: bool) -> Image.Image:
    """Resipi sama dengan galeri sedia ada: lebar maks 900, sedikit kontras."""
    img = img.convert("RGB")
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        img = img.resize((MAX_WIDTH, round(img.height * ratio)), Image.LANCZOS)
    if needs_sharpen:
        img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=3))
    else:
        img = img.filter(ImageFilter.UnsharpMask(radius=1.5, percent=60, threshold=3))
    img = ImageEnhance.Contrast(img).enhance(1.06)
    img = ImageEnhance.Brightness(img).enhance(1.01)
    return img


# ------------------------------------------------------ Preview / notifikasi --

def analyze_incoming(manifest: dict) -> list[tuple[str, str, str]]:
    """Preview (read-only) keputusan publish untuk gambar dalam incoming/,
    guna peraturan SAMA dengan mode_publish: hanya MAX_BATCH terbaru dipertimbang,
    tolak kabur (< BLUR_REJECT), skip duplikat (dHash <= DUP_DISTANCE lawan galeri
    sedia ada + gambar terdahulu dalam batch). TIDAK mengubah/memadam apa-apa fail.
    Pulang [(nama, verdikt, detail)] verdikt: publish|duplicate|blur|ignored.

    Nota: ini anggaran pada masa gambar tiba - larian publish sebenar (00:00 MYT)
    boleh beza jika lebih gambar masuk kemudian."""
    files = sorted(INCOMING.glob("*.jpg"), key=lambda p: p.name, reverse=True) \
        if INCOMING.is_dir() else []
    batch, ignored = files[:MAX_BATCH], files[MAX_BATCH:]

    known_hashes: list[int] = []
    for entry in manifest.get("images", []):
        p = ROOT / entry["src"]
        if p.exists():
            try:
                with Image.open(p) as im:
                    known_hashes.append(dhash(im))
            except OSError:
                pass

    out: list[tuple[str, str, str]] = []
    for path in batch:
        try:
            img = Image.open(io.BytesIO(path.read_bytes()))
            img.load()
        except OSError:
            out.append((path.name, "blur", "fail rosak"))
            continue
        score = blur_score(img)
        if score < BLUR_REJECT:
            out.append((path.name, "blur", f"kabur (skor {score:.0f})"))
            continue
        h = dhash(img)
        if any(hamming(h, k) <= DUP_DISTANCE for k in known_hashes):
            out.append((path.name, "duplicate", "hampir sama dgn gambar sedia ada"))
            continue
        known_hashes.append(h)
        out.append((path.name, "publish", f"unik (skor {score:.0f})"))
    for path in ignored:
        out.append((path.name, "ignored", f"melebihi {MAX_BATCH} terbaru"))
    return out


def notify_incoming_queue(token: str, chat_id: str, just_saved: str) -> None:
    """Hantar ringkasan giliran incoming/ ke Telegram serta-merta selepas gambar
    galeri ditangkap (laluan webhook). Beritahu owner gambar mana yang MASUK
    giliran dan (anggaran) mana yang akan terbit vs di-skip. Gagal senyap -
    notifikasi tak sepatutnya menggagalkan penangkapan gambar."""
    try:
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        rows = analyze_incoming(manifest)
    except (OSError, ValueError) as e:
        print(f"AMARAN: notifikasi giliran gagal ({e}) - dilangkau")
        return
    status = {
        "publish": "✅ unik — akan terbit",
        "duplicate": "⏭️ hampir sama dgn gambar sedia ada — akan di-skip",
        "blur": "❌ kabur — akan di-skip",
        "ignored": f"⏸️ melebihi {MAX_BATCH} terbaru — tunggu giliran berikut",
    }
    mine = next((v for n, v, _ in rows if n == just_saved), "publish")
    n_pub = sum(1 for _, v, _ in rows if v == "publish")
    tg_send(token, chat_id,
            f"📸 Gambar diterima: {just_saved}\n"
            f"Status (anggaran): {status.get(mine, mine)}\n"
            f"Giliran galeri: {len(rows)} gambar · {n_pub} akan terbit · "
            f"terbit ~00:00 MYT.")


# ------------------------------------------------------------------ Publish --

def mode_publish() -> None:
    files = sorted(INCOMING.glob("*.jpg"), key=lambda p: p.name, reverse=True) \
        if INCOMING.is_dir() else []
    if not files:
        # Jangan tulis apa-apa: minggu tanpa gambar mesti berlalu senyap
        # (tiada perubahan repo -> tiada commit -> tiada notifikasi).
        print("tiada gambar dalam incoming/ - skip")
        return

    batch, ignored = files[:MAX_BATCH], files[MAX_BATCH:]
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    # Hash galeri sedia ada untuk semakan duplikat (webp dibaca terus).
    known_hashes: list[int] = []
    for entry in manifest["images"]:
        p = ROOT / entry["src"]
        if p.exists():
            try:
                with Image.open(p) as im:
                    known_hashes.append(dhash(im))
            except OSError:
                pass

    published, rejected = [], []
    used_captions: set[int] = set()
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    AUTO_DIR.mkdir(parents=True, exist_ok=True)

    for path in batch:
        base = path.stem  # tg-YYYYMMDD-uniq
        try:
            img = Image.open(io.BytesIO(path.read_bytes()))
            img.load()
        except OSError:
            rejected.append((path.name, "fail imej rosak"))
            continue

        score = blur_score(img)
        if score < BLUR_REJECT:
            rejected.append((path.name, f"terlalu kabur (skor {score:.0f})"))
            print(f"TOLAK {path.name}: kabur, skor {score:.0f}")
            continue

        h = dhash(img)
        if any(hamming(h, k) <= DUP_DISTANCE for k in known_hashes):
            rejected.append((path.name, "hampir sama dengan gambar sedia ada"))
            print(f"SKIP {path.name}: duplikat/sudut hampir sama")
            continue
        known_hashes.append(h)

        pos = subject_pos(img)
        out = enhance(img, needs_sharpen=score < BLUR_SHARPEN)
        out.save(AUTO_DIR / f"{base}.jpg", quality=JPG_QUALITY)
        out.save(AUTO_DIR / f"{base}.webp", quality=WEBP_QUALITY)

        alt_ms, alt_en = pick_caption(h, used_captions)
        entry = {
            "src": f"img/auto/{base}.webp",
            "w": out.width, "h": out.height,
            "altMs": alt_ms,
            "altEn": alt_en,
            "added": today,
        }
        if pos:
            entry["pos"] = pos
        published.append(entry)
        print(f"LULUS {path.name} -> {entry['src']} (pos: {pos or 'center'}, blur {score:.0f})")

    # Terbaru di DEPAN galeri; had 30 dikuatkuasakan oleh build-gallery.php.
    manifest["images"] = published + manifest["images"]
    MANIFEST.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=4) + "\n", encoding="utf-8"
    )

    for f in files:  # kosongkan incoming (termasuk yang diabaikan)
        f.unlink()

    SUMMARY_FILE.parent.mkdir(exist_ok=True)
    lines = [f"Galeri cabinrose.my dikemas kini: {len(published)} diterbitkan, "
             f"{len(rejected)} ditolak."]
    lines += [f"+ {p['src'].rsplit('/', 1)[-1]}" for p in published]
    lines += [f"x {name}: {why}" for name, why in rejected]
    if ignored:
        lines.append(f"({len(ignored)} gambar lebih lama diabaikan - hanya "
                     f"{MAX_BATCH} terbaru diambil)")
    SUMMARY_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(f"selesai: {len(published)} diterbitkan, {len(rejected)} ditolak, "
          f"{len(ignored)} diabaikan")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    if mode == "fetch":
        mode_fetch()
    elif mode == "publish":
        mode_publish()
    elif mode == "webhook":
        mode_webhook()
    else:
        sys.exit("Guna: python agent.py fetch|publish|webhook")
