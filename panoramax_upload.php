<?php
/**
 * Projekt: Foto Geo-Tool
 * Datei: https://overpass-osm.de.cool/FotoGeoTool/panoramax_upload.php
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
     0.1.92, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Upload-Set-ID wird robust aus id/upload_set_id oder aus HATEOAS-Links extrahiert.
      - BUGFIX: Datei-Upload wird mit rel=add_files-Link ausgeführt, falls Panoramax diesen liefert.
      - BUGFIX: Harte Sperre verhindert POST /api/upload_sets//files.
      - BUGFIX: Complete wird mit rel=complete-Link ausgeführt, falls vorhanden.
     0.1.93, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Datei-Upload läuft nach einzelnen Panoramax-Ablehnungen weiter und schließt das Upload-Set trotzdem ab.
      - DIAGNOSE: upload_errors, uploaded_files, rejected_count und final_set_status ergänzt.
      - BUGFIX: pg_http_json liest Header/Location, damit Upload-Set-ID gemäß Panoramax-Doku auch aus Location genutzt werden kann.
     0.1.95, 14.5.2026 // UTC+2 Deutschland
      - WICHTIG: Standardmodus wieder upload_metadata_mode=api_overrides nach Prüfung der Panoramax-OpenAPI.
      - NEU: Beim Datei-Upload werden override_latitude, override_longitude, override_capture_time und isBlurred=false gesendet.
      - NEU: Optionales extra_exif-Feld vorbereitet (standardmäßig deaktiviert), damit Richtung/Höhe/Beschreibung später gezielt getestet werden können.
      - DIAGNOSE: uploaded_files enthält jetzt sent_fields, damit die tatsächlich gesendeten API-Felder sichtbar sind.
     0.1.96, 14.5.2026 // UTC+2 Deutschland
      - BUGFIX: Panoramax akzeptiert nur echte JPEG-Dateien; Upload wird jetzt serverseitig als reines JPEG neu geschrieben.
      - BUGFIX: Nicht-JPEG-Dateien werden vor dem Panoramax-Upload übersprungen und sauber in der Diagnose gemeldet.
      - NEU: JPEG-Diagnose mit MIME-Typ, Bildgröße und Hinweis bei Panoramax-Meldung „Nur im JPEG-Format“.
     0.1.97, 15.5.2026 // UTC+2 Deutschland
      - BEREINIGUNG: Dateikopf auf overpass-osm.de.cool aktualisiert; Upload-Logik aus v0.1.96 bleibt erhalten.
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

function pg_api_origin(string $apiUrl): string {
    $parts = parse_url($apiUrl);
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) return '';
    $origin = $parts['scheme'] . '://' . $parts['host'];
    if (!empty($parts['port'])) $origin .= ':' . $parts['port'];
    return $origin;
}

function pg_absolute_panoramax_url(string $apiUrl, string $href): string {
    $href = trim($href);
    if ($href === '') return '';
    if (preg_match('~^https?://~i', $href)) return $href;

    $origin = pg_api_origin($apiUrl);
    if ($origin === '') return '';

    if (str_starts_with($href, '/api/')) return $origin . $href;
    if (str_starts_with($href, '/')) return $origin . $href;

    return rtrim($apiUrl, '/') . '/' . ltrim($href, '/');
}

function pg_find_panoramax_link(array $object, string $rel, string $apiUrl): string {
    $links = $object['links'] ?? null;
    if (!is_array($links)) return '';

    foreach ($links as $link) {
        if (!is_array($link)) continue;
        $linkRel = (string)($link['rel'] ?? '');
        if ($linkRel !== $rel) continue;
        $href = (string)($link['href'] ?? '');
        $abs = pg_absolute_panoramax_url($apiUrl, $href);
        if ($abs !== '') return $abs;
    }

    return '';
}

function pg_extract_upload_set_id(array $uploadSet, string $apiUrl): string {
    $candidates = [
        $uploadSet['id'] ?? null,
        $uploadSet['uuid'] ?? null,
        $uploadSet['upload_set_id'] ?? null,
        $uploadSet['uploadSetId'] ?? null,
    ];

    foreach ($candidates as $candidate) {
        $candidate = trim((string)$candidate);
        if ($candidate !== '') return $candidate;
    }

    $links = $uploadSet['links'] ?? null;
    if (is_array($links)) {
        foreach ($links as $link) {
            if (!is_array($link)) continue;
            $href = pg_absolute_panoramax_url($apiUrl, (string)($link['href'] ?? ''));
            if (preg_match('~/upload_sets/([^/?#]+)/?~', $href, $m)) {
                return rawurldecode($m[1]);
            }
        }
    }

    return '';
}

function pg_build_upload_files_url(string $apiUrl, array $uploadSet, string $uploadSetId): string {
    $link = pg_find_panoramax_link($uploadSet, 'add_files', $apiUrl);
    if ($link !== '') return $link;

    $link = pg_find_panoramax_link($uploadSet, 'add-file', $apiUrl);
    if ($link !== '') return $link;

    $link = pg_find_panoramax_link($uploadSet, 'files', $apiUrl);
    if ($link !== '') return $link;

    if ($uploadSetId === '') return '';
    return $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/files';
}

function pg_build_complete_url(string $apiUrl, array $uploadSet, string $uploadSetId): string {
    $link = pg_find_panoramax_link($uploadSet, 'complete', $apiUrl);
    if ($link !== '') return $link;

    if ($uploadSetId === '') return '';
    return $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/complete';
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

function pg_format_exiv2_float($value, int $precision = 6): string {
    if (!is_numeric($value)) return '';
    return rtrim(rtrim(number_format((float)$value, $precision, '.', ''), '0'), '.');
}

function pg_build_extra_exif(array $meta): array {
    $extra = [];

    $description = trim((string)($meta['description'] ?? ''));
    if ($description !== '') {
        $extra['override_Exif.Image.ImageDescription'] = $description;
        $extra['override_Exif.Photo.UserComment'] = $description;

        if (preg_match('/(?:©|@)\s*([^|\n\r]+)\s*$/u', $description, $m)) {
            $author = trim($m[1]);
            if ($author !== '') {
                $extra['override_Exif.Image.Artist'] = $author;
                $extra['override_Exif.Image.Copyright'] = '© ' . $author;
            }
        }
    }

    $direction = $meta['direction'] ?? ($meta['angle'] ?? null);
    if (is_numeric($direction)) {
        $deg = fmod((float)$direction, 360.0);
        if ($deg < 0) $deg += 360.0;
        $extra['override_Exif.GPSInfo.GPSImgDirectionRef'] = 'T';
        $extra['override_Exif.GPSInfo.GPSImgDirection'] = pg_format_exiv2_float($deg, 2);
    }

    $altitude = $meta['altitude'] ?? null;
    if (is_numeric($altitude)) {
        $alt = (float)$altitude;
        $extra['override_Exif.GPSInfo.GPSAltitudeRef'] = $alt < 0 ? '1' : '0';
        $extra['override_Exif.GPSInfo.GPSAltitude'] = pg_format_exiv2_float(abs($alt), 2);
    }

    return $extra;
}

function pg_http_json(string $method, string $url, string $token, ?array $payload = null, int $timeout = 120): array {
    if (!function_exists('curl_init')) {
        return [
            'ok' => false,
            'status' => 0,
            'error' => 'PHP-cURL ist nicht verfügbar. Direkter Panoramax-Upload benötigt cURL.',
            'url' => $url,
            'headers' => [],
            'location' => '',
        ];
    }

    $ch = curl_init($url);
    $headers = [
        'Accept: application/json',
        'Authorization: Bearer ' . $token,
    ];
    $responseHeaders = [];

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_HEADER => false,
        CURLOPT_HEADERFUNCTION => function ($ch, string $headerLine) use (&$responseHeaders): int {
            $len = strlen($headerLine);
            $line = trim($headerLine);
            if ($line === '' || !str_contains($line, ':')) return $len;
            [$name, $value] = explode(':', $line, 2);
            $responseHeaders[strtolower(trim($name))] = trim($value);
            return $len;
        },
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
        'headers' => $responseHeaders,
        'location' => $responseHeaders['location'] ?? '',
    ];
}

function pg_complete_upload_set(string $apiUrl, string $uploadSetId, string $token, int $timeout = 120, string $completeUrl = ''): array {
    $url = $completeUrl !== '' ? $completeUrl : ($apiUrl . '/upload_sets/' . rawurlencode($uploadSetId) . '/complete');

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


function pg_detect_jpeg_info(string $file): array {
    $info = [
        'is_file' => is_file($file),
        'size_bytes' => is_file($file) ? filesize($file) : 0,
        'magic' => '',
        'mime' => null,
        'image_type' => null,
        'width' => null,
        'height' => null,
        'is_jpeg' => false,
    ];

    if (!is_file($file)) return $info;

    $fh = @fopen($file, 'rb');
    if ($fh) {
        $bytes = fread($fh, 12);
        fclose($fh);
        $info['magic'] = strtoupper(bin2hex($bytes ?: ''));
    }

    if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $mime = @finfo_file($finfo, $file);
            @finfo_close($finfo);
            if (is_string($mime) && $mime !== '') $info['mime'] = $mime;
        }
    }

    $imgSize = @getimagesize($file);
    if (is_array($imgSize)) {
        $info['width'] = $imgSize[0] ?? null;
        $info['height'] = $imgSize[1] ?? null;
        $info['image_type'] = $imgSize[2] ?? null;
    }

    $magicIsJpeg = str_starts_with($info['magic'], 'FFD8FF');
    $mimeIsJpeg = in_array(strtolower((string)$info['mime']), ['image/jpeg', 'image/pjpeg'], true);
    $typeIsJpeg = ((int)($info['image_type'] ?? 0) === IMAGETYPE_JPEG);

    $info['is_jpeg'] = $magicIsJpeg && ($mimeIsJpeg || $typeIsJpeg || $info['mime'] === null);
    return $info;
}

function pg_has_jpeg_only_error(array $upload): bool {
    $haystack = '';
    foreach (['body', 'error'] as $key) {
        if (!empty($upload[$key])) $haystack .= ' ' . (string)$upload[$key];
    }
    if (!empty($upload['json'])) {
        $haystack .= ' ' . json_encode($upload['json'], JSON_UNESCAPED_UNICODE);
    }
    $haystack = strtolower($haystack);
    return str_contains($haystack, 'jpeg') || str_contains($haystack, 'jpg') || str_contains($haystack, 'image format') || str_contains($haystack, 'format');
}

function pg_prepare_jpeg_for_panoramax(string $srcFile, string $sessionDir, bool $sanitize, ?string $safeUploadName = null): array {
    $warning = null;
    $uploadFile = $srcFile;
    $uploadName = $safeUploadName ?: basename($srcFile);
    $sourceInfo = pg_detect_jpeg_info($srcFile);

    if (!$sourceInfo['is_jpeg']) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'Datei ist kein gültiges JPEG und wird nicht an Panoramax gesendet.',
            'sanitized' => false,
            'source_info' => $sourceInfo,
            'upload_info' => $sourceInfo,
            'skip' => true,
        ];
    }

    if (!$sanitize) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => null,
            'sanitized' => false,
            'source_info' => $sourceInfo,
            'upload_info' => $sourceInfo,
            'skip' => false,
        ];
    }

    if (!function_exists('imagecreatefromjpeg') || !function_exists('imagejpeg')) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'GD/JPEG ist auf dem Server nicht verfügbar. Datei wird unverändert hochgeladen.',
            'sanitized' => false,
            'source_info' => $sourceInfo,
            'upload_info' => $sourceInfo,
            'skip' => false,
        ];
    }

    $img = @imagecreatefromjpeg($srcFile);
    if (!$img) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'JPEG konnte mit GD nicht gelesen werden und wird nicht an Panoramax gesendet.',
            'sanitized' => false,
            'source_info' => $sourceInfo,
            'upload_info' => $sourceInfo,
            'skip' => true,
        ];
    }

    $tmpDir = rtrim($sessionDir, '/\\') . '/.panoramax_tmp';
    if (!is_dir($tmpDir)) @mkdir($tmpDir, 0775, true);

    $base = pg_safe_ascii_stem(pathinfo($uploadName, PATHINFO_FILENAME));
    $tmpFile = $tmpDir . '/' . $base . '.jpg';

    // Reines JPEG neu schreiben: keine problematischen Container-/EXIF-Blöcke, kein PNG/WebP,
    // dafür GPS/Zeit per Panoramax-API-Override.
    $ok = @imagejpeg($img, $tmpFile, 95);
    imagedestroy($img);

    $uploadInfo = pg_detect_jpeg_info($tmpFile);
    if (!$ok || !is_file($tmpFile) || !$uploadInfo['is_jpeg']) {
        return [
            'file' => $uploadFile,
            'name' => $uploadName,
            'warning' => 'JPEG-Neuschreiben fehlgeschlagen. Datei wird nicht an Panoramax gesendet.',
            'sanitized' => false,
            'source_info' => $sourceInfo,
            'upload_info' => $uploadInfo,
            'skip' => true,
        ];
    }

    return [
        'file' => $tmpFile,
        'name' => $base . '.jpg',
        'warning' => null,
        'sanitized' => true,
        'source_info' => $sourceInfo,
        'upload_info' => $uploadInfo,
        'skip' => false,
    ];
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
    // api_overrides = aktueller Standard: GPS/Datum werden laut OpenAPI beim Multipart-Upload explizit übergeben.
    // exif_only = Fallback/Testmodus: Panoramax liest GPS/Datum/Richtung nur aus der JPEG-Datei.
    'upload_metadata_mode' => 'api_overrides',
    // Optionaler Testmodus: extra_exif als JSON-Multipart-Feld mitsenden. Standard false, weil nicht jede Instanz das gleich verarbeitet.
    'upload_extra_exif' => false,
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
$preUploadSkipped = [];

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
$uploadMetadataMode = strtolower(trim((string)($config['upload_metadata_mode'] ?? 'api_overrides')));
if (!in_array($uploadMetadataMode, ['exif_only', 'api_overrides'], true)) $uploadMetadataMode = 'api_overrides';
$uploadExtraExif = filter_var($input['upload_extra_exif'] ?? ($config['upload_extra_exif'] ?? false), FILTER_VALIDATE_BOOLEAN);

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
    'sort_method' => 'filename-asc',
    'no_split' => true,
    'no_deduplication' => true,
    'metadata' => [
        'source' => 'Foto Geo-Tool',
        'session_id' => $safeSessionId,
        'upload_mode' => 'direct_api',
        'upload_metadata_mode' => $uploadMetadataMode,
        'upload_extra_exif' => $uploadExtraExif ? 'true' : 'false',
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
$uploadSet = is_array($uploadSet) ? $uploadSet : [];
$uploadSetId = pg_extract_upload_set_id($uploadSet, $apiUrl);

// Panoramax dokumentiert die Upload-Set-ID zusätzlich im Location-Header.
// Diesen Header nutzen wir als robusten Fallback, falls die JSON-Antwort anders aufgebaut ist.
if ($uploadSetId === '' && !empty($create['location']) && preg_match('~/upload_sets/([^/?#]+)~', (string)$create['location'], $m)) {
    $uploadSetId = rawurldecode($m[1]);
}

$uploadFilesUrl = pg_build_upload_files_url($apiUrl, $uploadSet, $uploadSetId);
$completeUrl = pg_build_complete_url($apiUrl, $uploadSet, $uploadSetId);

if ($uploadSetId === '' || $uploadFilesUrl === '') {
    pg_json([
        'success' => false,
        'message' => 'Panoramax Upload-Set wurde erstellt, aber die Upload-Set-ID oder der add_files-Link fehlt. Datei-Upload wird gestoppt, damit keine URL /upload_sets//files entsteht.',
        'api_url' => $apiUrl,
        'upload_set_id' => $uploadSetId,
        'upload_files_url' => $uploadFilesUrl,
        'complete_url' => $completeUrl,
        'create_response' => $create,
    ]);
}

if (str_contains($uploadFilesUrl, '/upload_sets//')) {
    pg_json([
        'success' => false,
        'message' => 'Interner Schutz: Upload-URL enthält eine leere Upload-Set-ID. Der Datei-Upload wurde gestoppt.',
        'upload_set_id' => $uploadSetId,
        'upload_files_url' => $uploadFilesUrl,
        'create_response' => $create,
    ]);
}

// -----------------------------------------------------
// Dateien hochladen
// -----------------------------------------------------
$uploaded = [];
$uploadErrors = [];
$warnings = [];

foreach ($images as $idx => $img) {
    $meta = is_array($img['meta']) ? $img['meta'] : [];
    $safeUploadName = pg_safe_panoramax_filename($meta, $img['file'], $idx);
    $prepared = pg_prepare_jpeg_for_panoramax($img['file'], $sessionDir, $sanitize, $safeUploadName);
    if ($prepared['warning']) $warnings[] = $prepared['warning'] . ' Datei: ' . basename($img['file']);

    if (!empty($prepared['skip'])) {
        $uploadErrors[] = [
            'file' => basename($img['file']),
            'upload_name' => $prepared['name'],
            'http_status' => 0,
            'response_json' => null,
            'response_body' => '',
            'curl_error' => $prepared['warning'] ?: 'Datei vor Upload übersprungen.',
            'sent_fields' => [
                'file' => $prepared['name'],
                'upload_metadata_mode' => $uploadMetadataMode,
                'skipped_before_upload' => true,
                'source_info' => $prepared['source_info'] ?? null,
                'upload_info' => $prepared['upload_info'] ?? null,
            ],
        ];
        continue;
    }

    $lat = is_numeric($meta['lat'] ?? null) ? (float)$meta['lat'] : null;
    $lng = is_numeric($meta['lng'] ?? null) ? (float)$meta['lng'] : null;
    $captureTime = pg_iso_capture_time($meta['date'] ?? '');

    $fields = [
        'file' => new CURLFile($prepared['file'], 'image/jpeg', $prepared['name']),
    ];

    $sentFields = [
        'file' => $prepared['name'],
        'upload_metadata_mode' => $uploadMetadataMode,
        'isBlurred' => null,
        'override_latitude' => null,
        'override_longitude' => null,
        'override_capture_time' => null,
        'extra_exif_keys' => [],
        'sanitized' => $prepared['sanitized'],
        'source_jpeg_info' => $prepared['source_info'] ?? null,
        'upload_jpeg_info' => $prepared['upload_info'] ?? null,
    ];

    // Panoramax OpenAPI GeoVisioAddToUploadSet erlaubt diese Multipart-Felder:
    // override_capture_time, override_longitude, override_latitude, extra_exif, isBlurred und file.
    // Deshalb senden wir GPS/Zeit im Standardmodus explizit mit, zusätzlich zum JPEG selbst.
    if ($uploadMetadataMode === 'api_overrides') {
        if ($lat !== null && $lng !== null) {
            $fields['override_latitude'] = (string)$lat;
            $fields['override_longitude'] = (string)$lng;
            $sentFields['override_latitude'] = $fields['override_latitude'];
            $sentFields['override_longitude'] = $fields['override_longitude'];
        }

        if ($captureTime !== null) {
            $fields['override_capture_time'] = $captureTime;
        } else {
            $fields['override_capture_time'] = date('Y-m-d\TH:i:s', filemtime($img['file']) ?: time());
        }
        $sentFields['override_capture_time'] = $fields['override_capture_time'];

        // Laut OpenAPI vorhanden. Als String "false" gesendet, damit Form-Parser es als boolean false lesen kann.
        $fields['isBlurred'] = 'false';
        $sentFields['isBlurred'] = 'false';

        if ($uploadExtraExif) {
            $extraExif = pg_build_extra_exif($meta);
            if ($extraExif) {
                // Manche Panoramax-Instanzen erwarten für multipart/object ein JSON-codiertes Feld.
                // Deshalb bleibt dieser Modus abschaltbar und ist standardmäßig deaktiviert.
                $fields['extra_exif'] = json_encode($extraExif, JSON_UNESCAPED_UNICODE);
                $sentFields['extra_exif_keys'] = array_keys($extraExif);
            }
        }
    }

    $upload = pg_http_multipart($uploadFilesUrl, $token, $fields, $timeout);

    if (!$upload['ok']) {
        // Laut Panoramax-Doku können ungültige Bilder abgelehnt und trotzdem als empfangene Datei gezählt werden.
        // Deshalb brechen wir nicht mehr sofort ab, sondern sammeln alle Fehler und schließen das Upload-Set später ab.
        $uploadErrors[] = [
            'file' => basename($img['file']),
            'upload_name' => $prepared['name'],
            'http_status' => $upload['status'],
            'response_json' => $upload['json'],
            'response_body' => $upload['body'],
            'curl_error' => $upload['error'],
            'sent_fields' => $sentFields,
            'jpeg_only_hint' => pg_has_jpeg_only_error($upload)
                ? 'Panoramax meldet vermutlich ein JPEG-Formatproblem. In v0.1.96 wird deshalb sanitize_before_upload=true empfohlen/gesetzt.'
                : null,
        ];
        continue;
    }

    $uploaded[] = [
        'file' => basename($img['file']),
        'upload_name' => $prepared['name'],
        'response' => $upload['json'],
        'sanitized' => $prepared['sanitized'],
        'http_status' => $upload['status'],
        'sent_fields' => $sentFields,
    ];
}

// -----------------------------------------------------
// Upload-Set abschließen
// -----------------------------------------------------
$complete = null;
if ($completeAfterUpload) {
    $complete = pg_complete_upload_set($apiUrl, $uploadSetId, $token, $timeout, $completeUrl);
}

$filesDiag = pg_http_json('GET', $uploadFilesUrl, $token, null, 120);
$finalSetStatus = pg_http_json('GET', $apiUrl . '/upload_sets/' . rawurlencode($uploadSetId), $token, null, 120);

$filesJson = is_array($filesDiag['json'] ?? null) ? $filesDiag['json'] : [];
$filesList = [];
if (isset($filesJson['features']) && is_array($filesJson['features'])) {
    $filesList = $filesJson['features'];
} elseif (isset($filesJson['items']) && is_array($filesJson['items'])) {
    $filesList = $filesJson['items'];
} elseif (array_is_list($filesJson)) {
    $filesList = $filesJson;
}

$rejectedCount = 0;
foreach ($filesList as $fileInfo) {
    if (!is_array($fileInfo)) continue;
    if (!empty($fileInfo['rejected']) || !empty($fileInfo['properties']['rejected'])) $rejectedCount++;
}

$allFailed = count($uploaded) === 0 && count($uploadErrors) > 0;
$message = $allFailed
    ? 'Panoramax hat keine Datei per HTTP erfolgreich angenommen. Upload-Set wurde trotzdem abgeschlossen/diagnostiziert.'
    : count($uploaded) . ' Bild(er) wurden per direkter Panoramax-API angenommen. Upload-Set wurde abgeschlossen bzw. der Abschluss wurde versucht.';
if (count($uploadErrors) > 0) {
    $message .= ' ' . count($uploadErrors) . ' Datei(en) wurden beim Uploadversuch mit Fehler beantwortet.';
}
if ($rejectedCount > 0) {
    $message .= ' Panoramax meldet ' . $rejectedCount . ' abgelehnte Datei(en) im Upload-Set.';
}

pg_json([
    'success' => !$allFailed,
    'version' => '0.1.96',
    'message' => $message,
    'upload_set_id' => $uploadSetId,
    'upload_files_url' => $uploadFilesUrl,
    'complete_url' => $completeUrl,
    'api_url' => $apiUrl,
    'images_count' => count($images),
    'uploaded_count' => count($uploaded),
    'failed_count' => count($uploadErrors),
    'rejected_count' => $rejectedCount,
    'uploaded_files' => $uploaded,
    'upload_errors' => $uploadErrors,
    'upload_metadata_mode' => $uploadMetadataMode,
    'upload_extra_exif' => $uploadExtraExif,
    'sanitize_before_upload' => $sanitize,
    'jpeg_upload_policy' => 'Nur echte JPEG-Dateien werden an Panoramax gesendet; bei sanitize_before_upload=true werden sie vorher als reine JPEG-Dateien neu geschrieben.',
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
    'final_set_status' => [
        'ok' => $finalSetStatus['ok'],
        'status' => $finalSetStatus['status'],
        'json' => $finalSetStatus['json'],
        'body' => $finalSetStatus['body'],
        'error' => $finalSetStatus['error'],
        'url' => $finalSetStatus['url'],
    ],
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
