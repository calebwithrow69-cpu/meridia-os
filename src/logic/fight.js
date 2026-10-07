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

export const sideTotals = (fight) => ({
  up: fight.in.filter((c) => c.status === "up").length,
  down: fight.in.filter((c) => c.status !== "up").length,
  monHp: fight.in.filter((c) => c.kind === "mon" && c.status === "up").reduce((t, c) => t + c.hpNow, 0),
});
