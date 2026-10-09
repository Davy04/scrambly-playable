import { PLAY_AREA, LEVELS, PHYSICS, FIXED_STEP, POP_DURATION } from './config.js';

// Matter.js is loaded by a classic <script> tag in index.html and lives in the global `Matter`.
const { Engine, Bodies, Composite, Events } = Matter;

const MAX_LEVEL = LEVELS.length;

// Walls have no `level`, so they never pass this test. The last level does not merge.
function canMerge(bodyA, bodyB) {
  return Boolean(bodyA.level) && bodyA.level === bodyB.level && bodyA.level < MAX_LEVEL;
}

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

  // Same-level pairs that started touching during the current step.
  // They are only collected here: changing the world inside a Matter callback is unsafe.
  const touchingPairs = [];
  Events.on(engine, 'collisionStart', (event) => {
    for (const { bodyA, bodyB } of event.pairs) {
      if (canMerge(bodyA, bodyB)) touchingPairs.push([bodyA, bodyB]);
    }
  });

  function addBall(level, x, y) {
    const ball = Bodies.circle(x, y, LEVELS[level - 1].radius, {
      restitution: PHYSICS.restitution,
      friction: PHYSICS.friction,
    });
    ball.level = level;
    ball.merged = false; // true once this ball has been used in a merge
    ball.popLeft = 0; // seconds left of the "pop" animation
    Composite.add(engine.world, ball);
    return ball;
  }

  // Replaces two touching balls with one ball of the next level at their midpoint.
  function mergePair(ballA, ballB) {
    ballA.merged = true;
    ballB.merged = true;
    Composite.remove(engine.world, ballA);
    Composite.remove(engine.world, ballB);

    const level = ballA.level + 1;
    const radius = LEVELS[level - 1].radius;
    const midX = (ballA.position.x + ballB.position.x) / 2;
    const midY = (ballA.position.y + ballB.position.y) / 2;
    // The new ball is bigger, so keep it from starting inside a wall or the floor.
    const x = Math.min(Math.max(midX, PLAY_AREA.x + radius), PLAY_AREA.x + PLAY_AREA.w - radius);
    const y = Math.min(midY, PLAY_AREA.y + PLAY_AREA.h - radius);

    addBall(level, x, y).popLeft = POP_DURATION;
  }

  function resolveMerges() {
    for (const [ballA, ballB] of touchingPairs) {
      // A ball touching two partners in the same step merges only once.
      if (ballA.merged || ballB.merged) continue;
      mergePair(ballA, ballB);
    }
    touchingPairs.length = 0;
  }

  function updatePopTimers() {
    for (const ball of balls()) {
      ball.popLeft = Math.max(0, ball.popLeft - FIXED_STEP);
    }
  }

  // Advances the simulation in fixed steps. Time that does not fill a whole step is kept for the next frame.
  // dt is already clamped by the game loop (MAX_DT), so this loop runs a few times at most.
  function step(dt) {
    unsimulatedTime += dt;
    while (unsimulatedTime >= FIXED_STEP) {
      Engine.update(engine, FIXED_STEP * 1000); // Matter wants milliseconds
      resolveMerges();
      updatePopTimers();
      unsimulatedTime -= FIXED_STEP;
    }
  }

  function balls() {
    return Composite.allBodies(engine.world).filter((body) => !body.isStatic);
  }

  return { addBall, step, balls };
}
