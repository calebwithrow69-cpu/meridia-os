import { C } from "../lib/theme.js";
import { RNG, d, pick, chance, clamp, fmt, weighted, drawN } from "../lib/rng.js";
import {
  ABILITIES, SD_STATS, modOf, SCORE_BAND, scoreFor, SD_WEAPONS, SD_ARMOR, SD_ANCESTRY,
  COMMON_LANGS, RARE_LANGS, TITLES, PRIEST_SPELLS, WIZARD_SPELLS, PRIEST_KNOWN, WIZARD_KNOWN,
  SD_CLASSES, ROLE_CLASS, CLASS_CHANCE, CLASS_CHANCE_DEFAULT, RARE_CLASS_CHANCE, RARE_CLASS_POOL,
  WARLOCK_PATRONS, DIABOLICAL_BG, OLD_GODS, NORD_BACKGROUND, ROLE_BACKGROUND, ROLE_BG_FIXED, GEAR, BAND_EXTRAS, OUTFITS,
  OUTFIT_BY_ROLE, ROLE_KIT, WALLET, WALLET_BONUS, rollDice,
} from "../data/shadowdark.js";

// Sea Wolf and Seer are foreign to Meridia — they draw from the Isles of Andrik's own background
// table instead of the city's job-category pools, same as the notable/Diabolical classes do.
const NORD_CLASSES = ["seawolf", "seer"];

const RARE_CLASSES = RARE_CLASS_POOL.map(([id]) => id);

// Most people have no Shadowdark class at all — a shopkeeper isn't secretly a Fighter just to have a
// stat block. classChance gates whether this NPC trained as anything; the rare overlay lets a warlock,
// witch, or Knight of St. Ydris turn up under any job at all, which is the point of them.
function pickClass(npc) {
  const lv = npc.lv;
  if (lv === 0 || npc.roleId === "child") return { clsId: "level0", notable: false };
  if (chance(RARE_CLASS_CHANCE)) return { clsId: weighted(RARE_CLASS_POOL), notable: true };
  const cChance = npc.roleId in CLASS_CHANCE ? CLASS_CHANCE[npc.roleId] : CLASS_CHANCE_DEFAULT;
  if (!chance(cChance)) return { clsId: "level0", notable: false };
  const clsId = weighted(ROLE_CLASS[npc.roleId] || [["roustabout", 1]]);
  return { clsId, notable: RARE_CLASSES.includes(clsId) };
}

