import {
  PLAY_AREA, LEVELS, MAX_DROP_LEVEL, DROP_COOLDOWN, DROP_Y,
  EASY_DROPS, EASY_MAX_LEVEL, WIN_LEVEL, DANGER_Y, DANGER_TIME, REST_SPEED, NERVOUS_MARGIN, MILESTONES,
  END_DELAY, COMBO, SHAKE,
} from './config.js';

function dealLevel(state) {
  const maxLevel = state.dealt < EASY_DROPS ? EASY_MAX_LEVEL : MAX_DROP_LEVEL;
  state.dealt += 1;
  return 1 + Math.floor(Math.random() * maxLevel);
}

export function createState() {
  const state = {
    status: 'playing', // 'playing' | 'won' | 'lost'
    dealt: 0,
    cooldown: 0,
    dangerTime: 0,
    bestMergedLevel: 0,
    endTime: 0,
    chain: 0, // merges in the current combo
    sinceMerge: Infinity, // seconds since the last merge
    bonus: 0, // demo balance earned from combos
    shakes: SHAKE.start,
  };
  state.heldLevel = dealLevel(state);
  state.nextLevel = dealLevel(state);
  return state;
}

export function isHolding(state) {
  return state.status === 'playing' && state.cooldown <= 0;
}

export function aimX(state, pointerX) {
  const radius = LEVELS[state.heldLevel - 1].radius;
  const min = PLAY_AREA.x + radius;
  const max = PLAY_AREA.x + PLAY_AREA.w - radius;
  return Math.min(Math.max(pointerX, min), max);
}

// Swaps the ball in hand with the next one. Returns false when the game is over.
export function swapHeld(state) {
  if (state.status !== 'playing') return false;
  [state.heldLevel, state.nextLevel] = [state.nextLevel, state.heldLevel];
  return true;
}

// Spends one shake. Returns false when there is none left or the game is over.
export function useShake(state) {
  if (state.status !== 'playing' || state.shakes === 0) return false;
  state.shakes -= 1;
  return true;
}

// Returns true on the frame a ball is dropped.
export function updateDrop(state, pointer, world, dt) {
  // Read and clear the flag every frame, so a release during the cooldown is not remembered.
  const released = pointer.released;
  pointer.released = false;

  if (!isHolding(state)) {
    state.cooldown -= dt;
    return false;
  }
  if (!released) return false;

  world.addBall(state.heldLevel, aimX(state, pointer.x), DROP_Y);
  state.heldLevel = state.nextLevel;
  state.nextLevel = dealLevel(state);
  state.cooldown = DROP_COOLDOWN;
  return true;
}

// Milestones count merged balls only: dropping a level 3 ball does not reach "Discover".
// Also writes the combo step on each merge (`merge.chain`, 1 for a single merge) for the feedback.
export function recordMerges(state, merges) {
  const reachedBefore = milestonesReached(state);
  for (const merge of merges) {
    state.bestMergedLevel = Math.max(state.bestMergedLevel, merge.level);
    state.chain = state.sinceMerge < COMBO.window ? state.chain + 1 : 1;
    state.sinceMerge = 0;
    state.bonus += COMBO.bonus * (state.chain - 1);
    merge.chain = state.chain;
  }
  state.shakes += milestonesReached(state) - reachedBefore;
}

export function milestonesReached(state) {
  return MILESTONES.filter((milestone) => state.bestMergedLevel >= milestone.level).length;
}

export function demoBalance(state) {
  const reached = milestonesReached(state);
  return (reached === 0 ? 0 : MILESTONES[reached - 1].balance) + state.bonus;
}

// A falling ball also passes above the line, so only slow balls count.
function isRestingAbove(ball, lineY) {
  const top = ball.position.y - LEVELS[ball.level - 1].radius;
  return top < lineY && ball.speed < REST_SPEED;
}

export function isStackHigh(world) {
  return world.balls().some((ball) => isRestingAbove(ball, DANGER_Y + NERVOUS_MARGIN));
}

// The end screen waits a moment after the win or loss. Counted with game time, so it pauses with the game.
export function isEndScreenDue(state) {
  return state.status !== 'playing' && state.endTime >= END_DELAY;
}

// The first two balls are dealt when the game starts, so a third one means the player has dropped.
export function hasDropped(state) {
  return state.dealt > 2;
}

export function updateRules(state, world, dt) {
  state.sinceMerge += dt;
  if (state.status !== 'playing') {
    state.endTime += dt;
    return;
  }

  const balls = world.balls();
  if (balls.some((ball) => ball.level === WIN_LEVEL)) {
    state.status = 'won';
    return;
  }

  const inDanger = balls.some((ball) => isRestingAbove(ball, DANGER_Y));
  state.dangerTime = inDanger ? state.dangerTime + dt : 0;
  if (state.dangerTime >= DANGER_TIME) state.status = 'lost';
}
