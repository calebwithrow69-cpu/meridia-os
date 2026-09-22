/* Build src/data/items_gen.js from the markdown in Refrence/.
   Run: npm run items

   Two sources, and the difference is recorded per item because it matters at the table:

   - shadowdark-ruleset-compilation.md  §13 gear, §14 weapons, §15 armor, §16 mounts/vessels/tack
     These are Shadowdark CORE. Emitted with k: 1 (canon).

   - equipment-emporium-shadowdark.md
     Its own header says it is adapted from Basic Fantasy RPG's Equipment Emporium with prices
     re-tuned by hand, so it is NOT Shadowdark canon. Emitted with k: 0, and the UI labels
     those prices as house prices. It already carries the [P]/[M]/[U]/[H] shop-tier tags this
     whole feature needs, which is why it is the stock source.

   Tables in these files have a dozen different column layouts, so the parser is driven by
   each table's own header row rather than by fixed positions: it finds the price column by
   name, the slots column if there is one, and picks tier tags up anywhere in the row. Rows it
   cannot price are reported at the end rather than dropped silently. */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REF = join(ROOT, "Refrence");

/* 1 gp = 10 sp = 100 cp is core (§13 Coins). Core never prices anything in electrum or
   platinum; those appear only in the emporium's bullion-by-the-pound table, so the rates
   below are the traditional ones and are NOT from any reference. Only metals use them. */
const UNIT = { cp: 1, sp: 10, gp: 100, ep: 50, pp: 1000 }; // ep/pp NOT IN REFS

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* Short, stable category keys. The markdown's own headings slug into things like
   "rations-in-addition-to-standard-rations-at-5-sp-for-3-days", which is useless as a key to
   map shop types against, so each section is named explicitly here. First match wins. */
const CATEGORY = [
  [/GEAR SLOTS/i, "gear"], [/WEAPONS/i, "weapon"], [/ARMOR/i, "armor"],
  [/MOUNTS & VEHICLES/i, "mount"], [/FOOD & COOKING/i, "food"], [/BARRELED DRINKS/i, "drink"],
  [/GENERAL ADVENTURING GEAR/i, "gear"], [/HEALTH & HYGIENE/i, "health"],
  [/CLERICAL/i, "clerical"], [/THIEVES/i, "thief"], [/WIZARDS/i, "arcane"],
  [/PROFESSIONAL & CRAFT TOOLS/i, "tools"], [/GAMES & TOYS/i, "games"],
  [/MUSICAL INSTRUMENTS/i, "music"], [/JEWELRY/i, "jewelry"], [/CLOTHING/i, "clothing"],
  [/ANIMALS/i, "animal"], [/TACK & HARNESS/i, "tack"], [/SERVICES/i, "service"],
  [/TRADE GOODS/i, "trade"], [/PLATES, SILVERWARE/i, "household"], [/ARTWORK/i, "art"],
  [/LAND VEHICLES/i, "vehicle"],
];
const catOf = (h2) => (CATEGORY.find(([re]) => re.test(h2)) || [null, slug(h2)])[1];

function money(cell) {
  // the "+" in "150+ gp" sits between the number and the unit, so it has to be allowed here
  const hits = [...cell.matchAll(/([\d,]+(?:\.\d+)?)\s*\+?\s*(cp|sp|gp|ep|pp)\b/gi)];
  if (!hits.length) return null;
  const val = (m) => Math.round(parseFloat(m[1].replace(/,/g, "")) * UNIT[m[2].toLowerCase()]);
  const lo = val(hits[0]), hi = val(hits[hits.length - 1]);
  // "3 sp–3 gp" gives a band; a bare "1–2 gp" only carries its unit once, so widen from the
  // leading bare number when there is a dash before the priced number.
  let low = lo;
  const bare = cell.match(/^\s*([\d,]+)\s*[–\-]\s*[\d,]+\s*(cp|sp|gp|ep|pp)/i);
  if (bare) low = Math.round(parseFloat(bare[1].replace(/,/g, "")) * UNIT[bare[2].toLowerCase()]);
  return { lo: Math.min(low, lo, hi), hi: Math.max(low, lo, hi), plus: /\+/.test(cell) };
}

const SKIP_SECTION = /SIEGE ENGINES|QUICK REFERENCE|Conversion notes/i;

