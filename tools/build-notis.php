<?php
/**
 * Jana popup notis/promosi dalam index.html daripada img/notis.json.
 *
 * notis.json ialah SUMBER TUNGGAL untuk popup notis. Ia dikemas kini oleh
 * agent.py (arahan Telegram /notis) - lihat CLAUDE.md. Skrip ini menyuntik
 * blok popup antara penanda dalam index.html:
 *   <!-- AUTO-NOTIS:START -->  ...  <!-- AUTO-NOTIS:END -->
 * Jangan sunting kandungan antara penanda secara manual.
 *
 * Popup HANYA disuntik jika ada notis aktif DAN belum tamat (expiry >= hari
 * ini). Notis tamat digugurkan secara automatik (blok jadi kosong), jadi
 * larian harian workflow akan membersihkan notis lama dengan sendirinya.
 *
 * Guna:  php tools/build-notis.php
 * Selepas itu WAJIB jalankan: php tools/build-en.php
 *
 * Nota: index.html guna CRLF; skrip ini mengeluarkan CRLF juga.
 */

$root = dirname(__DIR__);
$manifestFile = "$root/img/notis.json";
$htmlFile = "$root/index.html";

$manifest = json_decode(file_get_contents($manifestFile), true);
if ($manifest === null) {
    fwrite(STDERR, "RALAT: img/notis.json bukan JSON sah: " . json_last_error_msg() . "\n");
    exit(1);
}

function eskepAttr($s) {
    return str_replace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], (string) $s);
}

$active = $manifest["active"] ?? null;
$today = gmdate("Y-m-d");        // UTC - selaras dengan agent.py
$blok = "";

if ($active && !empty($active["src"])) {
    $expiry = $active["expiry"] ?? "";
    if ($expiry === "" || $expiry >= $today) {
        if (!file_exists("$root/" . $active["src"])) {
            fwrite(STDERR, "AMARAN: fail flyer notis tiada: " . $active["src"] . "\n");
        }
        // Popup mula tersembunyi; js/main.js membukanya selepas mengesahkan
        // expiry (belt-and-suspenders jika build ini basi).
        $blok =
            '<div class="modal-latar notis-popup" id="notisPopup" data-expiry="'
            . eskepAttr($expiry) . '" hidden>' . "\r\n"
            . '  <div class="notis-card" role="dialog" aria-modal="true" aria-label="Notis Cabin Rose Station">' . "\r\n"
            . '    <button type="button" class="notis-close" id="notisClose" aria-label="Tutup"><i class="ph ph-x" aria-hidden="true"></i></button>' . "\r\n"
            . '    <img src="' . eskepAttr($active["src"]) . '" alt="Notis dan promosi terkini Cabin Rose Station" width="'
            . (int) ($active["w"] ?? 0) . '" height="' . (int) ($active["h"] ?? 0) . '" decoding="async">' . "\r\n"
            . '  </div>' . "\r\n"
            . '</div>';
    } else {
        printf("notis tamat (%s < %s) - blok dikosongkan\n", $expiry, $today);
    }
}

$html = file_get_contents($htmlFile);
$pattern = '/(<!-- AUTO-NOTIS:START -->).*?(<!-- AUTO-NOTIS:END -->)/s';
if (!preg_match($pattern, $html)) {
    fwrite(STDERR, "RALAT: penanda AUTO-NOTIS tidak dijumpai dalam index.html\n");
    exit(1);
}
// Callback, bukan rujukan $1: elak mana-mana aksara dalam blok ditafsir
// sebagai rujukan tangkapan (konsisten dengan build-gallery.php).
$html = preg_replace_callback($pattern, function ($m) use ($blok) {
    return $blok === ""
        ? $m[1] . $m[2]
        : $m[1] . "\r\n" . $blok . "\r\n    " . $m[2];
}, $html);
file_put_contents($htmlFile, $html);

printf("notis: %s\n", $blok === "" ? "tiada popup aktif" : "popup disuntik (tamat " . ($active["expiry"] ?? "?") . ")");
printf("PERINGATAN: jalankan 'php tools/build-en.php' untuk kemas kini /en/\n");
