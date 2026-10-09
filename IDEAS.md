# Scrambly Playable — Initial Ideas

Take-home for the Game Developer role at Simula Ad (via Amplify).
Time box: 4h build. Portrait mobile web playable, no backend, no external requests.

## Concept

A Suika-style merge game. The player drops items from the top, they fall with physics, and two identical items that touch merge into the next one in the chain.

The merge chain mirrors the Scrambly product flow:

| Stage | Chain levels | Meaning |
|-------|--------------|---------|
| Discover | 1-2 | Generic game icons (dice, puzzle piece) |
| Play | 3-4 | Progress icons (cards, gamepad) |
| Redeem | 5-6 | Reward icons (trophy, gift / Scrambly coin) |

- A top bar shows 3 milestones: **Discover → Play → Redeem**.
- A **demo balance** rises at each milestone. It is always labeled "demo" and never shown as real money.
- The **fox** from the kit is the mascot at the top: idle, cheers on merge, gets nervous when the stack is high.
- Ending: after reaching the last milestone, a "You redeemed!" screen with the CTA **"Explore Scrambly"**.
- Loss (stack crosses the danger line): "Try again" plus the CTA with current progress.

## Reference

Suika Game / Watermelon Game style: round items, cute faces, a danger line, a "next item" preview, and a progress strip showing the chain.

## Decisions

- Orientation: **portrait** (logical size 360×640, letterboxed to fit any screen).
- Stack: **plain JS + Canvas 2D**, **Matter.js** (bundled locally) for physics.
- Input: Pointer Events (mouse + touch).
- Audio: **none** (optional in the brief; skipped to save time and avoid mute/visibility complexity).
- Art: the supplied fox plus simple icons drawn in code. No real brand logos.
- Palette: orange `#F58324`, purple `#7845D8`, deep ink `#201338`, warm white `#FFF6E8`.
- Target play time: 60-90 seconds.
- Chain length: 6 levels.

## Brief checklist

- [ ] `index.html` at the ZIP root, ZIP ≤ 5,000,000 bytes
- [ ] Runs from a static HTTP server, no external requests
- [ ] Touch + mouse, tested at 320×568 and 390×844, no page scroll
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
| T5 Scrambly link | 2:10-2:50 | Chain icons, milestones, demo balance, fox, onboarding hint |
| T6 CTA + restart | 2:50-3:15 | End screen, CTA, clean reset |
| T7 Robustness | 3:15-3:40 | Visibility, resize, rotate prompt, pointer cancel |
| T8 Delivery | 3:40-4:00 | Tests, README, NOTES, ZIP |

If time runs short, cut in this order: particles, extra fox animations, levels 7+, elaborate loss screen.
Never cut: restart, visibility handling, the "demo" label.

## Risks

- Physics feel (gravity, friction, bounce): reserve ~20-40 min for tuning.
- Double merges in the same frame: use a `merged` flag per body.
- Players failing before reaching the CTA: easier early drops and a CTA on the loss screen.
- Listener/timer leaks on restart: one `reset()` that tears down and rebuilds everything.

## Edge case for the walkthrough

Hidden tab: the loop and clocks pause, then resume with no time jump.

## Deliverables

1. Production ZIP (runnable build, readable source, run instructions)
2. Full production-process screen recording (shows how AI was used)
3. 5-minute walkthrough (core loop, progression/ending, CTA, restart, one edge case, decisions, time, tools, testing, limitations)

## Open questions

- What poses/files does the fox kit include?
- Real device for testing?
