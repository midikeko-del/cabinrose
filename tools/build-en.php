<?php
/**
 * Jana en/index.html daripada index.html.
 *
 * index.html ialah SUMBER TUNGGAL (versi BM). Skrip ini mengambil teks EN
 * daripada kamus I18N dalam js/main.js, jadi terjemahan hanya wujud di satu
 * tempat. Jangan sunting en/index.html secara manual - ia akan ditulis ganti.
 *
 * Guna:  php tools/build-en.php
 */

$root = dirname(__DIR__);
$srcFile = "$root/index.html";
$jsFile  = "$root/js/main.js";
$outDir  = "$root/en";
$outFile = "$outDir/index.html";

/* ---------- 1. Ambil kamus EN daripada main.js ---------- */
$js = file_get_contents($jsFile);
// Nilai kamus ialah string biasa tanpa kurungan dalamnya, jadi padanan
// hingga '}' pertama selamat di sini.
if (!preg_match('/\ben:\s*\{([^}]*)\}/s', $js, $m)) {
    fwrite(STDERR, "RALAT: blok kamus 'en' tidak dijumpai dalam js/main.js\n");
    exit(1);
}
$dict = json_decode('{' . $m[1] . '}', true);
if ($dict === null) {
    fwrite(STDERR, "RALAT: kamus EN bukan JSON sah: " . json_last_error_msg() . "\n");
    exit(1);
}

/* ---------- 2. Ganti kandungan setiap elemen data-i18n ---------- */
$html = file_get_contents($srcFile);

$missing = [];
$replaced = 0;
$html = preg_replace_callback(
    '/<(\w+)([^>]*\bdata-i18n="([^"]+)"[^>]*)>(.*?)<\/\1>/s',
    function ($m) use ($dict, &$missing, &$replaced) {
        $key = $m[3];
        if (!array_key_exists($key, $dict)) {
            $missing[] = $key;
            return $m[0];
        }
        $replaced++;
        return '<' . $m[1] . $m[2] . '>' . $dict[$key] . '</' . $m[1] . '>';
    },
    $html
);

/* ---------- 3. Teks dalam atribut (alt / aria-label / title) ---------- */
// Tidak boleh diambil dari kamus kerana ia bukan kandungan elemen.
// Alt galeri TIDAK lagi disenaraikan di sini - ia datang dari img/gallery.json
// (altMs => altEn), jadi imej galeri automatik turut diterjemah tanpa sunting
// fail ini.
$attrText = [
    // Satu entri meliputi 15 poster menu — nombor muka surat dikekalkan.
    'Menu Cabin Rose Station, muka surat'
        => 'Cabin Rose Station menu, page',
    'aria-label="Foto sebelumnya"' => 'aria-label="Previous photo"',
    'aria-label="Foto seterusnya"' => 'aria-label="Next photo"',
    'aria-label="Kad debit / kredit"' => 'aria-label="Debit / credit card"',
    'aria-label="Jenis tempahan"' => 'aria-label="Booking type"',
    'Kod QR DuitNow Cabin Rose Station (Public Bank)'
        => 'Cabin Rose Station DuitNow QR code (Public Bank)',
    'Logo Cabin Rose Station'   => 'Cabin Rose Station logo',
    'Buka menu navigasi'        => 'Open navigation menu',
    'Peta lokasi Cabin Rose Station' => 'Cabin Rose Station location map',
    'aria-label="Tutup"'        => 'aria-label="Close"',
    'Notis dan promosi terkini Cabin Rose Station'
        => 'Latest notice and promotion from Cabin Rose Station',
];

// Alt galeri daripada manifest (lihat tools/build-gallery.php).
$galeri = json_decode(file_get_contents("$root/img/gallery.json"), true);
if ($galeri === null) {
    fwrite(STDERR, "RALAT: img/gallery.json bukan JSON sah\n");
    exit(1);
}
foreach ($galeri["images"] as $g) {
    if (isset($g["altMs"], $g["altEn"]) && $g["altMs"] !== "") {
        $attrText[$g["altMs"]] = $g["altEn"];
    }
}

foreach ($attrText as $ms => $en) {
    $html = str_replace($ms, $en, $html);
}

/* ---------- 4. Kepala halaman ---------- */
$titleEn = 'Cabin Rose Station | First-Choice Western Cafe in Kemaman';
$descEn  = 'Western cafe in Kemaman. Cheesy corndogs, buttermilk rice, premium '
         . 'coffee &amp; desserts at Cabin Rose Station River Front. Muslim Bumiputera-owned, '
         . 'open daily until 11 PM.';
$ogDescEn = 'Western cafe in Kemaman. Cheesy corndogs, buttermilk rice, premium '
          . 'coffee &amp; desserts at Cabin Rose Station River Front. Muslim Bumiputera-owned.';

