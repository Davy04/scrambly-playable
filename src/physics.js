import { PLAY_AREA, LEVELS, PHYSICS, FIXED_STEP } from './config.js';

// Matter.js is loaded by a classic <script> tag in index.html and lives in the global `Matter`.
const { Engine, Bodies, Composite } = Matter;

// Left wall, right wall and floor around the play area. The top stays open.
function createWalls() {
  const { x, y, w, h } = PLAY_AREA;
  const t = PHYSICS.wallThickness;
  const extraHeight = 400; // side walls continue above the play area so a ball cannot escape sideways
  const sideHeight = h + extraHeight;
  const sideCenterY = y + h - sideHeight / 2;
  const options = { isStatic: true };

  // Matter rectangles are positioned by their center.
  return [
    Bodies.rectangle(x - t / 2, sideCenterY, t, sideHeight, options),
    Bodies.rectangle(x + w + t / 2, sideCenterY, t, sideHeight, options),
    Bodies.rectangle(x + w / 2, y + h + t / 2, w + t * 2, t, options),
  ];
}

export function createWorld() {
  const engine = Engine.create();
  engine.gravity.y = PHYSICS.gravity;
  Composite.add(engine.world, createWalls());

  let unsimulatedTime = 0;

  function addBall(level, x, y) {
    const ball = Bodies.circle(x, y, LEVELS[level - 1].radius, {
      restitution: PHYSICS.restitution,
      friction: PHYSICS.friction,
    });
    ball.level = level;
    Composite.add(engine.world, ball);
    return ball;
  }

  // Advances the simulation in fixed steps. Time that does not fill a whole step is kept for the next frame.
  // dt is already clamped by the game loop (MAX_DT), so this loop runs a few times at most.
  function step(dt) {
    unsimulatedTime += dt;
    while (unsimulatedTime >= FIXED_STEP) {
      Engine.update(engine, FIXED_STEP * 1000); // Matter wants milliseconds
      unsimulatedTime -= FIXED_STEP;
    }
  }

  function balls() {
    return Composite.allBodies(engine.world).filter((body) => !body.isStatic);
  }

  return { addBall, step, balls };
}
