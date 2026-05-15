/**
 * Projekt: Foto Geo-Tool
 * Datei: https://overpass-osm.de.cool/FotoGeoTool/script.js
 * Autor: Lutz Müller
 * Programmiersprache: JavaScript
 *
 * Cronik:
 *   Version-Datum:
 *     0.0.1, 2.5.2026, 11:46:01 // UTC+2 Deutschland
 *      - Datei erstellt
 *     0.0.2, 7.5.2026, 12:35:00 // UTC+2 Deutschland
 *      - Kopf-Standortanzeige mit Hover-Ortssuche ergänzt
 *     0.0.3, 7.5.2026, 12:45:00 // UTC+2 Deutschland
 *      - Ortsdaten werden jetzt lokal aus ./zipcodes.json im FotoGeoTool-Ordner geladen
 *     0.0.4, 7.5.2026, 13:05:00 // UTC+2 Deutschland
 *      - Klick auf Standortanzeige öffnet Ortssuche als Panel über der Karte wie im Tour Analyzer Plus
 *     0.0.5, 7.5.2026, 15:10:00 // UTC+2 Deutschland
 *      - Bilder-Liste als Select-Auswahl ergänzt und beim Laden/Entfernen synchronisiert
 *     0.0.6, 7.5.2026, 15:40:00 // UTC+2 Deutschland
 *      - GeoImgr-ähnlichen EXIF-Arbeitsbereich, EXIF-Schreiben und Einzeldownload ergänzt
 *     0.0.7, 7.5.2026, 16:20:00 // UTC+2 Deutschland
 *      - Mehrere Bilder per Drag & Drop/Dateiauswahl laden; Select enthält unbearbeitete Bilder, untere Liste gespeicherte Bilder
 *     0.0.9, 7.5.2026, 16:55:00 // UTC+2 Deutschland
 *      - Linken Speicher-Button entfernt; rechter Button heißt Speichern und schreibt EXIF plus gespeicherte Liste
 *     0.1.1, 7.5.2026, 17:35:00 // UTC+2 Deutschland
 *      - BUGFIX: Datum-Fallback aus WhatsApp-/Android-/iPhone-Dateinamen ergänzt
 *     0.1.2, 7.5.2026, 18:05:00 // UTC+2 Deutschland
 *      - FORMAT: nur Versionsstand aktualisiert; Layoutänderungen liegen in style.css
 *     0.1.3, 7.5.2026, 18:35:00 // UTC+2 Deutschland
 *      - BUGFIX: Unbearbeitete Bilder werden nicht mehr als Base64 in localStorage gespeichert, damit große Bildgruppen per Drag & Drop/Dateiauswahl nicht an der Browser-Quota scheitern
 *      - BUGFIX: Gespeicherte Bilder nutzen eine Speicher-Fallback-Logik; große Bilddaten bleiben in der aktuellen Sitzung nutzbar
 *      - BUGFIX: Android-Dateinamen ohne Unterstrich wie IMG20260507154849 werden als Datum erkannt
 *     0.1.4, 7.5.2026, 18:55:00 // UTC+2 Deutschland
 *      - BUGFIX: Beim Laden eines Bildes mit vorhandenen oder gespeicherten Koordinaten zoomt die Karte jetzt auf die maximale Detailstufe
 *     0.1.5, 7.5.2026, 19:10:00 // UTC+2 Deutschland
 *      - BUGFIX: Aktueller Standort und gespeicherte Position zoomen jetzt ebenfalls direkt auf maximale Detailstufe
 *      - BUGFIX: Kartenfokus wird nach Leaflet-Resize erneut gesetzt, damit das Hineinzoomen zuverlässig sichtbar ist
 *     0.1.6, 7.5.2026, 19:25:00 // UTC+2 Deutschland
 *      - BUGFIX: Anderes Bild wählen und Cache löschen setzen das aktuelle Bild vollständig zurück
 *     0.1.7, 7.5.2026, 19:55:00 // UTC+2 Deutschland
 *      - BUGFIX: Beim Speichern wird das Bild aus der oberen Unbearbeitet-Liste entfernt
 *      - NEU: Fortbewegungsart-Buttons schreiben einen Tag in Keywords and Tags
 *      - ZIP: Export schreibt eine panoramax.csv für alle Bilder statt einzelner JSON-Dateien pro Bild
 *      - Panoramax-Upload läuft nicht mehr direkt gegen Fremd-URL, sondern über PHP-Vorbereitung
 *     0.1.9, 8.5.2026, 07:20:00 // UTC+2 Deutschland
 *      - Versionseintrag für CSS-Formatierung der Fortbewegungsart ergänzt; keine JS-Logikänderung
 *     0.1.10, 8.5.2026, 07:40:00 // UTC+2 Deutschland
 *      - Versionseintrag für Formatierung der Fortbewegungsart ergänzt; keine JS-Logikänderung
 *     0.1.11, 8.5.2026, 08:05:00 // UTC+2 Deutschland
 *      - BUGFIX: Fortbewegungsart wird vor dem EXIF-Schreiben zuverlässig in Keywords and Tags übernommen und als EXIF-Keyword geschrieben
 *      - NEU: WhatsApp-Bilder ohne Kamera-Metadaten werden als Kamera/Quelle „WhatsApp“ erkannt
 *     0.1.12, 8.5.2026, 08:20:00 // UTC+2 Deutschland
 *      - Versionseintrag für CSS-Formatierung der Fortbewegungsart ergänzt; keine JS-Logikänderung
 *     0.1.13, 8.5.2026, 08:40:00 // UTC+2 Deutschland
 *      - Versionseintrag für Layout-Tausch der Bilder-Liste ergänzt; keine JS-Logikänderung
 *     0.1.14, 8.5.2026, 09:15:00 // UTC+2 Deutschland
 *      - NEU: Panoramax-Sitzungstoken kann im Panel eingetragen und beim PHP-Upload mitgegeben werden
 *     0.1.15, 8.5.2026, 09:35:00 // UTC+2 Deutschland
 *      - Versionseintrag für Panoramax-Buttonformatierung ergänzt; keine JS-Logikänderung
 *     0.1.16, 8.5.2026, 09:55:00 // UTC+2 Deutschland
 *      - NEU: Kopfbutton Panoramax scrollt nur zum Panoramax-Panel; Upload bleibt ausschließlich am Button Upload starten
 *     0.1.17, 8.5.2026, 10:10:00 // UTC+2 Deutschland
 *      - PANORAMAX: Token wird dauerhaft im Browser gespeichert und nur durch den Löschen-Button entfernt
 *     0.1.18, 8.5.2026, 10:35:00 // UTC+2 Deutschland
 *      - Versionseintrag für Layouttausch/kompakteres CSS ergänzt; keine JS-Logikänderung
 *     0.1.19, 8.5.2026, 10:55:00 // UTC+2 Deutschland
 *      - NEU: Gespeicherte Bilder werden chronologisch nach Aufnahmedatum sortiert; ZIP- und Panoramax-Upload verwenden dieselbe Reihenfolge
     0.1.25, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: Description-Hilfsfunktionen wieder global verfügbar gemacht.
      - BUGFIX: setMarker bricht nicht mehr ab, wenn Leaflet noch nicht initialisiert ist.
     0.1.26, 8.5.2026 // UTC+2 Deutschland
      - Version zur Button-Reihenfolge und Description-Morph-Eingabe ergänzt.
     0.1.27, 8.5.2026 // UTC+2 Deutschland
      - Description-Morph-Speichern/Schließen-Buttons angebunden.
     0.1.28, 8.5.2026 // UTC+2 Deutschland
      - Version zur Entfernung des ALT-Links ergänzt.
     0.1.29, 8.5.2026 // UTC+2 Deutschland
      - Google-Lens-Test über Server-Bild-URL ergänzt.
      - Öffentliche Bild-URL wird aus upload.php gespeichert und kopierbar gemacht.
     0.1.30, 8.5.2026 // UTC+2 Deutschland
      - Version zur Description-Dialog-Umsetzung ergänzt.
      - Google Lens bleibt als Link-/URL-Test; keine direkte Alt-Text-API eingebaut.
     0.1.31, 8.5.2026 // UTC+2 Deutschland
      - Description-Dialog angebunden.
      - Kompakte Anzeige-Box wird nach jeder Änderung aktualisiert.
     0.1.32, 8.5.2026 // UTC+2 Deutschland
      - Description-Dialog kleiner, verschiebbar und Position per localStorage gespeichert.
     0.1.33, 8.5.2026 // UTC+2 Deutschland
      - Alt-Text/Lens-Buttons an Google-Lens-URL-Test angebunden.
     0.1.35, 8.5.2026 // UTC+2 Deutschland
      - Google-Lens-Zwischenablage-Prompt auf „SEO-Alternativtext für dieses Bild“ geändert.
     0.1.36, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: Google-Lens-Fenster wird synchron beim Klick geöffnet und nach Upload auf die Bild-URL weitergeleitet.
     0.1.37, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: Google Lens nutzt temporären Server-Upload ohne saveImageToCache und ohne Wechsel zum nächsten Bild.
      - BUGFIX: Bei Alt-Text-Suche bleibt „SEO-Alternativtext für dieses Bild“ in der Zwischenablage.
     0.1.38, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: „SEO-Alternativtext für dieses Bild“ wird vor Upload/Weiterleitung synchron in die Zwischenablage kopiert.
     0.1.39, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: createTemporaryLensImageEntry ergänzt.
      - NEU: Vorbereitungsseite zeigt drehende Sanduhr.
     0.1.40, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: Panoramax-Token-Eingabefeld wird bei fehlendem Token aktiv geleert und Placeholder gesetzt.
     0.1.41, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Upload-Button wird abhängig vom gespeicherten Browser-Token aktiviert/deaktiviert.
     0.1.42, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Upload zeigt jetzt message/details aus PHP statt falscher Standardmeldung.
     0.1.43, 8.5.2026 // UTC+2 Deutschland
      - Version zur CSS-Bereinigung ergänzt.
     0.1.44, 8.5.2026 // UTC+2 Deutschland
      - Beschreibung wird aus EXIF gelesen, im Metadatenpanel angezeigt und beim Speichern/EXIF-Schreiben synchronisiert.
     0.1.45, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Transport-Tags normalisiert: foot→walk, bicycle→bike.
      - CSV/EXIF/Panoramax-Upload nutzen nun transport=walk/bike/car.
     0.1.46, 8.5.2026 // UTC+2 Deutschland
      - Version zur Meta-/Lizenz-Ergänzung ergänzt.
     0.1.47, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Testversion: transport-Tag wird nicht mehr in JPEG-EXIF-Felder DocumentName/XPKeywords geschrieben.
      - Es bleiben nur sichere Felder: GPS, Datum, Beschreibung, Make/Model.
     0.1.48, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Minimaltest: Make/Model/ImageDescription/UserComment/XP-Felder/DocumentName werden beim EXIF-Schreiben entfernt.
      - Damit wird getestet, ob Panoramax nur mit GPS+Datum akzeptiert.
     0.1.49, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX/TEST: writeExifTagsForCurrentImage baut nun ein komplett frisches EXIF-Objekt.
      - Alte EXIF-/MakerNote-/Thumbnail-Felder werden nicht mehr in die gespeicherte Datei übernommen.
     0.1.50, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-Reencode-Test: vor dem EXIF-Einfügen wird das Bild über Canvas komplett neu als JPEG kodiert.
      - Dadurch werden alte APP-/XMP-/MakerNote-/Thumbnail-/Sondersegmente entfernt.
     0.1.51, 8.5.2026 // UTC+2 Deutschland
      - BUGFIX: Funktion writeExifTagsForCurrentImage auf async umgestellt, weil v0.1.50 await innerhalb einer normalen Funktion enthielt.
     0.1.52, 8.5.2026 // UTC+2 Deutschland
      - Panoramax-360-Test: 2:1-JPEGs erhalten nach dem Reencode GPano-XMP-Felder für equirectangular Panorama.
      - Damit wird geprüft, ob Panoramax am 360°/2:1-Sonderfall ohne GPano-Metadaten scheitert.
     0.1.53, 8.5.2026 // UTC+2 Deutschland
      - Version zur Einbindung des Video-Frame-Extractors ergänzt.
     0.1.54, 9.5.2026 // UTC+2 Deutschland
      - Video-Dateien können per Drag & Drop geladen werden.
      - Frame-Extractor erzeugt Bilder aus dem Video und übernimmt sie direkt in die obere Bilder-Liste.
      - Beschreibung wird einmal eingegeben und auf alle extrahierten Frames angewendet.
     0.1.55, 9.5.2026 // UTC+2 Deutschland
      - Video-Frame-Serien erhalten seriesId/seriesType.
      - Beschreibung und GEO-Position werden innerhalb einer Video-Serie automatisch auf alle Frames übertragen.
      - WhatsApp-Quellen setzen Kamera/Quelle WhatsApp und erzeugen WhatsApp-kompatible Frame-Dateinamen.
     0.1.56, 9.5.2026 // UTC+2 Deutschland
      - Frame-Extraktion blockiert nicht mehr bei fehlenden Koordinaten.
      - Video-Frames können ohne GPS in die Bearbeitungsliste übernommen werden; GEO wird beim späteren Speichern geschrieben.
      - Dialoganzeige unterscheidet zwischen übernommener GPS-Position und GPS später setzen.
     0.1.57, 9.5.2026 // UTC+2 Deutschland
      - BUGFIX: maybeAddGpanoXmpForPanoramax erhält jetzt den echten Wert aus #date-input statt einer nicht definierten Variable dateInput.
      - BUGFIX: Speichern wartet jetzt auf writeExifTagsForCurrentImage, bevor saveImageToCache läuft.
      - UX: Video-Dateiname wird ohne WhatsApp-Video-/Video-Vorsatz angezeigt.
      - UX: Nach erfolgreicher Frame-Erzeugung wird 'Frames extrahieren' deaktiviert und 'FotoGeo-Tool' aktiviert.
     0.1.58, 9.5.2026 // UTC+2 Deutschland
      - Video-Frames erhalten skipped-Status.
      - Klick auf ein Thumbnail schaltet ausgelassen/aktiv um.
      - transferVideoFramesToFotoGeoTool übernimmt nur aktive Frames.
      - Status zeigt aktive und ausgelassene Frames getrennt.
     0.1.59, 9.5.2026 // UTC+2 Deutschland
      - Keine Funktionsänderung: vorhandene IDs bleiben erhalten; Layout wurde im HTML/CSS umgebaut.
     0.1.60, 9.5.2026 // UTC+2 Deutschland
      - Panoramax-Upload-Button bekommt Statusklasse is-ready-to-upload, wenn Token vorhanden ist, gespeicherte Bilder vorhanden sind und keine unbearbeiteten Bilder mehr offen sind.
      - Nach saveImageToCache wird der Panoramax-Status aktualisiert.
     0.1.61, 9.5.2026 // UTC+2 Deutschland
      - Version zur Hilfeseite ergänzt.
     0.1.62, 9.5.2026 // UTC+2 Deutschland
      - normalizeCopyrightInDescription erkennt jetzt © und @ als Copyright-Schreibweise.
      - insertCopyrightNameAtCursor ersetzt ein einzelnes @ oder © am Cursor-/Textende durch den gespeicherten Copyright-Namen.
      - clearAllCache ruft updatePanoramaxAuthStatus auf und entfernt damit is-ready-to-upload.
     0.1.63, 9.5.2026 // UTC+2 Deutschland
      - Version zur kompakten Fotoframeextraktor-Darstellung ergänzt; keine Logikänderung.
     0.1.64, 9.5.2026 // UTC+2 Deutschland
      - Version zur Hilfetext-Erweiterung ergänzt; keine Logikänderung.
     0.1.65, 9.5.2026 // UTC+2 Deutschland
      - Version zur Geo-Editor-Buttonausrichtung ergänzt; keine Logikänderung.
     0.1.66, 9.5.2026 // UTC+2 Deutschland
      - Fallback ergänzt: videoFrameProgress wird beim Öffnen des Fotoframeextraktors automatisch in den linken Werkzeugbereich verschoben, falls der Browser alte HTML-Struktur lädt.
     0.1.67, 9.5.2026 // UTC+2 Deutschland
      - Neue Funktion extractCoordsFromFilename ergänzt.
      - Video-Dateinamen und Bild-Dateinamen mit Dezimal-Koordinaten werden erkannt.
      - Beim Video-Laden wird der Marker automatisch aus dem Dateinamen gesetzt, wenn Koordinaten gefunden werden.
     0.1.68, 9.5.2026 // UTC+2 Deutschland
      - extractCoordsFromFilename erkennt zusätzlich lon,lat für Europa, z. B. „10.591496, 51.096510 WhatsApp Video …mp4“.
      - Die Rückgabe enthält order: 'lat,lng' oder 'lng,lat'.
     0.1.69, 9.5.2026 // UTC+2 Deutschland
      - Copyright-Normalisierung setzt bei bestehendem Beschreibungstext automatisch den Trenner „ | “.
      - Beispiel: „Baustelle @ gabischatz“ wird zu „Baustelle | © gabischatz“.
     0.1.70, 9.5.2026 // UTC+2 Deutschland
      - Neue Funktion buildEvenVideoFrameTimestamps ergänzt.
      - videoFrameMax ist jetzt die gewünschte Zielanzahl der Frames.
      - Frames werden rhythmisch über die komplette Videodauer verteilt, inklusive Anfang und Ende.
     0.1.71, 11.5.2026 // UTC+2 Deutschland
      - NEU: Shift-Klick auf die Karte setzt Richtungsmarker 1 und 2 für Startblickrichtung und Drehende.
      - NEU: Richtungskreis, Richtungslinien und Anzeige von Startwinkel, Endwinkel und Drehrichtung ergänzt.
      - PANORAMAX: GPSImgDirection, GPSDateStamp und GPSTimeStamp werden in JPEG-EXIF geschrieben.
     0.1.72, 11.5.2026 // UTC+2 Deutschland
      - NEU: deriveAltitudeForCurrentCoords mit Höhen-API-Fallbacks und LocalStorage-Cache.
      - NEU: setGpsAltitudeExif schreibt GPSAltitude/GPSAltitudeRef auch beim normalen Bildspeichern.
      - NEU: Richtungskreis wird direkt nach Standortmarker angezeigt; Klick auf den Kreis setzt Blickrichtungsmarker.
      - BUGFIX: writeExifTagsForCurrentImage als async deklariert; Google-Lens-Temporärbild wartet auf EXIF-Schreiben.
     0.1.73, 11.5.2026 // UTC+2 Deutschland
      - NEU: MAX_DIRECTION_DELTA_DEG = 45.
      - NEU: Richtung 2 wird beim Setzen auf ±45° zur Startblickrichtung begrenzt.
      - NEU: Für Einzelbilder wird nur ein Blickrichtungspunkt zugelassen; End-/Drehpunkt nur bei Video-Frames.
      - NEU: Roter Kreisbogen mit Pfeil zeigt die Drehrichtung; orange Linie/Punkt für das Drehende wird ausgeblendet.
     0.1.74, 11.5.2026 // UTC+2 Deutschland
      - NEU: extractExifAltitude, extractExifDirection, updateAltitudeMetaRow und updateDirectionMetaRow.
      - BUGFIX: setGpsDirectionExif/setGpsAltitudeExif schreiben auch dann, wenn piexif.GPSIFD einzelne Konstanten nicht bereitstellt.
      - BUGFIX: saveImageToCache schreibt angle/direction und altitude stabil in den Cache.
      - BUGFIX: Video-Frames speichern altitude zusätzlich im Frame-Eintrag.
     0.1.75, 11.5.2026 // UTC+2 Deutschland
      - Keine JavaScript-Änderung; HTML-Icon-Link ergänzt.
     0.1.76, 11.5.2026 // UTC+2 Deutschland
      - Panoramax-Upload sendet jetzt zusätzlich altitude, direction, directionEnd und title an panoramax_upload.php.
      - Bei Panoramax-Fehlern werden upload_set_id, failed_file und GET-/files-Diagnose in der Konsole ausgegeben.
     0.1.77, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: createDirectionArrowIcon erwartet jetzt CSS-Rotation; Kompass-Bearing wird korrekt nach CSS-Winkel umgerechnet.
      - NEU: panoramaDirectionForFrame verteilt GPSImgDirection über 360° statt nur über den 45°-Bogen.
      - NEU: transferVideoFramesToFotoGeoTool berechnet die Richtung erneut über die Anzahl der aktiven Frames.
     0.1.78, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: getCurrentImageDirectionValue ergänzt.
      - BUGFIX: writeExifTagsForCurrentImage nutzt die Bildrichtung aus dem aktuellen Bilderlisteneintrag.
      - BUGFIX: updateStoredCurrentImage speichert direction/angle mit dem tatsächlich geschriebenen Winkel.
     0.1.79, 11.5.2026 // UTC+2 Deutschland
      - NEU: PANORAMAX_YOUR_PICTURES_URL ergänzt.
      - NEU: Nach erfolgreichem Upload automatische Weiterleitung zu Meine Bilder bei Panoramax.
     0.1.80, 11.5.2026 // UTC+2 Deutschland
      - NEU: suppressDirectionRangeVisual verhindert den roten Drehbogen bei gespeicherten Bildern.
      - UI: Roter Drehbogen nutzt dashArray.
     0.1.81, 11.5.2026 // UTC+2 Deutschland
      - UI: directionArrowMarker nutzt jetzt einen leicht kleineren Radius für die Pfeilposition.
     0.1.82, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Pfeilposition auf 94 % des Radius gesetzt.
      - BUGFIX: continueWithNextPendingAfterSave ergänzt.
      - BUGFIX: saveImageToCache nutzt getCurrentImageDirectionValue.
     0.1.83, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Token-Eingabe wird als normales Textfeld behandelt und nach dem Speichern maskiert/deaktiviert.
     0.1.84, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Upload-Hinweis präzisiert; keine Weiterleitung bei fehlgeschlagenem Upload.
     0.1.85, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Pfeilposition wird aus Leaflet-LayerPoint berechnet: Endpunkt am Kreis minus 3 px Richtung Mittelpunkt.
     0.1.86, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: createDirectionArrowIcon erzeugt jetzt ein SVG mit exakt zentriertem viewBox-/Transform-Ursprung.
     0.1.87, 11.5.2026 // UTC+2 Deutschland
      - UI: Rote SVG-Pfeilspitze sitzt wieder direkt am berechneten Kreis-/Bogen-Endpunkt; kein Radius-minus-3-px mehr.
     0.1.88, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: Weiterleitung zu Panoramax hängt nicht mehr davon ab, ob der Abschluss-Endpunkt ein sauberes OK liefert.
      - NEU: robuster Wechsel zu https://panoramax.basi.re/your-pictures mit sichtbarem Ersatzlink.
     0.1.89, 11.5.2026 // UTC+2 Deutschland
      - DATEN: Ortssuche nutzt die neu eingespielte zipcodes.json mit mehr Orts-/PLZ-Treffern.
     0.1.90, 11.5.2026 // UTC+2 Deutschland
      - NEU: Statusmeldung verweist darauf, dass kein zusätzlicher Drag-and-Drop-Upload auf der Panoramax-Webseite nötig ist.
     0.1.91, 11.5.2026 // UTC+2 Deutschland
      - BUGFIX: findZipResults arbeitet tokenbasiert; PLZ + Anfangsbuchstaben findet jetzt z. B. 99947 Waldstedt.
      - NEU: getZipLat/getZipLng nutzt Koordinaten-Fallback aus gleicher PLZ, wenn einzelne Einträge leere Koordinaten haben.
     0.1.92, 11.5.2026 // UTC+2 Deutschland
      - DIAGNOSE: Panoramax-Status zeigt jetzt upload_files_url und upload_set_id aus der PHP-Antwort.
     0.1.93, 11.5.2026 // UTC+2 Deutschland
      - DIAGNOSE: Statusmeldung unterscheidet jetzt angenommene, abgelehnte und fehlgeschlagene Dateien.
     0.1.95, 14.5.2026 // UTC+2 Deutschland
      - Panoramax-Upload arbeitet mit neuer panoramax_upload.php v0.1.95; Metadaten werden serverseitig als API-Overrides gesendet.
     0.1.96, 14.5.2026 // UTC+2 Deutschland
      - Version zu Panoramax-JPEG-Härtung synchronisiert.
     0.1.97, 15.5.2026 // UTC+2 Deutschland
      - BEREINIGUNG: PHP_SERVER_URL ist jetzt dynamisch relativ zum aktuellen Ordner; dadurch kann FotoGeoTool in beliebigen Ordnern laufen.
      - BEREINIGUNG: feste gabischatz-Links durch overpass-osm-Ziel bzw. relative Basis ersetzt.
 */