$head = [
    '<html lang="ms">' => '<html lang="en">',

    '<title>Cabin Rose Station | Cafe Western Pilihan Pertama di Kemaman</title>'
        => "<title>$titleEn</title>",

    '<meta name="description" content="Kafe western di Kemaman. Cheesy corndog, nasi buttermilk, kopi premium &amp; dessert di Cabin Rose Station River Front. Milik Muslim Bumiputera, buka setiap hari sampai 11 malam.">'
        => "<meta name=\"description\" content=\"$descEn\">",

    '<meta property="og:title" content="Cabin Rose Station | Cafe Western Pilihan Pertama di Kemaman">'
        => "<meta property=\"og:title\" content=\"$titleEn\">",

    '<meta property="og:description" content="Kafe western di Kemaman. Cheesy corndog, nasi buttermilk, kopi premium &amp; dessert di Cabin Rose Station River Front. Milik Muslim Bumiputera.">'
        => "<meta property=\"og:description\" content=\"$ogDescEn\">",

    '<meta property="og:image:alt" content="Hidangan western di Cabin Rose Station, Kemaman">'
        => '<meta property="og:image:alt" content="Western dishes at Cabin Rose Station, Kemaman">',

    '<meta property="og:url" content="https://cabinrose.my/">'
        => '<meta property="og:url" content="https://cabinrose.my/en/">',

    '<meta property="og:locale" content="ms_MY">'
        => '<meta property="og:locale" content="en_MY">',
    '<meta property="og:locale:alternate" content="en_MY">'
        => '<meta property="og:locale:alternate" content="ms_MY">',

    '<link rel="canonical" href="https://cabinrose.my/">'
        => '<link rel="canonical" href="https://cabinrose.my/en/">',

];
foreach ($head as $from => $to) {
    if (strpos($html, $from) === false) {
        fwrite(STDERR, "AMARAN: corak kepala tidak dijumpai:\n  $from\n");
    }
    $html = str_replace($from, $to, $html);
}

// Komen hreflang merentas dua baris; fail ini guna CRLF, jadi padanan
// literal tidak boleh diharap. Guna regex yang abaikan jenis hujung baris.
$commentPattern = '/<!-- Setiap bahasa mesti ada URL sendiri untuk hreflang\..*?-->/s';
$commentEn = "<!-- DIJANA AUTOMATIK oleh tools/build-en.php daripada index.html.\r\n"
           . "     Jangan sunting fail ini terus - suntingan akan hilang. -->";
if (!preg_match($commentPattern, $html)) {
    fwrite(STDERR, "AMARAN: komen hreflang tidak dijumpai\n");
}
$html = preg_replace($commentPattern, $commentEn, $html);

/* ---------- 4b. Bina semula FAQPage schema dalam EN ---------- */
// Google mengabaikan FAQ schema yang tidak sepadan dengan teks yang pelawat
// nampak. Kedua-duanya dibina daripada kunci faq.* yang sama, jadi ia tidak
// boleh terpisah.
$faq = [];
for ($i = 1; array_key_exists("faq.q$i", $dict); $i++) {
    if (!array_key_exists("faq.a$i", $dict)) {
        fwrite(STDERR, "AMARAN: faq.q$i ada tetapi faq.a$i tiada\n");
        break;
    }
    $faq[] = [
        "@type" => "Question",
        "name"  => html_entity_decode($dict["faq.q$i"], ENT_QUOTES, "UTF-8"),
        "acceptedAnswer" => [
            "@type" => "Answer",
            "text"  => html_entity_decode($dict["faq.a$i"], ENT_QUOTES, "UTF-8"),
        ],
    ];
}

// Bilangan mesti sepadan dengan <summary data-i18n="faq.q*"> dalam HTML.
$summaryCount = preg_match_all('/data-i18n="faq\.q\d+"/', $html);
if (count($faq) !== $summaryCount) {
    fwrite(STDERR, sprintf(
        "AMARAN: %d soalan dalam kamus tetapi %d dalam HTML - schema tidak akan sepadan\n",
        count($faq), $summaryCount
    ));
}

$faqJson = json_encode(
    ["@context" => "https://schema.org", "@type" => "FAQPage", "mainEntity" => $faq],
    JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
);

$faqPattern = '#(<script type="application/ld\+json" id="faq-schema">).*?(</script>)#s';
if (!preg_match($faqPattern, $html)) {
    fwrite(STDERR, "AMARAN: blok faq-schema tidak dijumpai dalam index.html\n");
}
// Callback, bukan rujukan $1: JSON boleh mengandungi backslash yang akan
// ditafsir sebagai rujukan tangkapan.
$html = preg_replace_callback($faqPattern, function ($m) use ($faqJson) {
    return $m[1] . "\r\n" . $faqJson . "\r\n  " . $m[2];
}, $html);

/* ---------- 5. Laluan aset naik satu tingkat ---------- */
// Hanya laluan relatif. URL mutlak (https://cabinrose.my/img/...) tidak disentuh
// kerana ia bermula dengan ="https:.
$html = preg_replace('/="(img|css|js)\//', '="../$1/', $html);

/* ---------- 6. Tulis ---------- */
if (!is_dir($outDir)) mkdir($outDir, 0777, true);
file_put_contents($outFile, $html);

/* ---------- Laporan ---------- */
printf("kunci data-i18n diganti : %d\n", $replaced);
if ($missing) {
    printf("TIADA DALAM KAMUS EN   : %s\n", implode(", ", array_unique($missing)));
}
printf("ditulis                 : en/index.html (%.1f KB)\n", filesize($outFile) / 1024);

// Semakan waras: tiada teks BM ketara tertinggal
$leftover = [];
foreach (['Tempah Sekarang', 'Lihat Menu', 'Buka setiap hari', 'Kata pengunjung',
          'Cari kami', 'Hak cipta', 'Soalan lazim', 'diuruskan oleh Muslim',
          'Kami buka setiap hari'] as $t) {
    if (strpos($html, $t) !== false) $leftover[] = $t;
}
echo $leftover
    ? "AMARAN teks BM tertinggal: " . implode(" | ", $leftover) . "\n"
    : "semakan teks BM tertinggal: bersih\n";
