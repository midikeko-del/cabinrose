<?php
// config.php - Konfigurasi Sambungan MySQL menggunakan PDO

$db_host = 'localhost';
$db_name = 'cabinrose';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Jika tidak dapat menyambung, biarkan pautan gagal secara senyap atau log ralat
    // Ini mengelakkan landing page utama rosak jika database belum sedia
    error_log("Database connection failed: " . $e->getMessage());
    $pdo = null;
}
