<?php
/**
 * Projekt: Foto Geo-Tool
 * Datei: https://gabischatz.de.cool/FotoGeoTool/panoramax_upload.php
 * Autor: Lutz Müller
 * Programmiersprache: PHP
 *
 * Cronik:
 *   Version-Datum:
 *     0.1.20, 8.5.2026 // UTC+2 Deutschland
 *      - BUGFIX: panoramax_config.php ist nicht mehr zwingend erforderlich,
 *        wenn der Token aus dem Browser-Formular mitgesendet wird.
 *      - BUGFIX: Fehlermeldung bei fehlender Konfiguration genauer gemacht.
 *      - NEU: Fallback-Werte für api_url, cli_bin und upload_dir ergänzt.
 *     0.1.42, 8.5.2026 // UTC+2 Deutschland
 *      - BUGFIX: PHP liefert bei Upload-Problemen sauberes JSON statt Browser-500-Meldung.
 *      - NEU: Diagnose für fehlende/gesperrte panoramax_cli und exec().
 *      - NEU: Fehlermeldungen werden im Feld message zurückgegeben.
 *     0.1.76, 11.5.2026 // UTC+2 Deutschland
 *      - WICHTIG: Upload läuft jetzt direkt über die Panoramax HTTP-API.
 *      - panoramax_cli wird nicht mehr benötigt.
 *      - GPS/Datum werden als override_latitude, override_longitude und override_capture_time
 *        an /api/upload_sets/<id>/files gesendet.
 *      - JPEGs können vor dem Upload neu geschrieben werden, damit problematische EXIF-Blöcke
 *        nicht mehr den Panoramax-Parser stören.
 *      - Bei Fehlern wird GET /api/upload_sets/<id>/files abgefragt und als Diagnose zurückgegeben.
     0.1.84, 11.5.2026 // UTC+2 Deutschland
      - WICHTIG: Standardmodus upload_metadata_mode=exif_only.
      - BUGFIX: Multipart-Upload sendet standardmäßig nur das Feld file, wie in der Panoramax-Dokumentation gezeigt.
      - BUGFIX: sanitize_before_upload ist standardmäßig false, damit GPS/Datum/Richtung im EXIF erhalten bleiben.
      - BUGFIX: /complete wird ohne JSON-Body aufgerufen.
      - NEU: Fallback-Felder können per upload_metadata_mode=api_overrides wieder aktiviert werden.
     0.1.88, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Complete-Request für Upload-Sets ist robuster und versucht no-body, leeres JSON und simple JSON-Fallbacks.
      - NEU: complete_status enthält jetzt alle Complete-Versuche zur Diagnose.
     0.1.90, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Dateien werden für den Panoramax-API-Upload mit stabilen Namen wie fotogeo_2026-05-09_165300_frame_0001.jpg gesendet.
      - NEU: Originaldateiname bleibt in der Diagnose erhalten.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function pg_json(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function pg_mask_token(string $token): string {
    $token = trim($token);
    if ($token === '') return '';
    if (strlen($token) <= 18) return str_repeat('•', strlen($token));
    return substr($token, 0, 8) . '…' . substr($token, -8);
}

function pg_read_json_input(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function pg_clean_api_url(string $url): string {
    $url = rtrim(trim($url), '/');
    if ($url === '') $url = 'https://panoramax.basi.re/api';
    return $url;
}

function pg_basename_safe(string $filename): string {
    $filename = rawurldecode($filename);
    return basename(str_replace('\\', '/', $filename));
}

function pg_safe_ascii_stem(string $value): string {
    $value = trim($value);
    if ($value === '') return 'fotogeo';

    $map = [
        'Ä' => 'Ae', 'Ö' => 'Oe', 'Ü' => 'Ue',
        'ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue',
        'ß' => 'ss',
    ];
    $value = strtr($value, $map);

    if (function_exists('iconv')) {
        $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        if (is_string($converted) && $converted !== '') $value = $converted;
    }

    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', '_', $value);
    $value = trim((string)$value, '_');
    $value = preg_replace('/_+/', '_', $value);

    return $value !== '' ? $value : 'fotogeo';
}

function pg_safe_panoramax_filename(array $meta, string $originalFilename, int $index): string {
    $date = pg_iso_capture_time($meta['date'] ?? '');
    if ($date) {
        $datePart = str_replace(['-', ':', 'T'], ['-', '', '_'], substr($date, 0, 19));
    } else {
        $datePart = date('Y-m-d_His');
    }

    $description = trim((string)($meta['description'] ?? ''));
    $placeStem = 'fotogeo';

    // Wenn die Beschreibung im Muster "Ort | @ Name" gepflegt ist,
    // eignet sich der Teil vor dem Pipe-Zeichen als kurzer Orts-/Serienname.
    if ($description !== '') {
        $first = trim((string)preg_split('/[|\n\r]+/', $description)[0]);
        if ($first !== '') $placeStem = pg_safe_ascii_stem($first);
    }

    if ($placeStem === 'fotogeo') {
        $origStem = pathinfo(pg_basename_safe($originalFilename), PATHINFO_FILENAME);
        if (preg_match('/whatsapp/i', $origStem)) {
            $placeStem = 'whatsapp';
        }
    }

    $placeStem = substr($placeStem, 0, 42);
    $nr = str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT);

    return "{$placeStem}_{$datePart}_frame_{$nr}.jpg";
}

function pg_iso_capture_time($value): ?string {
    $value = trim((string)$value);
    if ($value === '') return null;

    // Bereits ISO-artig: 2026-05-09T16:39 oder 2026-05-09 16:39:12
    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/', $value, $m)) {
        $sec = $m[6] ?? '00';
        return "{$m[1]}-{$m[2]}-{$m[3]}T{$m[4]}:{$m[5]}:{$sec}";
    }

    // Deutsches Format: 09.05.2026 16:39
    if (preg_match('/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?/', $value, $m)) {
        $sec = $m[6] ?? '00';
        return "{$m[3]}-{$m[2]}-{$m[1]}T{$m[4]}:{$m[5]}:{$sec}";
    }

    $ts = strtotime($value);
    if ($ts !== false) {
        return date('Y-m-d\TH:i:s', $ts);
    }

    return null;
}

function pg_semantics_from_keywords(string $keywords): array {
    $keywords = trim($keywords);
    if ($keywords === '') return [];

    $tags = [];
    $parts = preg_split('/[\n\r,;]+/', $keywords) ?: [];
    foreach ($parts as $part) {
        $part = trim($part);
        if ($part === '' || !str_contains($part, '=')) continue;
        [$key, $value] = array_map('trim', explode('=', $part, 2));
        if ($key === '' || $value === '') continue;

        // Panoramax kennt z.B. transport=walk/bike/car.
        // OSM-Tags wären z.B. osm|highway=street_lamp.
        if (strlen($key) > 256 || strlen($value) > 2048) continue;
        $tags[] = ['key' => $key, 'value' => $value, 'action' => 'add'];
    }

    // Doppelte Tags entfernen.
    $unique = [];
    foreach ($tags as $tag) {
        $k = $tag['key'] . '=' . $tag['value'];
        $unique[$k] = $tag;
    }
    return array_values($unique);
}

function pg_http_json(string $method, string $url, string $token, ?array $payload = null, int $timeout = 120): array {
    if (!function_exists('curl_init')) {
        return [
            'ok' => false,
            'status' => 0,
            'error' => 'PHP-cURL ist nicht verfügbar. Direkter Panoramax-Upload benötigt cURL.'
        ];
    }

    $ch = curl_init($url);
    $headers = [
        'Accept: application/json',
        'Authorization: Bearer ' . $token,
    ];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_HEADER => false,
    ]);

    if ($payload !== null) {
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
        $headers[] = 'Content-Type: application/json';
        curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = null;
    if (is_string($body) && $body !== '') {
        $decoded = json_decode($body, true);
        if (is_array($decoded)) $json = $decoded;
    }

    return [
        'ok' => $errno === 0 && $status >= 200 && $status < 300,
        'status' => $status,
        'json' => $json,
        'body' => is_string($body) ? $body : '',
        'error' => $errno ? $err : null,
        'url' => $url,
    ];
}

function pg_complete_upload_set(string $apiUrl, string $uploadSetId, string $token, int $timeout = 120): array {
    $url = $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/complete';

    $attempts = [];

    // Je nach Panoramax-/Geovisio-Version akzeptieren Instanzen unterschiedliche Varianten.
    // Deshalb zuerst die dokumentationsnahe Variante ohne Body, danach kleine JSON-Fallbacks.
    $variants = [
        ['label' => 'post_without_body', 'payload' => null],
        ['label' => 'post_empty_json', 'payload' => []],
        ['label' => 'post_complete_true', 'payload' => ['complete' => true]],
    ];

    foreach ($variants as $variant) {
        $res = pg_http_json('POST', $url, $token, $variant['payload'], $timeout);
        $res['label'] = $variant['label'];
        $attempts[] = $res;

        if ($res['ok']) {
            return [
                'ok' => true,
                'status' => $res['status'],
                'json' => $res['json'],
                'body' => $res['body'],
                'error' => $res['error'],
                'url' => $url,
                'used_variant' => $variant['label'],
                'attempts' => $attempts,
            ];
        }
    }

    $last = end($attempts);
    return [
        'ok' => false,
        'status' => (int)($last['status'] ?? 0),
        'json' => $last['json'] ?? null,
        'body' => $last['body'] ?? '',
        'error' => $last['error'] ?? null,
        'url' => $url,
        'used_variant' => null,
        'attempts' => $attempts,
    ];
}

function pg_http_multipart(string $url, string $token, array $fields, int $timeout = 300): array {
    if (!function_exists('curl_init')) {
        return [
            'ok' => false,
            'status' => 0,
            'error' => 'PHP-cURL ist nicht verfügbar. Direkter Panoramax-Upload benötigt cURL.'
        ];
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $fields,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_HTTPHEADER => [
            'Accept: application/json',
            'Authorization: Bearer ' . $token,
        ],
    ]);

    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    $err = curl_error($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $json = null;
    if (is_string($body) && $body !== '') {
        $decoded = json_decode($body, true);
        if (is_array($decoded)) $json = $decoded;
    }

    return [
        'ok' => $errno === 0 && $status >= 200 && $status < 300,
        'status' => $status,
        'json' => $json,
        'body' => is_string($body) ? $body : '',
        'error' => $errno ? $err : null,
        'url' => $url,
    ];
}

function pg_prepare_jpeg_for_panoramax(string $srcFile, string $sessionDir, bool $sanitize, ?string $safeUploadName = null): array {
    $warning = null;
    $uploadFile = $srcFile;
    $uploadName = $safeUploadName ?: basename($srcFile);

    if (!$sanitize) {
        return ['file' => $uploadFile, 'name' => $uploadName, 'warning' => null, 'sanitized' => false];
    }

    if (!function_exists('imagecreatefromjpeg') || !function_exists('imagejpeg')) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'GD/JPEG ist auf dem Server nicht verfügbar. Datei wird unverändert hochgeladen.',
            'sanitized' => false
        ];
    }

    $img = @imagecreatefromjpeg($srcFile);
    if (!$img) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'JPEG konnte mit GD nicht neu geschrieben werden. Datei wird unverändert hochgeladen.',
            'sanitized' => false
        ];
    }

    $tmpDir = rtrim($sessionDir, '/\\') . '/.panoramax_tmp';
    if (!is_dir($tmpDir)) @mkdir($tmpDir, 0775, true);

    $base = pg_safe_ascii_stem(pathinfo($uploadName, PATHINFO_FILENAME));
    $tmpFile = $tmpDir . '/' . $base . '.jpg';

    $ok = @imagejpeg($img, $tmpFile, 92);
    imagedestroy($img);

    if (!$ok || !is_file($tmpFile)) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'JPEG-Neuschreiben fehlgeschlagen. Datei wird unverändert hochgeladen.',
            'sanitized' => false
        ];
    }

    return ['file' => $tmpFile, 'name' => $base . '.jpg', 'warning' => null, 'sanitized' => true];
}

function pg_find_file_in_session(string $sessionDir, string $filename): ?string {
    $wanted = pg_basename_safe($filename);
    if ($wanted === '') return null;

    $direct = rtrim($sessionDir, '/\\') . '/' . $wanted;
    if (is_file($direct)) return $direct;

    $all = glob(rtrim($sessionDir, '/\\') . '/*.{jpg,jpeg,JPG,JPEG}', GLOB_BRACE) ?: [];
    foreach ($all as $file) {
        if (pg_basename_safe($file) === $wanted) return $file;
        if (rawurldecode(basename($file)) === rawurldecode($wanted)) return $file;
    }
    return null;
}

// -----------------------------------------------------
// Konfiguration laden
// -----------------------------------------------------
$configFile = __DIR__ . '/panoramax_config.php';

$config = [
    'api_url' => 'https://panoramax.basi.re/api',
    'token' => '',
    'upload_dir' => __DIR__ . '/uploads',
    'timeout' => 600,
    'sanitize_before_upload' => false,
    'complete_after_upload' => true,
    // exif_only = stabiler Standard: Panoramax liest GPS/Datum/Richtung aus der JPEG-Datei.
    // api_overrides = alter Modus mit override_latitude/override_longitude/override_capture_time im Multipart-Request.
    'upload_metadata_mode' => 'exif_only',
];

if (is_file($configFile)) {
    $loaded = require $configFile;
    if (is_array($loaded)) $config = array_merge($config, $loaded);
}

$input = pg_read_json_input();

$requestToken =
    trim((string)($input['panoramax_token'] ?? '')) ?:
    trim((string)($input['token'] ?? '')) ?:
    trim((string)($input['access_token'] ?? ''));

$token = $requestToken !== '' ? $requestToken : trim((string)($config['token'] ?? ''));

if ($token === '') {
    pg_json([
        'success' => false,
        'message' => 'Kein Panoramax-Token vorhanden. Bitte Token im Panoramax-Panel einfügen und „Token merken“ klicken.',
        'config_file_found' => is_file($configFile),
        'token_source' => 'none'
    ]);
}

$sessionId = trim((string)($input['session_id'] ?? $_POST['session_id'] ?? ''));
if ($sessionId === '') {
    $sessionId = trim((string)($_COOKIE['foto_geo_tool_session'] ?? ''));
}

if ($sessionId === '') {
    pg_json([
        'success' => false,
        'message' => 'Keine session_id vorhanden. Bitte zuerst Bilder speichern, damit upload.php sie auf dem Server ablegt.'
    ]);
}

$safeSessionId = preg_replace('/[^a-zA-Z0-9_\-]/', '', $sessionId);
$sessionDir = rtrim((string)$config['upload_dir'], '/\\') . '/' . $safeSessionId;

if (!is_dir($sessionDir)) {
    pg_json([
        'success' => false,
        'message' => 'Session-Ordner nicht gefunden. Bitte zuerst mindestens ein Bild mit „Speichern“ sichern.',
        'session_dir' => $sessionDir,
        'session_id' => $sessionId
    ]);
}

$inputImages = is_array($input['images'] ?? null) ? $input['images'] : [];
$images = [];

if ($inputImages) {
    foreach ($inputImages as $img) {
        if (!is_array($img)) continue;
        $filename = (string)($img['filename'] ?? '');
        $file = pg_find_file_in_session($sessionDir, $filename);
        if (!$file) continue;
        $images[] = [
            'file' => $file,
            'filename' => basename($file),
            'meta' => $img,
        ];
    }
} else {
    foreach (glob($sessionDir . '/*.{jpg,jpeg,JPG,JPEG}', GLOB_BRACE) ?: [] as $file) {
        $images[] = ['file' => $file, 'filename' => basename($file), 'meta' => []];
    }
}

if (!$images) {
    pg_json([
        'success' => false,
        'message' => 'Im Session-Ordner liegen keine passenden JPG/JPEG-Bilder für Panoramax oder die Dateinamen konnten nicht zugeordnet werden.',
        'session_dir' => $sessionDir,
        'input_images_count' => count($inputImages)
    ]);
}

$apiUrl = pg_clean_api_url((string)($input['api_url'] ?? $config['api_url'] ?? 'https://panoramax.basi.re/api'));
$timeout = max(60, (int)($config['timeout'] ?? 600));
$sanitize = filter_var($config['sanitize_before_upload'] ?? false, FILTER_VALIDATE_BOOLEAN);
$completeAfterUpload = filter_var($config['complete_after_upload'] ?? true, FILTER_VALIDATE_BOOLEAN);
$uploadMetadataMode = strtolower(trim((string)($config['upload_metadata_mode'] ?? 'exif_only')));
if (!in_array($uploadMetadataMode, ['exif_only', 'api_overrides'], true)) $uploadMetadataMode = 'exif_only';

if (!function_exists('curl_init')) {
    pg_json([
        'success' => false,
        'message' => 'Direkter Panoramax-Upload kann nicht gestartet werden: PHP-cURL ist auf dem Server nicht verfügbar.',
        'next_step' => 'Bitte im Hosting prüfen, ob die PHP-Erweiterung cURL aktiviert werden kann.',
    ]);
}

// -----------------------------------------------------
// Upload-Set erstellen
// -----------------------------------------------------
$firstKeywords = '';
foreach ($images as $img) {
    $kw = trim((string)($img['meta']['keywords'] ?? ''));
    if ($kw !== '') {
        $firstKeywords = $kw;
        break;
    }
}

$uploadSetPayload = [
    'title' => trim((string)($input['title'] ?? '')) ?: ('Foto Geo-Tool Upload ' . date('Y-m-d H:i:s')),
    'estimated_nb_files' => count($images),
    'no_split' => true,
    'no_deduplication' => true,
    'metadata' => [
        'source' => 'Foto Geo-Tool',
        'session_id' => $safeSessionId,
        'upload_mode' => 'direct_api',
    ],
];

$semantics = pg_semantics_from_keywords($firstKeywords);
if ($semantics) $uploadSetPayload['semantics'] = $semantics;

$create = pg_http_json('POST', $apiUrl . '/upload_sets', $token, $uploadSetPayload, $timeout);
if (!$create['ok']) {
    pg_json([
        'success' => false,
        'message' => 'Panoramax Upload-Set konnte nicht erstellt werden.',
        'api_url' => $apiUrl,
        'http_status' => $create['status'],
        'response_json' => $create['json'],
        'response_body' => $create['body'],
        'curl_error' => $create['error'],
        'token_source' => $requestToken !== '' ? 'browser' : 'panoramax_config.php',
        'token_masked' => pg_mask_token($token),
    ]);
}

$uploadSet = $create['json'] ?? [];
$uploadSetId = (string)($uploadSet['id'] ?? '');
if ($uploadSetId === '') {
    pg_json([
        'success' => false,
        'message' => 'Panoramax Upload-Set wurde erstellt, aber die Antwort enthält keine id.',
        'create_response' => $create,
    ]);
}

// -----------------------------------------------------
// Dateien hochladen
// -----------------------------------------------------
$uploaded = [];
$warnings = [];

foreach ($images as $idx => $img) {
    $meta = is_array($img['meta']) ? $img['meta'] : [];
    $safeUploadName = pg_safe_panoramax_filename($meta, $img['file'], $idx);
    $prepared = pg_prepare_jpeg_for_panoramax($img['file'], $sessionDir, $sanitize, $safeUploadName);
    if ($prepared['warning']) $warnings[] = $prepared['warning'] . ' Datei: ' . basename($img['file']);

    $lat = is_numeric($meta['lat'] ?? null) ? (float)$meta['lat'] : null;
    $lng = is_numeric($meta['lng'] ?? null) ? (float)$meta['lng'] : null;
    $captureTime = pg_iso_capture_time($meta['date'] ?? '');

    $fields = [
        'file' => new CURLFile($prepared['file'], 'image/jpeg', $prepared['name']),
    ];

    // Standard: keine Zusatzfelder senden.
    // Panoramax erwartet laut Dokumentation mindestens und ausreichend:
    // POST /api/upload_sets/<id>/files  -F file=@bild.jpg
    //
    // Die Metadaten (GPS, Datum, Blickrichtung) stehen bereits im von der App
    // gespeicherten JPEG-EXIF. Zusatzfelder können bei einzelnen Instanzen zu
    // Serverfehlern führen; deshalb bleiben sie im Standardmodus aus.
    if ($uploadMetadataMode === 'api_overrides') {
        if ($lat !== null && $lng !== null) {
            $fields['override_latitude'] = (string)$lat;
            $fields['override_longitude'] = (string)$lng;
        }

        if ($captureTime !== null) {
            $fields['override_capture_time'] = $captureTime;
        } else {
            $fields['override_capture_time'] = date('Y-m-d\TH:i:s', filemtime($img['file']) ?: time());
        }
    }

    $upload = pg_http_multipart($apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files', $token, $fields, $timeout);

    if (!$upload['ok']) {
        $filesDiag = pg_http_json('GET', $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files', $token, null, 120);

        pg_json([
            'success' => false,
            'message' => 'Panoramax hat eine Datei abgelehnt oder mit einem Serverfehler beantwortet.',
            'upload_set_id' => $uploadSetId,
            'failed_file' => basename($img['file']),
            'failed_upload_name' => $prepared['name'],
            'uploaded_before_failure' => count($uploaded),
            'http_status' => $upload['status'],
            'response_json' => $upload['json'],
            'response_body' => $upload['body'],
            'curl_error' => $upload['error'],
            'files_diagnostic' => [
                'ok' => $filesDiag['ok'],
                'status' => $filesDiag['status'],
                'json' => $filesDiag['json'],
                'body' => $filesDiag['body'],
                'error' => $filesDiag['error'],
                'url' => $filesDiag['url'],
            ],
            'sent_overrides' => [
                'upload_metadata_mode' => $uploadMetadataMode,
                'override_latitude' => $fields['override_latitude'] ?? null,
                'override_longitude' => $fields['override_longitude'] ?? null,
                'override_capture_time' => $fields['override_capture_time'] ?? null,
                'sanitized' => $prepared['sanitized'],
            ],
            'debug_urls' => [
                'upload_set' => $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId),
                'files' => $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files',
            ],
            'warnings' => array_values(array_unique($warnings)),
        ]);
    }

    $uploaded[] = [
        'file' => basename($img['file']),
        'upload_name' => $prepared['name'],
        'response' => $upload['json'],
        'sanitized' => $prepared['sanitized'],
    ];
}

// -----------------------------------------------------
// Upload-Set abschließen
// -----------------------------------------------------
$complete = null;
if ($completeAfterUpload) {
    $complete = pg_complete_upload_set($apiUrl, $uploadSetId, $token, $timeout);
}

$filesDiag = pg_http_json('GET', $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files', $token, null, 120);

pg_json([
    'success' => true,
    'message' => count($uploaded) . ' Bild(er) wurden per direkter Panoramax-API angenommen. Upload-Set wurde abgeschlossen bzw. der Abschluss wurde versucht.',
    'upload_set_id' => $uploadSetId,
    'api_url' => $apiUrl,
    'images_count' => count($images),
    'uploaded_count' => count($uploaded),
    'upload_metadata_mode' => $uploadMetadataMode,
    'sanitize_before_upload' => $sanitize,
    'upload_set_payload' => $uploadSetPayload,
    'complete_status' => $complete ? [
        'ok' => $complete['ok'],
        'status' => $complete['status'],
        'json' => $complete['json'],
        'body' => $complete['body'],
        'error' => $complete['error'],
        'used_variant' => $complete['used_variant'] ?? null,
        'attempts' => $complete['attempts'] ?? [],
    ] : null,
    'files_diagnostic' => [
        'ok' => $filesDiag['ok'],
        'status' => $filesDiag['status'],
        'json' => $filesDiag['json'],
        'body' => $filesDiag['body'],
        'error' => $filesDiag['error'],
        'url' => $filesDiag['url'],
    ],
    'debug_urls' => [
        'upload_set' => $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId),
        'files' => $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files',
    ],
    'warnings' => array_values(array_unique($warnings)),
    'token_source' => $requestToken !== '' ? 'browser' : 'panoramax_config.php',
    'token_masked' => pg_mask_token($token),
]);
