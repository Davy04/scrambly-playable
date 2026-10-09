import { FOX } from './config.js';

export function createFox(image) {
  let time = 0;
  let hopLeft = 0;
  let hopHeight = 0;
  let stackHighFor = 0;
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

function drawSweatDrop(ctx, time) {
  const progress = (time % 0.8) / 0.8;
  ctx.globalAlpha = 1 - progress;
  ctx.fillStyle = '#9FD8FF';
  ctx.beginPath();
  ctx.ellipse(FOX.centerX + 34, FOX.bottomY - FOX.height + 30 + progress * 16, 3, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// The in-game buttons: swap (an invisible button over the Next bubble), shake, and the tutorial's Play.
// Listeners are added once, with `signal`, and are never added again on restart.
export function createControls(signal, { onSwap, onShake }) {
  const shakeButton = document.getElementById('shake');
  document.getElementById('swap').addEventListener('click', onSwap, { signal });
  shakeButton.addEventListener('click', onShake, { signal });

  // The tutorial covers the game when the page loads. A restart does not bring it back.
  const tutorial = document.getElementById('tutorial');
  document.getElementById('tutorial-play').addEventListener('click', () => {
    tutorial.hidden = true;
  }, { signal });

  function setShakes(count) {
    shakeButton.textContent = `Shake x${count}`;
    shakeButton.disabled = count === 0;
  }

  return { setShakes };
}

const END_TEXT = {
  won: { title: 'You redeemed!', text: "Discover games, play, redeem rewards. That's Scrambly." },
  lost: { title: 'So close!', text: 'The stack got too high. Try again, or see how Scrambly works.' },
};

// Listeners are added once, with `signal`, and are never added again on restart.
export function createEndScreen(signal, { onRestart, onCta }) {
  const panel = document.getElementById('end');
  const ctaMessage = document.getElementById('cta-message');
  const steps = [...document.getElementById('end-steps').children];

  document.getElementById('restart').addEventListener('click', onRestart, { signal });
  document.getElementById('again').addEventListener('click', onRestart, { signal });
  document.getElementById('cta').addEventListener('click', () => {
    // Demo only: confirm on screen and let the game log it. The button has no link, so nothing navigates.
    ctaMessage.hidden = false;
    onCta();
  }, { signal });

  function show(status, balance, stepsReached) {
    if (!panel.hidden) return;
    document.getElementById('end-title').textContent = END_TEXT[status].title;
    document.getElementById('end-text').textContent = END_TEXT[status].text;
    steps.forEach((step, index) => step.classList.toggle('reached', index < stepsReached));
    document.getElementById('end-balance').textContent = `Demo balance: ${balance}`;
    panel.hidden = false;
  }

  function hide() {
    panel.hidden = true;
    ctaMessage.hidden = true;
  }

  return { show, hide };
}
