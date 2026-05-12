# GitHub-Hinweise für Lutz

## Vor dem Hochladen prüfen

Nicht hochladen:

- persönliche Token
- Passwörter
- echte private Fotos, wenn sie nicht öffentlich sein sollen
- lokale `.env` oder `panoramax_config.local.php`

## Empfohlene GitHub-Reihenfolge

```bash
git init
git add .
git commit -m "Initial commit Foto Geo-Tool v0.1.91"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/foto-geo-tool.git
git push -u origin main
```

## Danach Antoine schicken

Link zum Repository und Hinweis:

```text
The repository contains the current Foto Geo-Tool code and the Panoramax upload PHP script.
The main debugging note is in docs/PANORAMAX_UPLOAD_DEBUG.md.
```
