# Scrambly Merge — playable demo

A portrait, mobile-first merge playable (Suika-style) for Scrambly. Take-home for Simula Ad.

## Run

Needs any static HTTP server (ES modules do not load from `file://`).

```
python -m http.server 8000
```

Then open `http://localhost:8000/`. To test on a phone, use the computer's LAN address on the same Wi-Fi.

No build step, no external requests, no backend.

## Build the ZIP

TODO (T8).

## Tested browsers and devices

TODO (T8). Each entry marked **real** or **emulated**.

## Known limitations

TODO (T8).

## Untested behavior

TODO (T8).

## Credits

- **Fox artwork** — `assets/scrambly-fox-reference.webp`, supplied in the Scrambly assessment kit (Simula advertiser materials).
- **Matter.js 0.20.0** — physics engine by Liam Brummitt, MIT License. Vendored in `src/lib/matter.min.js`. https://brm.io/matter-js/
- **Fredoka** — font by The Fredoka Project Authors, SIL Open Font License 1.1. Latin subset in `assets/fonts/Fredoka-latin.woff2`, license in `assets/fonts/OFL.txt`.
- All other art is drawn in code (Canvas 2D).
