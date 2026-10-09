# Process notes

## Tools and assets used

- Claude Code (AI pair programmer): plans, first drafts of code, reviewed and corrected by me.
- Matter.js 0.20.0 (physics), Fredoka font, the supplied Scrambly fox, one pop sound and one music loop I picked. See credits in `README.md`.
- Web Audio API for the other sounds (synthesized in code, no files).

## What I contributed

TODO

## Decisions, corrections and rejected AI outputs

| Task | What the AI proposed | What I changed | Why |
|------|----------------------|----------------|-----|
| T0/T1 plan | Inline CSS in `index.html` (one file fewer) | Separate `src/style.css` | Easier to maintain |
| T0/T1 plan | A rule deciding when a desktop window shows the rotate overlay | Game is mobile-only; desktop just gets a bordered letterbox | Simpler, fits the 4h time box |
| T1 input | Pointer mapping with no limits: dragging outside the canvas gave coordinates below 0 or above 360/640 | Found it while testing a drag past the border; coordinates are now clamped to the logical area in `toLogical()` | Pointer capture (needed to detect a release outside the canvas) keeps sending events from outside, so the game must never receive an off-screen position |
| Polish: comments | Dense comments on almost every function and constant | Asked for most of them to be removed; 190 comment lines became 71, keeping only the ones that explain a non-obvious reason | I must be able to read and explain every line in the walkthrough |
| Polish: danger line | The red warning was tied directly to the loss timer | It flashed on every drop; I caught it while playing and asked for it to show only when really needed. Added `DANGER_GRACE` (0.3 s) | A ball that was just dropped is slow and high for a few frames, which is not real danger |
| Polish: demo balance | The balance pill was checked only with a balance of 0 | I asked to check it with a high balance: at 250 and 500 the number touched the label. Pill widened, label made smaller | The last milestone is the screen the player sees right before the CTA |
| Polish: physics | Friction 0.1 and Matter's default static friction (0.5) | I found the balls sticky and asked for a more fluid feel. Friction is now 0.02, static friction 0, and the impact squash is stronger | Sliding balls settle into gaps, which makes merges feel better |
| Polish: mechanics | A list of seven possible mechanics, recommending a reward ball per step plus swap | I chose swap, shake and a combo bonus instead | I wanted more to do on every drop, with rules a player understands in seconds |
| Polish: restart safety | While adding the buttons, an edit script put the listener setup inside `reset()` | The AI caught it when re-reading its own diff and moved it back before testing | It would have added duplicate listeners on every restart, which the brief forbids |
| Bug: game sometimes blank on reload | The AI could not reproduce it and blamed the browser cache mixing old and new files; it even added a README note | I captured the console error (`hud.js`, reading `label`). Real cause: the first frame could have a negative delta time, which made the step banner draw with no step reached. Delta time is now clamped to zero or more, and the README note was removed | A guess without a reproduction is not a diagnosis; the console error was |
| Polish: audio | First decision (mine, in the plan): no audio, to save time | Reversed it in the final polish and supplied my own pop sample and, later, a music track. The AI added the other sounds in code, plus mute and silence while hidden. When mute seemed not to work on the music, the cause was a second copy of the game playing in the AI's hidden test tab | Sound adds a lot of feel; the brief only asks for mute and visibility handling when audio is used |
