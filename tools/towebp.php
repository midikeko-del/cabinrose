<?php
/**
 * Tukar imej dalam img/ ke WebP dan jana img/og-image.jpg.
 *
 * JPEG/PNG asal ialah MASTER - ia dikekalkan dalam repo dan skrip ini sentiasa
 * membaca daripadanya, jadi selamat dijalankan berulang kali. Laman hanya
 * merujuk fail .webp yang terhasil.
 *
 * Mesin ini tiada cwebp mahupun ImageMagick; kita guna GD dalam PHP XAMPP
 * (php.exe -r "var_dump(function_exists('imagewebp'));" patut bagi true).
 *
 * Guna:  php tools/towebp.php
 *
 * Bila tambah imej baru: masukkan dalam $jobs, jalankan skrip, kemudian rujuk
 * nama .webp itu dalam index.html / css / main.js. Jangan lupa jana semula EN:
 * php tools/build-en.php
 */

$dir = dirname(__DIR__) . "/img";

/**
 * fail sumber => [lebar maks, kualiti, nama output]
 *   lebar maks null = kekalkan dimensi asal
 *   kualiti 82 = lalai selamat; turunkan hanya bila imej bertutup/kecil
 *
 * Nama output WAJIB eksplisit. drinks.jpg dan drinks.png ialah dua imej
 * berlainan yang berkongsi batang nama - penamaan automatik pernah menjadikan
 * kedua-duanya "drinks.webp" dan yang kecil menimpa yang besar.
 */
$jobs = [
    "hero_food.jpg"    => [null, 74, "hero_food.webp"],   // latar hero, elemen LCP (tertutup kecerunan gelap, kualiti rendah tak ketara)
    // Sel bento maks ~570px lebar dan bertutup kecerunan gelap + teks,
    // jadi kualiti lebih rendah tidak ketara di sini.
    "corndog.jpg"      => [800, 72, "corndog.webp"],
    "buttermilk.jpg"   => [null, 82, "buttermilk.webp"],
    "chicken_chop.jpg" => [null, 82, "chicken_chop.webp"],
    "drinks.jpg"       => [null, 82, "drinks.webp"],
    "interior.jpg"     => [null, 82, "interior.webp"],
    "signage.jpg"      => [800, 82, "signage.webp"],       // dipapar ~550px lebar
    "event.jpg"        => [900, 82, "event.webp"],         // dipapar ~550px lebar
    // Galeri baru (Julai 2026) - slaid dipapar maks 340px lebar (CSS),
    // 900px master beri margin retina yang cukup.
    "storefront.jpg"      => [900, 82, "storefront.webp"],
    "burger.jpg"           => [900, 82, "burger.webp"],
    "grilled_ribs.jpg"     => [900, 82, "grilled_ribs.webp"],
    "grilled_chicken.jpg"  => [900, 82, "grilled_chicken.webp"],
    "chicken_pasta.jpg"    => [900, 82, "chicken_pasta.webp"],
    "iced_coffee.jpg"      => [900, 82, "iced_coffee.webp"],
    "fruit_drinks.jpg"     => [900, 82, "fruit_drinks.webp"],
    "waffle_corndog.jpg"   => [900, 82, "waffle_corndog.webp"],
    // Tiga ini hanya muncul sebagai bulatan 44px dalam modal menu.
    "dessert.jpg"      => [200, 82, "dessert-menu.webp"],
    "food.jpg"         => [200, 82, "food-menu.webp"],
    "drinks.png"       => [200, 82, "drinks-menu.webp"],
    // Poster menu penuh (15 muka) dipapar bertindan dalam modal "Menu Penuh".
    // Modal maks 720px lebar; 1200px master beri teks tajam pada retina.
    // Sumber & output dalam subfolder img/menu/.
    "menu/page-01.jpg" => [1200, 80, "menu/page-01.webp"],
    "menu/page-02.jpg" => [1200, 80, "menu/page-02.webp"],
    "menu/page-03.jpg" => [1200, 80, "menu/page-03.webp"],
    "menu/page-04.jpg" => [1200, 80, "menu/page-04.webp"],
    "menu/page-05.jpg" => [1200, 80, "menu/page-05.webp"],
    "menu/page-06.jpg" => [1200, 80, "menu/page-06.webp"],
    "menu/page-07.jpg" => [1200, 80, "menu/page-07.webp"],
    "menu/page-08.jpg" => [1200, 80, "menu/page-08.webp"],
    "menu/page-09.jpg" => [1200, 80, "menu/page-09.webp"],
    "menu/page-10.jpg" => [1200, 80, "menu/page-10.webp"],
    "menu/page-11.jpg" => [1200, 80, "menu/page-11.webp"],
    "menu/page-12.jpg" => [1200, 80, "menu/page-12.webp"],
    "menu/page-13.jpg" => [1200, 80, "menu/page-13.webp"],
    "menu/page-14.jpg" => [1200, 80, "menu/page-14.webp"],
    "menu/page-15.jpg" => [1200, 80, "menu/page-15.webp"],
];

