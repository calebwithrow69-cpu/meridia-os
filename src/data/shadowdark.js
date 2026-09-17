import { RNG, clamp, d, pick, chance } from "../lib/rng.js";
// `chance` and `pick` were used by the wizard talent table below but never imported — latent bug, fixed here.

export const ancLabel = { human: "Human", dwarf: "Dwarf", elf: "Elf", halfling: "Halfling", halforc: "Half-orc", halfelf: "Half-elf", goblin: "Goblin" };
// kobold dropped from pickable ancestries — no mechanical trait exists in any reference file (only an unattached population-table roll). SD_ANCESTRY.kobold below is kept as a dormant stub for when real source text turns up.

export const alLabel = { L: "Lawful", N: "Neutral", C: "Chaotic" };

export const ABILITIES = {
  crime: [
    { n: "Backstab", t: "Deals an extra 1d6 damage per 2 levels against a target it has advantage on, or that is unaware of it." },
    { n: "Vanish", t: "Once per fight, becomes hidden in any lighting if there is a crowd, a shadow, or a doorway within near." },
    { n: "Blade Venom", t: "On its first hit each fight, the target makes a DC 12 CON check or takes 1d6 damage again at the start of its next turn." },
    { n: "Cut and Run", t: "When reduced below half HP, immediately moves double and cannot be attacked in passing." },
  ],
  martial: [
    { n: "Parry", t: "Once per round, forces one melee attack against it to be rerolled." },
    { n: "Press the Advantage", t: "If an ally is in melee with the same target, its attacks against that target have advantage." },
    { n: "Shield Wall", t: "Allies within near who also carry shields gain +1 AC." },
    { n: "Second Wind", t: "Once per fight, on its turn, regains 1d8 HP instead of attacking." },
    { n: "Disarm", t: "On a hit, may deal no damage and instead force a DC 15 STR check or the target drops its weapon." },
  ],
  arcane: [
    { n: "Spellcasting", t: "Casts as a caster of its level. Two tier-1 spells and, at level 5+, one tier-2 spell. Spellcasting check is DC 12." },
    { n: "Counterspell", t: "Once per fight, as a reaction, forces a spell cast within far to be rerolled at disadvantage." },
    { n: "Arcane Ward", t: "The first 5 damage it takes each round from a spell is negated." },
    { n: "Misdirect", t: "Once per fight, an attack that would hit it instead hits the nearest other creature." },
  ],
  clergy: [
    { n: "Turn the Unclean", t: "Once per fight, all undead within near make a DC 12 CHA check or flee for 1d4 rounds." },
    { n: "Laying On of Hands", t: "Once per fight, heals itself or an ally within close for 1d6 + its level." },
    { n: "Litany", t: "While it speaks and takes no other action, allies within near have advantage on fear and morale." },
    { n: "Blood Offering", t: "May take 1d6 damage to give its next attack or spell advantage." },
  ],
  noble: [
    { n: "Command", t: "Once per fight, one creature within near makes a DC 15 CHA check or spends its turn doing what it was told." },
    { n: "Duelist's Footing", t: "Cannot be flanked, and gains +2 AC against the first attacker each round." },
    { n: "Retainers", t: "Arrives with 1d4+1 guards who will die for it, and they know it." },
  ],
  trade: [
    { n: "Knows Everyone", t: "Once per scene, names someone present who owes it a favour. That person will not fight it." },
    { n: "Something in the Pocket", t: "Once per fight, produces exactly the right small item — a vial, a key, a whistle." },
  ],
  labor: [
    { n: "Hard Hands", t: "Unarmed strikes deal 1d6. Grappling checks have advantage." },
    { n: "Takes a Beating", t: "The first hit each fight deals half damage." },
  ],
};


export const SD_STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const modOf = (sc) => (sc <= 3 ? -4 : sc <= 5 ? -3 : sc <= 7 ? -2 : sc <= 9 ? -1 : sc <= 11 ? 0 : sc <= 13 ? 1 : sc <= 15 ? 2 : sc <= 17 ? 3 : 4);

export const SCORE_BAND = { "-4": [2, 3], "-3": [4, 5], "-2": [6, 7], "-1": [8, 9], "0": [10, 11], "1": [12, 13], "2": [14, 15], "3": [16, 17], "4": [18, 18] };

export const scoreFor = (mod) => { const b = SCORE_BAND[String(clamp(mod, -4, 4))]; return b[0] + Math.floor(RNG() * (b[1] - b[0] + 1)); };

// weapons — core table. `lbl` lets a kit rename one ("Oar (as staff)") without changing its stats

export const SD_WEAPONS = {
  bastard: { n: "Bastard sword", cost: "10 gp", type: "M", range: "C", dmg: "1d8/1d10", props: "Versatile", slots: 1 },
  club: { n: "Club", cost: "5 cp", type: "M", range: "C", dmg: "1d4", props: "", slots: 1 },
  crossbow: { n: "Crossbow", cost: "8 gp", type: "R", range: "F", dmg: "1d6", props: "Loading, 2H", slots: 1, ammo: "bolts" },
  dagger: { n: "Dagger", cost: "1 gp", type: "MR", range: "C/N", dmg: "1d4", props: "Finesse, Thrown", slots: 1 },
  greataxe: { n: "Greataxe", cost: "10 gp", type: "M", range: "C", dmg: "1d8/1d10", props: "Versatile", slots: 1 },
  greatsword: { n: "Greatsword", cost: "12 gp", type: "M", range: "C", dmg: "1d12", props: "2H", slots: 2 },
  handaxe: { n: "Handaxe", cost: "2 gp", type: "MR", range: "C/N", dmg: "1d6", props: "Finesse, Thrown", slots: 1 },
  morningstar: { n: "Morning star", cost: "5 gp", type: "M", range: "C", dmg: "1d6/1d8", props: "Versatile", slots: 1 },
  javelin: { n: "Javelin", cost: "5 sp", type: "MR", range: "C/F", dmg: "1d4", props: "Thrown", slots: 1 },
  longbow: { n: "Longbow", cost: "8 gp", type: "R", range: "F", dmg: "1d8", props: "2H", slots: 1, ammo: "arrows" },
  longsword: { n: "Longsword", cost: "9 gp", type: "M", range: "C", dmg: "1d8", props: "", slots: 1 },
  mace: { n: "Mace", cost: "5 gp", type: "M", range: "C", dmg: "1d6", props: "", slots: 1 },
  pike: { n: "Pike", cost: "10 gp", type: "M", range: "2×C", dmg: "1d10", props: "2H", slots: 1 },
  scimitar: { n: "Scimitar", cost: "8 gp", type: "M", range: "C", dmg: "1d6", props: "Finesse", slots: 1 },
  shortbow: { n: "Shortbow", cost: "6 gp", type: "R", range: "F", dmg: "1d4", props: "2H", slots: 1, ammo: "arrows" },
  shortsword: { n: "Shortsword", cost: "7 gp", type: "M", range: "C", dmg: "1d6", props: "", slots: 1 },
  sling: { n: "Sling", cost: "5 sp", type: "R", range: "F", dmg: "1d4", props: "", slots: 1 },
  spear: { n: "Spear", cost: "5 sp", type: "MR", range: "C/N", dmg: "1d6", props: "Thrown", slots: 1 },
  staff: { n: "Staff", cost: "5 sp", type: "M", range: "C", dmg: "1d4", props: "2H", slots: 1 },
  warhammer: { n: "Warhammer", cost: "10 gp", type: "M", range: "C", dmg: "1d10", props: "2H", slots: 1 },
  whip: { n: "Whip", cost: "10 gp", type: "MR", range: "N", dmg: "1d4", props: "Finesse, Lash", slots: 1 },
};

