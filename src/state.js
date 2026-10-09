import { PLAY_AREA, LEVELS, MAX_DROP_LEVEL, DROP_COOLDOWN, DROP_Y } from './config.js';

function randomDropLevel() {
  return 1 + Math.floor(Math.random() * MAX_DROP_LEVEL);
}

export function createState() {
  return {
    heldLevel: randomDropLevel(),
    nextLevel: randomDropLevel(),
    cooldown: 0, // seconds left until a ball is in hand again
  };
}

export function isHolding(state) {
  return state.cooldown <= 0;
}

// Where the held ball sits: the pointer X, kept between the walls by the ball's radius.
export function aimX(state, pointerX) {
  const radius = LEVELS[state.heldLevel - 1].radius;
  const min = PLAY_AREA.x + radius;
  const max = PLAY_AREA.x + PLAY_AREA.w - radius;
  return Math.min(Math.max(pointerX, min), max);
}

// Runs once per frame: counts the cooldown down and drops the held ball when the player lets go.
export function updateDrop(state, pointer, world, dt) {
  // Read and clear the flag every frame, so a release during the cooldown is not remembered.
  const released = pointer.released;
  pointer.released = false;

  if (!isHolding(state)) {
    state.cooldown -= dt;
    return;
  }
  if (!released) return;

  world.addBall(state.heldLevel, aimX(state, pointer.x), DROP_Y);
  state.heldLevel = state.nextLevel;
  state.nextLevel = randomDropLevel();
  state.cooldown = DROP_COOLDOWN;
}
