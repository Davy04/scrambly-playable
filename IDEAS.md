# Scrambly Playable — Initial Ideas

Take-home for the Game Developer role at Simula Ad (via Amplify).
Time box: 4h build. Portrait mobile web playable, no backend, no external requests.

## Concept

A Suika-style merge game. The player drops balls from the top, they fall with physics, and two identical balls that touch merge into the next one in the chain.

The merge chain mirrors the Scrambly product flow. Every item is naturally round, so the visuals match the circle colliders.

| Level | Item | Look | Radius (px) | Stage |
|-------|------|------|-------------|-------|
| 1 | Golf ball | White with dimples | 17 | Discover |
| 2 | Billiard ball | Purple with a white circle | 23 | Discover |
| 3 | Tennis ball | Lime green with white curves | 29 | Discover (milestone 1) |
| 4 | Bowling ball | Dark blue with three holes | 36 | Play |
| 5 | Soccer ball | White with dark pentagons | 43 | Play |
| 6 | Basketball | Orange with dark lines | 51 | Play (milestone 2) |
| 7 | Arcade token | Purple `#7845D8` with a star | 60 | Redeem |
| 8 | Scrambly-style coin | Gold-orange, shiny, own drawing | 70 | Redeem (milestone 3) |

Radii are for a 300 px wide play area. Only levels 1-4 are dropped (half the chain, like Suika).

Balance change after T4: the first version (6 levels, drops 1-3) was won in about 20 s by tapping fast. The chain went to 8 levels with larger balls so the box fills up and the player has to choose where to drop. Radii and the drop range were picked with a headless simulation of two simple players (random taps vs aiming at a matching ball).

- A top bar shows 3 milestones: **Discover → Play → Redeem** (reached at levels 3, 6, 8).
- A **demo balance** rises at each milestone. It is always labeled "demo" and never shown as real money.
- The **fox** from the kit is the mascot above the play area. It is a single static image, so all reactions are done in code (jump, squash/stretch, shake).
- Ending: after reaching the last milestone, a "You redeemed!" screen with the CTA **"Explore Scrambly"**.
- Loss (stack crosses the danger line): "Try again" plus the CTA with current progress.

## Reference

Suika Game / Watermelon Game style: round cute items, a danger line, a "next item" preview, and a progress strip showing the chain. Used for inspiration only; no third-party art is reused.

## Art direction: soft toy look

Everything is drawn in Canvas 2D, no external art except the fox.

- **Balls:** radial gradient (light top-left, darker edge), curved white highlight on top, soft shadow underneath, thin outline in a darker tone of the same color. Details (lines, circles, star) drawn with arcs and paths.
- **Faces:** closed smiling eyes (like the fox) on levels 4-6 first, then more levels if time allows. Occasional blink. Optional.
- **Background:** gradient from deep ink `#201338` to purple `#7845D8`.
- **Play area:** rounded panel in translucent warm white `#FFF6E8`; dashed orange danger line.
- **Orange `#F58324`:** reserved for actions and rewards (CTA, coins, milestones).
- **Coin:** own drawing (gold-orange with a star). Do not copy the exact coin symbol from the fox image.
- **Font:** rounded, bold font (Fredoka, OFL license), bundled locally as woff2 and credited in README. No Google Fonts link.
- **Fox:** `scrambly-fox-reference.webp` (294 x 320, supplied in the kit). Show it at about 110 logical px max. Check transparency so no box appears around it.
- **Feedback:** "pop" scale on merge, small coin particles, floating "+", fox jump on milestones, fox shake and sweat drop when the stack is high.
- **Layout (360x640):** top bar with milestones and demo balance; fox above the play area with the next ball beside it; play area in the center; small restart button at the bottom.

## Supplied kit

- `scrambly-fox-reference.webp` — mascot artwork, 294 x 320 px. Raster only, no rigged model.
- `working-palette.json` — suggested colors (not an official brand standard).
- Official product reference: https://scrambly.io/ (reviewed Sept 15, 2026). Not used at runtime.
- Credits needed for any extra material sourced (fonts, libraries).