export const SD_ARMOR = {
  none: { n: "No armour", ac: 10, dex: true, slots: 0 },
  leather: { n: "Leather armour", ac: 11, dex: true, slots: 1, cost: "10 gp" },
  chainmail: { n: "Chainmail", ac: 13, dex: true, slots: 2, cost: "60 gp", note: "Disadv. on stealth and swimming" },
  plate: { n: "Plate mail", ac: 15, dex: false, slots: 3, cost: "130 gp", note: "No swimming; disadv. on stealth" },
};


export const SD_ANCESTRY = {
  human: { n: "Human", langs: ["Common"], extra: 1, trait: ["Ambitious", "Gains one additional talent roll at 1st level."] },
  dwarf: { n: "Dwarf", langs: ["Common", "Dwarvish"], trait: ["Stout", "+2 HP at start; rolls HP per level with advantage."] },
  elf: { n: "Elf", langs: ["Common", "Elvish", "Sylvan"], trait: ["Farsight", "+1 to ranged attacks or +1 to spellcasting checks."] },
  goblin: { n: "Goblin", langs: ["Common", "Goblin"], trait: ["Keen Senses", "Can't be surprised."] },
  halforc: { n: "Half-orc", langs: ["Common", "Orcish"], trait: ["Mighty", "+1 to attack and damage with melee weapons."] },
  halfling: { n: "Halfling", langs: ["Common"], trait: ["Stealthy", "Once per day, becomes invisible for 3 rounds."] },
  halfelf: { n: "Half-elf", langs: ["Common", "Elvish"], extra: 1, trait: ["Adaptable", "Rolls talent rolls twice and keeps either result."] },
  kobold: { n: "Kobold", langs: ["Common", "Draconic"], trait: ["(Kobold trait)", "Not in your reference files — fill in from your book."] }, // NOT IN REFS — check
};

export const COMMON_LANGS = ["Dwarvish", "Elvish", "Giant", "Goblin", "Merran", "Orcish", "Reptilian", "Sylvan", "Thanian"];

export const RARE_LANGS = ["Celestial", "Diabolic", "Draconic", "Primordial"];


export const TITLES = {
  fighter: { L: ["Squire", "Cavalier", "Knight", "Thane", "Lord/Lady"], C: ["Knave", "Bandit", "Slayer", "Reaver", "Warlord"], N: ["Warrior", "Barbarian", "Battlerager", "Warchief", "Chieftain"] },
  priest: { L: ["Acolyte", "Crusader", "Templar", "Champion", "Paladin"], C: ["Initiate", "Zealot", "Cultist", "Scourge", "Chaos Knight"], N: ["Seeker", "Invoker", "Haruspex", "Mystic", "Oracle"] },
  thief: { L: ["Footpad", "Burglar", "Rook", "Underboss", "Boss"], C: ["Thug", "Cutthroat", "Shadow", "Assassin", "Wraith"], N: ["Robber", "Outlaw", "Rogue", "Renegade", "Bandit King/Queen"] },
  wizard: { L: ["Apprentice", "Conjurer", "Arcanist", "Mage", "Archmage"], C: ["Adept", "Channeler", "Witch/Warlock", "Diabolist", "Sorcerer"], N: ["Shaman", "Seer", "Warden", "Sage", "Druid"] },
  // Cursed Scroll 1 titles
  warlock: { L: ["Favored", "Herald", "Eminent", "Exalted", "Incarnation"], C: ["Marked", "Zealot", "Occultist", "Champion", "Harbinger"], N: ["Chosen", "Channeler", "Prophesied", "Transcendent", "Avatar"] },
  witch: { L: ["Fortune Teller", "Far Seer", "Prophet", "Wise One", "Baba"], C: ["Whisperer", "Hexer", "Hag/Elder", "Crone/Uncle", "Baba"], N: ["Shaman", "Conjurer", "Soothsayer", "Conduit", "Baba"] },
  knightydris: { L: ["Arbiter", "Enforcer", "Knight Marshal", "Judge", "Justiciar"], C: ["Traitor", "Fallen", "Oathbreaker", "Blackguard", "Demonlord"], N: ["Brother/Sister", "Exorcist", "Reverend Knight", "Inquisitor", "Grand Inquisitor"] },
  // Bard and Ranger Classes
  bard: { L: ["Storyteller", "Balladeer", "Philosopher", "Poet", "Master Poet"], C: ["Guttersnipe", "Charlatan", "Satirist", "Silvertongue", "Doomspeaker"], N: ["Seeker", "Witness", "Speaker", "Voice", "Truthbearer"] },
  ranger: { L: ["Wanderer", "Strider", "Warden", "Guardian", "Sentinel"], C: ["Hood", "Outlaw", "Fugitive", "Exile", "Pariah"], N: ["Stranger", "Wayfarer", "Outlander", "Recluse", "Hermit"] },
  // Cursed Scroll 6 — the book leaves some early Lawful/Chaotic cells blank; those fall back to "Duelist".
  // At 9-10 the book offers three flavor variants per alignment (e.g. Swordmaster/Mongoose/Wolf); "Swordmaster" is used for all three to keep one title per level.
  duelist: { L: ["Duelist", "Fencer", "Duelist", "Defender", "Swordmaster"], C: ["Duelist", "Ruffian", "Duelist", "Heckler", "Swordmaster"], N: ["Student", "Challenger", "Mouser", "Panther", "Swordmaster"] },
};


export const PRIEST_SPELLS = [
  ["Cure Wounds", "Holy Weapon", "Light", "Protection From Evil", "Shield of Faith"],
  ["Augury", "Bless", "Blind/Deafen", "Cleansing Weapon", "Smite", "Zone of Truth"],
  ["Command", "Lay To Rest", "Mass Cure", "Rebuke Unholy", "Restoration", "Speak With Dead"],
  ["Commune", "Control Water", "Flame Strike", "Pillar of Salt", "Regenerate", "Wrath"],
  ["Divine Vengeance", "Dominion", "Heal", "Judgment", "Plane Shift", "Prophecy"],
];

export const WIZARD_SPELLS = [
  ["Alarm", "Burning Hands", "Charm Person", "Detect Magic", "Feather Fall", "Floating Disk", "Hold Portal", "Light", "Mage Armor", "Magic Missile", "Protection From Evil", "Sleep"],
  ["Acid Arrow", "Alter Self", "Detect Thoughts", "Fixed Object", "Hold Person", "Invisibility", "Knock", "Levitate", "Mirror Image", "Misty Step", "Silence", "Web"],
  ["Animate Dead", "Dispel Magic", "Fabricate", "Fireball", "Fly", "Gaseous Form", "Illusion", "Lightning Bolt", "Magic Circle", "Protection From Energy", "Sending", "Speak With Dead"],
  ["Arcane Eye", "Cloudkill", "Confusion", "Control Water", "Dimension Door", "Divination", "Passwall", "Polymorph", "Resilient Sphere", "Stoneskin", "Telekinesis", "Wall of Force"],
  ["Antimagic Shell", "Create Undead", "Disintegrate", "Hold Monster", "Plane Shift", "Power Word Kill", "Prismatic Orb", "Scrying", "Shapechange", "Summon Extraplanar", "Teleport", "Wish"],
];
// spells known per level [T1..T5]

export const PRIEST_KNOWN = [[2], [3], [3, 1], [3, 2], [3, 2, 1], [3, 2, 2], [3, 3, 2, 1], [3, 3, 2, 2], [3, 3, 2, 2, 1], [3, 3, 3, 2, 2]];

export const WIZARD_KNOWN = [[3], [4], [4, 1], [4, 2], [4, 2, 1], [4, 3, 2], [4, 3, 2, 1], [4, 4, 2, 2], [4, 4, 3, 2, 1], [4, 4, 4, 2, 2]]; // NOT IN REFS — from memory of the core book; check

