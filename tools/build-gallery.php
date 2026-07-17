<?php
/**
 * Jana blok galeri dalam index.html daripada img/gallery.json.
 *
 * gallery.json ialah SUMBER TUNGGAL untuk galeri. Susunan dalam manifest =
 * susunan paparan (terbaru di depan). Jika entri melebihi maxImages (30),
 * yang paling bawah (paling lama) digugurkan daripada paparan - fail imejnya
 * TIDAK dipadam (master kekal dalam repo).
 *
 * Blok yang dijana terletak antara penanda dalam index.html:
 *   <!-- AUTO-GALLERY:START -->  ...  <!-- AUTO-GALLERY:END -->
 * Jangan sunting kandungan antara penanda itu secara manual.
 *
 * Guna:  php tools/build-gallery.php
 * Selepas itu WAJIB jalankan: php tools/build-en.php
 *
 * Nota: index.html guna CRLF; skrip ini mengeluarkan CRLF juga.
 */

$root = dirname(__DIR__);
$manifestFile = "$root/img/gallery.json";
$htmlFile = "$root/index.html";

$manifest = json_decode(file_get_contents($manifestFile), true);
if ($manifest === null) {
    fwrite(STDERR, "RALAT: img/gallery.json bukan JSON sah: " . json_last_error_msg() . "\n");
    exit(1);
}

$max = isset($manifest["maxImages"]) ? (int) $manifest["maxImages"] : 30;
$images = $manifest["images"];

if (count($images) > $max) {
    $dropped = array_slice($images, $max);
    $images = array_slice($images, 0, $max);
    foreach ($dropped as $d) {
        printf("digugurkan dari paparan (melebihi %d): %s\n", $max, $d["src"]);
    }
    // Tulis balik manifest yang sudah dipangkas supaya keadaan kekal konsisten.
    $manifest["images"] = $images;
    file_put_contents($manifestFile, json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n");
}

function eskepAttr($s) {
    return str_replace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], (string) $s);
}

$rows = [];
$missing = [];
foreach ($images as $img) {
    if (!file_exists("$root/" . $img["src"])) $missing[] = $img["src"];
    $style = isset($img["pos"]) && $img["pos"] !== ""
        ? ' style="object-position: ' . eskepAttr($img["pos"]) . ';"'
        : "";
    $rows[] = '        <figure class="gallery-slide"><img src="' . eskepAttr($img["src"])
        . '" alt="' . eskepAttr($img["altMs"])
        . '" loading="lazy" width="' . (int) $img["w"] . '" height="' . (int) $img["h"] . '"'
        . $style . '></figure>';
}
if ($missing) {
    fwrite(STDERR, "AMARAN: fail imej tiada: " . implode(", ", $missing) . "\n");
}

$blok = implode("\r\n", $rows);

$html = file_get_contents($htmlFile);
// Penanda mungkin dipisah CRLF; guna corak yang abaikan jenis hujung baris.
$pattern = '/(<!-- AUTO-GALLERY:START -->).*?(<!-- AUTO-GALLERY:END -->)/s';
if (!preg_match($pattern, $html)) {
    fwrite(STDERR, "RALAT: penanda AUTO-GALLERY tidak dijumpai dalam index.html\n");
    exit(1);
}
// Callback, bukan rujukan $1: alt boleh mengandungi aksara yang ditafsir preg.
$html = preg_replace_callback($pattern, function ($m) use ($blok) {
    return $m[1] . "\r\n" . $blok . "\r\n        " . $m[2];
}, $html);
file_put_contents($htmlFile, $html);

printf("galeri dijana: %d slaid (had %d)\n", count($images), $max);
printf("PERINGATAN: jalankan 'php tools/build-en.php' untuk kemas kini /en/\n");
