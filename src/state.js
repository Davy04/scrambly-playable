import {
  PLAY_AREA, LEVELS, MAX_DROP_LEVEL, DROP_COOLDOWN, DROP_Y,
  EASY_DROPS, EASY_MAX_LEVEL, WIN_LEVEL, DANGER_Y, DANGER_TIME, REST_SPEED, NERVOUS_MARGIN, MILESTONES,
  END_DELAY,
} from './config.js';

// Picks the level of the next ball. The first EASY_DROPS balls are small, so early merges are easy.
function dealLevel(state) {
  const maxLevel = state.dealt < EASY_DROPS ? EASY_MAX_LEVEL : MAX_DROP_LEVEL;
  state.dealt += 1;
  return 1 + Math.floor(Math.random() * maxLevel);
}

export function createState() {
  const state = {
    status: 'playing', // 'playing' | 'won' | 'lost'
    dealt: 0, // how many balls have been handed out so far
    cooldown: 0, // seconds left until a ball is in hand again
    dangerTime: 0, // seconds a ball has been resting above the danger line
    bestMergedLevel: 0, // highest level the player has created by merging
    endTime: 0, // seconds since the game was won or lost
  };
  state.heldLevel = dealLevel(state);
  state.nextLevel = dealLevel(state);
  return state;
}

export function isHolding(state) {
  return state.status === 'playing' && state.cooldown <= 0;
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
  state.nextLevel = dealLevel(state);
  state.cooldown = DROP_COOLDOWN;
}

// Milestones count merged balls only: dropping a level 3 ball does not reach "Discover".
export function recordMerges(state, merges) {
  for (const merge of merges) {
    state.bestMergedLevel = Math.max(state.bestMergedLevel, merge.level);
  }
}

export function milestonesReached(state) {
  return MILESTONES.filter((milestone) => state.bestMergedLevel >= milestone.level).length;
}

export function demoBalance(state) {
  const reached = milestonesReached(state);
  return reached === 0 ? 0 : MILESTONES[reached - 1].balance;
}

// A falling ball also passes above the line, so only slow balls count.
function isRestingAbove(ball, lineY) {
  const top = ball.position.y - LEVELS[ball.level - 1].radius;
  return top < lineY && ball.speed < REST_SPEED;
}

// True when the stack is close to the danger line. Used only for the fox's nervous reaction.
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

// Runs once per frame after the physics step: checks for the win and the loss.
export function updateRules(state, world, dt) {
  if (state.status !== 'playing') {
    state.endTime += dt;
    return;
  }

  const balls = world.balls();
  if (balls.some((ball) => ball.level === WIN_LEVEL)) {
    state.status = 'won';
    return;
  }

  // The timer only grows while a ball stays up there; it restarts as soon as the line is clear.
  const inDanger = balls.some((ball) => isRestingAbove(ball, DANGER_Y));
  state.dangerTime = inDanger ? state.dangerTime + dt : 0;
  if (state.dangerTime >= DANGER_TIME) state.status = 'lost';
}
