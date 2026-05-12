# FotoGeo-Tool – geglättetes Videoskript

## Teil 1 – Bilder vorbereiten und hochladen

Hallo zusammen, heute stelle ich euch mein neues Projekt vor: das FotoGeo-Tool.

Mit dem FotoGeo-Tool kann ich Bilder vorbereiten, mit GPS-Daten, Beschreibung und Schlagwörtern versehen und anschließend für den Upload zu Panoramax bereitstellen. Das ist besonders praktisch, wenn Bilder keine oder falsche Standortdaten enthalten oder wenn ich aus mehreren Bildern eine saubere Bildserie erstellen möchte.

Ich starte mit einer leeren Arbeitsfläche. Dafür klicke ich zuerst auf „Cache löschen“. Die Nachfrage bestätige ich mit „OK“. Danach sind zwischengespeicherte Bilder, alte Eingaben und Bearbeitungsreste entfernt, und ich kann sauber neu anfangen.

Als Nächstes lade ich meine vorbereiteten Bilder. Das geht auf zwei Arten: Ich kann die Bilder direkt per Drag and Drop auf die Eingabefläche ziehen, oder ich klicke auf die Fläche und wähle die Dateien im Dateidialog aus. Nach dem Laden sehe ich links die Bildvorschau und darunter die Bilder-Liste. Rechts befindet sich die OpenStreetMap-Karte.

Jetzt setze ich den Standort. Dafür kann ich entweder direkt in der Karte arbeiten oder zuerst über die Ortssuche springen. Wenn ich zum Beispiel „99947 Mülverstedt“ in das Suchfeld eingebe und auf „Suchen“ klicke, springt die Karte zu diesem Ort. Alternativ kann ich die Koordinaten auch direkt in den Dateinamen schreiben. Die App erkennt sowohl „Breitengrad, Längengrad“, zum Beispiel „WhatsApp Video 2026-05-09 at 16.53.44, 51.096510, 10.591496.mp4“, als auch die in Europa häufige Reihenfolge „Längengrad, Breitengrad“, zum Beispiel „10.591496, 51.096510 WhatsApp Video 2026-05-09 at 16.53.44.mp4“. Dann erkennt die App die GPS-Position beim Laden automatisch und setzt den Marker auf diese Koordinaten. Danach zoome ich mit dem Mausrad genauer hinein und klicke mit der rechten Maustaste an die Stelle, an der das Bild aufgenommen wurde. Dadurch erscheint ein Marker. Wenn die Position noch nicht ganz stimmt, kann ich den Marker mit der linken Maustaste anfassen und verschieben. Diese Koordinaten werden später in das Bild geschrieben.

Danach wähle ich die Fortbewegungsart aus. Ich kann angeben, ob die Aufnahme zu Fuß, mit dem Fahrrad, mit dem Auto oder auf andere Weise entstanden ist, zum Beispiel mit der Bahn. Diese Angabe wird als Panoramax-Tag vorbereitet.

Jetzt füge ich eine Beschreibung hinzu. Dafür klicke ich beim Bild auf „Beschreibung“. Die App merkt sich den zuletzt verwendeten Beschreibungstext und auch den zuletzt verwendeten Copyright-Namen. Wenn ich am Ende der Beschreibung „@ Name“ oder „© Name“ schreibe, merkt sich die App diesen Namen. Steht davor bereits Beschreibungstext, setzt die App automatisch einen Trenner: Aus „Baustelle @ gabischatz“ wird „Baustelle | © gabischatz“. Der Copyright-Button fügt den gespeicherten Namen später ebenfalls mit diesem Trenner ein. Das spart Zeit, wenn mehrere Bilder zur gleichen Serie gehören.

Wenn ich noch keinen guten Alternativtext habe, kann ich mir mit Google Lens helfen lassen. Ich klicke auf den Lens-Button. Das Bild wird temporär vorbereitet, Google Lens wird geöffnet und ich kann dort eine passende Beschreibung erzeugen oder übernehmen. Danach kopiere ich den Text, kehre zum FotoGeo-Tool zurück und füge ihn in die Beschreibung ein.

Wenn Beschreibung, Koordinaten und Tags passen, speichere ich das Bild. Unten in den Metadaten kann ich prüfen, ob Datum, GPS-Position, Kameraangabe und Beschreibung korrekt übernommen wurden. Nach dem Speichern lädt die App automatisch das nächste Bild aus der Liste.

