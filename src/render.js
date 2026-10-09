import {
  LOGICAL_W, LOGICAL_H, MAX_DPR, COLORS, PLAY_AREA, DROP_Y, NEXT_PREVIEW,
  POP_DURATION, POP_START_SCALE, DANGER_Y,
} from './config.js';
import { drawBall } from './balls.js';
import { drawTopBar, drawHint } from './ui.js';

// Scales the frame to the largest 360x640 box that fits in the available space (letterbox).
// The canvas fills the frame. After this, every draw call uses logical pixels.
export function fitCanvas(frame, canvas, availableW, availableH) {
  if (availableW <= 0 || availableH <= 0) return;

  const scale = Math.min(availableW / LOGICAL_W, availableH / LOGICAL_H);
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

  frame.style.width = `${LOGICAL_W * scale}px`;
  frame.style.height = `${LOGICAL_H * scale}px`;
  // The HTML overlay sizes everything in em, so this one value scales it with the canvas.
  frame.style.fontSize = `${16 * scale}px`;
  canvas.width = Math.round(LOGICAL_W * scale * dpr);
  canvas.height = Math.round(LOGICAL_H * scale * dpr);

  // Setting canvas.width resets the context, so the transform is applied again here.
  const pixelsPerLogical = canvas.width / LOGICAL_W;
  canvas.getContext('2d').setTransform(pixelsPerLogical, 0, 0, pixelsPerLogical, 0, 0);
}

// `scene` is plain data built by main.js:
// { balls, heldLevel (null when no ball is in hand), heldX, nextLevel, dangerProgress (0 to 1),
//   milestonesReached, balance, showHint, fox, effects }
export function draw(ctx, scene) {
  drawBackground(ctx);
  drawPlayArea(ctx);
  drawDangerLine(ctx, scene.dangerProgress);
  scene.fox.draw(ctx);
  if (scene.showHint) drawHint(ctx);
  for (const ball of scene.balls) {
    drawBall(ctx, ball.position.x, ball.position.y, ball.level, {
      scale: popScale(ball),
      angle: ball.angle,
      squash: ball.squash,
      squashAngle: ball.squashAngle,
    });
  }
  if (scene.heldLevel !== null) {
    drawAimGuide(ctx, scene.heldX);
    drawBall(ctx, scene.heldX, DROP_Y, scene.heldLevel);
  }
  scene.effects.draw(ctx);
  drawNextPreview(ctx, scene.nextLevel);
  drawTopBar(ctx, scene.milestonesReached, scene.balance);
}

// Dashed orange line. It gets thicker and more solid as the loss timer fills up.
function drawDangerLine(ctx, progress) {
  ctx.save();
  ctx.globalAlpha = 0.5 + 0.5 * progress;
  ctx.strokeStyle = COLORS.orange;
  ctx.lineWidth = 2 + 2 * progress;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(PLAY_AREA.x, DANGER_Y);
  ctx.lineTo(PLAY_AREA.x + PLAY_AREA.w, DANGER_Y);
  ctx.stroke();
  ctx.restore();
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
  // A thin edge makes the walls readable against the background.
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = COLORS.warmWhite;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Scale of a merged ball while its pop timer runs down: starts at POP_START_SCALE,
// goes about 10% past full size, then settles at 1 (the "ease out back" curve).
function popScale(ball) {
  const back = ball.popLeft / POP_DURATION; // 1 at the start of the pop, 0 at the end
  const eased = 1 - 2.7 * back ** 3 + 1.7 * back ** 2;
  return POP_START_SCALE + (1 - POP_START_SCALE) * eased;
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
  ctx.fillText('Next', NEXT_PREVIEW.x, NEXT_PREVIEW.y - 46);
  drawBall(ctx, NEXT_PREVIEW.x, NEXT_PREVIEW.y, level);
}
