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

The ZIP is made from the last commit, so commit first.

```
git archive --format=zip -o scrambly-playable.zip HEAD index.html src assets README.md NOTES.md
```

`index.html` ends up at the ZIP root. The limit is 5,000,000 bytes; the build is about 0.2 MB.

## Tested browsers and devices

| Browser / device | Real or emulated | What was checked |
|---|---|---|
| TODO | TODO | TODO |

Checklist used: 320x568 and 390x844 portrait, drag / release / cancel with mouse and touch, rotate prompt, hidden tab and return, win, loss, CTA click, 5 restarts in a row, Network tab (local requests only), mute.

## Known limitations

- Portrait only. A phone held sideways gets a rotate prompt and the game pauses. A desktop window shows the same portrait game, letterboxed.
- Needs a recent browser: ES modules, top-level `await` and `CanvasRenderingContext2D.roundRect` (Safari 16+, Chrome 99+, Firefox 112+).
- Drops are random, so the session length varies and a loss is possible. Both end screens (win and loss) show the CTA.
- The jar is drawn with rounded bottom corners, but the physics floor is square: a small ball in a corner can overlap the rim by a few pixels.
- The squash on impact is visual only; the physics shapes stay perfect circles.
- Sound: the mute choice is not saved between page loads. On an iPhone the hardware silent switch also mutes the game. If the pop sample fails to load, merges are silent and the game still works.
- No reduced-motion setting.

## Untested behavior

TODO: remove the lines that were tested.

- Android phones and Firefox.
- Sound on a real iPhone (silent switch on and off, return from background).
- Safe areas on a real notched phone.
- Frame rate on low-end phones.
- Very long sessions (several minutes without a win or a loss).

## Credits

- **Fox artwork** — `assets/scrambly-fox-reference.webp`, supplied in the Scrambly assessment kit (Simula advertiser materials).
- **Matter.js 0.20.0** — physics engine by Liam Brummitt, MIT License. Vendored in `src/lib/matter.min.js`. https://brm.io/matter-js/
- **Fredoka** — font by The Fredoka Project Authors, SIL Open Font License 1.1. Latin subset in `assets/fonts/Fredoka-latin.woff2`, license in `assets/fonts/OFL.txt`.
- **Merge pop sound** — `assets/audio/bubble-pop.mp3`, "Bubble Pop 06" by Universfield, from Pixabay (Pixabay Content License). TODO: confirm the title and license on the download page.
- All other art is drawn in code (Canvas 2D). All other sounds are synthesized in code (Web Audio API).
