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
// Colors are placeholders until the real ball art in T5.
export const LEVELS = [
  { name: 'Ping-pong ball', radius: 17, color: '#FFB066' },
  { name: 'Golf ball', radius: 23, color: '#FFF6E8' },
  { name: 'Billiard ball', radius: 29, color: '#7845D8' },
  { name: 'Tennis ball', radius: 36, color: '#C6E84A' },
  { name: 'Bowling ball', radius: 43, color: '#3B4A8C' },
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

// Merge "pop": a new merged ball is drawn growing from POP_START_SCALE to full size.
// Visual only: the physics radius is full size from the start.
export const POP_DURATION = 0.2; // seconds
export const POP_START_SCALE = 0.6;

// Dropping
export const MAX_DROP_LEVEL = 4; // drops are random between level 1 and this one (half the chain, like Suika)
export const DROP_COOLDOWN = 0.5; // seconds without a ball in hand after a drop
export const DROP_Y = PLAY_AREA.y + 30; // height where the held ball waits
export const NEXT_PREVIEW = { x: 300, y: 135 };
export const EASY_DROPS = 6; // the first balls handed out are limited to...
export const EASY_MAX_LEVEL = 2; // ...levels 1 to this one, so early pairs come quickly

// End rules
export const WIN_LEVEL = LEVELS.length; // the game is won when a ball of the last level exists
export const DANGER_Y = PLAY_AREA.y + 70; // the stack must stay below this line
export const DANGER_TIME = 2; // seconds a ball may rest above the line before the game is lost
export const REST_SPEED = 1; // a ball slower than this (pixels per physics step) counts as resting
