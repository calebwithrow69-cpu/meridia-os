export let AC_CTX = null;

export let VOL = 1; // master volume, set from Config

// a plain reassignment doesn't work once VOL is imported into other modules.
export function setVol(v) { VOL = v; }

export function tone(freq, dur, type = "square", gain = 0.04, slide = 0) {
  try {
    if (!AC_CTX) AC_CTX = new (window.AudioContext || window.webkitAudioContext)();
    if (AC_CTX.state === "suspended") AC_CTX.resume();
    const o = AC_CTX.createOscillator(), g = AC_CTX.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, AC_CTX.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), AC_CTX.currentTime + dur);
    g.gain.setValueAtTime(gain * VOL, AC_CTX.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, AC_CTX.currentTime + dur);
    o.connect(g); g.connect(AC_CTX.destination);
    o.start(); o.stop(AC_CTX.currentTime + dur);
  } catch (e) { /* audio unavailable; stay silent */ }
}

export const SFX = {
  tap: () => tone(880, 0.05, "square", 0.025),
  back: () => tone(420, 0.06, "square", 0.025, -120),
  open: () => { tone(620, 0.05, "square", 0.03); setTimeout(() => tone(930, 0.07, "square", 0.03), 45); },
  scan: () => { tone(300, 0.1, "sawtooth", 0.03, 700); setTimeout(() => tone(1200, 0.06, "square", 0.025), 100); },
  save: () => { tone(700, 0.05, "triangle", 0.04); setTimeout(() => tone(1050, 0.09, "triangle", 0.04), 55); },
  alert: () => { tone(220, 0.14, "sawtooth", 0.05); setTimeout(() => tone(180, 0.18, "sawtooth", 0.05), 130); },
  toggle: () => tone(1150, 0.03, "square", 0.02),
  muster: () => { [0, 60, 120, 180].forEach((t, i) => setTimeout(() => tone(400 + i * 130, 0.06, "square", 0.028), t)); },
};


export function copyText(t, done) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => done(true)).catch(() => done(false));
      return;
    }
  } catch (e) { /* no clipboard in this frame */ }
  done(false);
}


