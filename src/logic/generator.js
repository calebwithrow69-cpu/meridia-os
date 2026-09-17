import { C } from "../lib/theme.js";
import {
  RNG, setRNG, seededRNG, hashStr, d, pick, chance, clamp, fmt, cap, weighted, drawN,
} from "../lib/rng.js";
import {
  DISTRICTS, LOCATIONS, ROLE_POOLS, ARCHETYPES, CATS, NAMES, ANCESTRY_WEIGHTS, LODGING,
  CRIMES_MINOR, CRIMES_MAJOR, RECORD_STATES, PUNISH_MINOR, PUNISH_MAJOR, CONDITIONS,
  SIT_GENERAL, SIT_BY_FACTION, T, CHILD, CHILD_SIT, TIER_LV, SMALL_ANC, LITERATE,
  CHILD_BAD_CONDS, CHILD_BAD_RELS, IDENTIFIERS, FACTIONS, BAND_LABEL, BAND_COIN, HOLIDAYS,
  SHOP_SIGN_A, SHOP_SIGN_B, SHOP_GOODS, SHOP_QUIRK, SHOP_WONT, RUMORS, RUMOR_TRUTH,
  RUMOR_TWIST, RUMOR_FALSE, RUMOR_PRICE, RUMOR_GATE, VOICE_REGISTER, VOICE_PHRASE,
  VOICE_ADDRESS, VOICE_STOP, REL_TYPES, MUNDANE_JOBS, SHOP_JOBS, OPENER_FRAME,
  ANCESTRY_WEIGHTS_WR, HALFELF_A, HALFELF_B, NAMES_WR, ORIGINS, GODS, DEVOTION, NOTABLE_SECRETS,
  WR_FACTIONS, BOOK_NPCS, BOUNTY_POSTER, BOUNTY_TERMS, BOUNTY_CLAIM, BOUNTY_TWIST, PLATE,
  T_ON, T_OFF, ON, TEMPLATES, PLANT_BAD, PLANT_GOOD, byKind, locByN, BOOK_AGE, BOOK_DOING,
  BOOK_ARCH, FACTION_STRENGTH, BOOK_NAME_LISTS, MORE_NAMES, NAMED,
} from "../data/npc.js";
import {
  ABILITIES, SD_STATS, modOf, SCORE_BAND, scoreFor, SD_WEAPONS, SD_ARMOR, SD_ANCESTRY, alLabel,
  COMMON_LANGS, RARE_LANGS, TITLES, PRIEST_SPELLS, WIZARD_SPELLS, PRIEST_KNOWN, WIZARD_KNOWN,
  SD_CLASSES, ROLE_CLASS, ROLE_BACKGROUND, ROLE_BG_FIXED, GEAR, BAND_EXTRAS, OUTFITS,
  OUTFIT_BY_ROLE, ROLE_KIT, WALLET, WALLET_BONUS, rollDice,
} from "../data/shadowdark.js";
// `alLabel` was used below (the alignment-mismatch warning) but never imported — latent bug, fixed here.
import { buildSheet, sdMods } from "./sheet.js";

export function pickLodging(band, cat) {
  const table = LODGING[band];
  const fits = table.filter((e) => !e.cat || e.cat.includes(cat));
  if (fits.length) return pick(fits).t;
  const open = table.filter((e) => !e.cat);
  return pick(open.length ? open : table).t;
}

/* --- CRIMINAL RECORD --- */

export function fitsNpc(key, v, n) {
  const kid = n.roleId === "child";
  switch (key) {
    case "build": return !(SMALL_ANC.includes(n.anc) && /tall|long-limbed/.test(v));
    case "age": return !((n.lv >= 7 && /^(barely grown|young)$/.test(v)) || (n.lv >= 4 && v === "barely grown"));
    case "meal": return !((n.band >= 3 && /stale bread|nothing since|leftovers|cheapest|thin soup/.test(v)) || (n.band <= 1 && /good roast/.test(v)));
    case "maskState": return !(n.band >= 3 && /too fine|borrowed|home-made|tied on with string/.test(v));
    case "lie": return !((/never been arrested/.test(v) && n.record && n.record.state.id === "clean") || (/poorer/.test(v) && n.band <= 1) || (/richer/.test(v) && n.band === 4));
    case "fear": return !((/being poor again/.test(v) && n.band <= 1) || (/^the Guard$/.test(v) && ["duke", "onyx"].includes(n.facId)));
    case "secret": return !((/was once rich/.test(v) && n.band === 4) || (/can read/.test(v) && LITERATE.includes(n.roleId)) || (/never once been outside/.test(v) && n.origin && n.origin.key !== "masks") || (/informs for/.test(v) && n.roleId === "informant"));
    case "want": return !((/shop of their own/.test(v) && n.shop) || (/way into a guild/.test(v) && n.facId === "guild") || (/let in anywhere/.test(v) && n.renown >= 8) || (/better job|stop counting/.test(v) && n.band === 4));
    case "lever": return !(/food and a warm place/.test(v) && n.band >= 3);
    case "vice": return !(/above their station/.test(v) && n.band === 4);
    case "mood": return !(kid && /drunk/.test(v));
    case "smell": return !(kid && /beer|wine|tobacco|blood|perfume/.test(v));
    default: return true;
  }
}
// the quick numbers everywhere else are read off the Shadowdark sheet

export function syncThreat(n, keepHp) {
  if (!n.sd) return n;
  const sd = (n.sd = { ...n.sd, scores: { ...n.sd.scores } });
  n.mods = sdMods(sd);
  n.ac = sd.ac; n.hp = sd.hp; n.atks = 1;
  const a = sd.attacks[0];
  if (a) { n.atkBonus = typeof a.bonus === "number" ? a.bonus : Number(a.bonus) || 0; n.wName = a.n; n.wDmg = a.dmg; }
  n.armorName = `${SD_ARMOR[sd.armor] ? SD_ARMOR[sd.armor].n : "No armour"}${sd.shield ? " + shield" : ""}`;
  const hurt = (n.conds || []).some((c) => /Recently beaten|Nursing a wound/.test(c.n));
  if (!keepHp || sd.hpNow == null) sd.hpNow = hurt ? Math.max(1, Math.ceil(sd.hp / 2)) : sd.hp;
  return n;
}

