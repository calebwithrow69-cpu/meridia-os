import { seededRNG, hashStr } from "../lib/rng.js";
import { DISTRICTS, SHOP_SIGN_A, SHOP_SIGN_B, SHOP_QUIRK, SHOP_WONT, locByN } from "./npc.js";
import { ITEMS } from "./items_gen.js";
import { BUILDINGS } from "./citymap_gen.js";
import { bldgId } from "./citymap.js";

/* What a building sells.

   Shop TYPES are canon: the compilation's §34 lists them by district tier, straight out of the
   book, and the tavern food and drink tables below are §33. Neither should be edited to taste.

   Shop STOCK for ordinary trades is not canon. Those item tables come from
   equipment-emporium-shadowdark.md, which is adapted from Basic Fantasy RPG with hand-tuned
   prices, and the trade -> category mapping is our reading of that file's own §21 "what goes in
   which shop". Every generated line carries a `canon` flag so the UI can mark house prices
   apart from core ones, and nothing homebrew is ever shown as if it came from the rulebook.

   Everything is derived from the building's id and the day number through a local seeded RNG,
   so a shop holds still while the party is in it, rerolls on NEXT DAY, and never needs saving.
   Nothing here touches the global dice stream an NPC is generated from. */

const roll = (b, salt) => seededRNG(hashStr(`${bldgId(b)}:${salt}`));
const one = (rng, a) => a[Math.floor(rng() * a.length)];
const someOf = (rng, a, n) => {
  const pool = [...a], out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
};

/* §34 SHOPS — types by district tier. CANON. */
export const SHOP_TYPES = {
  Poor: ["filthy bakery", "used gear", "corpse collector", "pawn shop", "moneylender",
    "manure yard", "tannery", "back-alley chirurgeon", "ratcatcher", "fishmonger",
    "gambling house", "drug den"],
  Working: ["brewer", "butcher", "tailor", "blacksmith", "adventuring gear", "leatherworker",
    "shipwright", "stonemason", "herald", "livestock"],
  Wealthy: ["fine tailor", "glassblower", "jeweler", "apothecary", "artist", "scribe",
    "guildhall", "goldsmith", "master blacksmith", "antiques and curios"],
};

/* §33 TAVERNS — CANON. Food price is rolled per serving; drinks carry the book's own effects. */
const TAVERN_FOOD = {
  Poor: ["Boiled cabbage", "Dates and olives", "Goat stew", "Pickled eggs", "Cheese and bread",
    "Hearty broth", "Meat pastry", "Mushroom kebab", "Roasted pigeon", "Garlic flatbread",
    "Turkey leg", "Rat-on-a-stick"],
  Standard: ["Alligator steak", "Rosemary ham", "Raw flailfish", "Seared venison",
    "Buttered ostrich", "Spicy veal curry", "Salted frog legs", "Herbed snails",
    "Grilled tiger eel", "Spit-roasted boar", "Saffron duck neck", "Crimson pudding"],
  Wealthy: ["Fried basilisk eyes", "Giant snake filet", "Griffon eggs", "Candied scarabs",
    "Baked troll bones", "Cockatrice wings", "Crispy silkworms", "Roasted stingbat",
    "Dire lobster tail", "Wyvern tongue", "Shrieking seaweed", "Dragon shanks"],
};
const FOOD_DIE = { Poor: [4, 1, "cp"], Standard: [6, 10, "sp"], Wealthy: [8, 100, "gp"] };

const TAVERN_DRINK = [
  ["Barnacle grog", 1, "1 cp", "DC 9 CON or blind 1 hour"],
  ["Watered swill", 3, "3 cp", "−1 CON for 1 hour"],
  ["Vinegary wine", 5, "5 cp", "−1 CHA for 1 hour"],
  ["Stale ale", 5, "5 cp", "−1 WIS for 1 hour"],
  ["Clear spirits", 10, "1 sp", "ends one bad effect"],
  ["House ale", 20, "2 sp", "first one free"],
  ["Autumn mead", 30, "3 sp", "doubles the next drink's effect"],
  ["Halfling summer wine", 50, "5 sp", "+1 CHA for 1 hour"],
  ["Elvish brandy", 50, "5 sp", "+1 INT for 1 hour"],
  ["Dwarvish gold ale", 50, "5 sp", "regain 1d4 HP per mug"],
  ["Aged royal wine", 200, "2 gp", "+1 WIS for 1 hour"],
  ["Van Dinkle whiskey", 2000, "20 gp/sip", "only 5 bottles were ever made; +1 XP"],
];
/* §33: Poor 2 drinks + 3 Poor foods; Standard 3 drinks + 1 Poor and 2 Standard; Wealthy 4
   drinks + 2 Standard and 2 Wealthy. */
