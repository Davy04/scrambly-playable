const POP_URL = 'assets/audio/bubble-pop.mp3';
const MUSIC_URL = 'assets/audio/music-loop.mp3';
const VOLUME = 0.5;
const MUSIC_VOLUME = 0.25; // relative to the sound effects, so the music stays behind them
const WIN_NOTES = [523, 659, 784, 1047]; // Hz: C, E, G and the next C

// Sound effects and background music. The merge pop and the music are recorded files;
// the other effects are short tones made with oscillators.
// Created once at page load; a restart does not touch it.
export function createAudio(signal) {
  let context = null; // created on the first press: browsers block audio before a user gesture
  let master = null;
  let popBuffer = null;
  let muted = false;
  let paused = false;

  function unlock() {
    if (context) {
      if (!paused) context.resume(); // iOS can suspend the context by itself
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.value = muted ? 0 : VOLUME;
    master.connect(context.destination);
    load(POP_URL).then((buffer) => { popBuffer = buffer; }).catch(() => {});
    load(MUSIC_URL).then(startMusic).catch(() => {});
  }

  // Local files, so no external request. The game works without them if loading fails.
  function load(url) {
    return fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => context.decodeAudioData(data));
  }

  // Started once and never stopped: mute and pause act on everything through `master` and the context.
  function startMusic(buffer) {
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = MUSIC_VOLUME;
    source.connect(gain);
    gain.connect(master);
    source.start();
  }

  // One tone that fades out. `slideTo` bends the pitch, `delay` (seconds) schedules it later.
  function tone(frequency, duration, { slideTo = frequency, delay = 0, type = 'sine' } = {}) {
    if (!context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0.3, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  function drop() {
    tone(320, 0.12, { slideTo: 140 });
  }

  // The pop plays faster, so higher, for each level: a chain of merges sounds like progress.
  function merge(level) {
    if (!popBuffer) return;
    const source = context.createBufferSource();
    source.buffer = popBuffer;
    source.playbackRate.value = 0.75 + level * 0.09;
    source.connect(master);
    source.start();
  }

  function swap() {
    tone(520, 0.08, { slideTo: 700 });
  }

  function shake() {
    tone(140, 0.3, { slideTo: 60, type: 'triangle' });
  }

  function milestone() {
    tone(660, 0.12, { type: 'triangle' });
    tone(880, 0.2, { type: 'triangle', delay: 0.1 });
  }

  function win() {
    WIN_NOTES.forEach((note, index) => tone(note, 0.25, { type: 'triangle', delay: index * 0.1 }));
  }

  function lose() {
    tone(300, 0.6, { slideTo: 90, type: 'triangle' });
  }

  // Called when the page is hidden or the rotate prompt is up: suspending stops every sound at once.
  function setPaused(value) {
    paused = value;
    if (!context) return;
    if (paused) context.suspend();
    else context.resume();
  }

  const muteButton = document.getElementById('mute');
  muteButton.addEventListener('click', () => {
    muted = !muted;
    if (master) master.gain.value = muted ? 0 : VOLUME;
    muteButton.textContent = muted ? 'Sound off' : 'Sound on';
    muteButton.setAttribute('aria-pressed', String(muted));
  }, { signal });
  window.addEventListener('pointerdown', unlock, { signal });

  return { drop, swap, shake, merge, milestone, win, lose, setPaused };
}
