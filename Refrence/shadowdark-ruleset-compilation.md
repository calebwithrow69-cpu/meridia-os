# Shadowdark RPG — Ruleset Compilation for Meridia OS

*Compiled from source material provided by Caleb. This document supersedes any prior conflicting data (including anything hardcoded in earlier meridia-os builds). When implementing systems, treat this file as canon over training-data recollection.*

**Corrections locked in this pass:**
- Plate mail is **130 gp** (not 120). Bounty math in v8 was calibrated to 120 and needs revisiting at Phase 5.
- Round Shield: **15 gp**, has *sundering* property.
- Mithral multiplier: **×5** cost, **−1 slot**, no stealth/swim penalty (metal armor only).
- Shuriken: **1d6** damage (chunk 2 reference card).

---

## 1. CORE MECHANICS

### Stat generation
Roll **3d6 in order** for each of STR, DEX, CON, INT, WIS, CHA. Optional re-roll of the whole set if no stat is 14+.

**Stat modifiers:**
| Stat | Mod |
|---|---|
| 1–3 | −4 |
| 4–5 | −3 |
| 6–7 | −2 |
| 8–9 | −1 |
| 10–11 | 0 |
| 12–13 | +1 |
| 14–15 | +2 |
| 16–17 | +3 |
| 18+ | +4 |

### Difficulty Classes
- Easy: **DC 9**
- Normal: **DC 12**
- Hard: **DC 15**
- Extreme: **DC 18**

### Rolling
- **Advantage:** roll twice, use higher.
- **Disadvantage:** roll twice, use lower.
- **Cancel:** advantage + disadvantage negate each other.
- **Nat 20:** auto-hit, critical (double damage dice on weapons; may double a numerical spell effect).
- **Nat 1:** auto-miss, may hit an ally.
- **D6 decider:** GM calls d6 for uncertain outcomes; 1–3 worse for players, 4–6 better.

### Contested checks
Both parties roll one stat check; highest wins. Reroll ties.

### When to roll
Only when: (a) failure has a negative consequence, (b) skill required, (c) time pressure. Trained characters usually just succeed. Social encounters lean on what's said, not CHA checks.

### Luck tokens
- Max **1 per player** at a time.
- Cash in to reroll any roll you just made (must take new result).
- Can be gifted to another player.
- GM awards for exceptional play. 2–3 per player in pulpy sessions, 0 in grim ones.

---

## 2. TIME, TURNS, INITIATIVE

- **Real time:** in-game time = real time (matters for light source tracking). If untrackable, 1 hour = 10 rounds.
- **Turn:** one player acts.
- **Round:** everyone has acted once.
- **Initiative:** d20 + DEX mod at start of combat. Clockwise from highest.
- **Freeform initiative:** loose round-robin, players decide their order within the round.

### Player turn
1. Count down personal timers.
2. Action + move up to **near** (split however).
3. Move near again if skipping action.

### GM turn
1. Count down GM timers.
2. Random encounter check if applicable.
3. Actions/moves for NPCs/environment.
4. Describe.

### Time passing (skipping ahead)
- **Minutes:** effects with round-duration expire. One random encounter check (1–3 on d6 = triggers).
- **Hours/days:** all shorter-duration effects expire. Use overland travel encounter cadence.

---

## 3. MOVEMENT, DISTANCES, ENVIRONMENT

### Distances
- **Close:** 5 ft
- **Near:** up to 30 ft
- **Far:** within sight during a scene

### Movement rules
- **Climbing:** STR or DEX, climb half speed. Fall if fail by 5+.
- **Falling:** 1d6 per 10 ft.
- **Moving through:** free through allies. STR or DEX vs. enemies. 1d6/round on failed CON check.
- **Swimming:** half speed. STR check in rough water. Hold breath for rounds equal to CON mod (min 1), then CON check each round or 1d6/round.
- **Rough terrain:** half normal movement.

### Cover
- **Partial cover:** attacker has disadvantage.
- **Full cover:** cannot target.

### Stealth
- DEX check to go undetected.
- Cannot hide while being seen, even at a casual glance.
- Impossible to hide with nowhere to conceal.

### Detection
- Looking in the right place = automatic detection.
- Otherwise: WIS check.

### Surprise
- Undetected creature at turn start gets surprise round before initiative.
- Advantage on attacks vs. surprised targets.
- Attacking from hiding gives away position afterward (GM discretion).

### Vision & Total Darkness
- Non-darkness-adapted creatures have **disadvantage** on sight-based tasks in darkness.
- **All non-humanoid monsters are dark-adapted** (blindness/deafness still hinders them).
- In total darkness the environment becomes **deadly** (random encounter check every round).

### Light sources
- Torch: 1 hour real time, near distance.
- Lantern: 1 hour per oil flask, double-near distance, shuttered.
- Light spell: 1 hour real time.
- New light source can "ride along" on current timer, OR extinguish all and start fresh.
- **Campfire:** 3 torches combined → 8 hours, near distance, cannot move once lit.

---

## 4. COMBAT

### Actions
- **Melee:** d20 + STR + bonuses vs. AC.
- **Ranged:** d20 + DEX + bonuses vs. AC.
- **Spell:** takes an action.
- **Improvise:** GM may call for stat check or attack roll.
- **Multitask:** small parallel tasks (stand up, speak, drink potion, activate item) usually don't consume the action.

### Damage
- Roll weapon/spell dice + bonuses. Subtract from HP.
- **Knockout:** attacker's choice to knock unconscious at 0 HP instead of killing.
- **Critical hit:** nat 20 on attack; double weapon damage dice. Spell critical doubles one numerical effect.

### Morale
- Enemies at half number (or solo at half HP) flee on failed **DC 15 WIS**.
- Large groups: one check with leader's modifier.

### Death
- 0 HP = unconscious and dying.
- Above 0 = wake up, no longer dying.
- **Death timer:** 1d4 + CON mod (min 1) rounds. Roll d20 each subsequent turn; nat 20 = rise at 1 HP.
- **Stabilize:** intelligent being at close range makes **DC 15 INT** — target stops dying but stays unconscious.
- Death = character retired.

---

## 5. RESTING

