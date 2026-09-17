import React, { useState, useEffect, useRef } from "react";

/* ==============================================================
   MERIDIA OS  v13.0
   Referee's console for the City of Masks (Meridia) — Shadowdark RPG

   v13 = NPC FILES + SHADOWDARK SHEETS
   -----------------------------------
   * The NPC sheet is now a file with tabs: Overview · Identity · Talk ·
     Record · Trade (shopkeepers only) · Combat · Notes. EDIT edits
     the tab you're on. Card/Full and "show first" are gone — tabs
     replace them. Settings: which tab a file opens on, per mode.
   * Damage: type an amount and hit DMG (or Enter) / HEAL, or −1/−3/−5.
     Bloodied at half HP (morale reminder), Dying at 0 (death timer),
     then STABILISED or DEAD. Works on crowd rows without opening files.
     ROLL on any attack: d20 + bonus, damage rolled, crits double dice.
   * Gear pulls from the core list and the Equipment Emporium: job kits
     with improvised weapons, odds and ends by means, the odd sidearm.
   * Combat tab = a filled Shadowdark character sheet (layout of the
     printed sheet, drawn as a Meridia HUD): scores, HP now/max, AC, ancestry trait, class,
     title, background, deity, rolled talents, attacks with real core
     weapons, spells known, languages, 20 gear slots with slot costs,
     free-to-carry, and a purse of pocket change (savings noted, not
     carried). Classes: core four + Roustabout and Warlock (Western
     Reaches). LV0 people have no class, as in the core rules.
     buildSheet() writes npc.sd; syncThreat() copies AC/HP/attack out
     so every other view agrees. Old saves get a BUILD SHEET button.
   * Reactions use the Shadowdark table (2d6 + CHA). Pick who's
     talking; Party members now have a CHA modifier.
   * Rumours: the book decides where it can. Undecided ones are set by
     you, once, for the whole city.
   * Names: pools expanded with the book's lists and two-part surnames.
   * Crowds at a location are mostly people who belong there.
   * LOCK on origin, faith, situation, condition, record, rumours and
     places — RESCAN keeps locked sections.

   v12 = QA PASS + ONE NPC APP
   ---------------------------
   * All NPC tools are one app, NPCs, with tabs: Generate · Book ·
     Group · Saved · Settings. Filters, sheet sections, presets and
     crowd sizes moved from Config into NPCs → Settings. Old taskbar
     choices are migrated automatically.
   * Generator: filters that can't all be met now say so on the sheet
     (⚠) instead of being dropped silently. Level honours job, LV
     range AND tier together. Children get child-safe details
     throughout. fitsNpc()/repairDetails() re-roll any detail that
     contradicts the person (starving nobles, tall halflings, fences
     who won't touch stolen goods, lawful gang members, etc.).
   * Saves: never overwrites data it failed to read; waits half a
     second after typing; shows NOT SAVING if storage refuses.
     Saved list caps at 600 with a warning instead of silently
     deleting your oldest NPC.
   * Opening anyone you've saved opens the saved copy (book NPC edits
     used to vanish). LOCK now blocks the name reroll. Number fields
     can't become NaN. Templates no longer overwrite sheet sections.

   v11 = PHASE 0 FINISHED
   ----------------------
   * Global search: taskbar box, or press / or Ctrl+K anywhere. Finds
     saved NPCs by ANY field (including your notes, with the match
     shown), book NPCs, the current crowd, party, locations, factions,
     templates, and apps/settings. Esc clears.
   * Collapsible sheet sections (click a section's name). Remembered
     across NPCs and sessions. ▸ ALL / ▾ ALL on the sheet toolbar.
   * Config is the settings home: text size, left column width, party
     rail, card-or-full per mode, default section order, crowd and
     group sizes, nickname frequency, sound volume, and pages for
     filters, sheet sections, taskbar apps (per mode), presets, and
     your data (storage meter, backup, restore, reset).
   * Deletes are two-tap. v9 used confirm() pop-ups, which Claude
     artifacts block — DELETE ALL silently did nothing.
   * Filter resets, templates and presets only touch generator filters
     now; they can no longer knock out shell settings.

   v10 = NPC DETAIL POOLS OVERHAUL
   -------------------------------
   * Every descriptive pool (build, voice, scent, tells, masks, clothing,
     pockets, meals, vices, fears, wants, secrets, lies, levers, moods,
     what they're doing) rewritten broader and roughly 2-4x larger.
     Named shops, people and pigs are gone from these pools, so a repeat
     reads as ordinary instead of "that line again".
   * Hair, eyes, skin and marks are built from two parts (rollLooks):
     hundreds of combinations each. Kobolds get scales and horns;
     goblins and half-orcs get their own skin tones.
   * Street children get child-appropriate age, build, vice, wants,
     fears, secrets, levers and lies. Nobody LV3+ is "barely grown".
   * Conditions 18 -> 33, shop quirks 12 -> 28, shop refusals 7 -> 16,
     voice kits roughly tripled, epithets 27 -> 67, openers 5 -> 10.

   v9 = PHASE 0, SHELL REWORK (desktop)
   ------------------------------------
   * Desktop layout: three columns instead of one long stack.
       LEFT   the open app (lists, controls, results)
       CENTRE the NPC sheet — stays open while you browse the left
       RIGHT  party rail (Play mode, hideable)
     Each column scrolls on its own, so a list never scrolls away
     from the sheet you're reading.
   * Bottom taskbar: apps on the left, PREP/PLAY toggle, sound,
     in-world time, real clock bottom right.
   * Prep / Play. Which apps each mode shows lives in MODE_APPS —
     edit that one line to change it. Play also slims apps down:
     compact templates, card view by default, no delete/clear buttons.
   * Plain names. Labels only — internal ids (scan, named, muster,
     city, archive) and the storage key are unchanged, so v8 saves
     load as-is.
   * Search boxes on Book NPCs, Saved NPCs and Locations.
   * Full sheet flows into as many columns as the screen fits.

   Everything above the MAIN COMPONENT is v8's data and generator,
   untouched. Edit arrays there the same way as before.
   ============================================================== */

const C = {
  bg: "#06090B", panel: "rgba(0,229,255,0.035)", line: "#12363E", lineHot: "#1F6270",
  cyan: "#00E5FF", dim: "#6E9AA4", text: "#D8EEF2", gold: "#F0C33C",
  amber: "#FCEE0A", blood: "#E1173F", violet: "#9A6BFF", green: "#3BE08F",
};

/* ============================== DATA ============================== */

const DISTRICTS = {
  ged: { name: "Gedgarrin", cat: "University", cls: "Wealthy", guard: "1d6 rounds" },
  gut: { name: "Gutterwash", cat: "Low", cls: "Poor", guard: "3d6 rounds" },
  hig: { name: "High Harbor", cat: "High", cls: "Wealthy", guard: "1d4 rounds" },
  mon: { name: "Montmar Castle", cat: "Castle", cls: "Wealthy", guard: "1d4 rounds" },
  nin: { name: "Ninestones", cat: "Temple", cls: "Wealthy", guard: "1d6 rounds" },
  ril: { name: "Rilken Row", cat: "Slum", cls: "Poor", guard: "1 hour" },
  sil: { name: "Silvertop", cat: "Artisan", cls: "Working", guard: "1d6 rounds" },
  roo: { name: "The Rooks", cat: "Market", cls: "Working", guard: "1d6 rounds" },
};

const LOCATIONS = [
  { n: 1, name: "Flashing Steel", d: "ged", k: ["training"], p: ["Mareniel Siruul"], note: "elvish sword hall, quietly at war with Tiborian's" },
  { n: 2, name: "The Pale Toad", d: "ged", k: ["tavern", "college"], p: ["Teomin"], note: "student tavern; a lovesick wizard in the corner" },
  { n: 3, name: "Monveau Theater", d: "ged", k: ["theater"], p: ["Bertrand Gilliard"], note: "the new play is a summoning ritual and nobody knows" },
  { n: 4, name: "Gedgarrin", d: "ged", k: ["college"], p: ["Ivanculus", "Laudren Mallen"], note: "seven grey towers; a professor has sold out to the Shroud" },
  { n: 5, name: "The Round", d: "ged", k: ["theater"], p: ["Robirook's ghost"], note: "the grandest stage; something weeps in the rafters" },
  { n: 6, name: "Bardic College", d: "ged", k: ["college", "theater"], p: ["Chancellor Yeothin"], note: "Yeothin hires adventurers against the Shroud" },
  { n: 7, name: "Ashfall", d: "gut", k: ["temple", "graveyard"], p: ["Brother Igonus"], note: "the crematorium; 36 Charnel-Men keep the dead's secrets" },
  { n: 8, name: "The Bilge Pot", d: "gut", k: ["tavern", "criminal", "dock"], p: ["Shem Turley"], note: "guild and Barons are one insult from open war here" },
  { n: 9, name: "House of Seren", d: "gut", k: ["criminal", "training"], p: ["Guildmaster Seren"], note: "the Thieves' Guild behind a rotted facade" },
  { n: 10, name: "The Birdcage", d: "gut", k: ["arena", "criminal"], p: ["Rufius"], note: "illegal cage fights; the password is 'fried eggs'" },
  { n: 11, name: "River Rats", d: "gut", k: ["dock"], p: ["Mortimer Grund"], note: "five boys with the fastest skiffs, and a rumor killing them" },
  { n: 12, name: "Shieldstone Law", d: "gut", k: ["law"], p: ["Scribald Toderick"], note: "cheap barrister; a hanged client's friends want his head" },
  { n: 13, name: "The Duke's Bridge", d: "hig", k: ["bridge"], p: [], note: "gargoyle lions; where killers make their threats" },
  { n: 14, name: "The Royal Jeweler", d: "hig", k: ["jeweler", "shop"], p: ["Humphrey Hammergold"], note: "8+ renown at the door; the Heart of Sidar on display" },
  { n: 15, name: "Vanglare House", d: "hig", k: ["noble", "criminal"], p: ["Gaston di Vanglare", "Zara"], note: "cloaked callers leave before dawn" },
  { n: 16, name: "Zameek's Curios", d: "hig", k: ["shop"], p: ["Zameek"], note: "an unidentified Mirror of Mischief in the back" },
  { n: 17, name: "Club Levantis", d: "hig", k: ["tavern", "noble"], p: [], note: "faux-seedy; back door guards take 50 gp" },
  { n: 18, name: "The Grand Gate", d: "hig", k: ["gate", "law"], p: ["Remy", "Ulgrin"], note: "two young guards in over their heads on a poisoning plot" },
  { n: 19, name: "Garrison", d: "mon", k: ["law"], p: ["Lyonel Hirkos"], note: "400 guards above, the Donjon's forgotten depths below" },
  { n: 20, name: "Best Defense", d: "mon", k: ["law"], p: ["Gregor the Just", "Laurel the Lawful"], note: "they keep the Doom Book, and the guild knows" },
  { n: 21, name: "Montmar Castle", d: "mon", k: ["castle", "noble"], p: ["Duke Loren di Montmar"], note: "the Onyx Eye knows every hidden door" },
  { n: 22, name: "The Golden Marmot", d: "mon", k: ["tavern", "noble"], p: ["Emule Virdan"], note: "finest inn in the city; 8+ renown" },
  { n: 23, name: "The Silk Lion", d: "mon", k: ["tailor"], p: ["Cynthia Ulfric"], note: "the only masquerade costumes worth 500 gp" },
  { n: 24, name: "Tiborian's", d: "mon", k: ["training", "arena"], p: ["Tiborian"], note: "a retired gladiator nursing a grudge into a raid" },
  { n: 25, name: "The Stones", d: "nin", k: ["temple"], p: [], note: "nine dolmens; the Covenant scrap buried beneath" },
  { n: 26, name: "Temple of Kytheros", d: "nin", k: ["temple", "criminal"], p: [], note: "abandoned; She Who Weeps festers in the undercroft" },
  { n: 27, name: "Graveyard", d: "nin", k: ["graveyard", "criminal"], p: [], note: "the Ducal Tomb; Shroud meetings and secret lovers" },
  { n: 28, name: "Tree Grove", d: "nin", k: ["grove"], p: ["Mina"], note: "an old druid and an unnatural peace" },
  { n: 29, name: "Ivory Cathedral", d: "nin", k: ["temple"], p: ["High Paladin Evelyn"], note: "vast, distracted, and not watching Charity House" },
  { n: 30, name: "Madeera's Hearth", d: "nin", k: ["tavern", "charity"], p: ["Bolgrim Manymead"], note: "free stew for any beggar; the Beggars would kill for him" },
  { n: 31, name: "Safehouse", d: "ril", k: ["criminal"], p: ["Bastien Morlen"], note: "a gentle old man hiding criminals for his niece's sake" },
  { n: 32, name: "The Blind Pig", d: "ril", k: ["tavern", "fortune"], p: ["Terese"], note: "the pig answers one question a year and is never wrong" },
  { n: 33, name: "Bywater Barons", d: "ril", k: ["criminal", "dock"], p: ["Yargash the Tall"], note: "fifty angry dockhands undercutting the guild" },
  { n: 34, name: "Norley's Wares", d: "ril", k: ["shop", "criminal"], p: ["Norley Targon"], note: "the city's best fence; ask for the deal of the day" },
  { n: 35, name: "Charity House", d: "ril", k: ["charity"], p: ["Matron Bethel", "Sister Natalie"], note: "the soup is poisoned to keep the beds full" },
  { n: 36, name: "The Red Rat", d: "ril", k: ["tavern"], p: [], note: "a piper haunts the tunnels under the cellar" },
  { n: 37, name: "Pin & Drape", d: "sil", k: ["tailor", "criminal"], p: ["Thalmus Vicci"], note: "100 gp extra buys a uniform that passes inspection" },
  { n: 38, name: "The Bull's Pen", d: "sil", k: ["tavern", "arena"], p: ["Sariel Toril", "Vig Dorstin"], note: "paid bouts; a banned reaver circles outside" },
  { n: 39, name: "Golden Vault", d: "sil", k: ["bank", "criminal"], p: ["Iriel Lanowin"], note: "the banker is high in the Shroud" },
  { n: 40, name: "Mallin's Forge", d: "sil", k: ["smithy", "law"], p: ["Mallin Barton"], note: "the Onyx Eye works out of the cellar" },
  { n: 41, name: "Moonlight", d: "sil", k: ["jeweler", "shop"], p: ["Emeline Torberry"], note: "her silver is 1:20 to ward off lycanthropy" },
  { n: 42, name: "Cork & Pestle", d: "sil", k: ["apothecary", "shop"], p: ["Gomrey Gorn"], note: "the Gom-Bomb is nearly ready and nearly stable" },
  { n: 43, name: "Anvil Hall", d: "sil", k: ["smithy"], p: ["Homlin", "Ragrin"], note: "the brothers refuse the guild; Homlin is due a 'chat'" },
  { n: 44, name: "The Rusty Nail", d: "roo", k: ["shop", "market"], p: ["Babette Sykes"], note: "she judges you by how you treat Morkin and Tinny" },
  { n: 45, name: "Tough Nut", d: "roo", k: ["market", "shop"], p: ["Marjorie Wilkins", "Geramino"], note: "elvish teapots are the gift of the season" },
  { n: 46, name: "Madame Morda", d: "roo", k: ["fortune", "market"], p: ["Madame Morda"], note: "an expert act, and expensive" },
  { n: 47, name: "The Cookpot", d: "roo", k: ["market", "criminal"], p: ["Aron Reese"], note: "bloodroot behind the cookware, 20 gp a dip" },
  { n: 48, name: "The Daisy Chain", d: "roo", k: ["tavern", "market"], p: ["Ygraine Tareek"], note: "she pays beggar children a silver a chain" },
  { n: 49, name: "The Bend", d: "roo", k: ["arena", "market"], p: ["Darien di Morla", "Ol' Tangerine"], note: "pig racing; a plot to poison the champion" },
  { n: 50, name: "Rump Roast", d: "roo", k: ["market", "tavern"], p: ["Leland Putsky"], note: "eat a raw retch snail, win 20 gp and 2 renown" },
];

const ROLE_POOLS = {
  tavern: ["drunk", "servant", "innkeep", "thug", "cutpurse", "bard", "rower", "laborer", "gambler", "informant"],
  market: ["vendor", "cutpurse", "laborer", "smuggler", "informant", "child", "artisan", "drunk"],
  shop: ["vendor", "artisan", "scholar", "cutpurse", "servant", "informant"],
  criminal: ["thief", "thug", "assassin", "fence", "smuggler", "cutpurse", "masked"],
  law: ["guard", "sergeant", "barrister", "clerk", "spy", "knight"],
  temple: ["acolyte", "priest", "cultist", "charnelman", "beggar", "pilgrim"],
  graveyard: ["charnelman", "beggar", "cultist", "thief", "mourner"],
  college: ["apprentice", "scholar", "mage", "servant", "bard", "clerk"],
  theater: ["bard", "actor", "servant", "cutpurse", "noble", "scholar"],
  training: ["duelist", "gladiator", "apprentice", "noble", "servant"],
  arena: ["gladiator", "thug", "gambler", "drunk", "duelist", "vendor"],
  dock: ["rower", "laborer", "smuggler", "thug", "sailor", "child"],
  noble: ["noble", "servant", "knight", "bard", "spy", "masked"],
  castle: ["knight", "noble", "servant", "clerk", "spy", "guard"],
  bridge: ["guard", "beggar", "cutpurse", "rower", "laborer"],
  gate: ["guard", "sergeant", "laborer", "vendor", "smuggler"],
  bank: ["clerk", "guard", "merchant", "noble", "spy"],
  smithy: ["artisan", "laborer", "merchant", "guard"],
  tailor: ["artisan", "servant", "noble", "vendor"],
  jeweler: ["artisan", "merchant", "noble", "thief"],
  apothecary: ["apothecary", "scholar", "cultist", "vendor"],
  charity: ["beggar", "acolyte", "physician", "laborer", "child"],
  fortune: ["fortuneteller", "informant", "beggar", "vendor", "drunk"],
  grove: ["druid", "pilgrim", "beggar", "scholar"],
};

/* band: 0 destitute, 1 poor, 2 modest, 3 comfortable, 4 wealthy
   cat:  filter group  |  crim: 0 straight, 1 grey, 2 criminal  */
const ARCHETYPES = {
  laborer:      { label: "Dock laborer",        cat: "labor",   band: 1, crim: 0, lv: [0, 1], hd: 6, prime: "STR", ac: [["none", 10], ["padded scraps", 11]], wpn: [["cudgel", "1d4"], ["gaff hook", "1d6"]] },
  beggar:       { label: "Beggar",              cat: "labor",   band: 0, crim: 1, lv: [0, 1], hd: 4, prime: "WIS", ac: [["rags", 10]], wpn: [["broken bottle", "1d4"]] },
  child:        { label: "Street child",        cat: "labor",   band: 0, crim: 1, lv: [0, 1], hd: 4, prime: "DEX", ac: [["none", 11]], wpn: [["sharpened nail", "1d3"]] },
  drunk:        { label: "Sot",                 cat: "labor",   band: 1, crim: 1, lv: [0, 2], hd: 6, prime: "CON", ac: [["none", 10]], wpn: [["fists", "1d3"], ["stool leg", "1d4"]] },
  rower:        { label: "Canal rower",         cat: "labor",   band: 1, crim: 0, lv: [1, 2], hd: 6, prime: "DEX", ac: [["none", 11], ["leather vest", 12]], wpn: [["oar", "1d6"], ["boat knife", "1d4"]] },
  sailor:       { label: "Sailor",              cat: "labor",   band: 2, crim: 1, lv: [1, 3], hd: 6, prime: "DEX", ac: [["leather", 12]], wpn: [["cutlass", "1d6"], ["belaying pin", "1d4"]] },
  servant:      { label: "House servant",       cat: "labor",   band: 2, crim: 0, lv: [0, 2], hd: 6, prime: "WIS", ac: [["livery", 10]], wpn: [["kitchen knife", "1d4"]] },
  vendor:       { label: "Market vendor",       cat: "trade",   band: 2, crim: 0, lv: [0, 2], hd: 6, prime: "CHA", ac: [["apron", 10]], wpn: [["cleaver", "1d6"]] },
  artisan:      { label: "Artisan",             cat: "trade",   band: 2, crim: 0, lv: [1, 3], hd: 6, prime: "INT", ac: [["work leathers", 12]], wpn: [["hammer", "1d6"], ["shears", "1d4"]] },
  merchant:     { label: "Merchant",            cat: "trade",   band: 3, crim: 1, lv: [1, 3], hd: 6, prime: "CHA", ac: [["fine coat", 11]], wpn: [["dagger", "1d4"]] },
  innkeep:      { label: "Publican",            cat: "trade",   band: 3, crim: 1, lv: [1, 3], hd: 8, prime: "CHA", ac: [["none", 11]], wpn: [["bung mallet", "1d6"], ["old sword", "1d6"]] },
  gambler:      { label: "Gambler",             cat: "trade",   band: 2, crim: 1, lv: [1, 3], hd: 6, prime: "CHA", ac: [["none", 12]], wpn: [["hidden dagger", "1d4"]] },
  informant:    { label: "Informant",           cat: "crime",   band: 2, crim: 1, lv: [1, 4], hd: 6, prime: "CHA", ac: [["none", 12]], wpn: [["dagger", "1d4"]] },
  cutpurse:     { label: "Cutpurse",            cat: "crime",   band: 1, crim: 2, lv: [1, 3], hd: 6, prime: "DEX", ac: [["none", 12]], wpn: [["razor", "1d4"]] },
  thief:        { label: "Thief",               cat: "crime",   band: 3, crim: 2, lv: [2, 5], hd: 6, prime: "DEX", ac: [["leather", 12]], wpn: [["dagger", "1d4"], ["shortsword", "1d6"]] },
  fence:        { label: "Fence",               cat: "crime",   band: 3, crim: 2, lv: [2, 4], hd: 6, prime: "INT", ac: [["none", 11]], wpn: [["dagger", "1d4"]] },
  smuggler:     { label: "Smuggler",            cat: "crime",   band: 3, crim: 2, lv: [2, 4], hd: 6, prime: "DEX", ac: [["leather", 12]], wpn: [["shortsword", "1d6"], ["crossbow", "1d6"]] },
  thug:         { label: "Thug",                cat: "crime",   band: 1, crim: 2, lv: [1, 4], hd: 8, prime: "STR", ac: [["leather", 12], ["studded leather", 13]], wpn: [["club", "1d6"], ["shortsword", "1d6"]] },
  masked:       { label: "Masked (Shroud)",     cat: "crime",   band: 4, crim: 2, lv: [2, 6], hd: 6, prime: "CHA", ac: [["black leathers", 13]], wpn: [["poisoned dagger", "1d4"], ["rapier", "1d6"]] },
  assassin:     { label: "Assassin",            cat: "crime",   band: 4, crim: 2, lv: [4, 8], hd: 6, prime: "DEX", ac: [["dark leather", 14]], wpn: [["poisoned dagger", "1d4"], ["garrote", "1d6"]] },
  guard:        { label: "City Guard",          cat: "martial", band: 2, crim: 1, lv: [1, 3], hd: 8, prime: "STR", ac: [["chainmail + shield", 15]], wpn: [["spear", "1d6"], ["shortsword", "1d6"]] },
  sergeant:     { label: "Guard sergeant",      cat: "martial", band: 3, crim: 1, lv: [3, 5], hd: 8, prime: "STR", ac: [["chainmail + shield", 15]], wpn: [["longsword", "1d8"]] },
  knight:       { label: "Knight",              cat: "martial", band: 4, crim: 0, lv: [4, 8], hd: 8, prime: "STR", ac: [["plate + shield", 17]], wpn: [["longsword", "1d8"], ["lance", "1d10"]] },
  spy:          { label: "Onyx Eye agent",      cat: "martial", band: 3, crim: 1, lv: [3, 6], hd: 6, prime: "CHA", ac: [["none", 13]], wpn: [["dagger", "1d4"], ["hand crossbow", "1d4"]] },
  duelist:      { label: "Duelist",             cat: "martial", band: 3, crim: 1, lv: [2, 6], hd: 6, prime: "DEX", ac: [["none", 13], ["leather", 14]], wpn: [["rapier", "1d8"]] },
  gladiator:    { label: "Pit fighter",         cat: "martial", band: 2, crim: 1, lv: [2, 5], hd: 8, prime: "STR", ac: [["scraps + buckler", 14]], wpn: [["trident", "1d8"], ["greatclub", "1d8"]] },
  bard:         { label: "Bard",                cat: "arcane",  band: 3, crim: 1, lv: [1, 6], hd: 6, prime: "CHA", ac: [["none", 11], ["fine leather", 12]], wpn: [["rapier", "1d8"], ["dagger", "1d4"]] },
  actor:        { label: "Player of the stage", cat: "arcane",  band: 2, crim: 1, lv: [1, 3], hd: 6, prime: "CHA", ac: [["costume", 10]], wpn: [["stage dagger (real)", "1d4"]] },
  apprentice:   { label: "Apprentice",          cat: "arcane",  band: 2, crim: 0, lv: [1, 2], hd: 4, prime: "INT", ac: [["robes", 10]], wpn: [["staff", "1d4"], ["magic missile", "1d4"]] },
  mage:         { label: "Mage",                cat: "arcane",  band: 4, crim: 1, lv: [4, 9], hd: 4, prime: "INT", ac: [["robes", 11]], wpn: [["staff", "1d4"], ["spell", "2d6"]] },
  scholar:      { label: "Scholar",             cat: "arcane",  band: 3, crim: 0, lv: [1, 4], hd: 4, prime: "INT", ac: [["robes", 10]], wpn: [["walking stick", "1d4"]] },
  clerk:        { label: "Clerk",               cat: "trade",   band: 2, crim: 1, lv: [0, 2], hd: 4, prime: "INT", ac: [["none", 10]], wpn: [["letter knife", "1d4"]] },
  barrister:    { label: "Barrister",           cat: "trade",   band: 4, crim: 1, lv: [2, 4], hd: 6, prime: "CHA", ac: [["fine robes", 11]], wpn: [["cane sword", "1d6"]] },
  acolyte:      { label: "Acolyte",             cat: "clergy",  band: 2, crim: 0, lv: [1, 2], hd: 6, prime: "WIS", ac: [["vestments", 11]], wpn: [["mace", "1d6"]] },
  priest:       { label: "Priest",              cat: "clergy",  band: 3, crim: 0, lv: [3, 6], hd: 6, prime: "WIS", ac: [["vestments + shield", 13]], wpn: [["mace", "1d6"]] },
  cultist:      { label: "Cultist",             cat: "clergy",  band: 1, crim: 2, lv: [1, 4], hd: 6, prime: "WIS", ac: [["hooded robes", 12]], wpn: [["ritual knife", "1d4"]] },
  charnelman:   { label: "Charnel-Man",         cat: "clergy",  band: 1, crim: 1, lv: [2, 4], hd: 6, prime: "CON", ac: [["ash-caked cloak", 12]], wpn: [["corpse hook", "1d6"], ["shovel", "1d6"]] },
  mourner:      { label: "Mourner",             cat: "clergy",  band: 2, crim: 0, lv: [0, 2], hd: 6, prime: "WIS", ac: [["blacks", 10]], wpn: [["grief", "1d4"]] },
  pilgrim:      { label: "Pilgrim",             cat: "clergy",  band: 1, crim: 0, lv: [0, 2], hd: 6, prime: "WIS", ac: [["travel cloak", 11]], wpn: [["staff", "1d4"]] },
  physician:    { label: "Physician",           cat: "trade",   band: 3, crim: 1, lv: [2, 4], hd: 4, prime: "INT", ac: [["stained apron", 10]], wpn: [["bone saw", "1d6"]] },
  apothecary:   { label: "Apothecary",          cat: "trade",   band: 3, crim: 1, lv: [2, 4], hd: 4, prime: "INT", ac: [["singed apron", 10]], wpn: [["flask", "1d6"]] },
  fortuneteller:{ label: "Fortune-teller",      cat: "trade",   band: 2, crim: 1, lv: [1, 4], hd: 4, prime: "CHA", ac: [["shawls", 10]], wpn: [["hidden stiletto", "1d4"]] },
  noble:        { label: "Noble",               cat: "noble",   band: 4, crim: 1, lv: [1, 5], hd: 6, prime: "CHA", ac: [["courtly finery", 11], ["dueling leathers", 13]], wpn: [["rapier", "1d8"]] },
  druid:        { label: "Grove-keeper",        cat: "clergy",  band: 0, crim: 0, lv: [3, 7], hd: 6, prime: "WIS", ac: [["bark and moss", 12]], wpn: [["staff", "1d4"], ["thorn lash", "1d6"]] },
};

