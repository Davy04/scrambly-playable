// All tunable constants live here. Game logic and physics use logical pixels only.

export const LOGICAL_W = 360;
export const LOGICAL_H = 640;

// Longest time step one frame may simulate, in seconds. Stops time jumps after a pause or a slow frame.
export const MAX_DT = 1 / 30;

// Cap on devicePixelRatio for the canvas backing store. 2 is sharp enough and cheaper than 3 on iPhones.
export const MAX_DPR = 2;

export const COLORS = {
  orange: '#F58324',
  purple: '#7845D8',
  ink: '#201338',
  warmWhite: '#FFF6E8',
};

// The box the balls fall into, in logical pixels. Tune while playing.
export const PLAY_AREA = { x: 30, y: 180, w: 300, h: 410, radius: 18 };

// The merge chain, ordered like the real balls by size. A ball's `level` is 1-8, so its entry is LEVELS[level - 1].
// Radii are large on purpose: the box fills up, so the player has to think about where to drop.
// `color` is the base color; the details of each ball are drawn in balls.js.
export const LEVELS = [
  { name: 'Golf ball', radius: 17, color: '#FFF6E8' },
  { name: 'Billiard ball', radius: 23, color: '#7845D8' },
  { name: 'Tennis ball', radius: 29, color: '#C6E84A' },
  { name: 'Bowling ball', radius: 36, color: '#3B4A8C' },
  { name: 'Soccer ball', radius: 43, color: '#F7F4FF' },
  { name: 'Basketball', radius: 51, color: '#F58324' },
  { name: 'Arcade token', radius: 60, color: '#A77BF0' },
  { name: 'Scrambly coin', radius: 70, color: '#FFC233' },
];

// Physics feel. Tune while playing.
export const PHYSICS = {
  gravity: 1,
  restitution: 0.2, // bounce: 0 = none, 1 = full
  friction: 0.1,
  wallThickness: 50, // thick walls so a fast small ball cannot pass through
};

// The simulation always advances in steps of this size, whatever the screen refresh rate.
export const FIXED_STEP = 1 / 60;

// Merge "pop": a new merged ball is drawn growing from POP_START_SCALE, a bit past full size, then settling.
// Visual only: the physics radius is full size from the start.
export const POP_DURATION = 0.3; // seconds
export const POP_START_SCALE = 0.6;

// Merge feedback (effects.js). Short and quiet on purpose.
export const MERGE_FX = {
  ghostLife: 0.12, // seconds the two merged balls take to shrink into the new one
  ringLife: 0.3, // seconds of the expanding circle
  particleLife: 0.45,
  maxParticles: 60, // hard limit on particles alive at the same time
  chainWindow: 0.9, // merges closer than this (seconds) count as a chain
  maxChain: 4, // the feedback stops growing after this many chained merges
  dissolveLife: 0.35, // seconds each ball takes to shrink away on restart
  dissolveStagger: 0.3, // the balls start dissolving at random moments inside this many seconds
};

// Squash on impact: balls are drawn slightly flattened for a moment after a hard hit.
// Visual only: the physics shapes stay perfect circles.
export const SQUASH = {
  minImpact: 2.5, // closing speed (pixels per physics step) below which nothing happens, so resting stacks stay still
  perSpeed: 0.01, // how much squash each unit of closing speed adds
  max: 0.08, // largest squash: 8% flatter along the hit direction
  duration: 0.16, // seconds for the largest squash to go back to round
  heavyFactor: 0.07, // each level deforms this much less than the one before, so big balls look heavier
};

// Dropping
export const MAX_DROP_LEVEL = 4; // drops are random between level 1 and this one (half the chain, like Suika)
export const DROP_COOLDOWN = 0.5; // seconds without a ball in hand after a drop
export const DROP_Y = PLAY_AREA.y + 30; // height where the held ball waits
export const NEXT_PREVIEW = { x: 300, y: 135 };
export const EASY_DROPS = 6; // the first balls handed out are limited to...
export const EASY_MAX_LEVEL = 2; // ...levels 1 to this one, so early pairs come quickly

// The three Scrambly steps. Each is reached by merging up to `level`. `balance` is the demo balance shown from then on.
export const MILESTONES = [
  { level: 3, label: 'Discover', balance: 100 },
  { level: 6, label: 'Play', balance: 250 },
  { level: 8, label: 'Redeem', balance: 500 },
];

// The fox mascot, standing on the top-left corner of the play area.
export const FOX = {
  centerX: 66,
  bottomY: PLAY_AREA.y - 2,
  height: 104, // the image is 294x320: do not draw it much bigger than this
  hopDuration: 0.35, // seconds
  hopSmall: 8, // hop height on any merge
  hopBig: 22, // hop height when a milestone is reached
  nervousDelay: 0.3, // seconds the stack must stay high before the fox reacts
};

// End rules
export const WIN_LEVEL = LEVELS.length; // the game is won when a ball of the last level exists
export const DANGER_Y = PLAY_AREA.y + 70; // the stack must stay below this line
export const DANGER_TIME = 2; // seconds a ball may rest above the line before the game is lost
export const REST_SPEED = 1; // a ball slower than this (pixels per physics step) counts as resting
export const END_DELAY = 0.8; // seconds between the end of the game and the end screen, so the last merge is seen
export const NERVOUS_MARGIN = 50; // the fox gets nervous when the stack is this close to the danger line