function parseTables(md, { canon, defaultTiers }) {
  const out = [], unpriced = [];
  let h2 = "", h3 = "", cols = null;
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith("## ")) { h2 = line.replace(/^##\s*\d*\.?\s*/, ""); h3 = ""; cols = null; continue; }
    if (line.startsWith("### ")) { h3 = line.replace(/^###\s*/, ""); cols = null; continue; }
    if (!line.startsWith("|")) { cols = null; continue; }

    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;          // the |---| rule
    if (!cols) {                                                      // first row = header
      cols = cells.map((c) => c.replace(/\*/g, "").toLowerCase());
      continue;
    }
    if (SKIP_SECTION.test(h2)) continue;

    const iPrice = cols.findIndex((c) => /^(price|cost|barrel)$/.test(c));
    const iSlots = cols.findIndex((c) => /slot/.test(c));
    let name = cells[0].replace(/\*\*/g, "").trim();
    if (!name || name === "—") continue;

    /* Some tables carry the noun in the column header rather than the cell, so the raw name is
       useless on a shelf: the outfits table lists "Common" and "Peasant", the place-settings
       table lists "Common (stoneware)", and the drinks table prices a barrel, not a mug. And a
       heading like "Metals (per lb)" is the only thing saying "Silver" means a pound of it. */
    if (cols[0] === "outfit") name += " outfit";
    else if (cols[0] === "setting") name += " place setting";
    if (cols[iPrice] === "barrel") name += " (barrel)";
    const per = (h3.match(/\((per [^)]+)\)/i) || [])[1];
    if (per && !/\(/.test(name)) name += ` (${per})`;

    const priceCell = iPrice >= 0 ? cells[iPrice] : cells.slice(1).find((c) => money(c)) || "";
    const m = money(priceCell);
    const tiers = (cells.join(" ").match(/\[([PMUH])\]/g) || []).map((t) => t[1]).join("")
      || (/\ball\b/i.test(cells.join(" ")) ? "PMUH" : defaultTiers);
    if (!m) { unpriced.push(`${h2} / ${h3} / ${name} (${priceCell || "no price column"})`); continue; }

    out.push({
      n: name,
      cp: m.lo, hi: m.hi > m.lo ? m.hi : undefined, plus: m.plus || undefined,
      p: priceCell.replace(/\*\*/g, "").replace(/\s*\[[PMUH]\]\s*/g, "").replace(/\(.*?\)/g, "").trim(),
      s: iSlots >= 0 ? cells[iSlots] : undefined,
      c: catOf(h2), sub: h3 ? slug(h3) : undefined, t: tiers, k: canon ? 1 : 0,
    });
  }
  return { out, unpriced };
}

/* --- core: only the sections that are actually goods for sale --- */
const core = readFileSync(join(REF, "shadowdark-ruleset-compilation.md"), "utf8");
const coreSlice = (from, to) => {
  const a = core.indexOf(from), b = core.indexOf(to);
  if (a < 0 || b < 0) throw new Error(`core section not found: ${from}`);
  return core.slice(a, b);
};
const coreParts = [
  ["## 13. GEAR SLOTS", "## 14. WEAPONS", "PMUH"],
  ["## 14. WEAPONS", "## 15. ARMOR", "MU"],
  ["## 15. ARMOR", "## 16. MOUNTS", "MU"],
  ["## 16. MOUNTS & VEHICLES", "## 17. SPELLCASTING", "MU"],
];

let items = [], skipped = [];
for (const [from, to, tiers] of coreParts) {
  const r = parseTables(coreSlice(from, to), { canon: true, defaultTiers: tiers });
  items.push(...r.out); skipped.push(...r.unpriced);
}
const emp = parseTables(readFileSync(join(REF, "equipment-emporium-shadowdark.md"), "utf8"),
  { canon: false, defaultTiers: "PMU" });
items.push(...emp.out); skipped.push(...emp.unpriced);

/* Core wins on any name the emporium repeats, so a canon price is never shadowed. */
const seen = new Map();
for (const it of items) {
  const key = it.n.toLowerCase();
  if (!seen.has(key) || (it.k && !seen.get(key).k)) seen.set(key, it);
}
items = [...seen.values()].sort((a, b) => a.c.localeCompare(b.c) || a.cp - b.cp);

const byCat = {};
for (const it of items) byCat[it.c] = (byCat[it.c] || 0) + 1;

const body = items.map((it) => {
  const f = [`n: ${JSON.stringify(it.n)}`, `cp: ${it.cp}`];
  if (it.hi) f.push(`hi: ${it.hi}`);
  if (it.plus) f.push("plus: 1");
  f.push(`p: ${JSON.stringify(it.p)}`);
  if (it.s) f.push(`s: ${JSON.stringify(it.s)}`);
  f.push(`c: ${JSON.stringify(it.c)}`);
  if (it.sub) f.push(`sub: ${JSON.stringify(it.sub)}`);
  f.push(`t: ${JSON.stringify(it.t)}`, `k: ${it.k}`);
  return `  { ${f.join(", ")} },`;
}).join("\n");

const js = `/* GENERATED by scripts/build-items.mjs from Refrence/ — do not hand-edit.
   Re-run with \`npm run items\` after changing the markdown.

   k: 1 = Shadowdark core (canon price). k: 0 = from equipment-emporium-shadowdark.md, which
   is adapted from Basic Fantasy RPG with hand-tuned prices and is NOT canon — the UI marks
   those as house prices so nothing homebrew is ever shown as if it came from the rulebook.

   cp is the price in copper (1 gp = 10 sp = 100 cp, core §13) so stock can do arithmetic;
   \`p\` is the printed string to show. \`hi\` is present when the book gives a band, \`plus\`
   when it gives a floor ("150+ gp"). \`t\` is the shop-tier tags the emporium supplies:
   P = poor district, M = middle, U = upper, H = High Harbor.

   ${items.length} items across ${Object.keys(byCat).length} categories.
*/

export const ITEMS = [
${body}
];

export const ITEMS_BY_CAT = ITEMS.reduce((m, it) => { (m[it.c] ||= []).push(it); return m; }, {});
`;

writeFileSync(join(ROOT, "src", "data", "items_gen.js"), js);
console.log(`items_gen.js — ${items.length} items, ${Object.keys(byCat).length} categories, ${(js.length / 1024).toFixed(1)} KB`);
console.log(`canon: ${items.filter((i) => i.k).length}   house: ${items.filter((i) => !i.k).length}`);
console.log("\ncategories:", Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${v}`).join(" "));
if (skipped.length) {
  console.log(`\nnot priced, so not emitted (${skipped.length}):`);
  for (const s of skipped) console.log("   " + s);
}
