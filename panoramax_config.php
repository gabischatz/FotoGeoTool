<?php
/**
 * Projekt: Foto Geo-Tool
 * Datei: https://gabischatz.de.cool/FotoGeoTool/panoramax_config.php
 * Autor: Lutz Müller
 * Programmiersprache: PHP
 *
 * Cronik:
 *   Version-Datum:
 *     0.1.19, 7.5.2026 // UTC+2 Deutschland
 *      - Konfigurationsdatei für serverseitigen Panoramax-Upload erstellt.
 *
 * WICHTIG:
 * - Diese Datei NICHT öffentlich verlinken.
 * - Den Token nicht in script.js speichern.
 * - Den sichtbaren Beispiel-Token aus Chat/Screenshot bei Panoramax löschen und neu erzeugen.
 */

return [
    // API-Endpunkt der Panoramax-Instanz
    'api_url' => 'https://panoramax.basi.re/api',

    // Hier den neu erzeugten Panoramax-Token eintragen.
    // Beispiel:
    // 'token' => 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....',
    'token' => '',

    // Pfad zur Panoramax-CLI auf deinem Server.
    // Wenn panoramax_cli global installiert ist, reicht meist:
    'cli_bin' => 'panoramax_cli',

    // Upload-Ordner relativ zu FotoGeoTool.
    // Muss zu upload.php / panoramax_upload.php passen.
    'upload_dir' => __DIR__ . '/uploads',

    // Upload-Methode: direct_api nutzt die HTTP-API direkt.
    // cli ist nur noch ein alter Fallback.
    'upload_method' => 'direct_api',

    // JPEG vor dem Panoramax-Upload serverseitig neu schreiben.
    // Das entfernt problematische EXIF-Blöcke. GPS/Datum werden danach per API-Override gesetzt.
    'sanitize_before_upload' => false,

    // Upload-Set nach erfolgreichem Hochladen abschließen.
    'complete_after_upload' => true,

    // Standard: EXIF-only. Die App schreibt GPS/Datum/Richtung in die JPEG-Dateien.
    // Dadurch wird beim Multipart-Upload nur file=@bild.jpg an Panoramax gesendet.
    // Alter Testmodus: 'api_overrides'
    'upload_metadata_mode' => 'exif_only',

    // Optional: Timeout für Upload-Prozess in Sekunden
    'timeout' => 600,
];
