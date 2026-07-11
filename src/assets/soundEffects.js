// soundEffects.js
// Lightweight sound effect utility using Web Audio API — no audio files needed.
// Usage: import { playSound } from './soundEffects'; playSound('correct');

let audioCtx = null;

function getContext() {
  // Lazy init — browsers block AudioContext until a user gesture happens
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function tone({ freq, duration, type = 'sine', delay = 0, volume = 0.2 }) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  // Envelope: quick attack, smooth release (avoids clicks/pops)
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime + 0.02);
}

const sounds = {
  // Short, clean tap — for selections/taps on choice, sort, tag steps
  tap: () => {
    tone({ freq: 600, duration: 0.06, type: 'sine', volume: 0.15 });
  },

  // Rising two-note chime — correct answer
  correct: () => {
    tone({ freq: 523.25, duration: 0.12, type: 'sine' }); // C5
    tone({ freq: 783.99, duration: 0.18, type: 'sine', delay: 0.1 }); // G5
  },

  // Short low thud — incorrect answer (not harsh, just clear feedback)
  incorrect: () => {
    tone({ freq: 180, duration: 0.18, type: 'triangle', volume: 0.18 });
  },

  // Ascending arpeggio — mission/level complete
  complete: () => {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      tone({ freq, duration: 0.15, type: 'sine', delay: i * 0.09 });
    });
  },

  // Soft click — Continue button activation
  continueEnabled: () => {
    tone({ freq: 440, duration: 0.08, type: 'sine', volume: 0.12 });
  },
};

export function playSound(name) {
  if (!sounds[name]) {
    console.warn(`playSound: unknown sound "${name}"`);
    return;
  }
  try {
    sounds[name]();
  } catch (err) {
    // Fails silently if AudioContext isn't allowed yet (no user gesture) — fine, just skip
    console.warn('playSound failed:', err);
  }
}

// Call once on first user interaction (e.g. first tap in the app) to unlock audio on iOS/Safari
export function unlockAudio() {
  getContext();
}