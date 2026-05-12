<?php
/**
 * Projekt: Foto Geo-Tool
 * Datei: https://gabischatz.de.cool/FotoGeoTool/delete.php
 * Autor: Lutz Müller
 * Programmiersprache: PHP
 *
 * Cronik:
 *   Version-Datum:
 *     0.0.1, 2.5.2026, 11:46:01 // UTC+2 Deutschland
 *      - Datei erstellt
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$uploadDir = __DIR__ . '/uploads/';
$input = json_decode(file_get_contents('php://input'), true);
$sessionId = $input['session_id'] ?? null;

if (!$sessionId) {
    echo json_encode(['success' => false, 'error' => 'Keine Session-ID']);
    exit;
}

$sessionDir = $uploadDir . preg_replace('/[^a-zA-Z0-9_-]/', '', $sessionId) . '/';

if (is_dir($sessionDir)) {
    $files = glob($sessionDir . '*.*');
    foreach ($files as $file) {
        unlink($file);
    }
    rmdir($sessionDir);
    echo json_encode(['success' => true, 'message' => 'Session-Ordner gelöscht']);
} else {
    echo json_encode(['success' => true, 'message' => 'Ordner nicht gefunden (bereits gelöscht)']);
}
?>