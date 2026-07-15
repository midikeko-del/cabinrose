<?php
// get_settings.php - API JSON untuk menyalurkan tetapan dari MySQL ke Frontend

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Untuk mengelakkan masalah CORS jika diuji secara tempatan

require_once 'config.php';

$settings = [];

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
        while ($row = $stmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    } catch (Exception $e) {
        error_log("Failed to fetch settings: " . $e->getMessage());
    }
}

echo json_encode($settings);
