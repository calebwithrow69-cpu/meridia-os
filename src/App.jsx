import { useState, useEffect, useRef } from "react";
import { Storage } from "./lib/storage.js";
import { C, MONO } from "./lib/theme.js";
import {
  RNG, setRNG, seededRNG, hashStr, d, pick, chance, clamp, fmt, cap, weighted, drawN,
} from "./lib/rng.js";
import { AC_CTX, VOL, setVol, tone, SFX, copyText } from "./lib/audio.js";
import {
  DISTRICTS, LOCATIONS, ROLE_POOLS, ARCHETYPES, CATS, NAMES, ANCESTRY_WEIGHTS, LODGING,
  CRIMES_MINOR, CRIMES_MAJOR, RECORD_STATES, PUNISH_MINOR, PUNISH_MAJOR, CONDITIONS,
  SIT_GENERAL, SIT_BY_FACTION, T, CHILD, CHILD_SIT, TIER_LV, SMALL_ANC, LITERATE,
  CHILD_BAD_CONDS, CHILD_BAD_RELS, IDENTIFIERS, FACTIONS, BAND_LABEL, BAND_COIN, HOLIDAYS,
  SHOP_SIGN_A, SHOP_SIGN_B, SHOP_GOODS, SHOP_QUIRK, SHOP_WONT, RUMORS, RUMOR_TRUTH,
  RUMOR_TWIST, RUMOR_FALSE, RUMOR_PRICE, RUMOR_GATE, VOICE_REGISTER, VOICE_PHRASE,
  VOICE_ADDRESS, VOICE_STOP, REL_TYPES, MUNDANE_JOBS, SHOP_JOBS, OPENER_FRAME,
  ANCESTRY_WEIGHTS_WR, HALFELF_A, HALFELF_B, NAMES_WR, ORIGINS, GODS, DEVOTION,
  WR_FACTIONS, BOOK_NPCS, BOUNTY_POSTER, BOUNTY_TERMS, BOUNTY_CLAIM, BOUNTY_TWIST, PLATE,
  T_ON, T_OFF, ON, TEMPLATES, PLANT_BAD, PLANT_GOOD, byKind, locByN, BOOK_AGE, BOOK_DOING,
  BOOK_ARCH, FACTION_STRENGTH, BOOK_NAME_LISTS, MORE_NAMES,
} from "./data/npc.js";
import {
  ancLabel, alLabel,
  ABILITIES, SD_STATS, modOf, SCORE_BAND, scoreFor, SD_WEAPONS, SD_ARMOR, SD_ANCESTRY,
  COMMON_LANGS, RARE_LANGS, TITLES, PRIEST_SPELLS, WIZARD_SPELLS, PRIEST_KNOWN, WIZARD_KNOWN,
  SD_CLASSES, ROLE_CLASS, ROLE_BACKGROUND, ROLE_BG_FIXED, GEAR, BAND_EXTRAS, OUTFITS,
  OUTFIT_BY_ROLE, ROLE_KIT, WALLET, WALLET_BONUS, rollDice,
} from "./data/shadowdark.js";
import {
  pickLodging, fitsNpc, syncThreat, repairDetails, rollLooks, halfElfName, bountyScale,
  rollBounty, rollAbilities, placesForRole, FILL, makeContext, abilityMods, pickFaction,
  REACT_ORDER, reactionLabel, reactionRoll, rollRecord, rollConditions, rollSituation,
  rollPlaces, rollShop, rollRumors, rollVoice, rollConnections, buildOpener, helpPrice,
  pickMask, rollOrigin, rollFaith, generateNPC, hydrateBookNpc, muster, rollSecret,
  generateSeeded, randomSeed, diffNpc, applyEdits,
} from "./logic/generator.js";
import {
  WATCHES, WORLD_DEFAULT, watchOf, timeOf, dayLabel, advanceWatch, setWatch, advanceDay,
  setPartyAt, undo as undoWorld, canUndo, logByDay, logLine,
} from "./logic/world.js";
import { CityMap, MapLegend, tierTone } from "./ui/CityMap.jsx";
import { MAP_PINS, BLDG_BY_LOC, addressOf, exteriorOf, interiorOf, lockLine, bldgId } from "./data/citymap.js";
import {
  stockOf, tradeLabel, coin, stockPeriod, daysToRestock, shopsIn, tradesPresent,
} from "./data/shops.js";
import { buildSheet, sdMods, gearSlotsUsed, walletText, hpState, rollDamage } from "./logic/sheet.js";
import { MONSTERS } from "./data/monsters_gen.js";
import {
  // `order` and `drop` are aliased: App already has an `order` state for panel layout
  FIGHT_DEFAULT, addMonsters, addPc, hurt, mend, setHpMax, rollInit, advance, whoseTurn,
  clearDead, endFight, sideTotals, setField as setFightField,
  order as initOrder, drop as dropFighter,
} from "./logic/fight.js";
import {
  Bracket, Panel, ConfirmBtn, Seg, Row, Stat, Select, Group, Toggle, Btn, Glyph, Search, hit,
  inputStyle, ShopShelf,
} from "./ui/primitives.jsx";
import { INK, PAPER, SBox, inkIn, glow, CharSheet } from "./ui/CharSheet.jsx";

export const VIEW_PRESETS = {
  full:    { label: "Full read", order: null },
  combat:  { label: "Combat first", order: ["stats", "abilities", "bounty", "record", "cond", "attire", "open", "sit", "places", "physical", "voice", "rumor", "conn", "interior", "life", "faith", "origin", "shop"] },
  social:  { label: "Talking first", order: ["open", "voice", "sit", "rumor", "interior", "conn", "faith", "origin", "physical", "shop", "record", "bounty", "cond", "stats", "abilities", "attire", "life", "places"] },
  street:  { label: "First glance", order: ["open", "physical", "attire", "voice", "places", "life", "sit", "stats", "cond", "record", "bounty", "abilities", "shop", "rumor", "conn", "interior", "faith", "origin"] },
  shop:    { label: "Shopping", order: ["shop", "open", "voice", "sit", "rumor", "physical", "attire", "conn", "stats", "record", "bounty", "abilities", "cond", "interior", "life", "places", "faith", "origin"] },
};

/* What a PC's renown opens, straight from the book's door policies */

export const RENOWN_DOORS = [
  { at: 5,  what: "Club Levantis (17) — front door" },
  { at: 8,  what: "The Royal Jeweler (14)" },
  { at: 8,  what: "The Golden Marmot (22)" },
  { at: 8,  what: "The Silk Lion (23) — masquerade costumes" },
  { at: 8,  what: "Gaston di Vanglare's dinners (15)" },
];

/* Fields you can type over. path is dotted; num coerces to a number. */

export const EDIT_FIELDS = [
  ["IDENTITY", null],
  ["Name", "name"], ["Role", "role"], ["Level", "lv", 1], ["Renown", "renown", 1],
  ["THREAT", null],
  ["Under pressure", "brk"],
  ["IN THE MOMENT", null],
  ["Read-aloud opener", "opener"], ["Right now", "doing"], ["Mood", "mood"],
  ["Situation", "sit.s"], ["They want", "sit.a"], ["Clock", "sit.c"],
  ["LOOK", null],
  ["Build", "build"], ["Age", "age"], ["Hair", "hair"], ["Eyes", "eyes"],
  ["Skin", "skin"], ["Distinguishing mark", "mark"], ["Voice", "voice"],
  ["Smell", "smell"], ["Tell", "tic"],
  ["Mask", "maskFace"], ["Mask material", "maskMat"], ["Clothing", "garb"],
  ["INTERIOR", null],
  ["Wants", "want"], ["Fears", "fear"], ["Secret", "secret"], ["Lies about", "lie"], ["Helps for", "lever"],
  ["Register", "vk.register"], ["Catchphrase", "vk.phrase"],
  ["LIFE", null],
  ["Sleeps in", "lodging"], ["Vice", "vice"],
  ["Faith", "faith.name"], ["Devotion", "faith.devotion"],
  ["Origin", "origin.name"], ["Why here", "origin.doing"],
  ["TROUBLE", null],
  ["Record status", "record.state.label"], ["Charge", "record.crime"], ["Record detail", "record.detail"],
  ["Bounty (gp)", "bounty.amount", 1], ["Posted by", "bounty.poster"], ["Terms", "bounty.terms"],
  ["TRADE", null],
  ["Shop sign", "shop.sign"], ["Sells", "shop.sells"], ["Haggle DC", "shop.haggle", 1],
];


export function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }

export function setPath(o, p, v) {
  const keys = p.split(".");
  const out = { ...o };
  let cur = out;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null) return out;
    cur[keys[i]] = Array.isArray(cur[keys[i]]) ? cur[keys[i]].slice() : { ...cur[keys[i]] };
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = v;
  return out;
}

/* =============================== UI ===============================
   MERIDIA OS — a desktop shell. The taskbar picks the app in the left
   column; anything you open lands in the centre column and stays there
   until you open something else. Sub-screens inside an app (Config's
   pages, crowd results) have their own back button in the column header.
   ================================================================= */


export const STORE_KEY = "meridia-os:v7";

/* A saved NPC that came from a plain scan carries the seed and settings it was generated with —
   regenerating from those and reapplying whatever differs (a manual edit, a partial reroll, a
   damage tick — the diff doesn't need to know which) reproduces it exactly, for a fraction of the
   stored size. Anything without a seed (a book NPC, a crowd member, or a save from before this
   existed) is kept as a full object — nothing is ever orphaned, it's just not compacted. */
export function compactForSave(n) {
  if (n.seed === undefined && n.seed !== 0) return n;
  const fresh = generateSeeded(n.seed, n.genSettings, n.genKeep || {});
  const edits = diffNpc(fresh, n);
  return { id: n.id, seed: n.seed, genSettings: n.genSettings, genKeep: n.genKeep || {}, edits, packed: true };
}

export function expandFromSave(n) {
  if (!n || !n.packed) return n;
  try {
    const fresh = generateSeeded(n.seed, n.genSettings, n.genKeep || {});
    return applyEdits(fresh, n.edits, n.id);
  } catch (e) {
    return n; // regeneration should never throw (the regression suite checks this) — if it ever
    // does, hand back the packed shell rather than losing the save entirely
  }
}


export const BLOCK_DEFS = [
  ["open", "Read-aloud opener"], ["origin", "Origin in the Reaches"], ["faith", "Faith & the Nine"],
  ["bounty", "Bounty"], ["sit", "Live situation"], ["cond", "Conditions"], ["record", "Criminal record"],
  ["stats", "Stats & threat"], ["abilities", "Combat abilities"], ["shop", "Shop & trade"],
  ["rumor", "Rumours"], ["voice", "Voice kit"], ["conn", "Connections"], ["physical", "Physical read"],
  ["attire", "Attire & pockets"], ["life", "Pattern of life"], ["interior", "Interior life"],
  ["places", "Places they mention"],
];

export const DEFAULT_ORDER = BLOCK_DEFS.map((b) => b[0]);

export const BLOCK_LABEL = Object.fromEntries(BLOCK_DEFS);

export const CARD_BLOCKS = ["open", "bounty", "sit", "stats", "abilities", "shop", "rumor"]; // v8–v12, unused now
// the NPC file: each tab holds the sheet sections that belong together

export const FILE_TABS = [
  { id: "overview", n: "Overview", blocks: ["open", "sit", "cond"] },
  { id: "identity", n: "Identity", blocks: ["origin", "faith", "physical", "attire", "life"] },
  { id: "talk", n: "Talk", blocks: ["voice", "interior", "rumor", "conn", "places"] },
  { id: "record", n: "Record", blocks: ["record", "bounty"] },
  { id: "trade", n: "Trade", blocks: ["shop"] },
  { id: "combat", n: "Combat", blocks: ["stats", "abilities"] },
  { id: "notes", n: "Notes", blocks: [] },
];

export const EDIT_TAB = { IDENTITY: "identity", THREAT: "combat", "IN THE MOMENT": "overview", LOOK: "identity", INTERIOR: "talk", LIFE: "identity", TROUBLE: "record", TRADE: "trade", SHEET: "combat" };

// labels are user-facing; ids are what saved data points at — never change ids

export const APPS = [
  { id: "npcs", name: "NPCs", short: "NPCs", sub: "Generate, book, groups, saved", tone: "amber", glyph: "eye" },
  { id: "map", name: "Map", short: "Map", sub: "The city itself — districts, sites, the party", tone: "cyan", glyph: "compass" },
  { id: "city", name: "Locations", short: "Locations", sub: "Fifty sites, eight districts", tone: "cyan", glyph: "map" },
  { id: "bestiary", name: "Monsters", short: "Monsters", sub: "The bestiary, and the fight tracker", tone: "blood", glyph: "fang" },
  { id: "party", name: "Party", short: "Party", sub: "Your PCs and their renown", tone: "green", glyph: "shield" },
  { id: "config", name: "Config", short: "Config", sub: "Layout, modes, sound, taskbar, your data", tone: "dim", glyph: "gear" },
];

export const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
// everything NPC lives in one app; these tab ids are the v8–v11 app ids, kept so nothing orphans

export const NPC_TABS = [
  { id: "scan", name: "Generate", full: "NPC Generator", sub: "Roll a stranger or a crowd", glyph: "eye" },
  { id: "named", name: "Book", full: "Book NPCs", sub: "Everyone the book names", glyph: "person" },
  { id: "muster", name: "Group", full: "Group of NPCs", sub: "Call up a faction in numbers", glyph: "group" },
  { id: "archive", name: "Saved", full: "Saved NPCs", sub: "Everyone you've kept, in folders", glyph: "box" },
  { id: "npcset", name: "Settings", full: "NPC settings", sub: "Filters, sheet sections, presets, sizes", glyph: "gear", prepOnly: true },
];

export const LEGACY_APP = { scan: "npcs", named: "npcs", muster: "npcs", archive: "npcs" };
// which apps sit on the taskbar in each mode — editable in Config

export const MODE_APPS = {
  prep: ["npcs", "map", "city", "bestiary", "party", "config"],
  play: ["npcs", "map", "city", "bestiary", "party"],
};

export const ROSTER_CAP = 600; // ~5 KB each; 600 is about 3 MB of the 5 MB limit

/* A statblock as plain text, in the book's own layout, for pasting into notes. */
export function monsterText(m) {
  const ST = ["S", "D", "C", "I", "W", "Ch"];
  const sign = (v) => (v >= 0 ? `+${v}` : `${v}`);
  return [
    m.n,
    m.d,
    `AC ${m.ac}${m.acn ? ` (${m.acn})` : ""}, HP ${m.hpRaw || m.hp}, ATK ${m.atk}, MV ${m.mv}, ` +
      m.st.map((v, i) => `${ST[i]} ${sign(v)}`).join(", ") + `, AL ${m.al}, LV ${m.lvRaw || m.lv}`,
    ...(m.sp || []).map((s) => `${s.n}. ${s.t}`),
  ].join("\n");
}

/* A shop as plain text, for pasting into notes or reading out. Marks the emporium's prices so
   the distinction between core and house prices survives leaving the app. */
export function shopText(shop, b) {
  const L = [`${shop.name} — ${tradeLabel(shop.type)}`, `${addressOf(b).line}, ${DISTRICTS[b.d].name}`, ""];
  for (const it of shop.stock) {
    const left = it.unlimited ? "  " : it.out ? "— " : `${it.qty}x`;
    L.push(`  ${left} ${it.n.padEnd(38)} ${(it.out ? "sold out" : it.price).padStart(10)}${it.canon ? "" : " *"}${it.note ? `  (${it.note})` : ""}`);
  }
  L.push("");
  if (shop.stock.some((i) => !i.canon)) L.push("* house price (adapted Equipment Emporium), not Shadowdark core.");
  L.push(shop.quirk, `They ${shop.wont}.`);
  return L.join("\n");
}

/* ---------------- sound: synthesised, no files ---------------- */

export const DEFAULTS = {
  time: "day", holiday: "none", cat: "any", job: "any", jobs: null, tier: "any",
  lvMin: 0, lvMax: 10, align: "any", faction: "any", ancestry: "any", gender: "any",
  band: "any", competence: "mixed", record: "auto", conditions: "auto",
  seenAt: null, tmplName: null, mundane: false, crowd: 4, sound: true, soundUI: true, soundCombat: true,
  uiMode: "prep", partyRail: true,
  // shell settings (Config)
  modeApps: null, collapsed: {}, zoom: 1, leftW: 380, vol: 1, nickChance: 0.3,
  viewPrep: "full", viewPlay: "card", sortPreset: "full", musterN: 5, npcTab: "scan",
  tabPrep: "identity", tabPlay: "overview", rumorTruth: {},
};
// the keys a filter reset / template / preset is allowed to touch — everything else is shell or world

export const FILTER_KEYS = ["cat", "job", "jobs", "tier", "lvMin", "lvMax", "align", "faction", "ancestry", "gender", "band", "competence", "record", "conditions", "seenAt", "tmplName", "mundane"];

export const onlyFilters = (o) => Object.fromEntries(FILTER_KEYS.filter((k) => o && k in o).map((k) => [k, o[k]]));

export const FILTER_DEFAULTS = onlyFilters(DEFAULTS);

export const NPC_PAGES = [
  ["params", "Generator filters", "Who gets generated when you hit SCAN"],
  ["blocks", "Sheet sections", "What an NPC sheet shows, and in what order"],
  ["presets", "Presets", "Save and load whole generator setups"],
];

export const CONFIG_PAGES = [
  ["taskbar", "Taskbar apps", "Which apps appear in Prep and in Play"],
  ["data", "Your data", "Backup, restore, storage use, reset"],
];


/* --- NAMES, EXPANDED (v13) ------------------------------------------
   Book lists (Shadowdark p.128, via the compilation) alternate f/m.
   Surnames are also built from two halves, so repeats are rare. */

export const SUB_LABEL = { ...Object.fromEntries([...NPC_PAGES, ...CONFIG_PAGES].map(([id, nm]) => [id, nm])), time: "Day log" };

export const BLOCK_KEYS_ALL = [...DEFAULT_ORDER, "disp", "canon_desc", "canon_wants", "canon_hook"];
// friendly names for fields when global search finds a match inside a saved NPC

export const PATH_LABEL = { ...Object.fromEntries(EDIT_FIELDS.filter((f) => f[1]).map(([l, p]) => [p, l])),
  notes: "Your notes", rumors: "Rumours", sit: "Situation", conns: "Connections", record: "Record", bounty: "Bounty", shop: "Shop", origin: "Origin", faith: "Faith", canon: "Book entry", conds: "Condition", vk: "Voice kit", pockets: "Pockets", haunt: "Found at", drinkAt: "Drinks at", runTo: "Runs to", avoid: "Avoids", abilities: "Abilities", plant: "Plant a rumour", seenAt: "Seen at", sd: "Character sheet" };

export const SKIP_PATHS = new Set(["arch", "fac", "id", "edited", "react", "mods", "time", "holiday", "tmpl", "cur", "roleId", "facId", "anc", "gender", "al", "band", "isBook"]);

export function npcFields(n) {
  const out = [["Faction", n.fac ? n.fac.label : ""], ["Ancestry", ancLabel[n.anc] || ""]];
  const walk = (o, path) => {
    if (o == null) return;
    if (typeof o === "string") { const top = path.split(".")[0]; out.push([PATH_LABEL[path] || PATH_LABEL[top] || cap(top), o]); return; }
    if (typeof o !== "object") return;
    if (o.k && o.d && o.name) { out.push([PATH_LABEL[path.split(".")[0]] || "Place", o.name]); return; } // a location: its name only
    for (const k in o) { if (!path && SKIP_PATHS.has(k)) continue; walk(o[k], path ? `${path}.${k}` : k); }
  };
  walk(n, "");
  return out;
}

export const kicker = (color = C.gold) => ({ color, fontSize: 10, letterSpacing: "0.14em", fontFamily: MONO, marginBottom: 6 });


