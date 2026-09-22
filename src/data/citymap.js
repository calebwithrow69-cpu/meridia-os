import { seededRNG, hashStr } from "../lib/rng.js";
import { DISTRICTS } from "./npc.js";
import { MAP_W, MAP_H, MAP_PINS, BUILDINGS } from "./citymap_gen.js";

/* Everything about a building except its shape.

   The shapes and coordinates live in citymap_gen.js, which is generated from the book's own art —
   see the header there. This file turns one of those footprints into something you can say out
   loud at the table: an address, what it looks like from the street, and what's behind the door.

   All of it is derived from the building's own id, with a local seeded RNG rather than the global
   one, so a building reads the same every time you tap it and looking at a building never disturbs
   the dice stream an NPC is being generated from. Nothing here is stored, so nothing can go stale.

   THE STREET NAMES AND HOUSE NUMBERS ARE PLACEHOLDERS. The address scheme is still Caleb's open
   decision (see CLAUDE.md) - these exist so the shape of the feature is testable, and the street
   list is invented, NOT from any reference book. The exterior and interior lines are our own
   flavour too; the only rules-bearing numbers below are the lock DCs, which use Shadowdark core's
   ladder (Easy 9 / Normal 12 / Hard 15 / Extreme 18). */

export { MAP_W, MAP_H, MAP_PINS, BUILDINGS };

// citymap_gen stores polygons flat ([x,y,x,y,...]) to keep the file small
export const polyPoints = (flat) => {
  let s = "";
  for (let i = 0; i < flat.length; i += 2) s += `${flat[i]},${flat[i + 1]} `;
  return s.trim();
};

/* Identity comes from the footprint's own position, not its index, so regenerating the geometry
   doesn't rename every building in the city and orphan anything keyed to one. Area is part of
   it because the rounded centroid alone collided for 3 pairs — a building sitting inside or
   around another can share a centre — and a collision means two different buildings on the map
   hand back the same address, interior and stock. */
export const bldgId = (b) => `b${b.d}${b.c[0]}x${b.c[1]}a${b.a}`;

const roll = (b, salt) => seededRNG(hashStr(bldgId(b) + salt));
const one = (rng, a) => a[Math.floor(rng() * a.length)];

/* 43 of the 50 book locations ARE a footprint, attached by containment when the geometry was
   traced (see citymap_gen's header). The other 7 are not single buildings — a bridge, a grove,
   a college precinct — so they have no entry here and stay marker-only. */
export const BLDG_BY_LOC = BUILDINGS.reduce((m, b) => { if (b.loc) m[b.loc] = b; return m; }, {});

export const BLDG_BY_DISTRICT = BUILDINGS.reduce((m, b) => {
  (m[b.d] = m[b.d] || []).push(b);
  return m;
}, {});

// NOT IN REFS — invented street names, pending Caleb's address scheme
const STREETS = {
  sil: ["Anvil Row", "Tinker's Walk", "Forgegate", "Pin Lane", "Coppersmith Row", "Bellows Way", "Quenching Stair"],
  roo: ["Cookpot Lane", "Market Stair", "Haggler's Row", "Tinny Walk", "The Shambles", "Coin Row", "Daisy Lane"],
  ged: ["Scholar's Walk", "Tower Row", "The Quadrangle", "Inkwell Lane", "Bellhouse Row", "Lecture Stair", "Chancellor's Way"],
  mon: ["Castle Approach", "Ducal Way", "Garrison Row", "The Lists", "Onyx Lane", "Marmot Court", "Silk Row"],
  hig: ["Harbor Promenade", "Jeweler's Walk", "Customs Row", "Gull Terrace", "Levantis Court", "Gargoyle Row", "The Grand Approach"],
  nin: ["Dolmen Walk", "Cathedral Row", "Pilgrim Stair", "Grove Lane", "Bell Row", "Ossuary Walk", "Hearth Lane"],
  gut: ["Bilge Row", "Ashfall Lane", "Rat Walk", "The Sump", "Cinder Row", "Skiff Lane", "Gallows Cut"],
  ril: ["Rope Walk", "Tallow Lane", "The Wash", "Red Lane", "Barrel Cut", "Piper's Stair", "Rilken Row"],
};