export function buildSheet(npc, s) {
  const lv = npc.lv, anc = SD_ANCESTRY[npc.anc] || SD_ANCESTRY.human;
  const { clsId, notable } = pickClass(npc);
  // classless but leveled (a tough dock enforcer, a dangerous-tier smuggler with no formal training)
  // still scales HP off their own job's hit die — no talents, no features, no class-weapon lock.
  const cls = clsId === "level0" && lv > 0 ? { ...SD_CLASSES.level0, hd: npc.arch.hd } : SD_CLASSES[clsId];
  const patronKey = clsId === "warlock" ? pick(Object.keys(WARLOCK_PATRONS)) : null;
  const scores = Object.fromEntries(SD_STATS.map((k) => [k, scoreFor(npc.mods[k])]));
  const talents = [];
  let atk = 0, acBonus = 0, cast = 0, backstab = 0, extraHpDice = 0, extraSpells = 0, masteryN = 1, advSpell = 0;
  const bump = (choices, amt) => { const k = choices.includes(npc.arch.prime) ? npc.arch.prime : pick(choices); scores[k] = Math.min(18, scores[k] + amt); return k; };
  const applyTalent = (depth = 0) => {
    const roll = () => d(6) + d(6);
    let r = roll();
    if (npc.anc === "halfelf") { const r2 = roll(); if (Math.abs(r2 - 7) > Math.abs(r - 7)) r = r2; } // Adaptable: keep the more interesting
    const [txt, e] = cls.talent(r, { patronKey });
    let line = txt;
    if (e.stat) line = txt.replace("{stat}", bump(e.stat, e.amt));
    if (e.two) { const a = bump(SD_STATS, 1); let b = pick(SD_STATS.filter((k) => k !== a)); scores[b] = Math.min(18, scores[b] + 1); line = `+1 to ${a} and ${b}`; }
    if (e.pick) line = `+2 to ${bump(SD_STATS, 2)} (chosen)`;
    if (e.atk) atk++;
    if (e.ac) acBonus++;
    if (e.cast) cast++;
    if (e.backstab) backstab++;
    if (e.extraHp) extraHpDice++;
    if (e.spell) extraSpells++;
    if (e.mastery) masteryN++;
    if (e.advSpell) advSpell++;
    talents.push({ r, t: line });
    if (e.again && depth < 2) applyTalent(depth + 1);
  };
  if (cls.talent) {
    const rolls = [1, 3, 5, 7, 9].filter((x) => x <= lv).length + (npc.anc === "human" ? 1 : 0);
    for (let i = 0; i < rolls; i++) applyTalent();
  }
  const mods = Object.fromEntries(SD_STATS.map((k) => [k, modOf(scores[k])]));

  /* gear */
  const kit = ROLE_KIT[npc.roleId] || ROLE_KIT.laborer;
  const canWield = (w) => !cls.weapons || cls.weapons.includes(w);
  let wOpts = kit.w.map((x) => (Array.isArray(x) ? x : [x, null])).filter(([w]) => canWield(w));
  if (!wOpts.length) wOpts = [[cls.weapons ? cls.weapons[0] : "club", null]];
  const nW = lv >= 3 && wOpts.length > 1 && chance(0.6) ? 2 : 1;
  const weapons = drawN(wOpts, nW).filter((x, i, arr) => arr.findIndex((y) => y[0] === x[0]) === i); // no "Club" and "Cudgel (as club)" together
  let aOpts = kit.a.filter((a) => a === "none" || cls.armor.includes(a));
  if (npc.band <= 1 && !["guard", "sergeant"].includes(npc.roleId)) aOpts = aOpts.filter((a) => a !== "chainmail" && a !== "plate");
  const armorId = pick(aOpts.length ? aOpts : ["none"]);
  const armor = SD_ARMOR[armorId];
  const shield = cls.shield && kit.sh && chance(kit.sh) && weapons.every(([w]) => !/2H/.test(SD_WEAPONS[w].props));

  const gear = [];
  weapons.forEach(([w, lbl]) => {
    const W = SD_WEAPONS[w];
    gear.push({ n: lbl || W.n, slots: W.slots, kind: "weapon" });
    if (W.ammo) gear.push({ n: GEAR[W.ammo][0], slots: 1 });
  });
  if (armorId !== "none") gear.push({ n: armor.n, slots: armor.slots, kind: "armor" });
  if (shield) gear.push({ n: "Shield", slots: 1, kind: "armor" });
  if (npc.roleId !== "child" && weapons.length < 2 && canWield("dagger") && !weapons.some(([w]) => w === "dagger") && chance(0.3)) { const lbl = pick([null, "Knife (as dagger)", "Stiletto (as dagger)"]); weapons.push(["dagger", lbl]); gear.push({ n: lbl || "Dagger", slots: 1, kind: "weapon" }); }
  const extras = [...kit.g, ...drawN(kit.x, clamp(npc.band + 1 + Math.floor(lv / 3), 2, 6)), ...drawN(npc.roleId === "child" ? ["bread", "apples", "cord", "whetstone", "paint"] : BAND_EXTRAS[npc.band], 1 + d(2))];
  if (npc.lv >= 1 && npc.roleId !== "child" && chance(0.35)) extras.push(pick(["rations", "torch", "oil", "tinder", "flint", "waterskin", "rope"]));
  const free = [];
  if (clsId === "thief" && !extras.includes("tools")) extras.push("tools");
  if (clsId === "priest" && !extras.includes("holysymbol")) extras.push("holysymbol");
  [...new Set(extras)].forEach((id) => { const g = GEAR[id]; if (!g) return; (g[2] === 0 ? free : gear).push({ n: g[0], slots: g[2] }); });
  // never carry more than the slots allow (STR or 10, plus CON for fighters): drop odds and ends first
  const cap = Math.max(10, scores.STR) + (clsId === "fighter" ? Math.max(0, mods.CON) : 0);
  while (gear.reduce((t, g) => t + g.slots, 0) > cap) { const i = gear.map((g) => !g.kind).lastIndexOf(true); if (i < 0) break; gear.splice(i, 1); }
  const outfit = OUTFIT_BY_ROLE[npc.roleId] || OUTFITS[npc.band];
  free.unshift({ n: `${outfit[0]} (worn)`, slots: 0 });
  if (gear.length > 4 || npc.band >= 2) free.push({ n: "Backpack (first one is free)", slots: 0 });

  /* wallet: pocket change, not savings */
  const wb = WALLET[npc.band], bonus = WALLET_BONUS[npc.roleId] || {};
  const wallet = { gp: rollDice(wb.gp), sp: rollDice(wb.sp), cp: rollDice(wb.cp) };
  ["gp", "sp", "cp"].forEach((k) => { if (bonus[k]) wallet[k] += rollDice(bonus[k]); });
  if (npc.roleId === "child") { wallet.gp = 0; wallet.sp = Math.min(wallet.sp, 1); }

  /* attacks */
  const mastery = clsId === "fighter" ? drawN(weapons.map(([w]) => w), Math.min(masteryN, weapons.length)) : [];
  const attacks = weapons.map(([w, lbl]) => {
    const W = SD_WEAPONS[w];
    const ranged = W.type === "R";
    const fin = /Finesse/.test(W.props);
    const stat = ranged ? "DEX" : fin ? (mods.DEX > mods.STR ? "DEX" : "STR") : "STR";
    let bonus = mods[stat] + atk, dmg = 0;
    if (mastery.includes(w)) { bonus += 1 + Math.floor(lv / 2); dmg += 1 + Math.floor(lv / 2); }
    if (npc.anc === "halforc" && !ranged) { bonus += 1; dmg += 1; }
    if (npc.anc === "elf" && ranged) bonus += 1;
    return { n: lbl || W.n, bonus, dmg: `${W.dmg}${dmg ? `+${dmg}` : ""}`, range: W.range, props: W.props, stat, mastery: mastery.includes(w) };
  });

  attacks.sort((a, b) => b.bonus - a.bonus);
  /* AC and HP */
  let ac = armor.ac + (armor.dex ? mods.DEX : 0) + (shield ? 2 : 0) + (armorId !== "none" ? acBonus : 0);
  ac = clamp(ac, 8, 22);
  let hp;
  if (lv === 0) hp = Math.max(1, mods.CON);
  else {
    const hd = () => (npc.anc === "dwarf" ? Math.max(d(cls.hd), d(cls.hd)) : d(cls.hd));
    hp = Math.max(1, hd() + mods.CON);
    for (let i = 2; i <= lv + extraHpDice; i++) hp += hd();
  }
  if (npc.anc === "dwarf") hp += 2;

  /* spells */
  const spells = [];
  if (cls.spells) {
    const known = (cls.known[lv - 1] || []).slice();
    if (extraSpells) known[0] = (known[0] || 0) + extraSpells;
    known.forEach((n, t) => drawN(cls.spells[t].filter((x) => x !== "Turn Undead"), n).forEach((sp) => spells.push({ n: sp, tier: t + 1 })));
    if (clsId === "priest") spells.unshift({ n: "Turn Undead", tier: 1, free: true });
  } else if (extraSpells) {
    const t = Math.max(1, Math.floor(lv / 2));
    const list = chance(0.5) ? WIZARD_SPELLS : PRIEST_SPELLS;
    spells.push({ n: pick(list[Math.min(4, t - 1)]), tier: Math.min(5, t), learned: true });
  }
  const advOn = advSpell && spells.length ? pick(spells).n : null;

  /* languages */
  const langs = anc.langs.slice();
  const addFrom = (pool, n) => drawN(pool.filter((l) => !langs.includes(l)), n).forEach((l) => langs.push(l));
  if (anc.extra) addFrom(COMMON_LANGS, anc.extra);
  if (cls.commonLang) addFrom(COMMON_LANGS, cls.commonLang);
  if (cls.rareLang) addFrom(clsId === "warlock" ? [...RARE_LANGS, "Sylvan"] : clsId === "priest" ? ["Celestial", "Diabolic", "Primordial"] : RARE_LANGS, cls.rareLang);
  if (cls.fixedLangs) cls.fixedLangs.forEach((l) => { if (!langs.includes(l)) langs.push(l); });

  // Elf Farsight: +1 ranged if they carry a ranged weapon, otherwise +1 to spellcasting
  if (npc.anc === "elf" && cls.cast && !weapons.some(([w]) => SD_WEAPONS[w].type === "R")) cast += 1;
  const titleRow = TITLES[clsId] && TITLES[clsId][npc.al];
  const title = titleRow ? titleRow[Math.min(4, Math.floor((lv - 1) / 2))] : "";
  // a warlock, witch, or Knight of St. Ydris carries a background from what shaped them, not their day job;
  // a Sea Wolf or Seer carries one from the Isles of Andrik instead of the city's own job categories
  const bg = notable ? pick(DIABOLICAL_BG) : NORD_CLASSES.includes(clsId) ? pick(NORD_BACKGROUND) : (ROLE_BG_FIXED[npc.roleId] || pick(ROLE_BACKGROUND[npc.arch.cat] || ROLE_BACKGROUND.labor));
  const deity = npc.faith ? npc.faith.name : "";
  const patron = patronKey ? WARLOCK_PATRONS[patronKey].n : "";
  const god = OLD_GODS[npc.al] || "the Old Gods";
  const fill = (t) => t.replace("{mastery}", mastery.map((w) => SD_WEAPONS[w].n).join(", ") || "their weapon")
    .replace("{grit}", mods.STR >= mods.DEX ? "Strength" : "Dexterity").replace("{deity}", deity || "their god")
    .replace("{patron}", patron || "their patron").replace("{god}", god)
    .replace("{backstab}", String(1 + Math.floor(lv / 2) + backstab)).replace("{spell}", advOn || "one spell");
  const features = [
    { n: anc.trait[0], t: anc.trait[1], src: "Ancestry" },
    ...cls.features.map(([n, t]) => ({ n, t: fill(t), src: cls.n })),
    ...talents.map((x) => ({ n: `Talent (${x.r})`, t: fill(x.t), src: "Rolled" })),
  ];
  if (cast) features.push({ n: "Spellcasting bonus", t: `+${cast} to spellcasting checks (included below).`, src: "Talents" });

  return {
    clsId, cls: cls.n, src: cls.src || "Core", title, background: bg, deity, patron, notable, xp: lv === 0 ? d(4) : Math.floor(RNG() * lv * 10), xpNext: Math.max(1, lv) * 10,
    scores, hp, hpNow: hp, ac, armor: armorId, shield, attacks, features, spells, castStat: cls.cast || null, castBonus: cast,
    langs, gear, free, wallet, saved: wb.saved,
    slots: cap,
    deathTimer: `1d4${mods.CON ? ` ${fmt(mods.CON)}` : ""} rounds (min 1)`,
  };
}