Bei einer Bildserie kann ich die Beschreibung über das Pluszeichen vom vorherigen Bild übernehmen. Dann muss ich nicht alles neu schreiben. Ich prüfe kurz, ob der Text passt, speichere wieder und arbeite mich Bild für Bild durch die Serie.

Wenn alle Bilder gespeichert sind, wird der Panoramax-Upload vorbereitet. Der Upload-Button wird hervorgehoben, sobald alle Bilder gespeichert sind und ein Token vorhanden ist.

Für den Upload brauche ich einen Panoramax-Token. Dafür klicke ich auf „Token generieren“. Es öffnet sich die Panoramax-Seite. Dort erstelle ich einen neuen Token, gebe ihm eine sinnvolle Beschreibung, kopiere ihn und kehre zum FotoGeo-Tool zurück. Dann füge ich den Token in das Token-Feld ein und klicke auf „Token merken“. Der Token bleibt im Browser gespeichert, bis ich ihn über „Löschen“ wieder entferne.

Jetzt ist alles vorbereitet. Ich klicke auf „Upload starten“. Die gespeicherten Bilder werden für Panoramax vorbereitet und anschließend kann ich sie auf der Panoramax-Seite hochladen beziehungsweise weiterverarbeiten.

## Teil 2 – Video-Frames erzeugen

Im zweiten Teil zeige ich, wie ich aus einem kurzen Video einzelne Bilder erzeugen kann.

Ich starte wieder mit einer sauberen Oberfläche und lösche bei Bedarf den Cache. Danach ziehe ich ein Video auf die Eingabefläche oder wähle es über den Dateidialog aus. Das FotoGeo-Tool erkennt, dass es sich um ein Video handelt, und zeigt den Button „Fotoframeextraktor“ an.

Bevor ich die Frames erzeuge, setze ich wieder den Aufnahmeort auf der Karte. Auch hier kann ich die Ortssuche verwenden, zum Beispiel mit „99947 Mülverstedt“. Danach zoome ich in die Karte, klicke mit der rechten Maustaste auf den genauen Aufnahmeort und verschiebe den Marker bei Bedarf. Wenn ich die Koordinaten hier noch nicht setze, ist das auch möglich. Dann werden die Frames zunächst ohne GPS vorbereitet, und ich kann die Position später beim ersten Bild setzen. Da die Frames als Serie behandelt werden, wird die Position anschließend auf alle Frames dieser Serie übertragen.

Jetzt öffne ich den Fotoframeextraktor. Das Video, das Datum, die Beschreibung und die GPS-Position werden aus der Hauptseite übernommen, soweit sie vorhanden sind.

Im Fotoframeextraktor stelle ich ein, wie viele Einzelbilder ich für das Panorama haben möchte. Die App verteilt diese Frames automatisch gleichmäßig über die gesamte Videolänge. Dadurch fehlen nicht die hinteren Teile der Kamerabewegung. Außerdem lege ich fest, wie viele Frames ich insgesamt haben möchte. Diese Anzahl wird nicht einfach vom Anfang des Videos genommen, sondern gleichmäßig über die komplette Videolänge verteilt. Wenn ich zum Beispiel 15 Frames einstelle, entstehen 15 Bilder vom Anfang bis zum Ende der Kamerabewegung. Die JPEG-Qualität kann hoch eingestellt bleiben. Die Höhe ist optional; wenn ich sie nicht kenne, lasse ich sie frei.

Nun gebe ich eine Beschreibung ein, die für alle Frames gelten soll. Zum Beispiel beschreibe ich den Ort und ergänze danach mein Copyright, etwa mit senkrechtem Strich und Namen. Diese Beschreibung wird auf alle erzeugten Frames angewendet.

Dann klicke ich auf „Frames extrahieren“. Die App erzeugt aus dem Video einzelne Bilder und zeigt sie als Thumbnails an. Wenn mir ein Frame nicht gefällt, klicke ich einfach auf das Vorschaubild. Es wird ausgegraut und mit einem roten X markiert. Diese Bilder werden später nicht an das FotoGeo-Tool zurückgegeben. Mit einem erneuten Klick kann ich ein Bild wieder aktivieren.

Wenn die Auswahl passt, klicke ich auf „FotoGeo-Tool“. Die aktiven Frames werden in die Bilder-Liste übernommen. Das erste Bild wird automatisch geladen.