export function addressOf(b) {
  const rng = roll(b, "addr");
  const street = one(rng, STREETS[b.d] || STREETS.gut);
  const num = 1 + Math.floor(rng() * 96);
  return { num, street, district: DISTRICTS[b.d].name, line: `${num} ${street}` };
}

/* Thresholds are the terciles of the real footprint areas in citymap_gen, so the city
   comes out roughly a third hovels, a third middling, a third big. */
const SIZE = (a) => (a < 950 ? "small" : a < 1900 ? "mid" : "large");

const EXT = {
  Wealthy: {
    adj: { small: ["A narrow", "A neat", "A shuttered"], mid: ["A tall", "A well-kept", "A stone-fronted"], large: ["A broad", "A sprawling", "A colonnaded"] },
    mat: ["dressed ashlar", "pale limestone", "brick with stone quoins", "stuccoed stone", "carved sandstone"],
    kind: { small: ["counting-house", "gatehouse", "chapel", "coach house"], mid: ["townhouse", "hall", "guildhouse", "chambers"], large: ["mansion", "courtyard house", "institute", "great hall"] },
    roof: ["blue slate", "lead-seamed slate", "green copper", "a balustraded flat roof", "steep tile"],
    note: ["Iron railings, and a servant's door around the side.", "The windows are glazed — real glass, not horn.",
      "A lamp burns over the door all night.", "Someone has scrubbed a mark off the doorpost, recently.",
      "A brass plate by the bell, too weathered to read from the street.", "The step is swept and the boot-scraper polished."],
  },
  Working: {
    adj: { small: ["A squat", "A cramped", "A lopsided"], mid: ["A plain", "A tall", "A soot-streaked"], large: ["A long", "A wide", "A gated"] },
    mat: ["mortared rubble", "timber over a stone base", "lime-washed brick", "weathered board", "much-patched brick"],
    kind: { small: ["workshop", "stall-front", "lean-to", "store"], mid: ["shophouse", "workshop and dwelling", "yard house", "tenement"], large: ["warehouse", "workshop range", "manufactory", "cooperage"] },
    roof: ["grey slate", "clay tile", "tarred shingle", "a steep tiled gable"],
    note: ["A trade sign hangs off one hook.", "The shutters are bolted from the inside.",
      "Chalk tally marks climb the doorframe.", "Something is being hammered, steadily, out of sight.",
      "The yard gate is chained, but the chain is slack.", "A dog is tied in the entry and has opinions."],
  },
  Poor: {
    adj: { small: ["A narrow", "A sagging", "A half-collapsed"], mid: ["A crowded", "A tottering", "A soot-black"], large: ["A long", "A rambling", "A gutted"] },
    mat: ["tarred board", "salvaged ship-timber", "mud and lath", "crumbling brick", "stacked rubble and pitch"],
    kind: { small: ["hovel", "shack", "cellar entry", "hutch"], mid: ["tenement", "rookery", "doss house", "divided house"], large: ["rookery block", "warren", "tenement row", "burnt-out range"] },
    roof: ["patched sailcloth", "mossed thatch", "scavenged tile", "a swaybacked shingle roof", "bare rafters and oilcloth"],
    note: ["The door has been forced before, and badly rehung.", "Three families' worth of washing on one line.",
      "No shutters — the windows are stuffed with rag.", "Someone sleeps in the doorway and will not be moved.",
      "The stink of the canal never quite leaves it.", "A hole in the wall, boarded over from the inside."],
  },
};