export default function MeridiaOS() {
  const [app, setApp] = useState("npcs");
  const [sub, setSub] = useState(null);
  const [s, setS] = useState(DEFAULTS);
  const [show, setShow] = useState(Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])));
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [npc, setNpc] = useState(null);
  const [crowd, setCrowd] = useState([]);
  const [crowdLabel, setCrowdLabel] = useState("");
  const [fileTab, setFileTab] = useState("identity");
  const setMode = () => {}; // v12 card/full view — replaced by file tabs
  const [talker, setTalker] = useState("none");
  const [dmgDraft, setDmgDraft] = useState({});   // damage box per NPC id
  const [rollLog, setRollLog] = useState([]);     // last few attack rolls
  const [locks, setLocks] = useState({});
  const [roster, setRoster] = useState([]);
  const [groups, setGroups] = useState([]);
  const [presets, setPresets] = useState([]);
  const [openDist, setOpenDist] = useState(null);
  const [cityTab, setCityTab] = useState("sites");
  const [focus, setFocus] = useState(null);   // set to a building id to have the map fly to it
  const [fight, setFight] = useState(FIGHT_DEFAULT);   // the combat tracker, saved with everything else
  const [monQ, setMonQ] = useState({ q: "", band: null, al: null });
  const [selMon, setSelMon] = useState(null);
  const [addN, setAddN] = useState(1);
  const [openGroup, setOpenGroup] = useState(null);
  const [nameDraft, setNameDraft] = useState("");
  const [toast, setToast] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [pcs, setPcs] = useState([]);
  const [editing, setEditing] = useState(false);
  const [pcDraft, setPcDraft] = useState({ name: "", cls: "" });
  const [q, setQ] = useState({ named: "", archive: "", city: "" });
  const [showText, setShowText] = useState(false);
  const [clock, setClock] = useState(new Date());
  const [gq, setGq] = useState("");                 // global search
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  useEffect(() => { const r = () => setVw(window.innerWidth); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r); }, []);
  const searchRef = useRef(null);
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreDraft, setRestoreDraft] = useState("");
  const [saveState, setSaveState] = useState("ok");   // ok | blocked (couldn't read existing save) | failed (write refused)
  const [numDraft, setNumDraft] = useState({});       // half-typed numbers in edit mode ("-", "")
  const [world, setWorld] = useState(WORLD_DEFAULT);  // THE SPINE — shared world state
  const [mapSel, setMapSel] = useState({ district: null, loc: null, bldg: null, inside: false });
  const [dateDraft, setDateDraft] = useState("");
  /* The market ledger. Only what the party has actually bought is saved — shelves themselves
     stay derived — so a city of 196 shops costs nothing until they start spending.
     `period` is the restock week the ledger belongs to; a newer week wipes it. */
  const [market, setMarket] = useState({ period: 0, sold: {}, purseCp: 0 });
  const [shopQ, setShopQ] = useState({ district: null, type: null, q: "" });

  const play = s.uiMode === "play";
  const musterN = s.musterN || 5;
  const setMusterN = (n) => setS((p) => ({ ...p, musterN: n }));
  const viewPreset = VIEW_PRESETS[s.sortPreset] ? s.sortPreset : "full";
  const setViewPreset = (v) => setS((p) => ({ ...p, sortPreset: v }));
  const zoom = s.zoom || 1;
  useEffect(() => { setVol(s.vol ?? 1); }, [s.vol]);

  // which apps the taskbar shows in a mode. Config can't be removed from Prep, or you'd lock yourself out.
  const appsFor = (m) => {
    const chosen = ((s.modeApps && s.modeApps[m]) || MODE_APPS[m]).map((id) => LEGACY_APP[id] || id);
    const ids = APPS.map((a) => a.id).filter((id) => chosen.includes(id) || (m === "prep" && id === "config"));
    return ids.length ? ids : MODE_APPS[m];
  };
  const toggleModeApp = (m, id) => setS((p) => {
    const cur = [...new Set(((p.modeApps && p.modeApps[m]) || MODE_APPS[m]).map((x) => LEGACY_APP[x] || x))];
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    return { ...p, modeApps: { ...MODE_APPS, ...(p.modeApps || {}), [m]: next.length ? next : cur } };
  });
  useEffect(() => { if (!appsFor(s.uiMode).includes(app)) { setApp(appsFor(s.uiMode)[0]); setSub(null); } }, [s.modeApps, s.uiMode]);

  // collapsible sheet sections — remembered across NPCs and sessions
  const collapsed = s.collapsed || {};
  const cp = (k) => ({ collapsed: !!collapsed[k], onCollapse: () => { snd(SFX.toggle); setS((p) => ({ ...p, collapsed: { ...(p.collapsed || {}), [k]: !(p.collapsed || {})[k] } })); } });
  const collapseAll = (on) => { snd(SFX.tap); setS((p) => ({ ...p, collapsed: on ? Object.fromEntries(BLOCK_KEYS_ALL.map((k) => [k, true])) : {} })); };
  const snd = (fn) => { if (s.sound && s.soundUI) fn(); };
  const sndCombat = (fn) => { if (s.sound && s.soundCombat) fn(); };
  const toastTimer = useRef(null);
  const flash = (m, bad) => { setToast({ m, bad }); snd(bad ? SFX.alert : SFX.save); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), bad ? 3200 : 1800); };

  useEffect(() => { const t = setInterval(() => setClock(new Date()), 20000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        if (searchRef.current) { searchRef.current.focus(); searchRef.current.select(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------------- navigation: app in the left column, sub-screen inside it ---------------- */
  const openApp = (id, subView = null) => { snd(SFX.open); setApp(id); setSub(subView); };
  const npcTab = NPC_TABS.some((t) => t.id === s.npcTab) ? s.npcTab : "scan";
  const openNpcTab = (tab, subView = null) => { snd(SFX.open); setApp("npcs"); setSub(subView); setS((p) => ({ ...p, npcTab: tab })); };
  const openSub = (v) => { snd(SFX.open); setSub(v); };
  const closeSub = () => { snd(SFX.back); setSub(null); };
  const setUiMode = (m) => {
    snd(SFX.toggle);
    setS((p) => ({ ...p, uiMode: m }));
    setFileTab(m === "play" ? (s.tabPlay || "overview") : (s.tabPrep || "identity"));
    if (!appsFor(m).includes(app)) { setApp(appsFor(m)[0]); setSub(null); }
  };

  /* ---------------- persistence (same key as v8, so old saves load) ----------------
     If reading fails for any reason other than "there's no save yet", saving is paused —
     otherwise an empty app would overwrite your real data on the next change. */
  useEffect(() => {
    let alive = true;
    (async () => {
      let ok = false;
      try {
        const r = await Storage.get(STORE_KEY);
        ok = true;
        if (alive && r && r.value) {
          const v = JSON.parse(r.value);
          if (v.roster) setRoster(v.roster.map(expandFromSave));
          if (v.groups) setGroups(v.groups);
          if (v.presets) setPresets(v.presets);
          if (v.pcs) setPcs(v.pcs);
          if (v.market) setMarket({ period: 0, sold: {}, purseCp: 0, ...v.market });
          // clamp hpNow on the way in: a fight saved before negative HP was clamped out would
          // otherwise keep showing "-5/20" for ever
          if (v.fight) setFight({ ...FIGHT_DEFAULT, ...v.fight,
            in: (v.fight.in || []).map((c) => ({ ...c, hpNow: Math.max(0, c.hpNow) })) });
          if (v.world) setWorld({ ...WORLD_DEFAULT, ...v.world });
          if (v.settings) { const st = { ...DEFAULTS, ...v.settings }; setS(st); setFileTab(st.uiMode === "play" ? st.tabPlay : st.tabPrep); }
          if (v.show) setShow({ ...Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])), ...v.show });
          if (v.order && v.order.length === DEFAULT_ORDER.length) setOrder(v.order);
        }
      } catch (e) {
        // a missing key throws too, so check whether the save actually exists before deciding
        try {
          const l = await Storage.list("meridia-os");
          const keys = ((l && l.keys) || []).map((k) => (typeof k === "string" ? k : k.key));
          ok = !keys.includes(STORE_KEY);
        } catch (e2) { ok = false; }
      }
      if (!alive) return;
      if (!ok) setSaveState("blocked");
      setLoaded(true);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!loaded || saveState === "blocked") return;
    const t = setTimeout(async () => {
      try {
        const r = await Storage.set(STORE_KEY, JSON.stringify({ roster: roster.map(compactForSave), groups, presets, pcs, settings: s, show, order, world, market, fight }));
        setSaveState(r ? "ok" : "failed");
      } catch (e) { setSaveState("failed"); }
    }, 500); // typing in notes no longer rewrites the whole save on every keystroke
    return () => clearTimeout(t);
  }, [roster, groups, presets, pcs, s, show, order, world, market, fight, loaded, saveState]);

  /* the spine drives day/night for generation while it's switched on, so advancing a watch
     changes what the next stranger is doing */
  useEffect(() => {
    const t = timeOf(world);
    if (t && t !== s.time) setS((p) => ({ ...p, time: t }));
  }, [world.on, world.watch]);

  const set = (k, v) => setS((p) => {
    const n = { ...p, [k]: v };
    if (k === "cat") { n.job = "any"; n.jobs = null; }
    if (k === "job" && v !== "any") n.jobs = null;
    if (k === "lvMin") n.lvMax = Math.max(n.lvMax, Number(v));
    if (k === "lvMax") n.lvMin = Math.min(n.lvMin, Number(v));
    return n;
  });
  // filter resets, templates and presets only ever touch generator filters — never shell or world settings
  const resetFilters = () => { snd(SFX.tap); setS((p) => ({ ...p, ...FILTER_DEFAULTS })); };

  const buildKeep = (prev) => {
    if (!prev) return {};
    const k = {};
    if (locks.identity) { k.first = prev.first; k.last = prev.last; k.ident = prev.ident; k.anc = prev.anc; k.gender = prev.gender; k.facId = prev.facId; k.roleId = prev.roleId; }
    if (locks.places) k.places = { haunt: prev.haunt, drinkAt: prev.drinkAt, runTo: prev.runTo, avoid: prev.avoid };
    if (locks.record) { k.record = prev.record; k.bounty = prev.bounty; }
    if (locks.cond) k.conds = prev.conds;
    if (locks.sit) k.sit = prev.sit;
    if (locks.rumor) k.rumors = prev.rumors;
    if (locks.faith) k.faith = prev.faith;
    if (locks.origin) k.origin = prev.origin;
    return k;
  };

  // any change to the open NPC is written back to wherever else it lives, so edits stick
  const commitNpc = (next) => {
    setNpc(next);
    if (!next) return;
    setRoster((r) => r.map((x) => x.id === next.id ? next : x));
    setCrowd((c) => c.map((x) => x.id === next.id ? next : x));
  };

  // update any NPC wherever it lives (open sheet, crowd, saved list) — used by damage on crowd rows too
  const updateAny = (next) => {
    setRoster((r) => r.map((x) => x.id === next.id ? next : x));
    setCrowd((c) => c.map((x) => x.id === next.id ? next : x));
    setNpc((cur) => cur && cur.id === next.id ? next : cur);
  };
  const applyHp = (t, delta) => {
    if (!t || !t.sd) return;
    const sd = { ...t.sd };
    if (sd.status === "dead" && delta > 0) { flash("They're dead. Clear DEAD first if that's wrong.", true); return; }
    const before = Number(sd.hpNow) || 0;
    sd.hpNow = clamp(before + delta, 0, sd.hp);
    if (sd.hpNow > 0) sd.status = "ok"; else if (!sd.status || sd.status === "ok") sd.status = "dying";
    const next = { ...t, sd };
    syncThreat(next, true);
    updateAny(next);
    const half = Math.floor(sd.hp / 2);
    if (delta < 0) {
      const dying = sd.hpNow === 0 && before > 0;
      sndCombat(dying ? SFX.dying : SFX.damage);
      if (dying) flash(`${t.first} is down — dying. Timer ${sd.deathTimer}.`, true);
      else if (sd.hpNow <= half && before > half) flash(`${t.first} is bloodied — morale: DC 15 WIS or flee.`, true);
    } else sndCombat(SFX.heal);
  };
  const setHpStatus = (t, status) => { const next = { ...t, sd: { ...t.sd, status } }; syncThreat(next, true); updateAny(next); if (status === "dead") sndCombat(SFX.death); else snd(SFX.toggle); };
  const rollAttack = (t, a) => {
    const nat = 1 + Math.floor(Math.random() * 20);
    const bonus = typeof a.bonus === "number" ? a.bonus : Number(a.bonus) || 0;
    const crit = nat === 20, fumble = nat === 1;
    const dmg = rollDamage(a.dmg, crit);
    sndCombat(fumble ? SFX.fumble : crit ? SFX.crit : SFX.hit);
    setRollLog((l) => [{ id: Math.random(), npcId: t.id, who: t.first, w: a.n, nat, total: nat + bonus, bonus, crit, fumble, dmg }, ...l].slice(0, 6));
  };
  const hpCtl = (t, compact) => {
    if (!t || !t.sd) return null;
    const st = hpState(t.sd), v = dmgDraft[t.id] ?? "";
    const go = (sign) => { const x = parseInt(v, 10); if (!Number.isFinite(x) || x <= 0) return; applyHp(t, sign * x); setDmgDraft((d) => ({ ...d, [t.id]: "" })); };
    const small = { border: `1px solid ${C.lineHot}`, background: "transparent", fontFamily: MONO, fontSize: 10, padding: "3px 7px", cursor: "pointer", letterSpacing: "0.08em" };
    return (
      <div onClick={(e) => e.stopPropagation()}>
        {!compact && <div className="flex items-end gap-3 mb-2">
          <div style={{ fontFamily: MONO, fontSize: 34, lineHeight: 1, color: st.tone, textShadow: glow(st.tone, 10) }}>{t.sd.hpNow}<span style={{ fontSize: 16, color: C.dim }}>/{t.sd.hp}</span></div>
          <div className="flex-1">
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", color: st.tone }}>{st.label}</div>
            <div style={{ height: 5, background: C.line, marginTop: 4 }}><div style={{ height: 5, width: `${clamp((t.sd.hpNow / Math.max(1, t.sd.hp)) * 100, 0, 100)}%`, background: st.tone, boxShadow: glow(st.tone, 6), transition: "width .25s" }} /></div>
          </div>
        </div>}
        <div className="flex items-center gap-1 flex-wrap">
          {compact && <span style={{ fontFamily: MONO, fontSize: 11, color: st.tone, minWidth: 44 }}>{t.sd.hpNow}/{t.sd.hp}</span>}
          <input value={v} placeholder="0" inputMode="numeric" onChange={(e) => setDmgDraft((d) => ({ ...d, [t.id]: e.target.value.replace(/[^0-9]/g, "") }))}
            onKeyDown={(e) => { if (e.key === "Enter") go(-1); }} title="Type an amount — Enter deals damage"
            style={{ ...inputStyle, width: compact ? 44 : 60, padding: "3px 6px", fontFamily: MONO, textAlign: "center", borderColor: v ? C.blood : C.lineHot }} />
          <button onClick={() => go(-1)} style={{ ...small, borderColor: C.blood, color: C.blood, background: `${C.blood}14` }}>DMG</button>
          <button onClick={() => go(1)} style={{ ...small, borderColor: C.green, color: C.green }}>HEAL</button>
          {!compact && [1, 3, 5].map((x) => <button key={x} onClick={() => applyHp(t, -x)} style={{ ...small, color: C.dim }}>−{x}</button>)}
          {!compact && <button onClick={() => applyHp(t, t.sd.hp)} style={{ ...small, color: C.cyan }}>FULL</button>}
          {compact && st.k !== "ok" && <span style={{ fontFamily: MONO, fontSize: 9, color: st.tone, letterSpacing: "0.12em" }}>{st.label}</span>}
        </div>
        {!compact && st.k === "bloodied" && <div className="mt-2" style={{ fontSize: 12, color: C.amber }}>At half HP or below: morale check, DC 15 WIS, or they flee.</div>}
        {!compact && st.k === "dying" && <div className="mt-2 flex items-center gap-2 flex-wrap" style={{ fontSize: 12, color: C.blood }}>
          <span>Dying. Death timer {t.sd.deathTimer}; a natural 20 on their turn brings them up at 1 HP. DC 15 INT to stabilise.</span>
          <button onClick={() => setHpStatus(t, "stable")} style={{ ...small, color: C.gold, borderColor: C.gold }}>STABILISED</button>
          <button onClick={() => setHpStatus(t, "dead")} style={{ ...small, color: C.dim }}>DEAD</button></div>}
        {!compact && st.k === "stable" && <div className="mt-2 flex items-center gap-2" style={{ fontSize: 12, color: C.gold }}>Unconscious but stable.<button onClick={() => setHpStatus(t, "dead")} style={{ ...small, color: C.dim }}>DEAD</button></div>}
        {!compact && st.k === "dead" && <div className="mt-2 flex items-center gap-2" style={{ fontSize: 12, color: C.dim }}>Dead.<button onClick={() => setHpStatus(t, t.sd.hpNow > 0 ? "ok" : "dying")} style={{ ...small, color: C.cyan }}>CLEAR</button></div>}
      </div>
    );
  };
  const rollFeed = (t) => rollLog.some((r) => r.npcId === t.id) ? (
    <div className="mt-2">
      {rollLog.filter((r) => r.npcId === t.id).map((r, i) => (
        <div key={r.id} className="flex items-baseline gap-2" style={{ fontFamily: MONO, fontSize: 11, opacity: 1 - i * 0.13, borderTop: `1px solid ${C.line}55`, padding: "3px 0" }}>
          <span style={{ color: C.dim, width: 110, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{r.w}</span>
          <span style={{ color: r.crit ? C.green : r.fumble ? C.blood : C.amber }}>d20 {r.nat} {fmt(r.bonus)} = {r.total}{r.crit ? " CRIT" : r.fumble ? " MISS" : ""}</span>
          {!r.fumble && <span style={{ color: C.blood }}>DMG {r.dmg.total}{r.dmg.dice.length ? ` [${r.dmg.dice.join("+")}${r.dmg.bonus ? fmt(r.dmg.bonus) : ""}]` : ""}</span>}
        </div>))}
    </div>) : null;
  /* ---------------- the spine ---------------- */
  const bumpWatch = () => { snd(SFX.toggle); setWorld((w) => advanceWatch(w)); };
  const jumpWatch = (i) => { snd(SFX.toggle); setWorld((w) => setWatch(w, i)); };
  const nextDay = () => { snd(SFX.open); setWorld((w) => advanceDay(w)); flash("A new day in Meridia"); };
  const stepBack = () => { if (!canUndo(world)) return; snd(SFX.back); setWorld(undoWorld); flash("Time stepped back"); };
  const noteToLog = (text) => setWorld((w) => logLine(w, text, "note"));
  const placeParty = (n) => {
    const l = locByN(n);
    snd(SFX.save);
    setWorld((w) => setPartyAt(w, n, l ? `${l.n}. ${l.name}` : `#${n}`));
    flash(l ? `Party at ${l.name}` : "Party moved");
  };

  /* ---------------- the market ---------------- */
  /* Shelves refill once a week. The ledger of what's been bought carries the week it belongs
     to, so a stale one is dropped rather than needing a restock step anyone has to remember. */
  const period = stockPeriod(world.day);
  const purse = market.purseCp;

  const buy = (b, item, shop) => {
    if (!item.unlimited && item.qty <= 0) return;
    if (item.cp > purse) { snd(SFX.alert); flash(`Not enough coin — ${item.n} costs ${item.price}`); return; }
    const id = bldgId(b);
    snd(SFX.save);
    setMarket((m) => {
      const sold = m.period === period ? { ...m.sold } : {};
      if (!item.unlimited) sold[id] = { ...(sold[id] || {}), [item.n]: ((sold[id] || {})[item.n] || 0) + 1 };
      return { period, sold, purseCp: m.purseCp - item.cp };
    });
    setWorld((w) => logLine(w, `Bought ${item.n} for ${item.price} at ${shop.name}`, "buy"));
    flash(`${item.n} — ${item.price}`);
  };

  const adjustPurse = (cp) => setMarket((m) => ({ ...m, purseCp: Math.max(0, m.purseCp + cp) }));

  const openNpc = (n) => { snd(SFX.tap); setNpc(roster.find((x) => x.id === n.id) || n); setShowText(false); setNumDraft({}); };
  const run = (override = {}, keep = {}) => {
    snd(SFX.scan);
    const genSettings = { ...s, ...override }, seed = randomSeed();
    const next = generateSeeded(seed, genSettings, keep);
    next.seed = seed; next.genSettings = genSettings; next.genKeep = keep;
    setNpc(next); setShowText(false); setNumDraft({});
  };
  const runCrowd = (override = {}, label = "") => {
    snd(SFX.muster);
    const st = { ...s, ...override };
    setCrowd(Array.from({ length: Number(st.crowd) || 4 }, () => generateNPC(st, {})));
    setCrowdLabel(label || "Crowd");
    setApp("npcs"); setSub("crowd");
  };
  const runMuster = (facId) => {
    snd(SFX.muster);
    setCrowd(muster(facId, Number(musterN) || 5, s));
    setCrowdLabel(FACTIONS[facId].label);
    setApp("npcs"); setSub("crowd");
  };
  const applyTemplate = (t, asCrowd) => {
    const next = { ...s, ...FILTER_DEFAULTS, ...t.p, tmplName: t.name, jobs: t.p.jobs || null };
    setS(next);
    asCrowd ? runCrowd(next, t.name) : run(next, {});
  };

  const rerollPart = (part) => {
    if (!npc) return;
    snd(SFX.tap);
    const n = { ...npc };
    if (part === "record") { n.record = rollRecord(npc, s); n.bounty = rollBounty(n); if (["wanted", "exiled"].includes(n.record.state.id)) n.renown = Math.min(n.renown, 5); }
    if (part === "bounty") n.bounty = rollBounty(npc);
    if (part === "cond") n.conds = rollConditions(npc, s);
    if (part === "sit") n.sit = rollSituation(npc);
    if (part === "places") Object.assign(n, rollPlaces(npc));
    if (part === "rumor") n.rumors = rollRumors(npc);
    if (part === "voice") n.vk = rollVoice();
    if (part === "conn") n.conns = rollConnections(npc);
    if (part === "shop") n.shop = rollShop(npc);
    if (part === "open") n.opener = buildOpener(npc, npc.isBook);
    if (part === "faith") n.faith = rollFaith(npc.al, npc.facId, npc.roleId);
    if (part === "origin") n.origin = rollOrigin(npc.anc, npc.arch.cat);
    if (part === "abilities") n.abilities = rollAbilities(npc);
    if (part === "secret") n.secret = rollSecret(npc);
    if (part === "react") { n.react = reactionRoll(npc.react.mod); n.disp = REACT_ORDER.indexOf(n.react.label); }
    if (part === "name" && !npc.isBook) {
      const np = NAMES[npc.anc] || NAMES_WR[npc.anc];
      n.first = npc.anc === "halfelf" ? halfElfName() : pick(npc.gender === "f" ? np.f : np.m);
      n.last = pick(np.s);
      n.ident = chance(s.nickChance ?? 0.3) ? pick(IDENTIFIERS) : null;
      n.name = `${n.first} ${n.last}`;
    }
    commitNpc(n);
  };
  const nudge = (dir) => { if (!npc) return; snd(SFX.toggle); commitNpc({ ...npc, disp: clamp(npc.disp + dir, 0, 4) }); };

  // KEEP now overwrites an already-saved copy instead of silently skipping it
  const keepNpc = (target, groupId, quiet) => {
    const t = target || npc;
    if (!t) return false;
    const exists = roster.some((x) => x.id === t.id);
    if (!exists && roster.length >= ROSTER_CAP) { flash(`Saved list is full (${ROSTER_CAP}). Delete some in Saved first.`, true); return false; }
    setRoster((r) => r.some((x) => x.id === t.id) ? r.map((x) => x.id === t.id ? t : x) : [t, ...r]);
    if (groupId) {
      const inIt = groups.find((x) => x.id === groupId)?.members.includes(t.id);
      setGroups((g) => g.map((x) => x.id === groupId ? { ...x, members: inIt ? x.members.filter((m) => m !== t.id) : [...x.members, t.id] } : x));
      if (!quiet) flash(`${inIt ? "Removed from" : "Saved to"} ${groups.find((x) => x.id === groupId)?.name}`);
      return true;
    }
    if (!quiet) flash(exists ? "Saved (updated)" : "Saved");
    return true;
  };
  const keepMany = (list) => {
    const fresh = list.filter((c) => !roster.some((r) => r.id === c.id));
    const room = ROSTER_CAP - roster.length;
    const take = fresh.slice(0, Math.max(0, room));
    setRoster((r) => [...take, ...r.map((x) => list.find((c) => c.id === x.id) || x)]);
    if (take.length < fresh.length) flash(`Saved ${take.length} of ${fresh.length} — the saved list is full (${ROSTER_CAP}).`, true);
    else flash(`Saved ${list.length}`);
  };
  const newGroup = (name) => { const nm = (name || "").trim(); if (!nm) return; setGroups((g) => [...g, { id: Math.random().toString(36).slice(2, 8), name: nm, members: [] }]); setNameDraft(""); flash(`Folder "${nm}" created`); };
  const delGroup = (id) => setGroups((g) => g.filter((x) => x.id !== id));
  const removeFromGroup = (gid, nid) => setGroups((g) => g.map((x) => x.id === gid ? { ...x, members: x.members.filter((m) => m !== nid) } : x));
  const dropNpc = (id) => { setRoster((r) => r.filter((x) => x.id !== id)); setGroups((g) => g.map((x) => ({ ...x, members: x.members.filter((m) => m !== id) }))); };
  const byId = (id) => roster.find((x) => x.id === id);
  const isSaved = npc && roster.some((x) => x.id === npc.id);

  const loadPreset = (p) => { setS((cur) => ({ ...cur, ...FILTER_DEFAULTS, ...onlyFilters(p.s) })); setShow({ ...Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])), ...p.show }); setOrder(p.order && p.order.length === DEFAULT_ORDER.length ? p.order : DEFAULT_ORDER); flash(`Loaded "${p.name}"`); };
  const savePresetStrip = (name) => { const nm = (name || "").trim(); if (!nm) return; setPresets((p) => [...p.filter((x) => x.name !== nm), { name: nm, s: onlyFilters(s), show, order }]); setNameDraft(""); flash(`Preset "${nm}" saved`); };
  const delPreset = (nm) => setPresets((p) => p.filter((x) => x.name !== nm));
  const moveBlock = (k, dir) => { snd(SFX.tap); setOrder((o) => { const i = o.indexOf(k), j = i + dir; if (i < 0 || j < 0 || j >= o.length) return o; const n = o.slice(); n[i] = o[j]; n[j] = o[i]; return n; }); };

  const jobOptions = [["any", "Any job"]].concat(
    Object.keys(ARCHETYPES).filter((k) => (s.cat === "any" || ARCHETYPES[k].cat === s.cat) && (!s.mundane || MUNDANE_JOBS.includes(k)))
      .sort((a, b) => ARCHETYPES[a].label.localeCompare(ARCHETYPES[b].label))
      .map((k) => [k, `${ARCHETYPES[k].label} (LV ${ARCHETYPES[k].lv[0]}–${ARCHETYPES[k].lv[1]})`]));

  // plain-English summary of whatever generator filters are active
  const filterBits = [];
  if (s.tmplName) filterBits.push(s.tmplName);
  if (s.mundane) filterBits.push("ordinary folk only");
  if (s.cat !== "any") filterBits.push(CATS[s.cat]);
  if (s.job !== "any" && ARCHETYPES[s.job]) filterBits.push(ARCHETYPES[s.job].label);
  if (s.tier !== "any") filterBits.push(`${s.tier} tier`);
  if (s.lvMin > 0 || s.lvMax < 10) filterBits.push(`LV ${s.lvMin}–${s.lvMax}`);
  if (s.faction !== "any" && FACTIONS[s.faction]) filterBits.push(FACTIONS[s.faction].label);
  if (s.align !== "any") filterBits.push(alLabel[s.align]);
  if (s.ancestry !== "any") filterBits.push(ancLabel[s.ancestry]);
  if (s.band !== "any") filterBits.push(BAND_LABEL[s.band]);
  if (s.competence !== "mixed") filterBits.push(s.competence === "low" ? "hapless" : "capable");
  if (s.gender !== "any") filterBits.push(s.gender === "f" ? "women" : "men");
  if (s.record !== "auto") filterBits.push({ none: "clean records", light: "minor records", likely: "most have records", certain: "all have records" }[s.record]);
  if (s.conditions !== "auto") filterBits.push({ off: "no conditions", one: "one condition", two: "two conditions" }[s.conditions]);

  // the sort preset reorders what's already switched on; it never turns anything on or off
  const activeOrder = order;

  const asText = (n) => {
    if (!n) return "";
    const L = [`${n.name}${n.ident ? " " + n.ident : ""} — ${n.role}, LV ${n.lv} ${alLabel[n.al]} ${ancLabel[n.anc]}, ${BAND_LABEL[n.band]}`,
      `${n.fac.label} · Renown ${fmt(n.renown)}${n.seenAt ? ` · at ${n.seenAt.name}` : ""}`];
    if (n.canon) L.push(`\n${n.canon.desc}\nWANTS: ${n.canon.wants}\nTHREAD: ${n.canon.hook}`);
    const put = {
      open: () => `\nREAD ALOUD: ${n.opener}`,
      origin: () => `ORIGIN: ${n.origin.name} — ${n.origin.region}.${n.origin.doing ? " " + cap(n.origin.doing) + "." : ""} ${n.origin.tell}`,
      faith: () => `FAITH: ${n.faith.name} (${n.faith.nine ? "of the Nine" : n.faith.cult ? "cult" : "minor god"}) — ${n.faith.devotion}. ${n.faith.tell} Swears ${n.faith.oath}`,
      bounty: () => n.bounty ? `\nBOUNTY: ${n.bounty.amount} gp — ${n.bounty.buys}. Posted by ${n.bounty.poster}. ${n.bounty.terms} Claim at ${n.bounty.claimAt.name}. ${n.bounty.hunters}. ${n.bounty.twist}` : null,
      sit: () => n.sit ? `\nSITUATION: ${n.sit.s} Wants: ${n.sit.a} (clock: ${n.sit.c})` : null,
      cond: () => n.conds.length ? `CONDITION: ${n.conds.map((c) => `${c.n} — ${c.m}`).join(" | ")}` : null,
      record: () => `RECORD: ${n.record.state.label}${n.record.crime ? ` — ${n.record.crime}` : ""}. ${n.record.detail}`,
      stats: () => n.sd ? `\nCOMBAT — ${n.sd.cls}${n.lv ? ` ${n.lv}` : ""}${n.sd.title ? ` "${n.sd.title}"` : ""} · ${n.sd.background} · AC ${n.sd.ac} · HP ${n.sd.hpNow}/${n.sd.hp}\n${SD_STATS.map((k) => `${k} ${n.sd.scores[k]} (${fmt(modOf(n.sd.scores[k]))})`).join("  ")}\nAttacks: ${n.sd.attacks.map((a) => `${a.n} ${typeof a.bonus === "number" ? fmt(a.bonus) : a.bonus} (${a.dmg})`).join("; ")}\nTalents: ${n.sd.features.map((f) => `${f.n} — ${f.t}`).join("; ")}${n.sd.spells.length ? `\nSpells: ${n.sd.spells.map((x) => `${x.n} (T${x.tier})`).join(", ")}` : ""}\nLanguages: ${n.sd.langs.join(", ")}\nGear (${gearSlotsUsed(n.sd)}/${n.sd.slots}): ${n.sd.gear.map((g) => g.n).join(", ")}. Also: ${n.sd.free.map((g) => g.n).join(", ")}.\nPurse: ${walletText(n.sd.wallet)}. Under pressure: ${n.brk}.` : `\nAC ${n.ac} (${n.armorName}) · HP ${n.hp} · ATK ${n.atks}x ${n.wName} ${fmt(n.atkBonus)} (${n.wDmg})\nS ${fmt(n.mods.STR)} D ${fmt(n.mods.DEX)} C ${fmt(n.mods.CON)} I ${fmt(n.mods.INT)} W ${fmt(n.mods.WIS)} Ch ${fmt(n.mods.CHA)}\nReaction: ${REACT_ORDER[effDisp(n)]}. Under pressure: ${n.brk}.`,
      abilities: () => n.abilities.length ? `ABILITIES: ${n.abilities.map((a) => `${a.n} — ${a.t}`).join(" | ")}` : null,
      shop: () => n.shop ? `\nSHOP "${n.shop.sign}": ${n.shop.sells}. ${n.shop.price}. Haggle DC ${n.shop.haggle}. ${n.shop.quirk}` : null,
      rumor: () => `\nRUMOURS (shares ${RUMOR_GATE[REACT_ORDER[effDisp(n)]].n}; price ${n.rumors.price})\n` + n.rumors.list.map((r, i) => `  ${i + 1}. [${r.truth}] ${cap(r.t)} -> ${r.to.n}. ${r.to.name}. ${r.note}`).join("\n"),
      voice: () => `VOICE: ${n.vk.register}. Says ${n.vk.phrase} Calls you ${n.vk.address}. Clams up at ${n.vk.stop}.`,
      conn: () => n.conns.map((c) => `CONNECTION: ${c.r} ${c.who}, ${c.tension}.`).join("\n"),
      physical: () => `\nLook: ${n.build}, ${n.age}. ${n.hair}; ${n.eyes} eyes; ${n.skin}. ${n.mark}. Voice ${n.voice}. Smells of ${n.smell}. Tell: ${n.tic}.`,
      attire: () => `Mask: ${n.maskFace} in ${n.maskMat}, ${n.maskState}. Wearing ${n.garb}. Purse: ${n.sd ? walletText(n.sd.wallet) : `${n.coin} ${n.cur}`}; ${n.pockets.join("; ")}.`,
      life: () => `Sleeps in ${n.lodging}. Vice: ${n.vice}. Right now: ${n.doing}. Mood: ${n.mood}.`,
      interior: () => `Wants ${n.want}. Fears ${n.fear}. SECRET: ${cap(n.secret)}. Helps for: ${n.lever}.`,
      places: () => `Found around ${n.haunt.name}; ${n.roleId === "child" ? "spends time at" : "drinks at"} ${n.drinkAt.name}; runs to ${n.runTo.name}; avoids ${n.avoid.name}.`,
    };
    activeOrder.forEach((k) => { if (show[k] && put[k]) { const v = put[k](); if (v) L.push(v); } });
    if (n.notes) L.push(`\nNOTES: ${n.notes}`);
    return L.join("\n");
  };
  /* The browser refuses a clipboard write when the window isn't focused, so the failure has to
     say something the reader can act on — and "open the text box on the sheet" only makes sense
     for an NPC, hence the caller-supplied fallback. */
  const doCopy = (text, whenBlocked = "Copy blocked — open the text box on the sheet") =>
    copyText(text, (ok) => flash(ok ? "Copied" : whenBlocked, !ok));

  /* ---- override: type over anything, and your version sticks ---- */
  const editField = (path, raw, isNum) => {
    if (!npc) return;
    let v = raw;
    if (path === "sd.langs") v = String(raw).split(",").map((x) => x.trim()).filter(Boolean);
    else if (path === "sd.free") v = String(raw).split("\n").map((x) => ({ n: x, slots: 0 }));
    else if (isNum) {
      const clean = String(raw).trim();
      setNumDraft((d) => ({ ...d, [path]: raw }));
      if (!/^-?\d+$/.test(clean)) return; // half-typed or not a number: hold it in the box, don't write it to the sheet
      v = Number(clean);
    }
    const next = setPath(npc, path, v);
    next.edited = { ...(npc.edited || {}), [path]: true };
    if (path.startsWith("sd.")) syncThreat(next, true);
    commitNpc(next);
  };
  // add (i = -1), change, or remove (item = null) one entry in a sheet list
  const editList = (key, i, item) => {
    if (!npc || !npc.sd) return;
    const arr = npc.sd[key].slice();
    if (i < 0) arr.push(item); else if (item === null) arr.splice(i, 1); else arr[i] = item;
    const next = { ...npc, sd: { ...npc.sd, [key]: arr }, edited: { ...(npc.edited || {}), [`sd.${key}`]: true } };
    syncThreat(next, true);
    commitNpc(next);
  };
  const buildSheetFor = () => { if (!npc) return; snd(SFX.scan); const next = { ...npc, sd: buildSheet(npc, s) }; if (npc.isBook) { next.sd.ac = npc.ac; next.sd.hp = npc.hp; next.sd.canon = true; } syncThreat(next); commitNpc(next); };
  const setNote = (txt) => { if (npc) commitNpc({ ...npc, notes: txt }); };

  const talkPc = pcs.find((p) => p.id === talker);
  const talkCha = talkPc ? Number(talkPc.cha) || 0 : 0;
  const rIdx = (sum) => REACT_ORDER.indexOf(reactionLabel(sum));
  const effDisp = (n) => (n && n.react ? clamp(n.disp + rIdx(n.react.sum + talkCha) - rIdx(n.react.sum), 0, 4) : 2);
  const dispTone = [C.blood, C.gold, C.dim, C.cyan, C.green][effDisp(npc)];
  const truthOf = (r) => (r.open ? (s.rumorTruth || {})[r.t] || null : r.truth);
  const truthTone = (t) => ({ True: C.green, "Half right": C.gold, False: C.blood }[t] || C.violet);
  const setRumorTruth = (t, v) => { snd(SFX.toggle); setS((p) => ({ ...p, rumorTruth: { ...(p.rumorTruth || {}), [t]: v } })); };
  const toggleLock = (k) => { snd(SFX.toggle); setLocks((l) => ({ ...l, [k]: !l[k] })); };
  const lk = (k) => (npc && !npc.isBook ? { locked: !!locks[k], onLock: () => toggleLock(k) } : {});
  const hol = HOLIDAYS[s.holiday];
  const TONE = { amber: C.amber, gold: C.gold, blood: C.blood, cyan: C.cyan, green: C.green, dim: C.dim };
  const modeTone = play ? C.amber : C.cyan;

  const renderBlock = (k) => {
    const n = npc;
    if (!show[k]) return null;
    switch (k) {
      case "open": return <div key={k} className="mb-2 p-2" style={{ borderLeft: `2px solid ${C.gold}`, fontSize: 14, lineHeight: 1.5, fontStyle: "italic", breakInside: "avoid" }}>{n.opener}</div>;
      case "origin": return <Panel key={k} {...cp(k)} {...lk("origin")} label="ORIGIN" tone={C.cyan} onReroll={n.isBook ? null : () => rerollPart("origin")}>
        <Row k="FROM" v={n.origin.name} tone={C.cyan} /><Row k="MEANING" v={cap(n.origin.region)} />
        {n.origin.doing && <Row k="WHY HERE" v={cap(n.origin.doing)} tone={C.amber} />}
        <Row k="TELL" v={n.origin.tell} /><Row k="SPEAKS" v={n.sd ? n.sd.langs.join(", ") : n.origin.lang} /></Panel>;
      case "faith": return <Panel key={k} {...cp(k)} {...lk("faith")} label="FAITH" tone={C.gold} onReroll={n.isBook ? null : () => rerollPart("faith")}>
        <div className="flex items-baseline gap-2"><span style={{ color: C.gold, fontSize: 16 }}>{n.faith.name}</span>
          <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>{n.faith.nine ? "ONE OF THE NINE" : n.faith.cult ? "CULT" : "MINOR GOD"}</span></div>
        <Row k="DOMAIN" v={cap(n.faith.domain)} />
        <Row k="DEVOTION" v={`${n.faith.devotion} — ${n.faith.devNote}`} tone={n.faith.devotion === "Secret" ? C.violet : C.text} />
        <Row k="SHOWS AS" v={n.faith.tell} tone={C.amber} /><Row k="SWEARS BY" v={n.faith.oath} tone={C.gold} />
        {n.faith.at && <Row k="WORSHIPS AT" v={`${n.faith.at}. ${locByN(n.faith.at).name}`} tone={C.cyan} />}</Panel>;
      case "bounty": return n.bounty ? <Panel key={k} {...cp(k)} label="BOUNTY" tone={C.blood} onReroll={() => rerollPart("bounty")}>
        <div className="flex items-baseline gap-2 mb-1">
          <span style={{ color: C.blood, fontSize: 24, fontFamily: MONO, fontWeight: 700 }}>{n.bounty.amount}</span>
          <span style={{ color: C.blood, fontSize: 12, fontFamily: MONO }}>GP</span><span className="flex-1" />
          <span className="px-2 py-1" style={{ border: `1px solid ${n.bounty.legal ? C.gold : C.violet}`, color: n.bounty.legal ? C.gold : C.violet, fontSize: 9, fontFamily: MONO }}>{n.bounty.legal ? "LAWFUL" : "UNOFFICIAL"}</span></div>
        <Row k="WHICH IS" v={n.bounty.buys} tone={C.amber} />
        <Row k="POSTED BY" v={n.bounty.poster} /><Row k="NOTICE" v={n.bounty.posterNote} />
        <Row k="TERMS" v={n.bounty.terms} tone={C.blood} />
        <Row k="CLAIM AT" v={`${n.bounty.claimAt.n}. ${n.bounty.claimAt.name} — ${n.bounty.claimHow}`} tone={C.cyan} />
        <Row k="COMPETITION" v={n.bounty.hunters} /><Row k="TWIST" v={n.bounty.twist} tone={C.violet} /></Panel> : null;
      case "sit": return n.sit ? <Panel key={k} {...cp(k)} {...lk("sit")} label="LIVE SITUATION" tone={C.amber} onReroll={() => rerollPart("sit")}>
        <div style={{ fontSize: 14, lineHeight: 1.5 }}>{n.sit.s}</div>
        <div className="mt-2"><Row k="THEY WANT" v={n.sit.a} tone={C.amber} /></div>
        <Row k="CLOCK" v={cap(n.sit.c)} tone={C.blood} /><Row k="HELP COSTS" v={n.helpPrice} /></Panel> : null;
      case "cond": return n.conds.length ? <Panel key={k} {...cp(k)} {...lk("cond")} label="CONDITION" tone={C.violet} onReroll={() => rerollPart("cond")}>
        {n.conds.map((c, i) => <div key={i} className="py-1" style={{ borderBottom: i < n.conds.length - 1 ? `1px solid ${C.line}55` : "none" }}>
          <div style={{ color: c.t, fontSize: 12, fontFamily: MONO }}>{c.n.toUpperCase()}</div>
          <div style={{ fontSize: 13, lineHeight: 1.45 }}>{c.m}</div></div>)}</Panel> : null;
      case "record": return <Panel key={k} {...cp(k)} {...lk("record")} label="CRIMINAL RECORD" tone={n.record.tone} onReroll={() => rerollPart("record")}>
        <Row k="STATUS" v={n.record.state.label} tone={n.record.tone} />
        {n.record.crime && <Row k="CHARGE" v={cap(n.record.crime)} />}
        <Row k="DETAIL" v={n.record.detail} /></Panel>;
      case "stats": return <Panel key={k} {...cp(k)} label="THREAT" tone={C.blood}>
        <div className="grid grid-cols-4 gap-1 mb-2">
          <Stat k="AC" v={n.ac} tone={C.amber} /><Stat k="HP" v={n.hp} tone={C.blood} />
          <Stat k="ATK" v={fmt(n.atkBonus)} tone={C.amber} /><Stat k="LV" v={n.lv} tone={C.cyan} /></div>
        <div className="grid grid-cols-6 gap-1 mb-2">
          {["STR", "DEX", "CON", "INT", "WIS", "CHA"].map((a) => <Stat key={a} k={a} v={fmt(n.mods[a])} tone={n.mods[a] >= 2 ? C.amber : C.text} />)}</div>
        <Row k="ATTACK" v={`${n.atks} × ${n.wName} ${fmt(n.atkBonus)} (${n.wDmg})`} />
        <Row k="ARMOR" v={cap(n.armorName)} /><Row k="PRESSURE" v={cap(n.brk)} tone={C.blood} /></Panel>;
      case "abilities": return n.abilities.length ? <Panel key={k} {...cp(k)} label="COMBAT ABILITIES" tone={C.amber} onReroll={() => rerollPart("abilities")}>
        {n.abilities.map((a, i) => <div key={i} className="py-1" style={{ borderBottom: i < n.abilities.length - 1 ? `1px solid ${C.line}55` : "none" }}>
          <div style={{ color: C.amber, fontSize: 12, fontFamily: MONO }}>{a.n.toUpperCase()}</div>
          <div style={{ fontSize: 13, lineHeight: 1.45 }}>{a.t}</div></div>)}</Panel> : null;
      case "shop": return n.shop ? <Panel key={k} {...cp(k)} label="SHOP" tone={C.gold} onReroll={() => rerollPart("shop")}>
        <div style={{ fontSize: 16, color: C.gold }}>{n.shop.sign}</div>
        <Row k="SELLS" v={cap(n.shop.sells)} /><Row k="PRICES" v={n.shop.price} />
        <Row k="HAGGLE" v={`CHA check DC ${n.shop.haggle}`} tone={C.amber} />
        <Row k="QUIRK" v={n.shop.quirk} /><Row k="WON'T" v={cap(n.shop.wont)} tone={C.blood} /></Panel> : null;
      case "rumor": return <Panel key={k} {...cp(k)} {...lk("rumor")} label="RUMOURS" tone={C.cyan} onReroll={() => rerollPart("rumor")}>
        <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.45, marginBottom: 6 }}>
          Shares <span style={{ color: dispTone }}>{RUMOR_GATE[REACT_ORDER[effDisp(n)]].n}</span> of {n.rumors.list.length}. Price: <span style={{ color: C.amber }}>{n.rumors.price}</span>.</div>
        {n.rumors.list.map((r, i) => {
          const gated = i >= RUMOR_GATE[REACT_ORDER[effDisp(n)]].n;
          const tr = truthOf(r);
          return <div key={i} className="py-2" style={{ borderTop: `1px solid ${C.line}55`, opacity: gated ? 0.4 : 1 }}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span style={{ color: C.dim, fontSize: 9, fontFamily: MONO }}>d100 {r.d100}</span>
              <span style={{ color: truthTone(tr), fontSize: 9, fontFamily: MONO }}>{(tr || "UNDECIDED").toUpperCase()}</span>
              {r.open && ["True", "Half right", "False"].map((v) => <button key={v} onClick={() => setRumorTruth(r.t, tr === v ? null : v)}
                style={{ border: `1px solid ${tr === v ? truthTone(v) : C.line}`, background: tr === v ? `${truthTone(v)}22` : "transparent", color: truthTone(v), fontSize: 9, fontFamily: MONO, cursor: "pointer", padding: "0 5px" }}>{v.toUpperCase()}</button>)}
              {gated && <span style={{ color: C.dim, fontSize: 9, fontFamily: MONO }}>· WITHHELD</span>}</div>
            <div style={{ fontSize: 13, lineHeight: 1.45, marginTop: 2 }}>{cap(r.t)}</div>
            <div style={{ fontSize: 11, color: C.cyan, marginTop: 3 }}>Points to {r.to.n}. {r.to.name}</div>
            <div style={{ fontSize: 11, color: r.open ? C.dim : r.tone, marginTop: 2 }}>{r.open ? (tr ? "Your call — holds for everyone who repeats it." : r.note) : r.note}</div></div>; })}
        <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${C.line}` }}>
          <div style={{ color: C.gold, fontSize: 10, fontFamily: MONO, marginBottom: 4 }}>PLANT ONE — SKULDUGGERY DC 9</div>
          <Row k="RENOWN −1" v={`That they ${n.plant.bad}.`} tone={C.blood} />
          <Row k="RENOWN +1" v={`That they ${n.plant.good}.`} tone={C.green} /></div></Panel>;
      case "voice": return <Panel key={k} {...cp(k)} label="VOICE" tone={C.cyan} onReroll={() => rerollPart("voice")}>
        <Row k="REGISTER" v={cap(n.vk.register)} /><Row k="SAYS" v={n.vk.phrase} tone={C.gold} />
        <Row k="CALLS YOU" v={cap(n.vk.address)} /><Row k="CLAMS UP AT" v={cap(n.vk.stop)} tone={C.blood} /></Panel>;
      case "conn": return <Panel key={k} {...cp(k)} label="CONNECTIONS" tone={C.gold} onReroll={() => rerollPart("conn")}>
        {n.conns.map((c, i) => <Row key={i} k={i === 0 ? "TIES" : ""} v={<span>{cap(c.r)} <span style={{ color: C.gold }}>{c.who}</span>, {c.tension}.</span>} />)}
        {n.assoc && <Row k="KNOWN TO" v={n.assoc} tone={C.gold} />}</Panel>;
      case "physical": return <Panel key={k} {...cp(k)} label="PHYSICAL READ">
        <Row k="BUILD" v={`${cap(n.build)}, ${n.age}`} /><Row k="HAIR" v={cap(n.hair)} />
        <Row k="EYES" v={cap(n.eyes)} /><Row k="SKIN" v={cap(n.skin)} />
        <Row k="MARK" v={cap(n.mark)} tone={C.gold} /><Row k="VOICE" v={cap(n.voice)} />
        <Row k="SCENT" v={cap(n.smell)} /><Row k="TELL" v={cap(n.tic)} tone={C.amber} /></Panel>;
      case "attire": return <Panel key={k} {...cp(k)} label="ATTIRE & CARRIED" tone={C.gold}>
        <Row k="MASK" v={`${cap(n.maskFace)}, ${n.maskMat}`} tone={C.gold} />
        <Row k="CONDITION" v={cap(n.maskState)} /><Row k="CLOTHING" v={cap(n.garb)} />
        {hol.note && <Row k="OCCASION" v={`${hol.label}. ${hol.note}`} tone={C.cyan} />}
        <Row k="PURSE" v={n.sd ? walletText(n.sd.wallet) : `${n.coin} ${n.cur}`} tone={C.gold} />
        {n.pockets.map((p, i) => <Row key={i} k={i === 0 ? "POCKETS" : ""} v={cap(p)} />)}</Panel>;
      case "life": return <Panel key={k} {...cp(k)} label="PATTERN OF LIFE">
        <Row k="SLEEPS IN" v={cap(n.lodging)} /><Row k="LAST ATE" v={cap(n.meal)} />
        <Row k="VICE" v={cap(n.vice)} /></Panel>;
      case "interior": return <Panel key={k} {...cp(k)} label="INTERIOR" tone={C.violet} onReroll={() => rerollPart("secret")}>
        <Row k="WANTS" v={cap(n.want)} /><Row k="FEARS" v={cap(n.fear)} />
        <Row k="LIES ABOUT" v={cap(n.lie)} /><Row k="SECRET" v={cap(n.secret)} tone={C.violet} />
        <Row k="HELPS FOR" v={cap(n.lever)} tone={C.amber} /></Panel>;
      case "places": return <Panel key={k} {...cp(k)} {...lk("places")} label="PLACES THEY MENTION" tone={C.cyan} onReroll={() => rerollPart("places")}>
        <Row k="FOUND AT" v={`${n.haunt.n}. ${n.haunt.name} — ${DISTRICTS[n.haunt.d].name}`} />
        <Row k={n.roleId === "child" ? "SPENDS TIME AT" : "DRINKS AT"} v={`${n.drinkAt.n}. ${n.drinkAt.name}`} />
        <Row k="RUNS TO" v={`${n.runTo.n}. ${n.runTo.name}`} />
        <Row k="AVOIDS" v={`${n.avoid.n}. ${n.avoid.name}`} /></Panel>;
      default: return null;
    }
  };

  /* small list-row used by every list in the left column */
  const ListBtn = ({ active, onClick, title, right, sub: subline, subTone = C.cyan, extra }) => (
    <button onClick={onClick} className="w-full text-left p-2 mb-1"
      style={{ border: `1px solid ${active ? C.amber : C.line}`, background: active ? `${C.amber}12` : C.panel, cursor: "pointer", borderRadius: 0 }}>
      <div className="flex items-baseline gap-2">
        <span style={{ color: C.text, fontSize: 13 }}>{title}</span><span className="flex-1" />
        {right && <span style={{ color: C.dim, fontSize: 9, fontFamily: MONO }}>{right}</span>}</div>
      {subline && <div style={{ color: subTone, fontSize: 11, fontFamily: MONO, marginTop: 2 }}>{subline}</div>}
      {extra}
    </button>
  );

  /* ============================ GLOBAL SEARCH ============================
     One box, everything the app knows: saved NPCs (every field, including
     your notes), book NPCs, the current crowd, party, locations, factions,
     templates, and the apps and settings themselves. */
  const Hl = ({ text, t }) => {
    const i = text.toLowerCase().indexOf(t);
    if (i < 0) return <>{text}</>;
    const a = Math.max(0, i - 40), z = Math.min(text.length, i + t.length + 50);
    return <>{a > 0 && "…"}{text.slice(a, i)}<span style={{ color: C.amber, background: `${C.amber}22` }}>{text.slice(i, i + t.length)}</span>{text.slice(i + t.length, z)}{z < text.length && "…"}</>;
  };
  const clearSearch = () => setGq("");
  const searchResults = () => {
    const t = gq.trim().toLowerCase();
    const has = (v) => String(v || "").toLowerCase().includes(t);
    const groupsOut = [];
    const add = (title, items) => { if (items.length) groupsOut.push({ title, items }); };

    const on = appsFor(s.uiMode);
    add("Apps & settings", [
      ...APPS.filter((a) => on.includes(a.id) && (has(a.name) || has(a.sub)))
        .map((a) => ({ key: "app" + a.id, title: a.name, sub: a.sub, go: () => { clearSearch(); openApp(a.id); } })),
      ...(on.includes("npcs") ? NPC_TABS.filter((t) => !(play && t.prepOnly) && (has(t.full) || has(t.sub)))
        .map((t) => ({ key: "tab" + t.id, title: t.full, sub: `NPCs · ${t.sub}`, go: () => { clearSearch(); openNpcTab(t.id); } })) : []),
      ...(on.includes("npcs") && !play ? NPC_PAGES.filter(([, nm, sb]) => has(nm) || has(sb))
        .map(([id, nm, sb]) => ({ key: "np" + id, title: nm, sub: `NPCs · Settings · ${sb}`, go: () => { clearSearch(); openNpcTab("npcset", id); } })) : []),
      ...(on.includes("config") ? CONFIG_PAGES.filter(([, nm, sb]) => has(nm) || has(sb))
        .map(([id, nm, sb]) => ({ key: "cfg" + id, title: nm, sub: `Config · ${sb}`, go: () => { clearSearch(); openApp("config", id); } })) : []),
    ]);

    const saved = [];
    roster.forEach((r) => {
      const nameHit = has(r.name) || has(r.ident);
      const f = nameHit ? null : npcFields(r).find(([, v]) => has(v));
      if (nameHit || f) saved.push({ key: "r" + r.id, rank: nameHit ? 0 : 1, active: npc && npc.id === r.id, keep: true,
        title: `${r.name}${r.ident ? ` ${r.ident}` : ""}`, sub: `${r.role} · ${r.fac.label}`,
        snip: f ? [f[0], f[1]] : null, go: () => openNpc(r) });
    });
    add("Saved NPCs", saved.sort((a, b) => a.rank - b.rank));

    add("Book NPCs", BOOK_NPCS.map((b) => {
      const place = b.at && locByN(b.at) ? locByN(b.at).name : "";
      const nameHit = has(b.n) || has(b.role) || has(place);
      const f = nameHit ? null : [["Who they are", b.desc], ["Wants", b.wants], ["Thread", b.hook]].find(([, v]) => has(v));
      if (!nameHit && !f) return null;
      return { key: "b" + b.n, keep: true, active: npc && npc.isBook && npc.name === b.n, title: b.n, sub: place ? `${b.role} · ${place}` : b.role, snip: f, go: () => openNpc(hydrateBookNpc(b, s)) };
    }).filter(Boolean));

    add("Current crowd (not saved)", crowd.filter((c) => !roster.some((r) => r.id === c.id) && (has(c.name) || has(c.role) || has(c.fac.label)))
      .map((c) => ({ key: "c" + c.id, keep: true, active: npc && npc.id === c.id, title: c.name, sub: `${c.role} · ${c.fac.label}`, go: () => openNpc(c) })));

    add("Party", pcs.filter((p) => has(p.name) || has(p.cls) || has(p.notes)).map((p) => ({
      key: "pc" + p.id, title: p.name, sub: `${p.cls || "—"} · LV ${p.lv} · renown ${fmt(p.renown)}`,
      snip: !has(p.name) && has(p.notes) ? ["Notes", p.notes] : null, go: () => { clearSearch(); openApp("party"); } })));

    if (appsFor(s.uiMode).includes("city")) add("Locations", LOCATIONS.filter((l) => has(l.name) || has(l.note) || has(DISTRICTS[l.d].name) || String(l.n) === t)
      .map((l) => ({ key: "l" + l.n, title: `${l.n}. ${l.name}`, sub: DISTRICTS[l.d].name, snip: has(l.name) ? null : ["Note", cap(l.note)],
        go: () => { clearSearch(); setQ((x) => ({ ...x, city: l.name })); openApp("city"); } })));

    add("Call up a faction", Object.keys(FACTIONS).filter((fk) => has(FACTIONS[fk].label))
      .map((fk) => ({ key: "f" + fk, title: FACTIONS[fk].label, sub: `Generate a group of ${musterN}`, go: () => { clearSearch(); runMuster(fk); } })));

    add("Scan from a template", TEMPLATES.filter((tp) => has(tp.name) || has(tp.blurb))
      .map((tp) => ({ key: "t" + tp.id, title: tp.name, sub: tp.blurb, go: () => { clearSearch(); applyTemplate(tp, false); } })));

    return (
      <div>
        <div style={{ color: C.dim, fontSize: 11, marginBottom: 10 }}>
          {groupsOut.length ? <>Results for “<span style={{ color: C.text }}>{gq.trim()}</span>”. Esc clears.</> : <>Nothing matches “{gq.trim()}”.</>}</div>
        {groupsOut.map((g) => (
          <div key={g.title} className="mb-3">
            <div style={kicker()}>{g.title.toUpperCase()} — {g.items.length}</div>
            {g.items.slice(0, 12).map((it) => (
              <button key={it.key} onClick={() => { snd(SFX.tap); it.go(); }} className="w-full text-left p-2 mb-1"
                style={{ border: `1px solid ${it.active ? C.amber : C.line}`, background: it.active ? `${C.amber}12` : C.panel, cursor: "pointer", borderRadius: 0 }}>
                <div style={{ color: C.text, fontSize: 13 }}><Hl text={it.title} t={t} /></div>
                {it.sub && <div style={{ color: C.cyan, fontSize: 11, fontFamily: MONO, marginTop: 2 }}>{it.sub}</div>}
                {it.snip && <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>
                  <span style={{ color: C.gold, fontSize: 10, fontFamily: MONO }}>{String(it.snip[0]).toUpperCase()} </span><Hl text={String(it.snip[1])} t={t} /></div>}
              </button>))}
            {g.items.length > 12 && <div style={{ color: C.dim, fontSize: 11 }}>+{g.items.length - 12} more — narrow the search.</div>}
          </div>))}
      </div>
    );
  };

  /* ============================ NPC APP: one tab at a time ============================ */
  const npcTabBody = (tab) => {
    switch (tab) {
      case "scan": return (
        <div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => run({})} className="flex-1 py-4"
              style={{ background: C.amber, color: "#06090B", border: `1px solid ${C.amber}`, fontFamily: MONO, fontSize: 14, letterSpacing: "0.18em", fontWeight: 700, borderRadius: 0, cursor: "pointer" }}>SCAN</button>
            <button onClick={() => runCrowd({})} className="py-4 px-4"
              style={{ background: "transparent", color: C.cyan, border: `1px solid ${C.cyan}`, fontFamily: MONO, fontSize: 12, borderRadius: 0, cursor: "pointer" }}>CROWD ×{s.crowd}</button>
          </div>
          <div className="flex items-center gap-2 mb-4" style={{ fontSize: 11, color: C.dim, lineHeight: 1.4 }}>
            <span className="flex-1">{filterBits.length ? <>Filters: <span style={{ color: C.text }}>{filterBits.join(", ")}</span></> : "No filters — anyone in the city."}</span>
            {!!filterBits.length && <button onClick={resetFilters} style={{ background: "none", border: `1px solid ${C.lineHot}`, color: C.dim, fontSize: 10, fontFamily: MONO, padding: "2px 6px", cursor: "pointer", borderRadius: 0 }}>CLEAR</button>}
            {!play && <button onClick={() => openNpcTab("npcset", "params")} style={{ background: "none", border: `1px solid ${C.lineHot}`, color: C.cyan, fontSize: 10, fontFamily: MONO, padding: "2px 6px", cursor: "pointer", borderRadius: 0 }}>FILTERS</button>}
          </div>

          <div style={kicker()}>TEMPLATES</div>
          {play ? (
            <div className="grid grid-cols-2 gap-1 mb-4">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => applyTemplate(t, false)} className="text-left px-2 py-2"
                  style={{ border: `1px solid ${s.tmplName === t.name ? C.amber : C.line}`, background: C.panel, color: C.text, fontSize: 12, cursor: "pointer", borderRadius: 0 }}>{t.name}</button>))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TEMPLATES.map((t) => (
                <div key={t.id} style={{ border: `1px solid ${s.tmplName === t.name ? C.amber : C.line}`, background: C.panel }}>
                  <button onClick={() => applyTemplate(t, false)} className="text-left p-2 w-full" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <div style={{ color: C.text, fontSize: 13, lineHeight: 1.2 }}>{t.name}</div>
                    <div style={{ color: C.dim, fontSize: 10, lineHeight: 1.35, marginTop: 3 }}>{t.blurb}</div></button>
                  <button onClick={() => applyTemplate(t, true)} className="w-full py-1" style={{ background: "none", border: "none", borderTop: `1px solid ${C.line}`, color: C.dim, fontSize: 9, fontFamily: MONO, cursor: "pointer" }}>CROWD ×{s.crowd}</button>
                </div>))}
            </div>
          )}

          {!!presets.length && <>
            <div style={kicker(C.green)}>PRESETS</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {presets.map((p) => <button key={p.name} onClick={() => loadPreset(p)} className="px-3 py-1"
                style={{ border: `1px solid ${C.green}`, color: C.green, background: "transparent", fontSize: 11, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>{p.name}</button>)}
            </div></>}
          {!!crowd.length && <button onClick={() => openSub("crowd")} style={{ background: "none", border: "none", color: C.cyan, fontSize: 11, fontFamily: MONO, cursor: "pointer", padding: 0 }}>Last crowd: {crowdLabel} ({crowd.length})</button>}
        </div>
      );

      case "named": {
        const flat = !!q.named.trim();
        const match = (b) => hit(q.named, b.n, b.role, b.at && locByN(b.at) ? locByN(b.at).name : "");
        const row = (b) => <ListBtn key={b.n} active={npc && npc.isBook && npc.name === b.n} onClick={() => openNpc(hydrateBookNpc(b, s))}
          title={b.n} right={`LV${b.lv}`} sub={b.at && locByN(b.at) ? `${b.role} · ${b.at}. ${locByN(b.at).name}` : b.role} />;
        return (
          <div>
            <Search value={q.named} onChange={(v) => setQ({ ...q, named: v })} placeholder={`Search ${BOOK_NPCS.length} by name, job or place`} />
            {flat ? BOOK_NPCS.filter(match).map(row) : <>
              {Object.keys(DISTRICTS).map((dk) => {
                const inDist = BOOK_NPCS.filter((b) => b.at && locByN(b.at) && locByN(b.at).d === dk);
                if (!inDist.length) return null;
                return <div key={dk} className="mb-3"><div style={kicker()}>{DISTRICTS[dk].name.toUpperCase()}</div>{inDist.map(row)}</div>;
              })}
              <div style={kicker()}>ELSEWHERE</div>
              {BOOK_NPCS.filter((b) => !b.at || !locByN(b.at)).map(row)}
            </>}
            {flat && !BOOK_NPCS.some(match) && <div style={{ color: C.dim, fontSize: 12 }}>Nobody matches.</div>}
          </div>
        );
      }

      case "muster": return (
        <div>
          <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
            Call up several people from one faction at once — a patrol, a collection crew, a congregation.</div>
          <div className="flex gap-1 mb-3 items-center">
            <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO, marginRight: 4 }}>HOW MANY</span>
            {[3, 5, 8, 12, 20].map((n) => (
              <button key={n} onClick={() => { snd(SFX.tap); setMusterN(n); }} className="px-3 py-1"
                style={{ border: `1px solid ${musterN === n ? C.amber : C.lineHot}`, color: musterN === n ? C.amber : C.dim, background: "transparent", fontSize: 12, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>{n}</button>))}
          </div>
          {Object.keys(FACTIONS).map((fk) => (
            <button key={fk} onClick={() => runMuster(fk)} className="w-full text-left p-2 mb-1"
              style={{ border: `1px solid ${C.line}`, background: C.panel, cursor: "pointer", borderRadius: 0 }}>
              <div className="flex items-baseline gap-2">
                <span style={{ color: FACTIONS[fk].color, fontSize: 13 }}>{FACTIONS[fk].label}</span><span className="flex-1" />
                <span style={{ color: C.amber, fontSize: 10, fontFamily: MONO }}>×{musterN}</span></div>
              {!play && <div style={{ color: C.dim, fontSize: 11, lineHeight: 1.4, marginTop: 3 }}>{FACTION_STRENGTH[fk] || ""}</div>}
            </button>))}
        </div>
      );

      case "archive": {
        const list = roster.filter((r) => hit(q.archive, r.name, r.ident, r.role, r.fac && r.fac.label, r.notes));
        return (
          <div>
            <Search value={q.archive} onChange={(v) => setQ({ ...q, archive: v })} placeholder={`Search ${roster.length} saved — name, job, faction, notes`} />
            <div style={kicker()}>FOLDERS</div>
            <div className="flex gap-2 mb-2">
              <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="New folder name" style={{ ...inputStyle, flex: 1, padding: 6 }} />
              <Btn flex={false} tone={C.green} color={C.green} onClick={() => newGroup(nameDraft)}>CREATE</Btn>
            </div>
            {groups.map((g) => (
              <div key={g.id} className="mb-1" style={{ border: `1px solid ${openGroup === g.id ? C.cyan : C.line}` }}>
                <button onClick={() => { snd(SFX.tap); setOpenGroup(openGroup === g.id ? null : g.id); }} className="w-full text-left p-2" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.text, fontSize: 13 }}>{g.name}</span><span className="flex-1" />
                    <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>{g.members.length}</span>
                    <span style={{ color: C.dim, fontSize: 14 }}>{openGroup === g.id ? "−" : "+"}</span></div></button>
                {openGroup === g.id && <div className="px-2 pb-2">
                  {!g.members.length && <div style={{ color: C.dim, fontSize: 12, paddingBottom: 6 }}>Empty. Use the folder buttons under any sheet.</div>}
                  {g.members.map((mid) => { const m = byId(mid); if (!m) return null;
                    return <div key={mid} className="flex items-center gap-2 py-1" style={{ borderBottom: `1px solid ${C.line}55` }}>
                      <button onClick={() => openNpc(m)} className="text-left flex-1" style={{ background: "none", border: "none", cursor: "pointer" }}>
                        <div style={{ color: npc && npc.id === m.id ? C.amber : C.text, fontSize: 13 }}>{m.name}</div>
                        <div style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>{m.role} · LV {m.lv}</div></button>
                      <button onClick={() => removeFromGroup(g.id, mid)} title="Remove from folder" style={{ background: "none", border: "none", color: C.blood, fontSize: 14, cursor: "pointer" }}>×</button>
                    </div>; })}
                  <div className="flex gap-2 mt-2">
                    <Btn tone={C.green} color={C.green} onClick={() => doCopy(g.members.map((m) => byId(m)).filter(Boolean).map(asText).join("\n\n———\n\n"))}>COPY FOLDER</Btn>
                    {!play && <ConfirmBtn onConfirm={() => delGroup(g.id)} render={(armed, click) =>
                      <Btn tone={C.blood} color={armed ? "#06090B" : C.blood} fill={armed ? C.blood : undefined} onClick={click}>{armed ? "TAP AGAIN TO DELETE" : "DELETE FOLDER"}</Btn>} />}</div>
                </div>}
              </div>))}

            <div className="mt-4" style={kicker()}>ALL SAVED — {list.length}{q.archive ? ` of ${roster.length}` : ""}</div>
            {!roster.length && <div style={{ color: C.dim, fontSize: 12 }}>Nobody saved yet. Hit KEEP on any sheet.</div>}
            {list.map((r) => (
              <div key={r.id} className="flex items-center gap-1">
                <div className="flex-1 min-w-0"><ListBtn active={npc && npc.id === r.id} onClick={() => openNpc(r)}
                  title={`${r.name}${r.ident ? ` ${r.ident}` : ""}`} right={`LV${r.lv}`} sub={`${r.role} · ${r.fac.label}`} /></div>
                {!play && <ConfirmBtn onConfirm={() => dropNpc(r.id)} render={(armed, click) =>
                  <button onClick={click} title="Delete" style={{ background: armed ? C.blood : "none", border: "none", color: armed ? "#06090B" : C.blood, fontSize: armed ? 9 : 14, fontFamily: MONO, cursor: "pointer", padding: armed ? "4px" : 0 }}>{armed ? "SURE?" : "×"}</button>} />}
              </div>))}
            {!!roster.length && <div className="flex gap-2 mt-2">
              <Btn tone={C.green} color={C.green} onClick={() => doCopy(roster.map(asText).join("\n\n———\n\n"))}>COPY ALL</Btn>
              {!play && <ConfirmBtn onConfirm={() => { setRoster([]); setGroups((g) => g.map((x) => ({ ...x, members: [] }))); flash("All saved NPCs deleted"); }} render={(armed, click) =>
                <Btn tone={C.blood} color={armed ? "#06090B" : C.blood} fill={armed ? C.blood : undefined} onClick={click}>{armed ? `TAP AGAIN — DELETE ${roster.length}` : "DELETE ALL"}</Btn>} />}</div>}
          </div>
        );
      }

      case "npcset": return (
        <div>
          <Group title="GENERATING">
            {NPC_PAGES.filter(([id]) => id !== "blocks").map(([id, nm, subline]) => (
              <button key={id} onClick={() => openSub(id)} className="w-full text-left p-2 mb-1" style={{ border: `1px solid ${C.line}`, background: C.panel, cursor: "pointer", borderRadius: 0 }}>
                <div className="flex items-center"><span style={{ color: C.text, fontSize: 13, flex: 1 }}>{nm}</span><span style={{ color: C.dim }}>›</span></div>
                <div style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>{subline}</div></button>))}
            <div className="mt-2" />
            <Select label="CROWD SIZE" value={String(s.crowd)} onChange={(v) => set("crowd", Number(v))} options={[3, 4, 5, 6, 8, 10].map((n) => [String(n), `${n} people`])} />
            <Select label="GROUP OF NPCS — DEFAULT SIZE" value={String(musterN)} onChange={(v) => setMusterN(Number(v))} options={[3, 5, 8, 12, 20].map((n) => [String(n), `${n} people`])} />
            <Seg label="NICKNAMES (“THE GRIM”)" value={s.nickChance} onChange={(v) => { snd(SFX.toggle); set("nickChance", v); }} options={[[0, "Never"], [0.15, "Some"], [0.3, "Often"], [0.6, "Most"]]} />
          </Group>
          <Group title="THE SHEET">
            <button onClick={() => openSub("blocks")} className="w-full text-left p-2 mb-2" style={{ border: `1px solid ${C.line}`, background: C.panel, cursor: "pointer", borderRadius: 0 }}>
              <div className="flex items-center"><span style={{ color: C.text, fontSize: 13, flex: 1 }}>Sheet sections</span><span style={{ color: C.dim }}>›</span></div>
              <div style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>What an NPC sheet shows, and in what order</div></button>
            <Select label="FILES OPEN ON — PREP" value={s.tabPrep} onChange={(v) => { set("tabPrep", v); if (!play) setFileTab(v); }} options={FILE_TABS.map((t) => [t.id, t.n])} />
            <Select label="FILES OPEN ON — PLAY" value={s.tabPlay} onChange={(v) => { set("tabPlay", v); if (play) setFileTab(v); }} options={FILE_TABS.map((t) => [t.id, t.n])} />
            <div className="flex gap-2 mb-2">
              <Btn onClick={() => collapseAll(true)}>COLLAPSE ALL</Btn>
              <Btn onClick={() => collapseAll(false)}>EXPAND ALL</Btn></div>
          </Group>
        </div>
      );
      default: return null;
    }
  };

  /* ============================ LEFT COLUMN: the open app ============================ */
  // the NPC app's tabs stay visible on every NPC screen, including crowds and settings pages
  const npcTabBar = () => (
    <div className="flex mb-3" style={{ border: `1px solid ${C.lineHot}` }}>
      {NPC_TABS.filter((t) => !(play && t.prepOnly)).map((t) => {
        const on = npcTab === t.id && !sub;
        return <button key={t.id} onClick={() => openNpcTab(t.id)} title={t.sub} className="flex-1 flex items-center justify-center gap-1 py-2"
          style={{ background: on ? `${C.amber}1c` : "transparent", border: "none", borderBottom: `2px solid ${on ? C.amber : "transparent"}`, color: on ? C.text : C.dim, fontSize: 11, cursor: "pointer", borderRadius: 0 }}>
          <Glyph kind={t.glyph} color={on ? C.amber : C.dim} size={13} />{t.name}</button>;
      })}
    </div>
  );
  const leftBody = () => {
    if (gq.trim()) return searchResults();
    if (app === "npcs") return <div>{npcTabBar()}{leftInner()}</div>;
    return leftInner();
  };
  const leftInner = () => {

    /* ---------- crowd results (any app can produce these) ---------- */
    if (sub === "crowd") return (
      <div>
        <div className="flex gap-2 mb-3">
          <Btn tone={C.green} color={C.green} onClick={() => doCopy(crowd.map(asText).join("\n\n———\n\n"))}>COPY ALL</Btn>
          <Btn tone={C.green} color={C.green} onClick={() => keepMany(crowd)}>KEEP ALL</Btn></div>
        {crowd.map((c) => {
          const st = hpState(c.sd);
          return (
            <div key={c.id} className="mb-1" style={{ opacity: st.k === "dead" ? 0.45 : 1, boxShadow: st.k !== "ok" ? `inset 3px 0 0 ${st.tone}` : "none" }}>
              <ListBtn active={npc && npc.id === c.id} onClick={() => openNpc(c)}
                title={`${st.k === "dead" ? "✝ " : ""}${c.name}${c.ident ? ` ${c.ident}` : ""}`} right={`LV${c.lv} AC${c.ac}${c.sd ? ` · ${c.sd.cls.replace(/ .*/, "")}` : ""}`}
                sub={`${c.role} · ${c.fac.label}`}
                extra={<>
                  {!play && <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>{c.opener}</div>}
                  {c.bounty && <div style={{ color: C.blood, fontSize: 11, fontFamily: MONO, marginTop: 3 }}>BOUNTY {c.bounty.amount} GP</div>}
                </>} />
              {c.sd && <div className="px-2 pb-2 pt-1" style={{ marginTop: -4, position: "relative", borderStyle: "solid", borderWidth: "0 1px 1px 1px", borderColor: npc && npc.id === c.id ? C.amber : C.line, background: npc && npc.id === c.id ? `${C.amber}12` : C.panel }}>
                <div style={{ height: 2, background: C.line, marginBottom: 4 }}><div style={{ height: 2, width: `${clamp((c.sd.hpNow / Math.max(1, c.sd.hp)) * 100, 0, 100)}%`, background: st.tone }} /></div>
                {hpCtl(c, true)}
              </div>}
            </div>);
        })}
      </div>
    );

    /* ---------- the spine's day log ---------- */
    if (sub === "time") {
      const days = logByDay(world);
      const KIND = { day: C.gold, watch: C.cyan, party: C.green, undo: C.violet, note: C.text, buy: C.amber };
      return (
        <div>
          <Bracket>
            <div style={kicker(C.gold)}>THE DAY SO FAR</div>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: MONO, fontSize: 18, color: C.text }}>{dayLabel(world)}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, color: watchOf(world).night ? C.violet : C.gold, letterSpacing: "0.12em" }}>{watchOf(world).name.toUpperCase()}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <Btn tone={C.gold} color={C.gold} onClick={bumpWatch}>NEXT WATCH ›</Btn>
              <Btn flex={false} color={canUndo(world) ? C.cyan : C.line} onClick={stepBack}>UNDO</Btn>
            </div>
            <div style={{ fontSize: 10, fontFamily: MONO, color: C.dim, marginTop: 6 }}>YOUR OWN DATE (OPTIONAL)</div>
            <div className="flex gap-2 mt-1">
              <input value={dateDraft} onChange={(e) => setDateDraft(e.target.value)} placeholder={world.dateLabel || "e.g. 3rd of Lastmoon"}
                style={{ ...inputStyle, flex: 1, fontFamily: MONO, fontSize: 12 }} />
              <Btn flex={false} onClick={() => { setWorld((w) => ({ ...w, dateLabel: dateDraft.trim() })); setDateDraft(""); flash(dateDraft.trim() ? "Date set" : "Back to day count"); }}>SET</Btn>
            </div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
              The books don't give Meridia a calendar of named months, so the spine counts days and leaves the naming to you.</div>
          </Bracket>

          <div className="mt-3"><Bracket>
            <div style={kicker()}>ADD A LINE</div>
            <div className="flex gap-2">
              <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="What just happened"
                onKeyDown={(e) => { if (e.key === "Enter" && nameDraft.trim()) { noteToLog(nameDraft.trim()); setNameDraft(""); } }}
                style={{ ...inputStyle, flex: 1, fontSize: 12 }} />
              <Btn flex={false} tone={C.green} color={C.green} onClick={() => { if (nameDraft.trim()) { noteToLog(nameDraft.trim()); setNameDraft(""); flash("Logged"); } }}>LOG</Btn>
            </div>
          </Bracket></div>

          <div className="mt-3">
            {!days.length && <div style={{ fontSize: 12, color: C.dim, padding: "18px 2px" }}>Nothing logged yet. Advancing a watch writes a line here on its own.</div>}
            {days.map((d) => (
              <div key={d.day} className="mb-3">
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", color: C.gold, borderBottom: `1px solid ${C.line}`, paddingBottom: 3, marginBottom: 4 }}>
                  DAY {d.day}{d.day === world.day ? " — TODAY" : ""}</div>
                {d.entries.map((e) => (
                  <div key={e.id} className="flex gap-2" style={{ padding: "3px 0", fontSize: 12, lineHeight: 1.45 }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, minWidth: 74, paddingTop: 2 }}>{(WATCHES[e.watch] || WATCHES[0]).name}</span>
                    <span style={{ color: KIND[e.kind] || C.text }}>{e.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    /* ---------- config sub-pages ---------- */
    if (sub === "presets") return (
      <Bracket>
        <div className="flex gap-2 mb-3">
          <input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} placeholder="Preset name" style={{ ...inputStyle, flex: 1 }} />
          <Btn flex={false} tone={C.green} color={C.green} onClick={() => savePresetStrip(nameDraft)}>SAVE</Btn></div>
        {!presets.length && <div style={{ color: C.dim, fontSize: 12 }}>Saves your generator filters, sheet sections and section order under one name.</div>}
        {presets.map((p) => <div key={p.name} className="flex items-center gap-2 py-2" style={{ borderBottom: `1px solid ${C.line}55` }}>
          <button onClick={() => loadPreset(p)} className="text-left flex-1" style={{ background: "none", border: "none", color: C.green, fontSize: 13, cursor: "pointer" }}>{p.name}</button>
          <ConfirmBtn onConfirm={() => delPreset(p.name)} render={(armed, click) =>
            <button onClick={click} style={{ background: armed ? C.blood : "none", border: "none", color: armed ? "#06090B" : C.blood, fontSize: armed ? 9 : 14, fontFamily: MONO, cursor: "pointer" }}>{armed ? "SURE?" : "×"}</button>} /></div>)}
      </Bracket>
    );
    if (sub === "blocks") return (
      <Bracket>
        <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>
          A section switched off is hidden everywhere — card, full sheet and copied text — but still rolled, so switching it back on shows it straight away. ▲▼ sets the order.</div>
        {order.filter((k) => k !== "stats" && k !== "abilities").map((k, i) => (
          <div key={k} className="flex items-center gap-2" style={{ borderBottom: `1px solid ${C.line}55` }}>
            <div className="flex-1"><Toggle on={show[k]} label={BLOCK_LABEL[k]} onClick={() => { snd(SFX.toggle); setShow((p) => ({ ...p, [k]: !p[k] })); }} /></div>
            <span style={{ color: C.dim, fontSize: 9, fontFamily: MONO }}>{i + 1}</span>
            <button onClick={() => moveBlock(k, -1)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, cursor: "pointer" }}>▲</button>
            <button onClick={() => moveBlock(k, 1)} style={{ background: "none", border: "none", color: C.cyan, fontSize: 13, cursor: "pointer" }}>▼</button>
          </div>))}
        <div className="flex gap-2 mt-3">
          <Btn onClick={() => setShow(Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])))}>ALL ON</Btn>
          <Btn onClick={() => setOrder(DEFAULT_ORDER)}>RESET ORDER</Btn></div>
      </Bracket>
    );
    if (sub === "params") return (
      <Bracket>
        <Group title="WHEN">
          <Select label="TIME" value={s.time} onChange={(v) => set("time", v)} options={[["day", "Day"], ["night", "Night"]]} />
          <Select label="OCCASION" value={s.holiday} onChange={(v) => set("holiday", v)} options={Object.keys(HOLIDAYS).map((k) => [k, HOLIDAYS[k].label])} /></Group>
        <Group title="WHO">
          <Select label="ORDINARY FOLK ONLY" value={s.mundane ? "yes" : "no"} onChange={(v) => set("mundane", v === "yes")} options={[["no", "Off — the whole city"], ["yes", "On — no assassins or cultists"]]} />
          <Select label="LINE OF WORK" value={s.cat} onChange={(v) => set("cat", v)} options={Object.keys(CATS).map((k) => [k, CATS[k]])} />
          <Select label="EXACT JOB" value={s.job} onChange={(v) => set("job", v)} options={jobOptions} />
          <Select label="ANCESTRY" value={s.ancestry} onChange={(v) => set("ancestry", v)} options={[["any", "Reaches population mix"]].concat(Object.keys(ancLabel).map((k) => [k, ancLabel[k]]))} />
          <Select label="GENDER" value={s.gender} onChange={(v) => set("gender", v)} options={[["any", "Either"], ["f", "Woman"], ["m", "Man"]]} /></Group>
        <Group title="POWER">
          <Select label="TIER" value={s.tier} onChange={(v) => set("tier", v)} options={[["any", "Anyone"], ["common", "Common folk (LV 0–2)"], ["pro", "Professionals (LV 2–4)"], ["dangerous", "Dangerous (LV 4–6)"], ["elite", "Elite (LV 6+)"]]} />
          <div className="flex gap-2">
            <div className="flex-1"><Select label="MIN LV" value={String(s.lvMin)} onChange={(v) => set("lvMin", Number(v))} options={[0,1,2,3,4,5,6,7,8,9,10].map((n) => [String(n), String(n)])} /></div>
            <div className="flex-1"><Select label="MAX LV" value={String(s.lvMax)} onChange={(v) => set("lvMax", Number(v))} options={[0,1,2,3,4,5,6,7,8,9,10].map((n) => [String(n), String(n)])} /></div></div>
          <Select label="COMPETENCE" value={s.competence} onChange={(v) => set("competence", v)} options={[["mixed", "Mixed — realistic"], ["low", "Hapless"], ["high", "Capable"]]} /></Group>
        <Group title="STANDING">
          <Select label="ALIGNMENT" value={s.align} onChange={(v) => set("align", v)} options={[["any", "Let the job decide"], ["L", "Lawful"], ["N", "Neutral"], ["C", "Chaotic"]]} />
          <Select label="FACTION" value={s.faction} onChange={(v) => set("faction", v)} options={[["any", "Let the job decide"]].concat(Object.keys(FACTIONS).map((k) => [k, FACTIONS[k].label]))} />
          <Select label="MEANS" value={s.band} onChange={(v) => set("band", v)} options={[["any", "Whatever the job pays"]].concat(BAND_LABEL.map((l, i) => [String(i), l]))} /></Group>
        <Group title="TROUBLE">
          <Select label="CRIMINAL RECORD" value={s.record} onChange={(v) => set("record", v)} options={[["auto", "Realistic for who they are"], ["none", "Everyone's clean"], ["light", "Minor scrapes only"], ["likely", "Most have a history"], ["certain", "Everyone has a file"]]} />
          <Select label="CONDITIONS" value={s.conditions} onChange={(v) => set("conditions", v)} options={[["auto", "0–2, weighted"], ["off", "None"], ["one", "Always one"], ["two", "Always two"]]} /></Group>
        <div className="flex gap-2">
          <Btn tone={C.amber} color={C.amber} onClick={() => run({})}>SCAN WITH THESE</Btn>
          <Btn onClick={resetFilters}>RESET</Btn></div>
      </Bracket>
    );

    if (sub === "taskbar") return (
      <div>
        <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>
          Pick what sits on the taskbar in each mode. Config always stays in Prep so you can't lock yourself out.</div>
        {["prep", "play"].map((m) => (
          <div key={m} className="mb-3"><Bracket>
            <div style={kicker(m === "play" ? C.amber : C.cyan)}>{m === "play" ? "PLAY MODE" : "PREP MODE"}</div>
            {APPS.map((a) => {
              const locked = m === "prep" && a.id === "config";
              return <Toggle key={a.id} on={appsFor(m).includes(a.id)} label={`${a.name}${locked ? " (always on)" : ""}`}
                onClick={() => { if (locked) return; snd(SFX.toggle); toggleModeApp(m, a.id); }} />;
            })}
          </Bracket></div>))}
        <Btn onClick={() => { snd(SFX.tap); setS((p) => ({ ...p, modeApps: null })); flash("Taskbar reset"); }}>RESET TO DEFAULT</Btn>
      </div>
    );
    if (sub === "data") {
      const payload = JSON.stringify({ roster: roster.map(compactForSave), groups, presets, pcs, settings: s, show, order });
      const kb = payload.length / 1024, cap5 = 5 * 1024, pct = Math.min(100, (kb / cap5) * 100);
      const doRestore = () => {
        try {
          const v = JSON.parse(restoreDraft);
          if (!v || typeof v !== "object" || !Array.isArray(v.roster)) throw new Error("not a Meridia backup");
          setRoster(v.roster.map(expandFromSave)); setGroups(Array.isArray(v.groups) ? v.groups : []); setPresets(Array.isArray(v.presets) ? v.presets : []);
          setPcs(Array.isArray(v.pcs) ? v.pcs : []);
          if (v.settings) setS({ ...DEFAULTS, ...v.settings });
          if (v.show) setShow({ ...Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])), ...v.show });
          if (v.order && v.order.length === DEFAULT_ORDER.length) setOrder(v.order);
          setRestoreDraft(""); flash(`Restored ${v.roster.length} NPCs`);
        } catch (e) { flash("That isn't a valid backup — nothing changed", true); }
      };
      return (
        <div>
          <Bracket>
            <div style={kicker()}>STORAGE</div>
            <div style={{ height: 6, background: C.line }}><div style={{ height: 6, width: `${Math.max(1, pct)}%`, background: pct > 80 ? C.blood : pct > 50 ? C.gold : C.green }} /></div>
            <div className="mt-2" style={{ fontSize: 12, color: C.text }}>{kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(2)} MB`} of 5 MB used ({pct.toFixed(1)}%)</div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{roster.length} saved NPCs · {groups.length} folders · {presets.length} presets · {pcs.length} party members</div>
            {roster.length > 0 && <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>About {(kb / Math.max(1, roster.length)).toFixed(1)} KB per saved NPC.</div>}
          </Bracket>

          <div className="mt-3"><Bracket>
            <div style={kicker(C.green)}>BACKUP</div>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>Everything in one block of text. Copy it into a note or file somewhere safe — do this before big updates.</div>
            <div className="flex gap-2">
              <Btn tone={C.green} color={C.green} onClick={() => doCopy(payload)}>COPY BACKUP</Btn>
              <Btn onClick={() => setBackupOpen(!backupOpen)}>{backupOpen ? "HIDE" : "SHOW"}</Btn></div>
            {backupOpen && <textarea readOnly value={payload} onFocus={(e) => e.target.select()} rows={6}
              style={{ ...inputStyle, width: "100%", marginTop: 8, fontFamily: MONO, fontSize: 10, resize: "vertical" }} />}
          </Bracket></div>

          <div className="mt-3"><Bracket>
            <div style={kicker(C.gold)}>RESTORE</div>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>Paste a backup. This replaces everything currently saved.</div>
            <textarea value={restoreDraft} onChange={(e) => setRestoreDraft(e.target.value)} rows={4} placeholder="Paste backup text here"
              style={{ ...inputStyle, width: "100%", fontFamily: MONO, fontSize: 10, resize: "vertical" }} />
            <div className="mt-2">{restoreDraft.trim() && <ConfirmBtn onConfirm={doRestore} render={(armed, click) =>
              <Btn tone={C.gold} color={armed ? "#06090B" : C.gold} fill={armed ? C.gold : undefined} onClick={click}>{armed ? "TAP AGAIN — REPLACE EVERYTHING" : "RESTORE"}</Btn>} />}</div>
          </Bracket></div>

          <div className="mt-3"><Bracket tone={C.blood}>
            <div style={kicker(C.blood)}>RESET</div>
            <div style={{ fontSize: 12, color: C.dim, lineHeight: 1.5, marginBottom: 8 }}>Wipes saved NPCs, folders, presets, party and settings. Take a backup first.</div>
            <ConfirmBtn onConfirm={() => {
              setRoster([]); setGroups([]); setPresets([]); setPcs([]); setS(DEFAULTS); setLocks({});
              setShow(Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true]))); setOrder(DEFAULT_ORDER);
              setNpc(null); setCrowd([]); setMode("full"); setSub(null); setApp("npcs"); flash("Everything reset");
            }} render={(armed, click) =>
              <Btn tone={C.blood} color={armed ? "#06090B" : C.blood} fill={armed ? C.blood : undefined} onClick={click}>{armed ? "TAP AGAIN — WIPE EVERYTHING" : "RESET EVERYTHING"}</Btn>} />
          </Bracket></div>
        </div>
      );
    }

    /* ---------- apps ---------- */
    switch (app) {
      case "npcs": return npcTabBody(play && npcTab === "npcset" ? "scan" : npcTab);

      /* ---------- MAP: the spine's clock sits on top, then districts and their sites ---------- */
      case "map": {
        const selLoc = mapSel.loc ? locByN(mapSel.loc) : null;
        const cur = watchOf(world);
        return (
          <div>
            <Bracket>
              <div className="flex items-baseline justify-between">
                <div style={kicker(C.gold)}>IN-WORLD TIME</div>
                <span style={{ fontFamily: MONO, fontSize: 10, color: world.on ? C.green : C.dim }}>{world.on ? "RUNNING" : "OFF"}</span>
              </div>
              <div className="flex items-baseline gap-2" style={{ marginBottom: 6 }}>
                <span style={{ fontFamily: MONO, fontSize: 18, color: C.text, letterSpacing: "0.04em" }}>{dayLabel(world)}</span>
                <span style={{ fontFamily: MONO, fontSize: 13, color: cur.night ? C.violet : C.gold, letterSpacing: "0.12em" }}>{cur.name.toUpperCase()}</span>
              </div>
              <div className="flex flex-wrap gap-1" style={{ marginBottom: 6 }}>
                {WATCHES.map((w, i) => (
                  <button key={w.id} onClick={() => jumpWatch(i)} className="px-2 py-1"
                    style={{ border: `1px solid ${i === world.watch ? (w.night ? C.violet : C.gold) : C.line}`,
                      color: i === world.watch ? "#06090B" : C.dim, background: i === world.watch ? (w.night ? C.violet : C.gold) : "transparent",
                      fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", borderRadius: 0, cursor: "pointer" }}>{w.name}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <Btn tone={C.gold} color={C.gold} onClick={bumpWatch}>NEXT WATCH ›</Btn>
                <Btn onClick={nextDay}>NEXT DAY</Btn>
                <Btn flex={false} color={canUndo(world) ? C.cyan : C.line} onClick={stepBack}>UNDO</Btn>
              </div>
              <div className="flex gap-2 mt-2">
                <Btn flex={false} onClick={() => openSub("time")}>DAY LOG ›</Btn>
                <Btn flex={false} color={world.on ? C.dim : C.green} onClick={() => { snd(SFX.toggle); setWorld((w) => ({ ...w, on: !w.on })); }}>
                  {world.on ? "SWITCH TIME OFF" : "SWITCH TIME ON"}</Btn>
              </div>
            </Bracket>

            <div className="mt-3" />
            {mapSel.bldg ? (() => {
              const b = mapSel.bldg, addr = addressOf(b), ext = exteriorOf(b);
              const dist = DISTRICTS[b.d];
              const bk = b.loc ? locByN(b.loc) : null;     // the book's own entry, if this is one of the 50
              const shop = stockOf(b, world.day, market);
              const inn = interiorOf(b, { trading: !!shop });
              return (
                <Bracket>
                  <div className="flex items-baseline justify-between">
                    <div style={kicker(tierTone(b.d))}>{dist.name.toUpperCase()} · {dist.cls.toUpperCase()}
                      {bk ? ` · #${bk.n}` : ""}</div>
                    <button onClick={() => setMapSel({ ...mapSel, loc: null, bldg: null, inside: false })}
                      style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 12 }}>✕</button>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.text }}>{bk ? bk.name : addr.line}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginBottom: 6 }}>
                    {bk ? `${addr.line} · ` : ""}{dist.name} · provisional address — the street scheme isn't settled yet
                  </div>
                  {bk && (
                    <>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="px-2" style={{ border: `1px solid ${C.gold}`, color: C.gold, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em" }}>IN THE BOOK</span>
                        {bk.k.map((k) => <span key={k} className="px-2" style={{ border: `1px solid ${C.cyan}`, color: C.cyan, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>)}
                      </div>
                      <Row k="REFEREE NOTE" v={bk.note} />
                      {!!bk.p.length && <Row k="WHO'S HERE" v={bk.p.join(", ")} tone={C.gold} />}
                    </>
                  )}

                  {!mapSel.inside ? (
                    <>
                      <Row k="FROM THE STREET" v={ext.text} />
                      {shop && <Row k="THE SIGN" v={`${shop.name} — ${tradeLabel(shop.type)}`} tone={C.amber} />}
                      <Row k="GUARD RESPONSE" v={dist.guard} />
                      <Row k="THE DOOR" v={lockLine(inn)} />
                      <div className="flex gap-2 mt-2">
                        <Btn tone={C.cyan} color={C.cyan} onClick={() => { snd(SFX.open); setMapSel({ ...mapSel, inside: true }); }}>
                          {shop ? "GO IN AND LOOK ›" : "ENTER BUILDING ›"}</Btn>
                        <Btn flex={false} tone={C.amber} color={C.amber} onClick={() => run({ seenAt: String(b.near) })}>SCAN OUTSIDE</Btn>
                      </div>
                      {bk && <div className="flex gap-2 mt-2">
                        <Btn tone={C.green} color={C.green} onClick={() => placeParty(bk.n)}>
                          {world.partyAt === bk.n ? "PARTY IS HERE" : "PARTY HERE"}</Btn>
                      </div>}
                    </>
                  ) : (
                    <>
                      <Row k="INSIDE" v={`${cap(inn.state)} · ${inn.floors} floor${inn.floors > 1 ? "s" : ""}${inn.cellar ? " and a cellar" : ""}`} />
                      <Row k="WHO'S IN" v={inn.heads ? `${inn.heads} ${inn.heads === 1 ? "person" : "people"}` : "Nobody — for now"} tone={inn.heads ? C.gold : C.dim} />
                      <Row k="YOU HEAR" v={inn.sound} />
                      <Row k="IT SMELLS OF" v={inn.smell} />
                      <Row k="WAYS IN" v={inn.ways.join("; ")} />
                      <Row k="THE DOOR" v={lockLine(inn)} />
                      {shop && <ShopShelf shop={shop} day={world.day} purse={purse}
                        daysLeft={daysToRestock(world.day)} coin={coin}
                        onBuy={(it) => buy(b, it, shop)}
                        onCopy={() => { snd(SFX.save); doCopy(shopText(shop, b), "Copy blocked — click the page first, then COPY"); }} />}
                      <div className="flex gap-2 mt-2">
                        {!!inn.heads && <Btn tone={C.amber} color={C.amber}
                          onClick={() => (inn.heads > 1
                            ? runCrowd({ seenAt: String(b.near), crowd: inn.heads }, addr.line)
                            : run({ seenAt: String(b.near) }))}>
                          {inn.heads > 1 ? `SCAN ALL ${inn.heads}` : "SCAN WHO'S IN"}</Btn>}
                        <Btn flex={false} onClick={() => { snd(SFX.back); setMapSel({ ...mapSel, inside: false }); }}>‹ BACK OUT</Btn>
                      </div>
                    </>
                  )}
                </Bracket>
              );
            })() : selLoc ? (
              <Bracket>
                <div className="flex items-baseline justify-between">
                  <div style={kicker(tierTone(selLoc.d))}>{DISTRICTS[selLoc.d].name.toUpperCase()} · #{selLoc.n}</div>
                  <button onClick={() => setMapSel({ district: selLoc.d, loc: null, bldg: null, inside: false })}
                    style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 12 }}>✕</button>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 2 }}>{selLoc.name}</div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selLoc.k.map((k) => <span key={k} className="px-2" style={{ border: `1px solid ${C.cyan}`, color: C.cyan, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>{k}</span>)}
                </div>
                <Row k="REFEREE NOTE" v={selLoc.note} />
                {!!selLoc.p.length && <Row k="WHO'S HERE" v={selLoc.p.join(", ")} tone={C.gold} />}
                <Row k="GUARD RESPONSE" v={DISTRICTS[selLoc.d].guard} />
                <div className="flex gap-2 mt-2">
                  <Btn tone={C.green} color={C.green} onClick={() => placeParty(selLoc.n)}>
                    {world.partyAt === selLoc.n ? "PARTY IS HERE" : "PARTY HERE"}</Btn>
                  <Btn tone={C.amber} color={C.amber} onClick={() => run({ seenAt: String(selLoc.n) })}>SCAN HERE</Btn>
                </div>
              </Bracket>
            ) : (
              <Bracket>
                <div style={kicker()}>{mapSel.district ? DISTRICTS[mapSel.district].name.toUpperCase() : "EIGHT DISTRICTS"}</div>
                {mapSel.district ? (
                  <>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, marginBottom: 6 }}>
                      {DISTRICTS[mapSel.district].cat} · {DISTRICTS[mapSel.district].cls} · guard {DISTRICTS[mapSel.district].guard}</div>
                    {LOCATIONS.filter((l) => l.d === mapSel.district).map((l) => (
                      <ListBtn key={l.n} onClick={() => setMapSel({ district: l.d, loc: l.n, bldg: null, inside: false })}
                        title={`${l.n}. ${l.name}`} right={world.partyAt === l.n ? "PARTY" : ""} sub={l.k.join(" · ")} />
                    ))}
                    <div className="mt-2"><Btn onClick={() => setMapSel({ district: null, loc: null, bldg: null, inside: false })}>ALL DISTRICTS</Btn></div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, marginBottom: 6 }}>
                      Tap a district, or zoom into the map and tap a door.</div>
                    {Object.keys(DISTRICTS).map((dk) => (
                      <ListBtn key={dk} onClick={() => setMapSel({ district: dk, loc: null, bldg: null, inside: false })}
                        title={DISTRICTS[dk].name} right={`${LOCATIONS.filter((l) => l.d === dk).length}`}
                        sub={`${DISTRICTS[dk].cat} · ${DISTRICTS[dk].cls}`} />
                    ))}
                  </>
                )}
              </Bracket>
            )}
          </div>
        );
      }
      case "city": {
        const flat = !!q.city.trim();
        const locRow = (l) => (
          <div key={l.n} className="p-2" style={{ border: `1px solid ${C.line}`, borderTop: "none" }}>
            <div style={{ color: C.text, fontSize: 13 }}><span style={{ color: C.cyan, fontFamily: MONO, fontSize: 11 }}>{l.n}. </span>{l.name}
              {flat && <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}> · {DISTRICTS[l.d].name}</span>}</div>
            {!play && <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.45, marginTop: 2 }}>{cap(l.note)}.</div>}
            {BOOK_NPCS.filter((b) => b.at === l.n).map((b) => (
              <button key={b.n} onClick={() => openNpc(hydrateBookNpc(b, s))} className="block mt-1 text-left"
                style={{ background: "none", border: "none", color: C.gold, fontSize: 11, cursor: "pointer", padding: 0 }}>{b.n}, {b.role}</button>))}
            <div className="flex gap-2 mt-2">
              <Btn onClick={() => run({ seenAt: l.n })}>SCAN HERE</Btn>
              <Btn onClick={() => runCrowd({ seenAt: l.n }, l.name)}>CROWD ×{s.crowd}</Btn></div>
          </div>
        );
        const matches = LOCATIONS.filter((l) => hit(q.city, l.n, l.name, l.note, DISTRICTS[l.d].name));

        /* The shop directory. 196 buildings trade, and before this the only way to find one was
           to zoom the map in and look for an amber outline — no use when a player asks at the
           table where the nearest blacksmith is. Opening a row jumps to it on the map. */
        if (cityTab === "shops") {
          const found = shopsIn(shopQ);
          const trades = tradesPresent(shopQ.district);
          const open = (b) => {
            openApp("map");
            setMapSel({ district: null, loc: b.loc || null, bldg: b, inside: true });
            setFocus(bldgId(b));    // tells the map to fly there, not just select it
          };
          return (
            <div>
              <Seg value={cityTab} onChange={setCityTab} options={[["sites", "Sites"], ["shops", `Shops (${shopsIn({}).length})`]]} />
              <Search value={shopQ.q} onChange={(v) => setShopQ({ ...shopQ, q: v })} placeholder="Search by sign or trade" />
              <div className="flex flex-wrap gap-1 mb-2">
                <Btn flex={false} tone={!shopQ.district ? C.cyan : undefined} color={!shopQ.district ? C.cyan : C.dim}
                  onClick={() => { snd(SFX.tap); setShopQ({ ...shopQ, district: null, type: null }); }}>ALL CITY</Btn>
                {Object.keys(DISTRICTS).map((dk) => (
                  <Btn key={dk} flex={false} tone={shopQ.district === dk ? C.cyan : undefined}
                    color={shopQ.district === dk ? C.cyan : C.dim}
                    onClick={() => { snd(SFX.tap); setShopQ({ ...shopQ, district: dk, type: null }); }}>{DISTRICTS[dk].name}</Btn>
                ))}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <Btn flex={false} tone={!shopQ.type ? C.amber : undefined} color={!shopQ.type ? C.amber : C.dim}
                  onClick={() => { snd(SFX.tap); setShopQ({ ...shopQ, type: null }); }}>ANY TRADE</Btn>
                {trades.map((t) => (
                  <Btn key={t} flex={false} tone={shopQ.type === t ? C.amber : undefined}
                    color={shopQ.type === t ? C.amber : C.dim}
                    onClick={() => { snd(SFX.tap); setShopQ({ ...shopQ, type: t }); }}>{tradeLabel(t)}</Btn>
                ))}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginBottom: 4 }}>
                {found.length} trading{shopQ.district ? ` in ${DISTRICTS[shopQ.district].name}` : " in the city"}
                {shopQ.type ? ` · ${tradeLabel(shopQ.type)}` : ""}
              </div>
              <div style={{ borderTop: `1px solid ${C.line}` }}>
                {found.map(({ b, tr }) => {
                  const st = stockOf(b, world.day, market);
                  return (
                    <button key={bldgId(b)} onClick={() => { snd(SFX.tap); open(b); }}
                      className="w-full text-left p-2" style={{ border: `1px solid ${C.line}`, borderTop: "none", background: C.panel, cursor: "pointer", borderRadius: 0 }}>
                      <div className="flex items-baseline gap-2">
                        <span style={{ color: C.text, fontSize: 13 }}>{tr.name}</span>
                        {tr.fromBook && <span style={{ color: C.gold, fontFamily: MONO, fontSize: 9 }}>#{b.loc}</span>}
                        <span className="flex-1" />
                        <span style={{ color: C.amber, fontFamily: MONO, fontSize: 10 }}>{tradeLabel(tr.type)}</span>
                      </div>
                      <div style={{ color: C.dim, fontFamily: MONO, fontSize: 10, marginTop: 2 }}>
                        {addressOf(b).line} · {DISTRICTS[b.d].name}
                        {st && !st.tavern && ` · ${st.stock.filter((i) => !i.out).length} of ${st.stock.length} lines in stock`}
                        {st && st.tavern && " · food and drink"}
                      </div>
                    </button>
                  );
                })}
                {!found.length && <div className="p-2" style={{ color: C.dim, fontSize: 12 }}>
                  Nothing trading here under that filter.</div>}
              </div>
            </div>
          );
        }
        return (
          <div>
            <Seg value={cityTab} onChange={setCityTab} options={[["sites", "Sites"], ["shops", `Shops (${shopsIn({}).length})`]]} />
            <Search value={q.city} onChange={(v) => setQ({ ...q, city: v })} placeholder="Search by name, number or description" />
            {flat ? <div style={{ borderTop: `1px solid ${C.line}` }}>{matches.map(locRow)}
              {!matches.length && <div className="p-2" style={{ color: C.dim, fontSize: 12 }}>Nothing matches.</div>}</div>
            : Object.keys(DISTRICTS).map((dk) => {
              const dd = DISTRICTS[dk], open = openDist === dk;
              return <div key={dk} className="mb-1">
                <button onClick={() => { snd(SFX.tap); setOpenDist(open ? null : dk); }} className="w-full text-left p-2" style={{ border: `1px solid ${open ? C.cyan : C.line}`, background: C.panel, cursor: "pointer", borderRadius: 0 }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: C.text, fontSize: 14 }}>{dd.name}</span><span className="flex-1" />
                    <span style={{ color: dd.cls === "Wealthy" ? C.gold : dd.cls === "Poor" ? C.blood : C.cyan, fontSize: 10, fontFamily: MONO }}>{dd.cls.toUpperCase()}</span>
                    <span style={{ color: C.dim, fontSize: 14 }}>{open ? "−" : "+"}</span></div>
                  <div style={{ color: C.dim, fontSize: 10, fontFamily: MONO, marginTop: 2 }}>{dd.cat} district · Guard in {dd.guard}</div></button>
                {open && LOCATIONS.filter((l) => l.d === dk).map(locRow)}
              </div>; })}
          </div>
        );
      }

      /* ---------- MONSTERS: browse the bestiary, build the fight ---------- */
      case "bestiary": {
        const BANDS = [["weak", "LV 0–3"], ["risky", "LV 4–6"], ["dangerous", "LV 7–9"], ["mighty", "LV 10+"]];
        const found = MONSTERS.filter((m) =>
          (!monQ.band || m.band === monQ.band) && (!monQ.al || m.al === monQ.al) &&
          hit(monQ.q, m.n, m.fam, m.d, m.atk));
        return (
          <div>
            <Search value={monQ.q} onChange={(v) => setMonQ({ ...monQ, q: v })} placeholder="Search by name, look or attack" />
            <div className="flex flex-wrap gap-1 mb-2">
              <Btn flex={false} tone={!monQ.band ? C.blood : undefined} color={!monQ.band ? C.blood : C.dim}
                onClick={() => { snd(SFX.tap); setMonQ({ ...monQ, band: null }); }}>ANY</Btn>
              {BANDS.map(([b, lb]) => (
                <Btn key={b} flex={false} tone={monQ.band === b ? C.blood : undefined}
                  color={monQ.band === b ? C.blood : C.dim}
                  onClick={() => { snd(SFX.tap); setMonQ({ ...monQ, band: monQ.band === b ? null : b }); }}>{lb}</Btn>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              <Btn flex={false} tone={!monQ.al ? C.cyan : undefined} color={!monQ.al ? C.cyan : C.dim}
                onClick={() => { snd(SFX.tap); setMonQ({ ...monQ, al: null }); }}>ANY AL</Btn>
              {[["L", "Lawful"], ["N", "Neutral"], ["C", "Chaotic"]].map(([a, lb]) => (
                <Btn key={a} flex={false} tone={monQ.al === a ? C.cyan : undefined}
                  color={monQ.al === a ? C.cyan : C.dim}
                  onClick={() => { snd(SFX.tap); setMonQ({ ...monQ, al: monQ.al === a ? null : a }); }}>{lb}</Btn>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim, flex: 1 }}>
                {found.length} of {MONSTERS.length}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>ADD</span>
              {[1, 2, 4, 8].map((n) => (
                <button key={n} onClick={() => { snd(SFX.tap); setAddN(n); }} className="px-2"
                  style={{ border: `1px solid ${addN === n ? C.amber : C.line}`, background: "transparent",
                    color: addN === n ? C.amber : C.dim, fontFamily: MONO, fontSize: 10, cursor: "pointer", borderRadius: 0 }}>×{n}</button>
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.line}` }}>
              {found.slice(0, 180).map((m) => {
                const on = selMon && selMon.n === m.n;
                // explicit sides, not `border` + `borderTop: none`: this row's colour changes on
                // select, and React warns when a shorthand and a longhand for the same property
                // are both updated during a rerender
                return (
                  <div key={m.n} className="flex items-center gap-2 p-2"
                    style={{ borderLeft: `1px solid ${on ? C.blood : C.line}`,
                      borderRight: `1px solid ${on ? C.blood : C.line}`,
                      borderBottom: `1px solid ${on ? C.blood : C.line}`,
                      background: on ? `${C.blood}12` : C.panel }}>
                    <button onClick={() => { snd(SFX.tap); setSelMon(m); }}
                      className="text-left" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.text, fontSize: 13 }}>{m.n}</div>
                      <div style={{ color: C.dim, fontFamily: MONO, fontSize: 10 }}>
                        LV {m.lvRaw || m.lv} · AC {m.ac} · HP {m.hpRaw || m.hp} · {m.al}
                      </div>
                    </button>
                    <Btn flex={false} tone={C.blood} color={C.blood}
                      onClick={() => { snd(SFX.save); setFight((f) => addMonsters(f, m, addN));
                        flash(`${m.n}${addN > 1 ? ` ×${addN}` : ""} joined the fight`); }}>+</Btn>
                  </div>
                );
              })}
              {found.length > 180 && <div className="p-2" style={{ color: C.dim, fontSize: 11 }}>
                Showing the first 180 — narrow the search.</div>}
              {!found.length && <div className="p-2" style={{ color: C.dim, fontSize: 12 }}>
                Nothing in the bestiary matches.</div>}
            </div>
          </div>
        );
      }

      case "party": return (
        <div>
          <Bracket>
            <div className="flex items-baseline justify-between">
              <div style={kicker(C.amber)}>THE PARTY PURSE</div>
              <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>SHARED COIN</span>
            </div>
            <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: MONO, fontSize: 22, color: C.gold, minWidth: 96 }}>{coin(purse)}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>{purse} cp</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {[["+1 gp", 100], ["+1 sp", 10], ["+1 cp", 1], ["−1 sp", -10], ["−1 gp", -100]].map(([lb, cp]) => (
                <Btn key={lb} flex={false} color={cp > 0 ? C.green : C.blood}
                  onClick={() => { snd(SFX.toggle); adjustPurse(cp); }}>{lb}</Btn>
              ))}
              <Btn flex={false} color={C.dim} onClick={() => { snd(SFX.toggle); adjustPurse(-purse); }}>EMPTY</Btn>
            </div>
            <div style={{ color: C.dim, fontSize: 11, lineHeight: 1.45, marginTop: 6 }}>
              What the party can spend in shops. Buying from a shelf takes it from here and
              writes the purchase to the day log.
            </div>
          </Bracket>

          <div className="mt-3" />
          <Bracket>
            <div style={kicker()}>ADD A CHARACTER</div>
            <div className="flex gap-2 mb-2">
              <input value={pcDraft.name} onChange={(e) => setPcDraft({ ...pcDraft, name: e.target.value })} placeholder="Name" style={{ ...inputStyle, flex: 2, minWidth: 0 }} />
              <input value={pcDraft.cls} onChange={(e) => setPcDraft({ ...pcDraft, cls: e.target.value })} placeholder="Class" style={{ ...inputStyle, flex: 1, minWidth: 0 }} />
            </div>
            <Btn tone={C.green} color={C.green} onClick={() => {
              if (!pcDraft.name.trim()) return;
              setPcs((p) => [...p, { id: Math.random().toString(36).slice(2, 8), name: pcDraft.name.trim(), cls: pcDraft.cls.trim(), lv: 1, renown: 0, cha: 0, notes: "" }]);
              setPcDraft({ name: "", cls: "" }); flash("Added");
            }}>ADD</Btn>
          </Bracket>

          {!pcs.length && <div className="mt-3" style={{ color: C.dim, fontSize: 12, lineHeight: 1.5 }}>
            Renown decides which doors open in this city. Track it here and the app shows what each character can walk into.</div>}

          {pcs.map((p) => {
            const open = RENOWN_DOORS.filter((dr) => p.renown >= dr.at);
            const next = RENOWN_DOORS.find((dr) => p.renown < dr.at);
            const upd = (fn) => setPcs((x) => x.map((y) => y.id === p.id ? fn(y) : y));
            return (
              <div key={p.id} className="mt-3"><Bracket>
                <div className="flex items-baseline gap-2">
                  <span style={{ color: C.text, fontSize: 17 }}>{p.name}</span>
                  <span style={{ color: C.cyan, fontSize: 11, fontFamily: MONO }}>{p.cls}</span>
                  <span className="flex-1" />
                  {!play && <ConfirmBtn onConfirm={() => setPcs((x) => x.filter((y) => y.id !== p.id))} render={(armed, click) =>
                    <button onClick={click} title="Remove" style={{ background: armed ? C.blood : "none", border: "none", color: armed ? "#06090B" : C.blood, fontSize: armed ? 9 : 14, fontFamily: MONO, cursor: "pointer" }}>{armed ? "REMOVE?" : "×"}</button>} />}
                </div>
                <div className="flex gap-2 mt-3">
                  <div className="flex-1">
                    <div style={{ color: C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.1em", marginBottom: 3 }}>LEVEL</div>
                    <div className="flex items-center gap-2">
                      <Btn flex={false} onClick={() => upd((y) => ({ ...y, lv: Math.max(1, y.lv - 1) }))}>−</Btn>
                      <span style={{ color: C.cyan, fontSize: 20, fontFamily: MONO, minWidth: 28, textAlign: "center" }}>{p.lv}</span>
                      <Btn flex={false} onClick={() => upd((y) => ({ ...y, lv: Math.min(10, y.lv + 1) }))}>+</Btn>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div style={{ color: C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.1em", marginBottom: 3 }}>RENOWN</div>
                    <div className="flex items-center gap-2">
                      <Btn flex={false} color={C.blood} onClick={() => { snd(SFX.toggle); upd((y) => ({ ...y, renown: y.renown - 1 })); }}>−</Btn>
                      <span style={{ color: C.gold, fontSize: 20, fontFamily: MONO, minWidth: 28, textAlign: "center" }}>{fmt(p.renown)}</span>
                      <Btn flex={false} color={C.green} onClick={() => { snd(SFX.toggle); upd((y) => ({ ...y, renown: y.renown + 1 })); }}>+</Btn>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <div style={{ color: C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.1em", flex: 1 }}>CHA MODIFIER — used when they talk to NPCs</div>
                  <Btn flex={false} onClick={() => upd((y) => ({ ...y, cha: Math.max(-4, (Number(y.cha) || 0) - 1) }))}>−</Btn>
                  <span style={{ color: C.cyan, fontSize: 18, fontFamily: MONO, minWidth: 28, textAlign: "center" }}>{fmt(Number(p.cha) || 0)}</span>
                  <Btn flex={false} onClick={() => upd((y) => ({ ...y, cha: Math.min(4, (Number(y.cha) || 0) + 1) }))}>+</Btn>
                </div>
                <div className="mt-3">
                  <div style={{ color: C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.1em", marginBottom: 3 }}>DOORS OPEN</div>
                  {!open.length && <div style={{ color: C.dim, fontSize: 12 }}>Nothing upscale. Barred at every good door in the city.</div>}
                  {open.map((dr, i) => <div key={i} style={{ color: C.green, fontSize: 12, lineHeight: 1.5 }}>✓ {dr.what}</div>)}
                  {next && <div style={{ color: C.dim, fontSize: 11, marginTop: 4 }}>Next at {next.at} renown: {next.what}</div>}
                </div>
                <textarea value={p.notes} onChange={(e) => upd((y) => ({ ...y, notes: e.target.value }))}
                  rows={2} placeholder="Notes, debts, who owes them"
                  style={{ width: "100%", marginTop: 10, background: "#0A1114", color: C.text, border: `1px solid ${C.line}`, fontSize: 13, padding: 6, outline: "none", borderRadius: 0, resize: "vertical", fontFamily: "inherit" }} />
              </Bracket></div>);
          })}
        </div>
      );

      case "config": return (
        <div>
          <Group title="LAYOUT">
            <Seg label="TEXT SIZE" value={zoom} onChange={(v) => { snd(SFX.toggle); set("zoom", v); }} options={[[0.9, "S"], [1, "M"], [1.12, "L"], [1.25, "XL"]]} />
            <Seg label="LEFT COLUMN" value={s.leftW} onChange={(v) => { snd(SFX.toggle); set("leftW", v); }} options={[[320, "Narrow"], [380, "Normal"], [460, "Wide"]]} />
            <Toggle on={s.partyRail} label="Party rail in Play mode" onClick={() => { snd(SFX.toggle); set("partyRail", !s.partyRail); }} />
          </Group>
          <Group title="SOUND">
            <Toggle on={s.sound} label="System sounds" onClick={() => { set("sound", !s.sound); if (!s.sound) SFX.open(); }} />
            {s.sound && <Seg label="VOLUME" value={s.vol} onChange={(v) => { set("vol", v); setVol(v); SFX.tap(); }} options={[[0.4, "Quiet"], [1, "Normal"], [1.8, "Loud"]]} />}
            {s.sound && <Toggle on={s.soundUI} label="Interface sounds (taps, tabs, saves)" onClick={() => { set("soundUI", !s.soundUI); if (!s.soundUI) SFX.tap(); }} />}
            {s.sound && <Toggle on={s.soundCombat} label="Combat sounds (hits, damage, dying)" onClick={() => { set("soundCombat", !s.soundCombat); if (!s.soundCombat) SFX.hit(); }} />}
            {s.sound && <div className="mt-2">
              <div style={{ color: C.dim, fontSize: 10, letterSpacing: "0.1em", marginBottom: 5 }}>TEST SOUNDS</div>
              <div className="flex flex-wrap gap-1">
                {[["Tap", SFX.tap], ["Open", SFX.open], ["Save", SFX.save], ["Alert", SFX.alert], ["Scan", SFX.scan]].map(([lb, fn]) => (
                  <Btn key={lb} flex={false} onClick={fn}>{lb}</Btn>
                ))}
                {[["Hit", SFX.hit], ["Crit", SFX.crit], ["Fumble", SFX.fumble], ["Damage", SFX.damage], ["Heal", SFX.heal], ["Dying", SFX.dying], ["Death", SFX.death]].map(([lb, fn]) => (
                  <Btn key={lb} flex={false} tone={C.blood} onClick={fn}>{lb}</Btn>
                ))}
              </div>
            </div>}
          </Group>
          <Group title="MORE">
            {CONFIG_PAGES.map(([id, nm, subline]) => (
              <button key={id} onClick={() => openSub(id)} className="w-full text-left p-2 mb-1" style={{ border: `1px solid ${C.line}`, background: C.panel, cursor: "pointer", borderRadius: 0 }}>
                <div className="flex items-center"><span style={{ color: C.text, fontSize: 13, flex: 1 }}>{nm}</span><span style={{ color: C.dim }}>›</span></div>
                <div style={{ color: C.dim, fontSize: 11, marginTop: 2 }}>{subline}</div></button>))}
          </Group>
          <div style={{ color: C.dim, fontSize: 11, lineHeight: 1.5 }}>NPC settings (filters, sheet sections, presets, crowd sizes) live in the NPCs app, under Settings.<br />
            Press <span style={{ color: C.text, fontFamily: MONO }}>/</span> or <span style={{ color: C.text, fontFamily: MONO }}>Ctrl+K</span> anywhere to search everything.</div>
        </div>
      );
      default: return null;
    }
  };

  /* ============================ CENTRE COLUMN: the NPC sheet ============================ */
  const sheet = () => {
    if (!npc) return (
      <div style={{ maxWidth: 420, margin: "12vh auto 0", textAlign: "center" }}>
        <svg width="54" height="54" viewBox="0 0 40 40" style={{ margin: "0 auto" }}>
          <ellipse cx="20" cy="20" rx="18" ry="11" fill="none" stroke={C.cyan} strokeWidth="1.5" />
          <circle cx="20" cy="20" r="7" fill="none" stroke={C.gold} strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2.5" fill={C.gold} />
          <path d="M20 4 L20 9 M20 31 L20 36" stroke={C.cyan} strokeWidth="1.5" /></svg>
        <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
          No one open. Scan a stranger, or pick someone from Book NPCs or Saved NPCs — their sheet opens here and stays put while you browse.</div>
        <div className="flex justify-center mt-4">
          <button onClick={() => run({})} className="px-6 py-3"
            style={{ background: C.amber, color: "#06090B", border: "none", fontFamily: MONO, fontSize: 13, letterSpacing: "0.18em", fontWeight: 700, borderRadius: 0, cursor: "pointer" }}>SCAN</button>
        </div>
      </div>
    );

    const tb = (on, label, onClick, tn = C.amber, title) => (
      <button onClick={onClick} title={title} className="px-3 py-1"
        style={{ border: `1px solid ${on ? tn : C.lineHot}`, color: on ? tn : C.dim, background: on ? `${tn}14` : "transparent", fontSize: 11, fontFamily: MONO, letterSpacing: "0.08em", borderRadius: 0, cursor: "pointer" }}>{label}</button>
    );
    const SERIF_UI = "Georgia, 'Times New Roman', serif";
    const n = npc;
    const tabs = FILE_TABS.filter((t) => t.id !== "trade" || n.shop);
    const tab = tabs.some((t) => t.id === fileTab) ? fileTab : "overview";
    const trouble = ["pursued", "wanted", "exiled"].includes(n.record.state.id) || n.bounty;
    const Field = ({ k, v, tone: tn }) => (
      <div style={{ breakInside: "avoid", padding: "4px 0", borderBottom: `1px solid ${C.line}66` }}>
        <div style={{ color: C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.12em" }}>{k}</div>
        <div style={{ color: tn || C.text, fontSize: 13, lineHeight: 1.4 }}>{v}</div>
      </div>
    );
    const blocksFor = (id) => activeOrder.filter((k) => (FILE_TABS.find((t) => t.id === id) || { blocks: [] }).blocks.includes(k));
    const editFor = (id) => {
      let cur = null;
      return EDIT_FIELDS.filter(([label, path]) => { if (!path) { cur = EDIT_TAB[label]; return false; } return cur === id; });
    };
    const editGrid = (id) => {
      const fields = editFor(id);
      if (!fields.length) return null;
      return (
        <div className="mb-3 p-3" style={{ border: `1px solid ${C.green}66`, background: `${C.green}08` }}>
          <div style={{ color: C.green, fontSize: 11, lineHeight: 1.5, marginBottom: 8 }}>Type over anything on this tab. Your version replaces the rolled one and stays.</div>
          <div style={{ columnWidth: 280, columnGap: 14 }}>
            {fields.map(([label, path, isNum]) => {
              const cur = getPath(n, path);
              if (cur === undefined || cur === null) return null;
              const touched = n.edited && n.edited[path];
              const long = typeof cur === "string" && cur.length > 44;
              const draft = isNum && numDraft[path] !== undefined;
              const bad = draft && !/^-?\d+$/.test(String(numDraft[path]).trim());
              const fs = { width: "100%", background: "#0A1114", color: C.text, border: `1px solid ${bad ? C.blood : touched ? C.green : C.lineHot}`, fontSize: 13, padding: 6, outline: "none", borderRadius: 0 };
              return (
                <div key={path} className="mb-2" style={{ breakInside: "avoid" }}>
                  <div style={{ color: touched ? C.green : C.dim, fontSize: 9, fontFamily: MONO, letterSpacing: "0.08em" }}>{label.toUpperCase()}{touched ? " · YOURS" : ""}</div>
                  {long
                    ? <textarea value={cur} onChange={(e) => editField(path, e.target.value, isNum)} rows={2} style={{ ...fs, resize: "vertical", fontFamily: "inherit" }} />
                    : <input value={draft ? numDraft[path] : cur} inputMode={isNum ? "numeric" : undefined} onChange={(e) => editField(path, e.target.value, isNum)}
                        onBlur={() => isNum && setNumDraft((d) => { const x = { ...d }; delete x[path]; return x; })} style={fs} />}
                </div>);
            })}
          </div>
        </div>
      );
    };
    const flow = (children) => <div style={{ columnWidth: 340, columnGap: 14 }}>{children}</div>;

    /* ---------- Overview: what you need the moment they're in front of you ---------- */
    const dispPanel = (
      <Panel label="DISPOSITION" tone={dispTone} onReroll={() => rerollPart("react")} {...cp("disp")}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>WHO'S TALKING</span>
          <select value={talker} onChange={(e) => setTalker(e.target.value)} style={{ ...inputStyle, padding: "2px 6px", fontSize: 12, flex: 1 }}>
            <option value="none">Nobody in particular (CHA +0)</option>
            {pcs.map((p) => <option key={p.id} value={p.id}>{p.name} (CHA {fmt(Number(p.cha) || 0)})</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Btn flex={false} color={C.blood} onClick={() => nudge(-1)}>−</Btn>
          <div className="flex-1 text-center">
            <div style={{ color: dispTone, fontSize: 20, fontFamily: MONO, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", textShadow: glow(dispTone) }}>{REACT_ORDER[effDisp(n)]}</div>
            <div style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>2d6 {n.react.dice[0]}+{n.react.dice[1]}{n.react.mod ? ` ${fmt(n.react.mod)} mood` : ""}{talkCha ? ` ${fmt(talkCha)} CHA` : ""} = {n.react.sum + talkCha}</div></div>
          <Btn flex={false} color={C.green} onClick={() => nudge(1)}>+</Btn></div>
        <div className="mt-2 flex gap-1">{REACT_ORDER.map((r, i) => <div key={r} title={r} className="flex-1" style={{ height: 4, background: i <= effDisp(n) ? dispTone : C.line }} />)}</div>
        <div className="mt-2" style={{ fontSize: 12, lineHeight: 1.45 }}>{RUMOR_GATE[REACT_ORDER[effDisp(n)]].note}</div>
        <div className="mt-1" style={{ fontSize: 10, color: C.dim }}>Shadowdark: 0–6 hostile · 7–8 suspicious · 9 neutral · 10–11 curious · 12+ friendly. ± nudges stick.</div>
      </Panel>
    );
    const glance = n.sd ? (
      <Panel label="IN A FIGHT" tone={C.blood} {...cp("glance")}>
        {hpCtl(n)}
        <div className="grid grid-cols-3 gap-1 my-2">
          <Stat k="AC" v={n.sd.ac} tone={C.amber} />
          <Stat k="ATK" v={n.sd.attacks[0] ? (typeof n.sd.attacks[0].bonus === "number" ? fmt(n.sd.attacks[0].bonus) : n.sd.attacks[0].bonus) : "—"} tone={C.amber} /><Stat k="LV" v={n.lv} tone={C.cyan} /></div>
        {n.sd.attacks.map((a, i) => <div key={i} className="flex items-center gap-2" style={{ padding: "2px 0" }}>
          <span style={{ flex: 1, fontSize: 13 }}>{a.n} <span style={{ color: C.amber, fontFamily: MONO }}>{typeof a.bonus === "number" ? fmt(a.bonus) : a.bonus}</span> <span style={{ color: C.blood, fontFamily: MONO, fontSize: 12 }}>{a.dmg}</span></span>
          <button onClick={() => rollAttack(n, a)} style={{ border: `1px solid ${C.blood}`, background: `${C.blood}18`, color: C.blood, fontFamily: MONO, fontSize: 10, padding: "2px 8px", cursor: "pointer" }}>ROLL</button></div>)}
        {rollFeed(n)}
        <Row k="CLASS" v={`${n.sd.cls}${n.sd.title ? ` — ${n.sd.title}` : ""}`} tone={C.cyan} />
        <Row k="PRESSURE" v={cap(n.brk)} tone={C.blood} />
        <button onClick={() => setFileTab("combat")} className="mt-1" style={{ background: "none", border: "none", color: C.cyan, fontSize: 11, fontFamily: MONO, cursor: "pointer", padding: 0 }}>Full character sheet →</button>
      </Panel>
    ) : null;
    const now = (
      <Panel label="RIGHT NOW" tone={C.amber} {...cp("now")}>
        <Row k="DOING" v={cap(n.doing)} tone={C.amber} />
        <Row k="MOOD" v={cap(n.mood)} />
        {n.seenAt && <Row k="WHERE" v={`${n.seenAt.n}. ${n.seenAt.name} — ${DISTRICTS[n.seenAt.d].name}`} tone={C.cyan} />}
        <Row k="LOOKS" v={`${cap(n.build)}, ${n.age}. ${cap(n.mark)}.`} />
        <Row k="SOUNDS" v={`${cap(n.voice)}. ${n.vk ? `Says ${n.vk.phrase}` : ""}`} />
        {n.shop && <Row k="TRADE" v={<button onClick={() => setFileTab("trade")} style={{ background: "none", border: "none", color: C.gold, cursor: "pointer", padding: 0, fontSize: 13, textAlign: "left" }}>{n.shop.sign} — {n.shop.sells} →</button>} />}
        {trouble && <Row k="TROUBLE" v={<button onClick={() => setFileTab("record")} style={{ background: "none", border: "none", color: C.blood, cursor: "pointer", padding: 0, fontSize: 13, textAlign: "left" }}>{n.record.state.label}{n.bounty ? ` · ${n.bounty.amount} gp bounty` : ""} →</button>} />}
      </Panel>
    );

    /* ---------- Identity: the facts of the person ---------- */
    const particulars = (
      <Panel label="PARTICULARS" tone={C.gold} {...lk("identity")} {...cp("particulars")} onReroll={npc.isBook || locks.identity ? null : () => rerollPart("name")}>
        <div className="grid gap-x-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          <Field k="NAME" v={`${n.name}${n.ident ? ` ${n.ident}` : ""}`} />
          <Field k="OCCUPATION" v={n.role} />
          <Field k="LEVEL" v={n.lv} />
          <Field k="ANCESTRY" v={ancLabel[n.anc]} />
          <Field k="AGE" v={cap(n.age)} />
          <Field k="ALIGNMENT" v={alLabel[n.al]} />
          <Field k="ALLEGIANCE" v={n.fac.label} tone={n.fac.color} />
          <Field k="MEANS" v={BAND_LABEL[n.band]} />
          <Field k="RENOWN" v={`${fmt(n.renown)} — ${n.renownNote}`} />
          <Field k="FROM" v={n.origin.name} tone={C.cyan} />
          <Field k="GOD" v={`${n.faith.name} (${n.faith.devotion.toLowerCase()})`} tone={C.gold} />
          {n.assoc && <Field k="KNOWN TO" v={n.assoc} tone={C.gold} />}
          {n.tmpl && <Field k="MADE FROM" v={n.tmpl} tone={C.dim} />}
        </div>
      </Panel>
    );

    /* ---------- Combat ---------- */
    const atTable = n.sd ? (
      <Panel label="AT THE TABLE" tone={C.blood} {...cp("table")}>
        {n.conds.length ? n.conds.map((c, i) => <Row key={i} k={i === 0 ? "CONDITION" : ""} v={<span><span style={{ color: c.t }}>{c.n}.</span> {c.m}</span>} />) : <Row k="CONDITION" v="None right now." tone={C.dim} />}
        <Row k="MORALE" v="At half HP (or half their group down), flees on a failed DC 15 WIS check." />
        <Row k="PRESSURE" v={cap(n.brk)} tone={C.blood} />
        <Row k="DYING" v={`Death timer ${n.sd.deathTimer}; DC 15 INT to stabilise.`} />
        {n.abilities.length > 0 && n.abilities.map((a, i) => <Row key={i} k={i === 0 ? "TACTICS" : ""} v={<span><span style={{ color: C.amber }}>{a.n}.</span> {a.t}</span>} />)}
        {n.sd.canon && <Row k="NOTE" v="AC and HP are the book's; the rest is rolled." tone={C.gold} />}
      </Panel>
    ) : null;

    let body;
    if (tab === "overview") body = <>
      {show.open && <div className="mb-3 p-3" style={{ borderLeft: `3px solid ${C.gold}`, background: `${C.gold}0c`, fontSize: 15, lineHeight: 1.55, fontStyle: "italic" }}><span style={{ color: C.gold, fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", fontStyle: "normal", display: "block", marginBottom: 2 }}>// READ ALOUD</span>{n.opener}</div>}
      {n.canon && <Panel label="WHO THEY ARE" tone={C.gold} {...cp("canon_desc")}><div style={{ fontSize: 13, lineHeight: 1.55 }}>{n.canon.desc}</div>
        <div className="mt-2" style={{ fontSize: 13, lineHeight: 1.55 }}><span style={{ color: C.amber }}>Wants: </span>{n.canon.wants}</div>
        <div className="mt-2" style={{ fontSize: 13, lineHeight: 1.55 }}><span style={{ color: C.violet }}>Thread: </span>{n.canon.hook}</div></Panel>}
      {flow(<>{dispPanel}{now}{show.sit && renderBlock("sit")}{show.cond && renderBlock("cond")}{glance}</>)}
    </>;
    else if (tab === "identity") body = <>{particulars}{flow(blocksFor("identity").map((k) => renderBlock(k)))}</>;
    else if (tab === "talk") body = flow(<>{blocksFor("talk").map((k) => renderBlock(k))}</>);
    else if (tab === "record") body = flow(<>{blocksFor("record").map((k) => renderBlock(k))}{!n.bounty && <div style={{ color: C.dim, fontSize: 12, padding: 4 }}>No bounty on them.</div>}</>);
    else if (tab === "trade") body = flow(<>{renderBlock("shop")}<Panel label="PAYING THEM" tone={C.gold}><Row k="HELP COSTS" v={n.helpPrice} /><Row k="CREDIT" v={n.shop.credit} /><Row k="PURSE" v={n.sd ? walletText(n.sd.wallet) : "—"} /></Panel></>);
    else if (tab === "combat") body = n.sd ? <>
      <div className="flex items-center gap-2 mb-2">
        {!n.isBook && tb(false, "REROLL SHEET", () => { const next = { ...n, sd: buildSheet(n, s) }; syncThreat(next); snd(SFX.scan); commitNpc(next); }, C.cyan, "New class, talents, gear and purse — keeps who they are")}
        <span style={{ color: C.dim, fontSize: 11 }}>{editing ? "Editing: change any box on the sheet. Numbers only in number boxes." : "Built from Shadowdark core + the Western Reaches guide. EDIT to change anything."}</span>
      </div>
      <Panel label="VITALS" tone={hpState(n.sd).tone}>{hpCtl(n)}{rollFeed(n)}</Panel>
      <CharSheet n={n} editing={editing} onEdit={editField} onList={editList} onRoll={(a) => rollAttack(n, a)} />
      <div className="mt-3">{flow(atTable)}</div>
    </> : (
      <Panel label="NO CHARACTER SHEET YET" tone={C.blood}>
        <div style={{ fontSize: 13, lineHeight: 1.5 }}>This NPC was saved before character sheets existed. Building one rolls a class, talents, gear and a purse to fit who they already are{n.isBook ? ", keeping the book's AC and HP" : ""}. It will replace their old AC, HP and attack.</div>
        <div className="mt-2"><Btn flex={false} tone={C.green} color={C.green} onClick={buildSheetFor}>BUILD SHEET</Btn></div>
      </Panel>
    );
    else body = <>
      <Panel label="YOUR NOTES" tone={C.green}>
        <textarea value={n.notes || ""} onChange={(e) => setNote(e.target.value)} rows={8}
          placeholder={isSaved ? "What actually happened. Saved with them." : "What actually happened. Hit KEEP to save them with these notes."}
          style={{ width: "100%", background: "transparent", color: C.text, border: "none", outline: "none", fontSize: 14, lineHeight: 1.55, resize: "vertical" }} />
      </Panel>
      {!!groups.length && <div className="flex flex-wrap items-center gap-2 mb-3">
        <span style={{ color: C.dim, fontSize: 10, fontFamily: MONO }}>FOLDERS</span>
        {groups.map((g) => { const inIt = g.members.includes(n.id);
          return <button key={g.id} onClick={() => keepNpc(null, g.id)} className="px-3 py-1"
            style={{ border: `1px solid ${C.green}`, color: inIt ? "#06090B" : C.green, background: inIt ? C.green : "transparent", fontSize: 11, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>{g.name}</button>; })}
      </div>}
      <Panel label="THE WHOLE FILE AS TEXT" tone={C.dim}>
        <textarea readOnly value={asText(n)} onFocus={(e) => e.target.select()}
          style={{ width: "100%", height: 260, background: "transparent", color: C.dim, border: "none", outline: "none", fontSize: 11, lineHeight: 1.5, fontFamily: MONO, resize: "vertical" }} />
      </Panel>
    </>;

    return (
      <div>
        {/* toolbar stays pinned while the file scrolls */}
        <div className="flex flex-wrap items-center gap-1 py-2" style={{ position: "sticky", top: 0, background: C.bg, zIndex: 3 }}>
          {tb(editing, editing ? "DONE EDITING" : "EDIT", () => { snd(SFX.toggle); setEditing(!editing); }, C.green)}
          {tb(isSaved, isSaved ? "SAVED ✓" : "KEEP", () => keepNpc(null), C.green)}
          {tb(false, "COPY", () => doCopy(asText(n)))}
          {!n.isBook && tb(false, "RESCAN", () => run({}, buildKeep(n)), C.cyan, "New person; LOCKED sections carry over")}
          <span className="flex-1" />
          <button onClick={() => collapseAll(true)} title="Collapse every section" className="px-2 py-1"
            style={{ border: `1px solid ${C.line}`, color: C.dim, background: "transparent", fontSize: 10, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>▸ ALL</button>
          <button onClick={() => collapseAll(false)} title="Expand every section" className="px-2 py-1"
            style={{ border: `1px solid ${C.line}`, color: C.dim, background: "transparent", fontSize: 10, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>▾ ALL</button>
        </div>

        {/* file header */}
        <div className="px-4 pt-3" style={{ border: `1px solid ${C.lineHot}`, borderBottom: "none", position: "relative", overflow: "hidden",
          background: `linear-gradient(90deg, ${n.fac.color}14, transparent 55%), repeating-linear-gradient(90deg, transparent 0 3px, ${C.cyan}05 3px 4px), #0b1114` }}>
          <div className="mos-sweep" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 40, background: `linear-gradient(180deg, transparent, ${C.cyan}10, transparent)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 2, background: C.amber, boxShadow: glow(C.amber) }} />
          <div className="flex items-center gap-3" style={{ color: C.dim, fontSize: 10, fontFamily: MONO, letterSpacing: "0.12em" }}>
            <span>{n.isBook ? "BOOK FILE" : "FILE"} № {n.id}</span>
            {n.tmpl && <span>· {n.tmpl.toUpperCase()}</span>}
            <span className="flex-1" />
            {n.sd && hpState(n.sd).k !== "ok" && <span className="px-2 mos-flicker" style={{ border: `1px solid ${hpState(n.sd).tone}`, color: hpState(n.sd).tone, background: `${hpState(n.sd).tone}18` }}>{hpState(n.sd).label}</span>}
            <span className={`px-2 ${isSaved ? "" : "mos-flicker"}`} style={{ border: `1px solid ${isSaved ? C.green : C.amber}`, color: isSaved ? C.green : C.amber, textShadow: glow(isSaved ? C.green : C.amber, 4) }}>{isSaved ? "// ON FILE" : "// UNFILED"}</span>
          </div>
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <div style={{ fontSize: 32, lineHeight: 1.1, fontWeight: 800, letterSpacing: "0.01em", textShadow: `0 0 14px ${C.cyan}33, 1px 0 ${C.blood}66, -1px 0 ${C.cyan}66`, textDecoration: n.sd && n.sd.status === "dead" ? "line-through" : "none" }}>{n.name}{n.ident && <span style={{ color: C.gold, fontWeight: 400, fontStyle: "italic", textShadow: glow(C.gold, 6) }}> {n.ident}</span>}</div>
          </div>
          <div style={{ fontFamily: MONO, color: C.cyan, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {n.role}, level {n.lv}{n.sd && n.sd.clsId !== "level0" ? ` ${n.sd.cls.toLowerCase()}` : ""} · {alLabel[n.al]} {ancLabel[n.anc].toLowerCase()} · {BAND_LABEL[n.band].toLowerCase()}{n.seenAt ? ` · at ${n.seenAt.name}` : ""}</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {n.sd && n.sd.notable && <span className="px-2 py-1 mos-flicker" style={{ border: `1px solid ${C.violet}`, color: C.violet, fontSize: 10, fontFamily: MONO, textShadow: glow(C.violet, 6) }}>⚠ NOT WHAT THEY SEEM</span>}
            <span className="px-2 py-1" style={{ border: `1px solid ${n.fac.color}`, color: n.fac.color, fontSize: 10, fontFamily: MONO }}>{n.fac.label}</span>
            <span className="px-2 py-1" style={{ border: `1px solid ${C.line}`, color: C.dim, fontSize: 10, fontFamily: MONO }}>RENOWN {fmt(n.renown)}</span>
            {show.record && <span className="px-2 py-1" style={{ border: `1px solid ${n.record.tone}`, color: n.record.tone, fontSize: 10, fontFamily: MONO }}>{n.record.state.label.toUpperCase()}</span>}
            {n.bounty && <span className="px-2 py-1" style={{ border: `1px solid ${C.blood}`, color: C.blood, fontSize: 10, fontFamily: MONO }}>{n.bounty.amount} GP BOUNTY</span>}
            {n.sd && <span className="px-2 py-1" style={{ border: `1px solid ${C.line}`, color: C.dim, fontSize: 10, fontFamily: MONO }}>AC {n.sd.ac} · HP {n.sd.hpNow}/{n.sd.hp}</span>}
          </div>
          {!!(n.warn && n.warn.length) && <div className="mt-2" style={{ fontSize: 11, color: C.amber, lineHeight: 1.45 }}>{n.warn.map((w, i) => <div key={i}>⚠ {w}</div>)}</div>}
          {/* folder tabs */}
          <div className="flex gap-1 mt-3" style={{ marginBottom: -1 }}>
            {tabs.map((t) => {
              const on = t.id === tab;
              const dot = (t.id === "record" && trouble) || (t.id === "notes" && n.notes);
              return <button key={t.id} onClick={() => { snd(SFX.tap); setFileTab(t.id); }} className="py-1"
                style={{ border: "none", padding: "5px 20px 5px 12px", clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  background: on ? `linear-gradient(180deg, ${C.amber}, ${C.amber}cc)` : `${C.cyan}12`, color: on ? "#06090B" : C.dim,
                  fontFamily: MONO, fontWeight: on ? 700 : 400, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}>
                {t.n}{dot && <span style={{ color: on ? "#06090B" : t.id === "record" ? C.blood : C.green }}> ◆</span>}</button>;
            })}
          </div>
        </div>
        <div className="p-3 mb-6" style={{ border: `1px solid ${C.lineHot}`, borderTop: `2px solid ${C.amber}`, boxShadow: `0 -6px 16px -12px ${C.amber}` }}>
          {editing && tab !== "combat" && tab !== "notes" && editGrid(tab)}
          {editing && tab === "combat" && editGrid("combat")}
          {body}
        </div>
      </div>
    );
  };

  /* ============================ RIGHT RAIL: party (play mode) ============================ */
  const rail = () => (
    <aside style={{ width: 230, flexShrink: 0, borderLeft: `1px solid ${C.line}`, display: "flex", flexDirection: "column", minHeight: 0, background: "#070B0D" }}>
      <div className="flex items-center gap-2 px-3" style={{ height: 40, borderBottom: `1px solid ${C.line}`, flexShrink: 0 }}>
        <Glyph kind="shield" color={C.green} size={15} />
        <span style={{ color: C.text, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em" }}>Party</span>
        <span className="flex-1" />
        <button onClick={() => { snd(SFX.toggle); set("partyRail", false); }} title="Hide rail" style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 13 }}>✕</button>
      </div>
      <div className="p-2" style={{ flex: 1, overflowY: "auto" }}>
        {!pcs.length && <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, padding: 4 }}>No characters yet. Add them in the Party app.</div>}
        {pcs.map((p) => (
          <div key={p.id} className="p-2 mb-1" style={{ border: `1px solid ${C.line}`, background: C.panel }}>
            <button onClick={() => { if (npc) { setTalker(talker === p.id ? "none" : p.id); } else openApp("party"); }} title="Set as who's talking to the open NPC" className="w-full text-left" style={{ background: talker === p.id ? `${C.amber}18` : "none", border: "none", cursor: "pointer", padding: 0 }}>
              <div style={{ color: C.text, fontSize: 13 }}>{p.name}</div>
              <div style={{ color: C.cyan, fontSize: 10, fontFamily: MONO }}>{p.cls || "—"} · LV {p.lv} · CHA {fmt(Number(p.cha) || 0)}</div>
            </button>
            <div className="flex items-center gap-1 mt-1">
              <span style={{ color: C.dim, fontSize: 9, fontFamily: MONO, flex: 1 }}>RENOWN</span>
              <button onClick={() => { snd(SFX.toggle); setPcs((x) => x.map((y) => y.id === p.id ? { ...y, renown: y.renown - 1 } : y)); }}
                style={{ border: `1px solid ${C.lineHot}`, background: "transparent", color: C.blood, width: 22, height: 20, cursor: "pointer", borderRadius: 0, fontSize: 12 }}>−</button>
              <span style={{ color: C.gold, fontSize: 13, fontFamily: MONO, minWidth: 26, textAlign: "center" }}>{fmt(p.renown)}</span>
              <button onClick={() => { snd(SFX.toggle); setPcs((x) => x.map((y) => y.id === p.id ? { ...y, renown: y.renown + 1 } : y)); }}
                style={{ border: `1px solid ${C.lineHot}`, background: "transparent", color: C.green, width: 22, height: 20, cursor: "pointer", borderRadius: 0, fontSize: 12 }}>+</button>
            </div>
          </div>))}
      </div>
    </aside>
  );

  const appMeta = APP_BY_ID[app];
  // drop taskbar labels to icons (hover shows the name) when the screen, after text size, is too narrow
  const taskLabels = vw / zoom >= 660 + appsFor(s.uiMode).length * 98;
  /* ---------------- the fight tracker, and the open statblock ---------------- */
  const fightMain = () => {
    const line = initOrder(fight);
    const now = whoseTurn(fight);
    const tot = sideTotals(fight);
    const AL = { L: "Lawful", N: "Neutral", C: "Chaotic" };
    const ST = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    return (
      <div className="pt-3" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Bracket>
          <div className="flex items-center gap-3 flex-wrap">
            <div style={kicker(C.blood)}>THE FIGHT</div>
            <span style={{ fontFamily: MONO, fontSize: 18, color: fight.round ? C.text : C.dim }}>
              {fight.round ? `ROUND ${fight.round}` : "NOT STARTED"}</span>
            {now && <span style={{ fontFamily: MONO, fontSize: 12, color: C.gold }}>▸ {now.name}</span>}
            <span className="flex-1" />
            <span style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
              {tot.up} up · {tot.down} down</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Btn tone={C.gold} color={C.gold} onClick={() => { snd(SFX.scan); setFight((f) => rollInit(f)); }}>
              ROLL INITIATIVE</Btn>
            <Btn tone={C.cyan} color={C.cyan} onClick={() => { snd(SFX.tap); setFight(advance); }}>NEXT TURN ›</Btn>
            {!!pcs.length && <Btn flex={false} color={C.green}
              onClick={() => { snd(SFX.save); setFight((f) => pcs.reduce((acc, p) => addPc(acc, p), f)); flash("Party added"); }}>
              + PARTY</Btn>}
            <Btn flex={false} color={C.dim} onClick={() => { snd(SFX.toggle); setFight(clearDead); }}>CLEAR DEAD</Btn>
            <ConfirmBtn onConfirm={() => { snd(SFX.back); setFight(endFight()); flash("Fight cleared"); }}
              render={(armed, go) => (
                <Btn flex={false} tone={armed ? C.blood : undefined} color={C.blood} onClick={go}>
                  {armed ? "END — SURE?" : "END FIGHT"}</Btn>
              )} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
            Initiative is d20 + DEX (core §2). Monsters roll their own; your PCs roll a bare d20
            because the Party app doesn't track DEX — type over any number to correct it.
          </div>
        </Bracket>

        {!fight.in.length ? (
          <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5 }}>
            Nothing in the fight yet. Pick monsters from the bestiary on the left and press +,
            or drop your party in with + PARTY.
          </div>
        ) : (
          <div style={{ border: `1px solid ${C.line}` }}>
            {line.map((c, i) => {
              const st = hpState({ hpNow: c.hpNow, hp: c.hp, status: c.status === "dead" ? "dead" : c.status });
              const active = fight.round > 0 && i === fight.turn;
              return (
                <div key={c.id} className="flex items-center gap-2 p-2 flex-wrap"
                  style={{ borderBottom: `1px solid ${C.line}`, background: active ? `${C.gold}14` : "transparent",
                    boxShadow: active ? `inset 3px 0 0 ${C.gold}` : "none", opacity: c.status === "dead" ? 0.5 : 1 }}>
                  <input value={c.init ?? ""} onChange={(e) => setFight((f) => setFightField(f, c.id, "init", e.target.value === "" ? null : Number(e.target.value)))}
                    title="Initiative" style={{ ...inputStyle, width: 40, textAlign: "center", fontFamily: MONO, padding: 4 }} />
                  <div style={{ minWidth: 150, flex: 1 }}>
                    <div style={{ color: c.kind === "pc" ? C.green : C.text, fontSize: 13 }}>{c.name}</div>
                    <div style={{ color: C.dim, fontFamily: MONO, fontSize: 10 }}>
                      LV {c.lv ?? "—"} · AC {c.ac}{c.atk ? ` · ${c.atk}` : ""}{c.mv ? ` · MV ${c.mv}` : ""}
                    </div>
                  </div>
                  <span style={{ fontFamily: MONO, fontSize: 10, color: st.tone, minWidth: 74 }}>{st.label}</span>
                  <div className="flex items-center gap-1">
                    <span style={{ fontFamily: MONO, fontSize: 15, color: st.tone, minWidth: 54, textAlign: "right" }}>
                      {c.hpNow}/{c.hp}</span>
                    {[1, 5].map((n) => (
                      <button key={`d${n}`} onClick={() => { snd(SFX.hit); setFight((f) => hurt(f, c.id, n)); }}
                        title={`${n} damage`} className="px-1"
                        style={{ border: `1px solid ${C.blood}`, background: "transparent", color: C.blood, fontFamily: MONO, fontSize: 10, cursor: "pointer", borderRadius: 0 }}>−{n}</button>
                    ))}
                    {[1, 5].map((n) => (
                      <button key={`h${n}`} onClick={() => { snd(SFX.heal); setFight((f) => mend(f, c.id, n)); }}
                        title={`heal ${n}`} className="px-1"
                        style={{ border: `1px solid ${C.green}`, background: "transparent", color: C.green, fontFamily: MONO, fontSize: 10, cursor: "pointer", borderRadius: 0 }}>+{n}</button>
                    ))}
                    <input value={c.hp} onChange={(e) => setFight((f) => setHpMax(f, c.id, Number(e.target.value) || 1))}
                      title="Max HP — editable, because the Hydra's is '*' and a mutated monster won't match its printed line"
                      style={{ ...inputStyle, width: 44, textAlign: "center", fontFamily: MONO, padding: 4 }} />
                    <button onClick={() => { snd(SFX.back); setFight((f) => dropFighter(f, c.id)); }} title="Remove"
                      style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 13, padding: "0 4px" }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selMon && (
          <Bracket>
            <div className="flex items-baseline justify-between">
              <div style={kicker(C.blood)}>{selMon.fam.toUpperCase()} · {selMon.band.toUpperCase()}</div>
              <button onClick={() => setSelMon(null)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 12 }}>✕</button>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{selMon.n}</div>
            <div style={{ color: C.dim, fontSize: 12, lineHeight: 1.5, marginBottom: 6 }}>{selMon.d}</div>
            <div className="flex flex-wrap gap-3" style={{ fontFamily: MONO, fontSize: 12, color: C.text, marginBottom: 6 }}>
              <span>AC <b style={{ color: C.cyan }}>{selMon.ac}</b>{selMon.acn ? ` (${selMon.acn})` : ""}</span>
              <span>HP <b style={{ color: C.blood }}>{selMon.hpRaw || selMon.hp}</b></span>
              <span>LV <b style={{ color: C.gold }}>{selMon.lvRaw || selMon.lv}</b></span>
              <span>AL {AL[selMon.al] || selMon.al}</span>
            </div>
            <Row k="ATK" v={selMon.atk} />
            <Row k="MOVE" v={selMon.mv} />
            <div className="flex flex-wrap gap-3 py-1" style={{ borderBottom: `1px solid ${C.line}55` }}>
              {selMon.st.map((v, i) => (
                <span key={ST[i]} style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>
                  {ST[i]} <b style={{ color: v >= 0 ? C.text : C.blood }}>{fmt(v)}</b></span>
              ))}
            </div>
            {(selMon.sp || []).map((sp, i) => <Row key={i} k={sp.n.toUpperCase()} v={sp.t} tone={C.gold} />)}
            {(selMon.hpRaw || selMon.lvRaw) && (
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 6, lineHeight: 1.5 }}>
                {selMon.hpRaw === "*"
                  ? "The book prints HP and LV as *: you choose how many heads it has. Each head is LV 2, AC 15, HP 11."
                  : "The book prints a pair — the lesser form, then the greater. The tracker starts from the lesser."}
              </div>
            )}
            <div className="flex gap-2 mt-2">
              <Btn tone={C.blood} color={C.blood}
                onClick={() => { snd(SFX.save); setFight((f) => addMonsters(f, selMon, addN)); flash(`${selMon.n}${addN > 1 ? ` ×${addN}` : ""} joined the fight`); }}>
                ADD TO FIGHT{addN > 1 ? ` ×${addN}` : ""}</Btn>
              <Btn flex={false} onClick={() => doCopy(monsterText(selMon), "Copy blocked — click the page first")}>COPY</Btn>
            </div>
          </Bracket>
        )}
      </div>
    );
  };

  const subTitle = sub === "crowd" ? `${crowdLabel} — ${crowd.length}` : sub ? SUB_LABEL[sub] : app === "npcs" ? (NPC_TABS.find((t) => t.id === npcTab) || {}).full : null;
  const two = (n) => String(n).padStart(2, "0");
  const realTime = `${clock.getHours() % 12 || 12}:${two(clock.getMinutes())} ${clock.getHours() < 12 ? "AM" : "PM"}`;
  const realDate = clock.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

  return (
    <div style={{ zoom, background: C.bg, color: C.text, height: `${100 / zoom}vh`, minHeight: 520 / zoom, display: "flex", flexDirection: "column", fontFamily: "system-ui,-apple-system,Segoe UI,sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes mosSweep { 0% { transform: translateY(-40px); } 100% { transform: translateY(260px); } }
        @keyframes mosFlicker { 0%, 90%, 100% { opacity: 1; } 92% { opacity: .35; } 94% { opacity: 1; } 96% { opacity: .6; } }
        .mos-sweep { animation: mosSweep 5s linear infinite; }
        .mos-flicker { animation: mosFlicker 4s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .mos-sweep, .mos-flicker { animation: none; } }
      `}</style>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,229,255,0.05) 0px, rgba(0,229,255,0.05) 1px, transparent 1px, transparent 3px)", opacity: 0.6, zIndex: 20 }} />

      {/* ================= WORKSPACE ================= */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", position: "relative", zIndex: 10 }}>

        {/* left: the open app */}
        <aside style={{ width: s.leftW || 380, flexShrink: 0, borderRight: `1px solid ${C.line}`, display: "flex", flexDirection: "column", minHeight: 0, background: "#070B0D" }}>
          <div className="flex items-center gap-2 px-3" style={{ height: 40, borderBottom: `1px solid ${modeTone}55`, flexShrink: 0 }}>
            {gq.trim() ? <>
              <button onClick={() => setGq("")} className="px-2" style={{ border: `1px solid ${C.lineHot}`, color: C.amber, background: "transparent", fontSize: 12, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>✕</button>
              <span style={{ color: C.amber, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em" }}>Search</span>
            </> : <>
            {sub && <button onClick={closeSub} className="px-2" style={{ border: `1px solid ${C.lineHot}`, color: C.cyan, background: "transparent", fontSize: 13, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>←</button>}
            <Glyph kind={appMeta.glyph} color={TONE[appMeta.tone]} size={16} />
            <span style={{ color: C.text, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {appMeta.name}{subTitle && <span style={{ color: C.dim }}> / {subTitle}</span>}</span></>}
          </div>
          <div key={`${app}/${sub}/${npcTab}/${gq ? "q" : ""}`} className="p-3" style={{ flex: 1, overflowY: "auto" }}>{leftBody()}</div>
        </aside>

        {/* centre: the map when the Map app is open, otherwise the NPC sheet */}
        <main className="px-4 pb-4" style={{ flex: 1, minWidth: 0, overflowY: app === "map" ? "hidden" : "auto" }}>
          {app === "map" ? (
            <div className="pt-3" style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
              <div className="flex items-baseline gap-3 mb-2 flex-wrap" style={{ flexShrink: 0 }}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: C.cyan, letterSpacing: "0.12em" }}>MERIDIA — THE CITY OF MASKS</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{dayLabel(world)} · {watchOf(world).name}</span>
                {world.partyAt != null && locByN(world.partyAt) &&
                  <span style={{ fontFamily: MONO, fontSize: 11, color: C.green }}>PARTY: {locByN(world.partyAt).name}</span>}
                <span className="flex-1" />
                <button onClick={bumpWatch} className="px-2 py-1" title="Advance one watch"
                  style={{ border: `1px solid ${C.gold}`, color: C.gold, background: "transparent", fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", borderRadius: 0, cursor: "pointer" }}>NEXT WATCH ›</button>
              </div>
              <CityMap selDistrict={mapSel.district} selLoc={mapSel.loc} selBldg={mapSel.bldg} partyAt={world.partyAt}
                night={watchOf(world).night && world.on} focusKey={focus}
                onDistrict={(code) => { snd(SFX.tap); setMapSel({ district: code, loc: null, bldg: null, inside: false }); }}
                onLoc={(n) => { snd(SFX.tap); const l = locByN(n);
                  // a named place that IS a footprint opens as that building, so the 50 behave
                  // like everything else; the 7 with no footprint fall back to the book panel
                  setMapSel({ district: l ? l.d : null, loc: n, bldg: BLDG_BY_LOC[n] || null, inside: false }); }}
                onBldg={(b) => { snd(SFX.tap); setMapSel({ district: b.d, loc: b.loc || null, bldg: b, inside: false }); }}
                onBlank={() => { if (mapSel.bldg || mapSel.loc) { snd(SFX.back); setMapSel({ ...mapSel, loc: null, bldg: null, inside: false }); } }} />
              <div style={{ flexShrink: 0 }}><MapLegend night={watchOf(world).night && world.on} /></div>
            </div>
          ) : app === "bestiary" ? fightMain() : sheet()}
        </main>

        {/* right: party rail — not over the map, which needs the width and shows the party itself */}
        {play && s.partyRail && app !== "map" && rail()}
      </div>

      {saveState !== "ok" && (
        <div className="flex items-center gap-3 px-3 py-2" style={{ background: `${C.blood}22`, borderTop: `1px solid ${C.blood}`, position: "relative", zIndex: 10, flexShrink: 0 }}>
          <span style={{ color: C.blood, fontFamily: MONO, fontSize: 11, letterSpacing: "0.1em" }}>NOT SAVING</span>
          <span style={{ color: C.text, fontSize: 12, flex: 1 }}>{saveState === "blocked"
            ? "Couldn't read your saved data, so saving is paused to protect it. Reload the page. Only continue if you're sure there's nothing saved."
            : "Storage refused the last save — it may be full. Take a backup (Config → Your data) and delete some saved NPCs."}</span>
          {saveState === "blocked" && <ConfirmBtn onConfirm={() => setSaveState("ok")} render={(armed, click) =>
            <Btn flex={false} tone={C.blood} color={armed ? "#06090B" : C.blood} fill={armed ? C.blood : undefined} onClick={click}>{armed ? "TAP AGAIN — OVERWRITE" : "SAVE ANYWAY"}</Btn>} />}
          {saveState === "failed" && <Btn flex={false} tone={C.blood} color={C.blood} onClick={() => openApp("config", "data")}>YOUR DATA</Btn>}
        </div>)}

      {/* ================= TASKBAR ================= */}
      <footer className="flex items-stretch" style={{ height: 52, flexShrink: 0, borderTop: `1px solid ${C.lineHot}`, background: "#080C0E", position: "relative", zIndex: 10 }}>
        <div className="flex items-center gap-2 px-3" style={{ borderRight: `1px solid ${C.line}` }}>
          <svg width="22" height="22" viewBox="0 0 40 40">
            <ellipse cx="20" cy="20" rx="18" ry="11" fill="none" stroke={C.cyan} strokeWidth="2" />
            <circle cx="20" cy="20" r="6" fill="none" stroke={C.gold} strokeWidth="2" /><circle cx="20" cy="20" r="2.5" fill={C.gold} /></svg>
          <span style={{ color: C.cyan, fontFamily: MONO, fontSize: 11, letterSpacing: "0.24em" }}>MERIDIA</span>
        </div>
        <div className="flex items-center px-2" style={{ borderRight: `1px solid ${C.line}` }}>
          <input ref={searchRef} value={gq} onChange={(e) => setGq(e.target.value)} placeholder="Search everything   /"
            onKeyDown={(e) => { if (e.key === "Escape") { setGq(""); e.target.blur(); } }}
            style={{ ...inputStyle, width: taskLabels ? 190 : 140, padding: "6px 8px", fontSize: 12, borderColor: gq ? C.amber : C.lineHot }} />
        </div>

        <div className="flex items-stretch" style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        {appsFor(s.uiMode).map((id) => {
          const a = APP_BY_ID[id], on = app === id, tn = TONE[a.tone];
          return (
            <button key={id} onClick={() => openApp(id)} title={`${a.name} — ${a.sub}`} className="flex items-center gap-2 px-3"
              style={{ background: on ? `${tn}14` : "transparent", borderStyle: "solid", borderColor: on ? tn : "transparent", borderWidth: "2px 0 0 0", color: on ? C.text : C.dim, cursor: "pointer", fontSize: 12, borderRadius: 0 }}>
              <Glyph kind={a.glyph} color={on ? tn : C.dim} size={17} />
              {taskLabels && <span style={{ whiteSpace: "nowrap" }}>{a.short}</span>}
            </button>);
        })}
        </div>

        <div className="flex items-center gap-2 px-3" style={{ borderLeft: `1px solid ${C.line}` }}>
          <div className="flex" style={{ border: `1px solid ${C.lineHot}` }}>
            {[["prep", "PREP", C.cyan], ["play", "PLAY", C.amber]].map(([m, lbl, tn]) => (
              <button key={m} onClick={() => s.uiMode !== m && setUiMode(m)} className="px-3 py-1"
                style={{ background: s.uiMode === m ? tn : "transparent", color: s.uiMode === m ? "#06090B" : C.dim, border: "none", fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", fontWeight: s.uiMode === m ? 700 : 400, cursor: "pointer", borderRadius: 0 }}>{lbl}</button>))}
          </div>
          {play && !s.partyRail && <button onClick={() => { snd(SFX.toggle); set("partyRail", true); }} title="Show party rail" className="px-2 py-1"
            style={{ border: `1px solid ${C.lineHot}`, color: C.green, background: "transparent", fontSize: 10, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>RAIL</button>}
          <button onClick={() => { set("sound", !s.sound); if (!s.sound) SFX.open(); }} title="Sound" className="px-2 py-1"
            style={{ border: `1px solid ${s.sound ? C.green : C.line}`, color: s.sound ? C.green : C.dim, background: "transparent", fontSize: 11, fontFamily: MONO, borderRadius: 0, cursor: "pointer" }}>{s.sound ? "♪" : "✕"}</button>
        </div>

        {/* in-world time — the spine. Tapping the label opens the day log; › advances a watch. */}
        {world.on ? (
          <div className="flex items-stretch" style={{ borderLeft: `1px solid ${C.line}` }}>
            <button onClick={() => { snd(SFX.open); setApp("map"); setSub("time"); }} title="In-world time — open the day log"
              className="flex flex-col justify-center px-3 text-right" style={{ border: "none", background: "transparent", borderRadius: 0, cursor: "pointer" }}>
              <span style={{ color: watchOf(world).night ? C.violet : C.gold, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
                {watchOf(world).night ? "☾" : "☀"} {watchOf(world).name.toUpperCase()}</span>
              <span style={{ color: C.dim, fontSize: 10, whiteSpace: "nowrap" }}>{dayLabel(world)}{hol.label && hol.label !== "Ordinary day" ? ` · ${hol.label}` : ""}</span>
            </button>
            <button onClick={bumpWatch} title="Advance one watch"
              className="px-2" style={{ border: "none", borderLeft: `1px solid ${C.line}`, background: "transparent", color: C.gold, fontFamily: MONO, fontSize: 13, cursor: "pointer" }}>›</button>
          </div>
        ) : (
          <button onClick={() => { snd(SFX.toggle); set("time", s.time === "night" ? "day" : "night"); }} title="Time system is off — click to flip day/night"
            className="flex flex-col justify-center px-3 text-right" style={{ borderStyle: "solid", borderColor: C.line, borderWidth: "0 0 0 1px", background: "transparent", borderRadius: 0, cursor: "pointer" }}>
            <span style={{ color: s.time === "night" ? C.violet : C.gold, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em" }}>{s.time === "night" ? "☾ NIGHT" : "☀ DAY"}</span>
            <span style={{ color: C.dim, fontSize: 10, whiteSpace: "nowrap" }}>{hol.label}</span>
          </button>
        )}
        <div className="flex flex-col justify-center px-3 text-right" style={{ borderLeft: `1px solid ${C.line}`, minWidth: 96 }}>
          <span style={{ color: C.text, fontSize: 13, fontFamily: MONO }}>{realTime}</span>
          <span style={{ color: C.dim, fontSize: 10, whiteSpace: "nowrap" }}>{realDate}</span>
        </div>
      </footer>

      {toast && <div className="px-3 py-2" style={{ position: "absolute", right: 12, bottom: 62, zIndex: 30, border: `1px solid ${toast.bad ? C.blood : C.green}`, color: toast.bad ? C.blood : C.green, background: "#06090B", fontSize: 11, fontFamily: MONO }}>{toast.m}</div>}
    </div>
  );
}
