# Foto Geo-Tool

Foto Geo-Tool ist ein Browser/PHP-Werkzeug zum Bearbeiten und Vorbereiten von Bildern für Panoramax und OpenStreetMap.

## Zweck

Das Tool soll helfen, Fotos oder aus Videos extrahierte Frames mit Metadaten zu versehen:

- GPS-Koordinaten
- Höhe
- Blickrichtung / Heading
- Aufnahmedatum
- Beschreibung / Alternativtext
- Autor / Lizenzhinweise

Danach sollen die Bilder für Panoramax vorbereitet und hochgeladen werden.

## Aktueller Stand

Version: `v0.1.91`

Wichtige Funktionen:

- Bildliste mit EXIF-Anzeige
- Standortauswahl auf Leaflet/OpenStreetMap
- Ortssuche über `zipcodes.json`
- manuelles Setzen von GPS-Koordinaten
- Höhen-/Blickrichtungs-Metadaten
- Videoframe-Extraktor
- Serienlogik für aus Videos erzeugte Bilder
- Panoramax-API-Upload über PHP
- ZIP-Download der vorbereiteten Dateien

## Panoramax-Problem / aktueller Prüfpunkt

Der Upload wird aktuell über eigenen PHP-Code durchgeführt, nicht über die Panoramax-Webseite.

Verwendete API-Routen im bisherigen Stand:

```text
POST /api/upload_sets
POST /api/upload_sets/<uuid>/files
POST /api/upload_sets/<uuid>/complete
```

Zu klären ist, ob für die aktuelle Panoramax-Instanz wirklich `/files` korrekt ist oder ob stattdessen `/items` genutzt werden muss.

Die Bilder werden vor dem Upload mit sicheren Dateinamen gesendet, zum Beispiel:

```text
whatsapp_2026-05-09_165300_frame_0001.jpg
```

## Wichtiger Hinweis zu Token / Sicherheit

Bitte niemals persönliche Panoramax-Token, Passwörter oder `.env`-Dateien in dieses Repository hochladen.

Die Datei `.gitignore` schließt lokale Token- und Konfigurationsdateien aus.

## Projektstruktur

Die wichtigsten Dateien sind:

```text
index.html              Hauptseite
style.css               Layout
script.js               Browserlogik
panoramax_upload.php    Serverweiter Upload zu Panoramax
zipcodes.json           Ortsdaten für die Ortssuche
hilfe.html              Hilfeseite, falls vorhanden
```

## Installation / Test lokal

Die HTML-Dateien können direkt im Browser geöffnet werden. Für den Panoramax-Upload ist jedoch ein Webserver mit PHP erforderlich.

Beispiel mit lokalem PHP-Server:

```bash
php -S localhost:8000
```

Dann im Browser öffnen:

```text
http://localhost:8000/index.html
```

## Lizenz

CC BY 4.0 — Lutz Müller (gabischatz)
