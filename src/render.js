import {
  LOGICAL_W, LOGICAL_H, MAX_DPR, COLORS, PLAY_AREA, DROP_Y, NEXT_PREVIEW,
  POP_DURATION, POP_START_SCALE, DANGER_Y, FOX,
} from './config.js';
import { drawBall } from './balls.js';

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
//   showHint, fox, effects, background, hud }
export function draw(ctx, scene) {
  scene.background.draw(ctx);
  drawJar(ctx);
  drawDangerLine(ctx, scene.dangerProgress);
  drawFoxLedge(ctx);
  scene.fox.draw(ctx);
  if (scene.showHint) scene.hud.drawHint(ctx);
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
  scene.hud.draw(ctx);
}

const RIM = 6; // logical pixels

function drawDangerLine(ctx, progress) {
  const { x, y, w } = PLAY_AREA;
  const filled = Math.min(progress, 1);
  const inDanger = filled > 0;
  // The pulse is driven by the loss timer itself, so it pauses with the game.
  const pulse = 0.75 + 0.25 * Math.sin(filled * Math.PI * 12);

  ctx.save();
  if (inDanger) {
    ctx.globalAlpha = (0.1 + 0.25 * filled) * pulse;
    ctx.fillStyle = COLORS.danger;
    ctx.fillRect(x, y, w, DANGER_Y - y);
  }
  ctx.globalAlpha = inDanger ? pulse : 0.45;
  ctx.strokeStyle = inDanger ? COLORS.danger : COLORS.orange;
  ctx.lineWidth = 2 + 2 * filled;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(x, DANGER_Y);
  ctx.lineTo(x + w, DANGER_Y);
  ctx.stroke();
  ctx.restore();
}

// A U shape: left wall, floor and right wall. The top stays open, like the physics walls.
function jarPath(ctx, grow) {
  const { x, y, w, h, radius } = PLAY_AREA;
  const left = x - grow;
  const right = x + w + grow;
  const bottom = y + h + grow;
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.arcTo(left, bottom, right, bottom, radius + grow);
  ctx.arcTo(right, bottom, right, y, radius + grow);
  ctx.lineTo(right, y);
}

function drawJar(ctx) {
  const { x, y, h } = PLAY_AREA;

  const glass = ctx.createLinearGradient(0, y, 0, y + h);
  glass.addColorStop(0, 'rgba(32, 19, 56, 0.3)');
  glass.addColorStop(1, 'rgba(32, 19, 56, 0.6)');
  jarPath(ctx, 0);
  ctx.fillStyle = glass;
  ctx.fill();

  // The rim is drawn outside the physics walls, so balls never overlap it.
  ctx.save();
  jarPath(ctx, RIM / 2);
  ctx.lineCap = 'round';
  ctx.lineWidth = RIM;
  ctx.strokeStyle = COLORS.rim;
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 246, 232, 0.7)';
  ctx.stroke();
  ctx.restore();

  // A faint reflection down the left side of the glass.
  ctx.fillStyle = 'rgba(255, 246, 232, 0.1)';
  ctx.beginPath();
  ctx.roundRect(x + 9, y + 46, 5, 110, 2.5);
  ctx.fill();
}

// The shelf the fox stands on. It does not move when the fox hops.
function drawFoxLedge(ctx) {
  const width = 92;
  const x = FOX.centerX - width / 2;
  const y = FOX.bottomY - 2;
  ctx.fillStyle = '#B85A0E';
  ctx.beginPath();
  ctx.roundRect(x, y + 3, width, 9, 4.5);
  ctx.fill();
  ctx.fillStyle = COLORS.orange;
  ctx.beginPath();
  ctx.roundRect(x, y, width, 9, 4.5);
  ctx.fill();
}

function popScale(ball) {
  const back = ball.popLeft / POP_DURATION; // 1 at the start of the pop, 0 at the end
  const eased = 1 - 2.7 * back ** 3 + 1.7 * back ** 2;
  return POP_START_SCALE + (1 - POP_START_SCALE) * eased;
}

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
  const { x, y, radius } = NEXT_PREVIEW;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(32, 19, 56, 0.5)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.rim;
  ctx.stroke();

  ctx.font = '700 13px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText('Next', x, y - radius - 6);
  drawBall(ctx, x, y, level);
}
