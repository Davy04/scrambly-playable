import {
  LOGICAL_W, LOGICAL_H, MAX_DPR, COLORS, PLAY_AREA, LEVELS, DROP_Y, NEXT_PREVIEW,
  POP_DURATION, POP_START_SCALE,
} from './config.js';

// Scales the canvas to the largest 360x640 box that fits in the available space (letterbox).
// After this, every draw call uses logical pixels.
export function fitCanvas(canvas, availableW, availableH) {
  if (availableW <= 0 || availableH <= 0) return;

  const scale = Math.min(availableW / LOGICAL_W, availableH / LOGICAL_H);
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  canvas.style.width = `${LOGICAL_W * scale}px`;
  canvas.style.height = `${LOGICAL_H * scale}px`;
  canvas.width = Math.round(LOGICAL_W * scale * dpr);
  canvas.height = Math.round(LOGICAL_H * scale * dpr);

  // Setting canvas.width resets the context, so the transform is applied again here.
  const pixelsPerLogical = canvas.width / LOGICAL_W;
  canvas.getContext('2d').setTransform(pixelsPerLogical, 0, 0, pixelsPerLogical, 0, 0);
}

// `scene` is plain data built by main.js:
// { balls, heldLevel (null during the cooldown), heldX, nextLevel }
export function draw(ctx, scene) {
  drawBackground(ctx);
  drawPlayArea(ctx);
  for (const ball of scene.balls) {
    drawBall(ctx, ball.position.x, ball.position.y, ball.level, popScale(ball));
  }
  if (scene.heldLevel !== null) {
    drawAimGuide(ctx, scene.heldX);
    drawBall(ctx, scene.heldX, DROP_Y, scene.heldLevel);
  }
  drawNextPreview(ctx, scene.nextLevel);
}

function drawBackground(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
  gradient.addColorStop(0, COLORS.ink);
  gradient.addColorStop(1, COLORS.purple);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
}

function drawPlayArea(ctx) {
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = COLORS.warmWhite;
  ctx.beginPath();
  ctx.roundRect(PLAY_AREA.x, PLAY_AREA.y, PLAY_AREA.w, PLAY_AREA.h, PLAY_AREA.radius);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Goes from POP_START_SCALE to 1 while a merged ball's pop timer runs down.
function popScale(ball) {
  const progressLeft = ball.popLeft / POP_DURATION;
  return 1 - (1 - POP_START_SCALE) * progressLeft;
}

// Placeholder look: a flat circle in the level color. The real ball art comes in T5.
function drawBall(ctx, x, y, level, scale = 1) {
  const { radius, color } = LEVELS[level - 1];
  ctx.beginPath();
  ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.ink;
  ctx.stroke();
}

// Dashed vertical line showing where the held ball will fall.
function drawAimGuide(ctx, x) {
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = COLORS.warmWhite;
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 8]);
  ctx.beginPath();
  ctx.moveTo(x, DROP_Y);
  ctx.lineTo(x, PLAY_AREA.y + PLAY_AREA.h);
  ctx.stroke();
  ctx.restore();
}

function drawNextPreview(ctx, level) {
  ctx.font = '700 14px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText('Next', NEXT_PREVIEW.x, NEXT_PREVIEW.y - 36);
  drawBall(ctx, NEXT_PREVIEW.x, NEXT_PREVIEW.y, level);
}