- **Full rest:** 8 hours sleep + 1 ration consumed. Regains all HP + all stat damage.
- Rest can be broken up for light/routine tasks (watch shifts fine).
- **Interruption:** DC 12 CON. Fail = ration consumed, no benefit.
- Some talents/spells/items recharge on successful rest.

### Rest danger cadence
- **Unsafe:** encounter check every 3 hours
- **Risky:** every 2 hours
- **Deadly:** every hour

---

## 6. OVERLAND TRAVEL

- Groups travel in multi-hour chunks; use time-passing rules.
- Encounter cadence same as rest danger levels above.
- **Light remaining:** 1d6 × 10 minutes on current source.
- **Navigation:** INT check on entering unfamiliar hex. Fail = random adjacent hex.
- **Food/water:** 3 days without ration, then 1 CON damage/day (death at 0). Forage 1 ration/day on INT check.
- **Travel per day:** up to 8 hours. CON checks to push further.

### Hex crossing times (6-mile hexes)
| Method | Time per hex |
|---|---|
| Walking | 4 hours |
| Mounted | 2 hours |
| Sailing | 1 hour |
| Difficult terrain | ×2 |
| Arduous terrain | 8 hours |

---

## 7. ANCESTRIES

| Ancestry | Languages | Trait |
|---|---|---|
| **Dwarf** | Common, Dwarvish | **Stout:** +2 HP at start, roll HP per level with advantage |
| **Elf** | Common, Elvish, Sylvan | **Farsight:** +1 to ranged attacks OR +1 to spellcasting checks |
| **Goblin** | Common, Goblin | **Keen Senses:** cannot be surprised |
| **Half-Orc** | Common, Orcish | **Mighty:** +1 attack/damage with melee weapons |
| **Halfling** | Common | **Stealthy:** 1/day become invisible for 3 rounds |
| **Human** | Common + 1 additional common | **Ambitious:** 1 additional talent roll at 1st level |

---

## 8. CLASSES

### Fighter
- **Weapons:** All | **Armor:** All + shields | **HP:** 1d8/level
- **Hauler:** add CON mod (if positive) to gear slots
- **Weapon Mastery:** pick one weapon type; +1 attack/damage + half level (round down)
- **Grit:** pick STR or DEX; advantage on checks vs. opposing force

**Talents (2d6):**
| Roll | Effect |
|---|---|
| 2 | +1 Weapon Mastery type |
| 3–6 | +1 melee/ranged attack |
| 7–9 | +2 to STR, DEX, or CON |
| 10–11 | +1 AC from a chosen armor |
| 12 | Pick a talent or +2 stat points |

