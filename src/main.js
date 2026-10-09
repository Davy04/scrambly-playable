import { MAX_DT, DANGER_TIME, MILESTONES, FOX } from './config.js';
import { fitCanvas, draw } from './render.js';
import { createPointer } from './input.js';
import { createWorld } from './physics.js';
import { createEffects } from './effects.js';
import { createFox } from './ui.js';
import {
  createState, updateDrop, updateRules, recordMerges, isHolding, aimX, milestonesReached, demoBalance,
  isStackHigh, hasDropped,
} from './state.js';

const stage = document.getElementById('stage');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Every event listener is registered with this signal, so one abort() removes them all.
const listeners = new AbortController();
const pointer = createPointer(canvas, listeners.signal);

// Fires on window resize, rotation and when the mobile browser bars show or hide.
// contentRect is the stage minus its safe-area padding.
const stageObserver = new ResizeObserver(([entry]) => {
  fitCanvas(canvas, entry.contentRect.width, entry.contentRect.height);
});
stageObserver.observe(stage);

const foxImage = new Image();
foxImage.src = 'assets/scrambly-fox-reference.webp';

const world = createWorld();
const state = createState();
const effects = createEffects();
const fox = createFox(foxImage);

// Feedback for the merges of this frame: the merge effect, a fox hop,
// and a bigger hop with the step name when a milestone is reached.
function reactToMerges(merges) {
  if (merges.length === 0) return;

  const reachedBefore = milestonesReached(state);
  recordMerges(state, merges);
  const reachedNow = milestonesReached(state);

  let chain = 1;
  for (const merge of merges) {
    chain = effects.merge(merge);
  }
  if (reachedNow > reachedBefore) {
    const last = merges[merges.length - 1];
    effects.floatText(last.x, last.y - 24, `${MILESTONES[reachedNow - 1].label}!`, 26);
    fox.hop(FOX.hopBig);
  } else {
    fox.hop(FOX.hopSmall + chain * 2); // chained merges get a slightly higher hop
  }
}

let lastTime = performance.now();

function frame(now) {
  // Clamped so a slow frame or a return from a hidden tab never simulates a big jump.
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;

  updateDrop(state, pointer, world, dt);
  const { merges, impacts } = world.step(dt);
  reactToMerges(merges);
  for (const impact of impacts) effects.impact(impact);
  updateRules(state, world, dt);
  effects.update(dt);
  fox.update(dt, state.status === 'playing' && isStackHigh(world));

  draw(ctx, {
    balls: world.balls(),
    heldLevel: isHolding(state) ? state.heldLevel : null,
    heldX: aimX(state, pointer.x),
    nextLevel: state.nextLevel,
    status: state.status,
    dangerProgress: state.dangerTime / DANGER_TIME,
    milestonesReached: milestonesReached(state),
    balance: demoBalance(state),
    showHint: !hasDropped(state),
    fox,
    effects,
  });
  requestAnimationFrame(frame);
}

// Wait for the font so the first frame does not draw text in a fallback font. The game starts even if it fails.
await document.fonts.load('600 14px Fredoka').catch(() => {});
lastTime = performance.now();
requestAnimationFrame(frame);
