# CLAUDE.md — Scrambly Playable (Simula Ad take-home)

Read this file fully before doing anything. Also read `BRIEF.md` (original assessment) and `IDEAS.md` (concept, decisions, plan T0-T8).

## How we work

I (the developer) drive. You assist. I will read and review every diff, and I must be able to explain every line in a 5-minute walkthrough.

1. **Plan first.** Before writing code for a task, give a short plan (files to touch, approach, risks) and wait for my approval.
2. **One task at a time.** Follow T0-T8 from `IDEAS.md` in order. When a task is done, stop, summarize in 2-3 lines, and wait for me to test and review.
3. **Small, separate files.** No monolith. Keep each file focused and under ~250 lines when possible.
4. **Readable code.** Clear names, short functions, comments only where the intent is not obvious. No clever tricks I cannot explain.
5. **No scope creep.** Do not add features, libraries, or refactors I did not ask for. If you think something is worth adding, propose it and wait.
6. **Ask, don't assume.** If something in the brief or my request is ambiguous, ask one short question.
7. **Be honest about uncertainty.** If you did not test something, say so. Do not claim it works.
8. **Commits.** After I approve a task, suggest a commit message (`feat:`, `fix:`, `chore:`). Do not commit unless I ask.
9. **Process notes.** When I reject or correct one of your outputs, remind me to log it in `NOTES.md` (what you proposed, what I changed, why).

## Project

A portrait, mobile-first merge playable (Suika-style) for **Scrambly**, a rewards platform: Discover games/apps → Play and progress → Redeem rewards. The merge chain maps to those 3 stages. Full concept in `IDEAS.md`.

## Tech decisions (fixed)

- Plain JavaScript (ES modules) + Canvas 2D. No build step, no bundler, no framework.
- **Matter.js** for physics, vendored in `src/lib/` (no CDN).
- Pointer Events for input (mouse + touch).
- **No audio.** Do not add sound or a mute control.
- Art: the fox from the Scrambly kit in `assets/`, plus simple icons drawn in code. No real brand logos.
- Logical resolution **360×640**, scaled to fit with letterbox. Game logic and physics always use logical coordinates.
- Palette: orange `#F58324`, purple `#7845D8`, deep ink `#201338`, warm white `#FFF6E8`.

## Suggested structure

```
index.html
src/
  main.js        entry, wiring
  config.js      constants (sizes, levels, colors, timings)
  state.js       game state machine (playing / won / lost / paused)
  physics.js     Matter engine, bodies, collisions, merge
  input.js       pointer handling
  render.js      canvas drawing
  ui.js          HUD, milestones, end screen, CTA, overlays
  lib/matter.min.js
assets/
BRIEF.md  IDEAS.md  NOTES.md  README.md  CLAUDE.md
```

## Hard requirements (from the brief)

**Build and delivery**
- Production ZIP with `index.html` at the ZIP root, at most **5,000,000 bytes**.
- ZIP includes readable source, libraries, assets, run instructions, and asset/tool credits.
- Runs from a simple static HTTP server with **no external requests**, no login, no backend, no API keys. Everything (fonts, libs, assets) is local.

**Layout and input**
- Works with touch and mouse.
- Test sizes: portrait **320×568** and **390×844** CSS px.
- Landscape: show a clear "rotate your device" overlay and pause gameplay.
- Prevent page scroll, bounce, and zoom from competing with gameplay: `touch-action: none`, `overflow: hidden`, `position: fixed` stage, `viewport-fit=cover`, `preventDefault` on gesture events where needed.
- Convert pointer coordinates to logical game coordinates (account for canvas scale).
- Respect safe areas (`env(safe-area-inset-*)`) for UI near the notch.

**CTA**
- End with a clearly labeled button inviting the player to explore Scrambly.
- On explicit click: `console.log` the click and show a local confirmation like "CTA clicked — demo only". **Never navigate away.**

**Restart**
- A review-friendly restart is always reachable.
- `reset()` must tear down and rebuild cleanly: no duplicate timers, listeners, RAF loops, or effects. Register listeners through one `AbortController` (or one registry) so they can all be removed. Verify with 5 restarts in a row.

**Visibility**
- Pause gameplay and all clocks when the page is hidden (`visibilitychange` and `pagehide`). Resume without time jumps (clamp delta time, do not accumulate hidden time).

**Reliability**
- Handle `resize` and `orientationchange`.
- Handle interrupted input: `pointercancel`, `lostpointercapture`, window `blur` mid-drag. Release the held item safely.
- Handle every outcome the design uses: win, loss (stack over the danger line), restart.
- Guard against double merges in the same frame.

**Content and claims**
- Any balance shown is a **demo** and must be labeled as such ("Demo balance").
- No guaranteed-income claims, no real payout claims, no exact reward amounts or withdrawal rules.
- Audience is adults who enjoy casual mobile games. Tone: warm, expressive, approachable.

## Gameplay rules (summary)

- Drop an item from the top at the pointer's X. Cooldown between drops. Show the next item.
- Two items of the same level that touch merge into the next level at their midpoint. Max level does not merge.
- 8 levels; only levels 1-4 are dropped. Milestones at levels 3, 6, 8 → Discover, Play, Redeem. Demo balance rises at each milestone.
- Danger line: an item resting above it for ~2s triggers the loss state.
- Early drops are biased toward easy combos so the player reaches the CTA reliably.
- Target session: 60-90 seconds.
- The fox mascot reacts: idle, cheer on merge, nervous when the stack is high.

## Testing checklist (use before every handoff)

- [ ] 320×568 and 390×844 portrait in DevTools; real iPhone 16 for one pass
- [ ] Drag, release, and cancel mid-drag with mouse and touch
- [ ] Rotate / landscape overlay
- [ ] Hide tab mid-play and return: no time jump, no stuck state
- [ ] Win path, loss path, CTA click (console log + local message, no navigation)
- [ ] 5 restarts in a row: no growth in listeners/timers (check in DevTools)
- [ ] No network requests in the Network tab (all local)
- [ ] ZIP size under 5 MB; `index.html` at ZIP root; opens from a fresh folder via static server

## Documentation to keep updated

- `README.md`: how to run, how to build the ZIP, browsers/devices tested (mark **real** vs **emulated**), known limitations, untested behavior, credits.
- `NOTES.md`: tools and assets used, what I contributed, and at least one decision, correction, or rejected AI output that improved the result.

## Stage 2 (later, if invited)

Keep Stage 1 unchanged. Tag it (`v1-stage1`). Make revisions as a new version or Git tag, within the existing playable (no new game, no engine change).
