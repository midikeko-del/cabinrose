<?php
/**
 * Jana blok "Yang wajib cuba" (bento 4 sel) dalam index.html daripada
 * img/wajibcuba.json.
 *
 * wajibcuba.json ialah SUMBER TUNGGAL. Ia dikemas kini oleh agent.py (arahan
 * Telegram /wajibcuba) — lihat CLAUDE.md. Skrip ini menyuntik 4 artikel
 * antara penanda dalam index.html:
 *   <!-- AUTO-WAJIBCUBA:START -->  ...  <!-- AUTO-WAJIBCUBA:END -->
 * Jangan sunting kandungan antara penanda secara manual.
 *
 * Guna:  php tools/build-wajibcuba.php
 * Selepas itu WAJIB jalankan: php tools/build-en.php  (jana blok EN /en/)
 *
 * Nota: index.html guna CRLF; skrip ini mengeluarkan CRLF juga.
 */

require_once __DIR__ . "/render-wajibcuba.php";

$root = dirname(__DIR__);
$manifestFile = "$root/img/wajibcuba.json";
$htmlFile = "$root/index.html";

$manifest = json_decode(file_get_contents($manifestFile), true);
if ($manifest === null) {
    fwrite(STDERR, "RALAT: img/wajibcuba.json bukan JSON sah: " . json_last_error_msg() . "\n");
    exit(1);
}
$items = $manifest["items"] ?? [];
if (count($items) !== 4) {
    fwrite(STDERR, "AMARAN: dijangka 4 item wajibcuba, dapat " . count($items) . "\n");
}

// Semak fail imej wujud (amaran sahaja - jangan gagalkan build).
foreach ($items as $it) {
    if (!empty($it["img"]) && !file_exists("$root/" . $it["img"])) {
        fwrite(STDERR, "AMARAN: imej wajibcuba tiada: " . $it["img"] . "\n");
    }
}

$blok = render_wajibcuba_block($items, "ms");

$html = file_get_contents($htmlFile);
$pattern = '/(<!-- AUTO-WAJIBCUBA:START -->).*?(<!-- AUTO-WAJIBCUBA:END -->)/s';
if (!preg_match($pattern, $html)) {
    fwrite(STDERR, "RALAT: penanda AUTO-WAJIBCUBA tidak dijumpai dalam index.html\n");
    exit(1);
}
// Callback, bukan rujukan $1: elak aksara dalam blok ditafsir sebagai rujukan
// tangkapan (konsisten dengan build-gallery.php / build-notis.php).
$html = preg_replace_callback($pattern, function ($m) use ($blok) {
    return $m[1] . "\r\n" . $blok . "\r\n      " . $m[2];
}, $html);
file_put_contents($htmlFile, $html);

printf("wajibcuba: %d kad disuntik ke index.html\n", count($items));
printf("PERINGATAN: jalankan 'php tools/build-en.php' untuk kemas kini /en/\n");