/* ---------- Semakan awal: nama output bertindih ---------- */
// Gagal awal, bukan menulis ganti separuh jalan.
$byOut = [];
foreach ($jobs as $file => [$maxW, $q, $outName]) {
    $byOut[$outName][] = $file;
}
$clash = false;
foreach ($byOut as $outName => $sources) {
    if (count($sources) > 1) {
        fwrite(STDERR, "RALAT: $outName dihasilkan oleh " . implode(" dan ", $sources) . "\n");
        $clash = true;
    }
}
if ($clash) {
    fwrite(STDERR, "Batal - beri nama output berbeza dahulu.\n");
    exit(1);
}

function load($path) {
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    return $ext === "png" ? imagecreatefrompng($path) : imagecreatefromjpeg($path);
}

/* ---------- Tukar ---------- */
$totalBefore = 0;
$totalAfter  = 0;
$grew = [];

foreach ($jobs as $file => [$maxW, $q, $outName]) {
    $src = "$dir/$file";
    if (!file_exists($src)) { printf("%-20s HILANG - dilangkau\n", $file); continue; }

    $im = load($src);
    if (!$im) { printf("%-20s GAGAL BACA - dilangkau\n", $file); continue; }

    $w = imagesx($im);
    $h = imagesy($im);

    if ($maxW !== null && $w > $maxW) {
        $nh = (int) round($h * ($maxW / $w));
        $re = imagecreatetruecolor($maxW, $nh);
        imagecopyresampled($re, $im, 0, 0, 0, 0, $maxW, $nh, $w, $h);
        imagedestroy($im);
        $im = $re;
        $w = $maxW;
        $h = $nh;
    }

    imagewebp($im, "$dir/$outName", $q);
    imagedestroy($im);

    $before = filesize($src);
    $after  = filesize("$dir/$outName");
    $totalBefore += $before;
    $totalAfter  += $after;

    // WebP boleh jadi LEBIH BESAR untuk JPEG kecil yang sudah dimampat elok.
    if ($after >= $before) $grew[] = $outName;

    printf("%-20s %5dx%-5d %6.0fKB -> %6.0fKB  (%+d%%)\n",
        $file, $w, $h, $before / 1024, $after / 1024,
        (int) round(($after / $before * 100) - 100));
}

printf("\nJUMLAH: %.0fKB -> %.0fKB  (jimat %.0fKB, -%d%%)\n",
    $totalBefore / 1024, $totalAfter / 1024, ($totalBefore - $totalAfter) / 1024,
    round(100 - ($totalAfter / $totalBefore * 100)));

if ($grew) {
    printf("AMARAN: %s jadi lebih besar - kecilkan dimensinya atau kekal guna fail asal\n",
        implode(", ", $grew));
}

/* ---------- Imej og: potong tengah 1200x630 ---------- */
$ogSrc = "$dir/hero_food.jpg";
if (!file_exists($ogSrc)) {
    fwrite(STDERR, "AMARAN: $ogSrc tiada - og-image.jpg tidak dijana\n");
    exit(0);
}

$im = imagecreatefromjpeg($ogSrc);
$w = imagesx($im);
$h = imagesy($im);

$targetW = 1200;  // saiz yang WhatsApp/Facebook jangka untuk pratonton besar
$targetH = 630;
$targetRatio = $targetW / $targetH;

// Ambil kawasan terbesar dari sumber yang padan nisbah 1200:630
if (($w / $h) > $targetRatio) {
    $cropH = $h;
    $cropW = (int) round($h * $targetRatio);
} else {
    $cropW = $w;
    $cropH = (int) round($w / $targetRatio);
}

$og = imagecreatetruecolor($targetW, $targetH);
imagecopyresampled($og, $im, 0, 0,
    (int) round(($w - $cropW) / 2), (int) round(($h - $cropH) / 2),
    $targetW, $targetH, $cropW, $cropH);
imagejpeg($og, "$dir/og-image.jpg", 86);
imagedestroy($og);
imagedestroy($im);

printf("og-image.jpg         %dx%d  %.0fKB (potong %dx%d dari %dx%d)\n",
    $targetW, $targetH, filesize("$dir/og-image.jpg") / 1024, $cropW, $cropH, $w, $h);
