// Regression test for the NPC generator. Runs one command: `npm run regression`.
//
// Generates a large, varied batch of NPCs (every job, every template, plus a big random sample)
// and checks each one for: crashes, unfilled {tokens} left in displayed text, illegal character
// sheets (wrong weapons/armor for class, bad HP/AC, spell tiers out of range, duplicate languages),
// and a few specific contradictions (child with a class, "Thief" with no class, etc).
//
// Pure data/logic modules only — no React, no DOM — so this runs directly under Node.

import { setRNG, seededRNG } from "../src/lib/rng.js";
import { generateNPC, hydrateBookNpc, generateSeeded, diffNpc, applyEdits, randomSeed } from "../src/logic/generator.js";
import {
  ARCHETYPES, TEMPLATES, CATS, FACTIONS, TIER_LV, ANCESTRY_WEIGHTS_WR, BOOK_NPCS, NOTABLE_SECRETS,
} from "../src/data/npc.js";
import {
  SD_CLASSES, CLASS_CHANCE, RARE_CLASS_POOL, SD_WEAPONS, TITLES,
} from "../src/data/shadowdark.js";

setRNG(seededRNG(0xC0FFEE)); // deterministic — rerun this file and get the identical report

const BASE = {
  time: "day", holiday: "none", cat: "any", job: "any", jobs: null, tier: "any",
  lvMin: 0, lvMax: 10, align: "any", faction: "any", ancestry: "any", gender: "any",
  band: "any", competence: "mixed", record: "auto", conditions: "auto",
  seenAt: null, tmplName: null, mundane: false, nickChance: 0.3,
};

const ANCESTRIES = ["any", ...ANCESTRY_WEIGHTS_WR.map(([a]) => a)];
const TOKEN_RE = /\{[a-zA-Z]+\}/;
const JOB_MUST_HAVE_CLASS = Object.keys(CLASS_CHANCE).filter((j) => CLASS_CHANCE[j] === 1);
const RARE_CLASS_IDS = RARE_CLASS_POOL.map(([id]) => id);

const issues = []; // { kind, detail, ctx }
let total = 0;

function flag(kind, detail, npc, ctx) {
  issues.push({ kind, detail, name: npc && npc.name, role: npc && npc.role, roleId: npc && npc.roleId, lv: npc && npc.lv, clsId: npc && npc.sd && npc.sd.clsId, ctx });
}

// walk every string field of the npc looking for a leftover {token} that FILL()/fill() missed
function findUnfilledTokens(obj, path, npc, seen) {
  if (obj == null || seen.has(obj)) return;
  if (typeof obj === "string") { if (TOKEN_RE.test(obj)) flag("unfilled-token", `${path} = "${obj}"`, npc); return; }
  if (typeof obj !== "object") return;
  seen.add(obj);
  if (Array.isArray(obj)) { obj.forEach((v, i) => findUnfilledTokens(v, `${path}[${i}]`, npc, seen)); return; }
  for (const k of Object.keys(obj)) findUnfilledTokens(obj[k], `${path}.${k}`, npc, seen);
}

