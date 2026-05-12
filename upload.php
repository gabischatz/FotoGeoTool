<?php
/**
 * Projekt: Foto Geo-Tool
 * Datei: https://gabischatz.de.cool/FotoGeoTool/upload.php
 * Autor: Lutz Müller
 * Programmiersprache: PHP
 *
 * Cronik:
 *   Version-Datum:
 *     0.0.1, 2.5.2026, 11:46:01 // UTC+2 Deutschland
 *      - Datei erstellt
 *     0.1.7, 7.5.2026, 19:55:00 // UTC+2 Deutschland
 *      - Keywords, Beschreibung und Fortbewegungsart werden in die JSON-Metadaten geschrieben
     0.1.29, 8.5.2026 // UTC+2 Deutschland
      - Rückgabe einer öffentlichen Bild-URL für Google-Lens-Test ergänzt.
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    echo json_encode(['success' => true]);
    exit;
}

function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function public_base_url(): string {
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

    $scheme = $https ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'gabischatz.de.cool';
    $dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/FotoGeoTool/upload.php')), '/');

    return $scheme . '://' . $host . ($dir === '' ? '' : $dir);
}

function encode_path_part(string $part): string {
    return str_replace('%2F', '/', rawurlencode($part));
}

$uploadDir = __DIR__ . '/uploads/';

$sessionIdRaw = $_POST['session_id'] ?? date('Y-m-d');
$sessionId = preg_replace('/[^a-zA-Z0-9_-]/', '', (string)$sessionIdRaw);
if ($sessionId === '') {
    $sessionId = 'session_' . date('Ymd_His');
}

$sessionDir = $uploadDir . $sessionId . '/';

if (!is_dir($sessionDir) && !mkdir($sessionDir, 0755, true)) {
    json_response(['success' => false, 'error' => 'Upload-Ordner konnte nicht erstellt werden'], 500);
}

// Cleanup alte Dateien (älter als 24 Stunden)
$now = time();
if (is_dir($uploadDir)) {
    foreach (glob($uploadDir . '*', GLOB_ONLYDIR) ?: [] as $dir) {
        if (is_dir($dir) && filemtime($dir) < $now - 86400) {
            foreach (glob($dir . '/*.*') ?: [] as $file) {
                @unlink($file);
            }
            @rmdir($dir);
        }
    }
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    json_response(['success' => false, 'error' => 'Keine gültige Bilddatei empfangen'], 400);
}

$originalName = basename((string)$_FILES['image']['name']);
$filename = preg_replace('/[^\pL\pN._ \-()]/u', '_', $originalName);
$filename = trim($filename);
if ($filename === '') {
    $filename = 'foto_' . date('Ymd_His') . '.jpg';
}

$targetPath = $sessionDir . $filename;

$publicUrl = public_base_url()
    . '/uploads/'
    . encode_path_part($sessionId)
    . '/'
    . encode_path_part($filename);

$metadata = [
    'lat' => $_POST['lat'] ?? null,
    'lng' => $_POST['lng'] ?? null,
    'date' => $_POST['date'] ?? null,
    'keywords' => $_POST['keywords'] ?? '',
    'description' => $_POST['description'] ?? '',
    'transport_tag' => $_POST['transport_tag'] ?? '',
    'public_url' => $publicUrl,
    'uploaded_at' => date('Y-m-d H:i:s')
];

$metadataFile = $sessionDir . pathinfo($filename, PATHINFO_FILENAME) . '.json';

if (!move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    json_response(['success' => false, 'error' => 'Konnte Datei nicht verschieben'], 500);
}

file_put_contents($metadataFile, json_encode($metadata, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

json_response([
    'success' => true,
    'path' => $targetPath,
    'url' => $publicUrl,
    'public_url' => $publicUrl,
    'filename' => $filename,
    'session' => $sessionId,
    'message' => 'Bild erfolgreich gespeichert (wird nach 24h automatisch gelöscht)'
]);
?>
