import { TREASURE, MAGIC_TABLES, MAGIC_ITEMS } from "../data/loot_gen.js";
import { ENCOUNTERS, rollEncounter } from "../data/encounters_gen.js";

/* Rolling on the book's tables.

   Everything here reads the core tables as printed. The composition rules come from the
   compilation's §31 magic item system: type on a d6, then quality and personality counts on
   2d6, then that type's own feature / bonus / curse / benefit tables.

   Nothing in this file invents a table. Where the book leaves a choice to the referee it says
   so in the output rather than picking silently. */

const d = (n) => 1 + Math.floor(Math.random() * n);

/* Roll a die expression like "d20" or "2d6". */
export function rollDie(expr) {
  const m = /^(\d*)d(\d+)$/.exec(expr || "");
  if (!m) return 1;
  const n = Number(m[1] || 1), f = Number(m[2]);
  let t = 0;
  for (let i = 0; i < n; i++) t += d(f);
  return t;
}

const text = (row) => (row.length === 3 ? row[2] : row[1]);
const lo = (row) => row[0];
const hi = (row) => (row.length === 3 ? row[1] : row[0]);

/* Roll on any table in TREASURE or MAGIC_TABLES.

   A table flagged `partial` is one the extractor could not fully recover, so rolling its die
   could land on a number with no row. Those pick evenly among the rows that exist instead —
   an incomplete table degrades quietly rather than returning nothing. */
export function rollTable(tab) {
  if (!tab || !tab.rows || !tab.rows.length) return null;
  if (tab.partial || !tab.die) {
    const r = tab.rows[Math.floor(Math.random() * tab.rows.length)];
    return { roll: lo(r), text: text(r), approx: true };
  }
  const roll = rollDie(tab.die);
  const hit = tab.rows.find((r) => roll >= lo(r) && roll <= hi(r));
  return hit ? { roll, text: text(hit) }
    : { roll, text: text(tab.rows[tab.rows.length - 1]), approx: true };
}

export const treasureTable = (lv) =>
  lv >= 10 ? "Treasure 10+" : lv >= 7 ? "Treasure 7-9" : lv >= 4 ? "Treasure 4-6" : "Treasure 0-3";

/* A hoard: `n` rolls on the level's own treasure table, plus the optional flavour tables the
   book prints alongside it. Duplicates are kept — rolling the same coin cache twice is a real
   result, not a bug. */
export function rollHoard(level = 1, n = 3, extras = true) {
  const name = treasureTable(level);
  const tab = TREASURE[name];
  const out = { table: name, level, items: [], extras: [] };
  for (let i = 0; i < n; i++) {
    const r = rollTable(tab);
    if (r) out.items.push(r);
  }
  if (extras) {
    for (const k of ["Gemstones", "Luxury Items", "Unique Feature"]) {
      const r = TREASURE[k] && rollTable(TREASURE[k]);
      if (r) out.extras.push({ k, ...r });
    }
  }
  return out;
}

/* §31: type d6, then qualities and personality on 2d6, then the type's own tables. */
const TYPE_TABLES = {
  Armor: { type: "Armor Type", bonus: "Armor Bonus", feature: "Armor Feature", curse: "Armor Curse", benefit: "Armor Benefit" },
  Weapon: { type: "Weapon Type", bonus: "Weapon Bonus", feature: "Weapon Feature", curse: "Weapon Curse", benefit: "Weapon Benefit" },
  Utility: { type: "Utility Type", feature: "Utility Feature", curse: "Utility Curse", benefit: "Utility Benefit" },
  Potion: { feature: "Potion Features", curse: "Potion Curse", benefit: "Potion Benefit" },
  Scroll: { feature: "Scroll Feature" },
  Wand: { feature: "Wand Feature" },
};

/* The qualities and personality tables print "–" for none and a count otherwise, e.g.
   "2-3 | – | 1". Read the number out of each cell rather than guessing. */
function counts(tableName) {
  const t = MAGIC_TABLES[tableName];
  const r = t && rollTable(t);
  if (!r) return { roll: null, a: 0, b: 0, raw: "" };
  const nums = String(r.text).match(/\d+/g) || [];
  const cells = String(r.text).split(/\s{2,}|\s*\|\s*/).filter(Boolean);
  const num = (s) => (/\d/.test(s || "") ? Number((s.match(/\d+/) || [0])[0]) : 0);
  return {
    roll: r.roll, raw: r.text,
    a: cells.length >= 2 ? num(cells[0]) : num(nums[0] || ""),
    b: cells.length >= 2 ? num(cells[1]) : num(nums[1] || ""),
  };
}

function pickTrait() {
  const r = rollTable(MAGIC_TABLES["Personality Trait"]);
  if (!r) return null;
  // split the row back into its columns: each trait starts with a capital
  const cells = String(r.text).split(/\s+(?=[A-Z])/).map((s) => s.trim()).filter(Boolean);
  return { roll: r.roll, text: cells.length ? cells[Math.floor(Math.random() * cells.length)] : r.text };
}

export function rollMagicItem() {
  const tRoll = rollTable(MAGIC_TABLES.Type);
  const kind = (tRoll && tRoll.text ? tRoll.text : "Utility").replace(/[^A-Za-z].*$/, "");
  const key = Object.keys(TYPE_TABLES).find((k) => k.toLowerCase() === kind.toLowerCase()) || "Utility";
  const map = TYPE_TABLES[key];

  const q = counts("Qualities");
  const p = counts("Personality");
  const pull = (name, times) => {
    const t = name && MAGIC_TABLES[name];
    const out = [];
    for (let i = 0; i < times && t; i++) {
      const r = rollTable(t);
      if (r && !out.some((x) => x.text === r.text)) out.push(r);
    }
    return out;
  };

  return {
    kind: key,
    type: map.type ? rollTable(MAGIC_TABLES[map.type]) : null,
    bonus: map.bonus ? rollTable(MAGIC_TABLES[map.bonus]) : null,
    feature: map.feature ? rollTable(MAGIC_TABLES[map.feature]) : null,
    benefits: pull(map.benefit, q.a),
    curses: pull(map.curse, q.b),
    virtues: pull("Item Virtue", p.a),
    flaws: pull("Item Flaw", p.b),
    // §31 prints Trait as a d4 x d4 matrix, so a row holds four separate traits side by side.
    // Taking the whole row gives nonsense like "Imperious Polite Puritanical Charming".
    trait: p.a || p.b ? pickTrait() : null,
    qualityRoll: q, personalityRoll: p,
  };
}

export const namedItem = () => MAGIC_ITEMS[Math.floor(Math.random() * MAGIC_ITEMS.length)];

export const TREASURE_NAMES = Object.keys(TREASURE);
export const MAGIC_TABLE_NAMES = Object.keys(MAGIC_TABLES);
export const ENCOUNTER_NAMES = Object.keys(ENCOUNTERS);
export { rollEncounter, TREASURE, MAGIC_TABLES, MAGIC_ITEMS, ENCOUNTERS };