const CATS = { any: "Any work", labor: "Labor & service", trade: "Trade & craft", crime: "Criminal", martial: "Martial & law", arcane: "Arts & arcane", clergy: "Clergy & dead", noble: "Nobility" };

const NAMES = {
  human: {
    m: ["Aron", "Bertrand", "Darien", "Emule", "Gaston", "Hercule", "Leland", "Lyonel", "Mortimer", "Norley", "Scribald", "Thalmus", "Amril", "Gomrey", "Mallin", "Teomin", "Bastien", "Loren", "Arnor", "Mortik", "Arlin", "Jesper", "Icarus", "Hirill", "Warner", "Grendin", "Corvin", "Pietro", "Ansel", "Renzo", "Silvio", "Tomas", "Ottone", "Dorien", "Falco", "Marzio", "Ceril", "Bartolo"],
    f: ["Babette", "Bethel", "Cynthia", "Emeline", "Evelyn", "Jasmina", "Marjorie", "Mireela", "Natalie", "Persephone", "Sariel", "Terese", "Trileena", "Zara", "Laurel", "Agatha", "Heidi", "Merriweather", "Kilene", "Cindri", "Nerida", "Ottavia", "Bianca", "Rosalind", "Lucia", "Vittoria", "Serafine", "Domna", "Calla", "Marisol", "Perella", "Tassia"],
    s: ["Acker", "Bombart", "Bower", "Cimrin", "Gartini", "Gilliard", "Gorn", "Grund", "Hirkos", "Lefarin", "Marsall", "Matvoy", "Morlen", "Putsky", "Rasmos", "Reese", "Stump", "Sykes", "Targon", "Toderick", "Torberry", "Toril", "Trieste", "Turley", "Ulfric", "Vicci", "Wilkins", "Yalk", "Barton", "Scrattigan", "Quentin", "Savoy", "Tovin", "Corvetti", "Anselmi", "Draveska", "Mirello", "Vanti"],
    noble: ["di Montmar", "di Vanglare", "di Morla", "di Finroy", "di Corveau", "di Serrano", "di Pallanto", "di Rexell"],
  },
  dwarf: { m: ["Bolgrim", "Homlin", "Ragrin", "Dundrin", "Humphrey", "Thorbek", "Garrin", "Durnik", "Brolgan", "Vask"], f: ["Hilda", "Bruna", "Marnesh", "Torvi", "Ingra", "Dagna", "Solva"], s: ["Hammergold", "Manymead", "Stouthelm", "Moremack", "Ironvein", "Coppervane", "Deepkettle", "Anvilbright", "Slagfoot"] },
  elf: { m: ["Xytarin", "Aeril", "Thandor", "Caelin", "Ysiel", "Maravel", "Ondrien"], f: ["Mareniel", "Iriel", "Lethrin", "Sylvane", "Nimriel", "Aethra", "Vaelis"], s: ["Siruul", "Lanowin", "Masiope", "Quomeniel", "Ilvareth", "Saerandel", "Thennovar"] },
  halfling: { m: ["Zameek", "Bombot", "Miggsy", "Reginald", "Vig", "Pellin", "Corbo", "Tuck"], f: ["Irene", "Pippa", "Marigold", "Nessa", "Clovie", "Bettin"], s: ["Riggsy", "Billows", "Goatgallop", "Cotton", "Trimby", "Underbough", "Puddleway", "Nettlecap"] },
  halforc: { m: ["Yargash", "Rufius", "Grukk", "Marrek", "Ozrin", "Bramm"], f: ["Ygraine", "Sethka", "Vorra", "Ghelda", "Ruka"], s: ["Tareek", "Sevreck", "Gorezak", "Ironjaw", "Dockbreak", "Vorn"] },
  goblin: { m: ["Virmeek", "Snigg", "Pobble", "Kretch", "Milo"], f: ["Nix", "Grissel", "Weeb", "Tanko"], s: ["Glob", "Scrattle", "Winklepin", "Threadneedle", "Mudcrack"] },
};

const ANCESTRY_WEIGHTS = [["human", 66], ["dwarf", 10], ["halfling", 9], ["elf", 8], ["halforc", 5], ["goblin", 2]];

/* --- LODGING: the v1 bug, fixed twice over. Wealth band picks the
   table, and `cat` gates entries that only make sense for certain
   work — a fence does not get college quarters, a scholar does not
   get a bolt-hole with three ways out. Entries with no `cat` are
   open to anyone in that band. --- */
const LODGING = [
  [ // 0 destitute
    { t: "a doorway on the Rilken Row side of the canal" },
    { t: "the tunnels under The Red Rat" },
    { t: "a bed at Charity House when there's one free" },
    { t: "a nest of sacking in a Gutterwash alley" },
    { t: "under the low arches of the dock bridges" },
    { t: "the floor of the old Temple of Kytheros", cat: ["clergy"] },
    { t: "a cell at Ashfall that smells of the ovens", cat: ["clergy"] },
  ],
  [ // 1 poor
    { t: "a shared tenement room in Rilken Row, four to the floor" },
    { t: "a damp cellar off a Gutterwash alley" },
    { t: "a hammock strung in a dock warehouse", cat: ["labor", "crime"] },
    { t: "a rented corner behind a Rilken Row laundry" },
    { t: "a room over a Gutterwash tripe-shop, rent two weeks late" },
    { t: "a bunk in the Barons' warehouse, whoever gets there first", cat: ["crime", "labor"] },
    { t: "a cot in the Garrison barracks", cat: ["martial"] },
  ],
  [ // 2 modest
    { t: "a rented room above a shop in Silvertop" },
    { t: "two rooms over a stall-holder's yard in The Rooks" },
    { t: "a garret in Gedgarrin, let cheap to students", cat: ["arcane"] },
    { t: "a back room at a Silvertop workshop, part of the wage", cat: ["trade", "labor"] },
    { t: "a narrow walk-up off the Rooks market square" },
    { t: "guard quarters near the Grand Gate", cat: ["martial"] },
    { t: "a cell behind the Ivory Cathedral", cat: ["clergy"] },
    { t: "a room rented under a name that isn't theirs, in The Rooks", cat: ["crime"] },
  ],
  [ // 3 comfortable
    { t: "a narrow canal house in Silvertop with its own door" },
    { t: "good rooms above the market in The Rooks" },
    { t: "a tidy house on a quiet Gedgarrin street" },
    { t: "college quarters at Gedgarrin", cat: ["arcane"] },
    { t: "a rented floor in a Ninestones townhouse" },
    { t: "rooms over a Rooks warehouse with three ways out", cat: ["crime"] },
    { t: "a Silvertop house paid for in cash, under a false name", cat: ["crime"] },
    { t: "officer's quarters at the Garrison", cat: ["martial"] },
    { t: "a priest's house beside the Ninestones", cat: ["clergy"] },
  ],
  [ // 4 wealthy
    { t: "a manor house in High Harbor with a view of the castle", cat: ["noble", "trade", "martial"] },
    { t: "apartments in the Montmar Castle district, near the good baths", cat: ["noble", "trade", "martial", "arcane"] },
    { t: "a canal palazzo in High Harbor, staff and all", cat: ["noble"] },
    { t: "a permanent suite at The Golden Marmot", cat: ["noble", "trade"] },
    { t: "an old family house in High Harbor, better outside than in", cat: ["noble"] },
    { t: "a fine Silvertop house nobody can connect to their name", cat: ["crime"] },
    { t: "three separate rooms across three districts, never two nights running", cat: ["crime"] },
    { t: "high rooms at Gedgarrin with a locked stair", cat: ["arcane"] },
    { t: "a handsome townhouse in Ninestones, bought outright" },
    { t: "the whole upper floor of a Silvertop canal house" },
  ],
];

function pickLodging(band, cat) {
  const table = LODGING[band];
  const fits = table.filter((e) => !e.cat || e.cat.includes(cat));
  if (fits.length) return pick(fits).t;
  const open = table.filter((e) => !e.cat);
  return pick(open.length ? open : table).t;
}

/* --- CRIMINAL RECORD --- */
const CRIMES_MINOR = [
  "petty theft — lifted a purse at {market}", "petty theft — stripped fittings off a moored skiff",
  "disruptive public behavior — a brawl that spilled out of {tavern}", "disruptive public behavior — drunk and shouting at a funeral procession",
  "minor conspiracy — passed messages for someone who paid in silver", "minor blackmail — sat on a letter and named a price",
  "petty theft — took {gp} gp of stock and called it wages owed", "murder of a commoner — a knife fight nobody's calling murder",
  "disruptive public behavior — cut a mask off a noble's face at a masquerade",
];
const CRIMES_MAJOR = [
  "major theft — {gp} gp in goods out of a Silvertop strongroom", "arson — a warehouse on the Gutterwash waterfront",
  "murder of a merchant — found in the canal three days later", "murder of a City Guard — still unsolved, officially",
  "kidnapping — a merchant's son, returned unharmed, never reported", "treason — carried Shroud correspondence and read it",
  "major blackmail — a magistrate, and it worked", "major theft — a reliquary lifted out of a Ninestones chapel",
  "depravity — whatever happened at that house in Rilken Row",
];
const RECORD_STATES = [
  { id: "clean", label: "No record", tone: "green" },
  { id: "suspect", label: "Suspected, unproven", tone: "gold" },
  { id: "pursued", label: "Under active pursuit", tone: "blood" },
  { id: "served", label: "Convicted and served", tone: "dim" },
  { id: "bought", label: "Convicted, bought off", tone: "violet" },
  { id: "wanted", label: "Wanted — major crime", tone: "blood" },
  { id: "exiled", label: "Exiled, and back anyway", tone: "blood" },
];
const PUNISH_MINOR = ["a week in the stocks on the Rooks square", "twenty lashes at the Garrison gate", "fines they're still paying off", "a month of forced labor clearing canal silt", "made to return the goods in front of a crowd"];
const PUNISH_MAJOR = ["four years in the Duke's Donjon", "eleven years in the Donjon; came out different", "a public whipping and branding at the Grand Gate", "sentenced to hang, and it was commuted — nobody says why"];

/* --- CONDITIONS: right-now states with teeth ---
   Names referenced by code: Starving, Bloodroot high/withdrawal,
   Newly flush, Blessed this week. Don't rename those four. */
const CONDITIONS = [
  { n: "Bloodroot high", t: "violet", m: "ADV on spellcasting checks today. Taking 1d6 CON damage that lingers a month." },
  { n: "Bloodroot withdrawal", t: "violet", m: "DISADV on all checks. Will do nearly anything for 20 gp." },
  { n: "Rat Plague, early", t: "blood", m: "Hiding a cough. -2 reactions in wealthy districts if it's noticed." },
  { n: "Recently beaten", t: "blood", m: "At half HP. DISADV on STR and DEX checks until they rest." },
  { n: "Drunk", t: "gold", m: "DISADV on DEX checks, ADV on fear. Talks too much." },
  { n: "Hungover", t: "gold", m: "DISADV on WIS checks. Loud noises make them snap." },
  { n: "Starving", t: "gold", m: "DISADV on CON checks. A hot meal buys real goodwill." },
  { n: "Being followed", t: "blood", m: "Someone is two streets back. They know, and don't know who." },
  { n: "In disguise", t: "cyan", m: "Good work. ADV on checks to pass as someone else. Panics if it slips." },
  { n: "Sleepless", t: "dim", m: "Third night without proper sleep. DISADV on WIS checks." },
  { n: "Slowly poisoned", t: "violet", m: "Something in their food or water. Losing 1 CON a week and blames the damp." },
  { n: "Armed above their station", t: "gold", m: "Carrying a weapon they shouldn't own. Arrest risk if searched." },
  { n: "Owes the wrong people", t: "blood", m: "Has {days} days to pay {gp} gp. Counting them." },
  { n: "Grieving", t: "dim", m: "Buried someone this month. Reckless, and doesn't care who notices." },
  { n: "Newly flush", t: "green", m: "Came into {gp} gp recently and is spending it where people can see." },
  { n: "Wearing a lucky charm", t: "cyan", m: "Believes it protects them absolutely. Takes ADV on morale checks while wearing it; shaken if it's taken." },
  { n: "Masked indoors", t: "violet", m: "Hasn't taken the mask off and won't be asked to." },
  { n: "Fevered", t: "blood", m: "Burning up and upright anyway. DISADV on INT checks." },
  { n: "Blessed this week", t: "green", m: "Fresh from temple rites. Calm, certain, and hard to intimidate." },
  { n: "Injured hand", t: "blood", m: "Bandaged and useless. DISADV on anything needing both hands." },
  { n: "Soaked through", t: "dim", m: "Fell in, or was pushed. Cold, miserable, and wants to be somewhere warm." },
  { n: "Head cold", t: "dim", m: "Sneezing, sniffing. DISADV on stealth. Short-tempered." },
  { n: "Lovesick", t: "green", m: "Distracted by someone. DISADV on WIS checks; easy to talk into things if you mention them." },
  { n: "Just robbed", t: "blood", m: "Lost their purse within the hour. Suspicious of everyone, and asking questions." },
  { n: "Hiding from someone", t: "violet", m: "Won't stand in the open. Pays well for a back way out." },
  { n: "Carrying something valuable", t: "gold", m: "Worth {gp} gp, and not theirs. Guarded, jumpy, and not stopping to chat." },
  { n: "Holding a grudge", t: "blood", m: "Wronged by {name}. Hostile to anyone who seems to be on that side." },
  { n: "Just humiliated", t: "gold", m: "Made a fool of in public today. Quick to anger; ADV on checks to goad them." },
  { n: "Believes they're cursed", t: "violet", m: "Convinced of it. Will pay for anything that sounds like a cure." },
  { n: "Just paid", t: "green", m: "Wages in pocket. Generous for a day, maybe two." },
  { n: "Recently promoted", t: "green", m: "Proud and anxious to prove it. Sticks closely to the rules." },
  { n: "On an urgent errand", t: "cyan", m: "Has somewhere to be. Every minute you keep them costs goodwill." },
  { n: "Nursing a wound", t: "blood", m: "At half HP, hiding it. A healer's attention earns a real favour." },
];

/* --- SITUATIONS: what is happening to them right now --- */
const SIT_GENERAL = [
  { s: "Lost {gp} gp at {arena} an hour ago. The man they lost it to is outside.", a: "Cover the debt, or walk them out past him.", c: "tonight" },
  { s: "Was meant to deliver a wrapped bundle to {crim} before dark. Still has it. Hasn't looked inside.", a: "Deliver it for them, or tell them what's in it.", c: "before dawn" },
  { s: "Their name is written on a list someone dropped at {loc}. They've read it.", a: "Find out whose list it is.", c: "days" },
  { s: "Is meeting a stranger here in minutes. They have a password and nothing else.", a: "Be here when it happens.", c: "minutes" },
  { s: "Can't go home. {faction} has someone sitting on the street.", a: "A bed for the night, anywhere else.", c: "tonight" },
  { s: "Just realized the purse they lifted belongs to someone with renown and a long memory.", a: "Put it back without being seen.", c: "hours" },
  { s: "Is trying to sell something they can't explain owning, and the buyer is asking.", a: "Buy it, no questions.", c: "now" },
  { s: "Their sibling didn't come home from {loc} last night.", a: "Help look, before the Charnel-Men do.", c: "days" },
  { s: "Was dismissed this morning and hasn't told the family yet.", a: "Work. Any work.", c: "weeks" },
  { s: "Waiting on word about a child at {charity}. Has been waiting since yesterday.", a: "A physician who isn't free, or the money for one.", c: "days" },
  { s: "Owes {name} a favor and it's just been called in. It's worse than expected.", a: "Take the favor off their hands.", c: "days" },
  { s: "Saw something at {loc} they weren't meant to and is deciding whether to sell it.", a: "Outbid whoever else is asking.", c: "hours" },
];
const SIT_BY_FACTION = {
  guild: [
    { s: "Has orders to lean on {name} this week and does not want to.", a: "Make the problem go away without blood.", c: "days" },
    { s: "Is {days} days late on a {gp} gp debt to the House. They are counting.", a: "Coin, or a job that clears it.", c: "days" },
    { s: "Was told to watch this door and report who came through. You came through.", a: "A reason to write down a different name.", c: "now" },
    { s: "Skimmed from the last job and is waiting to learn if anyone noticed.", a: "Nothing. They want to be left alone. Loudly.", c: "days" },
  ],
  shroud: [
    { s: "Carries a summons to the graveyard at midnight and does not want to go alone.", a: "Come with them, masked.", c: "tonight" },
    { s: "Was given a name to ruin before the season turns. It's someone they like.", a: "A way to fake the ruin convincingly.", c: "weeks" },
    { s: "Lost their marked token and is quietly, completely panicking.", a: "Find it. Before anyone learns it's missing.", c: "hours" },
  ],
  duke: [
    { s: "Is off duty, out of uniform, looking for someone it isn't their place to look for.", a: "Eyes in a district they can't walk into.", c: "days" },
    { s: "Took money last week and now can't refuse the next ask.", a: "Leverage on whoever paid.", c: "weeks" },
    { s: "Is two men short on patrol and hasn't told the sergeant.", a: "Bodies, for one night, who look the part.", c: "tonight" },
  ],
  onyx: [
    { s: "Their contact missed two drops running. That has only ever meant one thing.", a: "Walk into {crim} as someone nobody's watching.", c: "days" },
    { s: "Has a name inside the guild and no way to confirm it without exposure.", a: "Confirm it. Quietly.", c: "weeks" },
  ],
  barons: [
    { s: "Is scouting which merchants still pay the guild, and writing it down badly.", a: "Nothing — but they'll talk to anyone who buys.", c: "days" },
    { s: "Was told to start a fight here tonight and make it look like it started itself.", a: "A fight. Preferably yours.", c: "tonight" },
    { s: "Took a beating from guild men on the docks and is not reporting it upward.", a: "The names of the men who did it.", c: "days" },
  ],
  beggars: [
    { s: "Knows exactly where a body went and is deciding what the knowing is worth.", a: "A price, and to be taken seriously.", c: "days" },
    { s: "Hasn't eaten in two days and is well past pride.", a: "Food. Then they'll talk for an hour.", c: "now" },
    { s: "Was moved on from their corner by someone with a badge and a grudge.", a: "Their corner back.", c: "days" },
  ],
  charnel: [
    { s: "Took something off a body that the family will come looking for.", a: "A fence who won't ask. Or absolution.", c: "days" },
    { s: "The dead told them a name last week. It was a name they knew.", a: "Someone to tell, who won't laugh.", c: "weeks" },
  ],
  weeps: [
    { s: "Was sent to find the sick and bring them in. They've stopped believing in it.", a: "A way out of the undercroft that doesn't end in the canal.", c: "days" },
    { s: "Is carrying the sickness deliberately and hasn't decided where to take it.", a: "To be told they matter.", c: "hours" },
  ],
  rowers: [
    { s: "Pulled something out of the canal last night and hid it in the boat.", a: "Someone to open it with them.", c: "hours" },
    { s: "A rival is spreading it that their skiff carries plague. Fares have dried up.", a: "The rumor killed, publicly.", c: "weeks" },
  ],
  bardic: [
    { s: "Their piece debuts at {loc} and the patron has just pulled out.", a: "A patron, or a scandal big enough to sell tickets.", c: "weeks" },
    { s: "Was asked by the college to carry a message they've been told not to read.", a: "An escort to somewhere dangerous.", c: "days" },
  ],
  gedgarrin: [
    { s: "Lost a component worth {gp} gp and the master hasn't noticed yet.", a: "A replacement by morning.", c: "hours" },
    { s: "Read something in the library they were not cleared for, and can't unread it.", a: "Someone outside the college to tell.", c: "weeks" },
  ],
  jeweled: [
    { s: "Was told to test whether you're worth approaching. This is the test.", a: "Handle yourselves well in front of them.", c: "now" },
    { s: "Has an initiation to sponsor and nobody worth sponsoring.", a: "A candidate. Or a convincing lie about one.", c: "weeks" },
  ],
  none: [],
};

const NAMED = ["Guildmaster Seren", "Lyonel Hirkos", "Norley Targon", "Shem Turley", "Yargash the Tall", "Iriel Lanowin", "Matron Bethel", "Bolgrim Manymead", "Thalmus Vicci", "Babette Sykes", "Madame Morda", "Gomrey Gorn", "Scribald Toderick", "Bastien Morlen", "Terese", "Emule Virdan", "Cynthia Ulfric", "Tiborian", "Mareniel Siruul", "Chancellor Yeothin", "Brother Igonus", "Gaston di Vanglare", "Humphrey Hammergold", "Zameek", "Aron Reese", "Marjorie Wilkins", "Leland Putsky", "Ygraine Tareek", "Mallin Barton", "Darien di Morla", "Mortimer Grund"];

/* --- DESCRIPTIVE POOLS (v10 overhaul) ----------------------------------
   Broad on purpose: no named shops, people or pigs, so a repeat reads as
   ordinary rather than "that line again". Grammar each pool must keep:
     build / mood / voice   adjective phrase ("Someone ___")
     doing_*                -ing phrase ("they're ___")
     mark / pocket / maskFace / meal / vice / fear / lever  noun phrase
     smell                  noun phrase, no "of"
     tic / secret / lie / break   verb phrase, third person
   Hair, eyes and skin are built from two parts — see rollLooks().
   ---------------------------------------------------------------------- */