const TAVERN_MIX = {
  Poor: { drinks: 2, food: [["Poor", 3]] },
  Working: { drinks: 3, food: [["Poor", 1], ["Standard", 2]] },
  Wealthy: { drinks: 4, food: [["Standard", 2], ["Wealthy", 2]] },
};

/* Which item categories each trade draws from, and the price band it deals in, in copper.
   The band is what keeps a Gutterwash stall from offering plate mail, so tier tags can stay
   generous. NOT IN REFS as a mapping — read off the emporium's §21. */
const STOCK = {
  "filthy bakery":         { c: ["food"], hi: 300 },
  "used gear":             { c: ["gear", "weapon", "armor"], hi: 250, worn: 1 },
  "corpse collector":      { c: ["clothing", "trade"], hi: 200, worn: 1 },
  "pawn shop":             { c: ["jewelry", "gear", "household", "art", "music", "weapon"], hi: 4000, cut: 0.45 },
  moneylender:             { c: ["service", "trade"], hi: 2000 },
  "manure yard":           { c: ["trade", "tack"], hi: 200 },
  tannery:                 { c: ["trade", "clothing"], hi: 600 },
  "back-alley chirurgeon": { c: ["health", "arcane"], hi: 400 },
  ratcatcher:              { c: ["animal", "gear"], hi: 400 },
  fishmonger:              { c: ["food", "tools"], hi: 300 },
  "gambling house":        { c: ["games"], hi: 4000 },
  "drug den":              { c: ["food", "arcane"], hi: 800 },

  brewer:                  { c: ["drink"], lo: 100, hi: 30000 },
  butcher:                 { c: ["food"], hi: 600 },
  tailor:                  { c: ["clothing"], hi: 1500 },
  blacksmith:              { c: ["tools", "weapon", "armor"], hi: 2000 },
  "adventuring gear":      { c: ["gear", "thief"], hi: 3000 },
  leatherworker:           { c: ["clothing", "trade", "tack"], hi: 1500 },
  shipwright:              { c: ["tools", "trade", "vehicle"], hi: 4000 },
  stonemason:              { c: ["tools"], hi: 1500 },
  herald:                  { c: ["service"], hi: 600 },
  livestock:               { c: ["animal", "tack"], hi: 6000 },

  "fine tailor":           { c: ["clothing"], lo: 200, hi: 20000 },
  glassblower:             { c: ["household", "gear"], sub: ["optical-measuring", "vessels-containers"], lo: 50, hi: 8000 },
  jeweler:                 { c: ["jewelry", "trade"], lo: 100, hi: 20000 },
  apothecary:              { c: ["arcane", "health"], hi: 4000 },
  artist:                  { c: ["art", "music"], lo: 100, hi: 60000 },
  scribe:                  { c: ["gear", "arcane"], sub: ["writing-records", "wizards-scholars-equipment"], hi: 4000 },
  guildhall:               { c: ["service", "trade"], hi: 8000 },
  goldsmith:               { c: ["jewelry", "trade", "household"], lo: 200, hi: 30000 },
  "master blacksmith":     { c: ["tools", "weapon", "armor"], lo: 100, hi: 20000 },
  "antiques and curios":   { c: ["art", "household", "music", "jewelry"], lo: 200, hi: 60000 },
};

/* A book location whose kind tags name a trade gets that trade, so The Royal Jeweler is a
   jeweler and Cork & Pestle is an apothecary. A bare "shop" or "market" tag says it trades
   but not in what, so those roll a trade from their district's canon list and keep their name. */
const KIND_TRADE = { jeweler: "jeweler", apothecary: "apothecary", smithy: "blacksmith",
  tailor: "tailor", bank: "moneylender" };
const KIND_ANY = ["shop", "market"];

/* Where the book's own entry says plainly what a place deals in, use it instead of rolling.
   This is reading the book, not inventing: #16 has "an unidentified Mirror of Mischief in the
   back", #34 is "the city's best fence", #45 sells elvish teapots, #47 has "bloodroot behind
   the cookware". Rolling had made Zameek's Curios a master blacksmith and the city's best
   fence a tannery. A null means it trades in services or spectacle, not stock. */
const LOC_TRADE = {
  16: "antiques and curios", 34: "pawn shop", 44: "adventuring gear", 45: "antiques and curios",
  47: "adventuring gear", 41: "jeweler", 46: null, 49: null, 39: "moneylender",
};