// =====================================================
    // Globale Variablen
    // =====================================================
    let currentCoords  = null;
    let currentMarker  = null;
    let map            = null;
    let currentFileData = null;
    let currentFilename = null;
    let currentLoadedImageId = null;
    let currentPendingImageId = null;
    let currentOriginalFilename = null;
    let currentExifCoords = null;
    let currentExifWritten = false;
    let zipData        = null;
    let pendingImagesMemory = [];
    let savedImagesMemory = null;
    let currentTransportTag = 'transport=walk';
    let currentVideoFrameFile = null;
    let currentVideoFrameUrl = '';
    let extractedVideoFrameEntries = [];
    let currentAltitude = null;
    let directionMarkers = [];
    let directionLines = [];
    let directionCircle = null;
    let directionArcLayer = null;
    let directionArrowMarker = null;
    let currentDirectionInfo = null;
    let currentDirectionRangeEnabled = false;
    let suppressDirectionRangeVisual = false;

    let activeSeriesPropagation = true;



    // Cache-Schlüssel
    const STORAGE_POSITION_KEY = 'foto_geo_tool_position';
    const STORAGE_IMAGES_KEY = 'foto_geo_tool_images';
    const STORAGE_PENDING_IMAGES_KEY = 'foto_geo_tool_pending_images';
    const STORAGE_SESSION_KEY = 'foto_geo_tool_session';
    const STORAGE_PANORAMAX_TOKEN_KEY = 'foto_geo_tool_panoramax_token';
    const STORAGE_PANORAMAX_TOKEN_SESSION_KEY = 'foto_geo_tool_panoramax_token_session';
    const STORAGE_LAST_DESCRIPTION_KEY = 'foto_geo_tool_last_description';
    const STORAGE_COPYRIGHT_NAME_KEY = 'foto_geo_tool_copyright_name';
    const STORAGE_DESCRIPTION_DIALOG_POS_KEY = 'foto_geo_tool_description_dialog_pos';
    const STORAGE_DIRECTION_KEY = 'foto_geo_tool_direction_markers';
    const STORAGE_ELEVATION_CACHE_KEY = 'foto_geo_tool_elevation_cache_v1';

    // Lokale PHP-Endpunkte
    const PHP_SERVER_URL = new URL('./', window.location.href).href;
    const PANORAMAX_YOUR_PICTURES_URL = 'https://panoramax.basi.re/your-pictures';

    function goToPanoramaxYourPictures(delayMs = 900) {
      const url = PANORAMAX_YOUR_PICTURES_URL;
      window.setTimeout(() => {
        try {
          window.location.assign(url);
          return;
        } catch (err) {
          console.warn('Wechsel zu Panoramax per location.assign fehlgeschlagen:', err);
        }

        try {
          window.open(url, '_self');
        } catch (err) {
          console.warn('Wechsel zu Panoramax per window.open fehlgeschlagen:', err);
        }
      }, delayMs);
    }

    const ZIP_JSON_URL = 'zipcodes.json';
    const MAP_DEFAULT_ZOOM = 6;
    const MAP_DETAIL_ZOOM = 19;
    const DIRECTION_CIRCLE_DEFAULT_RADIUS_M = 180;
    const MAX_DIRECTION_DELTA_DEG = 45;

    // =====================================================
    // Leaflet-Karte
    // =====================================================
    function initMap() {
      map = L.map('map').setView([51.0, 10.5], MAP_DEFAULT_ZOOM);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);
      map.on('contextmenu', function(e) {
        setMarker(e.latlng.lat, e.latlng.lng, 'Manuell gesetzt', true);
      });
      map.on('click', function(e) {
        if (e.originalEvent && e.originalEvent.shiftKey) {
          e.originalEvent.preventDefault();
          addDirectionMarker(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    function focusMapOnDetail(lat, lng) {
      if (!map) return;
      const target = [lat, lng];

      // Sofort setzen, damit der Benutzer direkt die Detailansicht sieht.
      map.setView(target, MAP_DETAIL_ZOOM, { animate: false });

      // Nach Layout-/Grid-Änderungen rendert Leaflet manchmal noch mit alter Größe.
      // Darum einmal kurz später Größe neu berechnen und denselben Fokus erneut setzen.
      window.setTimeout(() => {
        if (!map) return;
        map.invalidateSize(false);
        map.setView(target, MAP_DETAIL_ZOOM, { animate: false });
      }, 80);
    }

    // =====================================================
    // Marker (verschiebbar)
    // =====================================================

    function ensureMapReady() {
      if (map) return true;
      const mapEl = document.getElementById('map');
      if (!mapEl || typeof L === 'undefined') return false;
      initMap();
      return !!map;
    }


    // =====================================================
    // Blickrichtung / Drehbereich für Panoramax
    // =====================================================

    function toRad(deg) { return deg * Math.PI / 180; }
    function toDeg(rad) { return rad * 180 / Math.PI; }
    function normalizeBearing(deg) { return ((Number(deg) % 360) + 360) % 360; }

    function bearingBetweenCoords(from, to) {
      if (!from || !to) return null;
      const lat1 = toRad(from.lat);
      const lat2 = toRad(to.lat);
      const dLon = toRad(to.lng - from.lng);
      const y = Math.sin(dLon) * Math.cos(lat2);
      const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
      return normalizeBearing(toDeg(Math.atan2(y, x)));
    }

    function signedBearingDelta(start, end) {
      if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
      return ((end - start + 540) % 360) - 180;
    }

    function clampSignedBearingDelta(delta, maxAbs = MAX_DIRECTION_DELTA_DEG) {
      if (!Number.isFinite(delta)) return 0;
      return Math.max(-maxAbs, Math.min(maxAbs, delta));
    }

    function destinationPointFromBearing(center, bearingDeg, distanceMeters) {
      const earthRadius = 6371008.8;
      const angularDistance = Number(distanceMeters) / earthRadius;
      const bearing = toRad(bearingDeg);
      const lat1 = toRad(center.lat);
      const lng1 = toRad(center.lng);

      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(angularDistance) +
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing)
      );

      const lng2 = lng1 + Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2)
      );

      return {
        lat: toDeg(lat2),
        lng: ((toDeg(lng2) + 540) % 360) - 180
      };
    }


    function parsePanoramaPresetFromUrl() {
      const params = new URLSearchParams(window.location.search || '');
      let raw = params.get('q') || params.get('panorama') || '';
      raw = String(raw || '').trim();

      let parts = raw
        ? raw.split(',').map(part => decodeURIComponent(part).trim()).filter(Boolean)
        : [];

      // Zusätzlich direkte Parameter erlauben:
      // ?lat=51.109790&lng=10.636210&heading=51&rotation=right
      if (parts.length < 3 && params.has('lat') && params.has('lng')) {
        parts = [
          params.get('lat'),
          params.get('lng'),
          params.get('heading') || params.get('bearing') || params.get('start') || '',
          params.get('rotation') || params.get('direction') || params.get('turn') || ''
        ].map(part => String(part || '').trim()).filter(Boolean);
      }

      if (parts.length < 2) return null;

      const lat = Number(String(parts[0]).replace(',', '.'));
      const lng = Number(String(parts[1]).replace(',', '.'));
      const startBearing = normalizeBearing(Number(String(parts[2] || 0).replace(',', '.')));
      const rotationRaw = String(parts[3] || 'right').toLowerCase();

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
      if (!Number.isFinite(startBearing)) return null;

      const rotationSign = /^(left|links|l|ccw|gegen|gegen-uhr|gegen_den_uhrzeigersinn)/i.test(rotationRaw) ? -1 : 1;
      const rotationLabel = rotationSign < 0 ? 'links' : 'rechts';

      return {
        lat,
        lng,
        startBearing,
        rotationSign,
        rotationLabel,
        source: raw || `${lat},${lng},${startBearing},${rotationLabel}`
      };
    }

    function applyPanoramaPresetFromUrl() {
      const preset = parsePanoramaPresetFromUrl();
      if (!preset) return false;

      if (!ensureMapReady()) return false;

      // Der Link kommt vom Geopositionstool und beschreibt ein Panoramavideo.
      // Darum wird der Drehbereich schon vor dem Laden des Videos aktiviert.
      currentDirectionRangeEnabled = true;
      suppressDirectionRangeVisual = false;

      setMarker(preset.lat, preset.lng, 'Panoramavideo Position', true);

      // Bestehende Richtungsmarker aus alten Sitzungen dürfen den Link nicht überlagern.
      if (map) {
        directionMarkers.forEach(m => map.removeLayer(m));
        directionLines.forEach(l => map.removeLayer(l));
        if (directionCircle) map.removeLayer(directionCircle);
        if (directionArcLayer) map.removeLayer(directionArcLayer);
        if (directionArrowMarker) map.removeLayer(directionArrowMarker);
      }
      directionMarkers = [];
      directionLines = [];
      directionCircle = null;
      directionArcLayer = null;
      directionArrowMarker = null;
      currentDirectionInfo = null;

      const radius = DIRECTION_CIRCLE_DEFAULT_RADIUS_M;
      const startPoint = destinationPointFromBearing(currentCoords, preset.startBearing, radius);
      const endBearing = normalizeBearing(preset.startBearing + preset.rotationSign * MAX_DIRECTION_DELTA_DEG);
      const endPoint = destinationPointFromBearing(currentCoords, endBearing, radius);

      addDirectionMarker(startPoint.lat, startPoint.lng, false);
      addDirectionMarker(endPoint.lat, endPoint.lng, false);
      saveDirectionMarkersToCache();
      renderDirectionOverlay();

      showStatus(
        `📍 Panoramavideo-Position aus Link übernommen: ${preset.lat.toFixed(6)}, ${preset.lng.toFixed(6)} · Start ${preset.startBearing.toFixed(1)}° · ${preset.rotationLabel}herum. Ziehe jetzt nur noch das Video auf die Eingabefläche.`,
        'success'
      );

      return true;
    }


    function getDirectionCircleRadius() {
      if (!currentCoords || !directionMarkers[0]) return DIRECTION_CIRCLE_DEFAULT_RADIUS_M;
      const first = directionMarkers[0].getLatLng();
      const distance = map.distance([currentCoords.lat, currentCoords.lng], [first.lat, first.lng]);
      return Number.isFinite(distance) && distance > 5 ? distance : DIRECTION_CIRCLE_DEFAULT_RADIUS_M;
    }

    function isVideoDirectionRangeAllowed() {
      return Boolean(
        currentDirectionRangeEnabled ||
        currentFileData?.seriesType === 'video' ||
        currentFileData?.fromVideo ||
        currentVideoFrameFile ||
        extractedVideoFrameEntries?.length
      );
    }

    function buildDirectionArcPoints(center, radiusMeters, startBearing, delta) {
      const points = [];
      if (!center || !Number.isFinite(startBearing) || !Number.isFinite(delta) || Math.abs(delta) < 0.25) return points;

      const steps = Math.max(8, Math.ceil(Math.abs(delta) / 3));
      for (let i = 0; i <= steps; i += 1) {
        const bearing = normalizeBearing(startBearing + delta * (i / steps));
        const p = destinationPointFromBearing(center, bearing, radiusMeters);
        points.push([p.lat, p.lng]);
      }
      return points;
    }

    function createDirectionArrowIcon(cssRotationDeg) {
      const rot = Number.isFinite(Number(cssRotationDeg)) ? Number(cssRotationDeg) : 0;

      // Kein Unicode-Pfeil mehr:
      // Das Zeichen „➤“ hat je nach Schriftart eine unsymmetrische Bounding-Box.
      // Dadurch wirkte der Pfeil beim Drehen mal richtig und mal verschoben.
      // Das SVG hat dagegen einen exakt definierten Mittelpunkt bei 15/15.
      const svg = `
        <svg class="direction-arc-arrow-svg"
             viewBox="0 0 30 30"
             width="30"
             height="30"
             aria-hidden="true"
             style="transform: rotate(${rot.toFixed(1)}deg);">
          <path class="direction-arc-arrow-shadow"
                d="M25 15 L7 5.5 L10.2 15 L7 24.5 Z"></path>
          <path class="direction-arc-arrow-fill"
                d="M25 15 L7 5.5 L10.2 15 L7 24.5 Z"></path>
        </svg>`;

      return L.divIcon({
        className: 'direction-arc-arrow-icon',
        html: svg,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    }

    function directionLabelFromDelta(delta) {
      if (Math.abs(delta) < 2) return 'keine erkennbare Drehung';
      return delta > 0 ? 'rechtsherum / im Uhrzeigersinn' : 'linksherum / gegen Uhrzeigersinn';
    }

    function getCurrentStartDirection() {
      if (currentDirectionInfo && Number.isFinite(currentDirectionInfo.startBearing)) return currentDirectionInfo.startBearing;
      return 0;
    }

    function getCurrentRotationSign() {
      if (currentDirectionInfo && Number.isFinite(currentDirectionInfo.delta) && Math.abs(currentDirectionInfo.delta) >= 0.25) {
        return currentDirectionInfo.delta < 0 ? -1 : 1;
      }
      return 1;
    }

    function panoramaDirectionForFrame(index, total) {
      const start = getCurrentStartDirection();
      const count = Math.max(1, Number(total) || 1);
      const step = 360 / (count + 1);
      return normalizeBearing(start + getCurrentRotationSign() * step * index);
    }

    function interpolateDirectionForIndex(index, total) {
      // Einzelbilder: die gesetzte Blickrichtung bleibt statisch.
      if (!isVideoDirectionRangeAllowed()) return getCurrentStartDirection();

      // Video-/Panorama-Frames: jedes Bild bekommt eine eigene Richtung.
      // Nicht über den 45°-Bogen interpolieren, sondern gleichmäßig über die Rundum-Bewegung.
      return panoramaDirectionForFrame(index, total);
    }

    function getGpsTagId(name, fallback) {
      return (typeof piexif !== 'undefined' && piexif.GPSIFD && piexif.GPSIFD[name] !== undefined)
        ? piexif.GPSIFD[name]
        : fallback;
    }

    function setGpsDirectionExif(exifObj, direction) {
      const d = normalizeBearing(Number(direction));
      if (!exifObj || !exifObj.GPS || !Number.isFinite(d)) return false;
      exifObj.GPS[getGpsTagId('GPSImgDirectionRef', 16)] = 'T';
      exifObj.GPS[getGpsTagId('GPSImgDirection', 17)] = [Math.round(d * 100), 100];
      return true;
    }

    function setGpsDateTimeExif(exifObj, dateValue) {
      const date = parseDateInputToDate(dateValue);
      if (!exifObj || !exifObj.GPS || !date) return;
      const pad = n => String(n).padStart(2, '0');
      exifObj.GPS[piexif.GPSIFD.GPSDateStamp] = `${date.getFullYear()}:${pad(date.getMonth() + 1)}:${pad(date.getDate())}`;
      exifObj.GPS[piexif.GPSIFD.GPSTimeStamp] = [
        [date.getHours(), 1],
        [date.getMinutes(), 1],
        [date.getSeconds(), 1]
      ];
    }

    function clearDirectionMarkers() {
      if (map) {
        directionMarkers.forEach(m => map.removeLayer(m));
        directionLines.forEach(l => map.removeLayer(l));
        if (directionCircle) map.removeLayer(directionCircle);
        if (directionArcLayer) map.removeLayer(directionArcLayer);
        if (directionArrowMarker) map.removeLayer(directionArrowMarker);
      }
      directionMarkers = [];
      directionLines = [];
      directionCircle = null;
      directionArcLayer = null;
      directionArrowMarker = null;
      currentDirectionInfo = null;
      currentDirectionRangeEnabled = false;
      try { localStorage.removeItem(STORAGE_DIRECTION_KEY); } catch(e) {}
      updateDirectionDisplay();
    }

    function saveDirectionMarkersToCache() {
      try {
        const data = directionMarkers.map(m => {
          const p = m.getLatLng();
          return { lat: p.lat, lng: p.lng };
        });
        localStorage.setItem(STORAGE_DIRECTION_KEY, JSON.stringify(data));
      } catch(e) {}
    }

    function loadDirectionMarkersFromCache() {
      try {
        const raw = localStorage.getItem(STORAGE_DIRECTION_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!Array.isArray(data)) return;
        data.slice(0, 2).forEach(p => {
          if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) addDirectionMarker(p.lat, p.lng, false);
        });
      } catch(e) {}
    }

    function addDirectionMarker(lat, lng, persist = true) {
      suppressDirectionRangeVisual = false;
      if (!ensureMapReady()) return;
      if (!currentCoords) {
        showStatus('ℹ️ Setze zuerst den Standort-Marker. Danach setzt ein Klick auf den Richtungskreis die Blickrichtung.', 'info');
        return;
      }

      const allowRange = isVideoDirectionRangeAllowed();

      // Einzelbilder: nur Startblickrichtung. Ein weiterer Klick ersetzt den Startpunkt.
      if (!allowRange && directionMarkers.length >= 1) {
        directionMarkers.forEach(m => map.removeLayer(m));
        directionMarkers = [];
      }

      // Video-Frames: maximal Start + Ende. Danach neu beginnen.
      if (allowRange && directionMarkers.length >= 2) {
        directionMarkers.forEach(m => map.removeLayer(m));
        directionMarkers = [];
      }

      const nr = directionMarkers.length + 1;
      let target = { lat, lng };
      let clampedInfo = null;

      if (nr === 2 && directionMarkers[0]) {
        const startBearing = bearingBetweenCoords(currentCoords, directionMarkers[0].getLatLng());
        const rawEndBearing = bearingBetweenCoords(currentCoords, target);
        const rawDelta = signedBearingDelta(startBearing, rawEndBearing);
        const clampedDelta = clampSignedBearingDelta(rawDelta, MAX_DIRECTION_DELTA_DEG);
        const radius = getDirectionCircleRadius();
        const clampedBearing = normalizeBearing(startBearing + clampedDelta);
        target = destinationPointFromBearing(currentCoords, clampedBearing, radius);

        if (Math.abs(rawDelta) > MAX_DIRECTION_DELTA_DEG) {
          clampedInfo = { rawDelta, clampedDelta };
        }
      }

      const markerOptions = nr === 1
        ? {
            radius: 7,
            color: '#ffcc00',
            fillColor: '#ffcc00',
            fillOpacity: 0.95,
            weight: 2,
            interactive: true
          }
        : {
            // Der zweite Punkt wird logisch gespeichert, aber nicht orange gezeichnet.
            // Sichtbar ist nur der rote Kreisbogen mit Pfeil.
            radius: 1,
            color: '#ff0000',
            fillColor: '#ff0000',
            opacity: 0,
            fillOpacity: 0,
            weight: 0,
            interactive: false
          };

      const marker = L.circleMarker([target.lat, target.lng], markerOptions)
        .addTo(map)
        .bindPopup(nr === 1 ? 'Blickrichtung Start' : 'Blickrichtung Ende / Drehziel');

      directionMarkers.push(marker);
      renderDirectionOverlay();
      if (persist) saveDirectionMarkersToCache();

      if (nr === 2 && clampedInfo) {
        showStatus(`↪ Drehbereich auf ${MAX_DIRECTION_DELTA_DEG}° begrenzt und neu positioniert.`, 'info');
      } else if (nr === 2) {
        showStatus('↪ Drehende gesetzt. Der rote Pfeil zeigt die Drehrichtung.', 'info');
      } else if (!allowRange) {
        showStatus('📷 Blickrichtung für Einzelbild gesetzt. Für Einzelbilder wird kein Drehende benötigt.', 'info');
      }
    }

    function renderDirectionOverlay() {
      if (!map || !currentCoords) return;

      directionLines.forEach(l => map.removeLayer(l));
      directionLines = [];

      if (directionCircle) map.removeLayer(directionCircle);
      if (directionArcLayer) map.removeLayer(directionArcLayer);
      if (directionArrowMarker) map.removeLayer(directionArrowMarker);
      directionCircle = null;
      directionArcLayer = null;
      directionArrowMarker = null;

      const circleRadius = getDirectionCircleRadius();

      directionCircle = L.circle([currentCoords.lat, currentCoords.lng], {
        radius: circleRadius,
        color: '#ffcc00',
        fillColor: '#ffcc00',
        fillOpacity: 0.06,
        weight: 2,
        dashArray: '6 6',
        interactive: true
      }).addTo(map);

      directionCircle.on('click', function(e) {
        if (e.originalEvent) L.DomEvent.stop(e.originalEvent);
        addDirectionMarker(e.latlng.lat, e.latlng.lng);
      });

      directionCircle.bindTooltip(
        isVideoDirectionRangeAllowed()
          ? `Klick: Blickrichtung setzen · zweiter Klick: Drehbereich max. ${MAX_DIRECTION_DELTA_DEG}°`
          : 'Klick: Blickrichtung für Einzelbild setzen',
        {
          direction: 'top',
          opacity: 0.85,
          sticky: true
        }
      );

      // Nur die Startlinie zeichnen. Das Drehende wird nicht mehr orange gezeichnet.
      if (directionMarkers[0]) {
        const p = directionMarkers[0].getLatLng();
        const line = L.polyline([[currentCoords.lat, currentCoords.lng], [p.lat, p.lng]], {
          color: '#ffcc00',
          weight: 3,
          opacity: 0.9
        }).addTo(map);
        directionLines.push(line);
      }

      const startBearing = directionMarkers[0] ? bearingBetweenCoords(currentCoords, directionMarkers[0].getLatLng()) : null;
      const endBearing = directionMarkers[1] ? bearingBetweenCoords(currentCoords, directionMarkers[1].getLatLng()) : null;
      const delta = Number.isFinite(startBearing) && Number.isFinite(endBearing)
        ? clampSignedBearingDelta(signedBearingDelta(startBearing, endBearing), MAX_DIRECTION_DELTA_DEG)
        : null;

      if (!suppressDirectionRangeVisual && Number.isFinite(startBearing) && Number.isFinite(delta) && Math.abs(delta) >= 0.25) {
        const arcPoints = buildDirectionArcPoints(currentCoords, circleRadius, startBearing, delta);
        if (arcPoints.length > 1) {
          directionArcLayer = L.polyline(arcPoints, {
            color: '#e60000',
            weight: 4,
            opacity: 0.95,
            dashArray: '8 7',
            lineCap: 'round'
          }).addTo(map);

          const arrowEndBearing = normalizeBearing(startBearing + delta);
          // Seit v0.1.86 ist die Pfeilspitze ein exakt zentriertes SVG.
          // Deshalb ist kein zusätzlicher Innenversatz mehr nötig:
          // Der Pfeil sitzt direkt am berechneten Kreis-/Bogen-Endpunkt.
          const arrowPoint = destinationPointFromBearing(currentCoords, arrowEndBearing, circleRadius);
          // Kompass-Bearing: 0° = Norden, 90° = Osten.
          // CSS-Rotation für ➤: 0° = Osten. Deshalb -90°.
          const tangentBearing = normalizeBearing(startBearing + delta + (delta >= 0 ? 90 : -90));
          const arrowCssRotation = tangentBearing - 90;
          directionArrowMarker = L.marker(arrowPoint, {
            icon: createDirectionArrowIcon(arrowCssRotation),
            interactive: false
          }).addTo(map);
        }
      }

      currentDirectionInfo = {
        startBearing,
        endBearing: Number.isFinite(endBearing) && Number.isFinite(startBearing) && Number.isFinite(delta)
          ? normalizeBearing(startBearing + delta)
          : endBearing,
        delta,
        rotation: Number.isFinite(delta) ? directionLabelFromDelta(delta) : 'nur Startblickrichtung gesetzt',
        maxDelta: MAX_DIRECTION_DELTA_DEG,
        rangeMode: isVideoDirectionRangeAllowed() ? 'video' : 'single'
      };
      updateDirectionDisplay();
    }

    function updateDirectionDisplay() {
      const el = document.getElementById('direction-text');
      if (!el) return;
      if (!currentDirectionInfo || !Number.isFinite(currentDirectionInfo.startBearing)) {
        el.textContent = '– noch keine Blickrichtung gesetzt –';
        el.style.color = 'var(--muted)';
        return;
      }
      const start = `${currentDirectionInfo.startBearing.toFixed(1)}°`;
      const end = Number.isFinite(currentDirectionInfo.endBearing) ? `${currentDirectionInfo.endBearing.toFixed(1)}°` : '–';
      const rot = currentDirectionInfo.rotation || '–';
      el.textContent = `Start ${start} · Ende ${end} · ${rot}`;
      el.style.color = 'var(--accent)';
    }

    function setMarker(lat, lng, label, zoomToMarker = true) {
      if (label !== 'Gespeicherte Position') suppressDirectionRangeVisual = false;
      currentCoords = { lat, lng };
      if (!ensureMapReady()) {
        updateCoordsDisplay();
        updateMetaDisplay(label);
        return;
      }
      const oldZoom = zoomToMarker ? null : map.getZoom();

      if (currentMarker && map) map.removeLayer(currentMarker);

      currentMarker = L.marker([lat, lng], { draggable: true })
        .addTo(map)
        .bindPopup(`<b>${label}</b><br>${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        .openPopup();

      currentMarker.on('dragend', function(e) {
        const pos = e.target.getLatLng();
        currentCoords = { lat: pos.lat, lng: pos.lng };
        updateCoordsDisplay();
        savePositionToCache();
        propagateSeriesCoords(getCurrentSeriesId(), currentCoords);
        currentMarker.bindPopup(`<b>Position korrigiert</b><br>${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`).openPopup();
        renderDirectionOverlay();
        deriveAltitudeForCurrentCoords('Marker verschoben');
        showStatus('📍 Marker verschoben – Position gespeichert', 'info');
      });

      if (zoomToMarker) {
        focusMapOnDetail(lat, lng);
      } else if (oldZoom !== null) {
        map.setView([lat, lng], oldZoom, { animate: false });
      } else {
        focusMapOnDetail(lat, lng);
      }

      updateCoordsDisplay();
      savePositionToCache();
      updateMetaDisplay(label);
      updateGeoEditorCoordinates();
      renderDirectionOverlay();
      deriveAltitudeForCurrentCoords(label || 'Marker gesetzt');
      propagateSeriesCoords(getCurrentSeriesId(), currentCoords);
    }

    function updateMetaDisplay(label) {
      updateCoordsDisplay();
      const metaSpan = document.getElementById('metaDisplay');
      if (!metaSpan) return;

      if (currentCoords) {
        const cleanLabel = label || 'Aktueller Standort geladen';
        metaSpan.textContent = `📍 ${cleanLabel} (${currentCoords.lat.toFixed(5)}, ${currentCoords.lng.toFixed(5)})`;
        metaSpan.title = 'Maus darüber halten oder klicken, um einen Ort oder eine PLZ zu suchen';
      } else {
        metaSpan.textContent = '📍 Standort laden …';
      }
    }

    function updateCoordsDisplay() {
      const el = document.getElementById('coords-text');
      if (currentCoords) {
        el.textContent = `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`;
        el.style.color = 'var(--accent)';
      } else {
        el.textContent = '– noch kein Standort gesetzt –';
        el.style.color = 'var(--muted)';
      }
    }

    // =====================================================
    // Cache-Funktionen
    // =====================================================
    function savePositionToCache() {
      if (currentCoords) {
        localStorage.setItem(STORAGE_POSITION_KEY, JSON.stringify(currentCoords));
      }
    }

    function loadPositionFromCache() {
      const stored = localStorage.getItem(STORAGE_POSITION_KEY);
      if (stored) {
        try {
          const coords = JSON.parse(stored);
          if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
            setMarker(coords.lat, coords.lng, 'Gespeicherte Position', true);
            return true;
          }
        } catch(e) {}
      }
      return false;
    }

    function setWriteExifButtonState(state = 'ready') {
      const btn = document.getElementById('writeExifBtn');
      if (!btn) return;

      btn.classList.toggle('is-finished', state === 'finished');
      btn.classList.toggle('is-ready', state === 'ready');
      btn.disabled = false;

      if (state === 'finished') {
        btn.textContent = '✅ Gespeichert';
        btn.title = 'Dieses Bild ist gespeichert. Änderungen können erneut gespeichert werden.';
      } else {
        btn.textContent = '💾 Speichern';
        btn.title = 'GPS und Datum speichern – Panoramax-Reencode-Test';
      }
    }

    function updateWriteExifButtonAfterSave() {
      const pendingCount = getPendingImages().length;
      if (pendingCount === 0 && currentLoadedImageId) {
        setWriteExifButtonState('finished');
      } else {
        setWriteExifButtonState('ready');
      }
    }

    function saveImageToCache() {
      if (!currentFileData || !currentCoords) {
        showStatus('❌ Bitte erst ein Bild laden und einen Standort setzen!', 'warn');
        return;
      }

      const dateValue = document.getElementById('date-input').value;
      const pendingIdToRemove = currentPendingImageId || (getPendingImages().some(img => img.id === currentLoadedImageId) ? currentLoadedImageId : null);
      const pendingFilenameToRemove = currentOriginalFilename || currentFilename;
      const syncedKeywords = syncTransportTagToKeywords();
      const syncedDescription = syncDescriptionFromInput();
      const imageDirection = getCurrentImageDirectionValue();
      const imageWasPending = pendingIdToRemove !== null && pendingIdToRemove !== undefined;
      const imageEntry = {
        id: currentLoadedImageId || Date.now(),
        filename: currentFilename,
        dataUrl: currentFileData.dataUrl,
        coords: { ...currentCoords },
        existingCoords: currentExifCoords ? { ...currentExifCoords } : null,
        keywords: syncedKeywords,
        description: syncedDescription,
        transportTag: normalizeTransportTag(currentTransportTag || 'transport=walk'),
        camera: getCurrentCameraName(),
        date: dateValue,
        direction: imageDirection,
        angle: imageDirection,
        altitude: getCurrentAltitudeValue(),
        directionEnd: currentDirectionInfo?.endBearing ?? null,
        directionRotation: currentDirectionInfo?.rotation || '',
        savedAt: new Date().toISOString(),
        exifWritten: currentExifWritten,
        source: 'saved'
      };

      let images = getSavedImages();
      const existingIndex = images.findIndex(img => img.id === imageEntry.id || img.filename === imageEntry.filename);
      if (existingIndex >= 0) {
        images[existingIndex] = { ...images[existingIndex], ...imageEntry };
      } else {
        images.push(imageEntry);
      }

      currentLoadedImageId = imageEntry.id;
      persistSavedImages(images);

      let sessionId = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
      }

      showStatus(`✅ Bild "${currentFilename}" unten in die gespeicherte Liste eingetragen`, 'success');
      updateImageListDisplay();
      updateSavedImageSelect();
      renderGeoEditorPanel(imageEntry);
      if (imageWasPending) {
        removePendingImageAfterSave(pendingIdToRemove, pendingFilenameToRemove);
      } else {
        continueWithNextPendingAfterSave(false);
      }
      updateWriteExifButtonAfterSave();
      updatePanoramaxAuthStatus();

      uploadToPhpServer(imageEntry, sessionId);
    }

    function stripImagePayloadForStorage(image) {
      if (!image) return image;
      const clone = { ...image };
      delete clone.dataUrl;
      return clone;
    }

    function persistSavedImages(images) {
      savedImagesMemory = sortImagesByCaptureDate(Array.isArray(images) ? images : []);
      try {
        localStorage.setItem(STORAGE_IMAGES_KEY, JSON.stringify(savedImagesMemory));
        return true;
      } catch (err) {
        if (err && (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014)) {
          try {
            const lightweight = savedImagesMemory.map(stripImagePayloadForStorage);
            localStorage.setItem(STORAGE_IMAGES_KEY, JSON.stringify(lightweight));
            console.warn('Foto Geo-Tool: Browser-Speicher war voll. Große Bilddaten bleiben nur in der aktuellen Sitzung im Arbeitsspeicher.');
            showStatus('⚠️ Browser-Speicher ist voll. Die großen Bilddaten bleiben in dieser Sitzung nutzbar, werden aber nicht vollständig im Browser-Cache abgelegt.', 'warn');
            return false;
          } catch (innerErr) {
            try { localStorage.removeItem(STORAGE_IMAGES_KEY); } catch(e) {}
            console.warn('Foto Geo-Tool: Gespeicherte Bilder konnten nicht in localStorage geschrieben werden.', innerErr);
            showStatus('⚠️ Browser-Speicher ist voll. Die Bildliste bleibt nur bis zum Neuladen der Seite erhalten.', 'warn');
            return false;
          }
        }
        throw err;
      }
    }

    function getSavedImages() {
      if (Array.isArray(savedImagesMemory)) return savedImagesMemory;
      const stored = localStorage.getItem(STORAGE_IMAGES_KEY);
      if (!stored) {
        savedImagesMemory = [];
        return savedImagesMemory;
      }
      try {
        savedImagesMemory = JSON.parse(stored) || [];
        savedImagesMemory = savedImagesMemory.map(img => ({
          ...img,
          transportTag: normalizeTransportTag(img.transportTag || img.keywords || 'transport=walk'),
          keywords: img.keywords ? normalizeTransportKeywords(img.keywords) : normalizeTransportTag(img.transportTag || 'transport=walk')
        }));
      } catch(e) {
        savedImagesMemory = [];
      }
      return savedImagesMemory;
    }

    function getImageSortTimestamp(image) {
      if (!image) return Number.MAX_SAFE_INTEGER;
      const raw = image.date || image.capture_time || image.savedAt || image.addedAt || '';
      if (!raw) return Number.MAX_SAFE_INTEGER;
      const normalized = String(raw).replace(' ', 'T');
      const time = Date.parse(normalized.length === 16 ? `${normalized}:00` : normalized);
      return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
    }

    function getImageSortName(image) {
      return String(image?.filename || '').toLowerCase();
    }

    function sortImagesByCaptureDate(images) {
      if (!Array.isArray(images)) return [];
      return [...images].sort((a, b) => {
        const diff = getImageSortTimestamp(a) - getImageSortTimestamp(b);
        if (diff !== 0) return diff;
        return getImageSortName(a).localeCompare(getImageSortName(b), 'de', { numeric: true, sensitivity: 'base' });
      });
    }

    function getSavedImagesSorted() {
      return sortImagesByCaptureDate(getSavedImages());
    }

    function getPendingImages() {
      return pendingImagesMemory;
    }

    function setPendingImages(images) {
      pendingImagesMemory = Array.isArray(images) ? images : [];
      // Wichtig: Unbearbeitete Bilder enthalten große Data-URLs.
      // Diese dürfen nicht in localStorage geschrieben werden, sonst kommt QuotaExceededError.
      try { localStorage.removeItem(STORAGE_PENDING_IMAGES_KEY); } catch(e) {}
    }

    function addPendingImages(newImages) {
      const pending = getPendingImages();
      const merged = [...pending];

      newImages.forEach(img => {
        const existingIndex = merged.findIndex(old => old.filename === img.filename && old.size === img.size && old.lastModified === img.lastModified);
        if (existingIndex >= 0) {
          merged[existingIndex] = { ...merged[existingIndex], ...img };
        } else {
          merged.push(img);
        }
      });

      setPendingImages(merged);
      updateSavedImageSelect(merged);
      return merged;
    }


    function normalizeImageFilenameForCompare(name) {
      return String(name || '')
        .toLowerCase()
        .replace(/_geo(?=\.[^.]+$)/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function removePendingImageAfterSave(savedId, savedFilename = '') {
      const pending = getPendingImages();
      if (!pending || pending.length === 0) return;

      const normalizedSaved = normalizeImageFilenameForCompare(savedFilename);
      const removedIndex = pending.findIndex(img => {
        if (savedId !== null && savedId !== undefined && img.id === savedId) return true;
        if (!normalizedSaved) return false;
        return normalizeImageFilenameForCompare(img.filename) === normalizedSaved;
      });
      if (removedIndex < 0) return;

      const updated = pending.filter((img, index) => index !== removedIndex);
      const nextIndex = removedIndex < updated.length ? removedIndex : removedIndex - 1;
      const nextImage = nextIndex >= 0 ? updated[nextIndex] : null;
      setPendingImages(updated);
      updateSavedImageSelect(updated);

      currentPendingImageId = null;
      currentOriginalFilename = null;

      if (nextImage) {
        window.setTimeout(() => loadPendingImageFromSelect(nextImage.id), 80);
      } else {
        const select = document.getElementById('savedImageSelect');
        if (select) select.value = '';
        setWriteExifButtonState('finished');
      }
    }

    function continueWithNextPendingAfterSave(wasPendingSave) {
      // Wenn ein gespeichertes Bild nachbearbeitet wurde, wurde kein Eintrag aus der
      // unbearbeiteten Liste entfernt. Trotzdem soll der Arbeitsfluss weitergehen.
      if (wasPendingSave) return;

      const pending = getPendingImages();
      updateSavedImageSelect(pending);

      if (pending && pending.length > 0) {
        const nextImage = pending[0];
        window.setTimeout(() => loadPendingImageFromSelect(nextImage.id), 80);
      } else {
        setWriteExifButtonState('finished');
      }
    }

    function updateSavedImageSelect(images = getPendingImages()) {
      const select = document.getElementById('savedImageSelect');
      if (!select) return;

      const previousValue = select.value;
      select.innerHTML = '';

      if (!images || images.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Noch keine unbearbeiteten Bilder';
        select.appendChild(option);
        select.disabled = true;
        return;
      }

      select.disabled = false;
      images.forEach(img => {
        const option = document.createElement('option');
        option.value = String(img.id);
        option.textContent = img.filename;
        select.appendChild(option);
      });

      if (previousValue && images.some(img => String(img.id) === previousValue)) {
        select.value = previousValue;
      }
    }

    function bindSavedImageSelect() {
      const select = document.getElementById('savedImageSelect');
      if (!select) return;

      select.addEventListener('change', () => {
        if (!select.value) return;
        loadPendingImageFromSelect(Number(select.value));
      });
    }

    function removeImageFromCache(imageId) {
      let images = getSavedImages();
      images = images.filter(img => img.id !== imageId);
      persistSavedImages(images);
      updateImageListDisplay();
      updateSavedImageSelect();
      showStatus('🗑️ Bild aus gespeicherter Liste entfernt', 'info');
    }

    function updateImageListDisplay() {
      const images = getSavedImagesSorted();
      const panel = document.getElementById('image-list-panel');
      const container = document.getElementById('saved-images-list');
      const badge = document.getElementById('image-count-badge');
      
      updateSavedImageSelect();

      if (images.length === 0) {
        panel.style.display = 'none';
        return;
      }
      
      panel.style.display = 'block';
      if (badge) badge.textContent = `(${images.length})`;
      container.innerHTML = '';
      
      images.forEach(img => {
        const div = document.createElement('div');
        div.className = 'image-list-item';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'image-list-name';
        nameSpan.title = img.filename;
        nameSpan.textContent = `📷 ${img.filename.substring(0, 35)}${img.filename.length > 35 ? '…' : ''}`;
        nameSpan.addEventListener('mouseenter', () => showImagePreviewOnly(img));
        nameSpan.addEventListener('focus', () => showImagePreviewOnly(img));
        nameSpan.addEventListener('click', () => loadImageFromCache(img.id));

        const hoverPreview = document.createElement('div');
        hoverPreview.className = 'image-hover-preview';
        const hoverImg = document.createElement('img');
        hoverImg.src = img.dataUrl;
        hoverImg.alt = img.filename;
        const hoverCaption = document.createElement('div');
        hoverCaption.className = 'image-hover-caption';
        hoverCaption.textContent = img.filename;
        hoverPreview.appendChild(hoverImg);
        hoverPreview.appendChild(hoverCaption);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'image-list-remove';
        removeBtn.type = 'button';
        removeBtn.title = 'Entfernen';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', () => removeImageFromCache(img.id));

        div.appendChild(nameSpan);
        div.appendChild(hoverPreview);
        div.appendChild(removeBtn);
        container.appendChild(div);
      });
    }

    function showImagePreviewOnly(image) {
      if (!image || !image.dataUrl) return;
      const preview = document.getElementById('preview-img');
      const filenameLabel = document.getElementById('filename-label');
      const drop = document.getElementById('drop-zone');
      const previewContainer = document.getElementById('preview-container');

      if (preview) preview.src = image.dataUrl;
      if (filenameLabel) filenameLabel.textContent = image.filename || '';
      if (drop) drop.style.display = 'none';
      if (previewContainer) previewContainer.style.display = 'flex';
    }

    function applyImageToWorkspace(image, sourceText = 'Bild geladen') {
      if (!image) return;

      currentLoadedImageId = image.id || null;
      currentPendingImageId = image.source === 'pending' ? image.id : null;
      currentOriginalFilename = image.source === 'pending' ? image.filename : null;
      currentFilename = image.filename;
      currentDirectionRangeEnabled = image.seriesType === 'video' || Boolean(image.fromVideo);
      suppressDirectionRangeVisual = image.source === 'saved';
      currentFileData = {
        dataUrl: image.dataUrl,
        filename: image.filename,
        fromVideo: image.fromVideo || '',
        seriesType: image.seriesType || '',
        seriesId: image.seriesId || ''
      };
      currentExifCoords = image.existingCoords || null;
      currentExifWritten = Boolean(image.exifWritten);
      currentTransportTag = normalizeTransportTag(image.transportTag || image.keywords || currentTransportTag || 'transport=walk');
      setDescriptionInputValue(image.description || '');
      updateTransportButtons();

      showImagePreviewOnly(image);
      document.getElementById('drop-zone').style.display = 'none';
      document.getElementById('preview-container').style.display = 'flex';
      document.getElementById('meta-section').style.display = 'block';
      document.getElementById('transport-section')?.style.setProperty('display', 'block');
      document.getElementById('save-btn')?.style.setProperty('display', 'block');

      document.getElementById('date-input').value = image.date || '';
      document.getElementById('date-source-row').style.display = image.date ? 'flex' : 'none';
      if (image.date) document.getElementById('date-source-value').textContent = image.dateSource || 'Datei/EXIF';

      const gpsRow = document.getElementById('gps-row');
      const gpsVal = document.getElementById('gps-exif-value');
      if (image.existingCoords) {
        if (gpsVal) gpsVal.textContent = formatCoords(image.existingCoords);
        if (gpsRow) gpsRow.style.display = 'flex';
      } else if (gpsRow) {
        gpsRow.style.display = 'none';
      }

      const cameraRow = document.getElementById('camera-row');
      const cameraVal = document.getElementById('camera-value');
      if (image.camera) {
        if (cameraVal) cameraVal.textContent = image.camera;
        if (cameraRow) cameraRow.style.display = 'flex';
      } else if (cameraRow) {
        cameraRow.style.display = 'none';
      }

      updateDescriptionMetaRow(image.description || '');
      updateAltitudeMetaRow(image.altitude ?? null);
      updateDirectionMetaRow(image.direction ?? image.angle ?? null);

      const resRow = document.getElementById('res-row');
      const resVal = document.getElementById('res-value');
      if (image.resolution) {
        if (resVal) resVal.textContent = image.resolution;
        if (resRow) resRow.style.display = 'flex';
      } else if (resRow) {
        resRow.style.display = 'none';
      }

      if (image.coords) {
        setMarker(image.coords.lat, image.coords.lng, sourceText, true);
      } else if (image.existingCoords) {
        setMarker(image.existingCoords.lat, image.existingCoords.lng, 'GPS aus EXIF', true);
      } else {
        updateGeoEditorCoordinates();
      }

      renderGeoEditorPanel(image);
      setWriteExifButtonState(image.source === 'saved' ? 'finished' : 'ready');
    }

    function loadPendingImageFromSelect(imageId) {
      const pending = getPendingImages();
      const image = pending.find(img => img.id === imageId);
      if (!image) return;

      const select = document.getElementById('savedImageSelect');
      if (select) select.value = String(imageId);

      applyImageToWorkspace(image, 'Unbearbeitetes Bild');
      showStatus(`📷 Unbearbeitetes Bild "${image.filename}" zum Bearbeiten geladen`, 'info');
    }

    function loadImageFromCache(imageId) {
      const images = getSavedImages();
      const image = images.find(img => img.id === imageId);
      if (!image) return;

      applyImageToWorkspace(image, 'Gespeicherte Position');
      showStatus(`📷 Gespeichertes Bild "${image.filename}" rechts zum Bearbeiten geladen`, 'info');
    }

    function showImageList() {
      const images = getSavedImagesSorted();
      if (images.length === 0) {
        showStatus('📭 Keine gespeicherten Bilder vorhanden', 'info');
      } else {
        updateImageListDisplay();
        document.getElementById('image-list-panel').scrollIntoView({ behavior: 'smooth' });
      }
    }

    function generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // =====================================================
    // ZIP Download (löscht Server-Bilder)
    // =====================================================
    async function downloadAsZip() {
      const images = getSavedImagesSorted();
      if (images.length === 0) {
        showStatus('❌ Keine gespeicherten Bilder zum Herunterladen', 'warn');
        return;
      }

      showStatus(`📦 Erstelle ZIP mit ${images.length} Bild(ern) und panoramax.csv …`, 'info');

      const zip = new JSZip();
      const csvRows = [[
        'file',
        'lon',
        'lat',
        'capture_time',
        'Exif.Image.DocumentName',
        'Exif.Image.ImageDescription',
        'Exif.GPSInfo.GPSImgDirection',
        'image_url'
      ]];

      for (const image of images) {
        try {
          if (!image.dataUrl) {
            console.warn(`Kein Bildinhalt mehr im Speicher: ${image.filename}`);
            continue;
          }

          const response = await fetch(image.dataUrl);
          const blob = await response.blob();
          zip.file(image.filename, blob);

          const coords = image.coords || image.existingCoords || null;
          csvRows.push([
            image.filename,
            coords ? coords.lng : '',
            coords ? coords.lat : '',
            toPanoramaxCaptureTime(image.date),
            normalizeTransportKeywords(image.keywords || image.transportTag || ''),
            image.description || '',
            Number.isFinite(Number(image.direction)) ? Number(image.direction).toFixed(2) : '',
            image.publicUrl || image.serverUrl || ''
          ]);
        } catch (err) {
          console.warn(`Fehler bei ${image.filename}:`, err);
        }
      }

      zip.file('panoramax.csv', csvRows.map(row => row.map(csvEscape).join(',')).join('\n') + '\n');

      try {
        const content = await zip.generateAsync({ type: 'blob' });
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        saveAs(content, `foto_geo_tool_${timestamp}.zip`);

        showStatus(`✅ ZIP-Datei mit ${images.length} Bild(ern) und einer panoramax.csv wurde heruntergeladen. Server-Bilder bleiben für Panoramax erhalten.`, 'success');
      } catch (err) {
        showStatus('❌ Fehler beim Erstellen der ZIP-Datei: ' + err.message, 'warn');
      }
    }

    function csvEscape(value) {
      const text = value === null || value === undefined ? '' : String(value);
      return '"' + text.replace(/"/g, '""') + '"';
    }

    function toPanoramaxCaptureTime(value) {
      if (!value) return '';
      // datetime-local: YYYY-MM-DDTHH:MM → RFC3339-kompatibel ohne Zeitzone.
      // Panoramax CLI akzeptiert das laut Dokumentation als lokale Zeit.
      return String(value).length === 16 ? `${value}:00` : String(value);
    }

    // =====================================================
    // Server-Bilder löschen (nach ZIP-Download)
    // =====================================================
    async function deleteServerImages() {
      const sessionId = localStorage.getItem(STORAGE_SESSION_KEY);
      if (!sessionId) return;
      
      try {
        const response = await fetch(`${PHP_SERVER_URL}delete.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
        const result = await response.json();
        if (result.success) {
          console.log('Server-Bilder gelöscht:', result);
        }
      } catch (err) {
        console.warn('Fehler beim Löschen der Server-Bilder:', err);
      }
    }

    // =====================================================
    // Upload zu PHP-Server
    // =====================================================

    function updateImagePublicUrl(imageId, result) {
      if (!imageId || !result) return;
      const publicUrl = result.public_url || result.url || '';
      if (!publicUrl) return;

      const images = getSavedImages();
      const idx = images.findIndex(img => img.id === imageId);
      if (idx >= 0) {
        images[idx] = {
          ...images[idx],
          publicUrl,
          serverUrl: publicUrl,
          serverPath: result.path || images[idx].serverPath || '',
          serverSession: result.session || images[idx].serverSession || ''
        };
        persistSavedImages(images);

        if (currentLoadedImageId === imageId) {
          renderGeoEditorPanel(images[idx]);
        }
      }
    }

    function getCurrentImageEntry() {
      const images = getSavedImages();
      return images.find(img => img.id === currentLoadedImageId)
        || images.find(img => img.filename === currentFilename)
        || null;
    }

    function getCurrentImageDirectionValue() {
      const entry = getCurrentImageEntry();
      const raw = entry?.direction ?? entry?.angle;
      const value = Number(raw);
      if (Number.isFinite(value)) return normalizeBearing(value);
      return getCurrentStartDirection();
    }


    async function copyTextToClipboard(text) {
      if (!text) return false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        }
      } catch (err) {
        console.warn('Clipboard API fehlgeschlagen:', err);
      }

      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
      } catch (err) {
        console.warn('Fallback-Kopieren fehlgeschlagen:', err);
        return false;
      }
    }



    function writeLensPreparingPage(lensWindow, text = 'vorbereitet …') {
      if (!lensWindow || lensWindow.closed) return;

      lensWindow.document.open();
      lensWindow.document.write(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>Google Lens wird vorbereitet</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f6f8fb;
      color: #101827;
    }
    .box {
      width: min(720px, calc(100vw - 2rem));
      background: white;
      border-radius: 18px;
      padding: 2rem;
      box-shadow: 0 12px 42px rgba(0,0,0,0.18);
      border: 1px solid #dbe3f0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .hourglass {
      display: inline-block;
      font-size: 2.4rem;
      animation: spin 1.1s linear infinite;
      transform-origin: center;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    h1 {
      margin: 0;
      font-size: 1.55rem;
    }
    p {
      font-size: 1rem;
      line-height: 1.45;
    }
    code {
      display: inline-block;
      background: #eef4ff;
      padding: 0.35rem 0.55rem;
      border-radius: 8px;
      font-size: 1rem;
    }
  </style>
</head>
<body>
  <main class="box">
    <div class="row">
      <span class="hourglass">⏳</span>
      <h1>Google Lens wird ${text}</h1>
    </div>
    <p>Das Bild wird temporär auf dem Server bereitgestellt. Danach wird dieses Fenster automatisch zu Google Lens weitergeleitet.</p>
    <p><b>Zwischenablage:</b> <code>SEO-Alternativtext für dieses Bild</code></p>
  </main>
</body>
</html>`);
      lensWindow.document.close();
    }

    async function createTemporaryLensImageEntry() {
      if (!currentFileData || !currentFileData.dataUrl) return null;

      // Nur temporär für Google Lens:
      // kein saveImageToCache(), kein Entfernen aus der Bilder-Liste, kein Wechsel zum nächsten Bild.
      if (/^data:image\/jpe?g/i.test(currentFileData.dataUrl) && currentCoords) {
        try {
          await writeExifTagsForCurrentImage();
        } catch (err) {
          console.warn('Temporäres EXIF-Schreiben für Google Lens fehlgeschlagen:', err);
        }
      }

      return {
        id: null,
        noPersist: true,
        filename: filenameWithGeoSuffix(currentFilename || 'foto.jpg'),
        dataUrl: currentFileData.dataUrl,
        coords: currentCoords || currentExifCoords || { lat: '', lng: '' },
        existingCoords: currentExifCoords ? { ...currentExifCoords } : null,
        keywords: syncTransportTagToKeywords(),
        description: syncDescriptionFromInput(),
        transportTag: normalizeTransportTag(currentTransportTag || 'transport=walk'),
        camera: getCurrentCameraName(),
        date: document.getElementById('date-input')?.value || '',
        source: 'temporary_lens'
      };
    }


    async function requestAltTextWithGoogleLens() {
      syncDescriptionFromInput();

      const promptText = 'SEO-Alternativtext für dieses Bild';

      // Wichtig:
      // Das Kopieren muss direkt im Benutzerklick passieren.
      // Nach Server-Upload/await ist die Browser-Berechtigung oft weg.
      const promptCopyPromise = copyTextToClipboard(promptText);

      // Das Fenster ebenfalls sofort aus dem Benutzerklick heraus öffnen,
      // damit der Popup-Blocker nicht greift.
      const lensWindow = window.open('about:blank', '_blank');
      if (lensWindow) {
        writeLensPreparingPage(lensWindow, 'vorbereitet …');
      }

      const promptCopied = await promptCopyPromise;

      await openGoogleLensForCurrentImage(lensWindow, false);

      showStatus(
        promptCopied
          ? '🔍 Google Lens wurde geöffnet. „SEO-Alternativtext für dieses Bild“ liegt in der Zwischenablage. Das Bild bleibt im Foto Geo-Tool weiter unbearbeitet, bis du bewusst „Speichern“ klickst.'
          : '⚠️ Google Lens wurde geöffnet, aber der Text konnte nicht automatisch kopiert werden. Bitte manuell kopieren: SEO-Alternativtext für dieses Bild',
        promptCopied ? 'info' : 'warn'
      );
    }


    async function openGoogleLensForCurrentImage(preOpenedWindow = null, copyImageUrlToClipboard = true) {
      syncDescriptionFromInput();

      // Direkt beim Klick öffnen, sonst kann der Browser das spätere Öffnen nach await/upload blockieren.
      let lensWindow = preOpenedWindow || window.open('about:blank', '_blank');
      if (lensWindow && !preOpenedWindow) {
        writeLensPreparingPage(lensWindow, 'vorbereitet …');
      }

      let image = getCurrentImageEntry();

      if (!image && currentFileData && currentFileData.dataUrl) {
        image = await createTemporaryLensImageEntry();
      }

      if (!image) {
        if (lensWindow) lensWindow.close();
        showStatus('❌ Kein Bild für Google Lens gefunden. Bitte erst ein Bild laden.', 'warn');
        return;
      }

      let publicUrl = image.publicUrl || image.serverUrl || '';

      if (!publicUrl) {
        let sessionId = localStorage.getItem(STORAGE_SESSION_KEY);
        if (!sessionId) {
          sessionId = generateSessionId();
          localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
        }

        showStatus(image.noPersist ? '⏳ Bild wird nur temporär für Google Lens auf den Server gelegt …' : '⏳ Bild wird zuerst auf den Server gelegt, damit Google Lens einen Bildlink bekommt …', 'info');
        const result = await uploadToPhpServer(image, sessionId);
        publicUrl = result?.public_url || result?.url || '';
      }

      if (!publicUrl) {
        if (lensWindow) lensWindow.close();
        showStatus('❌ Es wurde keine öffentliche Bild-URL vom Server zurückgegeben.', 'warn');
        return;
      }

      const copied = copyImageUrlToClipboard ? await copyTextToClipboard(publicUrl) : false;
      const lensUrl = `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(publicUrl)}`;

      if (lensWindow && !lensWindow.closed) {
        lensWindow.location.href = lensUrl;
      } else {
        const opened = window.open(lensUrl, '_blank');
        if (!opened) {
          showStatus(`⚠️ Popup wurde blockiert. Bild-URL wurde kopiert: ${publicUrl}`, 'warn');
          return;
        }
      }

      showStatus(
        copyImageUrlToClipboard
          ? (copied
              ? '🔍 Bild-URL wurde kopiert und Google Lens geöffnet. Falls Google den Link nicht übernimmt, unten bei „Bildlink einfügen“ einfügen.'
              : `🔍 Google Lens geöffnet. Bildlink: ${publicUrl}`)
          : '🔍 Google Lens wurde mit temporärer Bild-URL geöffnet. Das aktuelle Bild bleibt in der Bilder-Liste und wird nicht gespeichert.',
        'info'
      );
    }


    async function uploadToPhpServer(imageEntry, sessionId) {
      try {
        if (!imageEntry || !imageEntry.dataUrl) {
          throw new Error('Kein Bildinhalt für Server-Upload vorhanden.');
        }

        const response = await fetch(imageEntry.dataUrl);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', blob, imageEntry.filename);
        formData.append('session_id', sessionId);
        formData.append('lat', imageEntry.coords?.lat ?? '');
        formData.append('lng', imageEntry.coords?.lng ?? '');
        formData.append('date', imageEntry.date || '');
        formData.append('keywords', imageEntry.keywords || '');
        formData.append('description', imageEntry.description || '');
        formData.append('transport_tag', imageEntry.transportTag || '');
        
        const uploadResponse = await fetch(`${PHP_SERVER_URL}upload.php`, {
          method: 'POST',
          body: formData
        });
        
        const result = await uploadResponse.json();
        if (result.success) {
          console.log('PHP Upload erfolgreich:', result);
          if (!imageEntry.noPersist) {
            updateImagePublicUrl(imageEntry.id, result);
          }
          return result;
        } else {
          console.warn('PHP Upload fehlgeschlagen:', result);
          return result;
        }
      } catch (err) {
        console.warn('PHP Upload Fehler:', err);
        return { success: false, error: err.message };
      }
    }

    // =====================================================
    // Upload zu Panoramax
    // =====================================================
    async function uploadToPanoramax() {
      if (!getPanoramaxToken()) {
        updatePanoramaxAuthStatus('Kein Token gespeichert. Bitte Token einfügen und zuerst „Token merken“ klicken.', 'warn');
        return;
      }

      const images = getSavedImagesSorted();
      if (images.length === 0) {
        showStatus('❌ Keine gespeicherten Bilder zum Hochladen', 'warn');
        return;
      }

      const sessionId = localStorage.getItem(STORAGE_SESSION_KEY) || generateSessionId();
      localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
      showStatus(`☁️ Panoramax-Upload wird über PHP vorbereitet (${images.length} Bild(er)) …`, 'info');

      try {
        const response = await fetch(`${PHP_SERVER_URL}panoramax_upload.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            api_url: 'https://panoramax.basi.re/api',
            token: getPanoramaxToken(),
            title: `Foto Geo-Tool ${new Date().toLocaleString('de-DE')}`,
            upload_mode: 'direct_api',
            images: images.map(img => ({
              filename: img.filename,
              lat: img.coords?.lat || img.existingCoords?.lat || '',
              lng: img.coords?.lng || img.existingCoords?.lng || '',
              date: img.date || '',
              keywords: normalizeTransportKeywords(img.keywords || img.transportTag || ''),
              description: img.description || '',
              altitude: img.altitude ?? '',
              direction: img.direction ?? img.angle ?? '',
              directionEnd: img.directionEnd ?? ''
            }))
          })
        });
        const result = await response.json();
        if (result.success) {
          const setInfo = result.upload_set_id ? ` · Upload-Set: ${result.upload_set_id}` : '';
          const completeOk = !result.complete_status || result.complete_status.ok;
          if (!completeOk) {
            console.warn('Panoramax Upload wurde gesendet, aber der Abschluss meldet ein Problem:', result);
          }
          const countInfo = typeof result.uploaded_count === 'number'
            ? ` · angenommen: ${result.uploaded_count}/${result.images_count || '?'}`
            : '';
          const failInfo = result.failed_count ? ` · Uploadfehler: ${result.failed_count}` : '';
          const rejectedInfo = result.rejected_count ? ` · Panoramax abgelehnt: ${result.rejected_count}` : '';
          const note = completeOk
            ? 'Upload wurde per API übertragen und abgeschlossen. Auf der Panoramax-Seite bitte nicht noch einmal per Drag-and-Drop hochladen.'
            : 'Upload wurde per API übertragen; Panoramax hat den Abschluss nicht eindeutig bestätigt. Auf der Panoramax-Seite bitte nicht noch einmal per Drag-and-Drop hochladen.';
          showStatus(`☁️ ${note}${setInfo}${countInfo}${failInfo}${rejectedInfo} · Wechsel zu <a href="${PANORAMAX_YOUR_PICTURES_URL}" target="_self" rel="noopener">Panoramax „Meine Bilder“</a> …`, (completeOk && !result.failed_count && !result.rejected_count) ? 'success' : 'warn');
          goToPanoramaxYourPictures(900);
        } else {
          const detail = result.message || result.error || result.diagnostic || 'Unbekannter Fehler.';
          const fileInfo = result.failed_file ? ` · Datei: ${result.failed_file}` : '';
          const setInfo = result.upload_set_id ? ` · Upload-Set: ${result.upload_set_id}` : '';
          showStatus(`⚠️ Panoramax-Upload fehlgeschlagen: ${detail}${fileInfo}${setInfo}`, 'warn');
        }
        console.log('Panoramax PHP Antwort:', result);
        if (result.files_diagnostic) console.log('Panoramax /files Diagnose:', result.files_diagnostic);
      } catch (err) {
        console.warn('Panoramax PHP Fehler:', err);
        showStatus('❌ Panoramax-Upload konnte nicht über PHP gestartet werden: ' + err.message, 'warn');
      }
    }

    // =====================================================
    // Panoramax-Panel anzeigen
    // =====================================================
    function scrollToPanoramaxPanel() {
      const panel = document.getElementById('panoramaxAuthPanel');
      if (!panel) return;
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      panel.classList.add('panoramax-highlight');
      setTimeout(() => panel.classList.remove('panoramax-highlight'), 1400);
    }

    // Panoramax-Anmeldung / Token dauerhaft im Browser speichern
    // =====================================================
    function getPanoramaxToken() {
      try {
        const stored = (localStorage.getItem(STORAGE_PANORAMAX_TOKEN_KEY) || '').trim();
        if (stored) return stored;

        // Übergang von Version 0.1.16: Falls der Token noch im sessionStorage liegt,
        // wird er einmalig dauerhaft übernommen.
        const oldSessionToken = (sessionStorage.getItem(STORAGE_PANORAMAX_TOKEN_SESSION_KEY) || '').trim();
        if (oldSessionToken) {
          localStorage.setItem(STORAGE_PANORAMAX_TOKEN_KEY, oldSessionToken);
          sessionStorage.removeItem(STORAGE_PANORAMAX_TOKEN_SESSION_KEY);
          return oldSessionToken;
        }
      } catch (err) {
        return '';
      }
      return '';
    }

    function setPanoramaxToken(token) {
      const value = String(token || '').trim();
      try {
        if (value) {
          localStorage.setItem(STORAGE_PANORAMAX_TOKEN_KEY, value);
        } else {
          localStorage.removeItem(STORAGE_PANORAMAX_TOKEN_KEY);
          try { sessionStorage.removeItem(STORAGE_PANORAMAX_TOKEN_SESSION_KEY); } catch(e) {}
        }
      } catch (err) {
        console.warn('Panoramax Token konnte nicht dauerhaft im localStorage gespeichert werden:', err);
      }
      updatePanoramaxAuthStatus();
    }

    function maskPanoramaxTokenInput(input, hasToken) {
      if (!input) return;
      input.type = 'text';
      input.name = 'panoramax_token_plain';
      input.autocomplete = 'off';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
      input.setAttribute('inputmode', 'text');
      input.setAttribute('data-lpignore', 'true');
      input.setAttribute('data-1p-ignore', 'true');
      input.setAttribute('data-form-type', 'other');

      if (hasToken) {
        input.value = '••••••••••••••••';
        input.placeholder = 'Token ist gespeichert';
        input.disabled = true;
        input.classList.add('is-token-stored');
        input.title = 'Token ist gespeichert. Zum Ändern zuerst „Löschen“ klicken.';
      } else {
        input.value = '';
        input.placeholder = 'Token einfügen...';
        input.disabled = false;
        input.classList.remove('is-token-stored');
        input.title = 'Panoramax-Token einfügen';
      }
    }

    function updatePanoramaxAuthStatus(message, type) {
      const status = document.getElementById('panoramaxAuthStatus');
      const input = document.getElementById('panoramaxTokenInput');
      const uploadBtn = document.getElementById('panoramaxUploadBtn');
      if (!status) return;

      const token = getPanoramaxToken();
      status.classList.remove('ok', 'warn');
      if (type) status.classList.add(type);

      if (message) {
        status.textContent = message;
      } else if (token) {
        status.textContent = 'Token ist dauerhaft in diesem Browser gespeichert. Er wird nur beim Panoramax-Upload an panoramax_upload.php gesendet.';
        status.classList.add('ok');
      } else {
        status.textContent = 'Noch kein Token im Browser gespeichert. Alternativ kann der Token serverseitig in panoramax_config.php stehen.';
      }

      maskPanoramaxTokenInput(input, !!token);

      if (uploadBtn) {
        const savedCount = getSavedImages().length;
        const pendingCount = getPendingImages().length;
        const readyToUpload = !!token && savedCount > 0 && pendingCount === 0;

        uploadBtn.disabled = !token;
        uploadBtn.setAttribute('aria-disabled', token ? 'false' : 'true');
        uploadBtn.title = token
          ? (readyToUpload
              ? `Alle Bilder sind gespeichert. ${savedCount} Bild(er) können zu Panoramax hochgeladen werden.`
              : 'Gespeicherte Bilder zu Panoramax hochladen')
          : 'Bitte zuerst einen Token einfügen und mit „Token merken“ speichern';
        uploadBtn.classList.toggle('is-disabled', !token);
        uploadBtn.classList.toggle('is-ready-to-upload', readyToUpload);
      }
    }

    function bindPanoramaxAuthPanel() {
      const saveBtn = document.getElementById('panoramaxSaveTokenBtn');
      const forgetBtn = document.getElementById('panoramaxForgetTokenBtn');
      const uploadBtn = document.getElementById('panoramaxUploadBtn');
      const input = document.getElementById('panoramaxTokenInput');

      if (saveBtn && input) {
        maskPanoramaxTokenInput(input, !!getPanoramaxToken());
        saveBtn.addEventListener('click', () => {
          const token = input.value.trim();
          if (!token) {
            updatePanoramaxAuthStatus('Kein Token eingefügt.', 'warn');
            return;
          }
          setPanoramaxToken(token);
          maskPanoramaxTokenInput(input, true);
          updatePanoramaxAuthStatus('Token ist gespeichert.', 'ok');
        });
      }

      if (forgetBtn) {
        forgetBtn.addEventListener('click', () => {
          setPanoramaxToken('');
          maskPanoramaxTokenInput(input, false);
          updatePanoramaxAuthStatus('Token wurde aus diesem Browser entfernt.', 'warn');
        });
      }

      if (uploadBtn) {
        uploadBtn.addEventListener('click', uploadToPanoramax);
      }

      updatePanoramaxAuthStatus();
    }


    // =====================================================
    // GeoImgr-ähnlicher EXIF-Arbeitsbereich
    // =====================================================
    function formatCoords(coords) {
      if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return '';
      return `${Number(coords.lat).toFixed(6)}, ${Number(coords.lng).toFixed(6)}`;
    }


    function getDescriptionInputValue() {
      return document.getElementById('descriptionInput')?.value || '';
    }

    function setDescriptionInputValue(value) {
      const input = document.getElementById('descriptionInput');
      if (!input) return;
      input.value = value || '';
      updateDescriptionDisplay();
      updateDescriptionMetaRow(input.value);
    }

    function getStoredCopyrightName() {
      return localStorage.getItem(STORAGE_COPYRIGHT_NAME_KEY) || '';
    }

    function setStoredCopyrightName(value) {
      const normalized = String(value || '').trim();
      if (normalized) {
        localStorage.setItem(STORAGE_COPYRIGHT_NAME_KEY, normalized);
      }
      return normalized;
    }

    function normalizeCopyrightInDescription(text) {
      let value = String(text || '');

      const buildCopyrightReplacement = (prefix, storedName) => {
        const cleanPrefix = String(prefix || '').replace(/\s+$/, '');
        if (!cleanPrefix) return `© ${storedName}`;
        if (/\|\s*$/.test(cleanPrefix)) return `${cleanPrefix} © ${storedName}`;
        return `${cleanPrefix} | © ${storedName}`;
      };

      // Akzeptiert beide Schreibweisen:
      //   © gabischatz
      //   @ gabischatz
      // Gespeichert und in die Datei geschrieben wird einheitlich: © gabischatz
      // Wenn davor schon Beschreibungstext steht, wird automatisch „ | “ eingefügt.
      const nameMatch = value.match(/^(.*?)(?:©|@)\s*([^|©@\n\r]+)\s*$/);
      if (nameMatch && nameMatch[2] && nameMatch[2].trim()) {
        const storedName = setStoredCopyrightName(nameMatch[2].trim());
        value = buildCopyrightReplacement(nameMatch[1], storedName);
      }

      const stored = getStoredCopyrightName();
      const placeholderMatch = value.match(/^(.*?)(?:©|@)\s*$/);
      if (stored && placeholderMatch) {
        value = buildCopyrightReplacement(placeholderMatch[1], stored);
      }

      return value;
    }

    function syncDescriptionFromInput() {
      const input = document.getElementById('descriptionInput');
      if (!input) return '';

      const normalized = normalizeCopyrightInDescription(input.value);
      if (normalized !== input.value) input.value = normalized;

      const value = input.value.trim();
      if (value) {
        localStorage.setItem(STORAGE_LAST_DESCRIPTION_KEY, value);
      }

      if (currentPendingImageId) {
        const pending = getPendingImages();
        const img = pending.find(item => item.id === currentPendingImageId);
        if (img) img.description = input.value;
      }

      if (currentLoadedImageId) {
        const saved = getSavedImages();
        const img = saved.find(item => item.id === currentLoadedImageId);
        if (img) {
          img.description = input.value;
          persistSavedImages(saved);
        }
      }

      propagateSeriesDescription(getCurrentSeriesId(), input.value);

      updateDescriptionDisplay();
      updateDescriptionMetaRow(input.value);
      return input.value;
    }

    function updateDescriptionDisplay() {
      const display = document.getElementById('descriptionDisplayText');
      const value = document.getElementById('descriptionInput')?.value || '';
      if (!display) return;
      display.textContent = value.trim() || 'Beschreibung / Alternativtext …';
      display.title = value.trim() || 'Beschreibung / Alternativtext bearbeiten';
    }


    function updateDescriptionMetaRow(value = null) {
      const row = document.getElementById('description-meta-row');
      const val = document.getElementById('description-meta-value');
      if (!row || !val) return;

      const text = value !== null
        ? String(value || '')
        : String(document.getElementById('descriptionInput')?.value || '');

      if (text.trim()) {
        val.textContent = text.trim();
        val.title = text.trim();
        row.style.display = 'flex';
      } else {
        val.textContent = '–';
        val.title = '';
        row.style.display = 'none';
      }
    }


    function clampNumber(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function saveDescriptionDialogPosition() {
      const dialog = document.getElementById('descriptionDialog');
      if (!dialog || !dialog.open) return;

      const rect = dialog.getBoundingClientRect();
      localStorage.setItem(STORAGE_DESCRIPTION_DIALOG_POS_KEY, JSON.stringify({
        left: Math.round(rect.left),
        top: Math.round(rect.top)
      }));
    }

    function restoreDescriptionDialogPosition() {
      const dialog = document.getElementById('descriptionDialog');
      if (!dialog) return;

      const stored = localStorage.getItem(STORAGE_DESCRIPTION_DIALOG_POS_KEY);
      if (!stored) {
        dialog.style.left = '50%';
        dialog.style.top = '18%';
        dialog.style.transform = 'translateX(-50%)';
        return;
      }

      try {
        const pos = JSON.parse(stored);
        const width = dialog.offsetWidth || 620;
        const height = dialog.offsetHeight || 260;
        const left = clampNumber(Number(pos.left) || 20, 8, Math.max(8, window.innerWidth - width - 8));
        const top = clampNumber(Number(pos.top) || 20, 8, Math.max(8, window.innerHeight - height - 8));
        dialog.style.left = `${left}px`;
        dialog.style.top = `${top}px`;
        dialog.style.transform = 'none';
      } catch (err) {
        dialog.style.left = '50%';
        dialog.style.top = '18%';
        dialog.style.transform = 'translateX(-50%)';
      }
    }

    function bindDescriptionDialogDragging() {
      const dialog = document.getElementById('descriptionDialog');
      const handle = document.getElementById('descriptionDialogDragHandle');
      if (!dialog || !handle || handle.dataset.dragBound === '1') return;

      handle.dataset.dragBound = '1';
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      handle.addEventListener('pointerdown', (event) => {
        if (event.target.closest('button')) return;
        dragging = true;
        const rect = dialog.getBoundingClientRect();
        offsetX = event.clientX - rect.left;
        offsetY = event.clientY - rect.top;
        dialog.style.left = `${rect.left}px`;
        dialog.style.top = `${rect.top}px`;
        dialog.style.transform = 'none';
        dialog.classList.add('is-dragging');
        handle.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      });

      handle.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        const width = dialog.offsetWidth;
        const height = dialog.offsetHeight;
        const left = clampNumber(event.clientX - offsetX, 8, Math.max(8, window.innerWidth - width - 8));
        const top = clampNumber(event.clientY - offsetY, 8, Math.max(8, window.innerHeight - height - 8));
        dialog.style.left = `${left}px`;
        dialog.style.top = `${top}px`;
        event.preventDefault();
      });

      function stopDrag(event) {
        if (!dragging) return;
        dragging = false;
        dialog.classList.remove('is-dragging');
        saveDescriptionDialogPosition();
        if (event?.pointerId !== undefined) {
          try { handle.releasePointerCapture?.(event.pointerId); } catch(e) {}
        }
      }

      handle.addEventListener('pointerup', stopDrag);
      handle.addEventListener('pointercancel', stopDrag);

      window.addEventListener('resize', () => {
        if (!dialog.open) return;
        restoreDescriptionDialogPosition();
        saveDescriptionDialogPosition();
      });
    }


    function openDescriptionDialog() {
      const dialog = document.getElementById('descriptionDialog');
      const textarea = document.getElementById('descriptionDialogTextarea');
      if (!dialog || !textarea) return;

      textarea.value = getDescriptionInputValue();
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'open');
      }

      bindDescriptionDialogDragging();
      restoreDescriptionDialogPosition();

      window.setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }, 30);
    }

    function closeDescriptionDialog(save = true) {
      const dialog = document.getElementById('descriptionDialog');
      const textarea = document.getElementById('descriptionDialogTextarea');

      if (save && textarea) {
        setDescriptionInputValue(textarea.value);
        syncDescriptionFromInput();
      }

      if (dialog) {
        saveDescriptionDialogPosition();
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
      }
    }

    function restoreLastDescription() {
      const last = localStorage.getItem(STORAGE_LAST_DESCRIPTION_KEY) || '';
      if (!last) {
        showStatus('ℹ️ Es ist noch kein früherer Alternativtext gespeichert.', 'info');
        return;
      }
      setDescriptionInputValue(last);
      const dialogText = document.getElementById('descriptionDialogTextarea');
      if (dialogText) dialogText.value = last;
      syncDescriptionFromInput();
      showStatus('➕ Letzter Alternativtext wurde eingefügt.', 'info');
    }

    function insertCopyrightNameAtCursor() {
      const dialog = document.getElementById('descriptionDialog');
      const dialogText = document.getElementById('descriptionDialogTextarea');
      const input = (dialog && dialog.open && dialogText) ? dialogText : document.getElementById('descriptionInput');
      if (!input) return;

      let stored = getStoredCopyrightName();
      const current = input.value;

      // Wenn der Benutzer am Ende „@ Name“ oder „© Name“ schreibt,
      // wird der Name gespeichert und die Schreibweise auf „© Name“ normalisiert.
      const found = current.match(/(?:©|@)\s*([^|©@\n\r]+)\s*$/);
      if (found && found[1] && found[1].trim()) {
        stored = setStoredCopyrightName(found[1].trim());
      }

      if (!stored) {
        showStatus('ℹ️ Noch kein Copyright-Name gespeichert. Schreibe z. B. „@ gabischatz“, „© gabischatz“ oder „© Lutz Müller“.', 'info');
        return;
      }

      const start = input.selectionStart ?? current.length;
      const end = input.selectionEnd ?? current.length;

      const placeholderAtEnd = current.match(/^(.*?)(?:©|@)\s*$/);
      if (placeholderAtEnd) {
        const prefix = placeholderAtEnd[1].replace(/\s+$/, '');
        const replacement = !prefix
          ? `© ${stored}`
          : (/\|\s*$/.test(prefix) ? `${prefix} © ${stored}` : `${prefix} | © ${stored}`);
        input.value = replacement;
      } else {
        const before = current.slice(0, start);
        const after = current.slice(end);
        const cleanBefore = before.replace(/\s+$/, '');
        const separator = cleanBefore.trim() && !/\|\s*$/.test(cleanBefore) ? ' | ' : (cleanBefore.trim() ? ' ' : '');
        const insert = `${separator}© ${stored}`;
        input.value = cleanBefore + insert + after;
      }

      input.focus();
      const newPos = input.value.length;
      try {
        input.selectionStart = input.selectionEnd = newPos;
      } catch(e) {}

      if (input.id === 'descriptionDialogTextarea') {
        setDescriptionInputValue(input.value);
      }
      syncDescriptionFromInput();
      autoResizeDescriptionInput();
    }

    function autoResizeDescriptionInput() {
      const input = document.getElementById('descriptionInput');
      if (!input) return;
      if (document.activeElement !== input) return;

      input.style.height = 'auto';
      const nextHeight = Math.max(76, Math.min(input.scrollHeight + 4, 180));
      input.style.height = `${nextHeight}px`;
    }


    function renderGeoEditorPanel(image) {
      const panel = document.getElementById('geoEditorPanel');
      if (!panel || !image) return;

      const thumb = document.getElementById('geoEditorThumb');
      const existingInput = document.getElementById('existingGeotagsInput');
      const newInput = document.getElementById('newGeotagsInput');
      const keywordsInput = document.getElementById('keywordsInput');
      const descriptionInput = document.getElementById('descriptionInput');
      const filename = document.getElementById('geoEditorFilename');

      if (thumb) thumb.src = image.dataUrl || '';
      if (existingInput) existingInput.value = formatCoords(image.existingCoords || currentExifCoords);
      if (newInput) newInput.value = formatCoords(currentCoords || image.coords);
      if (keywordsInput) keywordsInput.value = image.keywords || '';
      if (descriptionInput) descriptionInput.value = image.description || '';
      currentTransportTag = normalizeTransportTag(image.transportTag || image.keywords || currentTransportTag || 'transport=walk');
      if (keywordsInput && currentTransportTag && !/transport=/i.test(keywordsInput.value || '')) {
        const current = keywordsInput.value.trim();
        keywordsInput.value = current ? `${current}, ${currentTransportTag}` : currentTransportTag;
      }
      updateTransportButtons();
      if (filename) filename.textContent = image.filename || '–';

      panel.classList.add('aktiv');
    }

    function updateGeoEditorCoordinates() {
      const existingInput = document.getElementById('existingGeotagsInput');
      const newInput = document.getElementById('newGeotagsInput');
      if (existingInput) existingInput.value = formatCoords(currentExifCoords);
      if (newInput) newInput.value = formatCoords(currentCoords);
    }

    function clearGeoEditor(resetFields = true) {
      const panel = document.getElementById('geoEditorPanel');
      const thumb = document.getElementById('geoEditorThumb');
      const filename = document.getElementById('geoEditorFilename');
      if (thumb) thumb.removeAttribute('src');
      if (filename) filename.textContent = '–';
      setWriteExifButtonState('ready');
      if (resetFields) {
        ['existingGeotagsInput', 'newGeotagsInput', 'keywordsInput', 'descriptionInput'].forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.value = '';
            if (id === 'descriptionInput') updateDescriptionDisplay();
          }
        });
      }
      if (panel) panel.classList.remove('aktiv');
    }

    function decimalToExifRational(decimal) {
      const absolute = Math.abs(decimal);
      const degrees = Math.floor(absolute);
      const minutesFloat = (absolute - degrees) * 60;
      const minutes = Math.floor(minutesFloat);
      const seconds = (minutesFloat - minutes) * 60;
      return [
        [degrees, 1],
        [minutes, 1],
        [Math.round(seconds * 10000), 10000]
      ];
    }


    function exifAltitudeRational(meters) {
      const value = Math.abs(Number(meters));
      return [Math.round(value * 100), 100];
    }

    function setGpsAltitudeExif(exifObj, altitudeValue) {
      const alt = Number(altitudeValue);
      if (!exifObj || !exifObj.GPS || !Number.isFinite(alt)) return false;
      exifObj.GPS[getGpsTagId('GPSAltitudeRef', 5)] = alt < 0 ? 1 : 0;
      exifObj.GPS[getGpsTagId('GPSAltitude', 6)] = exifAltitudeRational(alt);
      return true;
    }

    function getCurrentAltitudeValue() {
      const input = document.getElementById('videoFrameAltitude');
      const inputValue = input?.value?.trim();
      if (inputValue !== '') {
        const parsed = Number(inputValue);
        if (Number.isFinite(parsed)) return parsed;
      }
      return Number.isFinite(currentAltitude) ? currentAltitude : null;
    }

    function updateAltitudeDisplay(sourceText = '') {
      const el = document.getElementById('altitude-text');
      if (!el) return;
      const alt = getCurrentAltitudeValue();
      if (Number.isFinite(alt)) {
        el.textContent = `${Math.round(alt)} m${sourceText ? ' · ' + sourceText : ''}`;
        el.style.color = 'var(--accent)';
      } else {
        el.textContent = '– noch nicht ermittelt –';
        el.style.color = 'var(--muted)';
      }
    }

    function getElevationCache() {
      try {
        const raw = localStorage.getItem(STORAGE_ELEVATION_CACHE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return parsed && typeof parsed === 'object' ? parsed : {};
      } catch(e) {
        return {};
      }
    }

    function setElevationCacheValue(key, value) {
      try {
        const cache = getElevationCache();
        cache[key] = { value, savedAt: Date.now() };
        localStorage.setItem(STORAGE_ELEVATION_CACHE_KEY, JSON.stringify(cache));
      } catch(e) {}
    }

    function elevationCacheKey(lat, lng) {
      return `${Number(lat).toFixed(5)},${Number(lng).toFixed(5)}`;
    }

    async function fetchElevationForCoords(lat, lng) {
      const urls = [
        {
          name: 'Open-Meteo Elevation',
          url: `https://api.open-meteo.com/v1/elevation?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}`,
          parse: data => Array.isArray(data?.elevation) ? Number(data.elevation[0]) : Number(data?.elevation)
        },
        {
          name: 'Open-Elevation',
          url: `https://api.open-elevation.com/api/v1/lookup?locations=${encodeURIComponent(lat + ',' + lng)}`,
          parse: data => Number(data?.results?.[0]?.elevation)
        }
      ];

      let lastError = null;
      for (const service of urls) {
        try {
          const response = await fetch(service.url, { cache: 'force-cache' });
          if (!response.ok) throw new Error(`${service.name}: HTTP ${response.status}`);
          const data = await response.json();
          const elevation = service.parse(data);
          if (Number.isFinite(elevation)) {
            return { elevation, source: service.name };
          }
        } catch (err) {
          lastError = err;
        }
      }
      throw lastError || new Error('Keine Höhenantwort erhalten.');
    }

    async function deriveAltitudeForCurrentCoords(sourceLabel = '') {
      if (!currentCoords || !Number.isFinite(currentCoords.lat) || !Number.isFinite(currentCoords.lng)) {
        updateAltitudeDisplay();
        return null;
      }

      const key = elevationCacheKey(currentCoords.lat, currentCoords.lng);
      const cache = getElevationCache();
      if (cache[key] && Number.isFinite(Number(cache[key].value))) {
        currentAltitude = Number(cache[key].value);
        updateAltitudeInputFromCurrent(true);
        updateAltitudeDisplay('Höhen-Cache');
        return currentAltitude;
      }

      updateAltitudeDisplay('wird ermittelt …');
      try {
        const result = await fetchElevationForCoords(currentCoords.lat, currentCoords.lng);
        currentAltitude = result.elevation;
        setElevationCacheValue(key, currentAltitude);
        updateAltitudeInputFromCurrent(true);
        updateAltitudeDisplay(result.source);
        showStatus(`⛰️ Höhe aus Koordinaten ermittelt: ${Math.round(currentAltitude)} m`, 'info');
        return currentAltitude;
      } catch (err) {
        console.warn('Höhenabfrage fehlgeschlagen:', err);
        updateAltitudeDisplay('nicht ermittelbar');
        return null;
      }
    }


    function exifDateTimeFromInput(value) {
      if (!value) return '';
      const [datePart, timePart = '00:00'] = value.split('T');
      if (!datePart) return '';
      const cleanTime = timePart.length === 5 ? `${timePart}:00` : timePart;
      return `${datePart.replace(/-/g, ':')} ${cleanTime}`;
    }

    function detectCameraFromFilename(filename) {
      const name = String(filename || '');
      if (/whatsapp[ _-]*image/i.test(name) || /^whatsapp/i.test(name)) return 'WhatsApp';
      return '';
    }

    function getCurrentCameraName() {
      const row = document.getElementById('camera-row');
      const value = document.getElementById('camera-value')?.textContent?.trim() || '';
      if (row && row.style.display !== 'none' && value && value !== '–') return value;
      return detectCameraFromFilename(currentOriginalFilename || currentFilename);
    }

    function normalizeTransportTag(tag) {
      const value = String(tag || '').trim().toLowerCase();
      if (value === 'transport=foot' || value === 'transport=walking' || value === 'transport=pedestrian') return 'transport=walk';
      if (value === 'transport=bicycle' || value === 'transport=cycle' || value === 'transport=cycling') return 'transport=bike';
      if (value === 'transport=auto' || value === 'transport=motorcar') return 'transport=car';
      if (value === 'transport=walk' || value === 'transport=bike' || value === 'transport=car' || value === 'transport=other') return value;
      if (value.startsWith('transport=')) return value;
      return 'transport=walk';
    }

    function normalizeTransportKeywords(value) {
      const raw = String(value || '').trim();
      if (!raw) return normalizeTransportTag(currentTransportTag);

      const parts = raw
        .split(',')
        .map(part => part.trim())
        .filter(Boolean);

      let transport = '';
      const rest = [];

      for (const part of parts) {
        if (/^transport=/i.test(part)) {
          transport = normalizeTransportTag(part);
        } else {
          rest.push(part);
        }
      }

      rest.push(transport || normalizeTransportTag(currentTransportTag));
      return rest.join(', ');
    }

    function syncTransportTagToKeywords() {
      const tag = normalizeTransportTag(currentTransportTag || 'transport=walk');
      currentTransportTag = tag;
      const input = document.getElementById('keywordsInput');
      if (!input) return tag;
      input.value = normalizeTransportKeywords(input.value || tag);
      return input.value;
    }

    function stringToExifUnicodeBytes(value) {
      const text = String(value || '') + '\0';
      const bytes = [];
      for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        bytes.push(code & 0xff, (code >> 8) & 0xff);
      }
      return bytes;
    }

    function filenameWithGeoSuffix(filename) {
      const safe = filename || 'foto_geo_tool.jpeg';
      if (/\.(jpe?g)$/i.test(safe)) return safe.replace(/\.(jpe?g)$/i, '_geo.jpeg');
      return safe.replace(/\.[^.]+$/, '') + '_geo.jpeg';
    }

    function updateStoredCurrentImage(dataUrl, filename, extra = {}) {
      if (!currentLoadedImageId) return;
      const images = getSavedImages();
      const index = images.findIndex(img => img.id === currentLoadedImageId);
      if (index < 0) return;

      images[index] = {
        ...images[index],
        dataUrl,
        filename: filename || images[index].filename,
        coords: currentCoords ? { ...currentCoords } : images[index].coords,
        existingCoords: currentExifCoords ? { ...currentExifCoords } : images[index].existingCoords,
        keywords: syncTransportTagToKeywords(),
        description: document.getElementById('descriptionInput')?.value || '',
        camera: getCurrentCameraName() || images[index].camera || '',
        exifWritten: currentExifWritten,
        ...extra
      };

      persistSavedImages(images);
      updateImageListDisplay();
      renderGeoEditorPanel(images[index]);
    }

    
    // PANORAMAX_SAFE_EXIF_FIELDS v0.1.47:
    // Für Panoramax-Testbilder werden keine freien Tags mehr in DocumentName oder XPKeywords geschrieben.
    // Transport-Tags bleiben im Programm/CSV/Upload-Set-Semantics, aber nicht mehr im JPEG-EXIF.

    // PANORAMAX_MINIMAL_EXIF_TEST v0.1.48:
    // Zum Gegencheck gegen HTTP 500 bei Panoramax werden beim Speichern nur GPS- und Datumsfelder geschrieben.
    // Keine Make/Model/ImageDescription/UserComment/XP-Felder/DocumentName.

  function loadImageElementFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Bild konnte für JPEG-Neukodierung nicht geladen werden.'));
      img.src = dataUrl;
    });
  }

  async function reencodeDataUrlAsCleanJpeg(dataUrl, quality = 0.92) {
    const img = await loadImageElementFromDataUrl(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error('Canvas-Kontext konnte nicht erstellt werden.');
    }

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const cleanDataUrl = canvas.toDataURL('image/jpeg', quality);
    if (!cleanDataUrl || !cleanDataUrl.startsWith('data:image/jpeg')) {
      throw new Error('JPEG-Neukodierung fehlgeschlagen.');
    }
    return cleanDataUrl;
  }


  function escapeXmlAttr(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function uint16ToBytes(value) {
    return [(value >> 8) & 255, value & 255];
  }

  function dataUrlToBytes(dataUrl) {
    const base64 = String(dataUrl || '').split(',')[1] || '';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function bytesToDataUrl(bytes) {
    let binary = '';
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return 'data:image/jpeg;base64,' + btoa(binary);
  }

  function buildGpanoXmpPacket(width, height, dateText = '') {
    const safeDate = escapeXmlAttr(dateText || new Date().toISOString());
    return `http://ns.adobe.com/xap/1.0/\0<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
           xmlns:GPano="http://ns.google.com/photos/1.0/panorama/">
    <rdf:Description rdf:about=""
      GPano:UsePanoramaViewer="True"
      GPano:ProjectionType="equirectangular"
      GPano:PoseHeadingDegrees="0.0"
      GPano:CroppedAreaImageWidthPixels="${width}"
      GPano:CroppedAreaImageHeightPixels="${height}"
      GPano:FullPanoWidthPixels="${width}"
      GPano:FullPanoHeightPixels="${height}"
      GPano:CroppedAreaLeftPixels="0"
      GPano:CroppedAreaTopPixels="0"
      GPano:SourcePhotosCount="1"
      GPano:FirstPhotoDate="${safeDate}"
      GPano:LastPhotoDate="${safeDate}" />
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
  }

  function injectXmpApp1IntoJpegDataUrl(dataUrl, xmpString) {
    const jpeg = dataUrlToBytes(dataUrl);
    if (jpeg.length < 4 || jpeg[0] !== 0xff || jpeg[1] !== 0xd8) {
      return dataUrl;
    }

    const encoder = new TextEncoder();
    const xmpBytes = encoder.encode(xmpString);
    const segmentLength = xmpBytes.length + 2;
    if (segmentLength > 65535) {
      console.warn('GPano-XMP ist zu groß und wurde nicht eingefügt.');
      return dataUrl;
    }

    const app1 = new Uint8Array(2 + 2 + xmpBytes.length);
    app1[0] = 0xff;
    app1[1] = 0xe1;
    const lenBytes = uint16ToBytes(segmentLength);
    app1[2] = lenBytes[0];
    app1[3] = lenBytes[1];
    app1.set(xmpBytes, 4);

    const out = new Uint8Array(jpeg.length + app1.length);
    out.set(jpeg.subarray(0, 2), 0);
    out.set(app1, 2);
    out.set(jpeg.subarray(2), 2 + app1.length);

    return bytesToDataUrl(out);
  }

  async function maybeAddGpanoXmpForPanoramax(dataUrl, dateText = '') {
    const img = await loadImageElementFromDataUrl(dataUrl);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    if (!width || !height) return dataUrl;

    const ratio = width / height;
    const isTwoToOne = Math.abs(ratio - 2) < 0.015;

    if (!isTwoToOne) {
      return dataUrl;
    }

    console.info('Panoramax-360-Test: 2:1-Bild erkannt, GPano-XMP wird ergänzt.', { width, height, ratio });
    return injectXmpApp1IntoJpegDataUrl(dataUrl, buildGpanoXmpPacket(width, height, dateText));
  }

async function writeExifTagsForCurrentImage() {
      if (!currentFileData || !currentFileData.dataUrl) {
        showStatus('❌ Kein Bild ausgewählt.', 'warn');
        return false;
      }
      if (!currentCoords) {
        showStatus('❌ Bitte erst einen Standort setzen.', 'warn');
        return false;
      }
      if (!/^data:image\/jpe?g/i.test(currentFileData.dataUrl)) {
        showStatus('⚠️ EXIF-Schreiben ist nur für JPG/JPEG möglich. PNG/TIFF bleiben unverändert.', 'warn');
        return false;
      }
      if (typeof piexif === 'undefined') {
        showStatus('❌ piexifjs wurde nicht geladen. EXIF-Schreiben nicht möglich.', 'warn');
        return false;
      }

      try {
        // PANORAMAX_CLEAN_EXIF_OBJECT v0.1.49:
        // Nicht mehr piexif.load(...) übernehmen, weil dadurch alte MakerNotes,
        // Thumbnails oder proprietäre EXIF-Felder wieder in die neue Datei geraten können.
        // Für den Panoramax-Gegentest wird ein komplett frisches, minimales EXIF-Objekt gebaut.
        const exifObj = { '0th': {}, Exif: {}, GPS: {}, Interop: {}, '1st': {}, thumbnail: null };

        exifObj.GPS[piexif.GPSIFD.GPSVersionID] = [2, 3, 0, 0];
        exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = currentCoords.lat < 0 ? 'S' : 'N';
        exifObj.GPS[piexif.GPSIFD.GPSLatitude] = decimalToExifRational(currentCoords.lat);
        exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = currentCoords.lng < 0 ? 'W' : 'E';
        exifObj.GPS[piexif.GPSIFD.GPSLongitude] = decimalToExifRational(currentCoords.lng);
        const imageDirection = getCurrentImageDirectionValue();
        setGpsDirectionExif(exifObj, imageDirection);
        setGpsAltitudeExif(exifObj, getCurrentAltitudeValue());

        const keywords = syncTransportTagToKeywords();
        const description = syncDescriptionFromInput();
        const cameraName = getCurrentCameraName();
        if (keywords) {
          // Windows/Explorer-kompatible Keywords: XPKeywords = Tag 40094, UTF-16LE.
        }
        if (cameraName === 'WhatsApp') {
        }

        const dateExif = exifDateTimeFromInput(document.getElementById('date-input')?.value || '');
        if (dateExif) {
          exifObj['0th'][piexif.ImageIFD.DateTime] = dateExif;
          exifObj.Exif = exifObj.Exif || {};
          exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = dateExif;
          exifObj.Exif[piexif.ExifIFD.DateTimeDigitized] = dateExif;
          setGpsDateTimeExif(exifObj, document.getElementById('date-input')?.value || '');
        }

        // PANORAMAX_CANVAS_REENCODE_TEST v0.1.50:
        // Vor dem Einfügen frischer Minimal-EXIF-Daten wird das Bild komplett neu als JPEG kodiert.
        // Das entfernt alte APP-/XMP-/MakerNote-/Thumbnail-/Sondersegmente aus der Ausgangsdatei.
        const cleanJpegDataUrl = await reencodeDataUrlAsCleanJpeg(currentFileData.dataUrl, 0.92);

        const exifBytes = piexif.dump(exifObj);
        let newDataUrl = piexif.insert(exifBytes, cleanJpegDataUrl);
        newDataUrl = await maybeAddGpanoXmpForPanoramax(newDataUrl, document.getElementById('date-input')?.value || '');
        currentFileData.dataUrl = newDataUrl;
        currentExifCoords = { ...currentCoords };
        currentExifWritten = true;

        const preview = document.getElementById('preview-img');
        if (preview) preview.src = newDataUrl;
        const thumb = document.getElementById('geoEditorThumb');
        if (thumb) thumb.src = newDataUrl;
        updateGeoEditorCoordinates();
        updateDescriptionMetaRow(description);
        updateAltitudeMetaRow(getCurrentAltitudeValue());
        updateDirectionMetaRow(imageDirection);
        updateStoredCurrentImage(newDataUrl, currentFilename, { camera: cameraName, keywords, description, altitude: getCurrentAltitudeValue(), direction: imageDirection, angle: imageDirection });

        showStatus('✅ Panoramax-360-Testdatei gespeichert: neues JPEG mit GPS, Datum und ggf. GPano-XMP.', 'success');
        return true;
      } catch (err) {
        console.error(err);
        showStatus('❌ EXIF konnte nicht geschrieben werden: ' + err.message, 'warn');
        return false;
      }
    }

    async function downloadCurrentImage() {
      if (!currentFileData || !currentFileData.dataUrl) {
        showStatus('❌ Kein Bild zum Herunterladen ausgewählt.', 'warn');
        return;
      }
      try {
        const response = await fetch(currentFileData.dataUrl);
        const blob = await response.blob();
        saveAs(blob, filenameWithGeoSuffix(currentFilename));
        showStatus('⬇️ Bild wurde zum Download vorbereitet.', 'success');
      } catch (err) {
        showStatus('❌ Download fehlgeschlagen: ' + err.message, 'warn');
      }
    }

    function addKeywordTag(tag) {
      const input = document.getElementById('keywordsInput');
      tag = normalizeTransportTag(tag);
      if (!input || !tag) return;
      const parts = input.value
        .split(',')
        .map(part => part.trim())
        .filter(Boolean)
        .filter(part => !/^transport=/i.test(part));
      parts.push(tag);
      input.value = parts.join(', ');
    }

    function updateTransportButtons() {
      currentTransportTag = normalizeTransportTag(currentTransportTag);
      document.querySelectorAll('.transport-select-button').forEach(btn => {
        btn.classList.toggle('button-selected', normalizeTransportTag(btn.dataset.transportTag) === currentTransportTag);
      });
    }

    function setTransportTag(tag) {
      currentTransportTag = normalizeTransportTag(tag || 'transport=other');
      addKeywordTag(currentTransportTag);
      updateTransportButtons();
      if (currentLoadedImageId) {
        const images = getSavedImages();
        const image = images.find(img => img.id === currentLoadedImageId);
        if (image) {
          image.transportTag = currentTransportTag;
          image.keywords = document.getElementById('keywordsInput')?.value || image.keywords || '';
          persistSavedImages(images);
        }
      }
    }

    function bindTransportButtons() {
      document.querySelectorAll('.transport-select-button').forEach(btn => {
        btn.addEventListener('click', () => setTransportTag(btn.dataset.transportTag));
      });
      updateTransportButtons();
    }

    function bindGeoEditorButtons() {
      document.getElementById('writeExifBtn')?.addEventListener('click', async () => {
        // Ein einziger Speichern-Button rechts: EXIF schreiben und anschließend unten in die gespeicherte Liste übernehmen.
        syncDescriptionFromInput();
        const exifOk = await writeExifTagsForCurrentImage();
        if (exifOk) saveImageToCache();
      });
      document.getElementById('downloadCurrentBtn')?.addEventListener('click', () => {
        syncDescriptionFromInput();
        downloadCurrentImage();
      });
      document.getElementById('googleLensBtn')?.addEventListener('click', openGoogleLensForCurrentImage);
      document.getElementById('clearGeoEditorBtn')?.addEventListener('click', () => {
        document.getElementById('keywordsInput').value = '';
        setDescriptionInputValue('');
        syncDescriptionFromInput();
        showStatus('🧽 Eingabefelder geleert.', 'info');
      });
      document.getElementById('restoreDescriptionBtn')?.addEventListener('click', restoreLastDescription);
      document.getElementById('insertCopyrightBtn')?.addEventListener('click', insertCopyrightNameAtCursor);
      document.getElementById('descriptionOpenBtn')?.addEventListener('click', openDescriptionDialog);
      document.getElementById('descriptionDialogSaveBtn')?.addEventListener('click', () => {
        closeDescriptionDialog(true);
        showStatus('✅ Alternativtext übernommen.', 'success');
      });
      document.getElementById('descriptionDialogCancelBtn')?.addEventListener('click', () => closeDescriptionDialog(false));
      document.getElementById('descriptionDialogCloseBtn')?.addEventListener('click', () => closeDescriptionDialog(true));
      document.getElementById('descriptionDialogRestoreBtn')?.addEventListener('click', restoreLastDescription);
      document.getElementById('descriptionDialogCopyrightBtn')?.addEventListener('click', insertCopyrightNameAtCursor);
      document.getElementById('descriptionLensBtn')?.addEventListener('click', requestAltTextWithGoogleLens);
      document.getElementById('descriptionDialogLensBtn')?.addEventListener('click', requestAltTextWithGoogleLens);

      const descriptionInput = document.getElementById('descriptionInput');
      if (descriptionInput) {
        descriptionInput.addEventListener('input', () => {
          syncDescriptionFromInput();
          updateDescriptionDisplay();
        });
      }

      const descriptionDialogTextarea = document.getElementById('descriptionDialogTextarea');
      if (descriptionDialogTextarea) {
        descriptionDialogTextarea.addEventListener('input', () => {
          setDescriptionInputValue(descriptionDialogTextarea.value);
          syncDescriptionFromInput();
        });
        descriptionDialogTextarea.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            closeDescriptionDialog(true);
          }
        });
      }

      updateDescriptionDisplay();

      document.getElementById('showExistingGeotagsBtn')?.addEventListener('click', () => {
        const existing = document.getElementById('existingGeotagsInput')?.value || 'Keine vorhandenen GPS-EXIF-Daten gefunden.';
        showStatus(`📍 Vorhandene Geotags: ${existing}`, 'info');
      });
    }

    // =====================================================
    // Cache komplett leeren
    // =====================================================
    function clearAllCache() {
      if (confirm('Wirklich den gesamten Cache leeren?\n\nGelöscht werden:\n- Gespeicherte Position\n- Alle unbearbeiteten Bilder aus der oberen Bilder-Liste\n- Alle gespeicherten Bilder\n- Das aktuell sichtbare Bild\n- Session-Informationen\n\nDer Panoramax-Token bleibt erhalten und wird nur über den Löschen-Button im Panoramax-Panel entfernt.\n\nDie Server-Bilder bleiben erhalten und werden nach 24h automatisch gelöscht.')) {
        localStorage.removeItem(STORAGE_POSITION_KEY);
        localStorage.removeItem(STORAGE_IMAGES_KEY);
        localStorage.removeItem(STORAGE_PENDING_IMAGES_KEY);
        localStorage.removeItem(STORAGE_SESSION_KEY);

        pendingImagesMemory = [];
        savedImagesMemory = [];
        updateSavedImageSelect([]);
        updateImageListDisplay();

        // Wichtig: auch das aktuell angezeigte Bild, Metadaten und Geo-Editor zurücksetzen.
        resetFileSelection();

        if (currentMarker) map.removeLayer(currentMarker);
        clearDirectionMarkers();
        currentMarker = null;
        currentCoords = null;
        updateCoordsDisplay();

        const metaDisplay = document.getElementById('metaDisplay');
        if (metaDisplay) metaDisplay.textContent = '📍 Cache geleert – Standort laden …';

        updatePanoramaxAuthStatus();

        showStatus('🗑️ Cache wurde vollständig geleert', 'info');
        map.setView([51.0, 10.5], MAP_DEFAULT_ZOOM);
      }
    }

    // =====================================================
    // Ortssuche & Geolocation
    // =====================================================
    function getZipField(entry, names, fallback = '') {
      for (const name of names) {
        if (entry && entry[name] !== undefined && entry[name] !== null && String(entry[name]).trim() !== '') {
          return entry[name];
        }
      }
      return fallback;
    }

    function getZipLabel(entry) {
      const zip = getZipField(entry, ['zipcode', 'zip', 'plz', 'postal_code'], '');
      const place = getZipField(entry, ['place', 'name', 'ort', 'city'], '');
      return `${zip} ${place}`.trim();
    }

    function normalizeZipSearchText(value) {
      return String(value || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
    }

    function getZipLatRaw(entry) {
      return parseFloat(getZipField(entry, ['latitude', 'lat', 'y'], NaN));
    }

    function getZipLngRaw(entry) {
      return parseFloat(getZipField(entry, ['longitude', 'lng', 'lon', 'x'], NaN));
    }

    function findZipCoordinateFallback(entry) {
      if (!zipData || !entry) return null;
      const zip = String(getZipField(entry, ['zipcode', 'zip', 'plz', 'postal_code'], '')).trim();
      if (!zip) return null;

      const found = zipData.find(other => {
        if (other === entry) return false;
        const otherZip = String(getZipField(other, ['zipcode', 'zip', 'plz', 'postal_code'], '')).trim();
        if (otherZip !== zip) return false;
        return Number.isFinite(getZipLatRaw(other)) && Number.isFinite(getZipLngRaw(other));
      });

      if (!found) return null;
      return {
        lat: getZipLatRaw(found),
        lng: getZipLngRaw(found),
        sourceLabel: getZipLabel(found)
      };
    }

    function hasOwnZipCoordinates(entry) {
      return Number.isFinite(getZipLatRaw(entry)) && Number.isFinite(getZipLngRaw(entry));
    }

    function getZipLat(entry) {
      const own = getZipLatRaw(entry);
      if (Number.isFinite(own)) return own;
      const fallback = findZipCoordinateFallback(entry);
      return fallback ? fallback.lat : NaN;
    }

    function getZipLng(entry) {
      const own = getZipLngRaw(entry);
      if (Number.isFinite(own)) return own;
      const fallback = findZipCoordinateFallback(entry);
      return fallback ? fallback.lng : NaN;
    }

    function getZipResultScore(entry, queryTokens) {
      const zipRaw = String(getZipField(entry, ['zipcode', 'zip', 'plz', 'postal_code'], ''));
      const placeRaw = String(getZipField(entry, ['place', 'name', 'ort', 'city'], ''));
      const zip = normalizeZipSearchText(zipRaw);
      const place = normalizeZipSearchText(placeRaw);
      const haystack = `${zip} ${place}`.trim();

      let score = 0;
      const numericToken = queryTokens.find(t => /^\d+$/.test(t));
      const textTokens = queryTokens.filter(t => !/^\d+$/.test(t));

      if (numericToken) {
        if (zip === numericToken) score += 200;
        else if (zip.startsWith(numericToken)) score += 120;
        else return -1;
      }

      for (const token of textTokens) {
        if (!token) continue;
        if (place === token) score += 180;
        else if (place.startsWith(token)) score += 140;
        else if (place.includes(token)) score += 70;
        else if (haystack.includes(token)) score += 30;
        else return -1;
      }

      if (!numericToken && textTokens.length === 0) return -1;
      if (hasOwnZipCoordinates(entry)) score += 4;
      else if (findZipCoordinateFallback(entry)) score += 1;

      return score;
    }

    function findZipResults(query) {
      if (!zipData) return [];
      const trimmed = String(query || '').trim();
      if (trimmed.length < 2) return [];

      const normalized = normalizeZipSearchText(trimmed);
      if (normalized.length < 2) return [];

      const queryTokens = normalized.split(/\s+/).filter(Boolean);
      const scored = [];

      zipData.forEach((entry, idx) => {
        const score = getZipResultScore(entry, queryTokens);
        if (score >= 0) scored.push({ entry, score, idx });
      });

      scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const az = String(getZipField(a.entry, ['zipcode', 'zip', 'plz', 'postal_code'], ''));
        const bz = String(getZipField(b.entry, ['zipcode', 'zip', 'plz', 'postal_code'], ''));
        if (az !== bz) return az.localeCompare(bz, 'de');
        const ap = String(getZipField(a.entry, ['place', 'name', 'ort', 'city'], ''));
        const bp = String(getZipField(b.entry, ['place', 'name', 'ort', 'city'], ''));
        return ap.localeCompare(bp, 'de');
      });

      return scored.slice(0, 30).map(item => item.entry);
    }

    function openLocationSearch() {
      const panel = document.getElementById('locationSearchPanel');
      const input = document.getElementById('locationSearchInput');
      if (!panel) return;

      panel.classList.add('aktiv');
      panel.setAttribute('aria-hidden', 'false');

      if (input) {
        input.focus();
        input.select();
      }
    }

    function closeLocationSearch() {
      const panel = document.getElementById('locationSearchPanel');
      if (panel) {
        panel.classList.remove('aktiv');
        panel.setAttribute('aria-hidden', 'true');
      }
      hideLocationSearchResults();
    }

    function chooseLocationEntry(entry) {
      const lat = getZipLat(entry);
      const lng = getZipLng(entry);
      const label = getZipLabel(entry);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        showStatus('❌ Für diesen Ort fehlen gültige Koordinaten.', 'warn');
        return;
      }

      const fallback = hasOwnZipCoordinates(entry) ? null : findZipCoordinateFallback(entry);
      const markerLabel = fallback
        ? `${label} (Koordinate aus ${fallback.sourceLabel})`
        : (label || 'Gesuchter Standort');

      setMarker(lat, lng, markerLabel, true);

      const input = document.getElementById('locationSearchInput');
      if (input) input.value = label;

      updateMetaDisplay(markerLabel);
      if (fallback) {
        showStatus(`ℹ️ Für ${label} fehlen eigene Koordinaten. Verwendet wurde ersatzweise ${fallback.sourceLabel}.`, 'warn');
      }
      closeLocationSearch();
    }

    function renderLocationSearchResults(results) {
      const box = document.getElementById('locationSearchResults');
      if (!box) return;

      if (!results || results.length === 0) {
        box.innerHTML = '<div class="location-search-empty">Kein passender Ort gefunden.</div>';
        box.style.display = 'block';
        return;
      }

      box.innerHTML = '';
      results.forEach(entry => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'location-search-result';
        const hasCoords = hasOwnZipCoordinates(entry);
        const fallback = hasCoords ? null : findZipCoordinateFallback(entry);
        const coordHint = !hasCoords && fallback ? '<small class="suggestion-coord-hint">PLZ-Koordinate</small>' : '';
        item.innerHTML = `<span class="suggestion-zip">${getZipField(entry, ['zipcode', 'zip', 'plz', 'postal_code'], '')}</span> <span class="suggestion-place">${getZipField(entry, ['place', 'name', 'ort', 'city'], '')}</span> ${coordHint}`;
        item.addEventListener('click', () => chooseLocationEntry(entry));
        box.appendChild(item);
      });
      box.style.display = 'block';
    }

    function hideLocationSearchResults() {
      const box = document.getElementById('locationSearchResults');
      if (box) {
        box.style.display = 'none';
        box.innerHTML = '';
      }
    }

    function runLocationSearch() {
      const input = document.getElementById('locationSearchInput');
      if (!input) return;

      const query = input.value.trim();
      if (query.length < 2) {
        renderLocationSearchResults([]);
        return;
      }

      const results = findZipResults(query);
      if (results.length === 1) {
        chooseLocationEntry(results[0]);
        return;
      }
      renderLocationSearchResults(results);
    }

    function bindLocationSearchPanel() {
      const metaDisplay = document.getElementById('metaDisplay');
      const input = document.getElementById('locationSearchInput');
      const searchBtn = document.getElementById('locationSearchBtn');
      const closeBtn = document.getElementById('locationSearchCloseBtn');
      const panel = document.getElementById('locationSearchPanel');

      if (panel) panel.setAttribute('aria-hidden', 'true');

      if (metaDisplay) {
        metaDisplay.addEventListener('click', openLocationSearch);
        metaDisplay.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLocationSearch();
          }
        });
        metaDisplay.setAttribute('tabindex', '0');
      }

      if (input) {
        input.addEventListener('input', () => {
          const results = findZipResults(input.value);
          if (input.value.trim().length < 2) {
            hideLocationSearchResults();
            return;
          }
          renderLocationSearchResults(results);
        });
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            runLocationSearch();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            closeLocationSearch();
          }
        });
      }

      if (searchBtn) searchBtn.addEventListener('click', runLocationSearch);
      if (closeBtn) closeBtn.addEventListener('click', closeLocationSearch);

      document.addEventListener('click', (e) => {
        if (!panel || !panel.classList.contains('aktiv')) return;
        if (e.target.closest('#locationSearchPanel') || e.target.closest('#metaDisplay')) return;
        closeLocationSearch();
      });
    }

    async function loadZipData() {
      const statusEl = document.getElementById('zip-status');
      if (statusEl) statusEl.style.display = 'block';
      try {
        const response = await fetch(ZIP_JSON_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        zipData = Array.isArray(data) ? data : [];
        console.log(`Ortssuche geladen: ${zipData.length} Datensätze aus ${ZIP_JSON_URL}`);
        if (statusEl) statusEl.style.display = 'none';
      } catch (err) {
        zipData = [];
        console.error('Ortsdaten konnten nicht geladen werden:', err);
        if (statusEl) statusEl.textContent = '⚠️ Ortsdaten konnten nicht geladen werden.';
      }
    }

    function updateAltitudeInputFromCurrent(overwrite = false) {
      const input = document.getElementById('videoFrameAltitude');
      if (input && Number.isFinite(currentAltitude) && (overwrite || !input.value)) {
        input.value = String(Math.round(currentAltitude));
      }
      updateAltitudeDisplay();
    }

    function locateMe() {
      if (!navigator.geolocation) {
        alert('Geolocation wird nicht unterstützt.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => {
          if (Number.isFinite(pos.coords.altitude)) { currentAltitude = pos.coords.altitude; updateAltitudeInputFromCurrent(true); }
          setMarker(pos.coords.latitude, pos.coords.longitude, 'Mein Standort', true);
          updateMetaDisplay('Mein Standort');
        },
        err => alert('Standort nicht ermittelbar: ' + err.message)
      );
    }

    function startWithCurrentLocation() {
      if (!navigator.geolocation) {
        const metaDisplay = document.getElementById('metaDisplay');
        if (metaDisplay) metaDisplay.textContent = '📍 Standortermittlung nicht verfügbar';
        loadPositionFromCache();
        return;
      }
      const metaDisplay = document.getElementById('metaDisplay');
      if (metaDisplay) metaDisplay.textContent = '📍 Ermittle aktuellen Standort …';
      navigator.geolocation.getCurrentPosition(
        pos => {
          if (Number.isFinite(pos.coords.altitude)) { currentAltitude = pos.coords.altitude; updateAltitudeInputFromCurrent(true); }
          setMarker(pos.coords.latitude, pos.coords.longitude, 'Aktueller Standort', true);
          updateMetaDisplay('Aktueller Standort');
        },
        err => {
          const metaDisplay = document.getElementById('metaDisplay');
          if (metaDisplay) metaDisplay.textContent = '📍 Standort nicht verfügbar – gespeicherte Position wird geladen';
          loadPositionFromCache();
        }
      );
    }

    // =====================================================
    // Datei-Handling
    // =====================================================
    const dropZone = document.getElementById('drop-zone');
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      handleFiles(e.dataTransfer.files);
    });
    document.getElementById('file-input').addEventListener('change', e => {
      handleFiles(e.target.files);
    });

    function readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(reader.error || new Error('Datei konnte nicht gelesen werden.'));
        reader.readAsDataURL(file);
      });
    }

    // =====================================================
    // Datum aus Dateinamen extrahieren
    // Unterstützte Muster:
    // - WhatsApp_Image_2026-05-02_at_17_07_44.jpg
    // - WhatsApp Image 2026-05-02 at 17.07.44.jpg
    // - IMG_20260502_170744.jpg
    // - IMG_2026-05-02-17-07-44.jpg
    // - 2026-05-02_foto.jpg
    // Rückgabe: { value: "YYYY-MM-DDTHH:MM", source: "..." } oder null
    // =====================================================
    function extractDateFromFilename(filename) {
      const name = String(filename || '').replace(/\.[^.]+$/, '');

      const buildDate = (year, month, day, hour = '00', minute = '00', source = 'Dateiname') => {
        const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
        if (
          date.getFullYear() !== Number(year) ||
          date.getMonth() !== Number(month) - 1 ||
          date.getDate() !== Number(day) ||
          date.getHours() !== Number(hour) ||
          date.getMinutes() !== Number(minute)
        ) {
          return null;
        }
        return {
          value: `${year}-${month}-${day}T${hour}:${minute}`,
          source
        };
      };

      // WhatsApp neu: WhatsApp_Image_YYYY-MM-DD_at_HH_MM_SS
      let match = name.match(/(\d{4})-(\d{2})-(\d{2})_at_(\d{2})_(\d{2})/i);
      if (match) return buildDate(match[1], match[2], match[3], match[4], match[5], 'Dateiname: WhatsApp');

      // WhatsApp alt: WhatsApp Image YYYY-MM-DD at HH.MM.SS
      match = name.match(/(\d{4})-(\d{2})-(\d{2})\s+at\s+(\d{2})\.(\d{2})/i);
      if (match) return buildDate(match[1], match[2], match[3], match[4], match[5], 'Dateiname: WhatsApp alt');

      // Android: IMG_YYYYMMDD_HHMMSS
      match = name.match(/(?:^|[^0-9])(\d{4})(\d{2})(\d{2})[_-](\d{2})(\d{2})(\d{2})(?:[^0-9]|$)/);
      if (match) return buildDate(match[1], match[2], match[3], match[4], match[5], 'Dateiname: Android');

      // Android kompakt: IMGYYYYMMDDHHMMSS oder IMG20260507154849.jpg.jpeg
      match = name.match(/(?:IMG[_-]?)?(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:[^0-9]|$)/i);
      if (match) return buildDate(match[1], match[2], match[3], match[4], match[5], 'Dateiname: Android kompakt');

      // iPhone: IMG_YYYY-MM-DD-HH-MM-SS
      match = name.match(/(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})/);
      if (match) return buildDate(match[1], match[2], match[3], match[4], match[5], 'Dateiname: iPhone');

      // Nur Datum: YYYY-MM-DD_foto.jpg
      match = name.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (match) return buildDate(match[1], match[2], match[3], '00', '00', 'Dateiname: nur Datum');

      return null;
    }


    // =====================================================
    // Koordinaten aus Dateinamen extrahieren
    // Unterstützte Beispiele:
    // - WhatsApp Video 2026-05-09 at 16.53.44, 51.096510, 10.591496.mp4
    // - 51.096510, 10.591496 WhatsApp Video 2026-05-09 at 16.53.44.mp4
    // - Bildname 51.096510 10.591496.jpg
    // Rückgabe: { lat, lng, source } oder null
    // =====================================================
    function extractCoordsFromFilename(filename) {
      const raw = String(filename || '')
        .replace(/\.[^.]+$/, '')
        .replace(/[()]/g, ' ')
        .replace(/[;]/g, ',')
        .replace(/\s+/g, ' ')
        .trim();

      // Dezimal-Komma in Koordinaten wird vorsichtig unterstützt:
      // "51,096510, 10,591496" -> "51.096510, 10.591496"
      const normalized = raw.replace(/([+-]?\d{1,3}),(\d{3,})/g, '$1.$2');

      const patterns = [
        /(?:^|[^\d+-])([+-]?\d{1,3}\.\d{3,})\s*,\s*([+-]?\d{1,3}\.\d{3,})(?=$|[^\d])/,
        /(?:^|[^\d+-])([+-]?\d{1,3}\.\d{3,})\s+([+-]?\d{1,3}\.\d{3,})(?=$|[^\d])/
      ];

      const isValidLat = value => Number.isFinite(value) && value >= -90 && value <= 90;
      const isValidLng = value => Number.isFinite(value) && value >= -180 && value <= 180;

      // Europa-Heuristik:
      // Viele Karten/GeoJSON/OSM-Angaben werden als lon,lat notiert.
      // Beispiel Deutschland: 10.591496, 51.096510
      // Das ist im Dateinamen für Menschen plausibel, aber für EXIF brauchen wir lat,lng.
      const looksLikeEuropeLngLat = (first, second) => (
        first >= -25 && first <= 45 &&   // europäischer Längengrad grob
        second >= 34 && second <= 72 &&  // europäischer Breitengrad grob
        !(first >= 34 && first <= 72)    // erster Wert sieht NICHT wie europäischer Breitengrad aus
      );

      for (const pattern of patterns) {
        const match = normalized.match(pattern);
        if (!match) continue;

        const first = Number(match[1]);
        const second = Number(match[2]);

        if (!Number.isFinite(first) || !Number.isFinite(second)) continue;

        if (looksLikeEuropeLngLat(first, second)) {
          return {
            lat: second,
            lng: first,
            source: 'Dateiname: GPS-Koordinaten (Längengrad, Breitengrad erkannt)',
            order: 'lng,lat'
          };
        }

        if (isValidLat(first) && isValidLng(second)) {
          return {
            lat: first,
            lng: second,
            source: 'Dateiname: GPS-Koordinaten',
            order: 'lat,lng'
          };
        }

        if (isValidLng(first) && isValidLat(second)) {
          return {
            lat: second,
            lng: first,
            source: 'Dateiname: GPS-Koordinaten (Längengrad, Breitengrad erkannt)',
            order: 'lng,lat'
          };
        }
      }

      return null;
    }


    function parseExifDate(rawDate) {
      if (!rawDate || typeof rawDate !== 'string') return '';
      const parts = rawDate.trim().split(' ');
      if (parts.length !== 2) return '';
      const datePart = parts[0].replace(/:/g, '-');
      const timePart = parts[1].substring(0, 5);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart) || !/^\d{2}:\d{2}$/.test(timePart)) return '';
      return `${datePart}T${timePart}`;
    }

    function readExifMeta(file) {
      return new Promise(resolve => {
        try {
          EXIF.getData(file, function() {
            const allTags = EXIF.getAllTags(this) || {};
            const lat = extractGPS(allTags.GPSLatitude, allTags.GPSLatitudeRef);
            const lng = extractGPS(allTags.GPSLongitude, allTags.GPSLongitudeRef);
            const rawDate = allTags.DateTimeOriginal || allTags.DateTime || '';
            let date = parseExifDate(rawDate);
            let dateSource = date ? 'EXIF-Metadaten' : '';

            if (!date) {
              const dateFromName = extractDateFromFilename(file.name);
              if (dateFromName) {
                date = dateFromName.value;
                dateSource = dateFromName.source;
              }
            }
            const make = allTags.Make || '';
            const model = allTags.Model || '';
            const camera = `${make} ${model}`.trim() || detectCameraFromFilename(file.name);
            const w = allTags.PixelXDimension || allTags.ImageWidth;
            const h = allTags.PixelYDimension || allTags.ImageLength;
            const description = allTags.ImageDescription || allTags.Description || '';

            const coordsFromName = extractCoordsFromFilename(file.name);
            const existingCoords = lat !== null && lng !== null
              ? { lat, lng }
              : (coordsFromName ? { lat: coordsFromName.lat, lng: coordsFromName.lng } : null);

            resolve({
              existingCoords,
              coordsSource: lat !== null && lng !== null ? 'EXIF-GPS' : (coordsFromName?.source || ''),
              date,
              dateSource,
              camera,
              description,
              resolution: w && h ? `${w} × ${h} px` : ''
            });
          });
        } catch (err) {
          resolve({ existingCoords: null, date: '', dateSource: '', camera: '', description: '', resolution: '' });
        }
      });
    }

    async function fileToPendingImage(file, index = 0) {
      const dataUrl = await readFileAsDataUrl(file);
      const exifMeta = await readExifMeta(file);
      return {
        id: Date.now() + index,
        filename: file.name,
        dataUrl,
        size: file.size,
        lastModified: file.lastModified,
        coords: exifMeta.existingCoords ? { ...exifMeta.existingCoords } : null,
        existingCoords: exifMeta.existingCoords,
        coordsSource: exifMeta.coordsSource || '',
        keywords: '',
        description: exifMeta.description || '',
        date: exifMeta.date,
        dateSource: exifMeta.dateSource,
        camera: exifMeta.camera,
        resolution: exifMeta.resolution,
        addedAt: new Date().toISOString(),
        source: 'pending'
      };
    }

    async function handleFiles(fileList) {
      const allFiles = Array.from(fileList || []).filter(Boolean);
      const videos = allFiles.filter(file => file && file.type && file.type.startsWith('video/'));
      const files = allFiles.filter(file => file && file.type && file.type.startsWith('image/'));

      if (videos.length > 0) {
        prepareVideoFrameSource(videos[0]);
        if (files.length === 0) {
          showStatus(`🎬 Video "${videos[0].name}" geladen. Setze jetzt den Standort auf der Karte und öffne dann den Fotoframeextraktor.`, 'info');
          return;
        }
      }

      if (files.length === 0) return;

      showStatus(`⏳ ${files.length} Bild(er) werden in die Bilder-Liste geladen …`, 'info');

      try {
        const entries = [];
        for (let i = 0; i < files.length; i++) {
          entries.push(await fileToPendingImage(files[i], i));
        }

        currentDirectionRangeEnabled = true;
      addPendingImages(entries);
        loadPendingImageFromSelect(entries[0].id);
        showStatus(`✅ ${entries.length} Bild(er) wurden in die obere Bilder-Liste übernommen.`, 'success');
      } catch (err) {
        console.error(err);
        showStatus('❌ Bilder konnten nicht vollständig geladen werden: ' + err.message, 'warn');
      }
    }



    function isWhatsAppFilename(name) {
      return /whatsapp/i.test(String(name || ''));
    }

    function getVideoSeriesId(file) {
      const base = String(file?.name || 'video').replace(/\.[^.]+$/, '');
      const stamp = file?.lastModified || Date.now();
      return `video:${base}:${stamp}:${file?.size || 0}`;
    }

    function getVideoSeriesLabel(file) {
      const name = String(file?.name || 'Video');
      return isWhatsAppFilename(name) ? `WhatsApp-Video: ${name}` : `Video: ${name}`;
    }

    function getFrameCameraNameForVideo(file) {
      return isWhatsAppFilename(file?.name) ? 'WhatsApp' : 'Video-Frame';
    }

    function buildWhatsAppFrameFilename(file, frameDateValue, index) {
      const safeIndex = String(index + 1).padStart(4, '0');
      if (!isWhatsAppFilename(file?.name)) {
        return cleanVideoFrameFilename(file?.name || 'video', index, index);
      }

      const value = frameDateValue || extractDateFromFilename(file?.name)?.value || '';
      const date = parseDateInputToDate(value) || new Date();
      const pad = n => String(n).padStart(2, '0');
      return `WhatsApp Image ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} at ${pad(date.getHours())}.${pad(date.getMinutes())}.${pad(date.getSeconds())}_frame_${safeIndex}.jpg`;
    }

    function getCurrentSeriesId() {
      if (!currentLoadedImageId && !currentPendingImageId) return '';
      const all = [...getPendingImages(), ...getSavedImages()];
      const img = all.find(item => item.id === currentLoadedImageId || item.id === currentPendingImageId);
      return img?.seriesId || '';
    }

    function propagateSeriesDescription(seriesId, description) {
      if (!seriesId || !activeSeriesPropagation) return;
      const value = String(description || '');

      const pending = getPendingImages();
      let pendingChanged = false;
      pending.forEach(img => {
        if (img.seriesId === seriesId) {
          img.description = value;
          pendingChanged = true;
        }
      });
      if (pendingChanged) {
        setPendingImages(pending);
        updateSavedImageSelect(pending);
      }

      const saved = getSavedImages();
      let savedChanged = false;
      saved.forEach(img => {
        if (img.seriesId === seriesId) {
          img.description = value;
          savedChanged = true;
        }
      });
      if (savedChanged) {
        persistSavedImages(saved);
        updateImageListDisplay();
      }
    }

    function propagateSeriesCoords(seriesId, coords) {
      if (!seriesId || !coords || !activeSeriesPropagation) return;
      const value = { lat: coords.lat, lng: coords.lng };

      const pending = getPendingImages();
      let pendingChanged = false;
      pending.forEach(img => {
        if (img.seriesId === seriesId) {
          img.coords = { ...value };
          img.existingCoords = { ...value };
          pendingChanged = true;
        }
      });
      if (pendingChanged) {
        setPendingImages(pending);
        updateSavedImageSelect(pending);
      }

      const saved = getSavedImages();
      let savedChanged = false;
      saved.forEach(img => {
        if (img.seriesId === seriesId) {
          img.coords = { ...value };
          img.existingCoords = { ...value };
          savedChanged = true;
        }
      });
      if (savedChanged) {
        persistSavedImages(saved);
        updateImageListDisplay();
      }
    }

    function propagateCurrentSeriesState() {
      const seriesId = getCurrentSeriesId();
      if (!seriesId) return;
      propagateSeriesCoords(seriesId, currentCoords);
      propagateSeriesDescription(seriesId, document.getElementById('descriptionInput')?.value || '');
    }


    function prepareVideoFrameSource(file) {
      currentVideoFrameFile = file;
      extractedVideoFrameEntries = [];

      if (currentVideoFrameUrl) {
        try { URL.revokeObjectURL(currentVideoFrameUrl); } catch(e) {}
      }
      currentVideoFrameUrl = URL.createObjectURL(file);

      const box = document.getElementById('video-source-box');
      const name = document.getElementById('video-source-name');
      if (box) box.style.display = 'block';
      if (name) name.textContent = file.name;

      const dateFromName = extractDateFromFilename(file.name);
      if (dateFromName && !document.getElementById('date-input')?.value) {
        document.getElementById('date-input').value = dateFromName.value;
        setDateSourceRow(dateFromName.source.replace('Dateiname:', 'Video-Dateiname:'));
      }

      const coordsFromName = extractCoordsFromFilename(file.name);
      if (coordsFromName) {
        setMarker(coordsFromName.lat, coordsFromName.lng, 'Video-Dateiname', true);
        showStatus(`📍 GPS aus Videonamen erkannt: ${coordsFromName.lat.toFixed(6)}, ${coordsFromName.lng.toFixed(6)}${coordsFromName.order === 'lng,lat' ? ' (Reihenfolge im Namen war Längengrad, Breitengrad)' : ''}`, 'info');
      }
    }


    function ensureVideoFrameProgressIsLeft() {
      const progress = document.getElementById('videoFrameProgress');
      const leftTools = document.querySelector('.video-frame-left-tools');
      const leftStatus = document.getElementById('videoFrameLeftStatus');
      if (!progress || !leftTools) return;

      if (progress.parentElement !== leftTools) {
        if (leftStatus && leftStatus.parentElement === leftTools) {
          leftTools.insertBefore(progress, leftStatus);
        } else {
          leftTools.appendChild(progress);
        }
      }
    }

    function openIntegratedVideoFrameExtractor() {
      ensureVideoFrameProgressIsLeft();
      if (!currentVideoFrameFile || !currentVideoFrameUrl) {
        showStatus('❌ Kein Video geladen. Ziehe zuerst ein Video auf die Eingabe.', 'warn');
        return;
      }

      const overlay = document.getElementById('videoFrameExtractorOverlay');
      const video = document.getElementById('integratedVideoPreview');
      const name = document.getElementById('integratedVideoName');
      const meta = document.getElementById('integratedVideoMeta');
      const topName = document.getElementById('integratedVideoNameTop');
      const desc = document.getElementById('videoFrameDescription');
      const coordsDisplay = document.getElementById('videoFrameCoordsDisplay');
      const dateDisplay = document.getElementById('videoFrameDateDisplay');
      const transferBtn = document.getElementById('videoFrameTransferBtn');
      const extractBtn = document.getElementById('videoFrameExtractBtn');
      const strip = document.getElementById('videoFrameStrip');

      extractedVideoFrameEntries = [];
      if (strip) strip.innerHTML = '';
      const leftStatus = document.getElementById('videoFrameLeftStatus');
      if (leftStatus) leftStatus.textContent = 'Nach der Extraktion kannst du einzelne Bilder per Klick auf das Vorschaubild auslassen.';
      if (transferBtn) transferBtn.disabled = true;
      if (extractBtn) extractBtn.disabled = false;

      if (overlay) overlay.style.display = 'block';
      if (video) {
        video.src = currentVideoFrameUrl;
        video.onloadedmetadata = () => {
          if (meta) meta.textContent = `${Math.round(video.duration || 0)} s · ${video.videoWidth || 0} × ${video.videoHeight || 0}`;
        };
      }
      if (name) name.textContent = currentVideoFrameFile.name;
      if (topName) topName.textContent = currentVideoFrameFile.name;

      if (desc && !desc.value.trim()) {
        desc.value = document.getElementById('descriptionInput')?.value?.trim() || localStorage.getItem(STORAGE_LAST_DESCRIPTION_KEY) || '';
      }

      const dateValue = document.getElementById('date-input')?.value || extractDateFromFilename(currentVideoFrameFile.name)?.value || '';
      if (dateDisplay) dateDisplay.textContent = dateValue || 'nicht gesetzt';

      if (coordsDisplay) {
        coordsDisplay.textContent = currentCoords
          ? `${currentCoords.lat.toFixed(6)}, ${currentCoords.lng.toFixed(6)}`
          : 'keine GPS-Übernahme – später beim Speichern setzen';
      }

      const progress = document.getElementById('videoFrameProgress');
      if (progress) progress.textContent = 'Prüfe die Werte und starte dann die Extraktion.';
    }

    function closeIntegratedVideoFrameExtractor() {
      const overlay = document.getElementById('videoFrameExtractorOverlay');
      const video = document.getElementById('integratedVideoPreview');
      if (video) video.pause();
      if (overlay) overlay.style.display = 'none';
    }

    function parseDateInputToDate(value) {
      if (!value) return null;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    }

    function dateToExifLocalInput(date) {
      const pad = n => String(n).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function addSecondsToDateInput(value, seconds) {
      const base = parseDateInputToDate(value) || new Date();
      return dateToExifLocalInput(new Date(base.getTime() + Math.round(seconds * 1000)));
    }

    function cleanVideoFrameFilename(baseName, index, timestamp) {
      const stem = String(baseName || 'video')
        .replace(/\.[^.]+$/, '')
        .replace(/[^\p{L}\p{N}_-]+/gu, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 80) || 'video';
      const sec = String(Math.floor(timestamp)).padStart(5, '0');
      return `${stem}-frame-${String(index + 1).padStart(4, '0')}-${sec}s.jpg`;
    }

    async function dataUrlWithMinimalExifForVideoFrame(dataUrl, coords, dateValue, altitudeValue = '', directionValue = 0) {
      if (typeof piexif === 'undefined' || !coords) return dataUrl;

      const exifObj = { '0th': {}, Exif: {}, GPS: {}, Interop: {}, '1st': {}, thumbnail: null };
      exifObj.GPS[piexif.GPSIFD.GPSVersionID] = [2, 3, 0, 0];
      exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = coords.lat < 0 ? 'S' : 'N';
      exifObj.GPS[piexif.GPSIFD.GPSLatitude] = decimalToExifRational(coords.lat);
      exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = coords.lng < 0 ? 'W' : 'E';
      exifObj.GPS[piexif.GPSIFD.GPSLongitude] = decimalToExifRational(coords.lng);
      setGpsDirectionExif(exifObj, directionValue);

      setGpsAltitudeExif(exifObj, altitudeValue);

      const dateExif = exifDateTimeFromInput(dateValue);
      if (dateExif) {
        exifObj['0th'][piexif.ImageIFD.DateTime] = dateExif;
        exifObj.Exif[piexif.ExifIFD.DateTimeOriginal] = dateExif;
        exifObj.Exif[piexif.ExifIFD.DateTimeDigitized] = dateExif;
        setGpsDateTimeExif(exifObj, dateValue);
      }

      const exifBytes = piexif.dump(exifObj);
      let out = piexif.insert(exifBytes, dataUrl);
      out = await maybeAddGpanoXmpForPanoramax(out, dateValue || '');
      return out;
    }

    function seekIntegratedVideo(video, time) {
      return new Promise(resolve => {
        const safeTime = Math.min(Math.max(0, time), Math.max(0, (video.duration || 0) - 0.001));
        const done = () => resolve();
        video.addEventListener('seeked', done, { once: true });
        video.currentTime = safeTime;
      });
    }


    function countActiveVideoFrameEntries() {
      return extractedVideoFrameEntries.filter(entry => !entry.skipped).length;
    }

    function countSkippedVideoFrameEntries() {
      return extractedVideoFrameEntries.filter(entry => entry.skipped).length;
    }

    function updateVideoFrameTransferState() {
      const transferBtn = document.getElementById('videoFrameTransferBtn');
      const extractBtn = document.getElementById('videoFrameExtractBtn');
      const progress = document.getElementById('videoFrameProgress');
      const leftStatus = document.getElementById('videoFrameLeftStatus');

      const active = countActiveVideoFrameEntries();
      const skipped = countSkippedVideoFrameEntries();
      const total = extractedVideoFrameEntries.length;

      if (transferBtn) transferBtn.disabled = active === 0;
      if (extractBtn && total > 0) extractBtn.disabled = true;

      const text = total
        ? `✅ ${active} Frame(s) aktiv, ${skipped} ausgelassen. Klick auf ein Vorschaubild schaltet es um.`
        : 'Nach der Extraktion kannst du einzelne Bilder per Klick auf das Vorschaubild auslassen.';

      if (leftStatus) leftStatus.textContent = text;
      if (progress && total) progress.textContent = `✅ ${active} von ${total} Frame(s) werden ins FotoGeo-Tool übernommen. ${skipped} ausgelassen.`;
    }

    function toggleVideoFrameSkipped(frameId) {
      const entry = extractedVideoFrameEntries.find(item => String(item.id) === String(frameId));
      if (!entry) return;

      entry.skipped = !entry.skipped;
      const tile = document.querySelector(`[data-video-frame-id="${CSS.escape(String(frameId))}"]`);
      if (tile) {
        tile.classList.toggle('is-skipped', !!entry.skipped);
        tile.setAttribute('aria-pressed', entry.skipped ? 'true' : 'false');
        tile.title = entry.skipped ? 'Ausgelassen – Klick zum Wieder aktivieren' : 'Aktiv – Klick zum Auslassen';
      }
      updateVideoFrameTransferState();
    }



    function buildEvenVideoFrameTimestamps(duration, desiredCount) {
      const safeDuration = Math.max(0, Number(duration) || 0);
      const count = Math.max(1, Math.floor(Number(desiredCount) || 1));

      if (safeDuration <= 0) return [0];
      if (count === 1) return [0];

      // Gleichmäßige Verteilung über die gesamte Videolänge.
      // Beispiel: 48 Sekunden und 15 gewünschte Frames
      // -> 15 Zeitpunkte vom Anfang bis kurz vor das Ende.
      const lastUsableTime = Math.max(0, safeDuration - 0.001);
      const step = lastUsableTime / (count - 1);
      const times = [];

      for (let i = 0; i < count; i += 1) {
        times.push(Math.min(lastUsableTime, i * step));
      }

      return times;
    }

    async function extractFramesFromIntegratedVideo() {
      const video = document.getElementById('integratedVideoPreview');
      const progress = document.getElementById('videoFrameProgress');
      const strip = document.getElementById('videoFrameStrip');
      const transferBtn = document.getElementById('videoFrameTransferBtn');
      const extractBtn = document.getElementById('videoFrameExtractBtn');

      if (!video || !currentVideoFrameFile) return;
      const coordsForFrames = currentCoords ? { ...currentCoords } : null;
      if (!coordsForFrames) {
        showStatus('ℹ️ Frames werden ohne GPS vorbereitet. Setze die Position später beim Speichern der Einzelbilder.', 'info');
        if (progress) progress.textContent = 'ℹ️ Keine Koordinaten gesetzt – Frames werden trotzdem vorbereitet.';
      }

      const interval = Math.max(0.1, Number(document.getElementById('videoFrameInterval')?.value || 1)); // bleibt als alter UI-Wert erhalten; die Zielanzahl steuert jetzt den Rhythmus
      const desiredFrames = Math.max(1, Math.floor(Number(document.getElementById('videoFrameMax')?.value || 30)));
      const quality = Math.min(1, Math.max(0.5, Number(document.getElementById('videoFrameQuality')?.value || 92) / 100));
      const altitude = document.getElementById('videoFrameAltitude')?.value || '';
      const description = document.getElementById('videoFrameDescription')?.value?.trim() || document.getElementById('descriptionInput')?.value?.trim() || '';
      const dateBase = document.getElementById('date-input')?.value || extractDateFromFilename(currentVideoFrameFile.name)?.value || '';
      const seriesId = getVideoSeriesId(currentVideoFrameFile);
      const seriesLabel = getVideoSeriesLabel(currentVideoFrameFile);
      const frameCamera = getFrameCameraNameForVideo(currentVideoFrameFile);

      extractedVideoFrameEntries = [];
      if (strip) strip.innerHTML = '';
      if (transferBtn) transferBtn.disabled = true;
      if (extractBtn) extractBtn.disabled = true;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) throw new Error('Canvas konnte nicht erstellt werden.');

        const duration = video.duration || 0;
        const timestamps = buildEvenVideoFrameTimestamps(duration, desiredFrames);
        const total = timestamps.length;
        const effectiveStep = total > 1 ? (timestamps[1] - timestamps[0]) : 0;

        if (progress) {
          progress.textContent = `⏳ ${total} Frame(s) werden gleichmäßig über ${duration.toFixed(1)} Sekunden verteilt. Abstand ca. ${effectiveStep.toFixed(2)} Sekunden.`;
        }

        for (let i = 0; i < total; i += 1) {
          const timestamp = timestamps[i];
          if (progress) progress.textContent = `⏳ Frame ${i + 1} von ${total} wird erstellt – Zeitposition ${timestamp.toFixed(2)} s …`;

          await seekIntegratedVideo(video, timestamp);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          let dataUrl = canvas.toDataURL('image/jpeg', quality);
          const frameDate = addSecondsToDateInput(dateBase, timestamp);
          const frameDirection = interpolateDirectionForIndex(i, total);
          dataUrl = await dataUrlWithMinimalExifForVideoFrame(dataUrl, coordsForFrames, frameDate, altitude, frameDirection);

          const entry = {
            id: Date.now() + i,
            filename: buildWhatsAppFrameFilename(currentVideoFrameFile, frameDate, i),
            dataUrl,
            size: Math.round((dataUrl.length * 3) / 4),
            lastModified: Date.now() + i,
            coords: coordsForFrames ? { ...coordsForFrames } : null,
            existingCoords: coordsForFrames ? { ...coordsForFrames } : null,
            keywords: normalizeTransportTag(currentTransportTag || 'transport=walk'),
            transportTag: normalizeTransportTag(currentTransportTag || 'transport=walk'),
            description,
            date: frameDate,
            dateSource: 'Video + Frame-Zeit',
            camera: frameCamera,
            resolution: `${canvas.width} × ${canvas.height} px`,
            addedAt: new Date().toISOString(),
            source: 'pending',
            fromVideo: currentVideoFrameFile.name,
            seriesId,
            seriesType: 'video',
            seriesLabel,
            frameTime: timestamp,
            direction: interpolateDirectionForIndex(i, total),
            angle: interpolateDirectionForIndex(i, total),
            altitude,
            skipped: false
          };

          extractedVideoFrameEntries.push(entry);

          if (strip) {
            const tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'video-frame-thumb';
            tile.dataset.videoFrameId = String(entry.id);
            tile.title = 'Aktiv – Klick zum Auslassen';
            tile.setAttribute('aria-pressed', 'false');
            tile.addEventListener('click', () => toggleVideoFrameSkipped(entry.id));

            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = entry.filename;

            const badge = document.createElement('span');
            badge.className = 'video-frame-skip-badge';
            badge.textContent = '✕';

            tile.appendChild(img);
            tile.appendChild(badge);
            strip.appendChild(tile);
          }
        }

        if (progress) progress.textContent = `✅ ${extractedVideoFrameEntries.length} Frame(s) gleichmäßig über das ganze Video vorbereitet. Die Blickrichtungen werden beim Übernehmen als 360°-Panorama verteilt. Klicke auf „FotoGeo-Tool“.`;
        if (extractBtn) extractBtn.disabled = extractedVideoFrameEntries.length > 0;
        updateVideoFrameTransferState();
      } catch (err) {
        console.error(err);
        if (progress) progress.textContent = '❌ Fehler beim Extrahieren: ' + err.message;
        showStatus('❌ Fehler beim Extrahieren: ' + err.message, 'warn');
      } finally {
        if (extractBtn && extractedVideoFrameEntries.length === 0) extractBtn.disabled = false;
      }
    }

    function transferVideoFramesToFotoGeoTool() {
      if (!extractedVideoFrameEntries || extractedVideoFrameEntries.length === 0) {
        showStatus('❌ Es sind noch keine Video-Frames vorbereitet.', 'warn');
        return;
      }
      const activeVideoFrameEntries = extractedVideoFrameEntries.filter(entry => !entry.skipped);
      if (activeVideoFrameEntries.length === 0) {
        showStatus('❌ Alle Video-Frames sind ausgelassen. Aktiviere mindestens ein Vorschaubild.', 'warn');
        updateVideoFrameTransferState();
        return;
      }

      const description = document.getElementById('videoFrameDescription')?.value?.trim() || '';
      if (description) {
        setDescriptionInputValue(description);
        try { localStorage.setItem(STORAGE_LAST_DESCRIPTION_KEY, description); } catch(e) {}
      }

      const activeCount = activeVideoFrameEntries.length;
      const entries = activeVideoFrameEntries.map((entry, index) => {
        const frameDirection = panoramaDirectionForFrame(index, activeCount);
        return {
          ...entry,
          id: Date.now() + index,
          direction: frameDirection,
          angle: frameDirection,
          description: description || entry.description || ''
        };
      });

      addPendingImages(entries);
      updateSavedImageSelect();
      loadPendingImageFromSelect(entries[0].id);
      if (entries[0]?.seriesId) {
        propagateSeriesDescription(entries[0].seriesId, description || entries[0].description || '');
        if (entries[0].coords || currentCoords) propagateSeriesCoords(entries[0].seriesId, entries[0].coords || currentCoords);
      }
      const transferBtn = document.getElementById('videoFrameTransferBtn');
      const extractBtn = document.getElementById('videoFrameExtractBtn');
      if (transferBtn) transferBtn.disabled = true;
      if (extractBtn) extractBtn.disabled = false;
      updatePanoramaxAuthStatus();
      closeIntegratedVideoFrameExtractor();
      showStatus(`✅ ${entries.length} Video-Frame(s) wurden in die obere Bilder-Liste übernommen. ${countSkippedVideoFrameEntries()} Frame(s) wurden ausgelassen.`, 'success');
    }


    function handleFile(file) {
      handleFiles([file]);
    }

    function readExif(file, filename) {
      EXIF.getData(file, function() {
        const allTags = EXIF.getAllTags(this);
        const lat = extractGPS(allTags.GPSLatitude, allTags.GPSLatitudeRef);
        const lng = extractGPS(allTags.GPSLongitude, allTags.GPSLongitudeRef);
        if (lat !== null && lng !== null) {
          document.getElementById('gps-exif-value').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          document.getElementById('gps-row').style.display = 'flex';
          currentExifCoords = { lat, lng };
          updateGeoEditorCoordinates();
          setMarker(lat, lng, 'GPS aus EXIF', true);
          updateMetaDisplay('GPS aus EXIF');
        }

        const exifAltitude = extractExifAltitude(allTags);
        if (Number.isFinite(exifAltitude)) {
          currentAltitude = exifAltitude;
          updateAltitudeInputFromCurrent(true);
          updateAltitudeMetaRow(exifAltitude);
        } else {
          updateAltitudeMetaRow(null);
        }

        const exifDirection = extractExifDirection(allTags);
        if (Number.isFinite(exifDirection)) {
          updateDirectionMetaRow(exifDirection);
        } else {
          updateDirectionMetaRow(null);
        }
        const rawDate = allTags.DateTimeOriginal || allTags.DateTime;
        const exifDate = parseExifDate(rawDate);
        if (exifDate) {
          document.getElementById('date-input').value = exifDate;
          setDateSourceRow('EXIF-Metadaten');
        } else {
          const dateFromName = extractDateFromFilename(filename);
          if (dateFromName) {
            document.getElementById('date-input').value = dateFromName.value;
            setDateSourceRow(dateFromName.source);
          }
        }
        
        const make = allTags.Make || '';
        const model = allTags.Model || '';
        const camera = `${make} ${model}`.trim() || detectCameraFromFilename(filename);
        if (camera) {
          document.getElementById('camera-value').textContent = camera;
          document.getElementById('camera-row').style.display = 'flex';
        }
        
        const description = allTags.ImageDescription || allTags.Description || '';
        if (description) {
          setDescriptionInputValue(description);
          updateDescriptionMetaRow(description);
        }

        const w = allTags.PixelXDimension || allTags.ImageWidth;
        const h = allTags.ImageLength || allTags.PixelYDimension || allTags.ImageHeight;
        if (w && h) {
          document.getElementById('res-value').textContent = `${w} × ${h} px`;
          document.getElementById('res-row').style.display = 'flex';
        }
      });
    }

    function extractGPS(dmsArray, ref) {
      if (!dmsArray || dmsArray.length < 3) return null;
      function toDecimal(val) {
        if (typeof val === 'number') return val;
        if (val && val.numerator !== undefined) return val.numerator / val.denominator;
        return 0;
      }
      let decimal = toDecimal(dmsArray[0]) + toDecimal(dmsArray[1]) / 60 + toDecimal(dmsArray[2]) / 3600;
      if (ref === 'S' || ref === 'W') decimal = -decimal;
      return decimal;
    }

    function rationalToNumber(value) {
      if (typeof value === 'number') return value;
      if (Array.isArray(value) && value.length >= 2) return Number(value[0]) / Number(value[1] || 1);
      if (value && typeof value === 'object') {
        if (value.numerator !== undefined) return Number(value.numerator) / Number(value.denominator || 1);
        if (value.num !== undefined) return Number(value.num) / Number(value.den || 1);
      }
      return NaN;
    }

    function extractExifAltitude(allTags) {
      if (!allTags) return null;
      const raw = allTags.GPSAltitude;
      if (raw === undefined || raw === null) return null;
      const val = rationalToNumber(raw);
      if (!Number.isFinite(val)) return null;
      const ref = Number(allTags.GPSAltitudeRef || 0);
      return ref === 1 ? -Math.abs(val) : val;
    }

    function extractExifDirection(allTags) {
      if (!allTags) return null;
      const raw = allTags.GPSImgDirection;
      if (raw === undefined || raw === null) return null;
      const val = rationalToNumber(raw);
      if (!Number.isFinite(val)) return null;
      return normalizeBearing(val);
    }

    function updateAltitudeMetaRow(altitudeValue) {
      const row = document.getElementById('altitude-row');
      const val = document.getElementById('altitude-meta-value');
      const alt = Number(altitudeValue);
      if (!row || !val) return;
      if (Number.isFinite(alt)) {
        val.textContent = `${Math.round(alt)} m`;
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    }

    function updateDirectionMetaRow(directionValue) {
      const row = document.getElementById('direction-row');
      const val = document.getElementById('direction-meta-value');
      const dir = Number(directionValue);
      if (!row || !val) return;
      if (Number.isFinite(dir)) {
        val.textContent = `${normalizeBearing(dir).toFixed(1)}°`;
        row.style.display = 'flex';
      } else {
        row.style.display = 'none';
      }
    }

    function setDateSourceRow(sourceText) {
      document.getElementById('date-source-value').textContent = sourceText;
      document.getElementById('date-source-row').style.display = 'flex';
    }

    function resetFileSelection(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const previewContainer = document.getElementById('preview-container');
      const previewImg = document.getElementById('preview-img');
      const filenameLabel = document.getElementById('filename-label');
      const metaSection = document.getElementById('meta-section');
      const statusBox = document.getElementById('status-box');
      const fileInput = document.getElementById('file-input');
      const savedSelect = document.getElementById('savedImageSelect');

      if (previewContainer) previewContainer.style.display = 'none';
      if (previewImg) {
        previewImg.removeAttribute('src');
        previewImg.src = '';
      }
      if (filenameLabel) filenameLabel.textContent = '';
      if (dropZone) dropZone.style.display = 'block';
      if (metaSection) metaSection.style.display = 'none';
      document.getElementById('transport-section')?.style.setProperty('display', 'none');
      if (statusBox) statusBox.style.display = 'none';
      document.getElementById('save-btn')?.style.setProperty('display', 'none');
      if (fileInput) fileInput.value = '';
      const videoSourceBox = document.getElementById('video-source-box');
      if (videoSourceBox) videoSourceBox.style.display = 'none';

      // Select nicht neu laden lassen: Beim Zurücksetzen darf die vorherige Auswahl
      // nicht sofort wieder als Vorschau erscheinen.
      if (savedSelect && savedSelect.options.length > 0) {
        savedSelect.selectedIndex = 0;
      }

      document.getElementById('date-input').value = '';
      document.getElementById('date-source-row').style.display = 'none';
      document.getElementById('gps-row').style.display = 'none';
      document.getElementById('camera-row').style.display = 'none';
      document.getElementById('res-row').style.display = 'none';

      currentFileData = null;
      currentFilename = null;
      currentLoadedImageId = null;
      currentPendingImageId = null;
      currentOriginalFilename = null;
      currentExifCoords = null;
      currentExifWritten = false;
      clearGeoEditor(false);
    }

    function showStatus(text, type) {
      const box = document.getElementById('status-box');
      box.innerHTML = text.replace(/\n/g, '<br>');
      box.className = `status-box ${type}`;
      box.style.display = 'block';
      setTimeout(() => box.style.display = 'none', 5000);
    }

    // =====================================================
    // App starten
    // =====================================================
    bindLocationSearchPanel();
    bindSavedImageSelect();
    bindGeoEditorButtons();
    bindTransportButtons();
    bindPanoramaxAuthPanel();
    ensureMapReady();
    loadZipData();
    const panoramaPresetApplied = applyPanoramaPresetFromUrl();
    if (!panoramaPresetApplied) {
      startWithCurrentLocation();
      window.setTimeout(loadDirectionMarkersFromCache, 300);
    }
    updateImageListDisplay();


try { window.addEventListener('load', ensureVideoFrameProgressIsLeft); } catch(e) {}