export function repairDetails(n) {
  const kid = n.roleId === "child";
  const pools = {
    build: kid ? CHILD.build : T.build, age: kid ? CHILD.age : T.age, meal: T.meal, maskState: T.maskState,
    lie: kid ? CHILD.lie : T.lie, fear: kid ? CHILD.fear : T.fear, secret: kid ? CHILD.secret : T.secret,
    want: kid ? CHILD.want : T.want, lever: kid ? CHILD.lever : T.lever, vice: kid ? CHILD.vice : T.vice, mood: T.mood, smell: T.smell,
  };
  Object.keys(pools).forEach((k) => {
    if (fitsNpc(k, n[k], n)) return;
    const ok = pools[k].filter((v) => fitsNpc(k, v, n));
    if (ok.length) n[k] = pick(ok);
  });
  const opposed = (g) => g && g.al && n.al && g.al !== "N" && n.al !== "N" && g.al !== n.al;
  const isPriest = n.sd && n.sd.clsId === "priest";
  const faithOk = (f) => { const g = GODS[f.key]; if (isPriest) return !g || !g.al || g.al === n.al || (g.al === "N" && n.al === "N"); return !(opposed(g) && f.devotion !== "Secret"); };
  for (let i = 0; i < 10 && n.faith && !faithOk(n.faith); i++) n.faith = rollFaith(n.al, n.facId, n.roleId);
  if (n.faith && !faithOk(n.faith)) {
    if (isPriest && n.facId === "weeps") { n.al = GODS[n.faith.key].al; } // the cult's priests are the cult's alignment
    else if (isPriest) { const k = pick(Object.keys(GODS).filter((x) => GODS[x].al === n.al && !GODS[x].cult && x !== "lost")); if (k) n.faith = { key: k, ...GODS[k], devotion: DEVOTION[0].k, devNote: DEVOTION[0].note }; }
    else n.faith = { ...n.faith, devotion: "Secret", devNote: DEVOTION.find((x) => x.k === "Secret").note };
  }
  if (n.sd) {
    n.sd.deity = n.faith.name;
    const row = TITLES[n.sd.clsId] && TITLES[n.sd.clsId][n.al];
    if (row) n.sd.title = row[Math.min(4, Math.floor((n.lv - 1) / 2))];
    // "Deity" (Priest) tracks npc.faith — one of the Nine Gods. A Warlock's "Patron" is a separate,
    // named eldritch being (see WARLOCK_PATRONS) and must not be overwritten with a rolled faith.
    n.sd.features = n.sd.features.map((f) => f.n === "Deity" ? { ...f, t: f.t.replace(/Serves [^;,]+/, `Serves ${n.faith.name}`) } : f);
  }
  // you don't avoid the place where someone you work or drink with spends their days
  const friendly = /works for|drinks with|trades goods|grew up alongside|is owed a favour|cousin/;
  const clash = () => n.conns.some((c) => friendly.test(c.r) && n.avoid.p.includes(c.who)) || (n.assoc && n.avoid.p.includes(n.assoc));
  if (n.avoid && clash()) {
    const pool = (n.al === "C" || n.arch.crim === 2 ? byKind("law") : byKind("criminal")).filter((l) => ![n.haunt.n, n.drinkAt.n, n.runTo.n].includes(l.n) && !n.conns.some((c) => l.p.includes(c.who)) && !(n.assoc && l.p.includes(n.assoc)));
    if (pool.length) n.avoid = pick(pool);
  }
  if (kid) {
    if (!CHILD.doing_day.includes(n.doing) && !CHILD.doing_night.includes(n.doing)) n.doing = pick(n.time === "night" ? CHILD.doing_night : CHILD.doing_day);
    if (!n.pockets.every((x) => CHILD.pocket.includes(x))) n.pockets = drawN(CHILD.pocket, 3);
    if (!CHILD.garb.includes(n.garb)) n.garb = pick(CHILD.garb);
    if (n.faith && (n.faith.cult || n.faith.key === "lost")) { for (let i = 0; i < 6 && (n.faith.cult || n.faith.key === "lost"); i++) n.faith = rollFaith("N", n.facId, n.roleId); }
  }
  return n;
}

// hair, eyes, skin and mark are built from two parts — hundreds of combinations from short lists

export function rollLooks(anc) {
  const hair = T.hairByAnc[anc] ? pick(T.hairByAnc[anc]) : `${pick(T.hairColor)}, ${pick(T.hairStyle)}`;
  const eyes = `${pick(T.eyeLook)} ${pick(T.eyeColor)}`;
  const skin = `${pick(T.skinByAnc[anc] || T.skinTone)}, ${pick(T.skinTexture)}`;
  let mark;
  if (chance(0.05)) mark = "no marks at all";
  else {
    const kind = pick(T.markKind);
    mark = T.markSelfPlaced.includes(kind) ? kind : `${kind} ${pick(T.markWhere)}`;
  }
  return { hair, eyes, skin, mark };
}


export function halfElfName() { return pick(HALFELF_A) + pick(HALFELF_B); }

/* --- ORIGIN: the five city-states and the wild regions ---------------
   `w` weights how common that origin is on Meridia's streets.
   `anc` biases which ancestries come from there. ------------------- */

export function bountyScale(amount) {
  const r = amount / PLATE;
  if (r < 0.1) return "pocket money — a few nights' board";
  if (r < 0.25) return "about a suit of leather and a decent blade";
  if (r < 0.6) return "most of a suit of chainmail";
  if (r < 1.1) return "near enough a suit of plate mail";
  if (r < 2.2) return "two suits of plate. People will take this seriously";
  return "more than most guards see in a lifetime of service";
}

export function rollBounty(npc) {
  const id = npc.record.state.id;
  if (!["pursued", "wanted", "exiled"].includes(id)) return null;
  const major = /major|murder|arson|treason|kidnapping|depravity/.test(npc.record.crime || "");
  // base sums, in a world where 120 gp buys plate mail
  let base;
  if (id === "pursued") base = major ? 35 : 12;
  else if (id === "exiled") base = 50;
  else base = 80; // wanted
  const terms = pick(BOUNTY_TERMS);
  const lvBump = 1 + npc.lv * 0.09;
  const renBump = 1 + Math.max(0, npc.renown) * 0.03;
  let amount = Math.max(5, Math.round((base * terms.mult * lvBump * renBump) / 5) * 5);
  const poster = pick(BOUNTY_POSTER);
  if (!poster.legal) amount = Math.round(amount * 1.2 / 5) * 5;
  amount = Math.min(amount, 400); // nothing in this city is worth more than that
  const claim = pick(BOUNTY_CLAIM);
  // the twist must not contradict the competition line
  const contested = chance(0.45);
  const hunters = contested ? `${d(3) + 1} other hunters are working it` : "Nobody else has taken it yet";
  const twistPool = contested ? BOUNTY_TWIST : BOUNTY_TWIST.filter((t) => !t.includes("Another party"));
  return {
    amount, poster: poster.who, posterNote: poster.note, legal: poster.legal,
    terms: terms.t, claimAt: locByN(claim.at), claimHow: claim.how,
    twist: pick(twistPool), hunters, buys: bountyScale(amount),
  };
}

