export let AC_CTX = null;

export let VOL = 1; // master volume, set from Config

// a plain reassignment doesn't work once VOL is imported into other modules.
export function setVol(v) { VOL = v; }

function ctx() {
  if (!AC_CTX) AC_CTX = new (window.AudioContext || window.webkitAudioContext)();
  if (AC_CTX.state === "suspended") AC_CTX.resume();
  return AC_CTX;
}

function safe(fn) { try { fn(); } catch (e) { /* audio unavailable; stay silent */ } }

/* A single filtered, softly-enveloped oscillator voice, with optional stereo placement and a
   quiet harmonic layer for body. The filter and the linear attack (instead of an instant jump
   to full gain) are what keep this from sounding like a bare system beep; `harmonic` adds a
   second voice an octave up at a fraction of the gain, which is what makes a tone sound
   synthesized/layered rather than a single flat pitch. */
function voice(ac, { freq, dur, type = "sine", gain = 0.05, slide = 0, filterHz = 3200, filterType = "lowpass", pan = 0, attack = 0.004, harmonic = 0 }) {
  const t0 = ac.currentTime;
  const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), p = ac.createStereoPanner();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  f.type = filterType; f.frequency.setValueAtTime(filterHz, t0);
  p.pan.setValueAtTime(pan, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(Math.max(0.0001, gain * VOL), t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(f); f.connect(g); g.connect(p); p.connect(ac.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
  if (harmonic) {
    const o2 = ac.createOscillator(), g2 = ac.createGain();
    o2.type = type; o2.frequency.setValueAtTime(freq * 2, t0);
    if (slide) o2.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 2 + slide * 2), t0 + dur);
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.linearRampToValueAtTime(Math.max(0.0001, gain * VOL * harmonic), t0 + attack);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.7);
    o2.connect(f); o2.connect(g2); g2.connect(p);
    o2.start(t0); o2.stop(t0 + dur * 0.7 + 0.02);
  }
}

/* A short burst of filtered noise. Combat impacts need a percussive transient a pure tone can't
   give them — this is the thing that makes a "hit" sound like it landed on something. */
function noiseBurst(ac, { dur = 0.08, gain = 0.05, filterHz = 1600, filterType = "bandpass", pan = 0 }) {
  const t0 = ac.currentTime;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = ac.createBufferSource(); src.buffer = buf;
  const f = ac.createBiquadFilter(); f.type = filterType; f.frequency.setValueAtTime(filterHz, t0);
  const g = ac.createGain(); g.gain.setValueAtTime(Math.max(0.0001, gain * VOL), t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const p = ac.createStereoPanner(); p.pan.setValueAtTime(pan, t0);
  src.connect(f); f.connect(g); g.connect(p); p.connect(ac.destination);
  src.start(t0);
}

// kept for anything reaching for a bare tone directly; SFX below covers the app's actual sounds.
export function tone(freq, dur, type = "square", gain = 0.04, slide = 0) {
  safe(() => voice(ctx(), { freq, dur, type, gain, slide, filterHz: 6000 }));
}

export const SFX = {
  // ---- interface: quiet, filtered, short — for navigation and bookkeeping ----
  tap: () => safe(() => voice(ctx(), { freq: 1500, dur: 0.045, type: "sine", gain: 0.028, filterHz: 4200 })),
  back: () => safe(() => voice(ctx(), { freq: 520, dur: 0.075, type: "triangle", gain: 0.03, slide: -180, filterHz: 2200 })),
  open: () => safe(() => {
    voice(ctx(), { freq: 660, dur: 0.06, type: "sine", gain: 0.032, filterHz: 3000, harmonic: 0.3 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 980, dur: 0.08, type: "sine", gain: 0.032, filterHz: 3400, harmonic: 0.3 })), 50);
  }),
  toggle: () => safe(() => voice(ctx(), { freq: 1650, dur: 0.025, type: "sine", gain: 0.02, filterHz: 5200 })),
  save: () => safe(() => {
    voice(ctx(), { freq: 740, dur: 0.06, type: "triangle", gain: 0.038, filterHz: 2600, harmonic: 0.25 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 1110, dur: 0.1, type: "triangle", gain: 0.038, filterHz: 3000, harmonic: 0.25 })), 55);
  }),
  alert: () => safe(() => {
    voice(ctx(), { freq: 300, dur: 0.13, type: "square", gain: 0.032, filterHz: 1700, pan: -0.15 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 250, dur: 0.16, type: "square", gain: 0.032, filterHz: 1700, pan: 0.15 })), 130);
  }),
  scan: () => safe(() => {
    voice(ctx(), { freq: 260, dur: 0.12, type: "triangle", gain: 0.03, slide: 900, filterHz: 2600 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 1100, dur: 0.06, type: "sine", gain: 0.025, filterHz: 3600 })), 100);
  }),
  muster: () => safe(() => [0, 55, 110, 165].forEach((t, i) => setTimeout(() => safe(() => voice(ctx(), { freq: 380 + i * 110, dur: 0.07, type: "triangle", gain: 0.028, filterHz: 2800, pan: -0.3 + i * 0.2 })), t))),

  // ---- combat: punchier, layered with a noise transient — for the fights themselves ----
  hit: () => safe(() => { noiseBurst(ctx(), { dur: 0.05, gain: 0.05, filterHz: 1900 }); voice(ctx(), { freq: 160, dur: 0.09, type: "sine", gain: 0.05, filterHz: 900 }); }),
  crit: () => safe(() => {
    noiseBurst(ctx(), { dur: 0.07, gain: 0.065, filterHz: 2400 });
    voice(ctx(), { freq: 130, dur: 0.17, type: "sine", gain: 0.06, filterHz: 1000 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 1400, dur: 0.12, type: "sine", gain: 0.03, filterHz: 4200, harmonic: 0.4 })), 30);
  }),
  fumble: () => safe(() => { voice(ctx(), { freq: 220, dur: 0.22, type: "sawtooth", gain: 0.035, slide: -150, filterHz: 900 }); noiseBurst(ctx(), { dur: 0.1, gain: 0.025, filterHz: 700 }); }),
  damage: () => safe(() => { noiseBurst(ctx(), { dur: 0.06, gain: 0.05, filterHz: 2200 }); voice(ctx(), { freq: 210, dur: 0.1, type: "sawtooth", gain: 0.04, slide: -90, filterHz: 1300 }); }),
  heal: () => safe(() => {
    voice(ctx(), { freq: 520, dur: 0.14, type: "sine", gain: 0.038, slide: 260, filterHz: 2600, harmonic: 0.3 });
    setTimeout(() => safe(() => voice(ctx(), { freq: 780, dur: 0.12, type: "sine", gain: 0.032, filterHz: 3000, harmonic: 0.3 })), 70);
  }),
  dying: () => safe(() => voice(ctx(), { freq: 190, dur: 0.4, type: "sine", gain: 0.045, slide: -100, filterHz: 700 })),
  death: () => safe(() => voice(ctx(), { freq: 120, dur: 0.6, type: "sine", gain: 0.045, slide: -60, filterHz: 500 })),
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