function validate(npc) {
  total++;
  try {
    findUnfilledTokens(npc, "npc", npc, new WeakSet());
  } catch (e) { flag("token-scan-crash", e.message, npc); }

  // class/job contradictions
  if (npc.roleId === "child" && npc.sd.clsId !== "level0") flag("child-has-class", `child rolled class ${npc.sd.clsId}`, npc);
  if (npc.lv === 0 && npc.sd.clsId !== "level0") flag("lv0-has-class", `LV0 rolled class ${npc.sd.clsId}`, npc);
  if (npc.lv >= 1 && JOB_MUST_HAVE_CLASS.includes(npc.roleId) && npc.sd.clsId === "level0") {
    flag("job-should-have-class", `${npc.roleId} (CLASS_CHANCE=1) came back level0`, npc);
  }
  if (npc.sd.clsId === "knightydris" && !npc.sd.notable) flag("ydris-not-notable", "Knight of St. Ydris without notable flag", npc);
  if (RARE_CLASS_IDS.includes(npc.sd.clsId) && !npc.sd.notable) flag("rare-class-not-notable", `${npc.sd.clsId} without notable flag`, npc);
  // a notable NPC's conversational SECRET must point at what they actually are, not a generic city secret
  if (npc.sd.notable && NOTABLE_SECRETS[npc.sd.clsId]) {
    const pool = NOTABLE_SECRETS[npc.sd.clsId].map((s) => s.replace(/\{patron\}/g, npc.sd.patron || "their patron"));
    if (!pool.includes(npc.secret)) flag("notable-secret-mismatch", `secret="${npc.secret}" not in the ${npc.sd.clsId} pool`, npc);
  }

  const sd = npc.sd;
  if (!sd) { flag("no-sheet", "npc.sd missing", npc); return; }
  const cls = SD_CLASSES[sd.clsId];
  if (!cls) { flag("unknown-class", `clsId "${sd.clsId}" not in SD_CLASSES`, npc); return; }

  // HP / AC sanity — book NPCs' AC/HP are canon overrides and are allowed to break the usual rules
  // (e.g. Porkchop, a named corpse found in the world, is hp:0 by design)
  if (!npc.isBook) {
    if (!(sd.hp >= 1)) flag("bad-hp", `hp=${sd.hp}`, npc);
    if (!(sd.ac >= 8 && sd.ac <= 22)) flag("bad-ac", `ac=${sd.ac}`, npc);
  }
  if (sd.hpNow > sd.hp) flag("bad-hp", `hpNow ${sd.hpNow} > hp ${sd.hp}`, npc);

  // scores in Shadowdark's legal range
  for (const [k, v] of Object.entries(sd.scores)) {
    if (!(v >= 1 && v <= 18)) flag("bad-score", `${k}=${v}`, npc);
  }

  // weapons/armor legal for class
  const canWield = (w) => !cls.weapons || cls.weapons.includes(w);
  sd.gear.filter((g) => g.kind === "weapon").forEach((g) => {
    const id = Object.keys(SD_WEAPONS).find((k) => SD_WEAPONS[k].n === g.n || g.n.includes(SD_WEAPONS[k].n));
    if (id && !canWield(id)) flag("illegal-weapon", `${sd.cls} carrying ${g.n} (not in class weapon list)`, npc);
  });
  const armorId = sd.armor;
  if (armorId !== "none" && !(cls.armor || []).includes(armorId)) flag("illegal-armor", `${sd.cls} wearing ${armorId} (not in class armor list)`, npc);
  if (sd.shield && !cls.shield) flag("illegal-shield", `${sd.cls} carrying a shield with no shield proficiency`, npc);

  // gear slots within the carried cap
  const used = sd.gear.reduce((t, g) => t + (Number(g.slots) || 0), 0);
  if (used > sd.slots) flag("overloaded", `${used} slots used, cap ${sd.slots}`, npc);

  // spells: tiers in range, no caster with spells it shouldn't have
  sd.spells.forEach((sp) => { if (!(sp.tier >= 1 && sp.tier <= 5)) flag("bad-spell-tier", `${sp.n} tier ${sp.tier}`, npc); });
  if (sd.spells.length && !cls.spells && !sd.spells.some((s) => s.learned)) flag("unexpected-spells", `${sd.cls} has spells but no spell list and none marked learned`, npc);

  // languages: no duplicates
  const dupe = sd.langs.find((l, i) => sd.langs.indexOf(l) !== i);
  if (dupe) flag("duplicate-language", dupe, npc);

  // attacks well-formed — versatile weapons carry two dice forms as "1d6/1d8" (e.g. Morning star);
  // the blowgun deals a flat "1" and the bolas deals "-" (control effect, no direct damage)
  sd.attacks.forEach((a) => { if (!/^(\d*d\d+(\+\d+)?(\/\d*d\d+(\+\d+)?)?|\d+|-)$/.test(a.dmg)) flag("bad-damage-string", `${a.n}: "${a.dmg}"`, npc); });

  // title only when the class actually has a title table
  if (sd.title && !TITLES_HAS(sd.clsId)) flag("unexpected-title", `${sd.clsId} has title "${sd.title}" but no TITLES entry`, npc);

  // record/renown coherence (generator is supposed to cap this)
  if (["wanted", "exiled"].includes(npc.record.state.id) && npc.renown > 5) flag("renown-record-conflict", `${npc.record.state.id} but renown ${npc.renown}`, npc);
}

const TITLES_HAS = (clsId) => !!TITLES[clsId];

function run(settings, keep, ctx) {
  let npc;
  try {
    npc = generateNPC(settings, keep || {});
  } catch (e) {
    flag("crash", `${e.message}\n${e.stack}`, null, ctx);
    return;
  }
  try {
    validate(npc);
  } catch (e) {
    flag("validator-crash", `${e.message}\n${e.stack}`, npc, ctx);
  }
}

console.log("Regression: generating NPCs...\n");

// 1) every job, every ancestry, a few genders — makes sure every archetype/ancestry pairing works
for (const roleId of Object.keys(ARCHETYPES)) {
  for (const ancestry of ANCESTRIES) {
    for (const gender of ["any", "f", "m"]) {
      for (let i = 0; i < 6; i++) run({ ...BASE, job: roleId, ancestry, gender }, {}, `job=${roleId} anc=${ancestry} g=${gender}`);
    }
  }
}

// 2) every category x tier x alignment x band combination
for (const cat of Object.keys(CATS)) {
  for (const tier of Object.keys(TIER_LV).concat(["any"])) {
    for (const align of ["any", "L", "N", "C"]) {
      for (const band of ["any", "0", "1", "2", "3", "4"]) {
        for (let i = 0; i < 4; i++) run({ ...BASE, cat, tier, align, band }, {}, `cat=${cat} tier=${tier} align=${align} band=${band}`);
      }
    }
  }
}

// 3) every faction
for (const facId of Object.keys(FACTIONS)) {
  for (let i = 0; i < 20; i++) run({ ...BASE, faction: facId }, {}, `faction=${facId}`);
}