Jetzt prüfe ich wieder die Beschreibung, die Koordinaten und die Metadaten. Wenn alles passt, speichere ich das erste Bild. Danach lädt automatisch das nächste Bild. Da alle Frames zu einer Serie gehören, kann ich Beschreibung und Geoposition übernehmen und die Bilder nacheinander speichern.

Sind alle Frames gespeichert und ist der Panoramax-Token vorhanden, kann ich den Upload starten. Die Bilder werden vorbereitet und anschließend zu Panoramax übertragen.

Damit ist der komplette Ablauf abgeschlossen: Bilder oder Video laden, Standort setzen, Beschreibung ergänzen, speichern und anschließend zu Panoramax hochladen. Danke fürs Zuschauen.


## Ergänzung: Höhe und Blickrichtung

Nach dem Setzen oder Verschieben des Standortmarkers versucht die App, die Höhe aus den Koordinaten zu ermitteln. Diese Höhe wird als GPS-Höhe in die EXIF-Daten geschrieben. Außerdem erscheint um den Standort ein Richtungskreis. Ein Klick auf diesen Kreis setzt einen Blickrichtungsmarker. Diese Richtung wird beim Speichern als GPSImgDirection übernommen.


## Ergänzung: Blickrichtung und Drehbereich

Bei normalen Einzelbildern wird nur ein Startpunkt für die Blickrichtung gesetzt. Ein zweiter Drehpunkt ist dort nicht nötig. Bei Video-Frames kann zusätzlich ein Drehende gesetzt werden. Dieser Drehbereich ist auf maximal 45° begrenzt. Wenn der zweite Klick weiter entfernt liegt, setzt die App ihn automatisch auf die 45°-Grenze zurück. Die Drehrichtung wird als roter Kreisbogen mit Pfeil angezeigt.


## Ergänzung: Höhe und Blickrichtung in den Metadaten

Die Metadaten-Anzeige zeigt nun auch die gespeicherte Höhe und die Blickrichtung an, sobald diese Werte in der Datei oder im aktuellen Eintrag vorhanden sind. Für Panoramax sind besonders GPSAltitude und GPSImgDirection wichtig.


## Änderung v0.1.75

Im HTML-Kopf wurde der Favicon-/App-Icon-Link ergänzt. Die Datei heißt `icon.svg`.


## Panoramax-Upload ab v0.1.76

Der Upload läuft nicht mehr über `panoramax_cli`, sondern direkt über die Panoramax-HTTP-API. GPS-Koordinaten und Aufnahmedatum werden zusätzlich als API-Override mitgesendet. Wenn Panoramax eine Datei ablehnt, gibt die App die Upload-Set-ID und die Diagnose von `/api/upload_sets/<id>/files` in der Browser-Konsole aus.


## Ergänzung v0.1.77: Blickrichtung bei Video-Frames

Der rote Pfeil am Kreisbogen zeigt nur die Drehrichtung an. Die einzelnen Bilder bekommen beim Übernehmen in das Foto Geo-Tool jeweils eine eigene Blickrichtung. Die App verteilt dafür 360° über die aktiven Bilder. Die Schrittweite wird als `360° / (aktive Bilder + 1)` berechnet. Ausgelassene Vorschaubilder werden dabei nicht mitgezählt.


## Korrektur ab v0.1.78

Beim Speichern eines Video-Frames wird nun die Blickrichtung aus dem jeweiligen Bilderlisten-Eintrag übernommen. Dadurch bleibt die 360°-Verteilung auch wirklich im EXIF-Feld `GPSImgDirection` jedes einzelnen Bildes erhalten. Vorher wurde beim Speichern versehentlich wieder die Startblickrichtung auf jedes Bild geschrieben.


## Ergänzung v0.1.79: Wechsel zu Panoramax

Nach erfolgreichem Upload wechselt das Foto Geo-Tool automatisch zu `https://panoramax.basi.re/your-pictures`. Dort wird angezeigt, dass die Fotos gesendet wurden und aktuell unkenntlich gemacht werden.


## Kartenanzeige ab v0.1.80

Wenn ein bereits gespeichertes Bild aus der unteren Liste geladen wird, wird kein roter Drehrichtungs-Pfeil mehr eingeblendet. Die Richtung ist bereits im Bild beziehungsweise im Eintrag gespeichert und wird in den Metadaten angezeigt. Der rote Drehrichtungsbogen erscheint nur beim aktiven Setzen/Bearbeiten einer Videodrehung und wird nun gestrichelt dargestellt.