/* District wealth decides which canon list a trade comes from, and which emporium tier tags the
   stock may carry. A richer quarter still sells staples, so the sets run downward -- the [H]
   tag is used sparingly in the emporium (luxuries only), and a High Harbor blacksmith that
   accepted [H] alone found literally nothing to sell. Price bands do the wealth gating. */
const TIER_TAGS = { hig: "MUH", ged: "MU", nin: "MU", mon: "MU", sil: "PM", roo: "PM", gut: "P", ril: "P" };

const SHOP_CHANCE = 0.2;   // roughly one building in five is a trade premises

/* Shelves are filled once a week, not once a day. What the party buys is gone until the next
   restock, so a scarce item stays scarce and hunting one across districts becomes real play.
   The period is derived from the day rather than stored, so there is no restock bookkeeping to
   get out of step: the ledger of what has been bought records which period it belongs to, and
   anything older is simply dropped. */
export const RESTOCK_EVERY = 7;
export const stockPeriod = (day) => Math.floor((Math.max(1, day) - 1) / RESTOCK_EVERY);
export const nextRestockDay = (day) => (stockPeriod(day) + 1) * RESTOCK_EVERY + 1;
export const daysToRestock = (day) => nextRestockDay(day) - day;

export function tradeOf(b) {
  const loc = b.loc ? locByN(b.loc) : null;
  const cls = DISTRICTS[b.d].cls;
  if (loc) {
    if (loc.n in LOC_TRADE) {
      const t = LOC_TRADE[loc.n];
      return t ? { type: t, name: loc.name, fromBook: true } : null;
    }
    if (loc.k.includes("tavern")) return { type: "tavern", name: loc.name, fromBook: true };
    const named = loc.k.find((k) => KIND_TRADE[k]);
    if (named) return { type: KIND_TRADE[named], name: loc.name, fromBook: true };
    if (loc.k.some((k) => KIND_ANY.includes(k)))
      return { type: one(roll(b, "trade"), SHOP_TYPES[cls] || SHOP_TYPES.Working), name: loc.name, fromBook: true };
    return null;                          // a temple, a gaol or a graveyard is not a shop
  }
  const rng = roll(b, "trade");
  if (rng() > SHOP_CHANCE) return null;
  const type = one(rng, SHOP_TYPES[cls] || SHOP_TYPES.Working);
  return { type, name: `${one(rng, SHOP_SIGN_A)} ${one(rng, SHOP_SIGN_B)}`, fromBook: false };
}

const POOL = {};
function poolFor(type, tags) {
  const key = `${type}|${tags}`;
  if (POOL[key]) return POOL[key];
  const spec = STOCK[type];
  if (!spec) return (POOL[key] = []);
  const ok = (it) => spec.c.includes(it.c) && [...it.t].some((ch) => tags.includes(ch)) &&
    it.cp >= (spec.lo || 0) && it.cp <= spec.hi;
  let list = ITEMS.filter(ok);
  if (spec.sub) {
    const narrow = list.filter((it) => it.sub && spec.sub.includes(it.sub));
    if (narrow.length >= 6) list = narrow;
  }
  return (POOL[key] = list);
}

export const coin = (cp) => {
  if (cp >= 100) { const g = cp / 100; return `${g % 1 ? g.toFixed(1) : g} gp`; }
  if (cp >= 10) { const s = cp / 10; return `${s % 1 ? s.toFixed(1) : s} sp`; }
  // a fence's cut can land under a copper, which still costs a copper — but zero is zero
  return `${cp <= 0 ? 0 : Math.max(1, Math.round(cp))} cp`;
};

/* A kitchen and a cellar don't run out the way a shelf does, so tavern lines have no count and
   never sell out — buying one is paying for a round, not taking the last of it. */
function tavernStock(b, day, tr) {
  const cls = DISTRICTS[b.d].cls;
  const mix = TAVERN_MIX[cls] || TAVERN_MIX.Working;
  const rng = roll(b, `tavern:${stockPeriod(day)}`);
  const out = someOf(rng, TAVERN_DRINK, mix.drinks).map(([n, cp, p, note]) =>
    ({ n, cp, price: p, note, canon: true, drink: true, unlimited: true }));
  for (const [tier, n] of mix.food) {
    const [die, mult, unit] = FOOD_DIE[tier];
    for (const name of someOf(rng, TAVERN_FOOD[tier], n)) {
      const r = 1 + Math.floor(rng() * die);
      out.push({ n: name, cp: r * mult, price: `${r} ${unit}`, note: `${tier.toLowerCase()} fare`,
        canon: true, food: true, unlimited: true });
    }
  }
  return { ...tr, tavern: true, tier: cls, stock: out, spent: 0,
    quirk: one(roll(b, "quirk"), SHOP_QUIRK), wont: one(roll(b, "wont"), SHOP_WONT) };
}