### Priest
- **Weapons:** Club, crossbow, dagger, mace, longsword, staff, warhammer | **Armor:** All + shields | **HP:** 1d6/level
- **Languages:** Celestial, Diabolic, OR Primordial
- **Turn Undead:** knows the spell (doesn't count vs. known spells)
- **Deity + holy symbol** (no gear slot)
- **Spellcasting:** WIS-based, knows 2 tier-1 priest spells at start

**Priest Spells Known table:**
| Level | T1 | T2 | T3 | T4 | T5 |
|---|---|---|---|---|---|
| 1 | 2 | – | – | – | – |
| 2 | 3 | – | – | – | – |
| 3 | 3 | 1 | – | – | – |
| 4 | 3 | 2 | – | – | – |
| 5 | 3 | 2 | 1 | – | – |
| 6 | 3 | 2 | 2 | – | – |
| 7 | 3 | 3 | 2 | 1 | – |
| 8 | 3 | 3 | 2 | 2 | – |
| 9 | 3 | 3 | 2 | 2 | 1 |
| 10 | 3 | 3 | 3 | 2 | 2 |

**Talents (2d6):**
| Roll | Effect |
|---|---|
| 2 | Advantage casting one spell |
| 3–6 | +1 melee/ranged attack |
| 7–9 | +1 priest spellcasting |
| 10–11 | +2 STR or WIS |
| 12 | Pick talent or +2 stat points |

### Thief
- **Weapons:** Club, crossbow, dagger, shortbow, shortsword | **Armor:** Leather, mithral chainmail | **HP:** 1d4/level
- **Backstab:** extra weapon die if target unaware; add additional dice = half level (round down)
- **Thievery:** thief tools (no gear slot). Advantage on: climbing, sneaking/hiding, disguises, traps, picking pockets/locks

**Talents (2d6):**
| Roll | Effect |
|---|---|
| 2 | Advantage on initiative (reroll dup) |
| 3–5 | Backstab +1 die |
| 6–9 | +2 STR, DEX, or CHA |
| 10–11 | +1 melee/ranged attack |
| 12 | Pick talent or +2 stat points |

### Wizard
- **Weapons:** Dagger, staff | **Armor:** None | **HP:** 1d4/level
- **Languages:** +2 common, +2 rare
- **Learning Spells:** DC 15 INT to permanently learn from a scroll (day of study; scroll expended either way; learned spells don't count vs. known)
- **Spellcasting:** INT-based, knows 3 tier-1 wizard spells at start

---

## 9. LEVEL 0 vs LEVEL 1

**Level 0:**
- Stats + ancestry
- HP = CON mod (min 1)
- Background, alignment, 1d4 items from starting gear list
- No class yet; beginner's luck lets them wield all gear
- Reaches level 1 after surviving first adventure

**Level 1:**
- Stats + ancestry + class + 1 class talent roll
- HP = 1 roll of class HD + CON mod (min 1 total)
- Background, alignment, title
- 2d6 × 5 gp for starting gear

---

## 10. ALIGNMENT & DEITIES

### Alignments
- **Lawful:** fairness, order, virtue ("good of the whole")
- **Neutral:** balance, natural cycle ("nature takes its course")
- **Chaotic:** destruction, ambition, wickedness ("survival of the fittest")

### The Nine
**The Four Lords (worshipped by most):**
- **Saint Terragnis (L):** patron of lawful humans; righteousness and justice; former knight ascended
- **Gede (N):** feasts, mirth, wilds; storms when angered; elves and halflings favor her
- **Madeera the Covenant (L):** first manifestation of Law; bears every reality-law on her skin
- **Ord (N):** magic, knowledge, secrets, equilibrium; the Unbending, the Wise, the Secret-Keeper

**The Dark Trio:**
- **Memnon (C):** first manifestation of Chaos; Madeera's twin; red-maned leonine being seeking to rend the Covenant from her skin
- **Ramlaat (C):** the Pillager, the Barbaric, the Horde; orcs worship him via the Blood Rite
- **Shune the Vile (C):** whispers arcane secrets to sorcerers/witches; wants to displace Ord

**The Lost (?):**
- Two of the Nine are lost — names expunged from history and memory. Legends persist in ancient texts.

### Priest penance costs (by spell tier)
| Tier | Value |
|---|---|
| 1 | 5 gp |
| 2 | 20 gp |
| 3 | 40 gp |
| 4 | 90 gp |
| 5 | 150 gp |

---

## 11. TITLES

### Fighter
| Level | Lawful | Chaotic | Neutral |
|---|---|---|---|
| 1–2 | Squire | Knave | Warrior |
| 3–4 | Cavalier | Bandit | Barbarian |
| 5–6 | Knight | Slayer | Battlerager |
| 7–8 | Thane | Reaver | Warchief |
| 9–10 | Lord/Lady | Warlord | Chieftain |

### Priest
| Level | Lawful | Chaotic | Neutral |
|---|---|---|---|
| 1–2 | Acolyte | Initiate | Seeker |
| 3–4 | Crusader | Zealot | Invoker |
| 5–6 | Templar | Cultist | Haruspex |
| 7–8 | Champion | Scourge | Mystic |
| 9–10 | Paladin | Chaos Knight | Oracle |

### Thief
| Level | Lawful | Chaotic | Neutral |
|---|---|---|---|
| 1–2 | Footpad | Thug | Robber |
| 3–4 | Burglar | Cutthroat | Outlaw |
| 5–6 | Rook | Shadow | Rogue |
| 7–8 | Underboss | Assassin | Renegade |
| 9–10 | Boss | Wraith | Bandit King/Queen |

### Wizard
| Level | Lawful | Chaotic | Neutral |
|---|---|---|---|
| 1–2 | Apprentice | Adept | Shaman |
| 3–4 | Conjurer | Channeler | Seer |
| 5–6 | Arcanist | Witch/Warlock | Warden |
| 7–8 | Mage | Diabolist | Sage |
| 9–10 | Archmage | Sorcerer | Druid |

---

## 12. LANGUAGES

### Common
Common, Dwarvish, Elvish, Giant, Goblin, Merran, Orcish, Reptilian, Sylvan, Thanian

### Rare
Celestial, Diabolic, Draconic, Primordial

---

## 13. GEAR SLOTS

**Capacity:** = STR stat OR 10, whichever is higher. Fighters add positive CON mod.

Most gear = 1 slot. Some items are heavier. First backpack + first 100 coins are free to carry.

### Basic gear
| Item | Cost | Slots |
|---|---|---|
| Arrows (20) | 1 gp | 1–20/slot |
| Backpack | 2 gp | free (first) |
| Caltrops (1 bag) | 5 sp | 1 |
| Coin | — | 100/slot (first 100 free) |
| Crossbow bolts (20) | 1 gp | 1–20/slot |
| Crowbar | 5 sp | 1 |
| Flask or bottle | 3 sp | 1 |
| Flint and steel | 5 sp | 1 |
| Gem | Varies | 1–10/slot |
| Grappling hook | 1 gp | 1 |
| Iron spikes (10) | 1 gp | 1–10/slot |
| Lantern | 5 gp | 1 |
| Mirror | 10 gp | 1 |
| Oil, flask | 5 sp | 1 |
| Pole (10') | 5 sp | 1 |
| Rations (3) | 5 sp | 1–3/slot |
| Rope, 60' | 1 gp | 1 |
| Torch | 5 sp | 1 |

### Coins
1 gp = 10 sp = 100 cp

---

## 14. WEAPONS

Type: M = Melee, R = Ranged, M/R = either. Range: C = Close, N = Near, F = Far.
Properties: 2H = two-handed, F = finesse, Th = throwable, V = versatile, B = blunt, BG = blowgun, BOL = bolas, La = lash, R = returns, S = stunt, S-T = spear-thrower.

| Weapon | Cost | Type | Range | Damage | Properties |
|---|---|---|---|---|---|
| Bastard Sword | 10 gp | M | C | 1d8 / 1d10 | V |
| Blowgun | 5 gp | R | N | 1d1 | BG |
| Bolas | 2 gp | R | N | — | BOL, Th |
| Boomerang | 3 gp | R | N | 1d4 | R, Th |
| Club | 5 cp | M | C | 1d4 | — |
| Club (Obsidian) | 5 gp | M | C | 1d6 | B |
| Crossbow | 8 gp | R | F | 1d6 | L, 2H |
| Dagger | 1 gp | M/R | C/N | 1d4 | F, Th |
| Dagger (Obsidian) | 3 gp | M/R | C/N | 1d6 | B, F, Th |
| Greataxe | 10 gp | M | C | 1d8 / 1d10 | V |
| Greatsword | 12 gp | M | C | 1d12 | 2H |
| Handaxe | 2 gp | M/R | C/N | 1d6 | F, Th |
| Javelin | 5 sp | M/R | C/F | 1d4 | Th |
| Longbow | 8 gp | R | F | 1d8 | 2H |
| Longsword | 9 gp | M | C | 1d8 | — |
| Mace | 5 gp | M | C | 1d6 | — |
| Morning Star | 5 gp | M | C | 1d6 / 1d8 | V |
| Pike | 10 gp | M | 2×C | 1d10 | 2H |
| Razor Chain | 12 gp | M/R | N | 1d6 | F, La |
| Scimitar | 8 gp | M | C | 1d6 | F |
| Shortbow | 6 gp | R | F | 1d4 | 2H |
| Shortsword | 7 gp | M | C | 1d6 | — |
| Shuriken | 1 gp | R | N | 1d6 | Th |
| Sling | 5 sp | R | F | 1d4 | — |
| Spear | 5 sp | M/R | C/N | 1d6 | Th |
| Spear (Obsidian) | 4 gp | M/R | C/N | 1d8 | B, Th |
| Spear-thrower | 2 gp | — | — | — | S-T |
| Staff | 5 sp | M | C | 1d4 | 2H |
| Stave | 2 gp | M | C | 1d6 | S, 2H |
| Warhammer | 10 gp | M | C | 1d10 | 2H |
| Whip | 10 gp | M/R | N | 1d4 | F, La |

---

## 15. ARMOR

| Armor | Cost | Slots | AC | Properties |
|---|---|---|---|---|
| Leather | 10 gp | 1 | 11 + DEX | — |
| Chainmail | 60 gp | 2 | 13 + DEX | Disadv on stealth, swim |
| **Plate mail** | **130 gp** | 3 | 15 | No swim, disadv stealth |
| Shield | 10 gp | 1 | +2 | Occupies one hand |
| **Round Shield** | **15 gp** | 1 | +2 | One hand, **sundering** |
| **Mithral** (metal only) | ×5 cost | −1 slot | −1 AC | **No penalty stealth/swim** |

**Unarmored AC:** 10 + DEX mod

---

## 16. MOUNTS & VEHICLES

### Mounts
| Name | Cost | Gear Slots | Properties |
|---|---|---|---|
| Camel | 50 gp | 15 | — |
| Silver Camel | 200 gp | 15 | — |
| Donkey | 40 gp | 15 | — |
| Elephant | 400 gp | 25 | — |
| Horse | 50 gp | 15 | ADV on morale |
| War Horse | 100 gp | 15 | Can wear armor |
| Scrag | 150 gp | 10 | — |
| War Scrag | 250 gp | 15 | Can wear armor |

**Mount behavior (2d6 + CHA):**
| Roll | Demeanor | Behaviors |
|---|---|---|
| 0–4 | Horrid | Rebellious, stubborn, malicious |
| 5–7 | Ornery | Only likes owner, sassy, rude |
| 8–9 | Reliable | Steadfast, obedient, protective |
| 10+ | Lovely | Loyal, sweet, affectionate |

### Vessels
| Name | Cost | Gear Slots | Properties |
|---|---|---|---|
| Galleon | 1000 gp | 700 | Oars, weapons, AC 15, 70 HP |
| Longboat | 500 gp | 400 | Oars, portage, AC 12, 40 HP |
| Raft | 40 gp | 50 | Portage, AC 10, 5 HP |
| Rowboat | 200 gp | 100 | Portage, AC 12, 10 HP |
| Sailboat | 700 gp | 600 | AC 15, 60 HP |

### Tack
| Item | Cost | Slots | Properties |
|---|---|---|---|
| Saddle | 30 gp | 1 | Rider ADV on staying mounted; free for mount |
| Wagon | 120 gp | — | No rider on mount, half speed, +15 slots, 1 per mount |

---

## 17. SPELLCASTING

- **Spell DC:** 10 + spell tier
- **Wizard:** 1d20 + INT
- **Priest:** 1d20 + WIS
- **Success:** spell takes effect
- **Failure:** no effect, cannot cast again until rest
- **Nat 20:** may double one numerical effect (focus spells: lasts until next focus check)
- **Nat 1 (Wizard):** cannot cast until rest + roll on Wizard Mishap table for tier
- **Nat 1 (Priest):** deity revokes power; cannot cast until penance + rest

### Penance
GM determines nature based on deity/alignment. Requires holy quest, ritualistic atonement, or material sacrifice donated/destroyed. Inadequate/subversive penance (e.g., donating to a party member) makes the loss permanent.

### Overlapping effects
Same-spell same-target ongoing effects don't stack — the strongest one (longest duration) takes precedence.

### Focus spells
- Some spells last as long as you focus
- Only one focus spell at a time
- Can end at any time
- Maintain with a spellcasting check at start of each turn
- **Failure:** spell ends, but you don't lose the ability to cast it
- **Nat 1 while focusing:** treat as standard critical failure
- Damage or distraction forces immediate focus check

### Scrolls and Wands
- DC = 10 + tier of contained spell
- Failing doesn't affect ability to cast known spells
- **Scrolls:** writing disappears after use (one-shot). Nat 1 = mishap roll.
- **Wands:** stop working until rest on failed cast. Nat 1 = permanently breaks + mishap.

---

## 18. PRIEST SPELLS BY TIER

**Tier 1:** Cure Wounds, Holy Weapon, Light, Protection From Evil, Shield of Faith, Turn Undead
**Tier 2:** Augury, Bless, Blind/Deafen, Cleansing Weapon, Smite, Zone of Truth
**Tier 3:** Command, Lay To Rest, Mass Cure, Rebuke Unholy, Restoration, Speak With Dead
**Tier 4:** Commune, Control Water, Flame Strike, Pillar of Salt, Regenerate, Wrath
**Tier 5:** Divine Vengeance, Dominion, Heal, Judgment, Plane Shift, Prophecy

## 19. WIZARD SPELLS BY TIER

**Tier 1:** Alarm, Burning Hands, Charm Person, Detect Magic, Feather Fall, Floating Disk, Hold Portal, Light, Mage Armor, Magic Missile, Protection From Evil, Sleep
**Tier 2:** Acid Arrow, Alter Self, Detect Thoughts, Fixed Object, Hold Person, Invisibility, Knock, Levitate, Mirror Image, Misty Step, Silence, Web
**Tier 3:** Animate Dead, Dispel Magic, Fabricate, Fireball, Fly, Gaseous Form, Illusion, Lightning Bolt, Magic Circle, Protection From Energy, Sending, Speak With Dead
**Tier 4:** Arcane Eye, Cloudkill, Confusion, Control Water, Dimension Door, Divination, Passwall, Polymorph, Resilient Sphere, Stoneskin, Telekinesis, Wall of Force
**Tier 5:** Antimagic Shell, Create Undead, Disintegrate, Hold Monster, Plane Shift, Power Word Kill, Prismatic Orb, Scrying, Shapechange, Summon Extraplanar, Teleport, Wish

*(Full spell descriptions available in source PDF pp. 54–73.)*

---

## 20. WIZARD MISHAPS (by tier)

### Tier 1–2 (d12)
1. Devastation (roll twice, combine; reroll further 1s)
2. Explosion — 1d8 self damage
3. Refraction — target self
4. Hand slipped — random ally
5. Mind wound — cannot cast this spell for a week
6. Discorporation — one random gear item vanishes forever
7. Spell worm — lose random spell each turn until DC 12 CON
8. Harmonic failure — lose random spell until rest
9. Poof — suppress all light within near for 10 rounds
10. The horror — scream for 3 rounds in Primordial
11. Energy surge — glow purple 10 rounds, enemies ADV vs. you
12. Unstable conduit — DISADV on same-tier casts for 10 rounds

### Tier 3–4 (d12)
1. Devastation (roll twice, combine; reroll further 1s)
2. Blast radius — 2d6 to self + all near
3. Duplicate refraction — self + nearest ally
4. Flubbed incantation — random spell from known
5. Ethereal bandersnatch — 2 random gear items vanish
6. Arcano-mutagenesis — DC 12 CON or random stat → 3 until rest
7. Boom — 30' sinkhole centered on self; DC 15 DEX or fall in
8. Petrification — 1d4 limbs petrified 24 hours
9. Stupefaction — lose all same-tier spells until rest
10. Cannot be unseen — DC 12 WIS or mad raving 1d10 rounds
11. Radioactive energies — draw hostility of all enemies 1d4 rounds
12. Uncontained channeling — DISADV on same-tier and lower for 10 rounds

### Tier 5 (d12)
1. Devastation (roll twice, combine; reroll further 1s)
2. Pyroclastic extrusion — 3d8 to self + all within near
3. Astral incision — permanently forget one random spell
4. The grimlow — summon hostile grimlow for 2d4 rounds
5. Dark plasma aura — attacks vs. you deal double damage 2d6 rounds
6. Gate — portal to another location; dread thing arrives 1d4 rounds unless DC 18 INT closes it
7. Runaway arcana loop — spell targets random creature; keep casting until pass check
8. Arcane obstruction — lose all spells of random tier until rest
9. What lurks beyond the veil — DC 15 WIS or mad raving 1d4 hours
10. Ord's balance — sacrifice magic item OR ability to cast a tier-3+ known spell
11. Unmitigated chain reaction — DISADV on ALL spells for 10 rounds
12. Shred — tear a hole in reality; the lightless tear grows each round

---

## 21. XP & TREASURE

### Treasure quality tiers
| Quality | XP | Examples |
|---|---|---|
| Poor | 0 | Bag of silver, used dagger, dice |
| Normal | 1 | Bag of gold, gem, fine armor, magic scroll |
| Fabulous | 3 | Magic sword, giant diamond, mithral chainmail |
| Legendary | 10 | Staff of Ord, djinni's wish, dragon hoard |

Each PC gets **full XP** per treasure. XP resets to zero on level up.

### Gold expectations per treasure find
- Levels 0–3: 20 gp value
- Levels 4–6: 50 gp value
- Levels 7–9: 80 gp value

### XP sources
- Gold and gems
- Oaths, secrets, blessings
- Magic items
- Meaningful trophies
- Clever thinking (1 XP for ingenuity)

### Wandering monsters
Only **50% chance** of carrying treasure. Poor XP sources.

### Gemstone values
| Gem | Value |
|---|---|
| Pearl | 40 gp |
| Emerald | 120 gp |
| Ruby | 200 gp |
| Sapphire | 280 gp |
| Diamond | 360 gp |
| Giant gem | ×2 |

### Magic item values
When rarely buyable/sellable: weak = 1d6 × 100 gp, powerful = 2d6 × 100 gp.

---

## 22. DOWNTIME & CAROUSING

### Carousing costs & bonuses
| Cost | Event | Bonus |
|---|---|---|
| 30 gp | Worthy night | +0 |
| 100 gp | Full day/night | +1 |
| 300 gp | Two-day tavern crawl | +2 |
| 600 gp | Three-day voyage | +3 |
| 900 gp | Weeklong bender | +4 |
| 1,200 gp | 10-day fete | +5 |
| 1,800 gp | Two-week citywide | +6 |

Each participant rolls **1d8 + event bonus**.

### Carousing outcomes (d8+bonus)
| Roll | Outcome | Benefit |
|---|---|---|
| 1 | Wake up in bed | 2 XP |
| 2 | Stocks 1d4 days, −20% wealth (arson) | 2 XP |
| 3 | Wake in gutter, −15% wealth | 3 XP |
| 4 | Donated 10% to priest | 3 XP + priest ally |
| 5 | −10% (tavern brawl fine) | 3 XP + tavern ban |
| 6 | Thieves' Guild took 5% | 4 XP |
| 7 | Sung insulting song about noble | 4 XP + bard ally |
| 8 | Survived blindfolded knife demo | 4 XP + luck token |
| 9 | Beat rival crawler (talent/trickery) | 5 XP + ally or enemy |
| 10 | Reflected angry wizard's spell | 5 XP + luck token |
| 11 | Pranked corrupt merchant | 5 XP + City Watch ally |
| 12 | Beat noble in drinking contest | 5 XP + noble owes you |
| 13 | Ill-advised sorcerer's tower heist | 6 XP + 80–100 treasure item |
| 14+ | Woke in ruler's stronghold with heirloom | 6 XP + 90–100 treasure if escape |

### Learning
- Find willing teacher
- **DC 18 INT** check
- Fail = retry next downtime at DC one step easier
- Cannot learn other class/ancestry unique talents; auxiliary skills only

### Wizards and Thieves (gambling game)
- Each player brings ~20 coins; 6 to pot to start
- All roll 3d6; highest = active player
- Declare "wizard" or "thief" before rolling 3d6
- 6s (wizards) and 1s (thieves) cancel 1:1 for majority
- Various outcomes based on declaration vs. result
- 3 wizards = active takes pot, game ends
- 3 thieves = pot split among others ("honor among thieves")

---

## 23. NPC ATTRIBUTES

### Monster stat block
- **AC** (base = PL + 10 for generator)
- **HP** (roll d8 per LV + CON mod, or use listed average)
- **ATK** (attacks per turn + weapon/damage)
- **MV** (movement, with special modes noted)
- **Stats:** S / D / C / I / W / Ch modifiers
- **AL** (typical alignment)
- **LV** (level = power)

### Monster spellcasting
Same as PC rules. DC = 10 + tier. Nat 1 on INT/CHA = wizard mishap. Nat 1 on WIS = penance.

### Dark-adapted
All non-humanoid monsters ignore total-darkness penalties. Blinding/deafening still hinders.

### Monster level guidance
- **LV 0–3:** Weak, common. d4/d6 damage. 1–2 attacks. Poor/normal treasure.
- **LV 4–6:** Risky, uncommon. d6/d8. 2–3 attacks. Normal treasure.
- **LV 7–9:** Dangerous, rare. d8/d10. 3–4 attacks. Normal/fabulous treasure.
- **LV 10+:** Mighty, unique. d12 or multi-dice. 4–5 attacks. Fabulous/legendary.

### Encounter balancing (1 monster per PC)
| Party Level | Monster LV |
|---|---|
| 0–3 | 1 |
| 4–6 | 3 |
| 7–9 | 5 |
| 10 | 7 |

Combine LVs for varied group sizes: 4 PCs at LV 4 = 12 combined monster LV.

---

## 24. NPC REACTION (2d6 + CHA)

| Roll | Attitude |
|---|---|
| 0–6 | Hostile |
| 7–8 | Suspicious |
| 9 | Neutral |
| 10–11 | Curious |
| 12+ | Friendly |

### Activity (2d6 for random encounter behavior)
| Roll | Activity |
|---|---|
| 2–4 | Hunting |
| 5–6 | Eating |
| 7–8 | Building/nesting |
| 9–10 | Socializing/playing |
| 11 | Guarding |
| 12 | Sleeping |

### Encounter distance (d6)
| Roll | Distance |
|---|---|
| 1 | Close |
| 2–4 | Near |
| 5–6 | Far |

---

## 25. NPC GENERATION (from CS book)

### Ancestry (d12)
1–4 Human, 5–6 Elf, 7–8 Dwarf, 9–10 Halfling, 11 Half-orc, 12 Goblin

*(Note: Meridia OS uses the Western Reaches weighted table 54/10/10/10/5/5/5/1 instead; already correctly implemented in v8.)*

### Alignment (d6)
1–3 Lawful, 4 Neutral, 5–6 Chaotic

### Age (d8)
1 Adolescent, 2 Young adult, 3–4 Adult, 5–6 Middle-aged, 7 Elderly, 8 Ancient

### Wealth (d6)
1 Poor, 2–3 Standard, 4–5 Wealthy, 6 Extravagant

### NPC qualities (d20 — appearance / does / secret)
See source pg. 125 for full table.

### Occupation (d4, d4)
16-entry matrix: Gravedigger, Carpenter, Scholar, Blacksmith / Tax collector, Farmer, Bartender, Beggar / Baker, Cook, Sailor, Butcher / Locksmith, Cobbler, Friar/nun, Merchant.

---

## 26. RIVAL CRAWLERS

- 1d4+1 members, all same alignment
- Roll 1d6 for each member's starting level
- **Class (d4):** Fighter, Priest, Thief, Wizard
- **Ancestry:** as NPCs
- **Alignment (d6):** 1–2 L, 3–4 N, 5–6 C
- **Renown (d6):** Unknown → Extremely famous
- **Wealth (d6):** Poor → Extravagant
- **Signature tactics (d4 by alignment):** varied lawful/neutral/chaotic behaviors
- **Party secret (2d6):** oath betrayal, false identities, guild debt, treasure map, curse, powerful patron

---

## 27. NPC NAMES

### By ancestry (d20, 6 columns)
Full table on source pg. 128. Examples per ancestry:
- **Dwarf:** Hera, Torin, Ginny, Gant, Olga, Dendor, Ygrid, Pike, Sarda, Brigg, Zorli, Yorin, Jorgena, Trogin, Riga, Barton, Katrina, Egrim, Elsa, Orgo
- **Elf:** Sarenia, Ravos, Imeria, Farond, Isolden, Kieren, Mirenel, Riarden, Allindra, Arlomas, Sylara, Tyr, Rinariel, Saramir, Vedana, Elindos, Ophelia, Cydaros, Tiramel, Varond
- **Goblin:** Kog, Dibbs, Fronk, Irv, Squag, Mort, Vig, Sticks, Gorb, Yogg, Plok, Zrak, Dent, Krik, Mizzo, Bort, Nabo, Hink, Bree, Kreeb
- **Halfling:** Myrtle, Robby, Nora, Percy, Daisy, Jolly, Evelyn, Horace, Willie, Gertie, Peri, Carlsby, Nyx, Kellan, Fern, Harlow, Moira, Sage, Reenie, Wendry
- **Half-orc:** Troga, Boraal, Urgana, Zoraal, Scalga, Krell, Voraga, Morak, Draga, Sorak, Varga, Ulgar, Jala, Kresh, Zana, Torvash, Rokara, Gartak, Iskana, Ziraak
- **Human:** Hesta, Matteo, Rosalin, Endric, Kiara, Yao, Corina, Rowan, Hariko, Ikam, Mariel, Jin, Hana, Lios, Indra, Remy, Nura, Vakesh, Una, Nabilo

### By syllable (d20)
Prefix + Syllable 2 + Syllable 3 + Suffix (mix and match). Full table on source pg. 129.

### Identifiers (d4, d4)
The Gray, One-Eye, The Lesser, The Cunning / Silvertongue, The Outcast, Fasthands, The Bold / The Elder, The Charmer, The Exiled, The Wise / Tree-Speaker, The Craven, The Red, Six-Finger.

---

## 28. CATEGORIZED MONSTERS (statblocks provided)

Full statblocks in source pp. 195–265. Categories represented:

**Common humanoids:** Acolyte, Apprentice, Assassin, Bandit, Berserker, Cultist, Gladiator, Guard, Knight, Mage, Peasant, Pirate, Priest, Reaver, Soldier, Thief, Thug

**Ancestry NPCs:** Elf, Duergar, Drow (+ Priestess, Drider), Deep Gnome, Hobgoblin, Goblin (+ Boss, Shaman), Bugbear, Half-orc equivalents

**Beasts:** Ape (regular, Snow), Badger, Bat (Giant, Swarm), Bear (Brown, Polar), Boar, Camel, Cave Brute, Cave Creeper, Centaur, Centipede (Giant, Swarm), Crocodile, Dinosaurs (Pterodactyl, T-Rex, Triceratops, Brachiosaurus, Plesiosaurus, Velociraptor), Elephant, Frog (Giant), Gorilla, Griffon, Hippogriff, Hippopotamus, Horse, Jellyfish, Leech (Giant), Lion, Mammoth, Manta Ray (Giant), Mastiff, Moose, Octopus (Giant), Owlbear, Panther, Pegasus, Rat (regular, Giant, Dire, Swarm), Rhinoceros, Roc, Scorpion (regular, Giant), Shark (regular, Megalodon), Smilodon, Snake (Giant, Cobra, Swarm), Spider (regular, Giant, Swarm), Stingbat, Vulture, Wasp (Giant), Wolf (regular, Dire, Winter), Worg

**Monsters:** Aboleth, Ankheg, Basilisk, Beastman, Black Pudding, Brain Eater, Bulette, Chimera, Chuul, Cloaker, Cockatrice, Couatl, Crab (Giant), Cyclops, Darkmantle, Deep One, Doppelganger, Dryad, Ettercap, Fairy, Gargoyle, Gelatinous Cube, Ghast, Ghost, Ghoul, Gibbering Mouther, Gnoll, Golem (Clay, Flesh, Iron, Stone), Gorgon, Gray Ooze, Grick, Grimlow, Hydra, Invisible Stalker, Kobold (regular, Sorcerer), Kraken, Leprechaun, Lich, Lizardfolk, Manticore, Medusa, Merfolk, Mimic, Minotaur, Mushroomfolk, Naga (regular, Bone), Nightmare, Ochre Jelly, Ogre, Oni, Orc (regular, Chieftain), Otyugh, Purple Worm, Rakshasa, Remorhaz, Roper, Rot Flower, Rust Monster, Sahuagin, Salamander, Scarab Swarm, Scarecrow, Shadow, Shambling Mound, Siren, Skeleton, Sphinx, Strangler, Treant, Troll (regular, Frost), Unicorn, Vampire, Vampire Spawn, Violet Fungus, Viperian (regular, Ophid, Wizard), Werewolf, Wererat, Wight, Will-o'-Wisp, Wraith, Wyvern, Zombie

**Angels:** Seraph (LV 3), Domini (LV 9), Principi (LV 11), Archangel (LV 16)

**Devils:** Barbed, Cubi, Erinyes, Horned, Imp, Archdevil (LV 16)

**Demons:** Balor (LV 16), Dretch, Glabrezu, Marilith, Vrock

**Dragons:** Desert, Fire, Forest, Frost, Sea, Swamp

**Elementals:** Air, Earth, Fire, Water (LV 6 lesser / LV 9 greater)

**Giants:** Cloud, Fire, Frost, Goat, Hill, Stone, Storm

**Hags:** Weald, Night, Sea

**Outsiders:** Primordial Slime, Void Spawn, Void Spider, Rime Walker

**Djinni & Efreeti** (LV 10, LV 9)

**Legendary named creatures:** Mordanticus the Flayed (LV 19), Obe-Ixx of Azarumme (LV 16 ur-vampire), Rathgamnon (LV 19 sphinx), The Ten-Eyed Oracle (LV 18), The Tarrasque (LV 30), The Wandering Merchant (LV 15)

---

## 29. RANDOM ENCOUNTER TABLES

Source provides full d100 encounter tables for each terrain/location. Categories present:

**Wilderness:** Arctic, Cave, Deep Tunnels, Desert, Forest, Grassland, Jungle, Mountain, Ocean, River/Coast, Ruins, Swamp, Tomb

**Urban:** Artisan District, Castle District, High District, Low District, Market, Slums, Tavern, Temple District, University District

**Also:** "Something Happens!" (d100), Rumors (d100), Adventure Generator (d20 × 3 details, d20 × 3 name), Settlement Generator, Points of Interest

Each urban table has entries specific to that district's character (e.g., Slums has more Bywater Barons and gutter incidents; High District has more nobles and City Watch; Castle District has more knights and dungeons).

*(Full tables in source pp. 143–187. Use directly in Phase 8 encounter pools.)*

---

## 30. TREASURE TABLES BY LEVEL

Four d100 tables corresponding to party level:
- **Treasure 0–3** (mundane through +1 magic items, potions up to 200 gp)
- **Treasure 4–6** (up to +2 magic, more spell scrolls, plate mail)
- **Treasure 7–9** (up to +3 weapons, potions, wands, magic armor with virtues)
- **Treasure 10+** (up to legendary artifacts, giant gems, named items)

Also included:
- **Unique features table** (d20)
- **Luxury items table** (d20 × features + items)
- **Boons:** Oaths (d8), Secrets (d12 × 2), Blessings (d12)

*(Full tables in source pp. 270–281.)*

---

## 31. MAGIC ITEM SYSTEM

### Structure
- **Type (d6):** Armor, Potion, Scroll, Utility, Wand, Weapon
- **Qualities (2d6):**
  | Roll | Benefit | Curse |
  |---|---|---|
  | 2–3 | – | 1 |
  | 4–7 | 1 | 1 |
  | 8–11 | 1 | – |
  | 12 | 2 | – |
- **Personality (2d6):**
  | Roll | Virtue | Flaw |
  |---|---|---|
  | 2–3 | – | 1 |
  | 4–9 | – | – |
  | 10–11 | 1 | 1 |
  | 12 | 1 | – |

### Armor tables
- **Type (2d6):** 2–5 Leather, 6–7 Chainmail, 8–9 Shield, 10–11 Plate mail, 12 Mithral+reroll
- **Bonus (2d6):** 2–5 +0, 6–8 +1, 9–11 +2, 12 +3
- **Features / Curses / Benefits:** d20/d12 tables

### Weapon tables
- **Type (d20):** distribution weighted toward common weapons
- **Bonus (2d6):** 2–3 +0, 4–9 +1, 10–11 +2, 12 +3
- **Features / Curses / Benefits:** d20/d12 tables

### Personality tables
- **Virtue (d20):** helpful behaviors (protects allies, warns of danger, gives strategic advice, etc.)
- **Flaw (d20):** hindering behaviors (afraid of things, favors past owners, refuses tasks, etc.)
- **Trait (d4×d4):** 16-entry personality matrix

Full magic item catalog in source pp. 298–321 (~90 named items including class-locked artifacts, deity-locked gear, and mode of use).

---

## 32. SITE GENERATION

### Shadowdark maps
- **Size:** Small (5d10), Medium (8d10), Large (12d10)
- **Type:** Cave, Tomb, Deep tunnels, Ruins
- **Room contents (d10):** Empty, Trap, Minor hazard, Solo monster, NPC, Monster mob, Major hazard, Treasure, Boss monster
- Boss located in highest-rolled room

### Settlement maps
- **Type:** Village (3d4), Town (4d4), City (6d6), Metropolis (8d8)
- **Districts (d8):** Slums, Low, Artisan, Market, High, Temple, University, Castle
- **Alignment (d6):** 1–3 L, 4–5 N, 6 C (chaotic districts treated as risky)
- Each district has 1d4 points of interest with specific tables

### Overland hex maps
- **Terrain (2d6):** Desert/arctic, Swamp, Grassland, Forest/jungle, River/coast, Ocean, Mountain
- **New hex (2d6):** step in circular loop
- **Danger:** Safe, Unsafe, Risky, Deadly
- **Points of interest (d20):** Small tower, Fortified keep, Temple, Village, Town, City, etc.
- **Cataclysm (d8):** Volcano, Fire, Earthquake, Storm, Flood, War, Pestilence, Magical disaster

---

## 33. TAVERNS

Three quality tiers:
- **Poor:** 2 drinks (d6 each), 3 Poor foods
- **Standard:** 3 drinks (2d6 each), 1 Poor + 2 Standard foods
- **Wealthy:** 4 drinks (d12 each), 2 Standard + 2 Wealthy foods

### Food (d12 by tier)
- **Poor (1d4 cp):** Boiled cabbage, dates and olives, goat stew, pickled eggs, cheese and bread, hearty broth, meat pastry, mushroom kebab, roasted pigeon, garlic flatbread, turkey leg, rat-on-a-stick
- **Standard (1d6 sp):** Alligator steak, rosemary ham, raw flailfish, seared venison, buttered ostrich, spicy veal curry, salted frog legs, herbed snails, grilled tiger eel, spit-roasted boar, saffron duck neck, crimson pudding
- **Wealthy (1d8 gp):** Fried basilisk eyes, giant snake filet, griffon eggs, candied scarabs, baked troll bones, cockatrice wings, crispy silkworms, roasted stingbat, dire lobster tail, wyvern tongue, shrieking seaweed, dragon shanks

### Drinks (d12)
- Barnacle grog (1cp, DC 9 CON or blind 1hr)
- Watered swill (3cp, −1 CON 1hr)
- Vinegary wine (5cp, −1 CHA 1hr)
- Stale ale (5cp, −1 WIS 1hr)
- Clear spirits (1sp, ends 1 bad effect)
- House ale (2sp, first free)
- Autumn mead (3sp, doubles next drink effect)
- Halfling summer wine (5sp, +1 CHA 1hr)
- Elvish brandy (5sp, +1 INT 1hr)
- Dwarvish gold ale (5sp, regain 1d4 HP/mug)
- Aged royal wine (2gp, +1 WIS 1hr)
- Van Dinkle whiskey (20gp/sip, only 5 bottles made, +1 XP)

---

## 34. SHOPS

### Types by district
- **Poor (d12):** Filthy bakery, used gear, corpse collector, pawn/fence, moneylender, manure, tannery, back-alley chirurgeon, ratcatcher, fishmonger, gambling house, drug den
- **Standard (d10):** Brewer, butcher, tailor, common blacksmith, adventuring gear, leatherworker, shipwright/carpenter, stonemason, herald/crier, livestock
- **Wealthy (d10):** Fine tailor, glassblower, jeweler, apothecary, artist, scribe, guildhall, goldsmith, master blacksmith, antiques and curios

---

## 35. TRAPS & HAZARDS

### Traps
- Should have a hint or tell
- **Searching:** in the right area = auto-reveal
- **Disabling:** thieves/trained tinkerers describe method; success if reasonable + enough time; time pressure or high skill = stat check
- **Trap features (d6 × 2):** Crude/Ranged/Sturdy/Ancient/Large × Ensnaring/Toxic/Mechanical/Magical/Deadly

### Hazards
- **Movement restriction:** quicksand, ice
- **Damage:** toxic spores, acid rain
- **Weakening:** antimagic zones, strength-sapping vapors
- **Minor (d6):** Short fall, stuck barrier, dense rubble, collapsing walls, enfeebling magic
- **Major (d6):** Long fall, toxic gas, entrapping terrain, antimagic zone, drowning

---

## 36. CONDITIONS

Common sense adjudication. Advantage/disadvantage apply to most situations.

Examples:
- **Blinded:** disadvantage on sight tasks
- **Paralyzed / Stuck in web:** cannot move
- **Deafened:** disadvantage on hearing tasks

---

## 37. SUMMARY OF WHAT MERIDIA OS NEEDS FROM THIS

For each planned phase, the relevant sections:

- **Phase 3 (Party):** §7 Ancestries, §8 Classes, §9 Level 0/1, §10 Alignment/Deities, §11 Titles, §17 Spellcasting (for spellcaster PCs)
- **Phase 4 (Buildings):** §36 Conditions, §34 Shops (structure), plus door HP/lock DCs from §3 (DC table)
- **Phase 5 (Shops & Economy):** §13 Gear slots, §14 Weapons, §15 Armor, §16 Mounts/Vehicles, §21 Treasure XP tiers, §33 Taverns (food/drinks/effects), §34 Shops (types by district)
- **Phase 6 (NPC quality pass):** §23 NPC/Monster attributes, §25 NPC generation, §26 Rival crawlers, §27 NPC names, §28 Monster catalog
- **Phase 7 (Social model):** §24 Reaction table (2d6+CHA)
- **Phase 8 (Encounters):** §29 Encounter tables (all terrain/urban categories), §23 Encounter balancing
- **Phase 9 (Carousing):** §22 Carousing costs/outcomes, §22 Wizards and Thieves game
- **Phase 10 (Rumours):** Rumors d100 table (in §29)
- **Phase 11 (Magic items & insanity):** §31 Magic item system, §21 Magic item values
- **Phase 12 (Beyond the city):** §6 Overland travel, §32 Site generation

---

*End of compilation. If any Meridia OS system contradicts values in this document, this document wins.*