// Witch — Cursed Scroll 1
export const WITCH_SPELLS = [
  ["Cauldron", "Charm Person", "Eyebite", "Fog", "Hypnotize", "Oak, Ash, Thorn", "Puppet", "Shadowdance", "Willowman", "Witchlight"],
  ["Alter Self", "Augury", "Bogboil", "Cacklerot", "Cat's Eye", "Frog Rain", "Invisibility", "Poison", "Spidersilk", "Toadstool"],
  ["Broomstick", "Coven", "Divination", "Howl", "Mistletoe", "Pin Doll", "Speak With Dead", "Swarm", "Void Stare", "Whisper"],
  ["Beguile", "Cloak of Night", "Curse", "Dimension Door", "Glassbones", "Moonbeam", "Nightmare", "Polymorph"],
  ["Anathema", "Dreamwalk", "Enfeeble", "Finger of Death", "Mother of Night", "Scrying", "Shapechange", "Soul Jar"],
];
export const WITCH_KNOWN = [[3], [4], [4, 1], [4, 2], [4, 2, 1], [4, 3, 2], [4, 3, 2, 1], [4, 4, 2, 2], [4, 4, 3, 2, 1], [4, 4, 4, 2, 2]];

// Knight of St. Ydris casts from the witch spell list too, but on a slower table — Cursed Scroll 1
export const YDRIS_KNOWN = [[], [], [1], [2], [3], [3, 1], [3, 2], [3, 3], [3, 3, 1], [3, 3, 2]];