/* ==================== COMBAT ABILITIES ====================
   Homebrew, in Shadowdark's shape. Anything level 4 or above gets
   one; level 7+ gets two. Swap in the core book's own blocks if you
   have them — these are written to sit alongside, not replace.
   ========================================================= */

export function rollAbilities(npc) {
  if (npc.lv < 4) return [];
  const pool = (ABILITIES[npc.arch.cat] || ABILITIES.labor).slice();
  const n = npc.lv >= 7 ? 2 : 1;
  const out = [];
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(RNG() * pool.length), 1)[0]);
  if (["mage", "apprentice", "priest", "cultist", "druid"].includes(npc.roleId) && !out.some((a) => a.n === "Spellcasting")) {
    out.unshift(ABILITIES.arcane[0]);
  }
  return out;
}

/* =========================== TEMPLATES ===========================
   Tap to scan. `p` = generation parameters, `t` = which blocks show.
   Copy an entry to make your own; it appears on the menu at once.
   ================================================================= */


export function placesForRole(roleId) {
  return LOCATIONS.filter((l) => l.k.some((k) => (ROLE_POOLS[k] || []).includes(roleId)));
}


export function FILL(str, ctx) {
  return str.replace(/\{gp\}/g, ctx.gp).replace(/\{days\}/g, ctx.days).replace(/\{name\}/g, ctx.name)
    .replace(/\{loc\}/g, ctx.loc).replace(/\{tavern\}/g, ctx.tavern).replace(/\{market\}/g, ctx.market)
    .replace(/\{arena\}/g, ctx.arena).replace(/\{crim\}/g, ctx.crim).replace(/\{charity\}/g, ctx.charity)
    .replace(/\{faction\}/g, ctx.faction);
}


export function makeContext(npc) {
  return {
    gp: pick([15, 20, 30, 40, 50, 75, 100, 120, 200, 300]), days: d(6) + 1, name: pick(NAMED),
    loc: npc.haunt ? npc.haunt.name : pick(LOCATIONS).name,
    tavern: pick(byKind("tavern")).name, market: pick(byKind("market")).name,
    arena: pick(byKind("arena")).name, crim: pick(byKind("criminal")).name,
    charity: pick(byKind("charity")).name, faction: npc.fac.label,
  };
}


export function abilityMods(prime, lv, competence) {
  const order = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const m = {};
  const spread = competence === "low" ? [-2, -2, -1, -1, 0, 0] : competence === "high" ? [-1, 0, 0, 1, 1, 2] : [-2, -1, -1, 0, 0, 1];
  order.forEach((k) => { m[k] = pick(spread); });
  const bump = competence === "high" ? 2 : competence === "low" ? 0 : 1;
  m[prime] = clamp(bump + Math.floor(lv / 3) + pick([0, 1]), 0, 4);
  const second = pick(order.filter((k) => k !== prime));
  m[second] = clamp(m[second] + 1, -2, 3);
  return m;
}


export function pickFaction(s, roleId, arch) {
  if (s.faction && s.faction !== "any") return s.faction;
  const locked = { guard: "duke", sergeant: "duke", knight: "duke", spy: "onyx", charnelman: "charnel", rower: "rowers", beggar: "beggars", assassin: "guild", thief: "guild", fence: "guild", masked: "shroud", cultist: "weeps", apprentice: "gedgarrin", mage: "gedgarrin" }[roleId];
  if (locked) return locked;
  const pool = [["none", s.mundane ? 62 : 46]];
  if (arch.cat === "crime") pool.push(["guild", 24], ["barons", 10], ["shroud", 8]);
  if (arch.cat === "martial") pool.push(["duke", 26], ["onyx", 6]);
  if (arch.cat === "arcane") pool.push(["bardic", 18], ["gedgarrin", 14], ["jeweled", 5]);
  if (arch.cat === "clergy") pool.push(["charnel", 14], ["weeps", 8], ["beggars", 8]);
  if (arch.cat === "labor") pool.push(["rowers", 12], ["beggars", 10], ["barons", 8]);
  if (arch.cat === "trade") pool.push(["guild", 10], ["jeweled", 6], ["shroud", 5]);
  if (arch.cat === "noble") pool.push(["shroud", 18], ["duke", 12], ["jeweled", 8]);
  return weighted(pool);
}

Object.keys(WR_FACTIONS).forEach((k) => { FACTIONS[k] = { ...WR_FACTIONS[k], al: WR_FACTIONS[k].al }; });


export const REACT_ORDER = ["Hostile", "Suspicious", "Neutral", "Curious", "Friendly"];
// Shadowdark core: 0–6 Hostile, 7–8 Suspicious, 9 Neutral, 10–11 Curious, 12+ Friendly

export const reactionLabel = (sum) => (sum <= 6 ? "Hostile" : sum <= 8 ? "Suspicious" : sum === 9 ? "Neutral" : sum <= 11 ? "Curious" : "Friendly");

export function reactionRoll(mod = 0) {
  const a = d(6), b = d(6), sum = a + b + mod;
  return { dice: [a, b], mod, sum, label: reactionLabel(sum) };
}


// a secret warlock/witch/Knight of St. Ydris needs a SECRET that points at what they actually are —
// otherwise the "NOT WHAT THEY SEEM" badge is the only place their hidden nature ever shows up.
export function rollSecret(npc) {
  if (npc.roleId === "child") return pick(CHILD.secret);
  const pool = npc.sd && npc.sd.notable && NOTABLE_SECRETS[npc.sd.clsId];
  if (pool) return pick(pool).replace(/\{patron\}/g, npc.sd.patron || "their patron");
  return pick(T.secret);
}


