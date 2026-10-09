import { MAX_DT } from './config.js';
import { fitCanvas, draw } from './render.js';
import { createPointer } from './input.js';
import { createWorld } from './physics.js';
import { createState, updateDrop, isHolding, aimX } from './state.js';

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

const world = createWorld();
const state = createState();

let lastTime = performance.now();

function frame(now) {
  // Clamped so a slow frame or a return from a hidden tab never simulates a big jump.
  const dt = Math.min((now - lastTime) / 1000, MAX_DT);
  lastTime = now;

  updateDrop(state, pointer, world, dt);
  world.step(dt);

  draw(ctx, {
    balls: world.balls(),
    heldLevel: isHolding(state) ? state.heldLevel : null,
    heldX: aimX(state, pointer.x),
    nextLevel: state.nextLevel,
  });
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
