# Foto Geo-Tool — sauberer Serverstand v0.1.97

Dieser Stand ist zum Entpacken auf dem Server gedacht, zum Beispiel:

```text
https://overpass-osm.de.cool/FotoGeoTool/index.html
```

Die App soll in beliebigen Ordnern laufen. Die internen PHP-Aufrufe werden deshalb relativ zum aktuellen Ordner berechnet.

## Enthaltene Laufzeitdateien

```text
index.html
script.js
style.css
icon.svg
preview.png
hilfe.html
video-frame-extractor.html
upload.php
delete.php
panoramax_upload.php
panoramax_config.php
panoramax_config.php.template
zipcodes.json
LICENSE.txt
README.md
```

## Entfernte Altlasten

Diese Dateien wurden aus dem Serverpaket entfernt:

```text
README_v0.1.94.txt
README_v0.1.95.txt
README_v0.1.96_JPEG_UPLOAD.txt
zipcodes_komplett.json
videoskript-fotogeo-tool.md
```

`zipcodes_komplett.json` war doppelt zu `zipcodes.json`. Die App lädt nur `zipcodes.json`.

## Wichtige Hinweise

Für den Betrieb auf dem Server muss diese Datei vorhanden sein:

```text
panoramax_config.php
```

Für GitHub sollte sie nicht mit echtem Token veröffentlicht werden. Dafür gibt es:

```text
panoramax_config.php.template
```

## Panoramax-Upload

Der erfolgreiche Stand aus v0.1.96 bleibt erhalten:

- Bilder werden vor dem Panoramax-Upload serverseitig als saubere JPEG-Dateien neu geschrieben.
- GPS/Zeit werden über Panoramax-API-Overrides gesendet.
- Der Upload läuft über `panoramax_upload.php`.

## Umzug auf overpass-osm.de.cool

Die früher verwendete gabischatz-Domain wurde für diesen Serverstand auf die overpass-osm-Domain umgestellt.

Die eigentlichen App-Aufrufe sind trotzdem möglichst relativ gehalten.


## GitHub-Hinweis

Dieses Paket enthält absichtlich keine echte `panoramax_config.php`.  
Für den Server die Vorlage kopieren:

```text
panoramax_config.php.template
→ panoramax_config.php
```

Dann den Token nur auf dem Server eintragen.