const T = {
  build: ["rail-thin", "wiry", "stocky", "broad through the shoulders", "soft around the middle", "gaunt", "compact and quick", "heavy-boned", "stooped", "unusually tall", "short and dense", "sinewy",
    "barrel-chested", "narrow and bird-like", "thick-necked", "long-limbed and awkward", "round-faced and solid", "lean as a whip", "hunched from years of work", "big and careful with it",
    "slight enough to miss in a crowd", "top-heavy", "bony at every joint", "well-fed and pleased about it", "hard and weathered", "slope-shouldered", "stiffly straight-backed", "built low to the ground",
    "gone soft after a harder life", "heavy-armed and light-footed"],
  age: ["barely grown", "young", "young", "in their prime", "in their prime", "middle-aged", "middle-aged", "past their prime", "old", "very old"],
  hairColor: ["black", "jet black", "dark brown", "mid brown", "light brown", "chestnut", "auburn", "copper-red", "strawberry blond", "sandy", "straw-blond", "ash blond", "salt-and-pepper", "iron grey", "silver", "white", "dull, dyed black", "hennaed red"],
  hairStyle: ["cut short", "cropped close", "shaved to stubble", "worn long and loose", "tied back tight", "in a single braid", "in several thin braids", "pinned up and escaping", "oiled flat", "a wild tangle", "thinning on top", "receding hard", "curly and unkempt", "straight and lank", "bobbed at the jaw", "hidden under a cap", "hacked short with a knife", "carefully styled", "greasy, unwashed a week", "shaved at the sides"],
  eyeColor: ["grey", "pale grey", "blue", "pale blue", "green", "grey-green", "hazel", "amber", "light brown", "brown", "dark brown", "black", "mismatched"],
  eyeLook: ["watchful", "tired", "bloodshot", "heavy-lidded", "quick", "kind", "flat", "narrowed", "wide", "deep-set", "red-rimmed", "steady", "restless", "squinting", "bright", "cold", "crinkled", "hollow"],
  skinTone: ["pale", "fair", "ruddy", "olive", "tan", "golden-brown", "light brown", "brown", "deep brown", "dark", "sallow", "sun-darkened"],
  skinTexture: ["weathered", "freckled", "pockmarked", "smooth", "lined", "wind-chapped", "clammy", "scarred in small places", "well-kept", "blotchy", "oily", "leathery", "dusted with old sunburn", "rough"],
  hairByAnc: { kobold: ["no hair; a ridge of small horns", "no hair; a crest of stubby spines", "no hair; horns filed blunt", "no hair; one horn broken off"] },
  skinByAnc: {
    goblin: ["grey-green", "mottled green", "olive-green", "sickly yellow-green"],
    halforc: ["grey-green", "ash grey", "olive", "greyish brown"],
    kobold: ["rust-red scales", "dull brown scales", "slate-grey scales", "ochre scales"],
  },
  markKind: ["an old scar", "a badly stitched cut", "a burn scar", "a faded tattoo", "a crude home-made tattoo", "a brand", "a missing fingertip", "a crooked finger that healed wrong", "a birthmark", "a large mole", "a split lip, healing", "a black eye, going yellow", "pox scars", "a notched ear", "calluses thick as leather", "ink-stained fingers", "a missing tooth", "a gold tooth", "a nose broken and badly set", "a limp", "a tremor in one hand", "a rash", "a ring of pale skin where a ring used to be", "a piercing", "rope burns", "a dirty bandage"],
  markWhere: ["on the face", "across the jaw", "on the neck", "on one hand", "on the forearm", "above one eye", "on the knuckles", "at the throat", "on the cheek", "at the hairline", "on the wrist"],
  // marks that already say where they are, or make no sense with a place added
  markSelfPlaced: ["a missing fingertip", "a crooked finger that healed wrong", "ink-stained fingers", "a missing tooth", "a gold tooth", "a nose broken and badly set", "a limp", "a tremor in one hand", "a notched ear", "a ring of pale skin where a ring used to be", "a split lip, healing", "a black eye, going yellow", "calluses thick as leather", "no marks at all"],
  voice: ["hoarse", "so soft you lean in", "clipped and educated", "a thick dockside accent", "raspy from smoke", "fast, tumbling over itself", "flat and slow, thinking first", "carrying, without ever rising", "prone to cracking when nervous", "a put-on posh accent",
    "deep and unhurried", "high and thin", "nasal", "a pleasant, practised warmth", "gravelly", "mumbling, hard to follow", "loud, always slightly too loud", "a faint foreign lilt", "lisping", "sing-song",
    "monotone", "breathy", "sharp, every word bitten off", "a nervous stammer", "broken by a wet cough", "rich and theatrical", "quiet and precise", "a near-whisper for anything important"],
  smell: ["river mud and wet rope", "woodsmoke", "cheap perfume over sweat", "ink and old paper", "fish", "something medicinal", "stale beer", "incense", "horses and leather", "harsh soap",
    "nothing at all", "garlic", "wet wool", "tar", "sawdust", "bread", "blood, faintly", "lamp oil", "tobacco", "damp stone", "sour wine", "herbs and resin", "sweat and hard work", "rosewater", "coal smoke", "the street, mostly", "vinegar", "animal fat", "mould", "clean linen, somehow"],
  tic: ["counts coins in a pocket while talking", "never turns their back to a door", "touches their mask when lying", "laughs a half-beat too late", "corrects your grammar", "repeats your last few words back to you", "keeps glancing over your shoulder", "scratches at an old wound", "cracks their knuckles one by one", "hums under their breath",
    "taps a foot constantly", "won't hold eye contact", "holds eye contact far too long", "picks at their nails", "fiddles with a ring", "sniffs before every answer", "answers questions with questions", "stands too close", "keeps their hands hidden", "chews on something",
    "rubs their thumb and finger together", "smooths their clothes when nervous", "says your name too often", "goes still when surprised", "clicks their tongue", "wipes their hands on their clothes", "trails off mid-sentence", "checks the exits when they sit", "nods before you finish speaking", "keeps one hand near a pocket",
    "blinks hard when they lie", "tells you they're being honest, often", "laughs at their own jokes first", "sighs before answering", "tugs at an ear", "rocks slightly on their heels"],
  maskMat: ["cracked papier-mâché", "cheap painted leather", "porcelain, hairline-fractured", "gilded wood", "beaten silver", "black lacquer", "boiled leather, scorched", "pressed tin", "velvet over a wire frame", "bone, polished yellow"],
  maskFace: ["a long-beaked bird", "a smiling face", "a weeping face", "a black bird", "a blank oval with no features", "a grinning devil", "a sun", "a moon, half-shadowed", "a fish", "a cracked half-face, one eye bare", "a dog's muzzle", "a lion",
    "a fox", "a cat", "an old man's face", "a young woman's face", "a skull", "a jester", "a plain domino over the eyes", "a stag with short antlers", "a serpent", "an owl", "a frowning judge", "a crying child",
    "a bear", "a hare", "a crown of leaves", "a star pattern", "swirls with no face at all", "a goat", "a wolf", "a mouth sewn shut", "a face with three eyes"],
  maskState: ["worn daily and grimy at the strap", "brand new and clearly borrowed", "repaired badly, glue showing", "kept in a pocket, only worn when needed", "too fine for their clothes — a gift, or stolen", "held, never worn", "sweat-stained inside",
    "freshly repainted", "chipped at the edges", "tied on with string", "faded almost blank", "pushed up on the forehead", "a size too small", "clearly home-made", "polished with obvious pride", "missing a piece"],
  garb: [
    ["patched wool gone shapeless", "sacking belted with rope", "a coat far too big for them", "rags layered for warmth", "a stained shirt and no shoes", "clothes that were someone else's first", "a blanket worn as a cloak", "mismatched castoffs"],
    ["a work shirt and heavy boots", "a working apron over coarse linen", "wool worn thin at the elbows", "a short coat and patched trousers", "plain clothes, mended often", "boots older than the rest of the outfit", "a smock stiff with dirt", "clean but faded clothes"],
    ["a working apron over decent linen", "their trade's colours", "sober, clean, mended well", "a good wool coat", "plain but well-made clothes", "a leather vest over a clean shirt", "sturdy boots and a warm cloak", "an outfit kept for being seen in"],
    ["a good coat over polished boots", "slashed sleeves showing dyed silk", "finery a few years out of fashion", "tailored wool in dark colours", "a velvet doublet", "clothes that cost more than they need to", "a fur-trimmed cloak", "fashionable, but trying hard"],
    ["silk and lace, current to the season", "black head to foot, plain and very expensive", "sober, costly, deliberately forgettable", "embroidered brocade", "jewellery on every hand", "an outfit worth a house", "understated clothes of perfect cut", "the latest fashion, worn casually"],
  ],
  pocket: ["a loaded die", "a folded note in someone else's handwriting", "three buttons, all different", "a key with no lock they know of", "a pressed flower", "a lock of hair in oilcloth", "a small wooden token", "a child's tooth", "an IOU", "a cracked lens",
    "a receipt they should have thrown away", "a betting slip", "a vial of something cloudy", "a badge that isn't theirs", "a heel of bread", "a stub of chalk", "a torn page", "a lucky coin, worn smooth", "a tin whistle", "a length of string",
    "a sewing needle and thread", "a small knife", "a bent nail", "a love letter, unsent", "a map scrap with a mark on it", "a handful of dried beans", "a religious medallion", "a wax seal, broken", "a stolen spoon", "a smooth river stone",
    "a pawn ticket", "a ring too small for any of their fingers", "a lump of sealing wax", "a pinch of salt in a twist of paper", "a list of names", "a tooth that isn't human", "flint and steel", "a carved animal", "a candle stub", "a coin from somewhere far away"],
  drink: ["watered ale", "sweet mead, too much of it", "nothing — they gave it up", "whatever a stranger is buying", "spiced wine", "strong tea", "a private bottle they don't share"],
  meal: ["street-cart skewers", "thin soup", "stale bread and water", "the same fish three days running", "a proper dinner they couldn't afford", "sweets they were saving", "nothing since yesterday",
    "a meat pie of uncertain meat", "porridge", "leftovers from someone else's plate", "an apple and a heel of cheese", "a good roast, eaten alone", "something fried", "a bowl of stew at a counter", "boiled eggs", "a feast they weren't invited to", "whatever was cheapest"],
  vice: ["a drug they're past hiding", "betting on races", "cards", "an affair above their station", "selling information", "drink, on a schedule", "spending everything on clothes", "collecting useless things", "picking fights they can't win", "none, which is unsettling",
    "dice", "petty theft, for the thrill", "lying for no reason", "a lover they can't afford", "sweets, constantly", "gossip", "fortune-tellers", "sleeping through obligations", "pride", "a temper", "borrowing and not repaying", "late nights in bad places", "gambling on anything with odds", "vanity"],
  fear: ["sickness coming back to the city", "being recognised", "deep water", "their family finding out", "prison", "birds, genuinely", "dying unremembered", "whoever lives upstairs", "the dead",
    "fire", "being poor again", "being alone", "the dark", "their employer", "getting old", "a particular face in the crowd", "losing their hands", "debt", "being laughed at", "the Guard", "rats", "heights", "being forgotten by someone they love", "magic"],
  want: ["out of the city entirely", "a seat at a table they've been barred from", "one particular person dead", "to be famous for something", "a sibling somewhere safer", "enough renown to be let in anywhere", "the debt cleared, then honest work", "to be told they were right", "a child they gave up, found", "to keep what they stole",
    "a shop of their own", "a quiet life", "revenge, slowly", "respect from their family", "to be left alone", "a real friend", "a better job", "their name cleared", "love, frankly", "a way into a guild", "to see the sea", "one good night's sleep", "their parent's approval, still", "enough coin to stop counting"],
  secret: ["informs for someone powerful", "wears a second mask on certain nights", "saw a killing and said nothing", "is not who their papers say", "has been skimming from their employer for years", "is the unacknowledged child of someone with a title", "survived the plague and hides the scars", "sold a friend's name to the Guard", "is in love with someone they shouldn't be", "keeps something dead in the cellar",
    "can read, and lets no one know", "killed someone years ago; someone else hanged for it", "is deeply in debt", "is planning to leave everyone behind", "has a second family", "cheats at the job they're known for", "is terrified of what they worship", "forged their own credentials", "was once rich", "is dying, slowly", "stole the thing they're proudest of", "works for both sides", "started a fire that killed people", "has never once been outside the city"],
  lie: ["claims a patron who has never met them", "says they were somewhere else that night", "insists an injury came from a fall", "gives a false name", "claims their goods are legally sourced", "says they're leaving town soon — every week", "swears they don't know the name you just said",
    "pretends to be richer than they are", "pretends to be poorer than they are", "claims to have served in a war", "says they've never been arrested", "claims family in high places", "says they don't drink", "pretends not to understand a question", "claims the idea was theirs", "says it's their first time doing this"],
  lever: ["straight coin, more than it's worth", "a threat aimed at someone else", "being treated as a professional", "a way to hurt someone who wronged them", "protection for someone they love", "a gift chosen with actual thought", "access to somewhere they can't get into", "an audience — say it where others can hear",
    "a favour owed", "flattery, laid on thick", "a promise of work", "food and a warm place", "information they want", "the chance to be a hero", "their debt paid", "a good story", "being listened to", "a drink or three"],
  break: ["will sell you out the moment someone asks", "won't break for money, only for family", "folds the instant steel is drawn", "will go to the Guard if you frighten them", "will keep their word past the point of sense", "already sold you out before you walked in",
    "runs, and doesn't look back", "fights harder when cornered", "begs, loudly, to draw a crowd", "tells you whatever you want to hear", "goes silent and stays that way", "offers money to make it stop", "calls for someone who might actually come", "breaks down crying — maybe genuinely"],
  mood: ["jumpy, expecting someone else", "openly bored", "grieving and covering it", "spoiling for an argument", "exhausted", "pleased about something they won't explain", "drunk enough to be honest", "frightened and performing calm", "in a rare good mood", "still angry at someone who just left",
    "distracted", "suspicious of everyone", "chatty", "irritable", "hopeful", "sulking", "impatient", "cheerful, almost too cheerful", "embarrassed about something", "restless", "wary but polite", "quietly smug"],
  doing_day: ["haggling badly and losing", "asleep upright against a wall", "counting stock and coming up short", "arguing about a price", "delivering something they haven't looked inside", "waiting for someone who is very late", "scrubbing a stain that won't come out", "reading a notice they can't afford to obey",
    "eating standing up", "mending something with care", "carrying more than they should", "chasing off a stray dog", "writing a letter slowly", "looking for something they dropped", "talking to themselves", "fixing a loose shoe", "hurrying somewhere", "watching a street performer", "sharpening a blade", "counting coins twice",
    "trying to look busy", "comforting a crying stranger", "pretending not to see someone", "leaning in a doorway", "sorting through junk"],
  doing_night: ["watching the door, not the room", "burning papers", "meeting someone who stays masked indoors", "drinking alone and steadily", "carrying a bundle wrapped in oilcloth", "picking a lock", "praying somewhere quiet", "following someone at a distance",
    "walking fast with their head down", "waiting under a lamp", "cleaning blood off their hands", "laughing too loudly", "counting money in the dark", "sleeping in a doorway", "arguing in a whisper", "looking for somewhere to sleep", "stumbling home", "keeping watch"],
  rumor: ["says the Charity House soup has gone strange — people come in sick and get sicker", "heard a Gedgarrin professor was seen at the graveyard after dark, three times now", "knows the back-door guards at Club Levantis have a price, and can quote it", "swears something in the river is pulling rowers under and the guild is hushing it", "says the Bywater Barons will move on the Bilge Pot inside the month", "heard a champion pig at The Bend is to be poisoned before the Divine Swine", "claims a Silvertop tailor sews uniforms that pass a Guard inspection", "insists cloaked visitors leave Vanglare House every night before dawn", "says there are prisoners in the Donjon with no record", "heard the Guildmaster is tearing up tunnels looking for a relic", "says beggars go into the Temple of Kytheros and don't come back", "claims the new play at the Monveau is more than a play", "heard the dwarves at Anvil Hall are due a visit they won't enjoy", "says a High Harbor jeweler keeps a garnet worth more than a ship", "swears the pig at The Blind Pig has never once been wrong", "knows which magistrate takes money, and the going rate", "heard this year's ball is really a hunt for a wife", "says an Onyx Eye agent has been made inside the guild"],
  saw: ["saw two people swap masks and walk off as each other", "watched a body go into the water and told no one", "saw a cart leave full and come back fuller", "noticed the same boat tied up six nights running", "saw coin pass between a Guard and someone masked", "found a door that wasn't there last season", "watched someone buy something and run", "saw someone important weeping alone"],
};

/* child-appropriate replacements — a "street child" should never be "in their prime" with a vice for drink */
const CHILD = {
  age: ["about eight", "maybe ten", "eleven or twelve", "small for their age", "no older than nine", "thirteen, and says fifteen"],
  build: ["skinny", "small and quick", "gangly", "wiry", "tiny", "grubby and gangly"],
  vice: ["pinching fruit", "dice games in alleys", "telling tall tales", "sweets, when they can get them", "running off"],
  want: ["a proper meal", "a pair of boots", "to find their brother", "to join a gang", "a place to sleep that's dry", "to be taken seriously"],
  fear: ["the Guard", "the bigger kids", "the dark", "being sent away", "dogs", "the water"],
  secret: ["knows where a lot of things are hidden", "has a parent in prison", "carries messages for dangerous people", "has been sleeping in a church", "saw something they shouldn't have", "has a stash of coin buried somewhere"],
  lever: ["food", "a coin or two", "being treated like a grown-up", "a promise to keep them safe", "something shiny"],
  lie: ["says their parents are just around the corner", "claims they found it", "says they're older than they are", "insists they weren't there"],
  doing_day: ["running an errand at full speed", "begging with a practised face", "playing dice in the gutter", "watching a street performer", "carrying a message", "stealing a glance at a fruit stall", "chasing a dog", "sitting on a wall, swinging their legs", "sweeping a doorstep for a coin", "following a well-dressed stranger"],
  doing_night: ["curled up in a doorway", "running messages between taverns", "watching the street from a rooftop", "looking for somewhere dry to sleep", "sharing a stolen loaf with another kid", "hiding from the watch"],
  pocket: ["a marble", "a stub of chalk", "a string of buttons", "a copper coin, polished", "a heel of bread", "a carved animal", "a lucky stone", "a stolen spoon", "a bent nail", "a scrap of ribbon", "a whistle", "a dead beetle in a twist of paper"],
  garb: ["rags and bare feet", "an adult's shirt, belted with string", "a coat three sizes too big", "patched trousers and no shoes", "a cap pulled low", "clothes someone else outgrew"],
};
const CHILD_SIT = [
  { s: "Lost the coin they were sent out with and can't go home without it.", a: "The coin, or a story that will hold up.", c: "tonight" },
  { s: "Saw something at {loc} they weren't meant to, and someone saw them see it.", a: "Somewhere to hide for a day or two.", c: "days" },
  { s: "Their older sibling hasn't come back from {loc}.", a: "Someone grown-up to go and look.", c: "days" },
  { s: "Is being made to run messages to and from {crim} and wants out.", a: "A way out that doesn't get them hurt.", c: "weeks" },
  { s: "Found a purse and doesn't know whose it is.", a: "Someone to tell them what to do with it.", c: "hours" },
  { s: "Is hungry, and the soup line ran out.", a: "A meal.", c: "now" },
];
const TIER_LV = { common: [0, 2], pro: [2, 4], dangerous: [4, 6], elite: [6, 10] };
const SMALL_ANC = ["dwarf", "halfling", "goblin", "kobold"];
const LITERATE = ["scholar", "clerk", "barrister", "mage", "apprentice", "priest", "bard", "physician", "apothecary", "merchant", "noble", "spy", "acolyte", "druid"];
const CHILD_BAD_CONDS = /Drunk|Hungover|Bloodroot|Lovesick|promoted|Just paid|Armed above|Owes the wrong|Rat Plague|Carrying something valuable/;
const CHILD_BAD_RELS = /love|drinks with|owes money|trades goods/;

/* Does a rolled detail make sense for THIS person? Anything that fails is re-picked
   from the pool of things that do. Only failing fields re-roll, so most NPCs are untouched. */
