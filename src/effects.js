import { COLORS, LEVELS, SQUASH, MERGE_FX } from './config.js';
import { drawBall } from './balls.js';

const TEXT_LIFE = 0.9; // seconds
const PARTICLE_GRAVITY = 300; // logical pixels per second squared

// Everything here is decoration. It reads what the physics reports (merges and impacts)
// and never changes a position, a speed or a game rule.
export function createEffects() {
  let particles = [];
  let texts = [];
  let ghosts = []; // pictures of balls that are gone: shrinking into a merge, or dissolving on restart
  let rings = []; // one expanding circle per merge
  const squashedBalls = new Set(); // balls that are currently drawn deformed

  // Merges that follow each other quickly form a chain, and each step looks a little stronger.
  let sinceLastMerge = Infinity;
  let chain = 0;

  // Full feedback for one merge. Returns the chain step (1 for a single merge).
  function merge({ x, y, level, ball, sources }) {
    chain = sinceLastMerge < MERGE_FX.chainWindow ? Math.min(chain + 1, MERGE_FX.maxChain) : 1;
    sinceLastMerge = 0;

    for (const source of sources) {
      addGhost(source, { x, y }, level - 1, MERGE_FX.ghostLife, 0);
    }
    rings.push({ x, y, radius: LEVELS[level - 1].radius * (1 + 0.1 * chain), life: MERGE_FX.ringLife });
    burst(x, y, level, 4 + chain * 2);
    // The new ball appears with the strongest squash its size allows, flattened vertically.
    impact({ ball, speed: Infinity, angle: Math.PI / 2 });
    return chain;
  }

  // A ball picture that moves from `from` to `to` while it shrinks and fades. It waits `delay` seconds first.
  function addGhost(from, to, level, duration, delay, angle = 0) {
    ghosts.push({ fromX: from.x, fromY: from.y, toX: to.x, toY: to.y, level, angle, duration, life: duration, delay });
  }

  // Restart: the balls of the old game shrink away where they were, a few at a time, with a small puff each.
  // They are pictures only; the old physics world is already gone.
  function dissolve(oldBalls) {
    for (const ball of oldBalls) {
      const delay = Math.random() * MERGE_FX.dissolveStagger;
      addGhost(ball.position, ball.position, ball.level, MERGE_FX.dissolveLife, delay, ball.angle);
      burst(ball.position.x, ball.position.y, ball.level, 3);
    }
  }

  // A hard hit reported by the physics. Bigger balls deform less, so they read as heavier.
  function impact({ ball, speed, angle }) {
    const lightness = 1 - (ball.level - 1) * SQUASH.heavyFactor;
    squash(ball, Math.min(SQUASH.max, speed * SQUASH.perSpeed) * lightness, angle);
  }

  function squash(ball, amount, angle) {
    if (amount <= ball.squash) return; // a stronger squash is already playing
    ball.squash = amount;
    ball.squashAngle = angle;
    squashedBalls.add(ball);
  }

  // Small dots leaving the edge of the new ball, in its color and in orange.
  function burst(x, y, level, count) {
    const { radius, color } = LEVELS[level - 1];
    for (let i = 0; i < count && particles.length < MERGE_FX.maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 80;
      particles.push({
        x: x + Math.cos(angle) * radius * 0.8,
        y: y + Math.sin(angle) * radius * 0.8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40, // a little upward push
        size: 1.5 + Math.random() * 2,
        color: i % 2 === 0 ? color : COLORS.orange,
        life: MERGE_FX.particleLife,
      });
    }
  }

  function floatText(x, y, text, size = 18) {
    texts.push({ x, y, text, size, life: TEXT_LIFE });
  }

  function update(dt) {
    sinceLastMerge += dt;

    for (const particle of particles) {
      particle.vy += PARTICLE_GRAVITY * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;
    }
    for (const text of texts) {
      text.y -= 40 * dt;
      text.life -= dt;
    }
    for (const ghost of ghosts) {
      if (ghost.delay > 0) ghost.delay -= dt;
      else ghost.life -= dt;
    }
    for (const ring of rings) ring.life -= dt;

    particles = particles.filter((particle) => particle.life > 0);
    texts = texts.filter((text) => text.life > 0);
    ghosts = ghosts.filter((ghost) => ghost.life > 0);
    rings = rings.filter((ring) => ring.life > 0);

    // Deformed balls go back to round at a fixed pace.
    for (const ball of squashedBalls) {
      ball.squash -= (SQUASH.max / SQUASH.duration) * dt;
      if (ball.squash <= 0) {
        ball.squash = 0;
        squashedBalls.delete(ball);
      }
    }
  }

  function draw(ctx) {
    for (const ghost of ghosts) {
      const left = ghost.life / ghost.duration; // 1 at the start, 0 at the end
      const x = ghost.toX + (ghost.fromX - ghost.toX) * left;
      const y = ghost.toY + (ghost.fromY - ghost.toY) * left;
      drawBall(ctx, x, y, ghost.level, { scale: 0.4 + 0.6 * left, alpha: left, angle: ghost.angle });
    }

    ctx.strokeStyle = COLORS.warmWhite;
    for (const ring of rings) {
      const left = ring.life / MERGE_FX.ringLife;
      ctx.globalAlpha = left * 0.7;
      ctx.lineWidth = 0.5 + 3 * left;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius * (1.4 - 0.6 * left), 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const particle of particles) {
      ctx.globalAlpha = particle.life / MERGE_FX.particleLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.textAlign = 'center';
    ctx.lineWidth = 4;
    ctx.strokeStyle = COLORS.ink;
    ctx.fillStyle = COLORS.warmWhite;
    for (const text of texts) {
      ctx.globalAlpha = Math.min(1, text.life / (TEXT_LIFE / 2)); // solid first, then fades
      ctx.font = `700 ${text.size}px Fredoka, sans-serif`;
      ctx.strokeText(text.text, text.x, text.y);
      ctx.fillText(text.text, text.x, text.y);
    }
    ctx.globalAlpha = 1;
  }

  return { merge, impact, dissolve, floatText, update, draw };
}
