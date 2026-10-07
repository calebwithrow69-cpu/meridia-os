/* The fight tracker.

   Pure functions over one piece of state, the same shape as the spine in world.js, so the app
   just holds it and saves it. Nothing here touches the global dice stream used for generating
   NPCs — a fight rolls its own dice.

   Initiative is core §2: d20 + DEX at the start of combat, highest first. A monster's DEX is in
   its statblock, so those roll themselves. PCs have no DEX in their record (the Party app tracks
   name, class, level, renown and CHA), so they roll a bare d20 and you nudge the number — every
   initiative is editable, which you want anyway for surprise, delays and held actions.

   HP starts from the book's listed value, which core §23 explicitly allows instead of rolling.
   It stays editable because the Hydra prints "HP *" (you choose how many heads), and because a
   mutated monster from the Make It Weird table won't match its printed line. */

const d = (n) => 1 + Math.floor(Math.random() * n);
const uid = () => Math.random().toString(36).slice(2, 9);

export const FIGHT_DEFAULT = { round: 0, turn: 0, in: [] };

/* The listed HP, or a working default where the book leaves it open. */
const startHp = (m) => (typeof m.hp === "number" && m.hp > 0 ? m.hp : 11);

export function addMonsters(fight, m, count = 1) {
  const have = fight.in.filter((c) => c.mon === m.n).length;
  const add = [];
  for (let i = 0; i < count; i++) {
    const nth = have + i + 1;
    const hp = startHp(m);
    add.push({
      id: uid(), kind: "mon", mon: m.n,
      name: count > 1 || have ? `${m.n} ${nth}` : m.n,
      lv: m.lv, ac: m.ac, hp, hpNow: hp, status: "up",
      init: null, dex: m.st ? m.st[1] : 0,
      atk: m.atk, mv: m.mv, al: m.al, note: "",
    });
  }
  return { ...fight, in: [...fight.in, ...add] };
}

export function addPc(fight, pc) {
  if (fight.in.some((c) => c.pc === pc.id)) return fight;
  const hp = pc.hp || 10;
  return { ...fight, in: [...fight.in, {
    id: uid(), kind: "pc", pc: pc.id, name: pc.name,
    lv: pc.lv || 1, ac: pc.ac || 10, hp, hpNow: hp, status: "up",
    init: null, dex: 0, atk: "", mv: "near", al: "", note: pc.cls || "",
  }] };
}

const patch = (fight, id, fn) =>
  ({ ...fight, in: fight.in.map((c) => (c.id === id ? fn(c) : c)) });

export const setField = (fight, id, k, v) => patch(fight, id, (c) => ({ ...c, [k]: v }));

export function hurt(fight, id, n) {
  return patch(fight, id, (c) => {
    // nothing in Shadowdark reads below zero, and "-5/20" on the row is just noise
    const hpNow = Math.max(0, Math.min(c.hp, c.hpNow - n));
    // core §4: at 0 HP a PC is dying; a monster is simply dead
    const status = hpNow > 0 ? "up" : c.kind === "pc" ? (c.status === "dead" ? "dead" : "dying") : "dead";
    return { ...c, hpNow, status };
  });
}

export function mend(fight, id, n) {
  return patch(fight, id, (c) => {
    const hpNow = Math.max(0, Math.min(c.hp, c.hpNow + n));
    return { ...c, hpNow, status: hpNow > 0 ? "up" : c.status };
  });
}

export const setHpMax = (fight, id, hp) =>
  patch(fight, id, (c) => ({ ...c, hp: Math.max(1, hp), hpNow: Math.min(c.hpNow, Math.max(1, hp)) }));

/* d20 + DEX, core §2. Only fills blanks unless `all`, so a number you typed isn't overwritten. */
export function rollInit(fight, all = false) {
  return { ...fight, round: Math.max(1, fight.round), turn: 0,
    in: fight.in.map((c) => (all || c.init == null ? { ...c, init: d(20) + (c.dex || 0) } : c)) };
}

/* Highest initiative first; un-rolled sink to the bottom, then ties break by name so the order
   never shuffles under you between renders. */
export const order = (fight) => [...fight.in].sort((a, b) =>
  (b.init == null ? -1e9 : b.init) - (a.init == null ? -1e9 : a.init) || a.name.localeCompare(b.name));

export function advance(fight) {
  const live = order(fight);
  if (!live.length) return fight;
  const next = fight.turn + 1;
  return next >= live.length
    ? { ...fight, round: Math.max(1, fight.round) + 1, turn: 0 }
    : { ...fight, round: Math.max(1, fight.round), turn: next };
}

export const whoseTurn = (fight) => (fight.round ? order(fight)[fight.turn] || null : null);
export const drop = (fight, id) => {
  const left = fight.in.filter((c) => c.id !== id);
  return { ...fight, in: left, turn: Math.min(fight.turn, Math.max(0, left.length - 1)) };
};
export const clearDead = (fight) => {
  const left = fight.in.filter((c) => c.status !== "dead");
  return { ...fight, in: left, turn: Math.min(fight.turn, Math.max(0, left.length - 1)) };
};
export const endFight = () => ({ ...FIGHT_DEFAULT });