/* `market` is the whole saved ledger — { period, sold: { bldgId: { "item name": qty } } }.
   Stock itself is still derived rather than stored; only what the party has actually bought is
   kept, so the save stays tiny and a shop nobody has visited costs nothing.

   The stale-period check lives HERE, beside the period logic that defines it, rather than in
   the caller. A ledger from an earlier week must be ignored or a sold-out item stays sold out
   for ever, and a guard sitting in the UI is one forgetful caller away from that bug. */
export function soldAt(b, day, market) {
  if (!market || market.period !== stockPeriod(day)) return null;
  return (market.sold || {})[bldgId(b)] || null;
}

export function stockOf(b, day, market = null) {
  const tr = tradeOf(b);
  if (!tr) return null;
  if (tr.type === "tavern") return tavernStock(b, day, tr);
  const sold = soldAt(b, day, market);

  const spec = STOCK[tr.type] || {};
  const pool = poolFor(tr.type, TIER_TAGS[b.d] || "PM");
  const rng = roll(b, `stock:${stockPeriod(day)}`);
  const want = 3 + Math.floor(rng() * 5);                   // 3-7 lines on the shelf
  const picks = [], used = new Set();
  for (let guard = 0; picks.length < want && guard < want * 12 && pool.length; guard++) {
    const it = pool[Math.floor(rng() * pool.length)];
    if (used.has(it.n)) continue;
    used.add(it.n);
    let cp = it.hi ? it.cp + Math.floor(rng() * (it.hi - it.cp + 1)) : it.cp;
    if (it.plus) cp = Math.round(cp * (1 + rng() * 0.6));    // "150+ gp" asks above its floor
    if (spec.cut) cp = Math.max(1, Math.round(cp * spec.cut));  // a fence deals under the odds
    const had = cp > 2000 ? 1 : cp > 400 ? 1 + Math.floor(rng() * 2) : 1 + Math.floor(rng() * 6);
    const gone = Math.min(had, (sold && sold[it.n]) || 0);
    picks.push({ n: it.n, cp, price: coin(cp), s: it.s, had, gone, qty: had - gone,
      out: had - gone <= 0, canon: !!it.k, worn: !!spec.worn });
  }
  picks.sort((x, y) => (x.out - y.out) || y.cp - x.cp);      // sold-out sinks to the bottom
  return { ...tr, stock: picks, cleared: picks.every((p) => p.out),
    spent: picks.reduce((t, p) => t + p.gone * p.cp, 0),
    quirk: one(roll(b, "quirk"), SHOP_QUIRK), wont: one(roll(b, "wont"), SHOP_WONT) };
}

export const tradeLabel = (t) => t.replace(/\b\w/g, (c) => c.toUpperCase());

/* Which buildings trade. Whether a building is a shop depends only on its id, never on the day,
   so this is computed once and the map can mark shops without recomputing per render. Built on
   first use rather than at module scope: evaluating it while the module graph is still loading
   read BUILDINGS before citymap_gen had finished initialising. */
let shopIds = null;
const allShops = () => (shopIds ||= new Set(BUILDINGS.filter((b) => tradeOf(b)).map((b) => bldgId(b))));
export const isShop = (b) => allShops().has(bldgId(b));
export const shopCount = () => allShops().size;

/* The directory. Without this, the only way to find a blacksmith was to zoom the map in and
   look for an amber outline, which is no use when a player asks at the table. */
let directory = null;
export function allTrades() {
  directory ||= BUILDINGS.map((b) => ({ b, tr: tradeOf(b) })).filter((x) => x.tr)
    .sort((x, y) => x.tr.type.localeCompare(y.tr.type) || x.tr.name.localeCompare(y.tr.name));
  return directory;
}
export function shopsIn({ district = null, type = null, q = "" } = {}) {
  const needle = q.trim().toLowerCase();
  return allTrades().filter(({ b, tr }) =>
    (!district || b.d === district) && (!type || tr.type === type) &&
    (!needle || tr.name.toLowerCase().includes(needle) || tr.type.includes(needle)));
}
export const tradesPresent = (district = null) =>
  [...new Set(shopsIn({ district }).map((x) => x.tr.type))].sort();