// 4) every template, as Caleb would actually tap it
for (const t of TEMPLATES) {
  for (let i = 0; i < 300; i++) run({ ...BASE, ...t.p, tmplName: t.name }, {}, `template=${t.id}`);
}

// 5) every book NPC hydration
for (const b of BOOK_NPCS) {
  for (let i = 0; i < 3; i++) {
    try { validate(hydrateBookNpc(b, BASE)); total++; }
    catch (e) { flag("book-npc-crash", `${b.n}: ${e.message}\n${e.stack}`, null, `book=${b.n}`); }
  }
}

// 6) large plain-random sample — most likely to surface the rare secret-class overlay
const RANDOM_SAMPLE = 40000;
for (let i = 0; i < RANDOM_SAMPLE; i++) run(BASE, {}, "random");

// 7) seed + edits round-trip — the mechanism the save format depends on. For each of a wide
// mix of settings: generate from an explicit seed, simulate a few "edits" (a manual field change,
// a partial reroll — the diff can't tell those apart and shouldn't need to), diff against a fresh
// regeneration from the same seed, reapply the diff, and require the result to be byte-identical
// to the edited NPC. This is what makes it safe to store {seed, settings, edits} instead of the
// whole ~5KB object.
function roundTripCheck(settings, ctx) {
  const seed = randomSeed();
  let npc;
  try { npc = generateSeeded(seed, settings, {}); npc.seed = seed; npc.genSettings = settings; npc.genKeep = {}; }
  catch (e) { flag("seeded-gen-crash", `${e.message}\n${e.stack}`, null, ctx); return; }

  // the meta fields (seed/genSettings/genKeep) travel with the object as bookkeeping, reattached
  // by the caller after any regeneration — never part of the diff, but needed on both sides of
  // an equality check or the comparison is apples-to-oranges
  const reattach = (o) => { o.seed = seed; o.genSettings = settings; o.genKeep = {}; return o; };

  // unedited: diffing a pristine generation against itself should be empty, and reapplying
  // an empty diff must reproduce the original exactly
  const freshAgain = generateSeeded(seed, settings, {});
  const emptyDiff = diffNpc(freshAgain, npc);
  if (Object.keys(emptyDiff).length) flag("edit-diff-not-empty", `unedited NPC produced a non-empty diff: ${Object.keys(emptyDiff).join(", ")}`, npc, ctx);
  const rebuiltPristine = reattach(applyEdits(freshAgain, emptyDiff, npc.id));
  if (JSON.stringify(rebuiltPristine) !== JSON.stringify(npc)) flag("roundtrip-mismatch-pristine", "regenerating with an empty diff didn't reproduce the original", npc, ctx);

  // edited: mutate a handful of fields the way real usage would (a manual rename, a record
  // reroll, a damage tick), then require the diff+reapply cycle to reproduce the edited NPC
  const edited = { ...npc, name: npc.name + " the Edited", first: npc.first, band: (npc.band + 1) % 5, opener: "manually overwritten opener text" };
  if (edited.sd) edited.sd = { ...edited.sd, hpNow: Math.max(0, edited.sd.hp - 3) };
  const edits = diffNpc(freshAgain, edited);
  if (!("name" in edits) || !("opener" in edits)) flag("edit-diff-missing-field", `expected edits to capture name/opener, got: ${Object.keys(edits).join(", ")}`, npc, ctx);
  const rebuiltEdited = reattach(applyEdits(freshAgain, edits, npc.id));
  if (JSON.stringify(rebuiltEdited) !== JSON.stringify(edited)) flag("roundtrip-mismatch-edited", "regenerating + reapplying edits didn't reproduce the edited NPC", npc, ctx);
}

for (const roleId of Object.keys(ARCHETYPES)) roundTripCheck({ ...BASE, job: roleId }, `seeded job=${roleId}`);
for (const t of TEMPLATES) for (let i = 0; i < 10; i++) roundTripCheck({ ...BASE, ...t.p, tmplName: t.name }, `seeded template=${t.id}`);
for (let i = 0; i < 2000; i++) roundTripCheck(BASE, "seeded random");

// ---- report ----

console.log(`Generated ${total.toLocaleString()} NPCs.\n`);

if (!issues.length) {
  console.log("No issues found.");
  process.exit(0);
}

const byKind = new Map();
for (const it of issues) { if (!byKind.has(it.kind)) byKind.set(it.kind, []); byKind.get(it.kind).push(it); }

console.log(`Found ${issues.length} issue(s) across ${byKind.size} categor${byKind.size === 1 ? "y" : "ies"}:\n`);
for (const [kind, list] of [...byKind.entries()].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`── ${kind} (${list.length}) ──`);
  list.slice(0, 5).forEach((it) => {
    console.log(`  ${it.name || "(no npc)"} [${it.role || "?"} LV${it.lv ?? "?"} ${it.clsId || ""}] — ${it.detail}${it.ctx ? `  (${it.ctx})` : ""}`);
  });
  if (list.length > 5) console.log(`  ...and ${list.length - 5} more`);
  console.log("");
}

process.exit(1);