/* ---------------- running a monster's turn ----------------

   The statblock prints attacks as one line, e.g.

     2 tentacle (near) +5 (1d8 + curse) or 1 tail +5 (3d6)
     2 touch +6 (2d8 + paralysis) and 2 spell +7
     4 rend +11 (2d12) or 1 fire breath

   so it has to be split before any of it can be rolled. The separator matters and is kept:
   "or" means choose one of these, "and" means it does both in the same turn.

   A segment with no attack bonus ("1 fire breath", "1 darkness", "2d4 eyestalk ray") is not an
   attack roll at all — it is a named action whose rules live in one of the monster's traits, so
   it is marked `action` and the UI points at the trait instead of rolling to hit. */

const DICE = /\d+d\d+/;

function parseSegment(seg, join) {
  let s = seg.trim();
  const raw = s;
  const cm = s.match(/^(\d+d\d+|\d+)\s+/);
  const count = cm ? cm[1] : "1";
  if (cm) s = s.slice(cm[0].length);

  let dmg = null, rider = null;
  const dm = s.match(/\(([^()]*)\)\s*$/);
  if (dm && DICE.test(dm[1])) {
    const parts = dm[1].split(/\s*\+\s*/).map((p) => p.trim()).filter(Boolean);
    const dice = parts.filter((p) => DICE.test(p));
    const plus = parts.filter((p) => /^\d+$/.test(p));
    const words = parts.filter((p) => !DICE.test(p) && !/^\d+$/.test(p));
    dmg = dice.join(" + ") + (plus.length ? ` + ${plus.join(" + ")}` : "");
    rider = words.length ? words.join(", ") : null;
    s = s.slice(0, dm.index).trim();
  }

  let bonus = null;
  const bm = s.match(/([+-]\d+)\s*$/);
  if (bm) { bonus = Number(bm[1]); s = s.slice(0, bm.index).trim(); }

  let range = null;
  const rm = s.match(/\(([^()]*)\)\s*$/);
  if (rm) { range = rm[1].trim(); s = s.slice(0, rm.index).trim(); }

  return { count, name: s.trim() || raw, range, bonus, dmg, rider, join,
           action: bonus === null, spell: /\bspell\b/i.test(s), raw };
}

export function parseAttacks(atk) {
  if (!atk) return [];
  const out = [];
  // split on " or " / " and ", remembering which joined each piece to the one before it
  const parts = String(atk).split(/\s+(or|and)\s+/i);
  for (let i = 0; i < parts.length; i += 2) {
    const join = i === 0 ? null : parts[i - 1].toLowerCase();
    if (parts[i] && parts[i].trim()) out.push(parseSegment(parts[i], join));
  }
  return out;
}

/* Roll one attack. Core §4: a natural 20 is a crit and doubles the damage DICE (not the flat
   bonus); a natural 1 always misses. `ac` is optional — pass it and the result says hit or miss,
   leave it out and it just reports the total for you to compare yourself. */
export function rollAttack(a, ac = null) {
  if (a.action) return { action: true, name: a.name };
  const nat = d(20);
  const total = nat + (a.bonus || 0);
  const crit = nat === 20, fumble = nat === 1;
  const res = { nat, total, crit, fumble, bonus: a.bonus || 0, name: a.name, rider: a.rider };
  if (ac != null) res.hit = crit || (!fumble && total >= ac);
  if (a.dmg && (crit || ac == null || res.hit !== false)) {
    const m = a.dmg.match(/(\d*)d(\d+)/);
    if (m) {
      const n = (Number(m[1]) || 1) * (crit ? 2 : 1), sides = Number(m[2]);
      const bm = a.dmg.match(/\+\s*(\d+)\s*$/);
      const flat = bm ? Number(bm[1]) : 0;
      const dice = Array.from({ length: n }, () => d(sides));
      res.dmg = { dice, flat, total: Math.max(1, dice.reduce((x, y) => x + y, 0) + flat) };
    }
  }
  return res;
}

/* Rolls how many attacks this creature makes, since the count can itself be a die ("2d4
   eyestalk ray"). */
export function attackCount(a) {
  const m = String(a.count).match(/^(\d+)d(\d+)$/);
  if (!m) return Number(a.count) || 1;
  let t = 0;
  for (let i = 0; i < Number(m[1]); i++) t += d(Number(m[2]));
  return t;
}

export const sideTotals = (fight) => ({
  up: fight.in.filter((c) => c.status === "up").length,
  down: fight.in.filter((c) => c.status !== "up").length,
  monHp: fight.in.filter((c) => c.kind === "mon" && c.status === "up").reduce((t, c) => t + c.hpNow, 0),
});