export function rollRecord(npc, s) {
  if (s.record === "none") return { state: RECORD_STATES[0], crime: null, detail: "Never been taken.", tone: C.green };
  // someone hiding a warlock's pact, a witch's craft, or a cursed knighthood has more to lose if found out
  const heat = npc.arch.crim * 2 + FACTIONS[npc.facId].crim + (npc.al === "C" ? 2 : npc.al === "L" ? -1 : 0) + (npc.band <= 1 ? 1 : 0) + (npc.sd && npc.sd.notable ? 2 : 0);
  let stateId;
  if (s.record === "certain") stateId = pick(["pursued", "wanted", "served", "bought", "exiled"]);
  else if (s.record === "likely") stateId = heat >= 4 ? pick(["pursued", "served", "suspect", "bought", "wanted"]) : pick(["suspect", "served", "pursued"]);
  else if (s.record === "light") stateId = chance(0.55) ? "clean" : pick(["suspect", "served"]);
  else stateId = weighted([["clean", Math.max(2, 22 - heat * 3)], ["suspect", 6 + heat], ["served", 4 + heat], ["pursued", heat], ["bought", Math.max(0, heat - 2)], ["wanted", Math.max(0, heat - 4)], ["exiled", Math.max(0, heat - 6)]]);
  // a child's file is small; a serving Guard or Onyx agent can't be openly hunted (they'd be arrested at roll call)
  if (npc.roleId === "child" && !["clean", "suspect", "served"].includes(stateId)) stateId = pick(["suspect", "served"]);
  if (["duke", "onyx"].includes(npc.facId) && ["pursued", "wanted", "exiled"].includes(stateId)) stateId = pick(["suspect", "bought"]);
  const state = RECORD_STATES.find((r) => r.id === stateId);
  const tone = { green: C.green, gold: C.gold, blood: C.blood, dim: C.dim, violet: C.violet }[state.tone];
  if (stateId === "clean") return { state, crime: null, detail: "Never been taken. Whether that means innocent is another question.", tone };
  const major = npc.roleId !== "child" && (["wanted", "exiled"].includes(stateId) || (heat >= 5 && chance(0.4)));
  const ctx = makeContext(npc);
  const crime = FILL(major ? pick(CRIMES_MAJOR) : pick(CRIMES_MINOR), { ...ctx, gp: major ? pick([120, 250, 400, 600, 900]) : pick([20, 40, 60, 90]) });
  let detail;
  if (stateId === "suspect") detail = `The Guard has a name and no proof. ${chance(0.5) ? "A magistrate has been asking." : "One witness, and they're frightened."}`;
  else if (stateId === "pursued") detail = `Pursuit is live: ${major ? 3 * d(4) : d(4)} days left. 1:6 each day a Guard retinue confronts them.`;
  else if (stateId === "served") detail = `Convicted. Served ${major ? pick(PUNISH_MAJOR) : pick(PUNISH_MINOR)}.`;
  else if (stateId === "bought") detail = `Convicted on paper. A corrupt magistrate took ${pick([200, 400, 500, 800])} gp and it went away. He still has the file.`;
  else if (stateId === "wanted") detail = `Public execution if taken. ${chance(0.5) ? `A ${pick([100, 250, 500])} gp reward is posted.` : "No reward posted, which is worse."}`;
  else detail = "Exiled on pain of death, and came back anyway, under another name.";
  return { state, crime, detail, tone, barrister: npc.band >= 3 ? "Used Best Defense in Montmar, and can afford them again." : "Used Scribald Toderick at Shieldstone Law, who was cheap for a reason." };
}


export function rollConditions(npc, s) {
  const n = s.conditions === "off" ? 0 : s.conditions === "one" ? 1 : s.conditions === "two" ? 2 : weighted([[0, 30], [1, 50], [2, 20]]);
  // don't hand "Starving" to a wealthy merchant, or stack contradictory states
  const EXCL = [["Blessed this week", "Bloodroot high"], ["Blessed this week", "Bloodroot withdrawal"], ["Newly flush", "Starving"], ["Bloodroot high", "Bloodroot withdrawal"]];
  let pool = CONDITIONS.filter((c) => !(c.n === "Starving" && npc.band >= 3) && !(npc.roleId === "child" && CHILD_BAD_CONDS.test(c.n)));
  const out = [];
  for (let i = 0; i < n && pool.length; i++) {
    const c = pool.splice(Math.floor(RNG() * pool.length), 1)[0];
    pool = pool.filter((o) => !EXCL.some((e) => (e[0] === c.n && e[1] === o.n) || (e[1] === c.n && e[0] === o.n)));
    out.push({ n: c.n, t: { violet: C.violet, blood: C.blood, gold: C.gold, cyan: C.cyan, dim: C.dim, green: C.green }[c.t], m: FILL(c.m, makeContext(npc)) });
  }
  return out;
}


export function rollSituation(npc) {
  const facPool = SIT_BY_FACTION[npc.facId] || [];
  let pool = facPool.length && chance(0.6) ? facPool : SIT_GENERAL;
  if (npc.roleId === "child") pool = CHILD_SIT;
  const raw = pick(pool), ctx = makeContext(npc);
  return { s: FILL(raw.s, ctx), a: FILL(raw.a, ctx), c: raw.c };
}


export function rollPlaces(npc) {
  const roleSpots = placesForRole(npc.roleId);
  const haunt = pick(roleSpots.length ? roleSpots : LOCATIONS);
  const tier = npc.band <= 1 ? ["Poor"] : npc.band === 2 ? ["Poor", "Working"] : npc.band === 3 ? ["Working", "Wealthy"] : ["Wealthy"];
  const kid = npc.roleId === "child";
  const dp = (kid ? LOCATIONS.filter((l) => !l.k.includes("tavern") && l.k.some((k) => ["market", "charity", "arena", "dock"].includes(k))) : byKind("tavern")).filter((l) => tier.includes(DISTRICTS[l.d].cls));
  const drinkAt = pick(dp.length ? dp : kid ? LOCATIONS.filter((l) => l.k.includes("market") && !l.k.includes("tavern")) : byKind("tavern"));
  const runTo = pick(LOCATIONS.filter((l) => ["criminal", "charity", "temple", "dock"].some((k) => l.k.includes(k))));
  const avoidPool = npc.al === "C" || npc.arch.crim === 2 ? byKind("law") : byKind("criminal");
  let avoid = pick(avoidPool);
  const used = [haunt.n, drinkAt.n, runTo.n];
  if (used.includes(avoid.n)) { const alt = avoidPool.filter((l) => !used.includes(l.n)); if (alt.length) avoid = pick(alt); }
  return { haunt, drinkAt, runTo, avoid };
}

