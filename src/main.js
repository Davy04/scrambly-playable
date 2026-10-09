import { MAX_DT, DANGER_TIME, MILESTONES, FOX, ROTATE_QUERY } from './config.js';
import { fitCanvas, draw } from './render.js';
import { createPointer } from './input.js';
import { createWorld } from './physics.js';
import { createEffects } from './effects.js';
import { createFox, createEndScreen } from './ui.js';
import {
  createState, updateDrop, updateRules, recordMerges, isHolding, aimX, milestonesReached, demoBalance,
  isStackHigh, hasDropped, isEndScreenDue,
} from './state.js';

const stage = document.getElementById('stage');
const frame = document.getElementById('frame');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Every event listener is registered with this signal, so one abort() removes them all.
const listeners = new AbortController();
const pointer = createPointer(canvas, listeners.signal);

// Fires on window resize, rotation and when the mobile browser bars show or hide.
// contentRect is the stage minus its safe-area padding.
const stageObserver = new ResizeObserver(([entry]) => {
  fitCanvas(frame, canvas, entry.contentRect.width, entry.contentRect.height);
});
stageObserver.observe(stage);

const foxImage = new Image();
foxImage.src = 'assets/scrambly-fox-reference.webp';

// Everything that belongs to one play session. reset() throws these away and builds new ones.
let world;
let state;
let effects;
let fox;

function startGame() {
  world = createWorld();
  state = createState();
  effects = createEffects();
  fox = createFox(foxImage);
}

// Restart. The game loop, the listeners and the resize observer are created once at page load and are
// not touched here, so restarting any number of times cannot duplicate them.
function reset() {
  const oldBalls = world.balls();
  world.destroy();
  startGame();
  effects.dissolve(oldBalls); // the new game's effects play the old balls out
  pointer.down = false;
  pointer.released = false;
  endScreen.hide();
}

const endScreen = createEndScreen(listeners.signal, {
  onRestart: reset,
  onCta: () => console.log('CTA clicked — demo only', { status: state.status, demoBalance: demoBalance(state) }),
});

startGame();

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

// Pause. The game stops while the page is hidden or while a phone is held sideways.
const rotatePrompt = document.getElementById('rotate');
const phoneSideways = window.matchMedia(ROTATE_QUERY);
let pageHidden = document.hidden;
let paused = false;

function updatePause() {
  rotatePrompt.hidden = !phoneSideways.matches;
  paused = pageHidden || phoneSideways.matches;
  if (paused) {
    // Forget any press in progress, so nothing drops by itself when the game comes back.
    pointer.down = false;
    pointer.released = false;
  }
}

function setPageHidden(hidden) {
  pageHidden = hidden;
  updatePause();
}

document.addEventListener('visibilitychange', () => setPageHidden(document.hidden), { signal: listeners.signal });
window.addEventListener('pagehide', () => setPageHidden(true), { signal: listeners.signal });
window.addEventListener('pageshow', () => setPageHidden(document.hidden), { signal: listeners.signal });
phoneSideways.addEventListener('change', updatePause, { signal: listeners.signal });
updatePause();

let lastTime = performance.now();

function tick(now) {
  // Clamped so a slow frame or a return from a hidden tab never simulates a big jump.
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now; // also updated while paused, so no paused time is ever simulated later

  if (paused) {
    requestAnimationFrame(tick);
    return;
  }

  updateDrop(state, pointer, world, dt);
  const { merges, impacts } = world.step(dt);
  reactToMerges(merges);
  for (const impact of impacts) effects.impact(impact);
  updateRules(state, world, dt);
  effects.update(dt);
  fox.update(dt, state.status === 'playing' && isStackHigh(world));
  if (isEndScreenDue(state)) endScreen.show(state.status, demoBalance(state));

  draw(ctx, {
    balls: world.balls(),
    heldLevel: isHolding(state) ? state.heldLevel : null,
    heldX: aimX(state, pointer.x),
    nextLevel: state.nextLevel,
    dangerProgress: state.dangerTime / DANGER_TIME,
    milestonesReached: milestonesReached(state),
    balance: demoBalance(state),
    showHint: !hasDropped(state),
    fox,
    effects,
  });
  requestAnimationFrame(tick);
}

// Wait for the font so the first frame does not draw text in a fallback font. The game starts even if it fails.
await document.fonts.load('600 14px Fredoka').catch(() => {});
lastTime = performance.now();
requestAnimationFrame(tick);