export const sdMods = (sd) => Object.fromEntries(SD_STATS.map((k) => [k, modOf(sd.scores[k])]));

export const gearSlotsUsed = (sd) => sd.gear.reduce((t, g) => t + (Number(g.slots) || 0), 0) + Math.max(0, Math.ceil((sd.wallet.gp + sd.wallet.sp + sd.wallet.cp - 100) / 100));

export const walletText = (w) => [w.gp && `${w.gp} gp`, w.sp && `${w.sp} sp`, w.cp && `${w.cp} cp`].filter(Boolean).join(", ") || "empty pockets";


/* ============================ SHADOWDARK CHARACTER SHEET ============================
   Laid out like the printed sheet — stats · HP · AC / ancestry · class · title / alignment ·
   background · deity / talents · level · XP · attacks / languages · gear · spells —
   rendered as a Meridia HUD. */

export const hpState = (sd) => {
  if (!sd) return { k: "ok", label: "", tone: C.green };
  if (sd.status === "dead") return { k: "dead", label: "DEAD", tone: C.dim };
  if (sd.hpNow <= 0) return sd.status === "stable" ? { k: "stable", label: "DOWN · STABLE", tone: C.gold } : { k: "dying", label: "DYING", tone: C.blood };
  if (sd.hpNow <= Math.floor(sd.hp / 2)) return { k: "bloodied", label: "BLOODIED", tone: C.amber };
  return { k: "ok", label: "STANDING", tone: C.green };
};
// "1d8/1d10+2" → roll the first form, crit doubles the dice

export function rollDamage(expr, crit) {
  const str = String(expr);
  const m = str.split("/")[0].match(/(\d*)d(\d+)/);
  if (!m) return { total: Number(expr) || 0, dice: [] };
  const bm = str.match(/([+-]\s*\d+)\s*$/);
  const count = (Number(m[1]) || 1) * (crit ? 2 : 1), sides = Number(m[2]), bonus = bm ? Number(bm[1].replace(/\s/g, "")) : 0;
  const dice = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides));
  return { total: Math.max(1, dice.reduce((a, b) => a + b, 0) + bonus), dice, bonus };
}


