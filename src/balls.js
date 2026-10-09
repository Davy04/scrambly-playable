import { LEVELS } from './config.js';

// Each ball is drawn inside a circle of radius 1 centered at (0, 0); drawBall scales it to the real size.
const DETAILS = [
  drawGolfDimples,
  drawBilliardSpot,
  drawTennisSeams,
  drawBowlingHoles,
  drawSoccerPatches,
  drawBasketballLines,
  drawTokenStar,
  drawCoinStar,
];

const DARK = 'rgba(32, 19, 56, 0.75)';
const WHITE = '#FFF6E8';
const OUTLINE_WIDTH = 2;

function darken(hex, factor) {
  const channels = [1, 3, 5].map((start) => Math.round(parseInt(hex.slice(start, start + 2), 16) * factor));
  return `rgb(${channels.join(', ')})`;
}

const OUTLINES = LEVELS.map((level) => darken(level.color, 0.45));

export function drawBall(ctx, x, y, level, { scale = 1, angle = 0, squash = 0, squashAngle = 0, alpha = 1 } = {}) {
  const { radius, color } = LEVELS[level - 1];
  const detail = DETAILS[level - 1];

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (squash > 0) {
    ctx.rotate(squashAngle);
    ctx.scale(1 - squash, 1 + squash);
    ctx.rotate(-squashAngle);
  }
  ctx.scale(radius * scale, radius * scale);

  fillCircle(ctx, 0.05, 0.1, 1.02, 'rgba(32, 19, 56, 0.25)');

  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.save();
  ctx.clip();

  // The detail turns with the physics body; the light and shadow below stay fixed.
  ctx.save();
  ctx.rotate(angle);
  detail(ctx);
  ctx.restore();
  drawShading(ctx);
  ctx.restore(); // removes the clip

  // Outline. The path is built again because the detail and shading drew other paths.
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2);
  ctx.lineWidth = OUTLINE_WIDTH / (radius * scale); // the context is scaled, so convert pixels back
  ctx.strokeStyle = OUTLINES[level - 1];
  ctx.stroke();
  ctx.restore();
}

function drawShading(ctx) {
  const shade = ctx.createRadialGradient(-0.35, -0.4, 0.1, 0, 0, 1);
  shade.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  shade.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.28)');
  ctx.fillStyle = shade;
  ctx.fillRect(-1, -1, 2, 2);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath();
  ctx.ellipse(-0.42, -0.5, 0.26, 0.14, -0.6, 0, Math.PI * 2);
  ctx.fill();
}

function fillCircle(ctx, x, y, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function fillStar(ctx, outerRadius, color) {
  const innerRadius = outerRadius * 0.45;
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const pointAngle = (i * Math.PI) / 5 - Math.PI / 2;
    ctx.lineTo(Math.cos(pointAngle) * radius, Math.sin(pointAngle) * radius);
  }
  ctx.closePath();
  ctx.fill();
}

function drawGolfDimples(ctx) {
  for (const [x, y] of [[0, 0], [0.45, 0.1], [-0.45, 0.15], [0.15, 0.5], [-0.2, -0.45], [0.4, -0.4], [-0.3, 0.6]]) {
    fillCircle(ctx, x, y, 0.1, 'rgba(32, 19, 56, 0.16)');
  }
}

function drawBilliardSpot(ctx) {
  fillCircle(ctx, 0, 0, 0.45, WHITE);
}

function drawTennisSeams(ctx) {
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 0.1;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * 1.15, 0, 0.75, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawBowlingHoles(ctx) {
  for (const [x, y] of [[-0.2, -0.3], [0.2, -0.3], [0, 0.08]]) {
    fillCircle(ctx, x, y, 0.11, DARK);
  }
}

function drawSoccerPatches(ctx) {
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 0.05;
  fillPentagon(ctx, 0, 0, 0.34, Math.PI);
  for (let i = 0; i < 5; i++) {
    const cornerAngle = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const x = Math.cos(cornerAngle);
    const y = Math.sin(cornerAngle);
    ctx.beginPath();
    ctx.moveTo(x * 0.34, y * 0.34);
    ctx.lineTo(x * 0.7, y * 0.7);
    ctx.stroke();
    fillPentagon(ctx, x, y, 0.36, cornerAngle - Math.PI / 2);
  }
}

function fillPentagon(ctx, x, y, radius, turn) {
  ctx.fillStyle = DARK;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const cornerAngle = (i * Math.PI * 2) / 5 + Math.PI / 2 + turn;
    ctx.lineTo(x + Math.cos(cornerAngle) * radius, y + Math.sin(cornerAngle) * radius);
  }
  ctx.closePath();
  ctx.fill();
}

function drawBasketballLines(ctx) {
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 0.07;
  ctx.beginPath();
  ctx.moveTo(-1, 0);
  ctx.lineTo(1, 0);
  ctx.moveTo(0, -1);
  ctx.lineTo(0, 1);
  ctx.stroke();
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.arc(side * 1.25, 0, 0.85, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTokenStar(ctx) {
  fillCircle(ctx, 0, 0, 0.78, '#B896F7');
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = 0.06;
  ctx.beginPath();
  ctx.arc(0, 0, 0.78, 0, Math.PI * 2);
  ctx.stroke();
  fillStar(ctx, 0.5, WHITE);
}

// Our own coin: a ring and a star. It does not copy the symbol on the coins in the fox artwork.
function drawCoinStar(ctx) {
  fillCircle(ctx, 0, 0, 0.76, '#FFD76A');
  ctx.strokeStyle = '#F58324';
  ctx.lineWidth = 0.09;
  ctx.beginPath();
  ctx.arc(0, 0, 0.76, 0, Math.PI * 2);
  ctx.stroke();
  fillStar(ctx, 0.52, '#F58324');
}
