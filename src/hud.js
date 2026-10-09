import { LOGICAL_W, COLORS, LEVELS, MILESTONES, PLAY_AREA, DANGER_Y } from './config.js';
import { drawBall } from './balls.js';

const TRACK = { y: 26, firstX: 62, lastX: 298, nodeRadius: 12, labelY: 56 };
const BALANCE = { x: 115, y: 70, w: 156, h: 28 }; // wide enough for a 3-digit balance
const COIN_LEVEL = LEVELS.length;
const GOLD = LEVELS[COIN_LEVEL - 1].color;
const PULSE_DURATION = 0.5; // seconds
const COUNT_SPEED = 250; // demo balance units per second
const BANNER = { y: DANGER_Y + 16, w: 250, h: 50, duration: 2 }; // duration in seconds

// The animated part of the HUD: the balance counts up to its real value, the newest step pulses,
// a banner explains each step when it is reached, and the hint slides. One per play session, so a restart starts from zero.
export function createHud() {
  let time = 0;
  let reached = 0;
  let shownBalance = 0;
  let pulseLeft = 0;
  let bannerLeft = 0;

  function update(dt, reachedNow, balance) {
    time += dt;
    if (reachedNow > reached) {
      pulseLeft = PULSE_DURATION;
      bannerLeft = BANNER.duration;
    }
    reached = reachedNow;
    pulseLeft = Math.max(0, pulseLeft - dt);
    bannerLeft = Math.max(0, bannerLeft - dt);
    shownBalance = Math.min(balance, shownBalance + COUNT_SPEED * dt);
  }

  function draw(ctx) {
    const bump = Math.sin((pulseLeft / PULSE_DURATION) * Math.PI); // 0, up to 1, back to 0
    drawTrack(ctx, reached, bump);
    drawBalance(ctx, Math.round(shownBalance), bump);
    if (bannerLeft > 0) drawBanner(ctx, reached, bannerLeft);
  }

  return { update, draw, drawHint: (ctx) => drawHint(ctx, time) };
}

// The three Scrambly steps as dots on a line. The line fills up to the last step reached.
function drawTrack(ctx, reachedCount, bump) {
  const spacing = (TRACK.lastX - TRACK.firstX) / (MILESTONES.length - 1);
  const nodeX = (index) => TRACK.firstX + index * spacing;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  strokeLine(ctx, TRACK.firstX, TRACK.lastX, 'rgba(255, 246, 232, 0.25)');
  if (reachedCount > 1) strokeLine(ctx, TRACK.firstX, nodeX(reachedCount - 1), COLORS.orange);

  ctx.textAlign = 'center';
  MILESTONES.forEach((milestone, index) => {
    const reached = index < reachedCount;
    const isNewest = index === reachedCount - 1;
    drawNode(ctx, nodeX(index), index + 1, reached, isNewest ? 1 + 0.4 * bump : 1);
    ctx.globalAlpha = reached ? 1 : 0.6;
    ctx.font = '600 13px Fredoka, sans-serif';
    ctx.fillStyle = COLORS.warmWhite;
    ctx.fillText(milestone.label, nodeX(index), TRACK.labelY);
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}

function strokeLine(ctx, fromX, toX, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(fromX, TRACK.y);
  ctx.lineTo(toX, TRACK.y);
  ctx.stroke();
}

// A reached step is an orange dot with a check mark; the others show their number.
function drawNode(ctx, x, number, reached, scale) {
  ctx.beginPath();
  ctx.arc(x, TRACK.y, TRACK.nodeRadius * scale, 0, Math.PI * 2);
  ctx.fillStyle = reached ? COLORS.orange : COLORS.ink;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = reached ? COLORS.warmWhite : 'rgba(255, 246, 232, 0.5)';
  ctx.stroke();

  if (reached) {
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = COLORS.ink;
    ctx.beginPath();
    ctx.moveTo(x - 5, TRACK.y);
    ctx.lineTo(x - 1.5, TRACK.y + 4);
    ctx.lineTo(x + 5.5, TRACK.y - 4);
    ctx.stroke();
  } else {
    ctx.font = '700 13px Fredoka, sans-serif';
    ctx.fillStyle = COLORS.warmWhite;
    ctx.fillText(number, x, TRACK.y + 4.5);
  }
}

// Always labeled as a demo: this is not real money or a real reward.
function drawBalance(ctx, balance, bump) {
  const { x, y, w, h } = BALANCE;
  const textY = y + h / 2 + 4.5;

  ctx.beginPath();
  ctx.roundRect(x, y, w, h, h / 2);
  ctx.fillStyle = 'rgba(32, 19, 56, 0.6)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 246, 232, 0.25)';
  ctx.stroke();

  // The coin is the last ball of the chain, drawn small.
  drawBall(ctx, x + 16, y + h / 2, COIN_LEVEL, { scale: 9 / LEVELS[COIN_LEVEL - 1].radius });

  ctx.textAlign = 'left';
  ctx.font = '500 12px Fredoka, sans-serif';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText('Demo balance', x + 29, textY);
  ctx.textAlign = 'right';
  ctx.font = `700 ${16 + 4 * bump}px Fredoka, sans-serif`;
  ctx.fillStyle = GOLD;
  ctx.fillText(balance, x + w - 12, textY + 0.5);
}

// What the step just reached means in Scrambly. Fades in quickly and out slowly.
function drawBanner(ctx, reachedCount, timeLeft) {
  const milestone = MILESTONES[reachedCount - 1];
  const x = (LOGICAL_W - BANNER.w) / 2;
  const age = BANNER.duration - timeLeft;

  ctx.save();
  ctx.globalAlpha = Math.min(1, age / 0.15, timeLeft / 0.4);
  ctx.beginPath();
  ctx.roundRect(x, BANNER.y, BANNER.w, BANNER.h, 16);
  ctx.fillStyle = 'rgba(32, 19, 56, 0.9)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.orange;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.font = '700 18px Fredoka, sans-serif';
  ctx.fillStyle = COLORS.orange;
  ctx.fillText(`${reachedCount}. ${milestone.label}`, LOGICAL_W / 2, BANNER.y + 22);
  ctx.font = '500 14px Fredoka, sans-serif';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText(milestone.text, LOGICAL_W / 2, BANNER.y + 40);
  ctx.restore();
}

// Shown until the first drop: a dot sliding left and right over the instructions.
function drawHint(ctx, time) {
  const centerX = LOGICAL_W / 2;
  const textY = PLAY_AREA.y + PLAY_AREA.h / 2;
  const slideY = textY - 44;
  const reach = 50;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 246, 232, 0.4)';
  ctx.beginPath();
  ctx.moveTo(centerX - reach, slideY);
  ctx.lineTo(centerX + reach, slideY);
  for (const side of [-1, 1]) {
    const tipX = centerX + side * (reach + 12);
    ctx.moveTo(tipX - side * 6, slideY - 6);
    ctx.lineTo(tipX, slideY);
    ctx.lineTo(tipX - side * 6, slideY + 6);
  }
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(centerX + Math.sin(time * 2.5) * reach, slideY, 9, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.orange;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.warmWhite;
  ctx.stroke();
  ctx.restore();

  ctx.font = '600 18px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText('Drag to aim, release to drop', centerX, textY);
  ctx.font = '500 14px Fredoka, sans-serif';
  ctx.fillText('Match two balls to merge them', centerX, textY + 24);
  ctx.fillStyle = GOLD;
  ctx.fillText('Merge up to the Scrambly coin!', centerX, textY + 46);
}
