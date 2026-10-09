# Process notes

## Tools and assets used

- Claude Code (AI pair programmer): plans, first drafts of code, reviewed and corrected by me.
- Matter.js 0.20.0 (physics), Fredoka font, the supplied Scrambly fox. See credits in `README.md`.

## What I contributed

TODO

## Decisions, corrections and rejected AI outputs

| Task | What the AI proposed | What I changed | Why |
|------|----------------------|----------------|-----|
| T0/T1 plan | Inline CSS in `index.html` (one file fewer) | Separate `src/style.css` | Easier to maintain |
| T0/T1 plan | A rule deciding when a desktop window shows the rotate overlay | Game is mobile-only; desktop just gets a bordered letterbox | Simpler, fits the 4h time box |
| T1 input | Pointer mapping with no limits: dragging outside the canvas gave coordinates below 0 or above 360/640 | Found it while testing a drag past the border; coordinates are now clamped to the logical area in `toLogical()` | Pointer capture (needed to detect a release outside the canvas) keeps sending events from outside, so the game must never receive an off-screen position |