## Decisions

- Orientation: **portrait** (logical size 360x640, letterboxed to fit any screen).
- Stack: **plain JS + Canvas 2D**, **Matter.js** (bundled locally) for physics.
- Input: Pointer Events (mouse + touch).
- Audio: **none** (optional in the brief; skipped to save time and avoid mute/visibility complexity).
- Art: soft toy look, generic sports/arcade balls, no real brand logos or league marks.
- Palette: orange `#F58324`, purple `#7845D8`, deep ink `#201338`, warm white `#FFF6E8`.
- Target play time: 60-90 seconds.
- Chain length: 8 levels.
- Desktop: the game is mobile-only. On a wide window it stays the same portrait game, letterboxed with a visible border around the play surface. No desktop layout.
- Rotate prompt: only for a phone held in landscape (landscape and short height), never for a desktop window.
- CSS lives in `src/style.css` (not inline), for easier maintenance.
- Test devices: DevTools emulation for 320x568 and 390x844; iPhone 16 (real) if available, or whatever the company provides.

## Brief checklist

- [ ] `index.html` at the ZIP root, ZIP <= 5,000,000 bytes
- [ ] Runs from a static HTTP server, no external requests
- [ ] Touch + mouse, tested at 320x568 and 390x844, no page scroll
- [ ] Landscape: rotate prompt
- [ ] CTA click: console log + local "CTA clicked — demo only", no navigation
- [ ] Clean restart (no duplicate timers/listeners/effects)
- [ ] Pause on hidden page, resume without time jump
- [ ] Handles resize and interrupted input (`pointercancel`, focus loss)
- [ ] Demo balance clearly labeled, no income or payout claims
- [ ] README: run instructions, browsers/devices tested (real vs emulated), limitations, untested behavior
- [ ] Credits for tools and assets
- [ ] NOTES.md: what was used, what I contributed, one rejected/corrected AI output

## Plan

| Task | Time | Goal |
|------|------|------|
| T0 Setup | 0:00-0:15 | Repo, structure, Matter.js, fox asset, recording |
| T1 Layout | 0:15-0:40 | Canvas fit, pointer input, game loop |
| T2 Physics + drop | 0:40-1:20 | Engine, walls, drop, next preview, tuning |
| T3 Merge | 1:20-1:50 | Collision merge, no double merge, pop animation |
| T4 End rules | 1:50-2:10 | Danger line, game states, easier early drops |
| T5 Scrambly link | 2:10-2:50 | Ball art, milestones, demo balance, fox, onboarding hint |
| T6 CTA + restart | 2:50-3:15 | End screen, CTA, clean reset |
| T7 Robustness | 3:15-3:40 | Visibility, resize, rotate prompt, pointer cancel |
| T8 Delivery | 3:40-4:00 | Tests, README, NOTES, ZIP |

If time runs short, cut in this order: particles, faces and blinking, extra fox animations, levels 7+, elaborate loss screen.
Never cut: restart, visibility handling, the "demo" label.

## Risks

- Physics feel (gravity, friction, bounce): reserve ~20-40 min for tuning.
- Double merges in the same frame: use a `merged` flag per body.
- Players failing before reaching the CTA: easier early drops and a CTA on the loss screen.
- Listener/timer leaks on restart: one `reset()` that tears down and rebuilds everything.
- Small balls (level 1, radius 16) must be distinguishable from level 2 at a glance. Test while playing.
- Fox image is small (294x320): do not scale it up past ~110 logical px.

## Edge case for the walkthrough

Hidden tab: the loop and clocks pause, then resume with no time jump.

## Deliverables

1. Production ZIP (runnable build, readable source, run instructions)
2. Full production-process screen recording (shows how AI was used)
3. 5-minute walkthrough (core loop, progression/ending, CTA, restart, one edge case, decisions, time, tools, testing, limitations)

## Open questions

- Real device for testing (own iPhone 16, or what the company provides).
