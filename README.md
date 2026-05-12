# Foto Geo-Tool

**Foto Geo-Tool** ist ein Browser/PHP-Werkzeug zum Nachtragen, Prüfen und Speichern von Geodaten in Bildern.  
Das Projekt ist besonders für Fotos und Videos gedacht, die aus WhatsApp oder anderen Medienquellen stammen, bei denen GPS-/EXIF-Daten oft entfernt werden.

Ziel ist es, solche Bilder wieder mit nutzbaren Metadaten zu versehen und sie anschließend für **Panoramax** und **OpenStreetMap** vorzubereiten.

![Startansicht: Geoposition festlegen](docs/screenshots/start-geoposition-festlegen.png)

## Warum gibt es dieses Tool?

Viele Bilder aus Messenger-Apps, sozialen Netzwerken oder Videodateien enthalten keine verwertbaren Standortdaten mehr.  
Gerade WhatsApp entfernt häufig EXIF-Informationen wie GPS-Koordinaten, Blickrichtung, Aufnahmedatum oder Kameraangaben.

Für Panoramax und OpenStreetMap sind diese Informationen aber wichtig, damit Bilder später sinnvoll genutzt werden können:

- Wo wurde das Bild aufgenommen?
- In welche Richtung blickte die Kamera?
- Wann wurde das Bild aufgenommen?
- Welche Beschreibung oder Lizenz gehört dazu?
- Welche Fortbewegungsart passt zur Bildserie?

Foto Geo-Tool soll genau diese Lücke schließen.

## Hauptfunktionen

- Bilder per Drag-and-Drop oder Dateiauswahl laden
- Videos laden und daraus einzelne Frames erzeugen
- GPS-Koordinaten über eine Karte setzen
- Ortssuche über Postleitzahl und Ortsname
- Höhe und Blickrichtung ergänzen
- Beschreibung / Alternativtext eintragen
- Serien aus Videoframes vorbereiten
- einzelne Videoframes auswählen oder ausschließen
- EXIF-/Metadaten anzeigen
- Bilder speichern und für den Upload vorbereiten
- vorbereitete Bilder per PHP an Panoramax senden
- ZIP-Download der vorbereiteten Bilder

## Typischer Arbeitsablauf

### 1. Geoposition festlegen

Nach dem Laden eines Bildes oder Videos wird auf der Karte die Aufnahmeposition gesetzt.  
Der Marker kann verschoben werden. Zusätzlich kann eine Blickrichtung gesetzt werden, damit später klar ist, in welche Richtung das Foto aufgenommen wurde.

![Geoposition und Blickrichtung setzen](docs/screenshots/start-geoposition-festlegen.png)

Im ersten Screenshot sieht man die Startansicht. Rechts befindet sich die Karte. Dort wird die Geoposition festgelegt und bei Bedarf die Blickrichtung über den Richtungskreis gesetzt.

### 2. Video laden und Frames auswählen

Das Tool kann auch Videodateien übernehmen. Das ist besonders nützlich, wenn zum Beispiel ein kurzes WhatsApp-Video oder eine Handyaufnahme als Grundlage für einzelne Panoramax-Bilder dienen soll.

![Videoframes auswählen](docs/screenshots/video-frames-auswaehlen.png)

Im zweiten Screenshot sieht man den Fotoframe-Extraktor.  
Dort kann festgelegt werden:

- wie viele Frames aus dem Video erzeugt werden sollen
- welche JPEG-Qualität verwendet wird
- welche Höhe eingetragen werden soll
- welche Beschreibung für alle Frames gilt
- welche Frames ausgelassen werden sollen

Ein Klick auf ein Vorschaubild schließt dieses Frame aus. Ausgeschlossene Frames werden ausgegraut und mit einem roten X markiert.

### 3. Bilder speichern und vorbereiten

Nach der Übernahme ins Foto Geo-Tool werden die einzelnen Bilder geprüft, beschrieben und gespeichert.  
Die Metadaten werden angezeigt, damit sichtbar ist, ob GPS, Höhe, Blickrichtung, Datum und Beschreibung korrekt übernommen wurden.

![Bilder speichern und vorbereiten](docs/screenshots/bilder-speichern-vorbereiten.png)

Im dritten Screenshot sieht man, wie ein extrahiertes Bild bearbeitet wird.  
Die Beschreibung kann angepasst werden. Danach wird das Bild gespeichert und für den späteren Panoramax-Upload vorbereitet.

## Panoramax-Upload

Der Upload zu Panoramax erfolgt nicht über die Panoramax-Webseite per Drag-and-Drop, sondern über eigenen PHP-Code.

Aktuell verwendete API-Aufrufe:

```text
POST /api/upload_sets
POST /api/upload_sets/<uuid>/files
POST /api/upload_sets/<uuid>/complete
```

Die wichtigste Datei dafür ist:

```text
panoramax_upload.php
```

Die offizielle Panoramax-Seite wird nach dem Upload nur geöffnet, um zu prüfen, ob die Bilder unter „Meine Bilder“ erscheinen.

## Aktueller Prüfpunkt

Es wird noch geprüft, ob für die aktuelle Panoramax-API wirklich diese Route korrekt ist:

```text
POST /api/upload_sets/<uuid>/files
```

oder ob stattdessen diese Route genutzt werden muss:

```text
POST /api/upload_sets/<uuid>/items
```

Dazu gibt es eine eigene Debug-Datei:

```text
docs/PANORAMAX_UPLOAD_DEBUG.md
```

## Dateinamen beim Upload

Vor dem Upload werden die Dateinamen vereinfacht, damit Panoramax keine Probleme mit Leerzeichen, Umlauten oder Sonderzeichen bekommt.

Beispiel:

```text
whatsapp_2026-05-09_165300_frame_0001.jpg
whatsapp_2026-05-09_165300_frame_0002.jpg
```

## Projektstruktur

```text
index.html                    Hauptseite
style.css                     Layout
script.js                     Browserlogik
panoramax_upload.php          PHP-Upload zu Panoramax
zipcodes.json                 Ortsdaten für die Ortssuche
hilfe.html                    Hilfeseite, falls vorhanden
docs/                         Dokumentation
docs/screenshots/             Screenshots für README und Hilfe
```

## Lokaler Test

Für reine Anzeige kann `index.html` direkt im Browser geöffnet werden.  
Für den Panoramax-Upload ist ein Webserver mit PHP nötig.

Beispiel:

```bash
php -S localhost:8000
```

Dann öffnen:

```text
http://localhost:8000/index.html
```

## Sicherheit

Bitte niemals persönliche Token, Passwörter oder private Konfigurationsdateien veröffentlichen.

Nicht ins Repository hochladen:

- Panoramax-Token
- Passwörter
- `.env`-Dateien
- private Uploadordner
- nicht öffentliche Originalbilder

Die Datei `.gitignore` schließt typische lokale und geheime Dateien aus.

## Lizenz

CC BY 4.0 — Lutz Müller (gabischatz)

Dieses Projekt dient der Vorbereitung von Bildmaterial für Panoramax und OpenStreetMap.
