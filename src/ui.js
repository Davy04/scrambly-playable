import { LOGICAL_W, COLORS, MILESTONES, PLAY_AREA, FOX } from './config.js';

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

// The mascot is one static image, so every reaction is a transform done here:
// a slow "breathing" squash when idle, a hop on merges, a shake and a sweat drop when the stack is high.
export function createFox(image) {
  let time = 0;
  let hopLeft = 0; // seconds left of the current hop
  let hopHeight = 0;
  let stackHighFor = 0; // seconds the stack has been high without a break
  let nervous = false;

  function hop(height) {
    hopLeft = FOX.hopDuration;
    hopHeight = height;
  }

  function update(dt, isStackHigh) {
    time += dt;
    hopLeft = Math.max(0, hopLeft - dt);
    // A ball that was just dropped is slow and high for a few frames. Waiting a moment avoids a flicker on every drop.
    stackHighFor = isStackHigh ? stackHighFor + dt : 0;
    nervous = stackHighFor > FOX.nervousDelay;
  }

  function draw(ctx) {
    // The image may still be loading, or may have failed: the game works without it.
    if (!image.complete || image.naturalWidth === 0) return;

    const width = FOX.height * (image.naturalWidth / image.naturalHeight);
    const hopProgress = 1 - hopLeft / FOX.hopDuration;
    const lift = hopLeft > 0 ? Math.sin(hopProgress * Math.PI) * hopHeight : 0;
    const shake = nervous ? Math.sin(time * 40) * 1.5 : 0;
    const breathe = 1 + Math.sin(time * 3) * 0.02;

    ctx.save();
    // Scale from the feet, so the fox squashes against the ground instead of floating.
    ctx.translate(FOX.centerX + shake, FOX.bottomY - lift);
    ctx.scale(1 / breathe, breathe);
    ctx.drawImage(image, -width / 2, -FOX.height, width, FOX.height);
    ctx.restore();

    if (nervous) drawSweatDrop(ctx, time);
  }

  return { hop, update, draw };
}

// A small drop that slides down beside the fox's head and fades, on a loop.
function drawSweatDrop(ctx, time) {
  const progress = (time % 0.8) / 0.8;
  ctx.globalAlpha = 1 - progress;
  ctx.fillStyle = '#9FD8FF';
  ctx.beginPath();
  ctx.ellipse(FOX.centerX + 34, FOX.bottomY - FOX.height + 30 + progress * 16, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Shown until the first drop.
export function drawHint(ctx) {
  ctx.font = '600 18px Fredoka, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = COLORS.warmWhite;
  ctx.fillText('Drag to aim, release to drop', LOGICAL_W / 2, PLAY_AREA.y + PLAY_AREA.h / 2);
  ctx.font = '500 14px Fredoka, sans-serif';
  ctx.fillText('Match two balls to merge them', LOGICAL_W / 2, PLAY_AREA.y + PLAY_AREA.h / 2 + 24);
}

const END_TEXT = {
  won: { title: 'You redeemed!', text: "Discover games, play, redeem rewards. That's Scrambly." },
  lost: { title: 'So close!', text: 'The stack got too high. Try again, or see how Scrambly works.' },
};

// The HTML controls: the restart button, and the end screen with the CTA.
// Listeners are added once, with `signal`, and are never added again on restart.
export function createEndScreen(signal, { onRestart, onCta }) {
  const panel = document.getElementById('end');
  const ctaMessage = document.getElementById('cta-message');

  document.getElementById('restart').addEventListener('click', onRestart, { signal });
  document.getElementById('again').addEventListener('click', onRestart, { signal });
  document.getElementById('cta').addEventListener('click', () => {
    // Demo only: confirm on screen and let the game log it. The button has no link, so nothing navigates.
    ctaMessage.hidden = false;
    onCta();
  }, { signal });

  function show(status, balance) {
    if (!panel.hidden) return; // already showing
    document.getElementById('end-title').textContent = END_TEXT[status].title;
    document.getElementById('end-text').textContent = END_TEXT[status].text;
    document.getElementById('end-balance').textContent = `Demo balance: ${balance}`;
    panel.hidden = false;
  }

  function hide() {
    panel.hidden = true;
    ctaMessage.hidden = true;
  }

  return { show, hide };
}
