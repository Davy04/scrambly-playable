import { LOGICAL_W, LOGICAL_H } from './config.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Converts a pointer event from CSS pixels on the page to logical game pixels.
// Clamped because pointer capture keeps sending events while the pointer is outside the canvas.
export function toLogical(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * LOGICAL_W, 0, LOGICAL_W),
    y: clamp(((event.clientY - rect.top) / rect.height) * LOGICAL_H, 0, LOGICAL_H),
  };
}

// Tracks one pointer (mouse or first finger) on the canvas.
// Every listener uses `signal`, so aborting it removes them all at once.
export function createPointer(canvas, signal) {
  // `released` is set by a real lift only. The game reads it and sets it back to false.
  const pointer = { x: LOGICAL_W / 2, y: LOGICAL_H / 2, down: false, released: false };

  function move(event) {
    if (!event.isPrimary) return;
    Object.assign(pointer, toLogical(canvas, event));
  }

  function press(event) {
    if (!event.isPrimary) return;
    // Capture keeps move/up events coming even if the pointer leaves the canvas.
    canvas.setPointerCapture(event.pointerId);
    pointer.down = true;
    move(event);
  }

  // A real lift: the only event that asks the game to drop.
  function lift(event) {
    if (!event.isPrimary || !pointer.down) return;
    move(event);
    pointer.released = true;
    release();
  }

  // Interruptions end the press without a drop, so the ball stays in hand.
  function release() {
    pointer.down = false;
  }

  canvas.addEventListener('pointerdown', press, { signal });
  canvas.addEventListener('pointermove', move, { signal });
  canvas.addEventListener('pointerup', lift, { signal });
  canvas.addEventListener('pointercancel', release, { signal });
  canvas.addEventListener('lostpointercapture', release, { signal });
  window.addEventListener('blur', release, { signal });

  // iOS Safari ignores user-scalable=no; this blocks its pinch-zoom gesture.
  document.addEventListener('gesturestart', (event) => event.preventDefault(), { signal });
  // Long-press (touch) or right-click would open a menu over the game.
  canvas.addEventListener('contextmenu', (event) => event.preventDefault(), { signal });

  return pointer;
}
