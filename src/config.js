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

// The merge chain. A ball's `level` is 1-6, so its entry is LEVELS[level - 1].
// Colors are placeholders until the real ball art in T5.
export const LEVELS = [
  { name: 'Ping-pong ball', radius: 16, color: '#FFF6E8' },
  { name: 'Billiard ball', radius: 22, color: '#7845D8' },
  { name: 'Tennis ball', radius: 29, color: '#C6E84A' },
  { name: 'Basketball', radius: 37, color: '#F58324' },
  { name: 'Arcade token', radius: 46, color: '#A77BF0' },
  { name: 'Scrambly coin', radius: 56, color: '#FFC233' },
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
export const MAX_DROP_LEVEL = 3; // drops are random between level 1 and this one
export const DROP_COOLDOWN = 0.5; // seconds without a ball in hand after a drop
export const DROP_Y = PLAY_AREA.y + 30; // height where the held ball waits
export const NEXT_PREVIEW = { x: 300, y: 135 };