export function exteriorOf(b) {
  const rng = roll(b, "ext");
  const t = EXT[DISTRICTS[b.d].cls] || EXT.Working;
  const sz = SIZE(b.a);
  const adj = one(rng, t.adj[sz]), mat = one(rng, t.mat), kind = one(rng, t.kind[sz]);
  const roof = one(rng, t.roof), note = one(rng, t.note);
  return { text: `${adj} ${mat} ${kind} under ${roof}. ${note}`, size: sz };
}

const FLOORS = { small: [1, 1, 1, 2], mid: [1, 2, 2, 3], large: [2, 2, 3, 3] };
// DCs are Shadowdark core's ladder: Easy 9, Normal 12, Hard 15, Extreme 18
const LOCKS = [["Unlocked", 0], ["Latched", 9], ["Locked", 12], ["Locked and barred", 15], ["Warded", 18]];

export const lockLine = (inn) => (inn.lockDC ? `${inn.lock} — DC ${inn.lockDC} to pick or force` : "Unlocked");
const STATE = [["lived in", 58], ["shut up for now", 14], ["working premises", 14], ["abandoned", 8], ["guarded", 6]];
const SOUND = ["nothing — which is its own answer", "a chair scraping, once", "two people arguing in another room",
  "a baby, and someone shushing it", "hammering, slow and even", "a dog scrabbling at the far side of the door",
  "somebody counting coins", "water dripping into water", "a hymn, badly sung"];
const SMELL = ["wet plaster and old smoke", "boiled cabbage", "tallow and hot iron", "river-rot", "incense, and under it something worse",
  "fresh sawdust", "spilled beer gone sour", "lye and clean linen", "grease and unwashed bedding"];
const WAYS = ["a front door onto the street", "a back door into the yard", "a shuttered window at head height",
  "a coal hatch at pavement level", "a roof hatch, reachable from next door", "a cellar grate, rusted through"];

function pickW(rng, pairs) {
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let r = rng() * total;
  for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; }
  return pairs[0][0];
}

/* `trading` comes from the caller because deciding what a building sells needs the shop tables,
   and those import this file. A building with stock on its shelves cannot also be abandoned or
   shut up, and somebody has to be behind the counter — without this the jeweller read
   "Abandoned · Nobody" directly above seven priced lines. */
export function interiorOf(b, { trading = false } = {}) {
  const rng = roll(b, "int");
  const sz = SIZE(b.a);
  const state = trading ? "working premises" : pickW(rng, STATE);
  const floors = one(rng, FLOORS[sz]);
  const cellar = rng() < (DISTRICTS[b.d].cls === "Poor" ? 0.45 : 0.3);
  const lock = state === "abandoned" ? one(rng, [LOCKS[0], LOCKS[1]])
    : state === "guarded" ? one(rng, [LOCKS[3], LOCKS[4]])
      : one(rng, [LOCKS[1], LOCKS[2], LOCKS[2], LOCKS[3]]);
  const heads = state === "abandoned" ? 0
    : state === "shut up for now" ? Math.floor(rng() * 2)
      : Math.max(trading ? 1 : 0, 1 + Math.floor(rng() * (sz === "large" ? 9 : sz === "mid" ? 5 : 3)));
  const ways = [WAYS[0]];
  for (let i = 1; i < WAYS.length; i++) if (rng() < 0.32) ways.push(WAYS[i]);
  return {
    state, floors, cellar, lock: lock[0], lockDC: lock[1], heads,
    sound: one(rng, SOUND), smell: one(rng, SMELL), ways,
  };
}

/* For clicks that land on a street rather than a footprint — keeps the map from feeling dead
   when you tap between buildings. Returns null past `max` so open ground still reads as open. */
export function nearestBldg(x, y, max = 46) {
  let best = null, bd = max * max;
  for (const b of BUILDINGS) {
    const dx = b.c[0] - x, dy = b.c[1] - y, d2 = dx * dx + dy * dy;
    if (d2 < bd) { bd = d2; best = b; }
  }
  return best;
}
