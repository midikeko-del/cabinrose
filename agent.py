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
OFFSET_FILE = ROOT / "state" / "telegram-offset.txt"
SUMMARY_FILE = ROOT / "state" / "last-run.txt"

MAX_BATCH = 5          # hanya 5 gambar terbaru diproses setiap minggu
MAX_WIDTH = 900        # sama dengan resipi galeri sedia ada (towebp.php)
BLUR_REJECT = 30.0     # varians Laplacian bawah ini = kabur teruk -> tolak
BLUR_SHARPEN = 100.0   # bawah ini = kabur sikit -> tajamkan dahulu
DUP_DISTANCE = 10      # jarak Hamming dHash <= ini = duplikat -> skip
JPG_QUALITY = 92       # master
WEBP_QUALITY = 82      # dihidangkan


# ---------------------------------------------------------------- Telegram --

def tg_call(token: str, method: str, **params):
    r = requests.get(
        f"https://api.telegram.org/bot{token}/{method}", params=params, timeout=60
    )
    data = r.json()
    if not data.get("ok"):
        sys.exit(f"RALAT: {method} balas ralat: {str(data)[:300]}")
    return data["result"]


def mode_fetch() -> None:
    import os

    token = os.environ.get("TELEGRAM_TOKEN")
    chat_id = os.environ.get("TELEGRAM_CHAT_ID")
    if not token or not chat_id:
        sys.exit("RALAT: TELEGRAM_TOKEN / TELEGRAM_CHAT_ID tiada dalam env")

    INCOMING.mkdir(exist_ok=True)
    OFFSET_FILE.parent.mkdir(exist_ok=True)
    offset = int(OFFSET_FILE.read_text().strip() or 0) if OFFSET_FILE.exists() else 0

    updates = tg_call(
        token, "getUpdates",
        offset=offset + 1, timeout=0, allowed_updates='["message"]',
    )

    saved, max_id = 0, offset
    for u in updates:
        max_id = max(max_id, int(u["update_id"]))
        msg = u.get("message") or {}
        if str(msg.get("chat", {}).get("id", "")) != str(chat_id):
            continue
        if not msg.get("photo"):
            continue
        photo = msg["photo"][-1]  # saiz terbesar
        uniq = re.sub(r"[^A-Za-z0-9_-]", "", photo["file_unique_id"])
        date = datetime.fromtimestamp(int(msg["date"]), tz=timezone.utc).strftime("%Y%m%d")
        dest = INCOMING / f"tg-{date}-{uniq}.jpg"
        if dest.exists():  # dedup harian
            continue
        file_info = tg_call(token, "getFile", file_id=photo["file_id"])
        r = requests.get(
            f"https://api.telegram.org/file/bot{token}/{file_info['file_path']}",
            timeout=120,
        )
        if r.status_code != 200 or not r.content:
            print(f"AMARAN: gagal muat turun {uniq} - dilangkau")
            continue
        dest.write_bytes(r.content)
        saved += 1
        print(f"disimpan: {dest.name} ({len(r.content) / 1024:.0f}KB)")

    OFFSET_FILE.write_text(f"{max_id}\n")
    print(f"selesai: {len(updates)} update disemak, {saved} gambar baru, offset={max_id}")


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
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    monthyear = datetime.now(timezone.utc).strftime("%B %Y")
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

        entry = {
            "src": f"img/auto/{base}.webp",
            "w": out.width, "h": out.height,
            # Tiada AI untuk kapsyen - alt generik; boleh diperelok manual
            # dalam img/gallery.json bila-bila masa.
            "altMs": f"Hidangan dan suasana terkini di Cabin Rose Station ({monthyear})",
            "altEn": f"Latest food and vibes at Cabin Rose Station ({monthyear})",
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
    else:
        sys.exit("Guna: python agent.py fetch|publish")
