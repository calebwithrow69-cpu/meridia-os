export let RNG = Math.random;

// swaps the dice source (e.g. to a seeded RNG for a book NPC, then back) —
// a plain reassignment doesn't work once RNG is imported into other modules.
export function setRNG(fn) { RNG = fn; }

export function seededRNG(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export const d = (n) => Math.floor(RNG() * n) + 1;

export const pick = (a) => a[Math.floor(RNG() * a.length)];

export const chance = (p) => RNG() < p;

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export const fmt = (n) => (n >= 0 ? `+${n}` : `${n}`);

export const cap = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s);

export function weighted(pairs) {
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let r = RNG() * total;
  for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; }
  return pairs[0][0];
}

export function drawN(arr, n) {
  const pool = arr.slice(), out = [];
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(RNG() * pool.length), 1)[0]);
  return out;
}