/* --- shops --- */

export function rollShop(npc) {
  if (!SHOP_JOBS.includes(npc.roleId)) return null;
  const goods = SHOP_GOODS[npc.roleId] || SHOP_GOODS.vendor_default;
  const sells = pick(goods);
  const priceMod = weighted([["Cheap — 25% under list, and it shows", 2], ["Fair — list price, no games", 5], ["Dear — 25% over, and worth it", 3], ["Steep — double, because they can", 1]]);
  const haggle = npc.mods.CHA >= 2 ? 15 : npc.mods.CHA >= 0 ? 12 : 9;
  // never give them a refusal that contradicts their own allegiance
  let wontPool = SHOP_WONT.filter((w) => {
    if (/gang|stolen|where their stock/.test(w) && (["guild", "barons", "shroud"].includes(npc.facId) || ["fence", "smuggler"].includes(npc.roleId))) return false;
    if (/Guard/.test(w) && ["duke", "onyx"].includes(npc.facId)) return false;
    if (/weapons/.test(w) && !/weapon|blade|steel|arms|knives/.test(sells)) return false;
    return true;
  });
  if (!wontPool.length) wontPool = SHOP_WONT;
  return {
    sign: `${pick(SHOP_SIGN_A)} ${pick(SHOP_SIGN_B)}`,
    sells,
    price: priceMod,
    haggle,
    quirk: pick(SHOP_QUIRK),
    wont: pick(wontPool),
    credit: npc.band >= 3 ? "Will extend credit to anyone with 8+ renown." : "Cash only, and counts it twice.",
  };
}

/* --- rumors, with the book's d100 table behind them --- */

export function rollRumors(npc) {
  const n = npc.facId === "beggars" || npc.roleId === "informant" ? 3 : d(3);
  const pool = RUMORS.slice();
  const out = [];
  for (let i = 0; i < n && pool.length; i++) {
    const r = pool.splice(Math.floor(RNG() * pool.length), 1)[0];
    // the book decides where it can: confirmed rumours are never false, garbled ones are always half right,
    // and anything the book doesn't settle is left for you to decide (set once, applies everywhere)
    const open = r.truth === "open";
    let truth = r.truth === "true" ? weighted([[RUMOR_TRUTH[0], 7], [RUMOR_TRUTH[1], 3]]) : r.truth === "half" ? RUMOR_TRUTH[1] : RUMOR_TRUTH[0];
    let note = truth.note;
    if (truth.k === "Half right") note = `Half right — ${pick(RUMOR_TWIST)}.`;
    if (truth.k === "False") note = `False — ${pick(RUMOR_FALSE)}.`;
    if (open) { out.push({ t: r.t, to: locByN(r.to), truth: "Undecided", open: true, note: "The book doesn't settle this one. Decide once and it holds everywhere.", tone: C.violet, d100: d(100) }); continue; }
    out.push({
      t: r.t, to: locByN(r.to), truth: truth.k, note,
      tone: { green: C.green, gold: C.gold, blood: C.blood }[truth.tone],
      d100: d(100),
    });
  }
  return { list: out, price: pick(RUMOR_PRICE) };
}


export function rollVoice() {
  return { register: pick(VOICE_REGISTER), phrase: pick(VOICE_PHRASE), address: pick(VOICE_ADDRESS), stop: pick(VOICE_STOP) };
}


export function rollConnections(npc) {
  const people = NAMED.filter((x) => x !== npc.selfName && x !== npc.name);
  const rels = REL_TYPES.filter((r) => !(npc.roleId === "child" && CHILD_BAD_RELS.test(r.r)));
  const out = [];
  for (let i = 0; i < 2; i++) {
    const who = people.splice(Math.floor(RNG() * people.length), 1)[0];
    const rel = rels.splice(Math.floor(RNG() * rels.length), 1)[0];
    out.push({ who, r: rel.r, tension: rel.tension });
  }
  return out;
}

/* The named of Meridia get openers built from who they are, not from
   the generic "what a random stranger is doing" table — a guildmaster
   should not be introduced haggling badly at a market stall. */
/* ages the book states outright */

export function buildOpener(npc, isBook) {
  const frames = isBook
    ? ["You get {build}, {age}, {doing}.", "{Build_c}, {age}. {Mark_c}.", "The first thing you notice is {mark}. Then that they're {doing}."]
    : OPENER_FRAME;
  let pool = frames;
  if (npc.roleId === "child" && !isBook) pool = ["A child, {age}, {doing}.", "{Build_c} kid, {age}. {Doing_c}.", "A {build} child — {age} — {doing}.", "You nearly miss them: a child, {age}, {doing}."];
  if (npc.mark === "no marks at all") pool = pool.filter((x) => !/mark/i.test(x));
  const f = pick(pool.length ? pool : frames);
  return f
    .replace(/\{build\}/g, npc.build).replace(/\{Build_c\}/g, cap(npc.build))
    .replace(/\{age\}/g, npc.age)
    .replace(/\{doing\}/g, npc.doing).replace(/\{Doing_c\}/g, cap(npc.doing))
    .replace(/\{mark\}/g, npc.mark).replace(/\{Mark_c\}/g, cap(npc.mark))
    .replace(/\{voice\}/g, npc.voice).replace(/\{Voice_c\}/g, cap(npc.voice));
}


export function helpPrice(npc) {
  if (npc.band >= 4) return "Not coin. Standing, access, or something only you can do.";
  if (npc.band <= 1) return `${pick([2, 5, 10, 15])} gp would change their week entirely.`;
  return `${pick([10, 20, 25, 40])} gp, or a favour of roughly that weight.`;
}


/* --- v5 helpers ---------------------------------------------------- */

/* a destitute beggar should not be wearing beaten silver */

export function pickMask(band) {
  const cheap = ["cracked papier-mâché", "cheap painted leather", "boiled leather, scorched", "pressed tin"];
  const mid = ["porcelain, hairline-fractured", "velvet over a wire frame", "bone, polished yellow", "black lacquer"];
  const rich = ["gilded wood", "beaten silver", "black lacquer"];
  if (band <= 1) return pick(chance(0.12) ? mid : cheap);       // 1 in 8: a gift, or stolen
  if (band === 2) return pick(cheap.concat(mid));
  if (band === 3) return pick(mid.concat(rich));
  return pick(rich.concat(mid));
}
/* where they're from, and why they're here */