function fitsNpc(key, v, n) {
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
function syncThreat(n, keepHp) {
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
function repairDetails(n) {
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
    n.sd.features = n.sd.features.map((f) => f.n === "Deity" || f.n === "Patron" ? { ...f, t: f.t.replace(/Serves [^;,]+/, `Serves ${n.faith.name}`) } : f);
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
function rollLooks(anc) {
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

const IDENTIFIERS = ["the Phlegmy", "the Silent", "the Unlucky", "the Sly", "the Pensive", "the Vengeful", "the Outcast", "the Forgotten", "the Stubborn", "the Observant", "the Charming", "the Grim",
  "the Crooked", "the Patient", "the Wronged", "the Damp", "the Ravenous", "the Bright", "the Bitter", "the Loyal", "the Twice-Hanged", "the Blue", "the Careful", "the Widow", "the Whisper", "the Bell", "the Late",
  "the Quick", "the Slow", "the Tall", "the Short", "the Lucky", "the Honest", "the Liar", "the Pious", "the Drowned", "the Lame", "the Red", "the Grey", "the Younger", "the Elder",
  "the Fat", "the Thin", "the Mute", "the Loud", "the Brave", "the Coward", "the Needle", "the Hammer", "the Fox", "the Crow", "the Mouse", "the Knife", "the Smiler", "the Weeper",
  "Two-Coins", "One-Ear", "Halfpenny", "Nine-Fingers", "Sweet-Tooth", "Blackboots", "the Gentle", "the Cruel", "the Tired", "the Proud", "the Nobody"];

const FACTIONS = {
  none: { label: "Unaffiliated", al: null, color: C.dim, crim: 0 },
  shroud: { label: "The Shroud", al: "C", color: C.violet, crim: 2 },
  guild: { label: "Thieves' Guild (House of Seren)", al: "C", color: C.blood, crim: 2 },
  barons: { label: "Bywater Barons", al: "C", color: C.blood, crim: 2 },
  duke: { label: "The Duke / City Guard", al: "L", color: C.gold, crim: 0 },
  onyx: { label: "The Onyx Eye", al: "L", color: C.gold, crim: 1 },
  bardic: { label: "Bardic College", al: "L", color: C.cyan, crim: 0 },
  gedgarrin: { label: "Gedgarrin", al: "L", color: C.cyan, crim: 0 },
  charnel: { label: "The Charnel-Men", al: "N", color: C.dim, crim: 1 },
  weeps: { label: "She Who Weeps", al: "C", color: C.violet, crim: 2 },
  beggars: { label: "The Beggars", al: "N", color: C.dim, crim: 1 },
  rowers: { label: "The Rowers", al: "L", color: C.cyan, crim: 0 },
  jeweled: { label: "The Jeweled Eye", al: "N", color: C.gold, crim: 1 },
};

const BAND_LABEL = ["Destitute", "Poor", "Modest", "Comfortable", "Wealthy"];
const BAND_COIN = [[0, 8, "sp"], [1, 14, "sp"], [2, 25, "sp"], [3, 40, "gp"], [15, 140, "gp"]];
const HOLIDAYS = {
  none: { label: "Ordinary day", note: null },
  lastmoon: { label: "Lastmoon", note: "Silver and cool tones only; gold is a faux pas. Marriage proposals tonight are auspicious." },
  maytide: { label: "Maytide", note: "Florals, pearls, peacock feathers. Ventures begun today are said to prosper. Dark jewel tones are out of place." },
  anton: { label: "Night of St. Anton", note: "Devils, knights and maidens; crimson, gold and white. Mischief is at its yearly high." },
  ball: { label: "The Duke's Ball", note: "Masks required, 500 gp of costume to enter the castle. Red is forbidden outright." },
};

/* ========================= v4 CONTENT BLOCKS ========================= */

/* --- 1. SHOPS & TRADE ---------------------------------------------
   Any trading job gets a real business. `to` numbers in RUMORS and
   the goods lists here are the book's own location numbers. ------- */
const SHOP_SIGN_A = ["The Gilded", "The Crooked", "The Patient", "The Honest", "The Blue", "The Drowned", "The Silver", "The Fat", "The Lucky", "The Quiet", "The Salt", "The Broken", "The Red", "The Merry", "The Old"];
const SHOP_SIGN_B = ["Gull", "Marmot", "Oar", "Thimble", "Tallow", "Anvil", "Rook", "Pike", "Lantern", "Cask", "Spindle", "Key", "Boar", "Wheel", "Kettle", "Mask"];

const SHOP_GOODS = {
  vendor: ["eels, smoked and fresh", "secondhand boots and belts", "tin cups, pans, and pot-menders", "rope, twine, and net repair", "candles by weight", "dried beans, lentils, and salt fish", "hot pies of uncertain filling", "canal-caught crab", "cheap cloth by the ell"],
  artisan: ["barrels and cask repair", "leatherwork and harness", "cabinetry and small joinery", "pewter plate and tankards", "nets, sails, and canvas", "glassware, mostly sound", "rope and blocks for the docks", "clay pipes and pots"],
  merchant: ["wine shipped from upriver", "wool and finished cloth", "spices in small paper twists", "timber and building stone", "grain by the sack", "imported glass and mirrors", "salt, in quantity"],
  innkeep: ["bed, board, and the local ale", "rooms by the week, stabling extra", "a pot of stew and a straw mattress"],
  apothecary: ["tinctures, poultices, and tooth-draws", "fever powders and sleeping draughts", "herbs, dried and hanging in bunches", "salves for burns and canal rot"],
  physician: ["bone-setting, stitching, and bleeding", "birthing, fevers, and plague watching", "tooth-pulling and wound care"],
  fortuneteller: ["tarot readings and love charms", "charms against the plague", "speaking with the dead, allegedly"],
  fence: ["whatever came in this week, no questions", "plate and jewellery with the marks filed off", "goods that fell off a barge"],
  vendor_default: ["general goods and basic gear"],
};
const SHOP_QUIRK = [
  "Keeps a ledger of who owes what and never forgets a name.",
  "Won't serve anyone wearing a mask inside.",
  "Gives short weight to strangers and honest weight to regulars.",
  "Has a pet that decides whether you get the good stock.",
  "Knocks 10% off if you can make them laugh.",
  "Distrusts certain coins and bites every one.",
  "Prices go up after dark, and they'll say so to your face.",
  "Prefers to trade goods rather than take coin.",
  "Keeps the best stock under the counter for people with a name.",
  "Takes payment in favours from people they've decided are useful.",
  "Has been robbed recently and watches everyone's hands.",
  "Is closing early today and won't say why.",
  "Talks the whole time and upsells relentlessly.",
  "Never haggles. The price is the price.",
  "Haggles over everything, even when you've agreed.",
  "Throws in something small and useless with every sale.",
  "Won't open the door until they've looked at you through it.",
  "Runs the place with a child who does the maths faster.",
  "Is half asleep and easy to overcharge — or undercharge.",
  "Has no prices written anywhere; makes them up by the look of you.",
  "Asks where you're from before quoting anything.",
  "Keeps a dog behind the counter that growls at weapons.",
  "Only open when they feel like it.",
  "Remembers every customer's last purchase and asks about it.",
  "Insists on wrapping everything, slowly.",
  "Is new here and doesn't know the real value of half the stock.",
  "Is desperate for sales this week and will deal.",
  "Won't let more than two customers in at once.",
];
const SHOP_WONT = [
  "won't sell to anyone they think works for a gang",
  "won't sell one particular item, at any price",
  "won't extend credit, ever, since the last time",
  "won't sell after dark to strangers",
  "won't part with a piece their late partner made",
  "won't take business from the Guard",
  "won't buy anything that looks stolen",
  "won't sell weapons to anyone who looks angry",
  "won't deal with anyone who haggles too hard",
  "won't serve someone they've barred, and they bar easily",
  "won't sell on a holy day",
  "won't hold anything for later",
  "won't take coins they can't identify",
  "won't discuss where their stock comes from",
  "won't sell to children, even for a parent",
  "won't take back anything once it's left the shop",
];

/* --- 2. RUMORS -----------------------------------------------------
   The book's d100 rumour table, rewritten so each line points at a
   real location the party can go to. `to` is the location number. -- */
const RUMORS = [
  { t: "the soup at the charity house in Rilken Row makes people worse, not better", to: 35, truth: "true" },
  { t: "a professor from the wizard college has been seen at the graveyard after dark, three nights running", to: 27, truth: "true" },
  { t: "the back-door guards at that High Harbor club take fifty gold and ask nothing", to: 17, truth: "true" },
  { t: "something in the canal is pulling rowers under, and the guild is keeping it quiet", to: 11, truth: "open" },
  { t: "the dock gang out of Rilken Row is about to move on the Gutterwash tavern", to: 8, truth: "true" },
  { t: "the champion racing pig is going to be poisoned before the Divine Swine", to: 49, truth: "true" },
  { t: "a tailor in Silvertop sews uniforms that will pass a Guard inspection", to: 37, truth: "true" },
  { t: "cloaked callers leave that ivy-covered manor in High Harbor just before dawn", to: 15, truth: "true" },
  { t: "there are prisoners deep in the Donjon with no record anywhere", to: 19, truth: "true" },
  { t: "the head of the Thieves' Guild is tearing up her own tunnels hunting a relic", to: 9, truth: "open" },
  { t: "beggars go into the abandoned temple in Ninestones and don't come back out", to: 26, truth: "open" },
  { t: "the new play at the Monveau is a ritual, not a play", to: 3, truth: "true" },
  { t: "the dwarf brothers at Anvil Hall are due a visit they won't enjoy", to: 43, truth: "true" },
  { t: "a High Harbor jeweller keeps a garnet worth more than a ship, on open display", to: 14, truth: "true" },
  { t: "the blind pig in Rilken Row has never once been wrong", to: 32, truth: "true" },
  { t: "one of the Duke's twelve magistrates takes money, and there's a going rate", to: 20, truth: "true" },
  { t: "this year's ball is really the Duke hunting for a wife", to: 21, truth: "true" },
  { t: "an Onyx Eye agent has been made inside the Thieves' Guild", to: 9, truth: "open" },
  { t: "the crematorium keeps everything the dead say, written down", to: 7, truth: "true" },
  { t: "the banker who runs the Golden Vault answers to somebody masked", to: 39, truth: "true" },
  { t: "the sword school and the gladiator school are one insult from bloodshed", to: 24, truth: "true" },
  { t: "a disgraced singer went down under the great theatre and never came up", to: 5, truth: "true" },
  { t: "the old woman in the tree grove has been there longer than anyone alive", to: 28, truth: "true" },
  { t: "there's a fighting ring in a Gutterwash warehouse and the password changes weekly", to: 10, truth: "half" },
  { t: "the fence in Rilken Row will cancel a Guard pursuit for the right goods", to: 34, truth: "open" },
  { t: "the curio shop in High Harbor bought something the owner can't identify", to: 16, truth: "true" },
  { t: "the barrister at Shieldstone Law is a dead man walking", to: 12, truth: "true" },
  { t: "there's a drug sold behind the cookware at the Rooks market", to: 47, truth: "true" },
  { t: "the apothecary in Silvertop is building something that explodes", to: 42, truth: "true" },
  { t: "the safehouse in Rilken Row is run by the Guildmaster's own uncle", to: 31, truth: "true" },
  { t: "a piper haunts the tunnels under the Red Rat and the drinkers can hear it", to: 36, truth: "true" },
  { t: "the silver from the small Silvertop jeweller wards off worse than bad luck", to: 41, truth: "true" },
  { t: "two young guards at the Grand Gate have gotten into something over their heads", to: 18, truth: "true" },
  { t: "the charter of the whole city is buried under the nine stones", to: 25, truth: "half" },
  { t: "the head of the Bardic College quietly hires adventurers", to: 6, truth: "true" },
  { t: "the reaver banned from the Bull's Pen is still circling the place", to: 38, truth: "true" },
  { t: "the finest inn in the city is hosting somebody travelling under a false name", to: 22, truth: "open" },
  { t: "the tailor to the Montmar family is hiding something and it isn't about cloth", to: 23, truth: "open" },
];

const RUMOR_TRUTH = [
  { k: "True", w: 46, tone: "green", note: "As stated. It will hold up." },
  { k: "Half right", w: 32, tone: "gold", note: null },
  { k: "False", w: 22, tone: "blood", note: null },
];
const RUMOR_TWIST = [
  "the place is wrong — it's a district over",
  "the name attached to it is the wrong person",
  "it was true last month and has already been dealt with",
  "it's true, and far smaller than the telling",
  "it's true, and far worse than the telling",
  "the teller is closer to it than they realise",
  "it's two separate true things stuck together",
  "the timing is wrong — it hasn't happened yet",
];
const RUMOR_FALSE = [
  "planted by the Thieves' Guild to move eyes off something else",
  "invented by a beggar who wanted a coin and a listener",
  "started by a rival trader to ruin a competitor",
  "a Shroud distraction, and an effective one",
  "a garbled retelling of something true about a different person",
  "somebody made a Skulduggery check and this is the result",
  "the teller made it up on the spot and now half believes it",
];
const RUMOR_PRICE = [
  "a drink, and time to finish it", "a silver, openly offered", "5 gp, and no haggling",
  "a favour, unspecified, to be called later", "being taken seriously for once",
  "a name in return — they trade, they don't give", "nothing, they've been dying to tell someone",
  "food, and somewhere to sit down", "a promise you'll keep them out of it",
];
/* Reaction gates how much they'll part with (book: reaction rolls, and
   the Beggars who "don't part with valuable information easily") */
const RUMOR_GATE = {
  Hostile: { n: 0, note: "Wants you gone. Tells you nothing; may refuse service, send for the Guard, or turn violent if pushed." },
  Suspicious: { n: 1, note: "One, and only after the price is paid." },
  Neutral: { n: 1, note: "One freely. A second costs the price." },
  Curious: { n: 2, note: "Two, and wants to know what you know in return." },
  Friendly: { n: 3, note: "Everything they have, and points you at who'd know more." },
  // v8–v12 labels, so older saved NPCs still read
  Unfriendly: { n: 1, note: "One, and only after the price is paid." }, Indifferent: { n: 1, note: "One freely. A second costs the price." }, Helpful: { n: 3, note: "Everything they have." },
};

/* --- 3. VOICE KIT --------------------------------------------------- */
const VOICE_REGISTER = ["short sentences, long pauses", "never stops talking, circles the point", "formal, a shade too formal", "sarcastic by reflex, warms up slowly", "warm and immediate",
  "flat and transactional, facts then silence", "theatrical, plays to the room", "quiet, makes you ask twice", "asks more questions than they answer", "swears constantly, apologises for none of it",
  "polite to the point of nervousness", "blunt, no manners at all", "rambling, wanders into old stories", "whispers like everything is secret", "cheerfully rude",
  "precise, chooses every word", "slangy and fast", "mournful, everything is a shame", "boastful, always slightly exaggerating", "curt, clearly wants you gone",
  "flirtatious out of habit", "lecturing, explains things you know", "gentle, as if talking to a spooked animal", "distracted, answers a beat late", "overly familiar from the first word"];
const VOICE_PHRASE = ["\"That's the way of it.\"", "\"You didn't hear it from me.\"", "\"Ask anyone.\"", "\"Now, I'm not one to talk, but —\"", "\"Do I look like I know?\"", "\"Suit yourself.\"",
  "\"Everything has a price.\"", "\"Gods willing.\"", "\"Same as it ever was.\"", "\"Don't make me say it twice.\"", "\"You'll want to be elsewhere.\"", "\"I've seen worse.\"",
  "\"Fair's fair.\"", "\"Well, there it is.\"", "\"Can't help you there.\"", "\"Mind how you go.\"", "\"If you say so.\"", "\"Not my business.\"",
  "\"Honest truth.\"", "\"Could be worse.\"", "\"Isn't that something.\"", "\"We'll see.\"", "\"I'm just saying.\"", "\"Mark my words.\"",
  "\"What's it to you?\"", "\"Nothing's free.\"", "\"Long story.\"", "\"Don't get me started.\"", "\"That's a question, that is.\"", "\"No offence meant.\""];
const VOICE_ADDRESS = ["\"friend\" — to everyone, meaning nothing", "\"my lord\" and \"my lady\", laid on thick", "your name, immediately and often, once they have it", "\"you\" — flatly, no softening",
  "\"sir\" and \"madam\", sincerely", "a nickname they invent on the spot", "nothing at all; never addresses anyone directly", "\"love\" or \"dear\", whoever you are",
  "\"boss\", half-mocking", "\"stranger\", pointedly", "your job or look — \"soldier\", \"scholar\"", "\"kid\", regardless of your age", "\"mate\" or \"pal\"", "your full name, every time"];
const VOICE_STOP = ["the Guard walking past", "any mention of the gangs", "a mask coming off", "somebody else joining the conversation", "being asked where they were last night", "the price coming up",
  "an honest compliment — it throws them", "a question about their family", "a raised voice", "someone writing things down", "a mention of money owed", "their employer's name",
  "a weapon being drawn", "being asked their real name", "the subject of the dead", "anything about magic", "being touched", "a rival's name"];

/* --- 4. CONNECTIONS ------------------------------------------------- */
const REL_TYPES = [
  { r: "owes money to", tension: "and the term is nearly up" },
  { r: "is owed a favour by", tension: "and hasn't decided how to spend it" },
  { r: "grew up alongside", tension: "and they've drifted badly" },
  { r: "works for", tension: "and is starting to resent it" },
  { r: "informs on", tension: "for coin they're ashamed of" },
  { r: "is cousin to", tension: "and the family doesn't speak of it" },
  { r: "was thrown out by", tension: "and still isn't over it" },
  { r: "drinks with", tension: "every week without fail" },
  { r: "is quietly in love with", tension: "and has never said so" },
  { r: "took the blame for", tension: "and is still paying for it" },
  { r: "trades goods with", tension: "on terms that favour the other side" },
  { r: "is frightened of", tension: "with good cause" },
];

/* --- 5. ORDINARY FOLK ----------------------------------------------
   Jobs that belong in a city of 90,000 people rather than a dungeon.
   The MUNDANE switch restricts generation to this set. ------------- */
const MUNDANE_JOBS = ["laborer", "beggar", "child", "drunk", "rower", "sailor", "servant", "vendor", "artisan", "merchant", "innkeep", "gambler", "clerk", "acolyte", "mourner", "pilgrim", "physician", "apothecary", "fortuneteller", "scholar", "actor", "guard", "cutpurse", "informant"];
const SHOP_JOBS = ["vendor", "artisan", "merchant", "innkeep", "apothecary", "physician", "fortuneteller", "fence"];

/* --- 6. READ-ALOUD OPENERS ------------------------------------------ */
const OPENER_FRAME = [
  "You get {build}, {age}, {doing}.",
  "{Build_c}, {age}. {Doing_c}, and doesn't look up straight away.",
  "The first thing you notice is {mark}. Then that they're {doing}.",
  "{Build_c} and {age}, {doing}. Their voice: {voice}.",
  "Someone {build}, {doing}. {Mark_c}.",
  "{Mark_c} is what you see first. They're {doing}.",
  "Someone {age} and {build}, {doing}.",
  "They're {doing} when you arrive — {build}, {age}.",
  "{Doing_c}. {Build_c}, {age}, with {mark}.",
  "A person {age} and {build}. When they speak, it's {voice}.",
];

/* ===================== v5: THE REACHES & THE NINE =====================
   Cross-referenced against the Player's and GM's Guides to the Western
   Reaches. The City of Masks is the largest city-state in the Reaches
   and most trade flows through it, so its streets should be full of
   people who aren't from here.
   ===================================================================== */

/* --- ANCESTRY, per the Player's Guide d100 population table -----------
   Book: 01-54 human, 55-64 elf, 65-74 dwarf, 75-84 halfling,
   85-89 goblin, 90-94 half-elf, 95-99 half-orc, 00 kobold.
   v4 used made-up weights and had no half-elves or kobolds at all. -- */
const ANCESTRY_WEIGHTS_WR = [
  ["human", 54], ["elf", 10], ["dwarf", 10], ["halfling", 10],
  ["goblin", 5], ["halfelf", 5], ["halforc", 5], ["kobold", 1],
];

/* Half-elf names use the book's two-part d10 construction. */
const HALFELF_A = ["Me", "Ira", "Im", "Hu", "Gal", "Tova", "Syr", "Or", "Lir", "Cal"];
const HALFELF_B = ["garrin", "sandiel", "rak", "teril", "rynn", "barik", "lena", "seniel", "dess", "dorin"];
const NAMES_WR = {
  halfelf: { m: [], f: [], s: ["of the Steppes", "Hawkborn", "Tallgrass", "Redsand", "Two-Bloods", "Cobairider"] },
  kobold: { m: ["Skrik", "Yipp", "Nardo", "Vess", "Tak"], f: ["Riska", "Pell", "Nix", "Grull"], s: ["Scaletongue", "Cinderfoot", "Gutterpaw", "Thinshell"] },
};
function halfElfName() { return pick(HALFELF_A) + pick(HALFELF_B); }

/* --- ORIGIN: the five city-states and the wild regions ---------------
   `w` weights how common that origin is on Meridia's streets.
   `anc` biases which ancestries come from there. ------------------- */
const ORIGINS = {
  masks: {
    w: 58, name: "City of Masks", region: "born here, in the city",
    tell: "Talks like a local, which in this city means talking around things.",
    doing: null, lang: "Common",
  },
  montmar: {
    w: 12, name: "Duchy of Montmar", region: "the countryside up the Trematora",
    tell: "Country vowels the city hasn't worn off yet.",
    doing: [{ t: "came in for work and stayed" }, { t: "sends money back to a village up the river" }, { t: "was driven off the land and won't say by what" }],
    lang: "Common",
  },
  alkesh: {
    w: 7, name: "Alkesh", region: "the City of Red Sands, across the Djurum",
    tell: "Wears one piece of Alkeshi silk and keeps it immaculate.",
    doing: [{ t: "trades on a caravan route and is between crossings", cat: ["trade", "labor"] }, { t: "left owing somebody in the Forgotten Quarter" }, { t: "is here to buy something Alkesh wouldn't sell them" }],
    lang: "Common and the tongue of Alkesh", anc: ["human", "halfelf"],
  },
  stonehall: {
    w: 6, name: "Stonehall", region: "the halls under the Rimespires",
    tell: "Judges every piece of metalwork in the room without meaning to.",
    doing: [{ t: "sells Stonehall ironwork at a markup", cat: ["trade"] }, { t: "left over the succession and won't discuss it" }, { t: "is buying ore contracts for the clan", cat: ["trade", "noble"] }],
    lang: "Common and Dwarvish", anc: ["dwarf"],
  },
  kyzian: {
    w: 5, name: "Kyzian Tribes", region: "the Steppes, under the Hawk Queen",
    tell: "Stands like someone who'd rather be on a horse, and hates the narrow streets.",
    doing: [{ t: "came down with a horse-trading party", cat: ["trade", "labor"] }, { t: "is an envoy from a prince and underdressed for it", cat: ["noble", "martial"] }, { t: "rode away from a feud between families" }],
    lang: "Common and Kyzian", anc: ["human", "halfelf"],
  },
  lydonia: {
    w: 5, name: "Lydonia", region: "the white citadel and the Cerulean Quarter",
    tell: "Unsettlingly still, and the stillness reads as fey to city folk.",
    doing: [{ t: "is hunting something that came out of the Gloaming", cat: ["martial", "clergy", "arcane"] }, { t: "was sent to watch the Duke's court and reports nothing" }, { t: "is in exile, politely phrased" }],
    lang: "Common and Elvish", anc: ["elf", "halfelf"],
  },
  wilds: {
    w: 7, name: "The wild Reaches", region: "the moor, the Sablewood, or worse",
    tell: "Watches doorways and treelines the same way, out of habit.",
    doing: [{ t: "walked out of the Lowland Moor and won't say what from" }, { t: "trapped in the Sablewood until the winter turned" }, { t: "is the only one of their village left" }],
    lang: "Common",
  },
};

/* --- THE NINE --------------------------------------------------------
   The Stones (25, Ninestones) is a ring of nine dolmens, each telling
   one of the Nine gods' births. TWO STONES ARE BLANK: The Lost were
   cast down and their names expunged.

   NOTE FOR THE GM: that leaves seven carved stones, but Shadowdark's
   core pantheon names eight gods besides The Lost. So either one of
   them isn't counted among the Nine in the Reaches, or two share a
   stone. The book doesn't say. Pick your seven below by setting
   `nine: false` on whichever you want excluded — it's a good table
   mystery either way, and the PCs can go count the stones.
   ------------------------------------------------------------------ */
const GODS = {
  terragnis: {
    name: "Saint Terragnis", al: "L", nine: true, domain: "the dawn, honour, righteous war",
    inCity: "The Ivory Cathedral is hers; High Paladin Evelyn serves at its altar.",
    tell: "Won't lie outright, even when a lie would be kinder.",
    oath: "\"By the dawn.\"", at: 29,
  },
  madeera: {
    name: "Madeera the Covenant", al: "L", nine: true, domain: "the Covenant, light, oaths kept",
    inCity: "She founded Meridia by her own hand; a scrap of the Covenant lies buried beneath her stone.",
    tell: "Treats a spoken promise as binding, and expects the same of you.",
    oath: "\"On the Covenant.\"", at: 25,
  },
  ord: {
    name: "Ord", al: "L", nine: true, domain: "knowledge, law, magic held in order",
    inCity: "Quietly favoured by Gedgarrin scholars and by magistrates who mean it.",
    tell: "Writes things down. Everything. In front of you.",
    oath: "\"By the ledger.\"", at: 4,
  },
  gede: {
    name: "Gede", al: "N", nine: true, domain: "feasts, laughter, the woods, music",
    inCity: "Every tavern keeps some small token to him. The Bardic College toasts him first.",
    tell: "Will not let a stranger stand there without a drink in their hand.",
    oath: "\"Gede's own luck.\"", at: 6,
  },
  titania: {
    name: "Titania", al: "N", nine: true, domain: "the fey, enchantment, the unspoken bargain",
    inCity: "The Tree Grove is hers, whatever old Mina says it is.",
    tell: "Never gives their true name to anyone who asks for it directly.",
    oath: "\"By the green.\"", at: 28,
  },
  memnon: {
    name: "Memnon", al: "C", nine: true, domain: "chaos, discord, the roar",
    inCity: "Evermandin Biscol preaches him here, with an unorthodox reading of the tenets.",
    tell: "Enjoys watching an argument they started and won't join.",
    oath: "\"Let it burn.\"", at: null,
  },
  ramlaat: {
    name: "Ramlaat", al: "C", nine: true, domain: "the pillage, blood, the strong hand",
    inCity: "Not preached openly. The Bywater Barons have men who mean it anyway.",
    tell: "Takes the largest share first and dares the room to object.",
    oath: "\"Blood and plunder.\"", at: 33,
  },
  shune: {
    name: "Shune the Vile", al: "C", nine: true, domain: "secrets, stolen magic, the whispered word",
    inCity: "The Shroud's upper ranks know her mark. So, allegedly, does a professor at Gedgarrin.",
    tell: "Collects other people's secrets the way other people collect coins.",
    oath: "\"She hears you.\"", at: 27,
  },
  lost: {
    name: "The Lost", al: "C", nine: true, blank: true, domain: "the two cast down, names expunged",
    inCity: "Two of the nine stones are blank. It is bad luck to say so out loud.",
    tell: "Goes quiet and strange when the Stones come up in conversation.",
    oath: "\"...\" — they won't say it.", at: 25,
  },
  /* minor gods named in the City of Masks */
  kytheros: {
    name: "Kytheros", al: "N", nine: false, domain: "time, the hour, what's owed to it",
    inCity: "His temple in Ninestones has stood abandoned for years. Beggars burn trash fires on the marble.",
    tell: "Always knows what hour it is, and will tell you.",
    oath: "\"In its hour.\"", at: 26,
  },
  krull: {
    name: "Krull", al: "N", nine: false, domain: "a minor god of the old waterside temples",
    inCity: "One of the crowded little temples by the water in Ninestones.",
    tell: "Keeps an old rite nobody else in the city remembers the point of.",
    oath: "\"Krull keep it.\"", at: null, // book p.44 names "Krull" for the temple p.58 calls Kytheros's; kept as a minor god, no fixed address
  },
  anton: {
    name: "St. Anton", al: "L", nine: false, domain: "mischief survived, the turning year",
    inCity: "His night is one of the city's four great holidays; devils, knights and maidens in the streets.",
    tell: "Marks every saint's day properly, and judges those who don't.",
    oath: "\"Anton's eye.\"", at: null,
  },
  weeps: {
    name: "She Who Weeps", al: "C", nine: false, cult: true, domain: "the Plague Mother, sickness embraced",
    inCity: "The Plague Mother cult festers in the undercroft beneath the Temple of Kytheros.",
    tell: "Is not afraid of the sick. Not even slightly. It reads wrong.",
    oath: "\"She weeps for you.\"", at: 26,
  },
};

const DEVOTION = [
  { k: "Devout", w: 18, note: "Observes properly, and it shapes what they'll agree to." },
  { k: "Observant", w: 30, note: "Keeps the days, says the words, doesn't think hard about it." },
  { k: "Nominal", w: 30, note: "Raised in it. Would say the name under pressure and mean nothing by it." },
  { k: "Lapsed", w: 14, note: "Walked away from it, and is touchy about being asked why." },
  { k: "Secret", w: 8, note: "Worships where it can't be seen. Exposure would cost them everything." },
];

/* the four factions of the Reaches, from the Player's Guide */
const WR_FACTIONS = {
  bards: { label: "The Bards", al: "L", color: "#00E5FF", crim: 0, note: "Lawful order under Master Poet Yeothin at the Bardic College. Symbol: a gold nine-pointed star, the Duke's Rose." },
  jeweled: { label: "The Jeweled Eye", al: "N", color: "#F0C33C", crim: 1, note: "Neutral, secretive, self-interested. Led from Alkesh by the reclusive sorcerer Afarim Zarad. Symbol: a ring set with a cat's-eye gem." },
  torch: { label: "The Torchbearers", al: "N", color: "#FCEE0A", crim: 1, note: "Neutral, no central leader, local majority vote. Meets at the Pale Toad in Gedgarrin. Symbol: a dagger with a flame pommel." },
  wolves: { label: "Wolves of Lydonia", al: "L", color: "#3BE08F", crim: 0, note: "Lawful protectors keeping the wilds off civilization. Rarely seen this far from Lydonia." },
};

/* ==================== v6: THE NAMED OF MERIDIA ====================
   Every person named in Cursed Scroll 6, written up by hand rather
   than generated. These are reference entries, not rolls: the stat
   line is a suggestion you can overrule, and `hook` is the thread
   the book hangs on them.

   `at` is the location number. `lv/ac/hp` are estimates in the same
   scale the generator uses — swap in the book's own blocks if you
   have them open.
   ================================================================= */

const BOOK_NPCS = [
  // ---------- GEDGARRIN ----------
  { n: "Mareniel Siruul", at: 1, role: "Swordmaster", fac: "none", al: "N", lv: 6, ac: 15, hp: 28, anc: "elf",
    desc: "An elf from the far desert who teaches swordplay and archery in a sunlit hall. Serene, and almost silent.",
    wants: "Her finesse style to be taken seriously in a city that laughs at it.",
    hook: "Tiborian's school is planning to raid her hall to humiliate her. She either doesn't know or doesn't care." },
  { n: "Teomin", at: 2, role: "Apprentice wizard", fac: "gedgarrin", al: "N", lv: 2, ac: 10, hp: 6, anc: "human",
    desc: "A forlorn young wizard who sits in the dark corner of the Pale Toad writing and crumpling love letters.",
    wants: "Cynthia Ulfric, and no idea how to say so.",
    hook: "Lends his alchemical skill to anyone who's kind about it. The other half of this story is at the Silk Lion." },
  { n: "Bertrand Gilliard", at: 3, role: "Playwright", fac: "none", al: "C", lv: 3, ac: 10, hp: 10, anc: "human",
    desc: "Resident playwright of the Monveau, about to debut his magnum opus, \"The Horror Within.\"",
    wants: "The play staged. Nothing else registers any more.",
    hook: "He found an eldritch book in the tunnels below the theatre and it broke him. The play is a summoning ritual. Nobody knows." },
  { n: "Ivanculus", at: 4, role: "Headmaster of Gedgarrin", fac: "gedgarrin", al: "L", lv: 10, ac: 12, hp: 34, anc: "human",
    desc: "Wise, grey-robed headmaster of the wizard college. Said to have been taught by dragons.",
    wants: "The seven towers to outlast him.",
    hook: "He has not noticed that one of his six professors has sold the school out." },
  { n: "Laudren Mallen", at: 4, role: "Scrying professor", fac: "shroud", al: "C", lv: 5, ac: 11, hp: 16, anc: "human",
    desc: "The college's meek scrying instructor. Easy to overlook, which is the point.",
    wants: "Ivanculus's chair.",
    hook: "Secretly joined the Shroud on a promise they'd install him as headmaster. He is being used and half suspects it." },
  { n: "Robirook", at: 5, role: "Ghost of a disgraced singer", fac: "none", al: "N", lv: 4, ac: 12, hp: 18, anc: "human",
    desc: "A virtuoso who vanished down the flooded passages beneath the Round. Some see him weeping in the rafters during great performances.",
    wants: "To be heard again. Or to be let go. Unclear which.",
    hook: "The flooded passages under the grandest stage in the world have never been searched." },
  { n: "Chancellor Yeothin", at: 6, role: "Master Poet", fac: "bards", al: "L", lv: 8, ac: 13, hp: 30, anc: "human",
    desc: "Leads the Bardic College and, per the Player's Guide, the Bards faction across the whole Reaches. Adventured with the Duke in their youth.",
    wants: "Art and truth preserved; the Shroud pulled up by the root.",
    hook: "Works in secret against the Shroud and hires adventurers to do it. The obvious patron for a party." },

  // ---------- GUTTERWASH ----------
  { n: "Brother Igonus", at: 7, role: "Leader of the Charnel-Men", fac: "charnel", al: "N", lv: 5, ac: 12, hp: 20, anc: "human",
    desc: "Pensive and gloomy, he leads 36 black-cloaked cultists who burn the city's dead.",
    wants: "The dead handled properly, and the living to stay out of it.",
    hook: "The Charnel-Men commune with the dead and jealously guard what they learn. He knows things no living person told him." },
  { n: "Shem Turley", at: 8, role: "Publican", fac: "guild", al: "C", lv: 3, ac: 11, hp: 12, anc: "human",
    desc: "A sour old cur who buys leftover ale off inbound ships and pours it all into one barrel. That barrel is the only drink he sells.",
    wants: "To not be standing between the Guild and the Barons when it goes off.",
    hook: "Baron thugs have started drinking in a Guild tavern as a show of force. Tensions are fit to burst." },
  { n: "Guildmaster Seren", at: 9, role: "Guildmaster, Thieves' Guild", fac: "guild", al: "C", lv: 9, ac: 15, hp: 38, anc: "human",
    desc: "An assassin of surpassing charm and guile who trains killers in candlelit chambers. To steal from her House means death.",
    wants: "The Fingerbone of Neem, which she is convinced lies in the trapped tunnels beneath her own house.",
    hook: "She alone knows about those tunnels. Her obsession is making her careless. Her uncle Bastien runs a safehouse in Rilken Row." },
  { n: "Rufius", at: 10, role: "Pit champion", fac: "none", al: "C", lv: 4, ac: 13, hp: 22, anc: "halforc",
    desc: "Current champion of the Birdcage, the after-hours fighting ring. Use orc stats.",
    wants: "To stay champion.",
    hook: "Beating him carries a 50 gp prize. The password at the door is \"fried eggs.\"" },
  { n: "Mortimer Grund", at: 11, role: "Thief", fac: "guild", al: "C", lv: 3, ac: 12, hp: 12, anc: "human",
    desc: "An unhappy former customer of the River Rats with a grudge and a loud mouth.",
    wants: "The five boys ruined, over something petty.",
    hook: "He's spreading a lie that the River Rats carry Rat Plague. Anyone seen in their skiff loses 1 renown until it stops." },
  { n: "Scribald Toderick", at: 12, role: "Barrister", fac: "none", al: "N", lv: 3, ac: 11, hp: 11, anc: "human",
    desc: "Stooped and fretful, working out of a dim, book-strewn office. New clients get half off, which tells you how it's going.",
    wants: "To live through the month.",
    hook: "His last client, a thug called Porkchop, hanged for killing a noble. Porkchop's friends want Scribald's head." },

  // ---------- HIGH HARBOR ----------
  { n: "Humphrey Hammergold", at: 14, role: "Royal Jeweler", fac: "none", al: "L", lv: 4, ac: 12, hp: 18, anc: "dwarf",
    desc: "A wizened dwarf of utmost skill, earnest and wholly obsessed with his craft. Can make jewellery worth up to 800 gp.",
    wants: "To cut something better than the Heart of Sidar before he dies.",
    hook: "The Heart of Sidar, the most famous garnet ever unearthed, is on open display and worth 2,000 gp. Two armed dwarf guards, 8+ renown at the door." },
  { n: "Gaston di Vanglare", at: 15, role: "Noble patriarch", fac: "shroud", al: "N", lv: 4, ac: 12, hp: 16, anc: "human",
    desc: "Sixty and in his prime on a regimen of costly tinctures. Hosts lavish dinners and invites anyone who hits 8 renown.",
    wants: "To keep his network, his health, and his daughter.",
    hook: "Secretly indebted to the Shroud for curing Zara of the Rat Plague. Cloaked figures visit late and leave before dawn." },
  { n: "Zara di Vanglare", at: 15, role: "Noble daughter", fac: "none", al: "N", lv: 1, ac: 11, hp: 5, anc: "human",
    desc: "Cured of the Rat Plague by means her father won't discuss.",
    wants: "To know what was actually done to her.",
    hook: "She is the price Gaston paid, and she may not know the debt is still running." },
  { n: "Zameek", at: 16, role: "Curio dealer", fac: "none", al: "N", lv: 2, ac: 12, hp: 8, anc: "halfling",
    desc: "Energetic halfling with an eye for rare finds. Voracious reader, knows lost civilisations, spots a fake from ten miles.",
    wants: "To identify the thing he just bought.",
    hook: "He recently acquired a carefully wrapped Mirror of Mischief and doesn't yet know what it is." },
  { n: "Remy", at: 18, role: "City Guard", fac: "duke", al: "L", lv: 2, ac: 15, hp: 10, anc: "human",
    desc: "One of two young guards at the Grand Gate. Unusually jumpy and gruff lately.",
    wants: "Out of it, without anyone finding out he was ever in it.",
    hook: "He and Ulgrin have been pulled into a Guild plot to poison the champion racing pig. Too proud and too frightened to back out." },
  { n: "Ulgrin", at: 18, role: "City Guard", fac: "duke", al: "L", lv: 2, ac: 15, hp: 11, anc: "dwarf",
    desc: "The other half of the Grand Gate pair. Knows it's wrong. Says nothing.",
    wants: "Remy to make the decision so he doesn't have to.",
    hook: "Same plot as Remy. Either one will crack under the right pressure; they'll crack differently." },

  // ---------- MONTMAR CASTLE ----------
  { n: "Lyonel Hirkos", at: 19, role: "Knight-Captain of the City Guard", fac: "duke", al: "L", lv: 8, ac: 17, hp: 36, anc: "human",
    desc: "Mustachioed captain of the Duke's 400 guards. An effective mix of disciplined and pragmatic.",
    wants: "Order, by the most efficient route available.",
    hook: "The Donjon runs beneath his garrison, and parts of it are so old and deep that even his own guards don't know who's down there." },
  { n: "Gregor the Just", at: 20, role: "Barrister", fac: "none", al: "L", lv: 4, ac: 11, hp: 14, anc: "human",
    desc: "Half of the city's finest legal team, handling its most intricate cases.",
    wants: "The Doom Book used sparingly and correctly.",
    hook: "He and Laurel secretly hold the Doom Book. The Thieves' Guild has found out and wants it." },
  { n: "Laurel the Lawful", at: 20, role: "Barrister", fac: "none", al: "L", lv: 4, ac: 11, hp: 14, anc: "human",
    desc: "The other half. Limits the book to once per client and charges 1,000 gp for the privilege.",
    wants: "To not draw Madeera's ire, which overuse of the book reportedly does.",
    hook: "A heist target that comes with a goddess attached." },
  { n: "Duke Loren di Montmar", at: 21, role: "Duke of Montmar", fac: "duke", al: "L", lv: 10, ac: 18, hp: 45, anc: "human",
    desc: "Overlord of the largest city-state in the Western Reaches. A knight general before he inherited his father's title.",
    wants: "The city held, and by the GM's Guide, possibly a wife.",
    hook: "His own secret service knows his castle's hidden doors better than he does. Rumour says this year's ball is really a hunt for a bride." },
  { n: "Emule Virdan", at: 22, role: "Chief Concierge", fac: "none", al: "L", lv: 3, ac: 11, hp: 12, anc: "human",
    desc: "Runs the finest inn in the city. Doesn't permit riffraff and knows every trick they use.",
    wants: "The Marmot's reputation intact.",
    hook: "8+ renown to enter. He is the wall between the party and every important visitor in the city." },
  { n: "Cynthia Ulfric", at: 23, role: "Master tailor", fac: "none", al: "N", lv: 2, ac: 11, hp: 8, anc: "human",
    desc: "Talented and young, just inherited her late father's duties dressing the Montmar family itself.",
    wants: "Time. Specifically, time for Teomin.",
    hook: "The only tailor who can make a 500 gp masquerade costume — the ticket into the Duke's Ball. Normally 8+ renown, but she makes exceptions after hours for people who earn her trust." },
  { n: "Tiborian", at: 24, role: "Retired gladiator", fac: "none", al: "C", lv: 6, ac: 15, hp: 30, anc: "human",
    desc: "Surly, retired, teaching an athletic combat style to students he thinks are being stolen from him.",
    wants: "Flashing Steel humiliated.",
    hook: "He and his pupils are planning to raid Mareniel's school. This is a fight the party can be on either side of." },

  // ---------- NINESTONES ----------
  { n: "Fredrick di Montmar", at: 27, role: "Entombed ancestor", fac: "none", al: "C", lv: 5, ac: 13, hp: 20, anc: "human",
    desc: "The Montmar family's most hated ancestor, in a lead casket in the Ducal Tomb.",
    wants: "Unknown. He was buried as a vampire, staked and packed with holy water, though he wasn't one.",
    hook: "Somebody went to enormous trouble over a man who wasn't what they said he was. Why?" },
  { n: "Mina", at: 28, role: "Druid", fac: "none", al: "N", lv: 7, ac: 13, hp: 26, anc: "human",
    desc: "An old, cowled woman who is always in the Tree Grove. Ancient and frail, and protects it with her life.",
    wants: "The grove left alone.",
    hook: "An otherworldly peace holds inside those walls. Nobody asks why, or what she's keeping in there." },
  { n: "High Paladin Evelyn", at: 29, role: "High Paladin of St. Terragnis", fac: "duke", al: "L", lv: 9, ac: 18, hp: 40, anc: "human",
    desc: "Ethereal and restlessly distracted, overseeing the cathedral's many efforts at once.",
    wants: "Chivalry encouraged, the graveyard managed, the poor fed. All of it, simultaneously.",
    hook: "Her distraction is the problem: Charity House is her responsibility and she has entirely stopped looking at it." },
  { n: "Bolgrim Manymead", at: 30, role: "Soup-kitchen proprietor", fac: "beggars", al: "L", lv: 5, ac: 14, hp: 24, anc: "dwarf",
    desc: "An old dwarf soldier who has seen more than his share of hard times. Serves free stew and fresh bread to any beggar who walks in.",
    wants: "Nothing for himself, which is what makes him dangerous to threaten.",
    hook: "The Beggars would do absolutely anything to protect him. Harm him and you've made an enemy of every set of eyes in the city." },

  // ---------- RILKEN ROW ----------
  { n: "Bastien Morlen", at: 31, role: "Safehouse keeper", fac: "guild", al: "N", lv: 3, ac: 11, hp: 12, anc: "human",
    desc: "A gentle old man running a criminal safehouse out of a modest stone home.",
    wants: "His niece out of the life. He knows she won't go.",
    hook: "His niece is Guildmaster Seren. Lay low here more than once a month and the Guild sends an assassin for endangering his cover." },
  { n: "Terese", at: 32, role: "Publican", fac: "none", al: "N", lv: 3, ac: 11, hp: 11, anc: "human",
    desc: "A witchy young woman who keeps a blind pig in a pen in her main room.",
    wants: "The pig comfortable and the questions coming.",
    hook: "10 gp a question, yes or no, 5:6 accurate, one question per person per year. When the pig dies a new one goes in the pen and eventually goes blind and oracular too." },
  { n: "Yargash the Tall", at: 33, role: "Boss of the Bywater Barons", fac: "barons", al: "C", lv: 6, ac: 14, hp: 30, anc: "halforc",
    desc: "Leads 50 angry, brazen dock thugs out of a ramshackle warehouse at the water's edge.",
    wants: "The Thieves' Guild off his people's backs, permanently.",
    hook: "Undercutting the Guild by offering merchants cheaper protection, and robbing the ones who don't take it. This is a war the party can pick a side in." },
  { n: "Norley Targon", at: 34, role: "Fence", fac: "guild", al: "N", lv: 4, ac: 11, hp: 14, anc: "human",
    desc: "An indifferent merchant hiding shrewd business sense behind a perfectly ordinary general store. That ordinariness is why he's the best fence in the city.",
    wants: "To stay boring.",
    hook: "Ask for \"the deal of the day\" to get past the facade. Selling stolen goods here cancels a Guard pursuit — but there's a cumulative 1:6 he sells you out for that item." },
  { n: "Matron Bethel", at: 35, role: "Matron of Charity House", fac: "none", al: "C", lv: 3, ac: 11, hp: 12, anc: "human",
    desc: "Middle-aged, nice but not kind. Has satisfied the church inspector for years.",
    wants: "The skim to keep running and the beds to stay full.",
    hook: "She's stealing gold off the top and lacing the soup with mild poison so the patients keep coming back." },
  { n: "Sister Natalie", at: 35, role: "Acolyte", fac: "duke", al: "L", lv: 1, ac: 11, hp: 6, anc: "human",
    desc: "Young, innocent, and entirely without authority.",
    wants: "To be wrong about the Matron.",
    hook: "She's started to suspect and is frightened of what it would mean. She needs someone with standing to believe her." },

  // ---------- SILVERTOP ----------
  { n: "Thalmus Vicci", at: 37, role: "Tailor", fac: "none", al: "N", lv: 2, ac: 10, hp: 8, anc: "human",
    desc: "Sweet old tailor, works slowly, a week per order, up to 300 gp of garb.",
    wants: "A quiet trade and no questions.",
    hook: "For an extra 100 gp he'll quietly make disguises and knockoff uniforms. Wearing them gives ADV on checks to impersonate." },
  { n: "Sariel Toril", at: 38, role: "Retired gladiator, arena owner", fac: "none", al: "N", lv: 5, ac: 14, hp: 24, anc: "human",
    desc: "Converted an old bull pen into a tavern and fighting pit with her husband Tomin.",
    wants: "Fair bouts and nobody killed.",
    hook: "She banned Vig Dorstin for killing an opponent, and he's still circling the place." },
  { n: "Tomin Toril", at: 38, role: "Retired gladiator, arena owner", fac: "none", al: "N", lv: 5, ac: 14, hp: 25, anc: "human",
    desc: "The other half of the Bull's Pen. Randomised single bouts, killing forbidden, 5 gp per level of your opponent.",
    wants: "The pit to stay a sport.",
    hook: "A reliable, legal way for low-level PCs to earn coin and a reputation." },
  { n: "Vig Dorstin", at: 38, role: "Reaver", fac: "none", al: "C", lv: 5, ac: 14, hp: 26, anc: "human",
    desc: "Unhinged. Banned from the Bull's Pen for brutally slaying an opponent.",
    wants: "Back in, or revenge for being put out.",
    hook: "He lurks near the tavern. He is a fight waiting for a reason, and he'll take almost any." },
  { n: "Iriel Lanowin", at: 39, role: "Banker", fac: "shroud", al: "C", lv: 6, ac: 13, hp: 22, anc: "elf",
    desc: "Composed and elegant, owns the Golden Vault. 1,000 gp of storage per level at a 1% fee, 20 guards around the clock.",
    wants: "The Shroud's business kept invisible.",
    hook: "High-ranking in the Shroud, and quietly pays the Thieves' Guild a 5% cut for protection. The Onyx Eye is closing in on her." },
  { n: "Mallin Barton", at: 40, role: "Weaponsmith", fac: "onyx", al: "L", lv: 3, ac: 13, hp: 14, anc: "human",
    desc: "Middle-aged smith who gives regulars a good discount.",
    wants: "To stay useful to people who matter.",
    hook: "He lets the Onyx Eye run their operation out of his furnace-like cellar. They're circling Iriel Lanowin." },
  { n: "Emeline Torberry", at: 41, role: "Jeweler", fac: "none", al: "L", lv: 2, ac: 11, hp: 8, anc: "human",
    desc: "A humble jeweller of affordable baubles and lucky amulets. Loves silver above everything.",
    wants: "Her work to actually protect the people wearing it.",
    hook: "Her silver has a 1:20 chance of granting immunity to lycanthropy. She may or may not know that." },
  { n: "Gomrey Gorn", at: 42, role: "Apothecary", fac: "none", al: "N", lv: 3, ac: 10, hp: 10, anc: "human",
    desc: "Middle-aged, aproned, eyebrows permanently singed off by his latest experiment.",
    wants: "To finally get the Gom-Bomb formula right.",
    hook: "A sticky jelly cube that explodes seconds after it sticks to something hard. It is nearly ready. It is not nearly stable." },
  { n: "Homlin", at: 43, role: "Master smith", fac: "none", al: "L", lv: 4, ac: 15, hp: 20, anc: "dwarf",
    desc: "One of the twin brothers behind the best smithy in the city, supplied with Stonehall ore.",
    wants: "To owe the Guild nothing.",
    hook: "The brothers refused to cut the Thieves' Guild in. Homlin is slated for \"a chat\" with a guild bruiser as a final warning." },
  { n: "Ragrin", at: 43, role: "Master smith", fac: "none", al: "L", lv: 4, ac: 15, hp: 21, anc: "dwarf",
    desc: "The other twin. Their weapons cost triple and grant +1 to attack; their dwarvish plate costs triple, takes an extra gear slot, and grants +1 AC.",
    wants: "The forge to outlast the pressure.",
    hook: "The best gear in the city, available to anyone who can afford it — and a protection racket about to land on the shop." },

  // ---------- THE ROOKS ----------
  { n: "Babette Sykes", at: 44, role: "General goods dealer", fac: "none", al: "N", lv: 2, ac: 11, hp: 9, anc: "human",
    desc: "Runs a store out of a permanently parked six-wheeled wagon. Decides whether she likes you by how you treat her cats, Morkin and Tinny.",
    wants: "Customers who are decent to animals.",
    hook: "Weekly 1:6 that she's procured a rare consumable magic item she'll sell to a good customer for 50 gp. Be nice to the cats." },
  { n: "Marjorie Wilkins", at: 45, role: "Trinket vendor", fac: "none", al: "N", lv: 2, ac: 11, hp: 8, anc: "human",
    desc: "Runs a snappy daytime operation selling eclectic trinkets from every corner of the realm. Little patience for questions.",
    wants: "To move stock.",
    hook: "Elvish teapots are the gift of the season at 15 gp. Giving one at a first meeting adds +1 to the reaction roll." },
  { n: "Geramino", at: 45, role: "Night vendor", fac: "none", al: "N", lv: 2, ac: 11, hp: 8, anc: "human",
    desc: "Marjorie's brother takes the tent at night — a languid hookah-smoker full of tales of distant lands.",
    wants: "An audience.",
    hook: "He has a knack for picking the right expensive gift. Buy his advice and you get a reaction reroll or +1, once per intended recipient." },
  { n: "Madame Morda", at: 46, role: "Fortune-teller", fac: "none", al: "N", lv: 3, ac: 10, hp: 10, anc: "elf",
    desc: "White-haired old elf running a lucrative act. Burning sage fills the tent with a blue haze that hides how fake the crystal and bone decor is.",
    wants: "The act to keep paying.",
    hook: "15 gp a tarot reading, 50 to speak with the dead, 100 for a love potion. All of it expert trickery — which makes her an excellent liar to hire." },
  { n: "Aron Reese", at: 47, role: "Bloodroot dealer", fac: "guild", al: "C", lv: 3, ac: 12, hp: 12, anc: "human",
    desc: "Youthful vendor doing brisk business in pots and pans that never actually leave the display tables.",
    wants: "The real trade to stay behind the cookware.",
    hook: "Sells dips of bloodroot at 20 gp: ADV on spellcasting for a day, 1d6 CON damage lingering a month, death at 0." },
  { n: "Ygraine Tareek", at: 48, role: "Tent publican", fac: "beggars", al: "L", lv: 3, ac: 12, hp: 13, anc: "halforc",
    desc: "Motherly half-orc running a rollicking tent tavern draped in fresh daisy chains every day.",
    wants: "The children fed.",
    hook: "Pays beggar children a generous 1 sp per chain. She is a way into the Beggars for a party that treats her right." },
  { n: "Darien di Morla", at: 49, role: "Nobleman, pig owner", fac: "none", al: "C", lv: 3, ac: 12, hp: 13, anc: "human",
    desc: "Owner of Ol' Tangerine, a rotund sow with an explosive gallop and the reigning Divine Swine.",
    wants: "Victory, and will do anything to ensure it.",
    hook: "Winning the Divine Swine is 500 gp and +5 renown. Two Grand Gate guards have been pulled into a Guild plot to poison his pig." },
  { n: "Leland Putsky", at: 50, role: "Food vendor", fac: "none", al: "N", lv: 2, ac: 11, hp: 9, anc: "human",
    desc: "Runs a sizzling stall of spiced meats, rare teas, and unrecognisable carcasses on hooks.",
    wants: "Someone to take the challenge.",
    hook: "Eat a raw retch snail and keep it down on a DC 15 CON check for 20 gp and +2 renown, once only. Snake kabobs 2 gp: +1 next carousing roll, 1:6 food poisoning." },

  // ---------- ELSEWHERE / MENTIONED ----------
  { n: "Evermandin Biscol", at: null, role: "Priest of Memnon", fac: "none", al: "C", lv: 5, ac: 13, hp: 20, anc: "human",
    desc: "A priest of Memnon with an unorthodox interpretation of the god's tenets.",
    wants: "Depends entirely on which reading he's working from this week.",
    hook: "An openly chaotic clergyman in a lawful city. Someone is letting him operate. Who, and for what?" },
  { n: "Porkchop", at: 12, role: "Thug (deceased)", fac: "guild", al: "C", lv: 2, ac: 12, hp: 0, anc: "human",
    desc: "A thug hanged for killing a noble. Scribald Toderick was his barrister.",
    wants: "Nothing any more.",
    hook: "His friends blame the barrister and are out for Scribald's head. They are findable, and they are hiring." },
];

/* ======================== BOUNTIES ========================
   Only the pursued, wanted and exiled carry one. Scaled off the
   severity of the record, the level, and how known they are.
   ========================================================= */
const BOUNTY_POSTER = [
  { who: "The Duke's magistrates", note: "Posted publicly at the Garrison and the Grand Gate.", legal: true },
  { who: "The City Guard, quietly", note: "Not posted. Passed by word of mouth to patrol sergeants.", legal: true },
  { who: "A merchant house that won't be named", note: "Paid through an intermediary at the Golden Vault.", legal: false },
  { who: "The Thieves' Guild", note: "Guild business. The Guard would rather not know.", legal: false },
  { who: "The Bywater Barons", note: "Half now, half on delivery, and they've been known to argue about the second half.", legal: false },
  { who: "A grieving family", note: "Everything they had, pooled. It is not a large sum and they know it.", legal: true },
  { who: "The Onyx Eye", note: "No paper exists. Deny this conversation happened.", legal: true },
];
const BOUNTY_TERMS = [
  { t: "Alive, and unharmed. The condition is specific and non-negotiable.", mult: 1.5 },
  { t: "Alive. Bruised is acceptable.", mult: 1.2 },
  { t: "Either way. Nobody's asking questions.", mult: 1.0 },
  { t: "Dead, and publicly. The point is that people see it.", mult: 1.3 },
  { t: "Alive, and delivered to a specific room, not a cell.", mult: 1.4 },
];
const BOUNTY_CLAIM = [
  { at: 19, how: "Present the claim at the Garrison. Expect to be questioned yourself." },
  { at: 20, how: "Best Defense handles the paperwork, for a cut." },
  { at: 18, how: "Claim at the Grand Gate guardhouse. Fast, public, and everyone sees your face." },
  { at: 39, how: "Drawn against an account at the Golden Vault. Discreet, and the banker remembers you." },
  { at: 34, how: "Norley pays out in goods, not coin, and at his valuation." },
  { at: 12, how: "Through Scribald Toderick at Shieldstone Law, who is cheap and slow." },
];
const BOUNTY_TWIST = [
  "Another party is already working this one and is ahead of you.",
  "The posted sum was raised twice in a fortnight. Somebody is getting desperate.",
  "The charge on the notice is not the crime they actually committed.",
  "Whoever posted it does not want them brought in alive, whatever the notice says.",
  "The bounty is bait. Taking the job puts you on a list.",
  "They have already tried to buy the bounty out and were refused.",
  "A City Guard sergeant is quietly hoping nobody collects.",
  "There is a second, larger sum on offer from someone who wants them to escape.",
];

/* A suit of plate mail costs 120 gp. That is the yardstick: a bounty
   big enough to buy one is a serious, notorious sum, and most are far
   under it. Everything below is priced against that. */
const PLATE = 130; // Shadowdark core plate mail
function bountyScale(amount) {
  const r = amount / PLATE;
  if (r < 0.1) return "pocket money — a few nights' board";
  if (r < 0.25) return "about a suit of leather and a decent blade";
  if (r < 0.6) return "most of a suit of chainmail";
  if (r < 1.1) return "near enough a suit of plate mail";
  if (r < 2.2) return "two suits of plate. People will take this seriously";
  return "more than most guards see in a lifetime of service";
}
function rollBounty(npc) {
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
const ABILITIES = {
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

function rollAbilities(npc) {
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

const T_ON = { origin: true, faith: true, open: true, sit: true, cond: true, record: true, stats: true, shop: true, rumor: true, voice: true, conn: true, physical: true, attire: true, life: true, interior: true, places: true };
const T_OFF = { origin: false, faith: false, open: false, sit: false, cond: false, record: false, stats: false, shop: false, rumor: false, voice: false, conn: false, physical: false, attire: false, life: false, interior: false, places: false };
const ON = (...keys) => { const o = { ...T_OFF }; keys.forEach((k) => (o[k] = true)); return o; };

const TEMPLATES = [
  { id: "quick", name: "Quick roll", blurb: "Anyone at all, everything on", p: {}, t: { ...T_ON } },
  { id: "commoner", name: "Commoner", blurb: "An ordinary resident of 90,000", p: { mundane: true, tier: "common", record: "light" }, t: ON("open", "stats", "physical", "voice", "life", "rumor", "sit") },
  { id: "shopkeep", name: "Shopkeeper", blurb: "A business, stock, and prices", p: { jobs: SHOP_JOBS, mundane: true, record: "light" }, t: ON("open", "shop", "stats", "physical", "voice", "rumor", "conn", "sit") },
  { id: "throwaway", name: "Throwaway", blurb: "A name, a face, a stat line", p: { tier: "common" }, t: ON("open", "stats", "physical") },
  { id: "crowdfolk", name: "Tavern staff", blurb: "Whoever's working the room", p: { jobs: ["innkeep", "servant", "drunk", "gambler", "bard", "informant"], mundane: true }, t: ON("open", "stats", "physical", "voice", "rumor", "sit") },
  { id: "street", name: "Street folk", blurb: "Beggars, children, labourers", p: { jobs: ["beggar", "child", "laborer", "rower", "drunk", "mourner"], record: "light" }, t: ON("open", "stats", "physical", "voice", "rumor", "sit", "life") },
  { id: "market", name: "Market trader", blurb: "Stalls, stock, thin margins", p: { jobs: ["vendor", "artisan", "merchant", "fortuneteller", "smuggler"] }, t: ON("open", "shop", "stats", "physical", "voice", "rumor", "sit") },
  { id: "muscle", name: "Guild muscle", blurb: "House of Seren, on the job", p: { cat: "crime", faction: "guild", tier: "pro", record: "likely" }, t: { ...T_ON, shop: false } },
  { id: "guard", name: "City Guard", blurb: "The Duke's law, on or off duty", p: { faction: "duke", cat: "martial" }, t: { ...T_ON, shop: false } },
  { id: "court", name: "Court & nobility", blurb: "Renown, silk, obligations", p: { cat: "noble", band: "4" }, t: { ...T_ON, shop: false } },
  { id: "college", name: "College & arcane", blurb: "Gedgarrin and the Bardic halls", p: { cat: "arcane" }, t: { ...T_ON, shop: false } },
  { id: "clergy", name: "Clergy & the dead", blurb: "Temples, cults, Charnel-Men", p: { cat: "clergy" }, t: { ...T_ON, shop: false } },
  { id: "dock", name: "Dockside", blurb: "Canal and cargo people", p: { jobs: ["laborer", "rower", "sailor", "smuggler", "thug"] }, t: { ...T_ON, shop: false } },
  { id: "shroud", name: "Masked conspirator", blurb: "The Shroud, wearing another face", p: { faction: "shroud", tier: "pro" }, t: { ...T_ON, shop: false } },
  { id: "problem", name: "Someone with a problem", blurb: "Situation-first, ready to hook", p: { conditions: "two", record: "likely" }, t: { ...T_ON, shop: false } },
  { id: "dangerous", name: "Someone dangerous", blurb: "High level, with a file", p: { tier: "dangerous", record: "certain" }, t: { ...T_ON, shop: false } },
];

const PLANT_BAD = ["have been informing for the Onyx Eye", "cheated a guild man at cards and bragged about it", "are carrying the Rat Plague and hiding it", "insulted a noble's mask at the last ball", "were seen leaving the graveyard at dawn", "water their stock and short their weights", "took Shroud money last winter", "are not who their papers say they are"];
const PLANT_GOOD = ["pulled a child out of the canal and wouldn't take payment", "gave a week's takings to Madeera's Hearth", "danced at the Duke's Ball and were noticed", "stood up to a guild collector in front of witnesses", "are owed a favour by someone very high up", "sold honest goods at a loss rather than break their word"];

/* ============================= ENGINE ============================= */

/* All randomness routes through RNG so it can be swapped for a seeded
   stream. The book's named NPCs are hydrated under a seed derived from
   their name, so their details never change between visits. */
let RNG = Math.random;
function seededRNG(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
const d = (n) => Math.floor(RNG() * n) + 1;
const pick = (a) => a[Math.floor(RNG() * a.length)];
const chance = (p) => RNG() < p;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmt = (n) => (n >= 0 ? `+${n}` : `${n}`);
const cap = (s) => (typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s);
const byKind = (k) => LOCATIONS.filter((l) => l.k.includes(k));
const locByN = (n) => LOCATIONS.find((l) => l.n === n);

function weighted(pairs) {
  const total = pairs.reduce((s, p) => s + p[1], 0);
  let r = RNG() * total;
  for (const [v, w] of pairs) { r -= w; if (r <= 0) return v; }
  return pairs[0][0];
}

function placesForRole(roleId) {
  return LOCATIONS.filter((l) => l.k.some((k) => (ROLE_POOLS[k] || []).includes(roleId)));
}

function FILL(str, ctx) {
  return str.replace(/\{gp\}/g, ctx.gp).replace(/\{days\}/g, ctx.days).replace(/\{name\}/g, ctx.name)
    .replace(/\{loc\}/g, ctx.loc).replace(/\{tavern\}/g, ctx.tavern).replace(/\{market\}/g, ctx.market)
    .replace(/\{arena\}/g, ctx.arena).replace(/\{crim\}/g, ctx.crim).replace(/\{charity\}/g, ctx.charity)
    .replace(/\{faction\}/g, ctx.faction);
}

function makeContext(npc) {
  return {
    gp: pick([15, 20, 30, 40, 50, 75, 100, 120, 200, 300]), days: d(6) + 1, name: pick(NAMED),
    loc: npc.haunt ? npc.haunt.name : pick(LOCATIONS).name,
    tavern: pick(byKind("tavern")).name, market: pick(byKind("market")).name,
    arena: pick(byKind("arena")).name, crim: pick(byKind("criminal")).name,
    charity: pick(byKind("charity")).name, faction: npc.fac.label,
  };
}

function abilityMods(prime, lv, competence) {
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

function pickFaction(s, roleId, arch) {
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

const REACT_ORDER = ["Hostile", "Suspicious", "Neutral", "Curious", "Friendly"];
// Shadowdark core: 0–6 Hostile, 7–8 Suspicious, 9 Neutral, 10–11 Curious, 12+ Friendly
const reactionLabel = (sum) => (sum <= 6 ? "Hostile" : sum <= 8 ? "Suspicious" : sum === 9 ? "Neutral" : sum <= 11 ? "Curious" : "Friendly");
function reactionRoll(mod = 0) {
  const a = d(6), b = d(6), sum = a + b + mod;
  return { dice: [a, b], mod, sum, label: reactionLabel(sum) };
}

function rollRecord(npc, s) {
  if (s.record === "none") return { state: RECORD_STATES[0], crime: null, detail: "Never been taken.", tone: C.green };
  const heat = npc.arch.crim * 2 + FACTIONS[npc.facId].crim + (npc.al === "C" ? 2 : npc.al === "L" ? -1 : 0) + (npc.band <= 1 ? 1 : 0);
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

function rollConditions(npc, s) {
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

function rollSituation(npc) {
  const facPool = SIT_BY_FACTION[npc.facId] || [];
  let pool = facPool.length && chance(0.6) ? facPool : SIT_GENERAL;
  if (npc.roleId === "child") pool = CHILD_SIT;
  const raw = pick(pool), ctx = makeContext(npc);
  return { s: FILL(raw.s, ctx), a: FILL(raw.a, ctx), c: raw.c };
}

function rollPlaces(npc) {
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
function rollShop(npc) {
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
function rollRumors(npc) {
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

function rollVoice() {
  return { register: pick(VOICE_REGISTER), phrase: pick(VOICE_PHRASE), address: pick(VOICE_ADDRESS), stop: pick(VOICE_STOP) };
}

function rollConnections(npc) {
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
const BOOK_AGE = {
  "Gaston di Vanglare": "in his sixties and holding it off with tinctures",
  "Cynthia Ulfric": "young, and newly in charge",
  "Bolgrim Manymead": "old", "Mina": "very old", "Madame Morda": "very old",
  "Humphrey Hammergold": "old", "Ivanculus": "old", "Bastien Morlen": "old",
  "Matron Bethel": "middle-aged", "Mallin Barton": "middle-aged",
  "Gomrey Gorn": "middle-aged", "Shem Turley": "old",
  "Teomin": "young", "Zara di Vanglare": "young", "Sister Natalie": "young",
  "Terese": "young", "Aron Reese": "young", "Remy": "young", "Ulgrin": "young",
  "Duke Loren di Montmar": "in his prime", "Lyonel Hirkos": "in his prime",
  "Tiborian": "past his prime", "Scribald Toderick": "past his prime",
  "Guildmaster Seren": "in her prime", "Chancellor Yeothin": "past his prime",
};
const BOOK_DOING = [
  "mid-conversation with someone who leaves as you arrive",
  "not surprised to see you",
  "finishing something before they look up",
  "already watching the door you came through",
  "exactly where they always are",
  "taking their time about acknowledging you",
];
function buildOpener(npc, isBook) {
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

function helpPrice(npc) {
  if (npc.band >= 4) return "Not coin. Standing, access, or something only you can do.";
  if (npc.band <= 1) return `${pick([2, 5, 10, 15])} gp would change their week entirely.`;
  return `${pick([10, 20, 25, 40])} gp, or a favour of roughly that weight.`;
}


/* --- v5 helpers ---------------------------------------------------- */
function drawN(arr, n) {
  const pool = arr.slice(), out = [];
  for (let i = 0; i < n && pool.length; i++) out.push(pool.splice(Math.floor(RNG() * pool.length), 1)[0]);
  return out;
}
/* a destitute beggar should not be wearing beaten silver */
function pickMask(band) {
  const cheap = ["cracked papier-mâché", "cheap painted leather", "boiled leather, scorched", "pressed tin"];
  const mid = ["porcelain, hairline-fractured", "velvet over a wire frame", "bone, polished yellow", "black lacquer"];
  const rich = ["gilded wood", "beaten silver", "black lacquer"];
  if (band <= 1) return pick(chance(0.12) ? mid : cheap);       // 1 in 8: a gift, or stolen
  if (band === 2) return pick(cheap.concat(mid));
  if (band === 3) return pick(mid.concat(rich));
  return pick(rich.concat(mid));
}
/* where they're from, and why they're here */
function rollOrigin(anc, cat) {
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
function rollFaith(al, facId, roleId) {
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

function generateNPC(s, keep = {}) {
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
  npc.record = keep.record || rollRecord(npc, s);
  // you cannot be both publicly wanted for a major crime and a celebrity
  if (["wanted", "exiled"].includes(npc.record.state.id)) npc.renown = Math.min(npc.renown, 5);
  npc.bounty = keep.bounty || rollBounty(npc);
  npc.abilities = rollAbilities(npc);
  npc.conds = keep.conds || rollConditions(npc, s);
  npc.sit = keep.sit || rollSituation(npc);
  npc.sd = buildSheet(npc, s);
  syncThreat(npc);

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


/* ---- which chassis each named person runs on, and their gender ---- */
const BOOK_ARCH = {
  "Mareniel Siruul": ["duelist", "f"],
  "Teomin": ["apprentice", "m"],
  "Bertrand Gilliard": ["scholar", "m"],
  "Ivanculus": ["mage", "m"],
  "Laudren Mallen": ["mage", "m"],
  "Robirook": ["bard", "m"],
  "Chancellor Yeothin": ["bard", "m"],
  "Brother Igonus": ["charnelman", "m"],
  "Shem Turley": ["innkeep", "m"],
  "Guildmaster Seren": ["assassin", "f"],
  "Rufius": ["gladiator", "m"],
  "Mortimer Grund": ["thief", "m"],
  "Scribald Toderick": ["barrister", "m"],
  "Humphrey Hammergold": ["artisan", "m"],
  "Gaston di Vanglare": ["noble", "m"],
  "Zara di Vanglare": ["noble", "f"],
  "Zameek": ["merchant", "m"],
  "Remy": ["guard", "m"],
  "Ulgrin": ["guard", "m"],
  "Lyonel Hirkos": ["knight", "m"],
  "Gregor the Just": ["barrister", "m"],
  "Laurel the Lawful": ["barrister", "f"],
  "Duke Loren di Montmar": ["knight", "m"],
  "Emule Virdan": ["innkeep", "m"],
  "Cynthia Ulfric": ["artisan", "f"],
  "Tiborian": ["gladiator", "m"],
  "Fredrick di Montmar": ["noble", "m"],
  "Mina": ["druid", "f"],
  "High Paladin Evelyn": ["knight", "f"],
  "Bolgrim Manymead": ["innkeep", "m"],
  "Bastien Morlen": ["fence", "m"],
  "Terese": ["fortuneteller", "f"],
  "Yargash the Tall": ["thug", "m"],
  "Norley Targon": ["fence", "m"],
  "Matron Bethel": ["physician", "f"],
  "Sister Natalie": ["acolyte", "f"],
  "Thalmus Vicci": ["artisan", "m"],
  "Sariel Toril": ["gladiator", "f"],
  "Tomin Toril": ["gladiator", "m"],
  "Vig Dorstin": ["gladiator", "m"],
  "Iriel Lanowin": ["merchant", "f"],
  "Mallin Barton": ["artisan", "m"],
  "Emeline Torberry": ["artisan", "f"],
  "Gomrey Gorn": ["apothecary", "m"],
  "Homlin": ["artisan", "m"],
  "Ragrin": ["artisan", "m"],
  "Babette Sykes": ["vendor", "f"],
  "Marjorie Wilkins": ["vendor", "f"],
  "Geramino": ["vendor", "m"],
  "Madame Morda": ["fortuneteller", "f"],
  "Aron Reese": ["smuggler", "m"],
  "Ygraine Tareek": ["innkeep", "f"],
  "Darien di Morla": ["noble", "m"],
  "Leland Putsky": ["vendor", "m"],
  "Evermandin Biscol": ["priest", "m"],
  "Porkchop": ["thug", "m"],
};

/* Hydrate a named NPC into a full dossier — the same depth as a scan.
   Seeded from their name, so Guildmaster Seren's smell, mask, tell and
   rumours are the same every single time you open her entry.
   Canon (name, role, level, AC, HP, faction, alignment, and the book's
   own description) always overwrites whatever the generator produced. */
function hydrateBookNpc(b, settings) {
  const prev = RNG;
  RNG = seededRNG(hashStr(b.n));
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
  } finally { RNG = prev; }
}

/* ---- muster: a body of people from one faction at once ---- */
const FACTION_STRENGTH = {
  duke: "400 City Guard under Knight-Captain Hirkos, plus the Duke's knights",
  guild: "Killers and rogues trained in candlelit chambers under Guildmaster Seren",
  barons: "50 angry dock thugs under Yargash the Tall",
  charnel: "36 black-cloaked Charnel-Men under Brother Igonus",
  shroud: "Unknown. That is rather the point",
  beggars: "Every set of eyes in the city, and nobody counts them",
  onyx: "The Duke's secret service. No roster exists",
  bardic: "The college and its eight tutors under Master Poet Yeothin",
  bards: "A lawful order across the whole Reaches, led from the Bardic College",
  gedgarrin: "Seven towers, six professors, and a headmaster taught by dragons",
  weeps: "The Plague Mother's cult, in the undercroft beneath a dead god's temple",
  rowers: "Every skiff on the canals, the fastest being five teenage boys",
  jeweled: "Secretive cells in every major city, led from Alkesh by Afarim Zarad",
  torch: "No leader, local majority vote, a favourite tavern in every city",
  wolves: "Lydonian protectors, rarely seen this far east",
  none: "Unaffiliated city folk",
};
function muster(facId, count, settings) {
  return Array.from({ length: count }, () => generateNPC({ ...settings, faction: facId, tmplName: FACTIONS[facId].label }, {}));
}
/* ================== v8: OVERRIDE, NOTES, PARTY ==================
   Nothing this tool generates is a fact. Every field is a default you
   can type over, and your version wins from then on.
   ================================================================ */

/* Sort presets — one tap reorders every panel for what you need first */
const VIEW_PRESETS = {
  full:    { label: "Full read", order: null },
  combat:  { label: "Combat first", order: ["stats", "abilities", "bounty", "record", "cond", "attire", "open", "sit", "places", "physical", "voice", "rumor", "conn", "interior", "life", "faith", "origin", "shop"] },
  social:  { label: "Talking first", order: ["open", "voice", "sit", "rumor", "interior", "conn", "faith", "origin", "physical", "shop", "record", "bounty", "cond", "stats", "abilities", "attire", "life", "places"] },
  street:  { label: "First glance", order: ["open", "physical", "attire", "voice", "places", "life", "sit", "stats", "cond", "record", "bounty", "abilities", "shop", "rumor", "conn", "interior", "faith", "origin"] },
  shop:    { label: "Shopping", order: ["shop", "open", "voice", "sit", "rumor", "physical", "attire", "conn", "stats", "record", "bounty", "abilities", "cond", "interior", "life", "places", "faith", "origin"] },
};

/* What a PC's renown opens, straight from the book's door policies */
const RENOWN_DOORS = [
  { at: 5,  what: "Club Levantis (17) — front door" },
  { at: 8,  what: "The Royal Jeweler (14)" },
  { at: 8,  what: "The Golden Marmot (22)" },
  { at: 8,  what: "The Silk Lion (23) — masquerade costumes" },
  { at: 8,  what: "Gaston di Vanglare's dinners (15)" },
];

/* Fields you can type over. path is dotted; num coerces to a number. */
const EDIT_FIELDS = [
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

function getPath(o, p) { return p.split(".").reduce((a, k) => (a == null ? a : a[k]), o); }
function setPath(o, p, v) {
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

const ancLabel = { human: "Human", dwarf: "Dwarf", elf: "Elf", halfling: "Halfling", halforc: "Half-orc", halfelf: "Half-elf", goblin: "Goblin", kobold: "Kobold" };
const alLabel = { L: "Lawful", N: "Neutral", C: "Chaotic" };
const MONO = "ui-monospace,Menlo,Consolas,monospace";
const STORE_KEY = "meridia-os:v7";

const BLOCK_DEFS = [
  ["open", "Read-aloud opener"], ["origin", "Origin in the Reaches"], ["faith", "Faith & the Nine"],
  ["bounty", "Bounty"], ["sit", "Live situation"], ["cond", "Conditions"], ["record", "Criminal record"],
  ["stats", "Stats & threat"], ["abilities", "Combat abilities"], ["shop", "Shop & trade"],
  ["rumor", "Rumours"], ["voice", "Voice kit"], ["conn", "Connections"], ["physical", "Physical read"],
  ["attire", "Attire & pockets"], ["life", "Pattern of life"], ["interior", "Interior life"],
  ["places", "Places they mention"],
];
const DEFAULT_ORDER = BLOCK_DEFS.map((b) => b[0]);
const BLOCK_LABEL = Object.fromEntries(BLOCK_DEFS);
const CARD_BLOCKS = ["open", "bounty", "sit", "stats", "abilities", "shop", "rumor"]; // v8–v12, unused now
// the NPC file: each tab holds the sheet sections that belong together
const FILE_TABS = [
  { id: "overview", n: "Overview", blocks: ["open", "sit", "cond"] },
  { id: "identity", n: "Identity", blocks: ["origin", "faith", "physical", "attire", "life"] },
  { id: "talk", n: "Talk", blocks: ["voice", "interior", "rumor", "conn", "places"] },
  { id: "record", n: "Record", blocks: ["record", "bounty"] },
  { id: "trade", n: "Trade", blocks: ["shop"] },
  { id: "combat", n: "Combat", blocks: ["stats", "abilities"] },
  { id: "notes", n: "Notes", blocks: [] },
];
const EDIT_TAB = { IDENTITY: "identity", THREAT: "combat", "IN THE MOMENT": "overview", LOOK: "identity", INTERIOR: "talk", LIFE: "identity", TROUBLE: "record", TRADE: "trade", SHEET: "combat" };

// labels are user-facing; ids are what saved data points at — never change ids
const APPS = [
  { id: "npcs", name: "NPCs", short: "NPCs", sub: "Generate, book, groups, saved", tone: "amber", glyph: "eye" },
  { id: "city", name: "Locations", short: "Locations", sub: "Fifty sites, eight districts", tone: "cyan", glyph: "map" },
  { id: "party", name: "Party", short: "Party", sub: "Your PCs and their renown", tone: "green", glyph: "shield" },
  { id: "config", name: "Config", short: "Config", sub: "Layout, modes, sound, taskbar, your data", tone: "dim", glyph: "gear" },
];
const APP_BY_ID = Object.fromEntries(APPS.map((a) => [a.id, a]));
// everything NPC lives in one app; these tab ids are the v8–v11 app ids, kept so nothing orphans
const NPC_TABS = [
  { id: "scan", name: "Generate", full: "NPC Generator", sub: "Roll a stranger or a crowd", glyph: "eye" },
  { id: "named", name: "Book", full: "Book NPCs", sub: "Everyone the book names", glyph: "person" },
  { id: "muster", name: "Group", full: "Group of NPCs", sub: "Call up a faction in numbers", glyph: "group" },
  { id: "archive", name: "Saved", full: "Saved NPCs", sub: "Everyone you've kept, in folders", glyph: "box" },
  { id: "npcset", name: "Settings", full: "NPC settings", sub: "Filters, sheet sections, presets, sizes", glyph: "gear", prepOnly: true },
];
const LEGACY_APP = { scan: "npcs", named: "npcs", muster: "npcs", archive: "npcs" };
// which apps sit on the taskbar in each mode — editable in Config
const MODE_APPS = {
  prep: ["npcs", "city", "party", "config"],
  play: ["npcs", "city", "party"],
};
const ROSTER_CAP = 600; // ~5 KB each; 600 is about 3 MB of the 5 MB limit

/* ---------------- sound: synthesised, no files ---------------- */
let AC_CTX = null;
let VOL = 1; // master volume, set from Config
function tone(freq, dur, type = "square", gain = 0.04, slide = 0) {
  try {
    if (!AC_CTX) AC_CTX = new (window.AudioContext || window.webkitAudioContext)();
    if (AC_CTX.state === "suspended") AC_CTX.resume();
    const o = AC_CTX.createOscillator(), g = AC_CTX.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, AC_CTX.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), AC_CTX.currentTime + dur);
    g.gain.setValueAtTime(gain * VOL, AC_CTX.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, AC_CTX.currentTime + dur);
    o.connect(g); g.connect(AC_CTX.destination);
    o.start(); o.stop(AC_CTX.currentTime + dur);
  } catch (e) { /* audio unavailable; stay silent */ }
}
const SFX = {
  tap: () => tone(880, 0.05, "square", 0.025),
  back: () => tone(420, 0.06, "square", 0.025, -120),
  open: () => { tone(620, 0.05, "square", 0.03); setTimeout(() => tone(930, 0.07, "square", 0.03), 45); },
  scan: () => { tone(300, 0.1, "sawtooth", 0.03, 700); setTimeout(() => tone(1200, 0.06, "square", 0.025), 100); },
  save: () => { tone(700, 0.05, "triangle", 0.04); setTimeout(() => tone(1050, 0.09, "triangle", 0.04), 55); },
  alert: () => { tone(220, 0.14, "sawtooth", 0.05); setTimeout(() => tone(180, 0.18, "sawtooth", 0.05), 130); },
  toggle: () => tone(1150, 0.03, "square", 0.02),
  muster: () => { [0, 60, 120, 180].forEach((t, i) => setTimeout(() => tone(400 + i * 130, 0.06, "square", 0.028), t)); },
};

function copyText(t, done) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(() => done(true)).catch(() => done(false));
      return;
    }
  } catch (e) { /* no clipboard in this frame */ }
  done(false);
}

function Bracket({ children, pad = "p-3", tone: tn = C.line }) {
  return (
    <div className="relative" style={{ border: `1px solid ${tn}`, background: C.panel }}>
      {[["Top", "Left"], ["Top", "Right"], ["Bottom", "Left"], ["Bottom", "Right"]].map(([v, h]) => (
        <span key={v + h} className="absolute block" style={{ [v.toLowerCase()]: -1, [h.toLowerCase()]: -1, width: 8, height: 8, [`border${v}`]: `2px solid ${C.cyan}`, [`border${h}`]: `2px solid ${C.cyan}` }} />
      ))}
      <div className={pad}>{children}</div>
    </div>
  );
}

function Panel({ label, tone: tn = C.cyan, children, locked, onLock, onReroll, collapsed, onCollapse }) {
  return (
    <div className="mb-3" style={{ breakInside: "avoid", border: `1px solid ${locked ? C.amber : C.line}`, background: `linear-gradient(135deg, ${tn}0a, transparent 30%), #0A1013`, boxShadow: `inset 3px 0 0 ${tn}55` }}>
      <div className="flex items-center gap-2" style={{ borderBottom: collapsed ? "none" : `1px solid ${C.line}` }}>
        <button onClick={onCollapse} disabled={!onCollapse} title={onCollapse ? (collapsed ? "Expand" : "Collapse") : undefined} className="flex items-center gap-1"
          style={{ background: `linear-gradient(90deg, ${tn}40, ${tn}14)`, border: "none", padding: "4px 18px 4px 8px", cursor: onCollapse ? "pointer" : "default",
            clipPath: "polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)",
            color: C.text, fontFamily: MONO, fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textShadow: `0 0 6px ${tn}66` }}>
          {onCollapse && <span style={{ color: tn, width: 10, display: "inline-block" }}>{collapsed ? "▸" : "▾"}</span>}{label}</button>
        <span className="flex-1" />
        {!collapsed && onReroll && <button onClick={onReroll} title="Reroll this section" style={{ background: "none", border: "none", color: C.dim, fontSize: 13, padding: "0 4px", cursor: "pointer" }}>↻</button>}
        {onLock && <button onClick={onLock} title="Locked sections survive RESCAN" style={{ background: locked ? `${C.amber}22` : "none", border: "none", color: locked ? C.amber : C.dim, fontSize: 9, fontFamily: MONO, cursor: "pointer", padding: "4px 8px" }}>{locked ? "LOCKED" : "LOCK"}</button>}
      </div>
      {!collapsed && <div className="px-3 py-2">{children}</div>}
    </div>
  );
}

/* two-tap delete: first tap arms it for 3 seconds, second tap does it.
   (browser confirm() pop-ups are blocked inside Claude artifacts, which
   silently broke v9's DELETE ALL) */
function ConfirmBtn({ onConfirm, render }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3000); return () => clearTimeout(t); }, [armed]);
  return render(armed, () => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); });
}

function Seg({ label, value, options, onChange, tone: tn = C.cyan }) {
  return (
    <div className="mb-3">
      <div style={{ color: C.dim, fontSize: 10, letterSpacing: "0.13em", fontFamily: MONO, marginBottom: 4 }}>{label}</div>
      <div className="flex" style={{ border: `1px solid ${C.lineHot}` }}>
        {options.map(([v, l]) => (
          <button key={String(v)} onClick={() => onChange(v)} className="flex-1 py-1"
            style={{ background: value === v ? tn : "transparent", color: value === v ? "#06090B" : C.dim, border: "none", fontSize: 11, fontFamily: MONO, cursor: "pointer", borderRadius: 0, fontWeight: value === v ? 700 : 400 }}>{l}</button>))}
      </div>
    </div>
  );
}

function Row({ k, v, tone: tn = C.text }) {
  return (
    <div className="flex gap-3 py-1" style={{ borderBottom: `1px solid ${C.line}55` }}>
      <div style={{ color: C.dim, fontSize: 10, minWidth: 84, letterSpacing: "0.07em", fontFamily: MONO, paddingTop: 3 }}>{k}</div>
      <div style={{ color: tn, fontSize: 13, lineHeight: 1.45, flex: 1 }}>{v}</div>
    </div>
  );
}

function Stat({ k, v, tone: tn = C.text }) {
  return (
    <div className="text-center px-1 py-2" style={{ border: `1px solid ${C.line}`, minWidth: 0 }}>
      <div style={{ color: C.dim, fontSize: 9, letterSpacing: "0.1em", fontFamily: MONO }}>{k}</div>
      <div style={{ color: tn, fontSize: 16, fontWeight: 600, fontFamily: MONO }}>{v}</div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block mb-3">
      <span style={{ color: C.dim, fontSize: 10, letterSpacing: "0.13em", fontFamily: MONO }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full mt-1 px-2 py-2"
        style={{ background: "#0A1114", color: C.text, border: `1px solid ${C.lineHot}`, fontSize: 13, outline: "none", borderRadius: 0 }}>
        {options.map(([v, l]) => <option key={v} value={v} style={{ background: "#0A1114" }}>{l}</option>)}
      </select>
    </label>
  );
}

function Group({ title, children }) {
  return <div className="mb-3"><div style={{ color: C.gold, fontSize: 10, letterSpacing: "0.16em", fontFamily: MONO, marginBottom: 6 }}>{title}</div>{children}</div>;
}

function Toggle({ on, label, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 py-2 text-left"
      style={{ background: "none", border: "none", cursor: "pointer" }}>
      <span style={{ width: 30, height: 16, border: `1px solid ${on ? C.cyan : C.lineHot}`, background: on ? `${C.cyan}33` : "transparent", position: "relative", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 1, left: on ? 15 : 1, width: 12, height: 12, background: on ? C.cyan : C.dim }} />
      </span>
      <span style={{ color: on ? C.text : C.dim, fontSize: 13 }}>{label}</span>
    </button>
  );
}

function Btn({ children, onClick, tone: tn = C.lineHot, color = C.dim, fill, flex = true }) {
  return (
    <button onClick={onClick} className={`${flex ? "flex-1 " : ""}py-2 px-3`}
      style={{ border: `1px solid ${tn}`, color: fill ? "#06090B" : color, background: fill || "transparent", fontSize: 11, fontFamily: MONO, letterSpacing: "0.1em", borderRadius: 0, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function Glyph({ kind, color, size = 22 }) {
  const p = { fill: "none", stroke: color, strokeWidth: 1.6 };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {kind === "eye" && <><ellipse cx="12" cy="12" rx="10" ry="6" {...p} /><circle cx="12" cy="12" r="3" {...p} /></>}
      {kind === "person" && <><circle cx="12" cy="8" r="3.5" {...p} /><path d="M5 21c0-4 3.2-6.5 7-6.5S19 17 19 21" {...p} /></>}
      {kind === "group" && <><circle cx="8" cy="9" r="3" {...p} /><circle cx="16" cy="9" r="3" {...p} /><path d="M2 20c0-3 2.7-5 6-5M22 20c0-3-2.7-5-6-5M9 21c0-2.2 1.3-3.5 3-3.5s3 1.3 3 3.5" {...p} /></>}
      {kind === "map" && <><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" {...p} /><path d="M9 3v15M15 6v15" {...p} /></>}
      {kind === "box" && <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" {...p} /><path d="M3 7l9 4 9-4M12 11v10" {...p} /></>}
      {kind === "shield" && <><path d="M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" {...p} /><path d="M12 8v6" {...p} /></>}
      {kind === "gear" && <><circle cx="12" cy="12" r="3.5" {...p} /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...p} /></>}
    </svg>
  );
}

const DEFAULTS = {
  time: "day", holiday: "none", cat: "any", job: "any", jobs: null, tier: "any",
  lvMin: 0, lvMax: 10, align: "any", faction: "any", ancestry: "any", gender: "any",
  band: "any", competence: "mixed", record: "auto", conditions: "auto",
  seenAt: null, tmplName: null, mundane: false, crowd: 4, sound: true,
  uiMode: "prep", partyRail: true,
  // shell settings (Config)
  modeApps: null, collapsed: {}, zoom: 1, leftW: 380, vol: 1, nickChance: 0.3,
  viewPrep: "full", viewPlay: "card", sortPreset: "full", musterN: 5, npcTab: "scan",
  tabPrep: "identity", tabPlay: "overview", rumorTruth: {},
};
// the keys a filter reset / template / preset is allowed to touch — everything else is shell or world
const FILTER_KEYS = ["cat", "job", "jobs", "tier", "lvMin", "lvMax", "align", "faction", "ancestry", "gender", "band", "competence", "record", "conditions", "seenAt", "tmplName", "mundane"];
const onlyFilters = (o) => Object.fromEntries(FILTER_KEYS.filter((k) => o && k in o).map((k) => [k, o[k]]));
const FILTER_DEFAULTS = onlyFilters(DEFAULTS);
const NPC_PAGES = [
  ["params", "Generator filters", "Who gets generated when you hit SCAN"],
  ["blocks", "Sheet sections", "What an NPC sheet shows, and in what order"],
  ["presets", "Presets", "Save and load whole generator setups"],
];
const CONFIG_PAGES = [
  ["taskbar", "Taskbar apps", "Which apps appear in Prep and in Play"],
  ["data", "Your data", "Backup, restore, storage use, reset"],
];


/* --- NAMES, EXPANDED (v13) ------------------------------------------
   Book lists (Shadowdark p.128, via the compilation) alternate f/m.
   Surnames are also built from two halves, so repeats are rare. */
const BOOK_NAME_LISTS = {
  dwarf: "Hera, Torin, Ginny, Gant, Olga, Dendor, Ygrid, Pike, Sarda, Brigg, Zorli, Yorin, Jorgena, Trogin, Riga, Barton, Katrina, Egrim, Elsa, Orgo",
  elf: "Sarenia, Ravos, Imeria, Farond, Isolden, Kieren, Mirenel, Riarden, Allindra, Arlomas, Sylara, Tyr, Rinariel, Saramir, Vedana, Elindos, Ophelia, Cydaros, Tiramel, Varond",
  halfling: "Myrtle, Robby, Nora, Percy, Daisy, Jolly, Evelyn, Horace, Willie, Gertie, Peri, Carlsby, Nyx, Kellan, Fern, Harlow, Moira, Sage, Reenie, Wendry",
  halforc: "Troga, Boraal, Urgana, Zoraal, Scalga, Krell, Voraga, Morak, Draga, Sorak, Varga, Ulgar, Jala, Kresh, Zana, Torvash, Rokara, Gartak, Iskana, Ziraak",
  human: "Hesta, Matteo, Rosalin, Endric, Kiara, Yao, Corina, Rowan, Hariko, Ikam, Mariel, Jin, Hana, Lios, Indra, Remy, Nura, Vakesh, Una, Nabilo",
};
const MORE_NAMES = {
  human: {
    f: ["Adela", "Brienne", "Cass", "Delphine", "Edda", "Fenna", "Greta", "Hollis", "Isolde", "Jessamy", "Katell", "Lisbet", "Maud", "Nell", "Odile", "Petra", "Quenby", "Rosamund", "Sabine", "Tamsin", "Ulla", "Vesna", "Winna", "Ysolt", "Agathe", "Berenice", "Clemence", "Dagny", "Elodie", "Faye", "Gisela", "Hedda", "Ilse", "Joss", "Liesl", "Mireille", "Noor", "Ottilie", "Perrine", "Solenne"],
    m: ["Aldo", "Benedek", "Casimir", "Dorian", "Eamon", "Florian", "Godric", "Hugo", "Ivo", "Jory", "Kasimir", "Lucan", "Matthis", "Nico", "Osric", "Piet", "Quill", "Roland", "Silas", "Tobin", "Ulric", "Valen", "Wendel", "Yannick", "Anselm", "Bram", "Cyprian", "Dietr", "Evrard", "Fabian", "Gaspard", "Henrik", "Isidor", "Joost", "Konrad", "Lothar", "Marek", "Niels", "Oskar", "Pascal"],
    sA: ["Ash", "Black", "Brook", "Cold", "Crow", "Dun", "Fair", "Green", "Hale", "Hart", "Kettle", "Marsh", "Moss", "North", "Oak", "Pen", "Red", "Salt", "Stone", "Thorn", "Tide", "Whit", "Wren", "Iron", "Copper", "Mill", "Rook", "Tallow", "Candle", "Lark"],
    sB: ["ford", "well", "wick", "by", "ton", "ley", "more", "worth", "wood", "field", "gate", "water", "bridge", "ham", "cote", "shaw", "hollow", "mere", "ward", "wright", "man", "smith"],
  },
  dwarf: {
    f: ["Astrid", "Brunhild", "Dagmar", "Frida", "Gunna", "Hilde", "Ingrit", "Kelda", "Magna", "Runa", "Sigrun", "Thyra", "Ulfa", "Vigdis"],
    m: ["Balin", "Borin", "Durgan", "Farek", "Grimm", "Harbek", "Kildrak", "Morgran", "Norri", "Oskar", "Rurik", "Thrain", "Ulfgar", "Vondal"],
    sA: ["Anvil", "Coal", "Deep", "Flint", "Forge", "Gold", "Granite", "Hammer", "Iron", "Rock", "Stone", "Copper", "Ember", "Silver", "Brass"],
    sB: ["beard", "delver", "fist", "hand", "heart", "helm", "mantle", "shield", "vein", "brow", "axe", "hewer", "song", "bottom"],
  },
  elf: {
    f: ["Aelyn", "Caerith", "Elowen", "Faelar", "Ilyana", "Lirael", "Meluene", "Naivara", "Quelenna", "Shanairra", "Thiala", "Valanthe", "Yllana", "Zinnia"],
    m: ["Aerion", "Belarin", "Caladrel", "Erevan", "Galinndan", "Ivellios", "Laucian", "Mindartis", "Paelias", "Quarion", "Riardon", "Soveliss", "Theren", "Varis"],
    sA: ["Amber", "Dawn", "Dusk", "Fern", "Gold", "Leaf", "Moon", "Night", "River", "Silver", "Star", "Sun", "Willow", "Wind", "Mist"],
    sB: ["bloom", "brook", "dancer", "glade", "light", "song", "whisper", "wood", "shade", "petal", "walker", "thread", "veil"],
  },
  halfling: {
    f: ["Adeline", "Bree", "Callie", "Dora", "Ellie", "Flora", "Hattie", "Ivy", "Lottie", "Mabel", "Pansy", "Rosie", "Tilly", "Winnie"],
    m: ["Albert", "Barnaby", "Cobb", "Dudley", "Eldon", "Fosco", "Hob", "Merric", "Ned", "Otto", "Pip", "Rufus", "Samwise", "Tobias"],
    sA: ["Apple", "Barley", "Bramble", "Butter", "Honey", "Hill", "Kettle", "Quick", "Tea", "Thistle", "Under", "Warm", "Good", "Brandy"],
    sB: ["bottom", "burrow", "cake", "foot", "leaf", "hill", "bank", "whistle", "brook", "field", "wick", "hollow", "barrel"],
  },
  halforc: {
    f: ["Baggi", "Engong", "Kansif", "Myev", "Neega", "Ovak", "Ownka", "Shautha", "Sutha", "Vola", "Yevelda", "Grisha"],
    m: ["Dench", "Feng", "Gell", "Henk", "Holg", "Imsh", "Keth", "Mhurren", "Ront", "Shump", "Thokk", "Brug"],
    sA: ["Ash", "Blood", "Bone", "Broken", "Gut", "Iron", "Red", "Scar", "Skull", "Tusk", "Black", "Grim"],
    sB: ["tooth", "jaw", "hide", "fist", "maw", "back", "eye", "brow", "hand", "tusk", "splitter"],
  },
  goblin: {
    f: ["Bix", "Grizzle", "Kizzy", "Mog", "Nib", "Pipsa", "Rikki", "Snik", "Tibbly", "Zet"],
    m: ["Blot", "Crug", "Fizz", "Grub", "Jib", "Mugwort", "Nog", "Rattle", "Skab", "Wort"],
    sA: ["Mud", "Rust", "Soot", "Grub", "Rag", "Nettle", "Rat", "Moss", "Bog", "Tin"],
    sB: ["ear", "nose", "tooth", "foot", "finger", "snout", "belly", "knee", "whisker", "sock"],
  },
  halfelf: { f: [], m: [], sA: ["Hawk", "Grass", "Sand", "Wind", "Red", "Far", "Swift", "Storm", "Dust", "Sky"], sB: ["born", "rider", "runner", "walker", "song", "mane", "strider", "reed"] },
  kobold: {
    f: ["Arix", "Irix", "Kesk", "Lissk", "Merrak", "Sazza", "Tiksa", "Vexi"],
    m: ["Dakk", "Garrix", "Kib", "Meepo", "Rask", "Snek", "Tixx", "Zorrk"],
    sA: ["Ash", "Cinder", "Coal", "Ember", "Flint", "Scale", "Soot", "Spark"],
    sB: ["tail", "claw", "tongue", "scale", "fang", "snout", "horn", "eye"],
  },
};
(() => {
  Object.entries(BOOK_NAME_LISTS).forEach(([anc, str]) => {
    const tgt = NAMES[anc] || NAMES_WR[anc]; if (!tgt) return;
    str.split(", ").forEach((nm, i) => { const k = i % 2 === 0 ? "f" : "m"; if (!tgt[k].includes(nm)) tgt[k].push(nm); });
  });
  Object.entries(MORE_NAMES).forEach(([anc, add]) => {
    const tgt = NAMES[anc] || NAMES_WR[anc]; if (!tgt) return;
    ["f", "m"].forEach((k) => add[k].forEach((nm) => { if (!tgt[k].includes(nm)) tgt[k].push(nm); }));
    add.sA.forEach((a) => add.sB.forEach((b) => { const nm = a + b; if (!tgt.s.includes(nm)) tgt.s.push(nm); }));
  });
})();

/* ==============================================================
   SHADOWDARK CHARACTER SHEETS
   Sources: shadowdark-ruleset-compilation.md (core rules),
   equipment-emporium-shadowdark.md (city gear), Player's Guide to
   the Western Reaches preview (Roustabout, Warlock, Half-elf).
   Anything NOT in those files is marked  // NOT IN REFS — check.
   ============================================================== */
const SD_STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const modOf = (sc) => (sc <= 3 ? -4 : sc <= 5 ? -3 : sc <= 7 ? -2 : sc <= 9 ? -1 : sc <= 11 ? 0 : sc <= 13 ? 1 : sc <= 15 ? 2 : sc <= 17 ? 3 : 4);
const SCORE_BAND = { "-4": [2, 3], "-3": [4, 5], "-2": [6, 7], "-1": [8, 9], "0": [10, 11], "1": [12, 13], "2": [14, 15], "3": [16, 17], "4": [18, 18] };
const scoreFor = (mod) => { const b = SCORE_BAND[String(clamp(mod, -4, 4))]; return b[0] + Math.floor(RNG() * (b[1] - b[0] + 1)); };

// weapons — core table. `lbl` lets a kit rename one ("Oar (as staff)") without changing its stats
const SD_WEAPONS = {
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
const SD_ARMOR = {
  none: { n: "No armour", ac: 10, dex: true, slots: 0 },
  leather: { n: "Leather armour", ac: 11, dex: true, slots: 1, cost: "10 gp" },
  chainmail: { n: "Chainmail", ac: 13, dex: true, slots: 2, cost: "60 gp", note: "Disadv. on stealth and swimming" },
  plate: { n: "Plate mail", ac: 15, dex: false, slots: 3, cost: "130 gp", note: "No swimming; disadv. on stealth" },
};

const SD_ANCESTRY = {
  human: { n: "Human", langs: ["Common"], extra: 1, trait: ["Ambitious", "Gains one additional talent roll at 1st level."] },
  dwarf: { n: "Dwarf", langs: ["Common", "Dwarvish"], trait: ["Stout", "+2 HP at start; rolls HP per level with advantage."] },
  elf: { n: "Elf", langs: ["Common", "Elvish", "Sylvan"], trait: ["Farsight", "+1 to ranged attacks or +1 to spellcasting checks."] },
  goblin: { n: "Goblin", langs: ["Common", "Goblin"], trait: ["Keen Senses", "Can't be surprised."] },
  halforc: { n: "Half-orc", langs: ["Common", "Orcish"], trait: ["Mighty", "+1 to attack and damage with melee weapons."] },
  halfling: { n: "Halfling", langs: ["Common"], trait: ["Stealthy", "Once per day, becomes invisible for 3 rounds."] },
  halfelf: { n: "Half-elf", langs: ["Common", "Elvish"], extra: 1, trait: ["Adaptable", "Rolls talent rolls twice and keeps either result."] },
  kobold: { n: "Kobold", langs: ["Common", "Draconic"], trait: ["(Kobold trait)", "Not in your reference files — fill in from your book."] }, // NOT IN REFS — check
};
const COMMON_LANGS = ["Dwarvish", "Elvish", "Giant", "Goblin", "Merran", "Orcish", "Reptilian", "Sylvan", "Thanian"];
const RARE_LANGS = ["Celestial", "Diabolic", "Draconic", "Primordial"];

const TITLES = {
  fighter: { L: ["Squire", "Cavalier", "Knight", "Thane", "Lord/Lady"], C: ["Knave", "Bandit", "Slayer", "Reaver", "Warlord"], N: ["Warrior", "Barbarian", "Battlerager", "Warchief", "Chieftain"] },
  priest: { L: ["Acolyte", "Crusader", "Templar", "Champion", "Paladin"], C: ["Initiate", "Zealot", "Cultist", "Scourge", "Chaos Knight"], N: ["Seeker", "Invoker", "Haruspex", "Mystic", "Oracle"] },
  thief: { L: ["Footpad", "Burglar", "Rook", "Underboss", "Boss"], C: ["Thug", "Cutthroat", "Shadow", "Assassin", "Wraith"], N: ["Robber", "Outlaw", "Rogue", "Renegade", "Bandit King/Queen"] },
  wizard: { L: ["Apprentice", "Conjurer", "Arcanist", "Mage", "Archmage"], C: ["Adept", "Channeler", "Witch/Warlock", "Diabolist", "Sorcerer"], N: ["Shaman", "Seer", "Warden", "Sage", "Druid"] },
};

const PRIEST_SPELLS = [
  ["Cure Wounds", "Holy Weapon", "Light", "Protection From Evil", "Shield of Faith"],
  ["Augury", "Bless", "Blind/Deafen", "Cleansing Weapon", "Smite", "Zone of Truth"],
  ["Command", "Lay To Rest", "Mass Cure", "Rebuke Unholy", "Restoration", "Speak With Dead"],
  ["Commune", "Control Water", "Flame Strike", "Pillar of Salt", "Regenerate", "Wrath"],
  ["Divine Vengeance", "Dominion", "Heal", "Judgment", "Plane Shift", "Prophecy"],
];
const WIZARD_SPELLS = [
  ["Alarm", "Burning Hands", "Charm Person", "Detect Magic", "Feather Fall", "Floating Disk", "Hold Portal", "Light", "Mage Armor", "Magic Missile", "Protection From Evil", "Sleep"],
  ["Acid Arrow", "Alter Self", "Detect Thoughts", "Fixed Object", "Hold Person", "Invisibility", "Knock", "Levitate", "Mirror Image", "Misty Step", "Silence", "Web"],
  ["Animate Dead", "Dispel Magic", "Fabricate", "Fireball", "Fly", "Gaseous Form", "Illusion", "Lightning Bolt", "Magic Circle", "Protection From Energy", "Sending", "Speak With Dead"],
  ["Arcane Eye", "Cloudkill", "Confusion", "Control Water", "Dimension Door", "Divination", "Passwall", "Polymorph", "Resilient Sphere", "Stoneskin", "Telekinesis", "Wall of Force"],
  ["Antimagic Shell", "Create Undead", "Disintegrate", "Hold Monster", "Plane Shift", "Power Word Kill", "Prismatic Orb", "Scrying", "Shapechange", "Summon Extraplanar", "Teleport", "Wish"],
];
// spells known per level [T1..T5]
const PRIEST_KNOWN = [[2], [3], [3, 1], [3, 2], [3, 2, 1], [3, 2, 2], [3, 3, 2, 1], [3, 3, 2, 2], [3, 3, 2, 2, 1], [3, 3, 3, 2, 2]];
const WIZARD_KNOWN = [[3], [4], [4, 1], [4, 2], [4, 2, 1], [4, 3, 2], [4, 3, 2, 1], [4, 4, 2, 2], [4, 4, 3, 2, 1], [4, 4, 4, 2, 2]]; // NOT IN REFS — from memory of the core book; check

/* Classes. `talent(r)` returns [text, effect] for a 2d6 roll.
   effect: {stat:[choices], amt} | {atk:1} | {ac:1} | {cast:1} | {backstab:1} | {mastery:1} | {extraHp:1} | {spell:1} | {pick:1} | {two:1} */
const SD_CLASSES = {
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
  warlock: {
    n: "Warlock", hd: 6, weapons: ["club", "crossbow", "dagger", "mace", "longsword"], armor: ["leather", "chainmail"], shield: true, src: "Western Reaches", rareLang: 1,
    features: [["Patron", "Serves {deity}, who can grant or withhold its gifts."], ["Patron Boon", "One boon at 1st level — roll on the Player's Guide boon table (p. 72)."]],
    talent: (r) => r === 2 ? ["A Patron Boon from any patron (roll, p. 72)", { boon: 1 }] : r <= 6 ? ["+1 to {stat}", { two: 1 }] : r <= 9 ? ["+1 to melee and ranged attacks", { atk: 1 }] : r <= 11 ? ["Roll two Patron Boons, keep one (p. 72)", { boon: 1 }] : ["+2 stat points", { pick: 1 }],
  },
};

// which class each job trains into (only used from LV1 up)
const ROLE_CLASS = {
  laborer: [["roustabout", 9], ["fighter", 1]], beggar: [["roustabout", 1]], child: [["roustabout", 1]], drunk: [["roustabout", 8], ["fighter", 2]],
  rower: [["roustabout", 7], ["fighter", 3]], sailor: [["fighter", 5], ["roustabout", 4], ["thief", 1]], servant: [["roustabout", 1]],
  vendor: [["roustabout", 1]], artisan: [["roustabout", 1]], merchant: [["roustabout", 7], ["thief", 3]], innkeep: [["roustabout", 7], ["fighter", 3]],
  gambler: [["thief", 6], ["roustabout", 4]], informant: [["thief", 7], ["roustabout", 3]], cutpurse: [["thief", 1]], thief: [["thief", 1]],
  fence: [["thief", 8], ["roustabout", 2]], smuggler: [["thief", 6], ["fighter", 4]], thug: [["fighter", 7], ["thief", 3]], masked: [["thief", 5], ["wizard", 3], ["warlock", 2]],
  assassin: [["thief", 1]], guard: [["fighter", 1]], sergeant: [["fighter", 1]], knight: [["fighter", 1]], spy: [["thief", 8], ["wizard", 2]],
  duelist: [["fighter", 7], ["thief", 3]], gladiator: [["fighter", 1]], bard: [["roustabout", 5], ["wizard", 3], ["thief", 2]], actor: [["roustabout", 7], ["thief", 3]],
  apprentice: [["wizard", 1]], mage: [["wizard", 1]], scholar: [["wizard", 5], ["roustabout", 5]], clerk: [["roustabout", 1]], barrister: [["roustabout", 8], ["wizard", 2]],
  acolyte: [["priest", 1]], priest: [["priest", 1]], cultist: [["warlock", 6], ["priest", 4]], charnelman: [["priest", 8], ["fighter", 2]],
  mourner: [["roustabout", 7], ["priest", 3]], pilgrim: [["priest", 5], ["roustabout", 5]], physician: [["roustabout", 6], ["priest", 4]],
  apothecary: [["roustabout", 6], ["wizard", 4]], fortuneteller: [["roustabout", 5], ["wizard", 3], ["warlock", 2]], noble: [["fighter", 5], ["roustabout", 3], ["wizard", 2]],
  druid: [["priest", 7], ["wizard", 3]],
};

// Shadowdark core d20 backgrounds — NOT IN REFS (list from the core book); check
const ROLE_BACKGROUND = {
  labor: ["Urchin", "Orphaned", "Sailor", "Mercenary", "Banished"], trade: ["Jeweler", "Herbalist", "Minstrel", "Scholar", "Orphaned"],
  crime: ["Thieves' Guild", "Urchin", "Wanted", "Banished", "Mercenary"], martial: ["Soldier", "Mercenary", "Scout", "Ranger", "Noble"],
  arcane: ["Wizard's Apprentice", "Scholar", "Minstrel", "Noble"], clergy: ["Acolyte", "Cult Initiate", "Orphaned", "Chirurgeon"],
  noble: ["Noble", "Scholar", "Minstrel"],
};
const ROLE_BG_FIXED = { child: "Urchin", beggar: "Urchin", sailor: "Sailor", rower: "Sailor", physician: "Chirurgeon", apothecary: "Herbalist", cultist: "Cult Initiate", apprentice: "Wizard's Apprentice", bard: "Minstrel", actor: "Minstrel", noble: "Noble", knight: "Noble", guard: "Soldier", sergeant: "Soldier" };

/* ---- gear catalogue: [name, cost, slots]. slots 0 = free to carry ---- */
const GEAR = {
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
const BAND_EXTRAS = [
  ["bread", "apples", "cord", "stakes", "bottle", "blanket", "sack", "dice", "canvas", "crutch", "whetstone"],
  ["bread", "cheese", "sausage", "cord", "pipe", "dice", "ale", "whetstone", "torches", "tinder", "wineskin", "paint", "magnet"],
  ["cheese", "sausage", "wine", "pipe", "cards", "tinder", "steelflask", "brush", "bell", "ocarina", "whetstone", "comb", "bracers", "baldric"],
  ["wine", "snuff", "steelflask", "hourglass", "chess", "braceletS", "pin", "buckle", "comb", "soapP", "circlet", "lockgood", "mirror", "sashS"],
  ["silverflask", "pendant", "braceletG", "earringJ", "snuff", "torc", "fanS", "soapP", "oilscent", "mirrorS", "sashS", "hourglass", "inkset", "fancytoy"],
];
const OUTFITS = [["Peasant clothes", "5 sp"], ["Common clothes", "3 gp"], ["Common clothes", "3 gp"], ["Courtier's clothes", "15 gp"], ["Noble's finery", "30 gp"]];
const OUTFIT_BY_ROLE = { artisan: ["Artisan's clothes", "3 gp"], scholar: ["Scholar's robes", "3 gp"], mage: ["Scholar's robes", "3 gp"], apprentice: ["Scholar's robes", "3 gp"], priest: ["Clerical vestments", "6 gp"], acolyte: ["Clerical vestments", "6 gp"], bard: ["Entertainer's costume", "6 gp"], actor: ["Entertainer's costume", "6 gp"], pilgrim: ["Travel clothes", "4 gp"], sailor: ["Travel clothes", "4 gp"] };

/* what each job carries: w = weapons (id or [id, label]), a = armour options, sh = shield chance,
   g = always, x = pick some of these */
const ROLE_KIT = {
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
const WALLET = [
  { cp: [2, 4], sp: [0, 0], gp: [0, 0], saved: "Nothing put by." },
  { cp: [3, 6], sp: [1, 2], gp: [0, 0], saved: "A few coppers hidden under a floorboard." },
  { cp: [2, 6], sp: [1, 6], gp: [0, 0], saved: "A handful of silver kept at home." },
  { cp: [1, 6], sp: [2, 6], gp: [1, 3], saved: "Savings at home, or on account with a moneylender." },
  { cp: [0, 0], sp: [2, 6], gp: [2, 6], saved: "Their wealth is in property, accounts and a strongbox — not their purse." },
];
const WALLET_BONUS = { merchant: { sp: [2, 6] }, fence: { gp: [1, 6] }, vendor: { cp: [3, 6] }, gambler: { sp: [2, 6] }, cutpurse: { sp: [1, 6] }, thief: { sp: [1, 6] }, innkeep: { sp: [1, 6] }, smuggler: { gp: [1, 4] } };
const rollDice = ([n, s]) => { let t = 0; for (let i = 0; i < n; i++) t += d(s); return t; };

/* Build the Shadowdark sheet for an NPC. Everything the combat tab shows lives in npc.sd;
   the quick threat numbers (ac, hp, atkBonus, wName, wDmg, armorName) are copied from it
   so the Overview and the sheet always agree. */
function buildSheet(npc, s) {
  const lv = npc.lv, anc = SD_ANCESTRY[npc.anc] || SD_ANCESTRY.human;
  const clsId = lv === 0 ? "level0" : weighted(ROLE_CLASS[npc.roleId] || [["roustabout", 1]]);
  const cls = SD_CLASSES[clsId];
  const scores = Object.fromEntries(SD_STATS.map((k) => [k, scoreFor(npc.mods[k])]));
  const talents = [];
  let atk = 0, acBonus = 0, cast = 0, backstab = 0, extraHpDice = 0, extraSpells = 0, masteryN = 1, advSpell = 0;
  const bump = (choices, amt) => { const k = choices.includes(npc.arch.prime) ? npc.arch.prime : pick(choices); scores[k] = Math.min(18, scores[k] + amt); return k; };
  const applyTalent = (depth = 0) => {
    const roll = () => d(6) + d(6);
    let r = roll();
    if (npc.anc === "halfelf") { const r2 = roll(); if (Math.abs(r2 - 7) > Math.abs(r - 7)) r = r2; } // Adaptable: keep the more interesting
    const [txt, e] = cls.talent(r);
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

  // Elf Farsight: +1 ranged if they carry a ranged weapon, otherwise +1 to spellcasting
  if (npc.anc === "elf" && cls.cast && !weapons.some(([w]) => SD_WEAPONS[w].type === "R")) cast += 1;
  const titleRow = TITLES[clsId] && TITLES[clsId][npc.al];
  const title = titleRow ? titleRow[Math.min(4, Math.floor((lv - 1) / 2))] : "";
  const bg = ROLE_BG_FIXED[npc.roleId] || pick(ROLE_BACKGROUND[npc.arch.cat] || ROLE_BACKGROUND.labor);
  const deity = npc.faith ? npc.faith.name : "";
  const fill = (t) => t.replace("{mastery}", mastery.map((w) => SD_WEAPONS[w].n).join(", ") || "their weapon")
    .replace("{grit}", mods.STR >= mods.DEX ? "Strength" : "Dexterity").replace("{deity}", deity || "their god")
    .replace("{backstab}", String(1 + Math.floor(lv / 2) + backstab)).replace("{spell}", advOn || "one spell");
  const features = [
    { n: anc.trait[0], t: anc.trait[1], src: "Ancestry" },
    ...cls.features.map(([n, t]) => ({ n, t: fill(t), src: cls.n })),
    ...talents.map((x) => ({ n: `Talent (${x.r})`, t: fill(x.t), src: "Rolled" })),
  ];
  if (cast) features.push({ n: "Spellcasting bonus", t: `+${cast} to spellcasting checks (included below).`, src: "Talents" });

  return {
    clsId, cls: cls.n, src: cls.src || "Core", title, background: bg, deity, xp: lv === 0 ? d(4) : Math.floor(RNG() * lv * 10), xpNext: Math.max(1, lv) * 10,
    scores, hp, hpNow: hp, ac, armor: armorId, shield, attacks, features, spells, castStat: cls.cast || null, castBonus: cast,
    langs, gear, free, wallet, saved: wb.saved,
    slots: cap,
    deathTimer: `1d4${mods.CON ? ` ${fmt(mods.CON)}` : ""} rounds (min 1)`,
  };
}
const sdMods = (sd) => Object.fromEntries(SD_STATS.map((k) => [k, modOf(sd.scores[k])]));
const gearSlotsUsed = (sd) => sd.gear.reduce((t, g) => t + (Number(g.slots) || 0), 0) + Math.max(0, Math.ceil((sd.wallet.gp + sd.wallet.sp + sd.wallet.cp - 100) / 100));
const walletText = (w) => [w.gp && `${w.gp} gp`, w.sp && `${w.sp} sp`, w.cp && `${w.cp} cp`].filter(Boolean).join(", ") || "empty pockets";


/* ============================ SHADOWDARK CHARACTER SHEET ============================
   Laid out like the printed sheet — stats · HP · AC / ancestry · class · title / alignment ·
   background · deity / talents · level · XP · attacks / languages · gear · spells —
   rendered as a Meridia HUD. */
const INK = C.text, RULE = C.lineHot, SERIF = MONO;
const PAPER = "#071014";
function SBox({ label, children, tag, style, right, tone: tn = C.cyan }) {
  const corner = (pos) => ({ position: "absolute", width: 8, height: 8, borderColor: tn, borderStyle: "solid", ...pos });
  return (
    <div style={{ border: `1px solid ${tag ? `${tn}88` : C.lineHot}`, background: tag ? `linear-gradient(180deg, ${tn}10, transparent 40px), #081217` : "#081217", position: "relative", padding: tag ? "26px 8px 8px" : "20px 8px 6px", minWidth: 0, boxShadow: tag ? `0 0 12px ${tn}14, inset 0 0 18px #00000060` : "none", ...style }}>
      <span style={corner({ top: -1, left: -1, borderWidth: "2px 0 0 2px" })} />
      <span style={corner({ bottom: -1, right: -1, borderWidth: "0 2px 2px 0" })} />
      <div className="flex items-center" style={{ position: "absolute", top: 0, left: 0, right: 0 }}>
        <span style={{ background: tag ? tn : "transparent", color: tag ? "#041014" : C.dim, fontFamily: MONO, fontWeight: 700, fontSize: tag ? 11 : 9, padding: tag ? "3px 14px 3px 8px" : "4px 8px", letterSpacing: "0.16em", whiteSpace: "nowrap",
          clipPath: tag ? "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" : "none" }}>{label}</span>
        <span className="flex-1" />{right && <span style={{ fontFamily: MONO, fontSize: 10, color: tn, padding: "3px 8px", letterSpacing: "0.08em" }}>{right}</span>}
      </div>
      {children}
    </div>
  );
}
const inkIn = (w) => ({ width: w || "100%", background: "#0A1114", color: C.text, border: `1px solid ${C.green}`, fontFamily: MONO, fontSize: 12, padding: "2px 4px", outline: "none", borderRadius: 0 });
const glow = (c, px = 8) => `0 0 ${px}px ${c}88`;
const hpState = (sd) => {
  if (!sd) return { k: "ok", label: "", tone: C.green };
  if (sd.status === "dead") return { k: "dead", label: "DEAD", tone: C.dim };
  if (sd.hpNow <= 0) return sd.status === "stable" ? { k: "stable", label: "DOWN · STABLE", tone: C.gold } : { k: "dying", label: "DYING", tone: C.blood };
  if (sd.hpNow <= Math.floor(sd.hp / 2)) return { k: "bloodied", label: "BLOODIED", tone: C.amber };
  return { k: "ok", label: "STANDING", tone: C.green };
};
// "1d8/1d10+2" → roll the first form, crit doubles the dice
function rollDamage(expr, crit) {
  const str = String(expr);
  const m = str.split("/")[0].match(/(\d*)d(\d+)/);
  if (!m) return { total: Number(expr) || 0, dice: [] };
  const bm = str.match(/([+-]\s*\d+)\s*$/);
  const count = (Number(m[1]) || 1) * (crit ? 2 : 1), sides = Number(m[2]), bonus = bm ? Number(bm[1].replace(/\s/g, "")) : 0;
  const dice = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides));
  return { total: Math.max(1, dice.reduce((a, b) => a + b, 0) + bonus), dice, bonus };
}

function CharSheet({ n, editing, onEdit, onList, onRoll }) {
  const sd = n.sd, mods = sdMods(sd), used = gearSlotsUsed(sd);
  const castMod = sd.castStat ? mods[sd.castStat] + (sd.castBonus || 0) : null;
  const T = ({ children, s }) => <div style={{ fontFamily: "system-ui, sans-serif", color: INK, fontSize: 14, lineHeight: 1.35, ...s }}>{children}</div>;
  const val = (path, v, num, w) => editing ? <input value={v ?? ""} onChange={(e) => onEdit(path, e.target.value, num)} style={inkIn(w)} /> : <T>{v === "" || v == null ? "—" : v}</T>;
  const half = Math.ceil(sd.gear.length / 2) > 10 ? Math.ceil(sd.gear.length / 2) : 10;
  const rows = Array.from({ length: Math.max(20, sd.gear.length + (editing ? 1 : 0)) }, (_, i) => i);
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 660, background: `repeating-linear-gradient(0deg, transparent 0 23px, ${C.cyan}08 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, ${C.cyan}06 23px 24px), ${PAPER}`, color: INK, padding: 14, border: `1px solid ${C.cyan}55`, boxShadow: `0 0 24px ${C.cyan}12` }}>
        <div className="flex items-end gap-3 mb-3">
          <div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, lineHeight: 0.95, letterSpacing: "0.06em", color: C.text, textShadow: `2px 0 ${C.blood}99, -2px 0 ${C.cyan}99` }}>CHARACTER<br />SHEET</div>
            <div style={{ fontFamily: MONO, fontSize: 8, color: C.dim, letterSpacing: "0.3em", marginTop: 3 }}>SHADOWDARK // WESTERN REACHES</div>
          </div>
          <div style={{ flex: 1 }}><SBox label="NAME"><T s={{ fontSize: 18 }}>{n.name}{n.ident ? ` ${n.ident}` : ""}</T></SBox></div>
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))" }}>
          {/* stats */}
          <div className="grid gap-2" style={{ gridColumn: "span 7", gridTemplateColumns: "repeat(3, minmax(0,1fr))" }}>
            {["STR", "CON", "WIS", "DEX", "INT", "CHA"].map((k) => (
              <div key={k} className="flex items-stretch" style={{ border: `1px solid ${C.lineHot}`, background: "#081217", height: 48, boxShadow: mods[k] >= 2 ? `inset 0 0 14px ${C.amber}22` : "none" }}>
                <div className="flex items-center" style={{ flex: 1, paddingLeft: 8, fontFamily: MONO, fontWeight: 700, fontSize: 13, letterSpacing: "0.14em", color: mods[k] >= 2 ? C.amber : C.cyan }}>{k}</div>
                <div className="flex items-center justify-center" style={{ width: 42, borderLeft: `1px solid ${C.lineHot}`, fontFamily: MONO, fontSize: 18, color: C.text }}>
                  {editing ? <input value={sd.scores[k]} onChange={(e) => onEdit(`sd.scores.${k}`, e.target.value, 1)} style={{ ...inkIn(34), textAlign: "center" }} /> : sd.scores[k]}</div>
                <div className="flex items-center justify-center" style={{ width: 40, borderLeft: `1px solid ${C.lineHot}`, background: `${mods[k] > 0 ? C.green : mods[k] < 0 ? C.blood : C.dim}18`, fontFamily: MONO, fontSize: 15, fontWeight: 700, color: mods[k] > 0 ? C.green : mods[k] < 0 ? C.blood : C.dim }}>{fmt(mods[k])}</div>
              </div>))}
          </div>
          <SBox label="HP" tag tone={hpState(sd).tone} style={{ gridColumn: "span 3" }} right={hpState(sd).label}>
            <div className="flex items-center" style={{ height: 30 }}>
              <div style={{ flex: 1, textAlign: "center", fontFamily: MONO, fontSize: 26, color: hpState(sd).tone, textShadow: glow(hpState(sd).tone) }}>{editing ? <input value={sd.hpNow} onChange={(e) => onEdit("sd.hpNow", e.target.value, 1)} style={{ ...inkIn(44), textAlign: "center" }} /> : sd.hpNow}</div>
              <div style={{ width: 1, alignSelf: "stretch", background: C.lineHot }} />
              <div style={{ flex: 1, textAlign: "center", fontFamily: MONO, fontSize: 22, color: C.dim }}>{editing ? <input value={sd.hp} onChange={(e) => onEdit("sd.hp", e.target.value, 1)} style={{ ...inkIn(44), textAlign: "center" }} /> : sd.hp}</div>
            </div>
            <div style={{ height: 3, background: C.line, margin: "4px 0 2px" }}><div style={{ height: 3, width: `${clamp((sd.hpNow / Math.max(1, sd.hp)) * 100, 0, 100)}%`, background: hpState(sd).tone, boxShadow: glow(hpState(sd).tone, 6) }} /></div>
            <div className="flex" style={{ fontFamily: MONO, fontSize: 8, color: C.dim, letterSpacing: "0.2em" }}><span style={{ flex: 1, textAlign: "center" }}>NOW</span><span style={{ flex: 1, textAlign: "center" }}>MAX{sd.canon ? " · BOOK" : ""}</span></div>
          </SBox>
          <SBox label="AC" tag tone={C.amber} style={{ gridColumn: "span 2" }}>
            <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 28, color: C.amber, textShadow: glow(C.amber) }}>{editing ? <input value={sd.ac} onChange={(e) => onEdit("sd.ac", e.target.value, 1)} style={{ ...inkIn(44), textAlign: "center" }} /> : sd.ac}</div>
            <div style={{ fontFamily: MONO, fontSize: 9, textAlign: "center", color: C.dim }}>{SD_ARMOR[sd.armor] ? SD_ARMOR[sd.armor].n : "No armour"}{sd.shield ? " + shield" : ""}</div>
          </SBox>

          <SBox label="ANCESTRY" style={{ gridColumn: "span 4" }}><T>{(SD_ANCESTRY[n.anc] || {}).n || n.anc}</T></SBox>
          <SBox label="CLASS" style={{ gridColumn: "span 4" }} right={sd.src !== "Core" ? sd.src : null}>{val("sd.cls", sd.cls)}</SBox>
          <SBox label="TITLE" style={{ gridColumn: "span 4" }}>{val("sd.title", sd.title)}</SBox>
          <SBox label="ALIGNMENT" style={{ gridColumn: "span 4" }}><T>{alLabel[n.al]}</T></SBox>
          <SBox label="BACKGROUND" style={{ gridColumn: "span 4" }}>{val("sd.background", sd.background)}</SBox>
          <SBox label="DEITY" style={{ gridColumn: "span 4" }}>{val("sd.deity", sd.deity)}</SBox>

          <SBox label="TALENTS AND SKILLS" tag tone={C.gold} style={{ gridColumn: "span 7", gridRow: "span 2", minHeight: 170 }}>
            {sd.features.map((f, i) => (
              <div key={i} className="flex gap-1" style={{ marginBottom: 4 }}>
                {editing ? <>
                  <input value={f.n} onChange={(e) => onList("features", i, { ...f, n: e.target.value })} style={inkIn(110)} />
                  <input value={f.t} onChange={(e) => onList("features", i, { ...f, t: e.target.value })} style={inkIn()} />
                  <button onClick={() => onList("features", i, null)} style={{ border: "none", background: "none", color: C.blood, cursor: "pointer" }}>✕</button>
                </> : <T s={{ fontSize: 13 }}><span style={{ color: C.gold, fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em" }}>{f.n.toUpperCase()}</span> {f.t} <span style={{ fontSize: 9, color: C.dim, fontFamily: MONO }}>[{f.src}]</span></T>}
              </div>))}
            {editing && <button onClick={() => onList("features", -1, { n: "New talent", t: "", src: "Yours" })} style={{ fontFamily: SERIF, fontSize: 12, background: "none", border: `1px dashed ${C.green}`, color: C.green, cursor: "pointer", padding: "2px 8px" }}>+ add</button>}
          </SBox>
          <div className="grid gap-2" style={{ gridColumn: "span 5", gridTemplateColumns: "2fr 3fr" }}>
            <SBox label="LEVEL"><div style={{ fontFamily: MONO, fontSize: 24, textAlign: "center", color: C.cyan, textShadow: glow(C.cyan) }}>{n.lv}</div></SBox>
            <SBox label="XP">
              <div className="flex items-center" style={{ fontFamily: MONO, fontSize: 18 }}>
                <div style={{ flex: 1, textAlign: "center" }}>{editing ? <input value={sd.xp} onChange={(e) => onEdit("sd.xp", e.target.value, 1)} style={{ ...inkIn(40), textAlign: "center" }} /> : sd.xp}</div>
                <div style={{ width: 1, alignSelf: "stretch", background: C.lineHot }} />
                <div style={{ flex: 1, textAlign: "center", color: C.dim }}>{sd.xpNext}</div>
              </div>
            </SBox>
          </div>
          <SBox label="ATTACKS" tag tone={C.blood} style={{ gridColumn: "span 5" }}>
            {sd.attacks.map((a, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                {editing ? <div className="flex gap-1">
                  <input value={a.n} onChange={(e) => onList("attacks", i, { ...a, n: e.target.value })} style={inkIn()} />
                  <input value={a.bonus} onChange={(e) => { const v = e.target.value; if (/^-?\d*$/.test(v)) onList("attacks", i, { ...a, bonus: v === "" || v === "-" ? v : Number(v) }); }} style={inkIn(40)} />
                  <input value={a.dmg} onChange={(e) => onList("attacks", i, { ...a, dmg: e.target.value })} style={inkIn(70)} />
                  <button onClick={() => onList("attacks", i, null)} style={{ border: "none", background: "none", color: C.blood, cursor: "pointer" }}>✕</button>
                </div> : <div className="flex items-center gap-2">
                  <div style={{ flex: 1, minWidth: 0 }}><T><span style={{ color: C.text }}>{a.n}</span> <span style={{ color: C.amber, fontFamily: MONO }}>{typeof a.bonus === "number" ? fmt(a.bonus) : a.bonus}</span> <span style={{ fontSize: 12, color: C.blood, fontFamily: MONO }}>{a.dmg}</span>
                    <div style={{ fontSize: 10, color: C.dim, fontFamily: MONO }}>{a.range ? `RNG ${a.range}` : ""}{a.props ? ` · ${a.props.toUpperCase()}` : ""}{a.mastery ? " · MASTERY" : ""}</div></T></div>
                  {onRoll && <button onClick={() => onRoll(a)} title="Roll to hit and damage" style={{ border: `1px solid ${C.blood}`, background: `${C.blood}18`, color: C.blood, fontFamily: MONO, fontSize: 10, padding: "3px 8px", cursor: "pointer", letterSpacing: "0.1em" }}>ROLL</button>}
                </div>}
              </div>))}
            {editing && <button onClick={() => onList("attacks", -1, { n: "Weapon", bonus: 0, dmg: "1d4" })} style={{ fontFamily: SERIF, fontSize: 12, background: "none", border: `1px dashed ${C.green}`, color: C.green, cursor: "pointer", padding: "2px 8px" }}>+ add</button>}
          </SBox>

          <div className="grid gap-2" style={{ gridColumn: "span 5", alignContent: "start" }}>
            <SBox label="LANGUAGES">{val("sd.langs", editing ? sd.langs.join(", ") : sd.langs.join(", "))}</SBox>
            <SBox label="SPELLS" tag tone={C.violet} style={{ minHeight: 150 }} right={sd.castStat ? `${sd.castStat} ${fmt(castMod)} · DC 10 + tier` : null}>
              {!sd.spells.length && !editing && <T s={{ opacity: 0.5, fontSize: 12 }}>None.</T>}
              {sd.spells.map((sp, i) => (
                <div key={i} className="flex gap-1 items-center" style={{ marginBottom: 2 }}>
                  {editing ? <>
                    <input value={sp.n} onChange={(e) => onList("spells", i, { ...sp, n: e.target.value })} style={inkIn()} />
                    <input value={sp.tier} onChange={(e) => onList("spells", i, { ...sp, tier: e.target.value })} style={inkIn(30)} />
                    <button onClick={() => onList("spells", i, null)} style={{ border: "none", background: "none", color: C.blood, cursor: "pointer" }}>✕</button>
                  </> : <T s={{ fontSize: 13 }}><span style={{ color: C.violet }}>{sp.n}</span> <span style={{ fontSize: 10, color: C.dim, fontFamily: MONO }}>— T{sp.tier}, DC {10 + Number(sp.tier || 1)}{sp.free ? ", always known" : ""}{sp.learned ? ", learned" : ""}</span></T>}
                </div>))}
              {editing && <button onClick={() => onList("spells", -1, { n: "Spell", tier: 1 })} style={{ fontFamily: SERIF, fontSize: 12, background: "none", border: `1px dashed ${C.green}`, color: C.green, cursor: "pointer", padding: "2px 8px" }}>+ add</button>}
            </SBox>
          </div>
          <SBox label="GEAR" tag tone={C.green} style={{ gridColumn: "span 7" }}
            right={<span>{["gp", "sp", "cp"].map((c) => <span key={c} style={{ marginLeft: 10 }}>{c.toUpperCase()} {editing
              ? <input value={sd.wallet[c]} onChange={(e) => onEdit(`sd.wallet.${c}`, e.target.value, 1)} style={{ ...inkIn(38), textAlign: "center" }} />
              : <b style={{ color: C.gold, borderBottom: `1px solid ${C.gold}66`, padding: "0 6px", textShadow: glow(C.gold, 6) }}>{sd.wallet[c]}</b>}</span>)}</span>}>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", columnGap: 16, marginTop: 4 }}>
              {rows.map((i) => {
                const g = sd.gear[i];
                return (
                  <div key={i} className="flex items-center gap-1" style={{ borderBottom: `1px solid ${C.line}`, minHeight: 22, fontFamily: "system-ui, sans-serif", fontSize: 13, gridColumn: i < half ? 1 : 2, gridRow: (i < half ? i : i - half) + 1 }}>
                    <span style={{ width: 22, fontFamily: MONO, fontSize: 10, color: g ? C.green : C.line }}>{String(i + 1).padStart(2, "0")}</span>
                    {editing && g ? <>
                      <input value={g.n} onChange={(e) => onList("gear", i, { ...g, n: e.target.value })} style={inkIn()} />
                      <input value={g.slots} onChange={(e) => onList("gear", i, { ...g, slots: e.target.value.replace(/[^0-9]/g, "") === "" ? 0 : Number(e.target.value.replace(/[^0-9]/g, "")) })} style={inkIn(26)} title="slots" />
                      <button onClick={() => onList("gear", i, null)} style={{ border: "none", background: "none", color: C.blood, cursor: "pointer" }}>✕</button>
                    </> : editing && i === sd.gear.length ? <button onClick={() => onList("gear", -1, { n: "Item", slots: 1 })} style={{ fontFamily: SERIF, fontSize: 12, background: "none", border: `1px dashed ${C.green}`, color: C.green, cursor: "pointer", padding: "0 8px" }}>+ add</button>
                      : <span style={{ flex: 1, color: g && g.kind ? C.amber : C.text }}>{g ? g.n : ""}{g && g.slots > 1 ? <span style={{ fontSize: 9, color: C.dim, fontFamily: MONO }}> ×{g.slots} SLOTS</span> : ""}</span>}
                  </div>);
              })}
            </div>
            <div className="flex items-baseline gap-2 mt-2" style={{ fontFamily: SERIF }}>
              <b style={{ fontSize: 10, letterSpacing: "0.16em", color: C.green }}>FREE TO CARRY</b><span className="flex-1" />
              <span style={{ fontSize: 10, color: used > sd.slots ? C.blood : C.dim, letterSpacing: "0.1em" }}>LOAD {used}/{sd.slots}</span>
            </div>
            <T s={{ fontSize: 13 }}>{sd.free.map((f) => f.n).join(" · ") || "—"}</T>
            {editing && <textarea value={sd.free.map((f) => f.n).join("\n")} onChange={(e) => onEdit("sd.free", e.target.value, 0)} rows={3} style={{ ...inkIn(), marginTop: 4, resize: "vertical" }} />}
            <div style={{ height: 3, background: C.line, marginTop: 4 }}><div style={{ height: 3, width: `${clamp((used / Math.max(1, sd.slots)) * 100, 0, 100)}%`, background: used > sd.slots ? C.blood : C.green }} /></div>
            <T s={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Pocket change only. {sd.saved}</T>
          </SBox>
        </div>
      </div>
    </div>
  );
}

/* ============================ MAIN COMPONENT ============================ */

const SUB_LABEL = Object.fromEntries([...NPC_PAGES, ...CONFIG_PAGES].map(([id, nm]) => [id, nm]));
const BLOCK_KEYS_ALL = [...DEFAULT_ORDER, "disp", "canon_desc", "canon_wants", "canon_hook"];
// friendly names for fields when global search finds a match inside a saved NPC
const PATH_LABEL = { ...Object.fromEntries(EDIT_FIELDS.filter((f) => f[1]).map(([l, p]) => [p, l])),
  notes: "Your notes", rumors: "Rumours", sit: "Situation", conns: "Connections", record: "Record", bounty: "Bounty", shop: "Shop", origin: "Origin", faith: "Faith", canon: "Book entry", conds: "Condition", vk: "Voice kit", pockets: "Pockets", haunt: "Found at", drinkAt: "Drinks at", runTo: "Runs to", avoid: "Avoids", abilities: "Abilities", plant: "Plant a rumour", seenAt: "Seen at", sd: "Character sheet" };
const SKIP_PATHS = new Set(["arch", "fac", "id", "edited", "react", "mods", "time", "holiday", "tmpl", "cur", "roleId", "facId", "anc", "gender", "al", "band", "isBook"]);
function npcFields(n) {
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
const inputStyle = { background: "#0A1114", color: C.text, border: `1px solid ${C.lineHot}`, fontSize: 13, padding: 8, outline: "none", borderRadius: 0 };
const kicker = (color = C.gold) => ({ color, fontSize: 10, letterSpacing: "0.14em", fontFamily: MONO, marginBottom: 6 });

function Search({ value, onChange, placeholder }) {
  return (
    <div className="flex gap-1 mb-3">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, flex: 1 }} />
      {value && <button onClick={() => onChange("")} className="px-2" style={{ border: `1px solid ${C.lineHot}`, background: "transparent", color: C.dim, cursor: "pointer", borderRadius: 0 }}>✕</button>}
    </div>
  );
}
const hit = (q, ...fields) => { const t = q.trim().toLowerCase(); return !t || fields.some((f) => String(f || "").toLowerCase().includes(t)); };

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

  const play = s.uiMode === "play";
  const musterN = s.musterN || 5;
  const setMusterN = (n) => setS((p) => ({ ...p, musterN: n }));
  const viewPreset = VIEW_PRESETS[s.sortPreset] ? s.sortPreset : "full";
  const setViewPreset = (v) => setS((p) => ({ ...p, sortPreset: v }));
  const zoom = s.zoom || 1;
  useEffect(() => { VOL = s.vol ?? 1; }, [s.vol]);

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
  const snd = (fn) => { if (s.sound) fn(); };
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
        const r = await window.storage.get(STORE_KEY);
        ok = true;
        if (alive && r && r.value) {
          const v = JSON.parse(r.value);
          if (v.roster) setRoster(v.roster);
          if (v.groups) setGroups(v.groups);
          if (v.presets) setPresets(v.presets);
          if (v.pcs) setPcs(v.pcs);
          if (v.settings) { const st = { ...DEFAULTS, ...v.settings }; setS(st); setFileTab(st.uiMode === "play" ? st.tabPlay : st.tabPrep); }
          if (v.show) setShow({ ...Object.fromEntries(DEFAULT_ORDER.map((k) => [k, true])), ...v.show });
          if (v.order && v.order.length === DEFAULT_ORDER.length) setOrder(v.order);
        }
      } catch (e) {
        // a missing key throws too, so check whether the save actually exists before deciding
        try {
          const l = await window.storage.list("meridia-os");
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
        const r = await window.storage.set(STORE_KEY, JSON.stringify({ roster, groups, presets, pcs, settings: s, show, order }));
        setSaveState(r ? "ok" : "failed");
      } catch (e) { setSaveState("failed"); }
    }, 500); // typing in notes no longer rewrites the whole save on every keystroke
    return () => clearTimeout(t);
  }, [roster, groups, presets, pcs, s, show, order, loaded, saveState]);

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
      snd(SFX.alert);
      if (sd.hpNow === 0 && before > 0) flash(`${t.first} is down — dying. Timer ${sd.deathTimer}.`, true);
      else if (sd.hpNow <= half && before > half) flash(`${t.first} is bloodied — morale: DC 15 WIS or flee.`, true);
    } else snd(SFX.save);
  };
  const setHpStatus = (t, status) => { const next = { ...t, sd: { ...t.sd, status } }; syncThreat(next, true); updateAny(next); snd(SFX.toggle); };
  const rollAttack = (t, a) => {
    const nat = 1 + Math.floor(Math.random() * 20);
    const bonus = typeof a.bonus === "number" ? a.bonus : Number(a.bonus) || 0;
    const crit = nat === 20, fumble = nat === 1;
    const dmg = rollDamage(a.dmg, crit);
    snd(fumble ? SFX.alert : SFX.scan);
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
  const openNpc = (n) => { snd(SFX.tap); setNpc(roster.find((x) => x.id === n.id) || n); setShowText(false); setNumDraft({}); };
  const run = (override = {}, keep = {}) => { snd(SFX.scan); setNpc(generateNPC({ ...s, ...override }, keep)); setShowText(false); setNumDraft({}); };
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
    if (part === "secret") n.secret = pick(T.secret);
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
  const doCopy = (text) => copyText(text, (ok) => flash(ok ? "Copied" : "Copy blocked — open the text box on the sheet", !ok));

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
      const payload = JSON.stringify({ roster, groups, presets, pcs, settings: s, show, order });
      const kb = payload.length / 1024, cap5 = 5 * 1024, pct = Math.min(100, (kb / cap5) * 100);
      const doRestore = () => {
        try {
          const v = JSON.parse(restoreDraft);
          if (!v || typeof v !== "object" || !Array.isArray(v.roster)) throw new Error("not a Meridia backup");
          setRoster(v.roster); setGroups(Array.isArray(v.groups) ? v.groups : []); setPresets(Array.isArray(v.presets) ? v.presets : []);
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
        return (
          <div>
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

      case "party": return (
        <div>
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
            {s.sound && <Seg label="VOLUME" value={s.vol} onChange={(v) => { set("vol", v); VOL = v; SFX.tap(); }} options={[[0.4, "Quiet"], [1, "Normal"], [1.8, "Loud"]]} />}
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

        {/* centre: the sheet */}
        <main className="px-4 pb-4" style={{ flex: 1, minWidth: 0, overflowY: "auto" }}>{sheet()}</main>

        {/* right: party rail */}
        {play && s.partyRail && rail()}
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

        {/* in-world time (placeholder until the Phase 1 calendar) and the real clock */}
        <button onClick={() => { snd(SFX.toggle); set("time", s.time === "night" ? "day" : "night"); }} title="In-world time — click to flip day/night"
          className="flex flex-col justify-center px-3 text-right" style={{ borderStyle: "solid", borderColor: C.line, borderWidth: "0 0 0 1px", background: "transparent", borderRadius: 0, cursor: "pointer" }}>
          <span style={{ color: s.time === "night" ? C.violet : C.gold, fontSize: 12, fontFamily: MONO, letterSpacing: "0.1em" }}>{s.time === "night" ? "☾ NIGHT" : "☀ DAY"}</span>
          <span style={{ color: C.dim, fontSize: 10, whiteSpace: "nowrap" }}>{hol.label}</span>
        </button>
        <div className="flex flex-col justify-center px-3 text-right" style={{ borderLeft: `1px solid ${C.line}`, minWidth: 96 }}>
          <span style={{ color: C.text, fontSize: 13, fontFamily: MONO }}>{realTime}</span>
          <span style={{ color: C.dim, fontSize: 10, whiteSpace: "nowrap" }}>{realDate}</span>
        </div>
      </footer>

      {toast && <div className="px-3 py-2" style={{ position: "absolute", right: 12, bottom: 62, zIndex: 30, border: `1px solid ${toast.bad ? C.blood : C.green}`, color: toast.bad ? C.blood : C.green, background: "#06090B", fontSize: 11, fontFamily: MONO }}>{toast.m}</div>}
    </div>
  );
}
