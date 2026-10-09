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
  danger: '#FF4D5E',
  rim: '#A77BF0',
};

export const PLAY_AREA = { x: 30, y: 180, w: 300, h: 410, radius: 18 };

// The merge chain, ordered like the real balls by size. A ball's `level` is 1-8, so its entry is LEVELS[level - 1].
export const LEVELS = [
  { name: 'Golf ball', radius: 17, color: '#FFF6E8' },
  { name: 'Billiard ball', radius: 23, color: '#E8394A' },
  { name: 'Tennis ball', radius: 29, color: '#C6E84A' },
  { name: 'Bowling ball', radius: 36, color: '#35A7FF' },
  { name: 'Soccer ball', radius: 43, color: '#F7F4FF' },
  { name: 'Basketball', radius: 51, color: '#F58324' },
  { name: 'Arcade token', radius: 60, color: '#FF5FA8' },
  { name: 'Scrambly coin', radius: 70, color: '#FFC233' },
];

export const PHYSICS = {
  gravity: 1,
  restitution: 0.2, // bounce: 0 = none, 1 = full
  friction: 0.02, // low, so balls slide past each other and settle into gaps
  frictionStatic: 0, // Matter's default (0.5) makes resting balls stick together
  wallThickness: 50, // thick walls so a fast small ball cannot pass through
};

// The simulation always advances in steps of this size, whatever the screen refresh rate.
export const FIXED_STEP = 1 / 60;

// Visual only: the physics radius is full size from the start.
export const POP_DURATION = 0.3; // seconds
export const POP_START_SCALE = 0.6;

export const MERGE_FX = {
  ghostLife: 0.12,
  ringLife: 0.3,
  particleLife: 0.45,
  maxParticles: 60,
  chainWindow: 0.9, // merges closer than this (seconds) count as a chain
  maxChain: 4,
  dissolveLife: 0.35,
  dissolveStagger: 0.3,
};

// Visual only: the physics shapes stay perfect circles.
export const SQUASH = {
  minImpact: 1.8, // closing speed (pixels per physics step) below which nothing happens, so resting stacks stay still
  perSpeed: 0.016,
  max: 0.13,
  duration: 0.16,
  heavyFactor: 0.07,
};

export const MAX_DROP_LEVEL = 4;
export const DROP_COOLDOWN = 0.5; // seconds without a ball in hand after a drop
export const DROP_Y = PLAY_AREA.y + 30;
export const NEXT_PREVIEW = { x: 300, y: 135, radius: 40 }; // the bubble fits the largest ball that can be dropped
export const EASY_DROPS = 6;
export const EASY_MAX_LEVEL = 2;

export const MILESTONES = [
  { level: 3, label: 'Discover', balance: 100 },
  { level: 6, label: 'Play', balance: 250 },
  { level: 8, label: 'Redeem', balance: 500 },
];

export const FOX = {
  centerX: 66,
  bottomY: PLAY_AREA.y - 2,
  height: 104, // the image is 294x320: do not draw it much bigger than this
  hopDuration: 0.35, // seconds
  hopSmall: 8,
  hopBig: 22,
  nervousDelay: 0.3, // seconds the stack must stay high before the fox reacts
};

export const WIN_LEVEL = LEVELS.length;
export const DANGER_Y = PLAY_AREA.y + 70;
export const DANGER_TIME = 2; // seconds a ball may rest above the line before the game is lost
export const DANGER_GRACE = 0.3; // seconds before the line turns red: a ball that was just dropped is slow and high for a moment
export const REST_SPEED = 1; // a ball slower than this (pixels per physics step) counts as resting
export const ROTATE_QUERY = '(orientation: landscape) and (max-height: 500px)';
export const END_DELAY = 0.8; // seconds between the end of the game and the end screen, so the last merge is seen
export const NERVOUS_MARGIN = 50;