export function rollOrigin(anc, cat) {
  const pool = Object.keys(ORIGINS).map((k) => {
    const o = ORIGINS[k];
    let w = o.w;
    if (o.anc) w = o.anc.includes(anc) ? w * (anc === "human" ? 1 : 3) : w * 0.1;
    else if (["dwarf", "elf", "halfelf"].includes(anc)) w = w * 0.55;
    return [k, w];
  });
  const k = weighted(pool);
  const o = ORIGINS[k];
  let doing = null;
  if (o.doing) {
    const fit = o.doing.filter((x) => !x.cat || x.cat.includes(cat));
    doing = fit.length ? pick(fit).t : null;
  }
  return { key: k, name: o.name, region: o.region, tell: o.tell, lang: o.lang, doing };
}
/* faith, weighted so a chaotic NPC doesn't end up a devout paladin's-god type */

export function rollFaith(al, facId, roleId) {
  // allegiance overrides the weighting entirely for these
  if (facId === "weeps") return { key: "weeps", ...GODS.weeps, devotion: "Devout", devNote: DEVOTION[0].note };
  if (facId === "charnel" && chance(0.5)) return { key: "kytheros", ...GODS.kytheros, devotion: "Observant", devNote: DEVOTION[1].note };
  const pool = Object.keys(GODS).map((k) => {
    const g = GODS[k];
    let w = g.nine ? 10 : 3;
    if (g.al === al) w *= 3.5;
    else if ((g.al === "L" && al === "C") || (g.al === "C" && al === "L")) w *= 0.15;
    if (g.cult) w = al === "C" ? 2 : 0.2;
    if (k === "lost") w = al === "C" ? 1.5 : 0.1;
    if (k === "shune" && facId === "shroud") w *= 4;
    if (k === "ramlaat" && facId === "barons") w *= 3;
    if (k === "gede" && ["bards", "bardic", "torch"].includes(facId)) w *= 3;
    if (k === "terragnis" && facId === "duke") w *= 2.5;
    if (k === "weeps" && facId === "weeps") w = 40;
    return [k, w];
  });
  const key = weighted(pool);
  const g = GODS[key];
  let dev = weighted(DEVOTION.map((x) => [x, x.w]));
  if (g.cult || key === "lost") dev = DEVOTION.find((x) => x.k === "Secret"); // you don't do this openly
  return { key, ...g, devotion: dev.k, devNote: dev.note };
}


