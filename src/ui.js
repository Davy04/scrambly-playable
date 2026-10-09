import { LOGICAL_W, COLORS, MILESTONES } from './config.js';

const BAR = { x: 16, y: 14, gap: 8, height: 26 };

// Top bar: the three Scrambly steps, lit up as they are reached, and the demo balance under them.
export function drawTopBar(ctx, milestonesReached, balance) {
  const chipWidth = (LOGICAL_W - BAR.x * 2 - BAR.gap * (MILESTONES.length - 1)) / MILESTONES.length;

  ctx.font = '600 14px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  MILESTONES.forEach((milestone, index) => {
    const x = BAR.x + index * (chipWidth + BAR.gap);
    const reached = index < milestonesReached;
    drawChip(ctx, x, chipWidth, `${index + 1}. ${milestone.label}`, reached);
  });

  // Always labeled as a demo: this is not real money or a real reward.
  ctx.textBaseline = 'alphabetic';
  ctx.font = '600 15px Fredoka, sans-serif';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText(`Demo balance: ${balance}`, LOGICAL_W / 2, 64);
}

function drawChip(ctx, x, width, text, reached) {
  ctx.beginPath();
  ctx.roundRect(x, BAR.y, width, BAR.height, BAR.height / 2);
  if (reached) {
    ctx.fillStyle = COLORS.orange;
    ctx.fill();
  } else {
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = COLORS.warmWhite;
    ctx.stroke();
  }
  ctx.fillStyle = reached ? COLORS.ink : COLORS.warmWhite;
  ctx.fillText(text, x + width / 2, BAR.y + BAR.height / 2 + 1);
  ctx.globalAlpha = 1;
}
