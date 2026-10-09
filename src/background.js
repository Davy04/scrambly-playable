import { LOGICAL_W, LOGICAL_H, COLORS, PLAY_AREA } from './config.js';

const BUBBLE_COUNT = 14;

function randomBubble(y) {
  return {
    x: Math.random() * LOGICAL_W,
    y,
    radius: 4 + Math.random() * 14,
    speed: 6 + Math.random() * 14, // logical pixels per second, upward
    alpha: 0.04 + Math.random() * 0.08,
  };
}

// Decoration only. Created once at page load, so it keeps drifting across restarts.
export function createBackground() {
  const bubbles = Array.from({ length: BUBBLE_COUNT }, () => randomBubble(Math.random() * LOGICAL_H));

  function update(dt) {
    for (const bubble of bubbles) {
      bubble.y -= bubble.speed * dt;
      if (bubble.y < -bubble.radius) Object.assign(bubble, randomBubble(LOGICAL_H + 20));
    }
  }

  function draw(ctx) {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, '#170C2E');
    sky.addColorStop(0.55, '#3B1F7A');
    sky.addColorStop(1, COLORS.purple);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    // Soft light behind the jar, so the play area is the brightest part of the screen.
    const centerX = PLAY_AREA.x + PLAY_AREA.w / 2;
    const centerY = PLAY_AREA.y + PLAY_AREA.h / 2;
    const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 300);
    glow.addColorStop(0, 'rgba(167, 123, 240, 0.45)');
    glow.addColorStop(1, 'rgba(167, 123, 240, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);

    ctx.fillStyle = COLORS.warmWhite;
    for (const bubble of bubbles) {
      ctx.globalAlpha = bubble.alpha;
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return { update, draw };
}