export function generateNPC(s, keep = {}) {
  // filters that couldn't all be satisfied are reported on the sheet instead of silently dropped
  const warn = [];
  const tierR = s.tier && s.tier !== "any" ? TIER_LV[s.tier] : null;
  /* JOB */
  let roleId;
  if (keep.roleId) roleId = keep.roleId;
  else if (s.job && s.job !== "any") {
    roleId = s.job;
    const A = ARCHETYPES[roleId];
    if (s.mundane && !MUNDANE_JOBS.includes(roleId)) warn.push(`"Ordinary folk only" is on, but you picked ${A.label} as the exact job — the job won.`);
    if (s.cat && s.cat !== "any" && A.cat !== s.cat) warn.push(`${A.label} isn't ${CATS[s.cat]} work — the exact job won.`);
  } else {
    let pool = s.jobs && s.jobs.length ? s.jobs.slice() : Object.keys(ARCHETYPES);
    const narrow = (f, msg) => { if (f.length) pool = f; else warn.push(msg); };
    if (s.mundane) narrow(pool.filter((r) => MUNDANE_JOBS.includes(r)), `No ordinary-folk jobs fit the other filters, so "ordinary folk only" was ignored.`);
    if (s.cat && s.cat !== "any") narrow(pool.filter((r) => ARCHETYPES[r].cat === s.cat), `No ${CATS[s.cat]} jobs fit the other filters, so line of work was ignored.`);
    if (tierR) narrow(pool.filter((r) => ARCHETYPES[r].lv[1] >= tierR[0] && ARCHETYPES[r].lv[0] <= tierR[1]), `No jobs fit that power tier with the other filters, so tier was ignored.`);
    if (s.faction && s.faction !== "any") {
      const fc = { guild: "crime", shroud: "crime", barons: "crime", duke: "martial", onyx: "martial", gedgarrin: "arcane", bardic: "arcane", charnel: "clergy", weeps: "clergy", rowers: "labor", beggars: "labor" }[s.faction];
      if (fc) { const f = pool.filter((r) => ARCHETYPES[r].cat === fc); if (f.length) pool = f; }
    }
    // people at a location are mostly the people who belong there
    if (s.seenAt && !(s.jobs && s.jobs.length) && chance(0.75)) {
      const loc = locByN(Number(s.seenAt));
      if (loc) { const local = [...new Set(loc.k.flatMap((k) => ROLE_POOLS[k] || []))]; const f = pool.filter((r) => local.includes(r)); if (f.length) pool = f; }
    }
    // a level floor must not be forced onto a job that can't carry it
    narrow(pool.filter((r) => ARCHETYPES[r].lv[1] >= s.lvMin && ARCHETYPES[r].lv[0] <= s.lvMax), `No jobs fit LV ${s.lvMin}–${s.lvMax} with the other filters.`);
    roleId = pick(pool);
  }
  const arch = ARCHETYPES[roleId];

  // level = the overlap of what the job allows, your LV range, and your tier
  let lo = Math.max(arch.lv[0], s.lvMin, tierR ? tierR[0] : 0), hi = Math.min(arch.lv[1], s.lvMax, tierR ? tierR[1] : 10);
  if (lo > hi) {
    lo = Math.max(s.lvMin, tierR ? tierR[0] : 0); hi = Math.min(s.lvMax, tierR ? tierR[1] : 10);
    if (lo > hi) { lo = s.lvMin; hi = s.lvMax; }
    warn.push(`A ${arch.label} is normally LV ${arch.lv[0]}–${arch.lv[1]}; your level filters overrode that.`);
  }
  let lv = lo + Math.floor(RNG() * (hi - lo + 1));

  const anc = keep.anc || (s.ancestry === "any" ? weighted(ANCESTRY_WEIGHTS_WR) : s.ancestry);
  const gender = keep.gender || (s.gender === "any" ? (chance(0.5) ? "f" : "m") : s.gender);
  const np = NAMES[anc] || NAMES_WR[anc];
  // no more "Terese Grund" colliding with the Terese at The Blind Pig
  const freshFirst = () => (anc === "halfelf" ? halfElfName() : pick(gender === "f" ? np.f : np.m));
  const freshLast = () => pick(np.s);
  let first = keep.first || freshFirst();
  for (let i = 0; i < 12 && NAMED.some((x) => x.split(" ").includes(first)); i++) first = freshFirst();
  const isNoble = roleId === "noble" || arch.band === 4;
  let last = keep.last || (isNoble && anc === "human" && chance(0.55) ? pick(NAMES.human.noble) : freshLast());
  for (let i = 0; i < 12 && NAMED.some((x) => x.split(" ").includes(last)); i++) last = freshLast();
  const ident = keep.ident !== undefined ? keep.ident : (chance(s.nickChance ?? 0.3) ? pick(IDENTIFIERS) : null);

  let facId = keep.facId || pickFaction(s, roleId, arch);
  // children only fall in with street factions unless you asked for something else
  if (roleId === "child" && !keep.facId && (!s.faction || s.faction === "any")) facId = weighted([["none", 70], ["beggars", 20], ["guild", 10]]);
  const fac = FACTIONS[facId];
  let al;
  if (s.align !== "any") al = s.align;
  else if (fac.al && fac.al !== "N") al = chance(0.8) ? fac.al : "N"; // a lawful Bywater Baron is a contradiction; a neutral one isn't
  else al = weighted([["L", 35], ["N", 45], ["C", 20]]);
  if (s.align !== "any" && fac.al && fac.al !== "N" && s.align !== "N" && s.align !== fac.al) warn.push(`${alLabel[s.align]} members of ${fac.label} (${alLabel[fac.al]}) are unusual — kept because you asked.`);

  let band = arch.band;
  if (facId === "shroud") band = clamp(band + 1, 0, 4);
  if (facId === "beggars" || facId === "weeps") band = clamp(band - 1, 0, 4);
  if (lv >= 5) band = clamp(band + 1, 0, 4);
  if (s.band !== "any") band = Number(s.band);

  const mods = abilityMods(arch.prime, lv, s.competence);
  const [armorName, armorAC] = pick(arch.ac);
  const loose = ["none", "robes", "rags", "costume", "shawls", "blacks", "livery", "apron"].some((w) => armorName.includes(w));
  const ac = clamp(armorAC + (loose ? mods.DEX : Math.min(mods.DEX, 1)), 8, 20);
  let hp = 0;
  for (let i = 0; i < Math.max(1, lv); i++) hp += Math.max(1, d(arch.hd) + mods.CON); // each die floors at 1
  hp = Math.max(lv === 0 ? 2 : lv, hp);
  const [wName, wDmg] = pick(arch.wpn);
  const primeNudge = mods[arch.prime] >= 3 ? 1 : mods[arch.prime] <= -1 ? -1 : 0;
  const atkBonus = Math.max(0, Math.max(0, lv) + primeNudge + (band === 4 && chance(0.4) ? 1 : 0));

  const renown = clamp(mods.CHA + [-2, -1, 0, 2, 5][band] + Math.floor(lv / 3) + (isNoble ? 2 : 0), -3, 16);
  let renownNote = "Invisible to the well-born; barred from upscale places.";
  if (renown >= 12) renownNote = "A celebrity. High status defers to them.";
  else if (renown >= 8) renownNote = "A known name. The high-born treat them as a peer.";
  else if (renown >= 4) renownNote = "Well regarded by ordinary folk, ignored upstairs.";


  const npc = {
    id: (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 10).toUpperCase(),
    selfName: keep.selfName || null, warn,
    arch, roleId, facId, fac, band, al, first, last, ident, anc, gender,
    name: `${first} ${last}`, role: arch.label, lv, mods, ac, armorName, hp,
    // two attacks only for people who fight for a living
    wName, wDmg, atkBonus, atks: lv >= 4 && (["martial", "crime"].includes(arch.cat) || ["gladiator", "duelist", "knight", "mage"].includes(roleId)) ? 2 : 1, renown, renownNote,
    lodging: pickLodging(band, arch.cat),
    age: pick(T.age), build: pick(T.build), ...rollLooks(anc),
    voice: pick(T.voice), smell: pick(T.smell), tic: pick(T.tic),
    maskMat: pickMask(band), maskFace: pick(T.maskFace), maskState: pick(T.maskState), garb: pick(T.garb[band]),
    pockets: drawN(T.pocket, 3),
    meal: pick(T.meal), vice: pick(T.vice),
    doing: s.time === "night" ? pick(T.doing_night) : pick(T.doing_day),
    want: pick(T.want), fear: pick(T.fear), secret: pick(T.secret), lie: pick(T.lie),
    lever: pick(T.lever), brk: pick(T.break), mood: pick(T.mood), saw: pick(T.saw),
    time: s.time, holiday: s.holiday, tmpl: s.tmplName || null,
  };
  // coherence: children get children's details; experienced people aren't "barely grown"
  if (roleId === "child") Object.keys(CHILD).forEach((k) => { npc[k] = pick(CHILD[k]); });
  else if (lv >= 3 && npc.age === "barely grown") npc.age = pick(["young", "in their prime"]);

  Object.assign(npc, keep.places || rollPlaces(npc));
  npc.assoc = npc.haunt.p.length && chance(0.5) ? pick(npc.haunt.p) : null;
  npc.seenAt = s.seenAt ? locByN(Number(s.seenAt)) : null;
  npc.shop = rollShop(npc);
  npc.rumors = keep.rumors || rollRumors(npc);
  npc.vk = rollVoice();
  npc.conns = rollConnections(npc);
  if (npc.assoc && (npc.assoc === npc.selfName || npc.conns.some((c) => c.who === npc.assoc))) npc.assoc = null;
  npc.opener = buildOpener(npc);
  npc.helpPrice = helpPrice(npc);
  npc.plant = { bad: pick(PLANT_BAD), good: pick(PLANT_GOOD) };

  npc.origin = keep.origin || rollOrigin(anc, arch.cat);
  npc.faith = keep.faith || rollFaith(al, facId, roleId);
  // sd is built before record so a warlock/witch/knight of St. Ydris can weigh their own record roll
  npc.sd = buildSheet(npc, s);
  syncThreat(npc);
  // a notable NPC's SECRET should point at what they actually are, not a generic city secret
  npc.secret = rollSecret(npc);
  npc.record = keep.record || rollRecord(npc, s);
  // you cannot be both publicly wanted for a major crime and a celebrity
  if (["wanted", "exiled"].includes(npc.record.state.id)) npc.renown = Math.min(npc.renown, 5);
  npc.bounty = keep.bounty || rollBounty(npc);
  npc.abilities = rollAbilities(npc);
  npc.conds = keep.conds || rollConditions(npc, s);
  npc.sit = keep.sit || rollSituation(npc);

  let rmod = 0;
  if (npc.conds.some((c) => c.n === "Starving" || c.n === "Bloodroot withdrawal")) rmod -= 1;
  if (npc.conds.some((c) => c.n === "Newly flush" || c.n === "Blessed this week")) rmod += 1;
  if (["pursued", "wanted"].includes(npc.record.state.id)) rmod -= 1;
  npc.react = reactionRoll(rmod);
  npc.disp = REACT_ORDER.indexOf(npc.react.label);
  repairDetails(npc);
  npc.opener = buildOpener(npc); // after repairs, so the opener matches the sheet
  return npc;
}


