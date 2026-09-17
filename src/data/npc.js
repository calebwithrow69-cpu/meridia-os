import { C } from "../lib/theme.js";

export const DISTRICTS = {
  ged: { name: "Gedgarrin", cat: "University", cls: "Wealthy", guard: "1d6 rounds" },
  gut: { name: "Gutterwash", cat: "Low", cls: "Poor", guard: "3d6 rounds" },
  hig: { name: "High Harbor", cat: "High", cls: "Wealthy", guard: "1d4 rounds" },
  mon: { name: "Montmar Castle", cat: "Castle", cls: "Wealthy", guard: "1d4 rounds" },
  nin: { name: "Ninestones", cat: "Temple", cls: "Wealthy", guard: "1d6 rounds" },
  ril: { name: "Rilken Row", cat: "Slum", cls: "Poor", guard: "1 hour" },
  sil: { name: "Silvertop", cat: "Artisan", cls: "Working", guard: "1d6 rounds" },
  roo: { name: "The Rooks", cat: "Market", cls: "Working", guard: "1d6 rounds" },
};


export const LOCATIONS = [
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


export const ROLE_POOLS = {
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

export const ARCHETYPES = {
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


export const CATS = { any: "Any work", labor: "Labor & service", trade: "Trade & craft", crime: "Criminal", martial: "Martial & law", arcane: "Arts & arcane", clergy: "Clergy & dead", noble: "Nobility" };


export const NAMES = {
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


export const ANCESTRY_WEIGHTS = [["human", 66], ["dwarf", 10], ["halfling", 9], ["elf", 8], ["halforc", 5], ["goblin", 2]];

/* --- LODGING: the v1 bug, fixed twice over. Wealth band picks the
   table, and `cat` gates entries that only make sense for certain
   work â€” a fence does not get college quarters, a scholar does not
   get a bolt-hole with three ways out. Entries with no `cat` are
   open to anyone in that band. --- */

export const LODGING = [
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


export const CRIMES_MINOR = [
  "petty theft â€” lifted a purse at {market}", "petty theft â€” stripped fittings off a moored skiff",
  "disruptive public behavior â€” a brawl that spilled out of {tavern}", "disruptive public behavior â€” drunk and shouting at a funeral procession",
  "minor conspiracy â€” passed messages for someone who paid in silver", "minor blackmail â€” sat on a letter and named a price",
  "petty theft â€” took {gp} gp of stock and called it wages owed", "murder of a commoner â€” a knife fight nobody's calling murder",
  "disruptive public behavior â€” cut a mask off a noble's face at a masquerade",
];

export const CRIMES_MAJOR = [
  "major theft â€” {gp} gp in goods out of a Silvertop strongroom", "arson â€” a warehouse on the Gutterwash waterfront",
  "murder of a merchant â€” found in the canal three days later", "murder of a City Guard â€” still unsolved, officially",
  "kidnapping â€” a merchant's son, returned unharmed, never reported", "treason â€” carried Shroud correspondence and read it",
  "major blackmail â€” a magistrate, and it worked", "major theft â€” a reliquary lifted out of a Ninestones chapel",
  "depravity â€” whatever happened at that house in Rilken Row",
];

export const RECORD_STATES = [
  { id: "clean", label: "No record", tone: "green" },
  { id: "suspect", label: "Suspected, unproven", tone: "gold" },
  { id: "pursued", label: "Under active pursuit", tone: "blood" },
  { id: "served", label: "Convicted and served", tone: "dim" },
  { id: "bought", label: "Convicted, bought off", tone: "violet" },
  { id: "wanted", label: "Wanted â€” major crime", tone: "blood" },
  { id: "exiled", label: "Exiled, and back anyway", tone: "blood" },
];

export const PUNISH_MINOR = ["a week in the stocks on the Rooks square", "twenty lashes at the Garrison gate", "fines they're still paying off", "a month of forced labor clearing canal silt", "made to return the goods in front of a crowd"];

export const PUNISH_MAJOR = ["four years in the Duke's Donjon", "eleven years in the Donjon; came out different", "a public whipping and branding at the Grand Gate", "sentenced to hang, and it was commuted â€” nobody says why"];

/* --- CONDITIONS: right-now states with teeth ---
   Names referenced by code: Starving, Bloodroot high/withdrawal,
   Newly flush, Blessed this week. Don't rename those four. */

export const CONDITIONS = [
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

export const SIT_GENERAL = [
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

export const SIT_BY_FACTION = {
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
    { s: "Is scouting which merchants still pay the guild, and writing it down badly.", a: "Nothing â€” but they'll talk to anyone who buys.", c: "days" },
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

export const NAMED = ["Guildmaster Seren", "Lyonel Hirkos", "Norley Targon", "Shem Turley", "Yargash the Tall", "Iriel Lanowin", "Matron Bethel", "Bolgrim Manymead", "Thalmus Vicci", "Babette Sykes", "Madame Morda", "Gomrey Gorn", "Scribald Toderick", "Bastien Morlen", "Terese", "Emule Virdan", "Cynthia Ulfric", "Tiborian", "Mareniel Siruul", "Chancellor Yeothin", "Brother Igonus", "Gaston di Vanglare", "Humphrey Hammergold", "Zameek", "Aron Reese", "Marjorie Wilkins", "Leland Putsky", "Ygraine Tareek", "Mallin Barton", "Darien di Morla", "Mortimer Grund"];

/* --- DESCRIPTIVE POOLS (v10 overhaul) ----------------------------------
   Broad on purpose: no named shops, people or pigs, so a repeat reads as
   ordinary rather than "that line again". Grammar each pool must keep:
     build / mood / voice   adjective phrase ("Someone ___")
     doing_*                -ing phrase ("they're ___")
     mark / pocket / maskFace / meal / vice / fear / lever  noun phrase
     smell                  noun phrase, no "of"
     tic / secret / lie / break   verb phrase, third person
   Hair, eyes and skin are built from two parts â€” see rollLooks().
   ---------------------------------------------------------------------- */

export const T = {
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
  maskMat: ["cracked papier-mÃ¢chÃ©", "cheap painted leather", "porcelain, hairline-fractured", "gilded wood", "beaten silver", "black lacquer", "boiled leather, scorched", "pressed tin", "velvet over a wire frame", "bone, polished yellow"],
  maskFace: ["a long-beaked bird", "a smiling face", "a weeping face", "a black bird", "a blank oval with no features", "a grinning devil", "a sun", "a moon, half-shadowed", "a fish", "a cracked half-face, one eye bare", "a dog's muzzle", "a lion",
    "a fox", "a cat", "an old man's face", "a young woman's face", "a skull", "a jester", "a plain domino over the eyes", "a stag with short antlers", "a serpent", "an owl", "a frowning judge", "a crying child",
    "a bear", "a hare", "a crown of leaves", "a star pattern", "swirls with no face at all", "a goat", "a wolf", "a mouth sewn shut", "a face with three eyes"],
  maskState: ["worn daily and grimy at the strap", "brand new and clearly borrowed", "repaired badly, glue showing", "kept in a pocket, only worn when needed", "too fine for their clothes â€” a gift, or stolen", "held, never worn", "sweat-stained inside",
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
  drink: ["watered ale", "sweet mead, too much of it", "nothing â€” they gave it up", "whatever a stranger is buying", "spiced wine", "strong tea", "a private bottle they don't share"],
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
  lie: ["claims a patron who has never met them", "says they were somewhere else that night", "insists an injury came from a fall", "gives a false name", "claims their goods are legally sourced", "says they're leaving town soon â€” every week", "swears they don't know the name you just said",
    "pretends to be richer than they are", "pretends to be poorer than they are", "claims to have served in a war", "says they've never been arrested", "claims family in high places", "says they don't drink", "pretends not to understand a question", "claims the idea was theirs", "says it's their first time doing this"],
  lever: ["straight coin, more than it's worth", "a threat aimed at someone else", "being treated as a professional", "a way to hurt someone who wronged them", "protection for someone they love", "a gift chosen with actual thought", "access to somewhere they can't get into", "an audience â€” say it where others can hear",
    "a favour owed", "flattery, laid on thick", "a promise of work", "food and a warm place", "information they want", "the chance to be a hero", "their debt paid", "a good story", "being listened to", "a drink or three"],
  break: ["will sell you out the moment someone asks", "won't break for money, only for family", "folds the instant steel is drawn", "will go to the Guard if you frighten them", "will keep their word past the point of sense", "already sold you out before you walked in",
    "runs, and doesn't look back", "fights harder when cornered", "begs, loudly, to draw a crowd", "tells you whatever you want to hear", "goes silent and stays that way", "offers money to make it stop", "calls for someone who might actually come", "breaks down crying â€” maybe genuinely"],
  mood: ["jumpy, expecting someone else", "openly bored", "grieving and covering it", "spoiling for an argument", "exhausted", "pleased about something they won't explain", "drunk enough to be honest", "frightened and performing calm", "in a rare good mood", "still angry at someone who just left",
    "distracted", "suspicious of everyone", "chatty", "irritable", "hopeful", "sulking", "impatient", "cheerful, almost too cheerful", "embarrassed about something", "restless", "wary but polite", "quietly smug"],
  doing_day: ["haggling badly and losing", "asleep upright against a wall", "counting stock and coming up short", "arguing about a price", "delivering something they haven't looked inside", "waiting for someone who is very late", "scrubbing a stain that won't come out", "reading a notice they can't afford to obey",
    "eating standing up", "mending something with care", "carrying more than they should", "chasing off a stray dog", "writing a letter slowly", "looking for something they dropped", "talking to themselves", "fixing a loose shoe", "hurrying somewhere", "watching a street performer", "sharpening a blade", "counting coins twice",
    "trying to look busy", "comforting a crying stranger", "pretending not to see someone", "leaning in a doorway", "sorting through junk"],
  doing_night: ["watching the door, not the room", "burning papers", "meeting someone who stays masked indoors", "drinking alone and steadily", "carrying a bundle wrapped in oilcloth", "picking a lock", "praying somewhere quiet", "following someone at a distance",
    "walking fast with their head down", "waiting under a lamp", "cleaning blood off their hands", "laughing too loudly", "counting money in the dark", "sleeping in a doorway", "arguing in a whisper", "looking for somewhere to sleep", "stumbling home", "keeping watch"],
  rumor: ["says the Charity House soup has gone strange â€” people come in sick and get sicker", "heard a Gedgarrin professor was seen at the graveyard after dark, three times now", "knows the back-door guards at Club Levantis have a price, and can quote it", "swears something in the river is pulling rowers under and the guild is hushing it", "says the Bywater Barons will move on the Bilge Pot inside the month", "heard a champion pig at The Bend is to be poisoned before the Divine Swine", "claims a Silvertop tailor sews uniforms that pass a Guard inspection", "insists cloaked visitors leave Vanglare House every night before dawn", "says there are prisoners in the Donjon with no record", "heard the Guildmaster is tearing up tunnels looking for a relic", "says beggars go into the Temple of Kytheros and don't come back", "claims the new play at the Monveau is more than a play", "heard the dwarves at Anvil Hall are due a visit they won't enjoy", "says a High Harbor jeweler keeps a garnet worth more than a ship", "swears the pig at The Blind Pig has never once been wrong", "knows which magistrate takes money, and the going rate", "heard this year's ball is really a hunt for a wife", "says an Onyx Eye agent has been made inside the guild"],
  saw: ["saw two people swap masks and walk off as each other", "watched a body go into the water and told no one", "saw a cart leave full and come back fuller", "noticed the same boat tied up six nights running", "saw coin pass between a Guard and someone masked", "found a door that wasn't there last season", "watched someone buy something and run", "saw someone important weeping alone"],
};

/* child-appropriate replacements â€” a "street child" should never be "in their prime" with a vice for drink */

export const CHILD = {
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

export const CHILD_SIT = [
  { s: "Lost the coin they were sent out with and can't go home without it.", a: "The coin, or a story that will hold up.", c: "tonight" },
  { s: "Saw something at {loc} they weren't meant to, and someone saw them see it.", a: "Somewhere to hide for a day or two.", c: "days" },
  { s: "Their older sibling hasn't come back from {loc}.", a: "Someone grown-up to go and look.", c: "days" },
  { s: "Is being made to run messages to and from {crim} and wants out.", a: "A way out that doesn't get them hurt.", c: "weeks" },
  { s: "Found a purse and doesn't know whose it is.", a: "Someone to tell them what to do with it.", c: "hours" },
  { s: "Is hungry, and the soup line ran out.", a: "A meal.", c: "now" },
];

export const TIER_LV = { common: [0, 2], pro: [2, 4], dangerous: [4, 6], elite: [6, 10] };

export const SMALL_ANC = ["dwarf", "halfling", "goblin", "kobold"];

export const LITERATE = ["scholar", "clerk", "barrister", "mage", "apprentice", "priest", "bard", "physician", "apothecary", "merchant", "noble", "spy", "acolyte", "druid"];

export const CHILD_BAD_CONDS = /Drunk|Hungover|Bloodroot|Lovesick|promoted|Just paid|Armed above|Owes the wrong|Rat Plague|Carrying something valuable/;

export const CHILD_BAD_RELS = /love|drinks with|owes money|trades goods/;

/* Does a rolled detail make sense for THIS person? Anything that fails is re-picked
   from the pool of things that do. Only failing fields re-roll, so most NPCs are untouched. */

export const IDENTIFIERS = ["the Phlegmy", "the Silent", "the Unlucky", "the Sly", "the Pensive", "the Vengeful", "the Outcast", "the Forgotten", "the Stubborn", "the Observant", "the Charming", "the Grim",
  "the Crooked", "the Patient", "the Wronged", "the Damp", "the Ravenous", "the Bright", "the Bitter", "the Loyal", "the Twice-Hanged", "the Blue", "the Careful", "the Widow", "the Whisper", "the Bell", "the Late",
  "the Quick", "the Slow", "the Tall", "the Short", "the Lucky", "the Honest", "the Liar", "the Pious", "the Drowned", "the Lame", "the Red", "the Grey", "the Younger", "the Elder",
  "the Fat", "the Thin", "the Mute", "the Loud", "the Brave", "the Coward", "the Needle", "the Hammer", "the Fox", "the Crow", "the Mouse", "the Knife", "the Smiler", "the Weeper",
  "Two-Coins", "One-Ear", "Halfpenny", "Nine-Fingers", "Sweet-Tooth", "Blackboots", "the Gentle", "the Cruel", "the Tired", "the Proud", "the Nobody"];


export const FACTIONS = {
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


export const BAND_LABEL = ["Destitute", "Poor", "Modest", "Comfortable", "Wealthy"];

export const BAND_COIN = [[0, 8, "sp"], [1, 14, "sp"], [2, 25, "sp"], [3, 40, "gp"], [15, 140, "gp"]];

export const HOLIDAYS = {
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

export const SHOP_SIGN_A = ["The Gilded", "The Crooked", "The Patient", "The Honest", "The Blue", "The Drowned", "The Silver", "The Fat", "The Lucky", "The Quiet", "The Salt", "The Broken", "The Red", "The Merry", "The Old"];

export const SHOP_SIGN_B = ["Gull", "Marmot", "Oar", "Thimble", "Tallow", "Anvil", "Rook", "Pike", "Lantern", "Cask", "Spindle", "Key", "Boar", "Wheel", "Kettle", "Mask"];


export const SHOP_GOODS = {
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

export const SHOP_QUIRK = [
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
  "Is half asleep and easy to overcharge â€” or undercharge.",
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

export const SHOP_WONT = [
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

export const RUMORS = [
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


export const RUMOR_TRUTH = [
  { k: "True", w: 46, tone: "green", note: "As stated. It will hold up." },
  { k: "Half right", w: 32, tone: "gold", note: null },
  { k: "False", w: 22, tone: "blood", note: null },
];

export const RUMOR_TWIST = [
  "the place is wrong â€” it's a district over",
  "the name attached to it is the wrong person",
  "it was true last month and has already been dealt with",
  "it's true, and far smaller than the telling",
  "it's true, and far worse than the telling",
  "the teller is closer to it than they realise",
  "it's two separate true things stuck together",
  "the timing is wrong â€” it hasn't happened yet",
];

export const RUMOR_FALSE = [
  "planted by the Thieves' Guild to move eyes off something else",
  "invented by a beggar who wanted a coin and a listener",
  "started by a rival trader to ruin a competitor",
  "a Shroud distraction, and an effective one",
  "a garbled retelling of something true about a different person",
  "somebody made a Skulduggery check and this is the result",
  "the teller made it up on the spot and now half believes it",
];

export const RUMOR_PRICE = [
  "a drink, and time to finish it", "a silver, openly offered", "5 gp, and no haggling",
  "a favour, unspecified, to be called later", "being taken seriously for once",
  "a name in return â€” they trade, they don't give", "nothing, they've been dying to tell someone",
  "food, and somewhere to sit down", "a promise you'll keep them out of it",
];
/* Reaction gates how much they'll part with (book: reaction rolls, and
   the Beggars who "don't part with valuable information easily") */

export const RUMOR_GATE = {
  Hostile: { n: 0, note: "Wants you gone. Tells you nothing; may refuse service, send for the Guard, or turn violent if pushed." },
  Suspicious: { n: 1, note: "One, and only after the price is paid." },
  Neutral: { n: 1, note: "One freely. A second costs the price." },
  Curious: { n: 2, note: "Two, and wants to know what you know in return." },
  Friendly: { n: 3, note: "Everything they have, and points you at who'd know more." },
  // v8â€“v12 labels, so older saved NPCs still read
  Unfriendly: { n: 1, note: "One, and only after the price is paid." }, Indifferent: { n: 1, note: "One freely. A second costs the price." }, Helpful: { n: 3, note: "Everything they have." },
};

/* --- 3. VOICE KIT --------------------------------------------------- */

export const VOICE_REGISTER = ["short sentences, long pauses", "never stops talking, circles the point", "formal, a shade too formal", "sarcastic by reflex, warms up slowly", "warm and immediate",
  "flat and transactional, facts then silence", "theatrical, plays to the room", "quiet, makes you ask twice", "asks more questions than they answer", "swears constantly, apologises for none of it",
  "polite to the point of nervousness", "blunt, no manners at all", "rambling, wanders into old stories", "whispers like everything is secret", "cheerfully rude",
  "precise, chooses every word", "slangy and fast", "mournful, everything is a shame", "boastful, always slightly exaggerating", "curt, clearly wants you gone",
  "flirtatious out of habit", "lecturing, explains things you know", "gentle, as if talking to a spooked animal", "distracted, answers a beat late", "overly familiar from the first word"];

export const VOICE_PHRASE = ["\"That's the way of it.\"", "\"You didn't hear it from me.\"", "\"Ask anyone.\"", "\"Now, I'm not one to talk, but â€”\"", "\"Do I look like I know?\"", "\"Suit yourself.\"",
  "\"Everything has a price.\"", "\"Gods willing.\"", "\"Same as it ever was.\"", "\"Don't make me say it twice.\"", "\"You'll want to be elsewhere.\"", "\"I've seen worse.\"",
  "\"Fair's fair.\"", "\"Well, there it is.\"", "\"Can't help you there.\"", "\"Mind how you go.\"", "\"If you say so.\"", "\"Not my business.\"",
  "\"Honest truth.\"", "\"Could be worse.\"", "\"Isn't that something.\"", "\"We'll see.\"", "\"I'm just saying.\"", "\"Mark my words.\"",
  "\"What's it to you?\"", "\"Nothing's free.\"", "\"Long story.\"", "\"Don't get me started.\"", "\"That's a question, that is.\"", "\"No offence meant.\""];

export const VOICE_ADDRESS = ["\"friend\" â€” to everyone, meaning nothing", "\"my lord\" and \"my lady\", laid on thick", "your name, immediately and often, once they have it", "\"you\" â€” flatly, no softening",
  "\"sir\" and \"madam\", sincerely", "a nickname they invent on the spot", "nothing at all; never addresses anyone directly", "\"love\" or \"dear\", whoever you are",
  "\"boss\", half-mocking", "\"stranger\", pointedly", "your job or look â€” \"soldier\", \"scholar\"", "\"kid\", regardless of your age", "\"mate\" or \"pal\"", "your full name, every time"];

export const VOICE_STOP = ["the Guard walking past", "any mention of the gangs", "a mask coming off", "somebody else joining the conversation", "being asked where they were last night", "the price coming up",
  "an honest compliment â€” it throws them", "a question about their family", "a raised voice", "someone writing things down", "a mention of money owed", "their employer's name",
  "a weapon being drawn", "being asked their real name", "the subject of the dead", "anything about magic", "being touched", "a rival's name"];

/* --- 4. CONNECTIONS ------------------------------------------------- */

export const REL_TYPES = [
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

export const MUNDANE_JOBS = ["laborer", "beggar", "child", "drunk", "rower", "sailor", "servant", "vendor", "artisan", "merchant", "innkeep", "gambler", "clerk", "acolyte", "mourner", "pilgrim", "physician", "apothecary", "fortuneteller", "scholar", "actor", "guard", "cutpurse", "informant"];

export const SHOP_JOBS = ["vendor", "artisan", "merchant", "innkeep", "apothecary", "physician", "fortuneteller", "fence"];

/* --- 6. READ-ALOUD OPENERS ------------------------------------------ */

export const OPENER_FRAME = [
  "You get {build}, {age}, {doing}.",
  "{Build_c}, {age}. {Doing_c}, and doesn't look up straight away.",
  "The first thing you notice is {mark}. Then that they're {doing}.",
  "{Build_c} and {age}, {doing}. Their voice: {voice}.",
  "Someone {build}, {doing}. {Mark_c}.",
  "{Mark_c} is what you see first. They're {doing}.",
  "Someone {age} and {build}, {doing}.",
  "They're {doing} when you arrive â€” {build}, {age}.",
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

export const ANCESTRY_WEIGHTS_WR = [
  ["human", 54], ["elf", 10], ["dwarf", 10], ["halfling", 10],
  ["goblin", 5], ["halfelf", 5], ["halforc", 5],
  // kobold dropped — no mechanical trait exists in any reference file, only an unattached population-table roll
];

/* Half-elf names use the book's two-part d10 construction. */

export const HALFELF_A = ["Me", "Ira", "Im", "Hu", "Gal", "Tova", "Syr", "Or", "Lir", "Cal"];

export const HALFELF_B = ["garrin", "sandiel", "rak", "teril", "rynn", "barik", "lena", "seniel", "dess", "dorin"];

export const NAMES_WR = {
  halfelf: { m: [], f: [], s: ["of the Steppes", "Hawkborn", "Tallgrass", "Redsand", "Two-Bloods", "Cobairider"] },
  kobold: { m: ["Skrik", "Yipp", "Nardo", "Vess", "Tak"], f: ["Riska", "Pell", "Nix", "Grull"], s: ["Scaletongue", "Cinderfoot", "Gutterpaw", "Thinshell"] },
};

export const ORIGINS = {
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
   `nine: false` on whichever you want excluded â€” it's a good table
   mystery either way, and the PCs can go count the stones.
   ------------------------------------------------------------------ */

export const GODS = {
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
    oath: "\"...\" â€” they won't say it.", at: 25,
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


export const DEVOTION = [
  { k: "Devout", w: 18, note: "Observes properly, and it shapes what they'll agree to." },
  { k: "Observant", w: 30, note: "Keeps the days, says the words, doesn't think hard about it." },
  { k: "Nominal", w: 30, note: "Raised in it. Would say the name under pressure and mean nothing by it." },
  { k: "Lapsed", w: 14, note: "Walked away from it, and is touchy about being asked why." },
  { k: "Secret", w: 8, note: "Worships where it can't be seen. Exposure would cost them everything." },
];

/* the four factions of the Reaches, from the Player's Guide */

export const WR_FACTIONS = {
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
   scale the generator uses â€” swap in the book's own blocks if you
   have them open.
   ================================================================= */


export const BOOK_NPCS = [
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
    hook: "The only tailor who can make a 500 gp masquerade costume â€” the ticket into the Duke's Ball. Normally 8+ renown, but she makes exceptions after hours for people who earn her trust." },
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
    hook: "Ask for \"the deal of the day\" to get past the facade. Selling stolen goods here cancels a Guard pursuit â€” but there's a cumulative 1:6 he sells you out for that item." },
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
    hook: "The best gear in the city, available to anyone who can afford it â€” and a protection racket about to land on the shop." },

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
    desc: "Marjorie's brother takes the tent at night â€” a languid hookah-smoker full of tales of distant lands.",
    wants: "An audience.",
    hook: "He has a knack for picking the right expensive gift. Buy his advice and you get a reaction reroll or +1, once per intended recipient." },
  { n: "Madame Morda", at: 46, role: "Fortune-teller", fac: "none", al: "N", lv: 3, ac: 10, hp: 10, anc: "elf",
    desc: "White-haired old elf running a lucrative act. Burning sage fills the tent with a blue haze that hides how fake the crystal and bone decor is.",
    wants: "The act to keep paying.",
    hook: "15 gp a tarot reading, 50 to speak with the dead, 100 for a love potion. All of it expert trickery â€” which makes her an excellent liar to hire." },
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

export const BOUNTY_POSTER = [
  { who: "The Duke's magistrates", note: "Posted publicly at the Garrison and the Grand Gate.", legal: true },
  { who: "The City Guard, quietly", note: "Not posted. Passed by word of mouth to patrol sergeants.", legal: true },
  { who: "A merchant house that won't be named", note: "Paid through an intermediary at the Golden Vault.", legal: false },
  { who: "The Thieves' Guild", note: "Guild business. The Guard would rather not know.", legal: false },
  { who: "The Bywater Barons", note: "Half now, half on delivery, and they've been known to argue about the second half.", legal: false },
  { who: "A grieving family", note: "Everything they had, pooled. It is not a large sum and they know it.", legal: true },
  { who: "The Onyx Eye", note: "No paper exists. Deny this conversation happened.", legal: true },
];

export const BOUNTY_TERMS = [
  { t: "Alive, and unharmed. The condition is specific and non-negotiable.", mult: 1.5 },
  { t: "Alive. Bruised is acceptable.", mult: 1.2 },
  { t: "Either way. Nobody's asking questions.", mult: 1.0 },
  { t: "Dead, and publicly. The point is that people see it.", mult: 1.3 },
  { t: "Alive, and delivered to a specific room, not a cell.", mult: 1.4 },
];

export const BOUNTY_CLAIM = [
  { at: 19, how: "Present the claim at the Garrison. Expect to be questioned yourself." },
  { at: 20, how: "Best Defense handles the paperwork, for a cut." },
  { at: 18, how: "Claim at the Grand Gate guardhouse. Fast, public, and everyone sees your face." },
  { at: 39, how: "Drawn against an account at the Golden Vault. Discreet, and the banker remembers you." },
  { at: 34, how: "Norley pays out in goods, not coin, and at his valuation." },
  { at: 12, how: "Through Scribald Toderick at Shieldstone Law, who is cheap and slow." },
];

export const BOUNTY_TWIST = [
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

export const PLATE = 130; // Shadowdark core plate mail

export const T_ON = { origin: true, faith: true, open: true, sit: true, cond: true, record: true, stats: true, shop: true, rumor: true, voice: true, conn: true, physical: true, attire: true, life: true, interior: true, places: true };

export const T_OFF = { origin: false, faith: false, open: false, sit: false, cond: false, record: false, stats: false, shop: false, rumor: false, voice: false, conn: false, physical: false, attire: false, life: false, interior: false, places: false };

export const ON = (...keys) => { const o = { ...T_OFF }; keys.forEach((k) => (o[k] = true)); return o; };


export const TEMPLATES = [
  { id: "quick", name: "Quick roll", blurb: "Anyone at all, everything on", p: {}, t: { ...T_ON } },
  { id: "commoner", name: "Commoner", blurb: "An ordinary resident of 90,000", p: { mundane: true, tier: "common", record: "light" }, t: ON("open", "stats", "physical", "voice", "life", "rumor", "sit") },
  { id: "shopkeep", name: "Shopkeeper", blurb: "A business, stock, and prices", p: { jobs: SHOP_JOBS, mundane: true, record: "light" }, t: ON("open", "shop", "stats", "physical", "voice", "rumor", "conn", "sit") },
  { id: "throwaway", name: "Throwaway", blurb: "A name, a face, a stat line", p: { tier: "common" }, t: ON("open", "stats", "physical") },
  { id: "crowdfolk", name: "Tavern staff", blurb: "Whoever's working the room", p: { jobs: ["innkeep", "servant", "drunk", "gambler", "bard", "informant"], mundane: true }, t: ON("open", "stats", "physical", "voice", "rumor", "sit") },
  { id: "street", name: "Street folk", blurb: "Beggars, children, labourers", p: { jobs: ["beggar", "child", "laborer", "rower", "drunk", "mourner"], record: "light" }, t: ON("open", "stats", "physical", "voice", "rumor", "sit", "life") },
  { id: "market", name: "Market trader", blurb: "Stalls, stock, thin margins", p: { jobs: ["vendor", "artisan", "merchant", "fortuneteller", "smuggler"] }, t: ON("open", "shop", "stats", "physical", "voice", "rumor", "sit") },
  { id: "duelist", name: "Duelist", blurb: "Steel and reputation, City of Masks style", p: { job: "duelist" }, t: { ...T_ON, shop: false } },
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


export const PLANT_BAD = ["have been informing for the Onyx Eye", "cheated a guild man at cards and bragged about it", "are carrying the Rat Plague and hiding it", "insulted a noble's mask at the last ball", "were seen leaving the graveyard at dawn", "water their stock and short their weights", "took Shroud money last winter", "are not who their papers say they are"];

export const PLANT_GOOD = ["pulled a child out of the canal and wouldn't take payment", "gave a week's takings to Madeera's Hearth", "danced at the Duke's Ball and were noticed", "stood up to a guild collector in front of witnesses", "are owed a favour by someone very high up", "sold honest goods at a loss rather than break their word"];

/* ============================= ENGINE ============================= */

/* All randomness routes through RNG so it can be swapped for a seeded
   stream. The book's named NPCs are hydrated under a seed derived from
   their name, so their details never change between visits. */

export const byKind = (k) => LOCATIONS.filter((l) => l.k.includes(k));

export const locByN = (n) => LOCATIONS.find((l) => l.n === n);


export const BOOK_AGE = {
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

export const BOOK_DOING = [
  "mid-conversation with someone who leaves as you arrive",
  "not surprised to see you",
  "finishing something before they look up",
  "already watching the door you came through",
  "exactly where they always are",
  "taking their time about acknowledging you",
];

export const BOOK_ARCH = {
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

/* Hydrate a named NPC into a full dossier â€” the same depth as a scan.
   Seeded from their name, so Guildmaster Seren's smell, mask, tell and
   rumours are the same every single time you open her entry.
   Canon (name, role, level, AC, HP, faction, alignment, and the book's
   own description) always overwrites whatever the generator produced. */

export const FACTION_STRENGTH = {
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

export const BOOK_NAME_LISTS = {
  dwarf: "Hera, Torin, Ginny, Gant, Olga, Dendor, Ygrid, Pike, Sarda, Brigg, Zorli, Yorin, Jorgena, Trogin, Riga, Barton, Katrina, Egrim, Elsa, Orgo",
  elf: "Sarenia, Ravos, Imeria, Farond, Isolden, Kieren, Mirenel, Riarden, Allindra, Arlomas, Sylara, Tyr, Rinariel, Saramir, Vedana, Elindos, Ophelia, Cydaros, Tiramel, Varond",
  halfling: "Myrtle, Robby, Nora, Percy, Daisy, Jolly, Evelyn, Horace, Willie, Gertie, Peri, Carlsby, Nyx, Kellan, Fern, Harlow, Moira, Sage, Reenie, Wendry",
  halforc: "Troga, Boraal, Urgana, Zoraal, Scalga, Krell, Voraga, Morak, Draga, Sorak, Varga, Ulgar, Jala, Kresh, Zana, Torvash, Rokara, Gartak, Iskana, Ziraak",
  human: "Hesta, Matteo, Rosalin, Endric, Kiara, Yao, Corina, Rowan, Hariko, Ikam, Mariel, Jin, Hana, Lios, Indra, Remy, Nura, Vakesh, Una, Nabilo",
};

export const MORE_NAMES = {
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
   Anything NOT in those files is marked  // NOT IN REFS â€” check.
   ============================================================== */