## Optik ab v0.1.81

Die rote Pfeilspitze der Drehrichtung sitzt nun etwas innerhalb des gelben Richtungskreises. Dadurch wirkt der Pfeil sauberer mit dem gestrichelten roten Bogen verbunden und klebt nicht mehr außen auf dem Kreis.


## Korrektur ab v0.1.82

Die rote Pfeilspitze wird nun wieder näher am gestrichelten Drehrichtungsbogen berechnet. Außerdem springt der Arbeitsfluss nach dem erneuten Speichern eines bereits gespeicherten Bildes wieder zum nächsten unbearbeiteten Bild, sofern noch eines vorhanden ist. Zusätzlich übernimmt `saveImageToCache()` die individuelle Blickrichtung des aktuellen Bildes.


## Token-Eingabe ab v0.1.83

Das Panoramax-Token-Feld ist jetzt ein normales Textfeld und kein Passwortfeld mehr. Dadurch soll der Browser keinen Webseiten-Login vorschlagen. Beim Einfügen ist der Token kurz sichtbar. Nach dem Klick auf „Token merken“ wird das Feld durch Punkte ersetzt, ausgegraut und deaktiviert. Zum Ändern oder Entfernen muss zuerst „Löschen“ geklickt werden.


## Panoramax-Upload ab v0.1.84

Der Upload verwendet jetzt standardmäßig den EXIF-only-Modus. Die App schreibt GPS, Datum, Höhe und Blickrichtung in die JPEG-Datei. Beim Hochladen wird an Panoramax nur die Datei selbst gesendet. Dadurch wird vermieden, dass zusätzliche Multipart-Felder vom Server abgelehnt werden. Das Upload-Set wird erst nach erfolgreich angenommenen Dateien abgeschlossen.


## Pfeilposition ab v0.1.85

Die rote Pfeilspitze wird jetzt nicht mehr über einen Prozentwert des Radius berechnet. Stattdessen wird der Außenpunkt des Kreises in Leaflet-Pixelkoordinaten berechnet und exakt 3 Pixel Richtung Mittelpunkt verschoben. Dadurch sitzt der Pfeil bei jeder Zoomstufe sauber am gestrichelten roten Bogen.


## Pfeilspitze ab v0.1.86

Die rote Pfeilspitze wird jetzt nicht mehr als Unicode-Zeichen gezeichnet, sondern als exakt zentriertes SVG. Dadurch verschiebt sich der Pfeil beim Drehen nicht mehr durch Schriftart- oder Textmetrik-Unterschiede.


## Pfeilposition ab v0.1.87

Die zusätzliche 3-Pixel-Verschiebung nach innen wurde wieder entfernt. Da die Pfeilspitze nun als exakt zentriertes SVG gezeichnet wird, sitzt sie direkt am berechneten Ende des roten Kreisbogens.


## Panoramax-Weiterleitung ab v0.1.88

Nach erfolgreichem Datei-Transfer wird die Seite `https://panoramax.basi.re/your-pictures` jetzt immer geöffnet. Falls Panoramax den Abschluss des Upload-Sets nicht eindeutig bestätigt, zeigt das Foto Geo-Tool eine Warnung, wechselt aber trotzdem zur Panoramax-Seite. Der Abschluss wird serverseitig mit mehreren Varianten versucht.


## Ortsdaten ab v0.1.89

Die Ortssuche verwendet jetzt die neu erstellte vollständige Ortsdatei mit 16606 Datensätzen. Falls alte Ortsvorschläge angezeigt werden, bitte den Browser-Cache leeren oder die Seite hart neu laden.


## Panoramax-Upload ab v0.1.90

Die Bilder werden beim direkten API-Upload mit sicheren Dateinamen an Panoramax gesendet. Leerzeichen, Kommas, Umlaute und Sonderzeichen werden entfernt. Die Panoramax-Seite `/your-pictures` dient danach nur zur Kontrolle; dort bitte nicht noch einmal per Drag-and-Drop hochladen.


## Ortssuche ab v0.1.91

Kombinierte Eingaben wie `99947 W` funktionieren jetzt. Die Suche trennt PLZ und Ortsnamenanteile. Orte mit fehlenden eigenen Koordinaten werden trotzdem angezeigt; falls möglich, wird ersatzweise eine vorhandene Koordinate aus derselben PLZ verwendet und als PLZ-Koordinate markiert.