/* ---- seed + edits: regenerating a saved NPC instead of storing the whole ~5KB object ----
   generateNPC is fully deterministic once RNG is swapped to a seeded stream (this is exactly
   what hydrateBookNpc already relies on below) — the only thing that ISN'T reproducible from a
   seed is `id`, which comes from Math.random() directly rather than RNG, so it's always carried
   separately rather than diffed. Saving becomes: seed + the settings/keep used + whatever fields
   differ from a fresh regeneration (an edit, a partial reroll, a manual EDIT-mode change — the
   diff doesn't need to know which). Loading is: regenerate, then reapply those fields. */

export function randomSeed() {
  return Math.floor(Math.random() * 0xFFFFFFFF);
}

export function generateSeeded(seed, settings, keep) {
  const prev = RNG;
  setRNG(seededRNG(seed));
  try { return generateNPC(settings, keep || {}); }
  finally { setRNG(prev); }
}

// fields that are never part of the diff — always carried on the compact record itself, or
// never meaningful to restore verbatim (transient/derived at render time)
const EDIT_EXCLUDE = new Set(["id", "seed", "genSettings", "genKeep"]);

export function diffNpc(fresh, current) {
  const edits = {};
  for (const k of Object.keys(current)) {
    if (EDIT_EXCLUDE.has(k)) continue;
    if (JSON.stringify(current[k]) !== JSON.stringify(fresh[k])) edits[k] = current[k];
  }
  return edits;
}

export function applyEdits(fresh, edits, id) {
  const out = { ...fresh, ...edits };
  if (id) out.id = id;
  return out;
}

// true only if regenerating from the stored seed and reapplying edits reproduces `current`
// exactly (aside from `id`) — used by the regression suite, and safe to call from the app too
export function verifyRoundTrip(current) {
  if (!current.seed && current.seed !== 0) return false;
  const fresh = generateSeeded(current.seed, current.genSettings, current.genKeep);
  const edits = diffNpc(fresh, current);
  const rebuilt = applyEdits(fresh, edits, current.id);
  return JSON.stringify(rebuilt) === JSON.stringify(current);
}


/* ---- which chassis each named person runs on, and their gender ---- */

export function hydrateBookNpc(b, settings) {
  const prev = RNG;
  setRNG(seededRNG(hashStr(b.n)));
  try {
    const [roleId, gender] = BOOK_ARCH[b.n] || ["vendor", "m"];
    const parts = b.n.replace(/^(Brother|Sister|Madame|Chancellor|Guildmaster|High Paladin|Duke|Matron) /, "").split(" ");
    const s = {
      ...settings, lvMin: b.lv, lvMax: b.lv, job: roleId, jobs: null, cat: "any",
      tier: "any", align: b.al, faction: b.fac, ancestry: b.anc, gender,
      band: "any", record: "auto", conditions: "auto", seenAt: b.at || null, mundane: false,
    };
    const n = generateNPC(s, { roleId, first: parts[0], last: parts.slice(1).join(" "), ident: null, anc: b.anc, gender, facId: b.fac, selfName: b.n });
    n.warn = []; // the book is allowed to break the generator's rules
    // canon wins
    n.id = "BOOK-" + hashStr(b.n).toString(36).slice(0, 5).toUpperCase();
    n.name = b.n; n.first = parts[0]; n.last = parts.slice(1).join(" "); n.ident = null;
    n.role = b.role; n.lv = b.lv; n.ac = b.ac; n.hp = b.hp;
    // the book's AC and HP win over the rolled sheet
    if (n.sd) { n.sd.ac = b.ac; n.sd.hp = b.hp; n.sd.canon = true; syncThreat(n); n.ac = b.ac; n.hp = b.hp; }
    n.canon = { desc: b.desc, wants: b.wants, hook: b.hook };
    n.isBook = true;
    n.doing = pick(BOOK_DOING);
    // age must respect the book, and nobody reaches level 7 "barely grown"
    if (BOOK_AGE[b.n]) n.age = BOOK_AGE[b.n];
    else if (b.lv >= 7) n.age = pick(["in their prime", "middle-aged", "past their prime"]);
    else if (b.lv >= 4) n.age = pick(["in their prime", "in their prime", "middle-aged"]);
    n.opener = buildOpener(n, true);
    if (b.at && locByN(b.at)) { n.haunt = locByN(b.at); n.seenAt = locByN(b.at); }
    n.abilities = rollAbilities(n);
    return n;
  } finally { setRNG(prev); }
}

/* ---- muster: a body of people from one faction at once ---- */

export function muster(facId, count, settings) {
  return Array.from({ length: count }, () => generateNPC({ ...settings, faction: facId, tmplName: FACTIONS[facId].label }, {}));
}
/* ================== v8: OVERRIDE, NOTES, PARTY ==================
   Nothing this tool generates is a fact. Every field is a default you
   can type over, and your version wins from then on.
   ================================================================ */

/* Sort presets — one tap reorders every panel for what you need first */

