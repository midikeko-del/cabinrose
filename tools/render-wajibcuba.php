<?php
/**
 * Fungsi render dikongsi untuk blok "Yang wajib cuba" (bento 4 sel).
 *
 * Dipanggil oleh:
 *   tools/build-wajibcuba.php  -> render BM ke index.html
 *   tools/build-en.php         -> render EN ke en/index.html
 *
 * Sumber tunggal kandungan ialah img/wajibcuba.json (lihat komen di sana).
 * Kedua-dua bahasa dijana dari manifest yang SAMA supaya /en/ sentiasa padan
 * dengan / — tiada data-i18n di sini (build-en.php ganti blok ini terus).
 *
 * Nota: index.html guna CRLF; blok dikembalikan dengan "\r\n".
 */

function wc_escape($s)
{
    return str_replace(['&', '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], (string) $s);
}

/**
 * Bina HTML 4 artikel bento (tanpa <div class="bento"> pembungkus, tanpa
 * penanda). $lang = "ms" | "en". Item diisih ikut slot 1..4.
 */
function render_wajibcuba_block(array $items, string $lang): string
{
    usort($items, fn($a, $b) => ($a['slot'] ?? 0) <=> ($b['slot'] ?? 0));

    $nameKey = $lang === "en" ? "nameEn" : "nameMs";
    $descKey = $lang === "en" ? "descEn" : "descMs";
    $tagKey  = $lang === "en" ? "tagEn" : "tagMs";
    $altSuffix = $lang === "en" ? "at Cabin Rose Station" : "di Cabin Rose Station";

    $I = "        ";  // indent asas 8 ruang (dalam <div class="bento">)
    $out = [];

    foreach ($items as $it) {
        $slot = (int) ($it["slot"] ?? 0);
        $name = wc_escape($it[$nameKey] ?? "");
        $desc = wc_escape($it[$descKey] ?? "");
        $tag  = trim((string) ($it[$tagKey] ?? ""));
        $img  = wc_escape($it["img"] ?? "");
        $w    = (int) ($it["w"] ?? 0);
        $h    = (int) ($it["h"] ?? 0);
        // Alt guna nama mentah (nama sudah di-escape; buang entiti utk teks alt
        // ringkas namun selamat — wc_escape sudah tangani petik/kurung).
        $alt  = wc_escape(($it[$nameKey] ?? "") . " " . $altSuffix);

        if ($slot === 1) {
            // Panel jenama bergambar penuh. Imej ialah <img class=cell-feature-bg>
            // (bukan latar CSS) supaya boleh ditukar dari manifest.
            $out[] = $I . '<article class="cell cell-feature reveal">';
            $out[] = $I . '  <img class="cell-feature-bg" src="' . $img . '" alt="' . $alt
                   . '" loading="lazy" width="' . $w . '" height="' . $h . '">';
            if ($tag !== "") {
                $out[] = $I . '  <p class="cell-tag">' . wc_escape($tag) . '</p>';
            }
            $out[] = $I . '  <h3>' . $name . '</h3>';
            $out[] = $I . '  <p>' . $desc . '</p>';
            $out[] = $I . '</article>';
        } else {
            $cls = $slot === 4 ? "cell cell-wide reveal" : "cell reveal";
            $out[] = $I . '<article class="' . $cls . '">';
            $out[] = $I . '  <img src="' . $img . '" alt="' . $alt
                   . '" loading="lazy" width="' . $w . '" height="' . $h . '">';
            $out[] = $I . '  <div class="cell-body">';
            if ($tag !== "") {
                $out[] = $I . '    <p class="cell-tag cell-tag-inline">' . wc_escape($tag) . '</p>';
            }
            $out[] = $I . '    <h3>' . $name . '</h3>';
            $out[] = $I . '    <p>' . $desc . '</p>';
            $out[] = $I . '  </div>';
            $out[] = $I . '</article>';
        }
    }

    return implode("\r\n", $out);
}