// Warlock patrons — Cursed Scroll 1. Each boon(r) mirrors the book's own 2d6 Patron Boon table.
// Effects only wire into the sheet where the book gives a clean number (a stat bump, an attack bonus, an AC bonus);
// the rest (teleports, mind-reading, morale forcing, immunities) are read off the sheet as flavor, same as the
// existing thief/roustabout talents that already carry effect keys (e.g. `init`) with no numeric hookup.
export const WARLOCK_PATRONS = {
  almazzat: {
    n: "Almazzat", desc: "A wolf-headed arch-demon with six eyes and six horns, who seeks to wrest the Sands of the Ages from his father, Kytheros.",
    boon: (r) => r === 2 ? ["1/day, advantage on melee attacks for 3 rounds", {}] : r <= 7 ? ["Learn to wield one melee weapon, or +1 to melee attacks", { atk: 1 }] : r <= 9 ? ["+2 to {stat} (or +1 to melee damage)", { stat: ["STR", "CON"], amt: 2 }] : r <= 11 ? ["Advantage on initiative rolls", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
  kytheros: {
    n: "Kytheros", desc: "The Lord of Time, who sees all possible futures and seeks the fulfillment of all destinies as they were meant to be.",
    boon: (r) => r === 2 ? ["1/day, force the GM to reroll a single roll", {}] : r <= 7 ? ["+1 AC through supernatural foresight", { ac: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "WIS"], amt: 2 }] : r <= 11 ? ["3/day, add your WIS bonus to any roll", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
  shune: {
    n: "Shune the Vile", desc: "A goddess, the Mother Witch, who speaks to her children in the flicker of candles and the rattle of dry bones. She seeks hidden secrets and lost lore.",
    boon: (r) => r === 2 ? ["1/day, read the mind of a creature you touch for 3 rounds", {}] : r <= 7 ? ["Learn a wizard spell, tier = half your level, cast with INT", { spell: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["DEX", "INT"], amt: 2 }] : r <= 11 ? ["+1 XP whenever you learn a valuable or significant secret", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
  willowman: {
    n: "The Willowman", desc: "A ghostly, elongated being who stalks misty forests and watches from the edge of nightmares. It seeks fear.",
    boon: (r) => r === 2 ? ["1/day, teleport to a far location you see, as your move", {}] : r <= 7 ? ["+1 to melee or ranged attacks", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX"], amt: 2 }] : r <= 11 ? ["1/day, force a close being to check morale, even if immune", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
  mugdulblub: {
    n: "Mugdulblub", desc: "The Elder Ooze that leaks between the cracks in memory and the darkness between the stars. It seeks the dissolution of all physical form.",
    boon: (r) => r === 2 ? ["1/day, turn into a crawling puddle of slime for 3 rounds", {}] : r <= 7 ? ["Maximize two hit point die rolls (prior or future)", {}] : r <= 9 ? ["+2 to {stat}", { stat: ["DEX", "CON"], amt: 2 }] : r <= 11 ? ["Immune to one of: acid, cold, poison", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
  titania: {
    n: "Titania", desc: "The fickle Queen of the Fey, who views all existence as a whimsical dream with hidden meaning. She seeks mischief, beauty, and artistry.",
    boon: (r) => r === 2 ? ["1/day, hypnotize a LV 5 or less creature for 3 rounds", {}] : r <= 7 ? ["Learn to wield a longbow, or +1 to ranged attacks", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["DEX", "CHA"], amt: 2 }] : r <= 11 ? ["Hostile spells that target you are always hard to cast", {}] : ["Choose one option, or +2 stat points", { pick: 1 }],
  },
};

// Diabolical Backgrounds — Cursed Scroll 1, shared by Warlock/Witch/Knight of St. Ydris
export const DIABOLICAL_BG = ["Hermit", "Outcast", "Woodborn", "Amnesiac", "Haunted", "Fugitive", "Feytouched", "Witchborn", "Forager", "Redeemer", "Marked", "Sacrifice", "Marooned", "Fallen", "Drawn", "Ascetic", "Wolfchild", "Healer", "Chosen", "Demonborn"];

/* Classes. `talent(r)` returns [text, effect] for a 2d6 roll.
   effect: {stat:[choices], amt} | {atk:1} | {ac:1} | {cast:1} | {backstab:1} | {mastery:1} | {extraHp:1} | {spell:1} | {pick:1} | {two:1} */

export const SD_CLASSES = {
  level0: {
    n: "— (Level 0)", hd: 0, weapons: null, armor: ["leather", "chainmail", "plate"], shield: true,
    features: [["Beginner's luck", "No class yet. Can wield any weapon or armour."]],
  },
  fighter: {
    n: "Fighter", hd: 8, weapons: null, armor: ["leather", "chainmail", "plate"], shield: true,
    features: [["Hauler", "Adds CON mod (if positive) to gear slots."], ["Weapon Mastery", "+1 attack and damage with {mastery}, plus half level."], ["Grit", "Advantage on {grit} checks to overcome an opposing force."]],
    talent: (r) => r === 2 ? ["Weapon Mastery with one more weapon type", { mastery: 1 }] : r <= 6 ? ["+1 to melee and ranged attacks", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "CON"], amt: 2 }] : r <= 11 ? ["+1 AC while wearing armour", { ac: 1 }] : ["+2 stat points", { pick: 1 }],
  },
  priest: {
    n: "Priest", hd: 6, weapons: ["club", "crossbow", "dagger", "mace", "longsword", "staff", "warhammer"], armor: ["leather", "chainmail", "plate"], shield: true, cast: "WIS", spells: PRIEST_SPELLS, known: PRIEST_KNOWN, rareLang: 1,
    features: [["Turn Undead", "Knows Turn Undead (doesn't count against spells known)."], ["Deity", "Serves {deity}; holy symbol takes no gear slot."], ["Spellcasting", "WIS-based. Spell DC = 10 + tier."]],
    talent: (r) => r === 2 ? ["Advantage when casting {spell}", { advSpell: 1 }] : r <= 6 ? ["+1 to melee and ranged attacks", { atk: 1 }] : r <= 9 ? ["+1 to priest spellcasting checks", { cast: 1 }] : r <= 11 ? ["+2 to {stat}", { stat: ["STR", "WIS"], amt: 2 }] : ["+2 stat points", { pick: 1 }],
  },
  thief: {
    n: "Thief", hd: 4, weapons: ["club", "crossbow", "dagger", "shortbow", "shortsword"], armor: ["leather"], shield: false,
    features: [["Backstab", "+{backstab} weapon dice against an unaware target."], ["Thievery", "Advantage on climbing, sneaking, hiding, disguise, traps, and picking pockets and locks. Thief's tools take no gear slot."]],
    talent: (r) => r === 2 ? ["Advantage on initiative", { init: 1 }] : r <= 5 ? ["Backstab deals +1 die", { backstab: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "CHA"], amt: 2 }] : r <= 11 ? ["+1 to melee and ranged attacks", { atk: 1 }] : ["+2 stat points", { pick: 1 }],
  },
  wizard: {
    n: "Wizard", hd: 4, weapons: ["dagger", "staff"], armor: [], shield: false, cast: "INT", spells: WIZARD_SPELLS, known: WIZARD_KNOWN, commonLang: 2, rareLang: 2,
    features: [["Learning Spells", "DC 15 INT and a day's study to learn a spell from a scroll."], ["Spellcasting", "INT-based. Spell DC = 10 + tier."]],
    // NOT IN REFS — wizard talent table is from memory of the core book; check
    talent: (r) => r === 2 ? ["Can make one random magic item", { item: 1 }] : r <= 7 ? (chance(0.5) ? ["+2 to INT", { stat: ["INT"], amt: 2 }] : ["+1 to wizard spellcasting checks", { cast: 1 }]) : r <= 9 ? ["Advantage when casting {spell}", { advSpell: 1 }] : r <= 11 ? ["Knows one extra wizard spell", { spell: 1 }] : ["+2 stat points", { pick: 1 }],
  },
  roustabout: {
    n: "Roustabout", hd: 4, weapons: ["club", "dagger", "staff"], armor: ["leather"], shield: false, src: "Western Reaches",
    features: [["Knowaguy", "Advantage on checks to deal with commoners and source favours."], ["Lucksmith", "When someone else uses their luck token, that roll has advantage."], ["Surprising Guts", "At half HP or lower, advantage on their next roll."]],
    talent: (r) => r === 2 ? ["+1 to {stat} and another talent", { stat: SD_STATS, amt: 1, again: 1 }] : r <= 6 ? ["Can wield one more weapon or armour", { prof: 1 }] : r <= 9 ? ["+1 to {stat}", { two: 1 }] : r <= 11 ? ["An extra hit die this level", { extraHp: 1 }] : ["Knows one spell: {spell}", { spell: 1 }],
  },
  // replaces the old "Western Reaches" Warlock, whose talent table pointed to a Player's Guide boon
  // table that was never actually transcribed anywhere in this codebase. This version (Cursed Scroll 1)
  // is fully specified: six named patrons, each with its own complete boon table.
  warlock: {
    n: "Warlock", hd: 6, weapons: ["club", "crossbow", "dagger", "mace", "longsword"], armor: ["leather", "chainmail"], shield: true, src: "Cursed Scroll 1", rareLang: 1,
    features: [["Patron", "Serves {patron}, who can grant or withhold its gifts."], ["Patron Boon", "Gained a random Patron Boon from {patron} at 1st level."]],
    talent: (r, ctx) => {
      const patronKey = (ctx && ctx.patronKey) || pick(Object.keys(WARLOCK_PATRONS));
      const rollBoon = (key) => WARLOCK_PATRONS[key].boon(d(6) + d(6));
      if (r === 2) return rollBoon(pick(Object.keys(WARLOCK_PATRONS))); // "an unexplained gift" from any patron
      if (r <= 6) return ["+1 point to two different stats", { two: 1 }];
      if (r <= 9) return ["+1 to melee and ranged attacks", { atk: 1 }];
      if (r <= 11) return pick([rollBoon(patronKey), rollBoon(patronKey)]); // roll two, keep one
      return ["Choose a talent, or +2 points to distribute to stats", { pick: 1 }];
    },
  },
  witch: {
    n: "Witch", hd: 4, weapons: ["dagger", "staff"], armor: ["leather"], shield: false, src: "Cursed Scroll 1", cast: "CHA", spells: WITCH_SPELLS, known: WITCH_KNOWN, fixedLangs: ["Diabolic", "Primordial", "Sylvan"],
    features: [["Familiar", "A small animal (raven, rat, frog) that speaks Common and can be the source of the witch's spells. If it dies, it's restored by permanently sacrificing 1d4 HP."], ["Spellcasting", "CHA-based. Spell DC = 10 + tier."]],
    talent: (r) => r === 2 ? ["1/day, teleport to your familiar's location as a move", {}] : r <= 7 ? ["+2 to CHA, or +1 to witch spellcasting checks", { cast: 1 }] : r <= 9 ? ["Advantage when casting {spell}", { advSpell: 1 }] : r <= 11 ? ["Learn an additional witch spell of any tier you can cast", { spell: 1 }] : ["Choose a talent, or +2 points to distribute to stats", { pick: 1 }],
  },
  knightydris: {
    n: "Knight of St. Ydris", hd: 6, weapons: null, armor: ["leather", "chainmail", "plate"], shield: true, src: "Cursed Scroll 1", cast: "CHA", spells: WITCH_SPELLS, known: YDRIS_KNOWN, fixedLangs: ["Diabolic"],
    features: [["Demonic Possession", "3/day, +1 to damage rolls for 3 rounds, plus half level (round down)."], ["Spellcasting", "Casts witch spells with CHA. Spell DC = 10 + tier. A natural 1 risks a Diabolical Mishap."]],
    talent: (r) => r === 2 ? ["Demonic Possession bonus increases by 1 point", {}] : r <= 6 ? ["+1 to melee or ranged attacks", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "CON"], amt: 2 }] : r <= 11 ? ["+2 to CHA, or +1 to witch spellcasting checks", { cast: 1 }] : ["Choose a talent, or +2 points to distribute to stats", { pick: 1 }],
  },
  bard: {
    n: "Bard", hd: 6, weapons: ["crossbow", "dagger", "mace", "shortbow", "shortsword", "spear", "staff"], armor: ["leather", "chainmail"], shield: true, src: "Bard and Ranger", commonLang: 4, rareLang: 1,
    features: [["Bardic Arts", "Trained in oration, performing arts, lore, and diplomacy. Advantage on related checks."], ["Magical Dabbler", "Activates spell scrolls and wands using CHA. A critical failure means rolling a wizard mishap."], ["Presence", "DC 12 CHA check to Inspire (one target within near gains a luck token) or Fascinate (Focus; transfixes LV4-or-less targets within near)."], ["Prolific", "+1d6 to learning rolls. A group carousing with them adds +1d6 to its rolls too."]],
    talent: (r) => r === 2 ? ["Finds a random priest or wizard wand", {}] : r <= 6 ? ["+1 to melee and ranged attacks, or +1 to Magical Dabbler rolls", { atk: 1 }] : r <= 9 ? ["+2 points to distribute to any stats", { pick: 1 }] : r <= 11 ? ["Presence effects become DC 9 to enact", {}] : ["Choose a talent", { again: 1 }],
  },
  ranger: {
    n: "Ranger", hd: 8, weapons: ["dagger", "longbow", "longsword", "shortbow", "shortsword", "spear", "staff"], armor: ["leather", "chainmail"], shield: false, src: "Bard and Ranger",
    features: [["Wayfinder", "Advantage on checks for navigation, tracking, bushcraft, stealth, and wild animals."], ["Herbalism", "INT check to prepare an herbal remedy: DC 11 salve (heals 1 HP), DC 12 stimulant (can't be surprised for 10 rounds), DC 13 foebane (advantage vs. one creature type for 1d6 rounds), DC 14 restorative (ends a poison or disease), DC 15 curative (as a Potion of Healing). Unused remedies expire in 3 rounds."]],
    talent: (r) => r === 2 ? ["Deals d12 damage with one weapon type of their choice", {}] : r <= 6 ? ["+1 to melee or ranged attacks and damage", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "INT"], amt: 2 }] : r <= 11 ? ["Advantage on Herbalism checks for one remedy", {}] : ["Choose a talent, or +2 points to distribute to stats", { pick: 1 }],
  },
  duelist: {
    n: "Duelist", hd: 8, weapons: ["dagger", "bastard", "greatsword", "longsword", "scimitar", "shortsword"], armor: ["leather", "chainmail"], shield: false, src: "Cursed Scroll 6",
    features: [["Parry", "Once per day, an attack that would hit them misses instead."], ["Tale Spinner", "DC 15 CHA check: strangers believe they're famous and important for the rest of the interaction. The same person can't be fooled twice."], ["Taunt", "When an enemy misses them with an attack, advantage on attacks against that enemy next round."]],
    talent: (r) => r === 2 ? ["1/day, all attacks that would hit them this round miss instead", {}] : r <= 6 ? ["+1 to melee attacks and damage, or +1 Parry use per day", { atk: 1 }] : r <= 9 ? ["+2 to {stat}", { stat: ["STR", "DEX", "CHA"], amt: 2 }] : r <= 11 ? ["+1d6 damage when they hit with a Taunt attack", {}] : ["Choose a talent, or +2 points to distribute to stats", { pick: 1 }],
  },
};

// Which class an NPC gets IF they have one at all (see CLASS_CHANCE below — most jobs are ordinary
// vocations, not classes). Only used from LV1 up; LV0 and CLASS_CHANCE failures use the level0 chassis.
// Knight of St. Ydris never appears here — it's a secret cursed order, not a career, so it's only
// reachable through the RARE_CLASS_POOL overlay below, independent of job.

export const ROLE_CLASS = {
  laborer: [["roustabout", 9], ["fighter", 1]], beggar: [["roustabout", 1]], child: [["roustabout", 1]], drunk: [["roustabout", 8], ["fighter", 2]],
  rower: [["roustabout", 7], ["fighter", 3], ["ranger", 1]], sailor: [["fighter", 5], ["roustabout", 4], ["thief", 1], ["ranger", 1]], servant: [["roustabout", 1]],
  vendor: [["roustabout", 1]], artisan: [["roustabout", 1]], merchant: [["roustabout", 7], ["thief", 3]], innkeep: [["roustabout", 7], ["fighter", 3]],
  gambler: [["thief", 6], ["roustabout", 4]], informant: [["thief", 7], ["roustabout", 3]], cutpurse: [["thief", 1]], thief: [["thief", 1]],
  fence: [["thief", 8], ["roustabout", 2]], smuggler: [["thief", 6], ["fighter", 4]], thug: [["fighter", 7], ["thief", 3]], masked: [["thief", 4], ["warlock", 3], ["wizard", 2], ["witch", 1]],
  assassin: [["thief", 1]], guard: [["fighter", 1]], sergeant: [["fighter", 1]], knight: [["fighter", 1]], spy: [["thief", 8], ["wizard", 2]],
  duelist: [["duelist", 7], ["fighter", 2], ["thief", 1]], gladiator: [["fighter", 1]], bard: [["bard", 6], ["roustabout", 2], ["wizard", 1], ["thief", 1]], actor: [["roustabout", 6], ["bard", 2], ["thief", 2]],
  apprentice: [["wizard", 1]], mage: [["wizard", 1]], scholar: [["wizard", 5], ["roustabout", 5]], clerk: [["roustabout", 1]], barrister: [["roustabout", 8], ["wizard", 2]],
  acolyte: [["priest", 1]], priest: [["priest", 1]], cultist: [["warlock", 6], ["priest", 4]], charnelman: [["priest", 8], ["fighter", 2]],
  mourner: [["roustabout", 7], ["priest", 3]], pilgrim: [["priest", 4], ["roustabout", 5], ["ranger", 1]], physician: [["roustabout", 6], ["priest", 4]],
  apothecary: [["roustabout", 6], ["wizard", 3], ["witch", 1]], fortuneteller: [["witch", 4], ["roustabout", 3], ["wizard", 2], ["warlock", 1]], noble: [["fighter", 4], ["roustabout", 3], ["wizard", 2], ["duelist", 1]],
  druid: [["priest", 7], ["wizard", 3]],
};

// Chance (0-1) that an NPC in this job has ANY Shadowdark class at all. Most professions are just
// professions — a shopkeeper, a servant, a scholar aren't secretly Fighters because the game needs a
// stat block. A class means real training in violence or magic. Children and LV0 never roll here.
export const CLASS_CHANCE = {
  laborer: 0.04, beggar: 0.02, child: 0, drunk: 0.05, rower: 0.07, sailor: 0.12, servant: 0.03,
  vendor: 0.04, artisan: 0.05, merchant: 0.08, innkeep: 0.08, gambler: 0.15, informant: 0.2,
  cutpurse: 0.3, thief: 0.55, fence: 0.25, smuggler: 0.3, thug: 0.45, masked: 0.85, assassin: 0.95,
  guard: 0.85, sergeant: 0.95, knight: 0.95, spy: 0.85, duelist: 0.85, gladiator: 0.8, bard: 0.5,
  actor: 0.12, apprentice: 0.8, mage: 0.95, scholar: 0.15, clerk: 0.03, barrister: 0.1, acolyte: 0.55,
  priest: 0.95, cultist: 0.55, charnelman: 0.35, mourner: 0.04, pilgrim: 0.08, physician: 0.1,
  apothecary: 0.1, fortuneteller: 0.3, noble: 0.2, druid: 0.85,
};
export const CLASS_CHANCE_DEFAULT = 0.05;

// The secret-class overlay: independent of job, a tiny fraction of ANY LV1+ adult could be hiding one
// of these. This is what makes "someone interesting" possible under any mask — a shopkeeper, a guard,
// a beggar. Checked before the job-based roll above; if it hits, it overrides the job's usual class.
export const RARE_CLASS_CHANCE = 0.005;
export const RARE_CLASS_POOL = [["warlock", 5], ["witch", 4], ["knightydris", 1]];

// Shadowdark core d20 backgrounds — NOT IN REFS (list from the core book); check

export const ROLE_BACKGROUND = {
  labor: ["Urchin", "Orphaned", "Sailor", "Mercenary", "Banished"], trade: ["Jeweler", "Herbalist", "Minstrel", "Scholar", "Orphaned"],
  crime: ["Thieves' Guild", "Urchin", "Wanted", "Banished", "Mercenary"], martial: ["Soldier", "Mercenary", "Scout", "Ranger", "Noble"],
  arcane: ["Wizard's Apprentice", "Scholar", "Minstrel", "Noble"], clergy: ["Acolyte", "Cult Initiate", "Orphaned", "Chirurgeon"],
  noble: ["Noble", "Scholar", "Minstrel"],
};

export const ROLE_BG_FIXED = { child: "Urchin", beggar: "Urchin", sailor: "Sailor", rower: "Sailor", physician: "Chirurgeon", apothecary: "Herbalist", cultist: "Cult Initiate", apprentice: "Wizard's Apprentice", bard: "Minstrel", actor: "Minstrel", noble: "Noble", knight: "Noble", guard: "Soldier", sergeant: "Soldier" };

/* ---- gear catalogue: [name, cost, slots]. slots 0 = free to carry ---- */

export const GEAR = {
  arrows: ["Arrows (20)", "1 gp", 1], bolts: ["Crossbow bolts (20)", "1 gp", 1], backpack: ["Backpack", "2 gp", 0], caltrops: ["Caltrops (bag)", "5 sp", 1],
  crowbar: ["Crowbar", "5 sp", 1], flask: ["Flask", "3 sp", 1], flint: ["Flint and steel", "5 sp", 1], grapple: ["Grappling hook", "1 gp", 1],
  spikes: ["Iron spikes (10)", "1 gp", 1], lantern: ["Lantern", "5 gp", 1], oil: ["Oil, flask", "5 sp", 1], rations: ["Rations (3)", "5 sp", 1],
  rope: ["Rope, 60'", "1 gp", 1], torch: ["Torch", "5 sp", 1], candles: ["Candles (12)", "1 gp", 1], chalk: ["Chalk (bag)", "1 gp", 1],
  charcoal: ["Charcoal sticks", "5 sp", 1], paper: ["Paper (a few sheets)", "5 sp", 1], ink: ["Writing ink, vial", "4 gp", 1], journal: ["Journal", "10 gp", 1],
  scrollcase: ["Map/scroll case", "1 gp", 1], wax: ["Sealing wax", "3 sp", 1], quill: ["Quill", "1 sp", 0], spellbook: ["Spellbook, travelling", "15 gp", 1],
  twine: ["Twine, 100'", "2 sp", 1], lockpoor: ["Lock, poor", "15 gp", 1], nails: ["Iron nails (20)", "2 sp", 1], bottle: ["Ceramic bottle", "4 sp", 1],
  waterskin: ["Waterskin", "1 gp", 1], mirror: ["Small metal mirror", "4 gp", 1], lens: ["Small lens", "5 gp", 0], blanket: ["Winter blanket", "1 gp", 1],
  whistle: ["Signal whistle", "1 gp", 0], marbles: ["Marbles (bag)", "5 sp", 1], bandages: ["Bandages (5)", "1 sp", 1], razor: ["Razor", "1 gp", 0],
  soap: ["Soap", "5 sp", 1], perfume: ["Perfume, vial", "3 gp", 0], holysymbol: ["Holy symbol", "class item", 0], holywater: ["Holy water, vial", "8 gp", 1],
  censer: ["Brass censer", "1 gp", 1], incense: ["Incense sticks", "1 gp ea", 1], beads: ["Prayer beads", "2 gp", 0], prayerbook: ["Prayer book", "15 gp", 1],
  altar: ["Altar symbol, simple", "5 sp", 1], tools: ["Thief's picks and tools", "class item", 0], disguise: ["Disguise kit", "15 gp", 1],
  deadhammer: ["Dead hammer (muffled)", "6 gp", 1], cutter: ["Glass cutter", "3 gp", 0], climbing: ["Climbing tools", "15 gp", 1],
  scribe: ["Simple scribe kit", "10 gp", 1], herbs: ["Herbalist's kit", "6 gp", 1], acid: ["Acid, flask", "6 gp", 1], substances: ["Common substances (vial)", "1 sp", 1],
  components: ["Uncommon components (vial)", "2 gp", 1], reagents: ["Rare reagents (vial)", "15 gp", 1], nightshade: ["Nightshade sprigs", "1 gp ea", 1],
  mandrake: ["Mandrake root", "2 gp", 0], refbook: ["Reference book", "3+ gp", 1], artisan: ["Artisan tools, basic", "3 gp", 2], hammer: ["Hammer", "2 gp", 1],
  chisel: ["Chisel", "1 gp", 1], net: ["Fishing net", "3 gp", 1], needle: ["Sewing needle and thread", "5 sp", 0], scissors: ["Scissors", "5 sp", 0],
  pick: ["Pick axe", "3 gp", 1], bucket: ["Bucket", "5 sp", 1], grease: ["Grease pot", "3 gp", 1], cards: ["Deck of cards", "3 gp", 0],
  dice: ["Knucklebones", "1 sp", 0], loaded: ["Loaded dice", "6 gp", 0], marked: ["Marked cards", "10 gp", 0], tarot: ["Tarot deck", "30 gp", 0],
  toy: ["A common toy", "2 cp", 0], flute: ["Flute", "3 gp", 0], drum: ["Hand drum", "1 gp", 1], lute: ["Lute", "15 gp", 1],
  ring: ["Simple ring", "6 sp", 0], earring: ["Earring", "1 gp", 0], locket: ["Locket", "15 gp", 0], brooch: ["Brooch", "6 gp", 0],
  specs: ["Spectacles", "6 gp", 0], monocle: ["Monocle", "3 gp", 0], signet: ["Signet ring", "3 gp", 0], ringcomp: ["Compartment ring", "4 gp", 0],
  hanky: ["Silk handkerchief", "1 sp", 0], moneybelt: ["Money belt", "3 gp", 1], keys: ["Ring of keys", "—", 0], prism: ["Prism", "6 gp", 0],
  manacles: ["Light chain (2 ft)", "4 gp", 1], cap: ["Woolen cap", "2 sp", 0], sack: ["Sack", "1 sp", 1], ledger: ["Ledger (blank book)", "8 gp", 1],
  wine: ["Bottle of wine", "3 sp", 1], ale: ["Stoppered jug of ale", "2 sp", 1], bread: ["Heel of bread", "2 cp", 0], cheese: ["Wedge of cheese", "4 cp", 0],
  sausage: ["Dried sausage", "5 cp", 0], apples: ["A few apples", "2 cp", 0], pipe: ["Pipe and tobacco", "5 sp", 0], snuff: ["Snuffbox", "2 gp", 0],
  whetstone: ["Whetstone", "1 sp", 0], cord: ["Cord, 3'", "1 sp", 0], stakes: ["Wooden stakes (3)", "6 cp", 1], silkrope: ["Silk rope, 50'", "6 gp", 1],
  pitons: ["Climbing pitons (5)", "1 gp", 1], bedroll: ["Bed roll", "4 gp", 1], hammock: ["Hammock", "3 gp", 1], hunthorn: ["Hunter's horn", "3 gp", 1],
  bell: ["Small bell", "1 gp", 0], block: ["Block and tackle", "3 gp", 1], chain: ["Light chain, 1 ft", "2 gp", 1], drill: ["Hand drill", "6 gp", 1],
  paint: ["Small pot of paint", "2 sp", 0], pliers: ["Pliers", "1 gp", 1], canvas: ["Canvas, a yard", "3 sp", 1], vials: ["Glass vials (10)", "10 gp", 1],
  steelflask: ["Steel flask", "2 gp", 1], silverflask: ["Silver flask", "15 gp", 1], wineskin: ["Wineskin", "1 gp", 1], magnet: ["Small magnet", "1 sp", 0],
  hourglass: ["Hourglass", "15 gp", 1], chess: ["Chess set", "3 gp", 1], juggling: ["Juggling balls", "2 gp", 1], fancytoy: ["A fancy toy", "5 gp", 0],
  ocarina: ["Ocarina", "3 gp", 0], tambourine: ["Tambourine", "5 gp", 1], horn: ["Brass horn", "25 gp", 2], harp: ["Small harp", "30 gp", 1],
  buckle: ["Decorative belt buckle", "6 gp", 0], comb: ["Hair comb", "3 gp", 0], braceletS: ["Silver bracelet", "6 gp", 0], braceletG: ["Gold bracelet", "15 gp", 0],
  circlet: ["Brass circlet", "1 gp", 0], earringJ: ["Jeweled earring", "20 gp", 0], fanS: ["Silk fan", "6 sp", 0], pendant: ["Pendant", "30 gp", 0],
  pin: ["Silver pin", "4 gp", 0], torc: ["Torc", "30 gp", 0], brush: ["Brush and comb", "6 sp", 0], soapP: ["Perfumed soap", "3 gp", 1],
  oilscent: ["Scented oil", "3 gp", 1], crutch: ["Crutches", "1 gp", 2], asperg: ["Aspergillum", "15 gp", 1], altarcase: ["Altar case", "10 gp", 1],
  belladonna: ["Belladonna sprigs", "3 sp", 0], wolfsbane: ["Wolfsbane sprigs", "6 sp", 0], slate: ["Slate board", "6 gp", 1], inkset: ["Coloured ink set", "12 gp", 1],
  quillknife: ["Quill knife", "1 gp", 0], mapkit: ["Map-maker's kit", "20 gp", 1], vellum: ["Fine vellum sheets", "2 gp", 0], chalkC: ["Coloured chalk", "2 gp", 1],
  bullseye: ["Bullseye lantern", "10 gp", 1], coalkeeper: ["Coal keeper", "1 gp", 1], tinder: ["Tinder box", "2 gp", 1], torches: ["Torches (6)", "3 sp", 1],
  lockgood: ["Good lock", "60 gp", 1], rods: ["Extending rods", "15 gp", 1], harness: ["Climbing harness", "10 gp", 1], lampblack: ["Pot of lampblack", "30 gp", 1],
  weaponbelt: ["Weapon belt", "1 gp", 1], baldric: ["Baldric", "6 sp", 1], bracers: ["Bracers", "5 sp", 0], gorget: ["Gorget", "2 gp", 1],
  sashS: ["Silk sash", "6 gp", 0], mirrorS: ["Small silver mirror", "15 gp", 1], candlesB: ["Beeswax", "3 sp", 1], holywaterX: ["Holy water (2 vials)", "16 gp", 1],
  acidX: ["Acid, flask", "6 gp", 1], oilX: ["Oil, 2 flasks", "1 gp", 1], caltropsX: ["Caltrops (bag)", "5 sp", 1], spikesX: ["Iron spikes (10)", "1 gp", 1],
};
// odds and ends by means — what ends up in pockets and packs regardless of job

export const BAND_EXTRAS = [
  ["bread", "apples", "cord", "stakes", "bottle", "blanket", "sack", "dice", "canvas", "crutch", "whetstone"],
  ["bread", "cheese", "sausage", "cord", "pipe", "dice", "ale", "whetstone", "torches", "tinder", "wineskin", "paint", "magnet"],
  ["cheese", "sausage", "wine", "pipe", "cards", "tinder", "steelflask", "brush", "bell", "ocarina", "whetstone", "comb", "bracers", "baldric"],
  ["wine", "snuff", "steelflask", "hourglass", "chess", "braceletS", "pin", "buckle", "comb", "soapP", "circlet", "lockgood", "mirror", "sashS"],
  ["silverflask", "pendant", "braceletG", "earringJ", "snuff", "torc", "fanS", "soapP", "oilscent", "mirrorS", "sashS", "hourglass", "inkset", "fancytoy"],
];

export const OUTFITS = [["Peasant clothes", "5 sp"], ["Common clothes", "3 gp"], ["Common clothes", "3 gp"], ["Courtier's clothes", "15 gp"], ["Noble's finery", "30 gp"]];

export const OUTFIT_BY_ROLE = { artisan: ["Artisan's clothes", "3 gp"], scholar: ["Scholar's robes", "3 gp"], mage: ["Scholar's robes", "3 gp"], apprentice: ["Scholar's robes", "3 gp"], priest: ["Clerical vestments", "6 gp"], acolyte: ["Clerical vestments", "6 gp"], bard: ["Entertainer's costume", "6 gp"], actor: ["Entertainer's costume", "6 gp"], pilgrim: ["Travel clothes", "4 gp"], sailor: ["Travel clothes", "4 gp"] };

/* what each job carries: w = weapons (id or [id, label]), a = armour options, sh = shield chance,
   g = always, x = pick some of these */

export const ROLE_KIT = {
  laborer: { w: ["club", ["club", "Crowbar (as club)"], ["handaxe", "Hatchet (as handaxe)"], ["spear", "Pitchfork (as spear)"], ["staff", "Pole (as staff)"]], a: ["none", "none", "leather"], g: [], x: ["crowbar", "rope", "hammer", "pick", "rations", "waterskin", "torch", "sack", "block", "canvas", "chain", "stakes", "nails"] },
  beggar: { w: [["club", "Broken bottle (as club)"], ["staff", "Walking stick (as staff)"]], a: ["none"], g: ["blanket"], x: ["bottle", "bandages", "dice", "sack", "candles"] },
  child: { w: ["sling", ["club", "Stick (as club)"]], a: ["none"], g: [], x: ["marbles", "chalk", "toy", "sack", "dice"] },
  drunk: { w: [["club", "Stool leg (as club)"], "dagger"], a: ["none"], g: ["flask"], x: ["bottle", "dice", "cards", "blanket"] },
  rower: { w: [["staff", "Oar (as staff)"], "dagger"], a: ["none", "leather"], g: ["rope"], x: ["net", "waterskin", "rations", "twine", "grease"] },
  sailor: { w: [["scimitar", "Cutlass (as scimitar)"], ["club", "Belaying pin (as club)"], "dagger", "handaxe", ["spear", "Boat hook (as spear)"], "crossbow"], a: ["none", "leather"], g: ["rope"], x: ["flask", "grapple", "waterskin", "twine", "dice", "pipe", "block", "hammock", "canvas", "wine"] },
  servant: { w: [["dagger", "Kitchen knife (as dagger)"]], a: ["none"], g: ["keys"], x: ["candles", "soap", "needle", "bucket", "scissors"] },
  vendor: { w: [["dagger", "Paring knife (as dagger)"], ["club", "Cudgel (as club)"], ["handaxe", "Meat cleaver (as handaxe)"]], a: ["none"], g: ["sack"], x: ["ledger", "rations", "bottle", "twine", "charcoal", "apples", "cheese", "bell", "canvas", "sausage"] },
  artisan: { w: [["club", "Mallet (as club)"], "dagger"], a: ["none", "leather"], g: ["artisan"], x: ["chisel", "needle", "hammer", "nails", "scissors"] },
  merchant: { w: ["dagger", "shortsword", "crossbow"], a: ["none", "leather"], g: ["ledger", "signet"], x: ["scribe", "scrollcase", "wax", "lockpoor", "moneybelt", "lens", "hourglass", "lockgood", "vellum", "wine"] },
  innkeep: { w: [["club", "Bung mallet (as club)"], "shortsword", ["crossbow", "Crossbow under the bar"], ["handaxe", "Cleaver (as handaxe)"]], a: ["none"], g: ["keys"], x: ["candles", "bottle", "flask", "ledger", "soap", "wine", "ale", "tinder", "bell"] },
  gambler: { w: ["dagger"], a: ["none", "leather"], g: ["cards"], x: ["loaded", "marked", "dice", "flask", "ringcomp"] },
  informant: { w: ["dagger"], a: ["none", "leather"], g: [], x: ["charcoal", "paper", "cap", "whistle", "mirror"] },
  cutpurse: { w: ["dagger", "dagger"], a: ["none", "leather"], g: ["tools"], x: ["caltrops", "sack", "cap", "chalk"] },
  thief: { w: ["shortsword", "dagger", "shortbow", "crossbow", "club"], a: ["leather"], g: ["tools", "rope"], x: ["grapple", "climbing", "deadhammer", "cutter", "caltrops", "oil", "chalk", "silkrope", "pitons", "harness", "rods", "lampblack", "bullseye", "magnet"] },
  fence: { w: ["dagger", "shortsword"], a: ["none", "leather"], g: ["ledger"], x: ["lockpoor", "lens", "scribe", "keys", "wax"] },
  smuggler: { w: ["shortsword", "crossbow", "dagger", "handaxe", ["spear", "Boat hook (as spear)"]], a: ["leather"], g: ["rope", "lantern"], x: ["oil", "grapple", "sack", "flask", "whistle", "canvas", "bullseye", "lockgood", "block", "silkrope"] },
  thug: { w: ["club", "mace", "shortsword", "dagger", "handaxe", "morningstar", ["whip", "Length of chain (as whip)"], ["club", "Brass knuckles (as club)"]], a: ["none", "leather", "leather"], g: [], x: ["caltrops", "flask", "manacles", "torch", "whetstone", "sack", "ale", "dice"] },
  masked: { w: [["scimitar", "Rapier (as scimitar)"], "dagger"], a: ["none", "leather"], g: ["disguise"], x: ["ringcomp", "perfume", "wax", "ink", "paper"] },
  assassin: { w: ["dagger", "shortsword", "crossbow", "shortbow"], a: ["leather"], g: ["tools", "nightshade"], x: ["disguise", "caltrops", "ringcomp", "rope", "oil", "belladonna", "wolfsbane", "vials", "silkrope", "lampblack"] },
  guard: { w: ["spear", "longsword", "crossbow", "pike", "mace", "shortsword", ["club", "Truncheon (as club)"]], a: ["leather", "chainmail", "chainmail"], sh: 0.6, g: ["whistle"], x: ["lantern", "torch", "manacles", "rations", "waterskin", "bell", "whetstone", "tinder", "bullseye"] },
  sergeant: { w: ["longsword", "mace", "crossbow"], a: ["chainmail", "chainmail", "plate"], sh: 0.7, g: ["whistle", "keys"], x: ["lantern", "manacles", "scrollcase", "rations"] },
  knight: { w: ["longsword", "bastard", "warhammer", "morningstar", "greatsword", "spear"], a: ["chainmail", "plate", "plate"], sh: 0.7, g: ["signet"], x: ["waterskin", "rations", "rope", "oil", "whetstone", "baldric", "gorget", "hunthorn", "bedroll"] },
  spy: { w: ["dagger", "shortsword", "crossbow"], a: ["none", "leather"], g: ["disguise"], x: ["ringcomp", "mirror", "paper", "ink", "wax", "tools"] },
  duelist: { w: [["scimitar", "Rapier (as scimitar)"], "longsword", "dagger"], a: ["none", "leather"], g: [], x: ["flask", "bandages", "perfume", "hanky"] },
  gladiator: { w: ["spear", "greataxe", "shortsword", "whip", "javelin", "morningstar", "handaxe", "greatsword"], a: ["leather", "leather", "chainmail"], sh: 0.5, g: ["bandages"], x: ["flask", "rations", "waterskin", "manacles", "bracers", "gorget", "whetstone", "oilscent"] },
  bard: { w: ["dagger", ["scimitar", "Rapier (as scimitar)"], "shortbow"], a: ["none", "leather"], g: [], x: ["lute", "flute", "drum", "ink", "paper", "perfume", "harp", "horn", "tambourine", "ocarina", "juggling", "wine"] },
  actor: { w: ["dagger"], a: ["none"], g: ["disguise"], x: ["perfume", "paper", "candles", "mirror", "flask"] },
  apprentice: { w: ["staff", "dagger"], a: ["none"], g: ["spellbook"], x: ["ink", "quill", "candles", "components", "paper", "chalk"] },
  mage: { w: ["staff", "dagger"], a: ["none"], g: ["spellbook", "components"], x: ["reagents", "prism", "ink", "candles", "refbook", "lens", "vials", "slate", "inkset", "mapkit", "acid", "hourglass", "magnet"] },
  scholar: { w: ["staff", "dagger"], a: ["none"], g: ["refbook"], x: ["scribe", "specs", "candles", "ink", "paper", "scrollcase"] },
  clerk: { w: ["dagger"], a: ["none"], g: ["scribe"], x: ["wax", "scrollcase", "specs", "ledger", "candles"] },
  barrister: { w: ["dagger"], a: ["none"], g: ["scrollcase", "refbook"], x: ["signet", "specs", "wax", "ink", "journal"] },
  acolyte: { w: ["club", "mace", "staff"], a: ["none", "leather"], g: ["holysymbol", "beads"], x: ["candles", "incense", "bandages", "prayerbook"] },
  priest: { w: ["mace", "warhammer", "longsword", "crossbow", "staff"], a: ["leather", "chainmail", "chainmail"], sh: 0.5, g: ["holysymbol", "prayerbook"], x: ["holywater", "censer", "incense", "bandages", "candles", "asperg", "altarcase", "beads", "holywaterX"] },
  cultist: { w: ["dagger", "club", ["dagger", "Sacrificial knife (as dagger)"]], a: ["none", "leather"], g: ["altar"], x: ["candles", "components", "incense", "nightshade", "chalk", "belladonna", "vials", "chalkC", "candlesB"] },
  charnelman: { w: ["staff", "club", "mace", ["spear", "Grave hook (as spear)"]], a: ["none", "leather"], g: ["holysymbol", "lantern"], x: ["oil", "bandages", "pick", "incense", "soap", "stakes", "chain", "canvas", "candles"] },
  mourner: { w: ["dagger"], a: ["none"], g: ["hanky"], x: ["candles", "beads", "locket", "flask"] },
  pilgrim: { w: ["staff"], a: ["none"], g: ["waterskin", "rations"], x: ["beads", "blanket", "holysymbol", "candles"] },
  physician: { w: ["dagger"], a: ["none"], g: ["bandages", "herbs"], x: ["razor", "needle", "substances", "specs", "soap"] },
  apothecary: { w: ["dagger"], a: ["none"], g: ["herbs", "substances"], x: ["components", "acid", "bottle", "mandrake", "nightshade"] },
  fortuneteller: { w: ["dagger"], a: ["none"], g: ["tarot"], x: ["incense", "candles", "prism", "perfume", "earring"] },
  noble: { w: ["longsword", ["scimitar", "Rapier (as scimitar)"], "dagger"], a: ["none", "none", "leather"], g: ["signet"], x: ["perfume", "locket", "hanky", "brooch", "monocle"] },
  druid: { w: ["staff", "club", "sling", "spear"], a: ["none", "leather"], g: ["herbs"], x: ["mandrake", "waterskin", "rations", "twine", "belladonna", "wolfsbane", "bedroll", "ocarina", "tinder"] },
};

/* Pocket change: what someone actually has on them, not their savings.
   [cp dice, sp dice, gp dice] as [count, sides]; savings text says where the rest is. */

export const WALLET = [
  { cp: [2, 4], sp: [0, 0], gp: [0, 0], saved: "Nothing put by." },
  { cp: [3, 6], sp: [1, 2], gp: [0, 0], saved: "A few coppers hidden under a floorboard." },
  { cp: [2, 6], sp: [1, 6], gp: [0, 0], saved: "A handful of silver kept at home." },
  { cp: [1, 6], sp: [2, 6], gp: [1, 3], saved: "Savings at home, or on account with a moneylender." },
  { cp: [0, 0], sp: [2, 6], gp: [2, 6], saved: "Their wealth is in property, accounts and a strongbox — not their purse." },
];

export const WALLET_BONUS = { merchant: { sp: [2, 6] }, fence: { gp: [1, 6] }, vendor: { cp: [3, 6] }, gambler: { sp: [2, 6] }, cutpurse: { sp: [1, 6] }, thief: { sp: [1, 6] }, innkeep: { sp: [1, 6] }, smuggler: { gp: [1, 4] } };

export const rollDice = ([n, s]) => { let t = 0; for (let i = 0; i < n; i++) t += d(s); return t; };

/* Build the Shadowdark sheet for an NPC. Everything the combat tab shows lives in npc.sd;
   the quick threat numbers (ac, hp, atkBonus, wName, wDmg, armorName) are copied from it
   so the Overview and the sheet always agree. */

