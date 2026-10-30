# Medex — homepage redesign (V2)

Static concept for a redesigned medex.si homepage: hero slider, best-sellers, product lines, "Why choose Medex?", honey LOT check, brand film, hive explorer and newsletter. Slovenian is the default language, with an EN toggle.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `index.html`, `styles.css`, `app.js` — page, styles, interactions
- `i18n.js` — Slovenian copy (English lives in `index.html`)
- `assets/real/` — photos and packshots from medex.si (see `assets/real/README.txt`)
- `assets/` — a few generated images (lab, newsletter mascot, honeycomb, meadow)

Prices, the LOT analysis and some copy are placeholders for the concept.
