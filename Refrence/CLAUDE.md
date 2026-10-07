# MERIDIA OS — project memory for Claude Code

Read this at the start of every session. Update it at the end of every session with decisions and changes.

## Who you're working with
- Caleb, 20. Runs a Shadowdark campaign. **Cannot code.** Learned by tinkering in Roblox: comfortable changing values, colours and button positions in existing code, not writing it.
- Talk to him directly. No cushioning. Show your reasoning. Push back when an idea is weak or costs more than it's worth.
- Plain English. After every change, say **what changed, why, and exactly how to see it** (which page, which button).
- Ask before deleting files, restructuring, or anything hard to undo.

## What Meridia OS is
A referee's console for his Shadowdark campaign in **the City of Masks (Meridia)** from *Cursed Scroll 6*, set in the **Western Reaches**. It's an OS-style shell with a bottom taskbar and apps, not a menu-driven generator.

**The goal:** a **living-world simulation running behind the scenes**, so the city feels caused rather than rolled. He spends his attention performing NPCs and running plot instead of inventing details. Examples: prices that **fluctuate daily**, NPCs with lives and memories, factions acting, weather with mechanical effects, events tied to places.

**Use the rules:** incorporate **as many of the books' tables and rules as possible**. Prefer a real table from the books over an invented one.

**Tone:** Cyberpunk 2077's Night City. The city is violent but not lawless; the fantasy is low, grimy, with a Shadowdark economy. **The cyberpunk HUD look must be kept and pushed further**: neon on dark, scanlines, angled tags, glow, mono type.

## Reference files (in this folder) — order of authority
1. `Shadowdark_RPG_-_V4-9.pdf` — **the core rulebook. Final authority on all rules, tables and prices.**
2. `shadowdark-ruleset-compilation.md` — an extracted summary of the core rules. Handy, but if it disagrees with the PDF, **the PDF wins**. Tell Caleb about any disagreement you find.
3. `975179835-Cursed-Scroll-6-City-of-Masks…pdf` — the city: districts, 50 numbered locations, book NPCs, rumours, city tables, carousing, the map (pages 2–3). Also the **Duelist class**.
4. `Player's Guide to the Western Reaches (Preview).pdf` — ancestry population table, Half-elf, the Roustabout class, factions, city-states.
5. `Game Master's Guide to the Western Reaches (Preview).pdf` — the Nine gods, the Lost, regional detail.
6. `equipment-emporium-shadowdark.md` — supplementary gear converted to Shadowdark. Weapons and armour are excluded because the core book covers them. Every item has a shop-tier tag `[P][M][U][H]`; §21 says which shop types stock what.
7. `Cursed Scroll 1 -character options.pdf` — the **Warlock** (six named patrons, replacing the old Western Reaches warlock — see below), **Witch**, and **Knight of St. Ydris** classes, plus their shared Diabolical Background table.
8. `Cursed Scroll 2 - Red Sands V2-2.pdf` — the **Desert Rider**, **Pit Fighter**, and **Ras-Godai** classes, plus new weapons (blowgun, bolas, razor chain, shuriken). No background table or spellcasting of any kind in this book — Ras-Godai's "sorcery" is the Black Lotus Talents (d12), not spells.
   `Cursed Scroll 3 - Midnight Sun V3-5.pdf` — the **Sea Wolf** and **Seer** classes (Seer casts real spells, full list wired in), the Nord Background table, and the Old Gods (Odin/Freya/Loki — mapped onto Lawful/Neutral/Chaotic, see below). Both books' hex-crawls, monsters, and minigames (pit fighting, poisons, enduring wounds, mounts) were left unintegrated — flagged as available if wanted later, not needed for NPC generation.
9. `Bard and Ranger Classes V1-3.pdf` — the **Bard** and **Ranger** classes.

**No Kobold ancestry exists in any reference file** — checked the core rulebook and both Western Reaches previews; Kobold only appears as one line on a population-roll table with no trait attached. Dropped from the pickable ancestry list (2026-09-17) rather than invented. If a full (non-preview) Player's Guide turns up with real Kobold text, wire it back in.

**Never invent a rule and present it as canon.** If something isn't in the files, mark it in code with `// NOT IN REFS — check` and tell him.

## Non-negotiable principles
1. **Nothing is canon until he approves it.** Automatic processes surface as proposals he can accept, edit or reject. Exceptions that run silently: weather, and supply-and-demand pricing.
2. **Generated values are defaults, never facts.** Every field is editable, and edits stick forever.
3. **Nothing needs setup.** Every field fills itself with a sensible default the first time it's needed. He should never face an empty form.
4. **Quantum state.** Things stay undecided until observed, then lock permanently. This covers building owners, shop stock, who's inside a building, and rumour truth.
5. **Speed over completeness.** Keep few things on screen; put the rest behind search and collapse. Long scrolling menus are his biggest pain point.
6. **Everything connects.** All systems share one world state.
7. **Flexibility above all.** Rigidity is his main complaint. A tool he can't overrule mid-scene is worse than no tool.

## Table setup
- 4–6 players; the roster varies by who shows up.
- **A laptop at the table**, so desktop layout comes first. Players never see the screen.
- **Prep mode / Play mode.** Play hides destructive buttons and slims each app down.
- Players keep normal character sheets.

## Current state — migrated to a real project (2026-09-16)
`meridia-os-v13.jsx` (kept in the project root for reference, untouched) has been split into a real **Vite + React** project under `src/`: `lib/` (theme, rng, audio, storage), `data/` (npc.js, shadowdark.js — the tables), `logic/` (generator.js, sheet.js — the rules), `ui/` (primitives.jsx, CharSheet.jsx), and `App.jsx` (the shell). Saves now go through real `localStorage` (`src/lib/storage.js`), same key (`meridia-os:v7`) and format as before, so old backups still restore. Git is initialized with one commit. Node.js and Git were not installed on this machine — both were installed via `winget` with Caleb's go-ahead.

Behaviour and look were not changed. Verified in the browser after the split: NPC generation (Scan), Book NPC hydration, the Combat character sheet (stats/HP/AC), damage tracking (DMG/HEAL/-1/-3/-5 syncing HP everywhere), crowd muster, Locations (scan-here), Party, Config (including Your data → backup), PREP/PLAY mode, and global search.

**First job left: turn it into a real project** — mostly done; see Migration below for what's left (regression scripts, world-data file sync).

**Shell**
- Three columns: the open app, the NPC file, and a party rail in Play mode.
- A bottom taskbar with apps, PREP/PLAY toggle, sound toggle, in-world day/night and a real clock.
- Global search (`/` or Ctrl+K).
- Apps: **NPCs · Locations · Party · Config**.

**NPCs app** — tabs: Generate · Book · Group · Saved · Settings.
- 44 jobs, the Western Reaches ancestry mix, origins, the Nine gods, criminal records and bounties, conditions, live situations, voice kits, connections, places, shops and rumours.
- 56 book NPCs, seeded from their names so they come out the same every time.

**NPC file** — tabs: Overview · Identity · Talk · Record · Trade · Combat · Notes.
- **Combat** is a filled Shadowdark character sheet, built by `buildSheet()` into `npc.sd`. It shows scores, HP now/max, AC, ancestry trait, class, title, background, deity, rolled talents, real weapons, spells, languages, 20 gear slots, free-to-carry items and a pocket-change purse.
- Classes: the core four, plus Roustabout and Warlock from the Western Reaches. LV0 NPCs have no class.
- `syncThreat()` copies AC, HP and attack out to the quick numbers so every view agrees.
- **Damage tracking:** DMG/HEAL, Bloodied at half HP with a morale reminder, Dying at 0 with the death timer, then Stable or Dead. It works on crowd rows too.
- **ROLL:** d20 + bonus, damage rolled, a natural 20 doubles the dice.
- **Reactions** use the core table: 2d6 + CHA of whoever is talking. Party members have a CHA value.

**Coherence**
- The dependency chain: job → wealth → lodging → record → conditions → situation.
- `fitsNpc()` / `repairDetails()` re-roll any detail that contradicts the person. Children get child-safe pools.
- Filters that conflict show a ⚠ warning on the file instead of being silently ignored.

**Saving**
- Storage key is **`meridia-os:v7`**. Never rename it.
- Saving is debounced; it never overwrites a save it failed to read, and a "NOT SAVING" banner appears if storage refuses.
- Config → Your data has backup, restore and reset.
- The saved list is capped at 600.

**Internal ids you must not rename:** app/tab ids `scan`, `named`, `muster`, `archive`, `city`; the old ones map to `npcs` via `LEGACY_APP`.

## Migration (first sessions)
1. ✅ Turned v13 into a **Vite + React** project, split into sensible files. Tailwind behaves the same (only standard utility classes were used, no arbitrary-value syntax, so no config surprises).
2. ✅ Replaced `window.storage` (claude.ai only) with `localStorage`, keeping the **same key and backup format** so his Backup text restores.
3. ✅ Git set up (one commit so far), `README.md` written, dev server runs (`npm run dev`).
4. ✅ Regression tests rebuilt as `scripts/regression.mjs` — run with **`npm run regression`**. Generates ~56,000 NPCs across every job, every template, every faction, every book NPC, and a large random sample; checks for crashes, unfilled `{tokens}`, illegal weapons/armour/spells for class, bad HP/AC, duplicate languages, and specific contradictions (a child with a class, a notable NPC whose secret doesn't match what they are, etc). Currently clean. Rerun it after changing any generator data or logic.
5. Later, save world data to a file in the project folder so git syncs it between his **desktop and laptop**. Browser storage doesn't sync.

## Classes are vocations, not stat blocks (2026-09-17)
Most NPCs have **no Shadowdark class at all** — a shopkeeper isn't secretly a Fighter just to have a stat block. `CLASS_CHANCE` (`src/data/shadowdark.js`) gives each job a probability of having any class; most trade/labor jobs are under 10%, martial/arcane/clergy jobs where the job *is* the training run 80–95%. A miss means the level0 chassis, but still scaled off the job's own hit die at higher levels — no talents, no class weapon lock, just a capable civilian.
**Exception:** thief, priest, duelist, bard, and mage are pinned to 100% — the job title literally *is* the trained class's name, so a "Thief" with no Thief training isn't a flavorful exception, it's a contradiction (Caleb caught this after the first pass). cutpurse and other petty/amateur equivalents are untouched and stay rare.
On top of that, `RARE_CLASS_CHANCE` (0.5%) lets a **Warlock, Witch, or Knight of St. Ydris** turn up under any job at all, any level, regardless of the normal odds — a shopkeeper, a beggar, a guard. This is deliberate: those three are supposed to be a surprise. When one hits, the NPC gets a "⚠ NOT WHAT THEY SEEM" badge, a background drawn from the Diabolical Background table instead of their job's usual pool, a small bump to their record heat (they have more to hide), and — since 2026-09-17 — their **Talk → Interior → Secret** field is overwritten with a line that names what they actually are (`NOTABLE_SECRETS` in `npc.js`, filled in with the warlock's own patron by name). Before that fix, the badge was the only place their hidden nature showed up; the "secret" a player could dig for was still a random unrelated city secret. Knight of St. Ydris never appears in the ordinary per-job pools — only through this rare overlay, since it's a secret cursed order, not a career.
Six named Warlock patrons (Almazzat, Kytheros, Mugdulblub, Shune the Vile, Titania, the Willowman) live in `WARLOCK_PATRONS`, each with its own boon table from Cursed Scroll 1. Note: Shune the Vile is *also* one of the Nine Gods in the existing faith system — that's not a bug, both books use the same deity.
Templates got a light pass to match (see `TEMPLATES` in `npc.js`) — added a "Duelist" scenario. The rest were already reasonable scenario buckets; the actual "whim" was the class-assignment mechanic underneath, not the menu.
Regression testing turned up one unrelated pre-existing bug fixed in passing: `generator.js`'s alignment-mismatch warning used `alLabel` without importing it — crashed whenever an explicit alignment filter conflicted with a rolled faction's alignment (rare in normal play, common once the regression suite swept every align × faction combination).

## Five more classes wired in (2026-09-17): Desert Rider, Pit Fighter, Ras-Godai, Sea Wolf, Seer
Same vocation/rarity system as above — `CLASS_CHANCE` and `ROLE_CLASS` in `shadowdark.js` fold these into existing jobs rather than inventing new ones: **Pit Fighter** dominates the `gladiator` job (labeled "Pit fighter" — same job-name-is-class-name fix as Thief, now pinned to 100%), **Ras-Godai** is a minority pick for `assassin`, **Sea Wolf** for `sailor`/`smuggler`, **Seer** for `fortuneteller`/`pilgrim`, **Desert Rider** for `noble` — these last few read as foreign visitors/mercenaries in a cosmopolitan city, not natives. Sea Wolf and Seer pull their background from `NORD_BACKGROUND` (Cursed Scroll 3's own table) instead of the city's job-category pools, same pattern as the Diabolical classes.
The Sea Wolf's and Seer's "Old Gods" (Odin/Freya/Loki) needed no new random state — they map directly onto Lawful/Neutral/Chaotic, filled into feature text via `{god}`.
Ras-Godai's "sorcery" is the Black Lotus Talents (`BLACK_LOTUS_TALENTS`, `rollBlackLotus()` in `shadowdark.js`) rather than spells — the book has no spellcasting for any Cursed Scroll 2 class.
**Caught during a direct PDF re-check, not the research pass:** the CS3 Sea Wolf/Seer talent and title tables came back from the first extraction shifted by one row (a `pdftotext -layout` artifact) — re-read in `-raw` mode before encoding anything, which is why those tables are correct now. Worth remembering for any future book extraction: cross-check a raw-mode read before trusting a layout-mode table dump, especially for anything with a numbered "2" row that a two-column PDF page can easily separate from its own text.
Not wired in: CS2/CS3's hex-crawls, monster stat blocks (including two solid personality-roll tables — Salamander and Duergar NPCs, pg. 63–64 of CS2 — worth a look if he ever wants a "flavor NPC" mini-generator), the Pit Fighting minigame, Poisons, Enduring Wounds, and Mounts systems. All are live-play GM tools, not generator data, and out of scope for this pass.

## Sound rebuild + saves moved to seed + edits (2026-09-17)
**Sound** (`src/lib/audio.js`, `src/App.jsx`): replaced raw square/sawtooth beeps with filtered, softly-enveloped voices — a linear attack instead of an instant on, a biquad lowpass/bandpass filter, optional stereo pan, a quiet octave-up harmonic layer for body — plus a filtered-noise-burst helper for percussive impacts. Interface (tap/back/open/toggle/save/alert/scan/muster) and combat are now genuinely separate: combat has its own sounds (hit, crit, fumble, damage, heal, dying, death) instead of borrowing "scan"/"save"/"alert" like before, and DMG/HEAL/the attack ROLL/marking someone DEAD each play the sound built for that moment. Two new Config toggles (Interface sounds, Combat sounds) sit alongside the master mute, plus a TEST SOUNDS row to audition any of them without triggering real actions.

**Saves — seed + edits, not full objects** (`src/logic/generator.js`, `src/App.jsx`, `scripts/regression.mjs`): a freshly-scanned NPC now carries the seed and settings it was generated with (`generateSeeded()`). This works because `generateNPC` was already fully deterministic once RNG is swapped to a seeded stream — exactly what `hydrateBookNpc` has relied on all along for book NPCs. The only non-reproducible field is `id` (built from `Math.random()` directly, not the seedable RNG), so it's carried separately, never diffed. Saving regenerates a fresh baseline from `{seed, genSettings, genKeep}`, diffs it against the live NPC (`diffNpc`), and stores only what differs as `edits` — a rename, a partial reroll, a damage tick, whatever it is, the diff doesn't care which. Loading regenerates and reapplies (`applyEdits`). **Anything without a seed — a book NPC, a crowd/muster member, or a save from before this existed — is kept as a full object, untouched.** Nothing is ever orphaned; those cases are just not compacted yet.
This was the highest-risk change of the session (it touches his real save data), so it got proportionally more verification: `scripts/regression.mjs` now generates ~2,000+ NPCs, regenerates each from its own seed independently, requires the diff against a pristine regen to be empty, simulates edits, reapplies them, and requires byte-identical reconstruction. It caught one real bug before any live storage code was touched — not in the seed mechanism (a standalone diagnostic confirmed `generateSeeded` was already perfectly deterministic), but in the *test's own* comparison, which forgot to reattach the seed/genSettings/genKeep bookkeeping fields to the rebuilt object before comparing. Worth remembering: when a round-trip test fails, check whether the bug is in the thing under test or in the test's own comparison before assuming the mechanism is broken.
**Not yet compacted:** crowd/muster-generated NPCs still save as full objects even if individually kept — only the single-scan path (`run()`) is seeded so far. Extending `generateSeeded` to `runCrowd`/`muster` would close that gap if the full-object crowd saves ever become a real size problem.

## The spine and the Map app (2026-09-17)
**The spine** lives in `src/logic/world.js` and is saved as `world` inside the same `meridia-os:v7` key (additive — old saves just get the defaults). Watches are **Dawn · Morning · Midday · Afternoon · Dusk · Night** (he picked this set over his original draft). Time only moves when he taps: `NEXT WATCH` advances one and rolls into the next day past Night, any watch is tappable directly, and `NEXT DAY` jumps. `world.on` switches the whole thing off, which restores the old day/night taskbar flip exactly as it was. While it's on, the current watch sets `s.time`, so advancing to Dusk genuinely changes what the next generated stranger is doing.
**Undo** rewinds position in time only — day, watch, party position, restored *field by field, never a blanket spread of the snapshot*. Early snapshots included the log, and spreading one wiped notes written since; that's fixed and guarded against old snapshots still sitting in saved data. Undo writes its own log line rather than erasing history.
**The day log** records every advance, party move and undo automatically, plus his own typed lines, grouped by day and colour-coded by kind. Reachable from the taskbar clock or the Map app.
**No invented calendar.** The books give Meridia no named months, so the spine counts days and offers an optional free-text date field. Don't fill that in with homebrew month names.

**The Map app** (`src/ui/CityMap.jsx`; data in `src/data/citymap.js` + the generated `src/data/citymap_gen.js`; art at `public/meridia-map.png`). The art is the genuine Cursed Scroll 6 spread (pp. 2–3) rendered through a **CSS mask over a flat neon colour**, so the printed streets, canals and bridges glow instead of inking. Three stacked passes (two blurred, one crisp) make the bloom; a tech grid sits under it and scanlines over it. It washes **violet at Dusk/Night, cyan by day**, straight off the spine.

### The geometry was wrong, and this is why (fixed 2026-09-18)
Caleb said the map "does not look accurate" and that the location hitboxes were offset. Both had the same single cause. **Pages 2–3 of the CS6 PDF are one full-page bitmap each** (1796×2933 and 1815×2933, no text layer at all); stitched side by side they join seamlessly into the printed spread at **3611×2933, aspect 1.231**. The first version rendered the PDF *pages* instead of extracting the embedded images, and the page media box has a different aspect than the image it carries — so the shipped art was **stretched horizontally by 14.5%** (aspect 1.410). Every coordinate read off that stretched copy drifted, and the drift grew with distance across the map. If a map ever looks subtly wrong again, **check the asset's aspect against the embedded image's, not against the page's.**
The rebuilt pipeline: extract both embedded images at native resolution → stitch → paint out the 50 badges and 9 district plates → crop to the ink bounding box (**3230 × 2855**) → white line art on transparency, 3000px wide with alpha posterised to 16 levels (1.5 MB, down from 3.5 MB at full alpha — it matters because the repo syncs between two machines). **The art is pre-cropped to the coordinate space, so every layer is `inset: 0` and the SVG viewBox is the whole image. There is no offset or scale factor anywhere between the art and the overlay** — that was the previous design's weak point.
**The 50 pins were measured, not eyeballed.** The printed badges are solid black discs of radius 32; they were found as peaks of the distance transform of the filled ink (which survives a badge being fused to neighbouring line art), each number read off a montage of crops, then **all 50 drawn back onto the art and checked quadrant by quadrant.** Two needed hand correction: 17 had grabbed an adjacent cartwheel, and 13 sits on The Duke's Bridge and had snapped to the bridge bar. Worth remembering: a template match with an annulus penalty was tried for refinement and made things *worse*, dragging badges in dense districts out onto clear paper. The distance-transform peak was the right tool.
**Numbered badges and district name plates are painted out of the art** on purpose — he asked for them gone. The named places are now interactive markers instead: dots at low zoom, names appearing past 2.6×.

### Buildings (rebuilt 2026-09-21 — a building is an INK BLOB, not an enclosed white region)
Caleb's report: *"only half the buildings are on the map and the buildings' roofs are split into separate buildings."* Both symptoms, one cause — **the extraction used the wrong primitive.** The first pass took the white regions fully enclosed by ink. But look at how the art is actually drawn: a wealthy house is oblique, with a **ridge line dividing the roof** and dormers drawn on it; a poor terrace is plan view, with **internal room divisions**. So an enclosed white region is a *roof facet, a dormer, a window, or a room* — never a building. Hence a hipped roof arriving as two buildings, a terrace arriving as one building per room, and most of the city reading as absent.
**The right primitive:** the cartographer draws each structure as a closed outline with all its detail drawn inside and *touching* it, so **one building is one connected clump of ink**, and its footprint is that clump **with its holes filled**. That gets roof and walls together as one shape, which is what he wanted. `BUILDINGS` is now **889 whole structures** (against 842 fragments), and coverage is comprehensive in all eight districts.
**Non-buildings are rejected by measurement, not by hand.** Each rejection is a distinct signature, and this is the part worth not re-deriving:
- **Filled area** kills the flooded features. A thin open-ish boundary — shoreline, castle curtain wall, bridge rail — floods a huge empty region when its holes are filled. Those come out at 38k–74k px against a 98th-percentile building of 5.7k, so a cap at 20k is clean and nowhere near any real building.
- **Largest single hole** kills ponds and parks. A building's holes are rooms and windows, each small; the Rookery pond is *one* hole of 21k px. Cap 2.6k.
- **perimeter²/area** kills foliage. A drawn building sits at ~19, a tree's wiggly outline far higher. Cap 150 — deliberately loose, see below.
- Plus a floor on ink-per-footprint and on solidity.
**Two tuning traps, both hit and both costly to rediscover.** (1) `perimeter²/area ≤ 60` looked right from the percentiles and silently **deleted Rilken Row's long snaking terraces**, which are legitimately complex — the *area* cap is what separates a flooded shoreline from a snaking building, not the complexity cap, so keep complexity loose. (2) Raising the solidity floor to drop a decorative star also drops real **L- and crescent-shaped terraces** — the four lowest-solidity kept items are all genuine buildings at 0.40–0.43, so the floor stays at 0.22 and the occasional ornament, tree or moored boat stays clickable. **That is a deliberate trade: a stray ornament costs nothing, a missing terrace is the bug he reported.**
Polygons are simplified to **2.5px absolute** (not a fraction of perimeter — a fraction swallows the courtyards of U-shaped blocks), which is well under a drawn wall's thickness, so hitboxes hug the art. ~8.8 vertices per building, 129 KB.
Each building is tagged with the district of its **nearest numbered location**, which reproduces the printed dashed boundaries closely; that assignment also drives the district highlight, so the wash is correct *by construction* rather than hand-traced (hand-traced polygons were what made the first attempt inaccurate).
**Also fixed here:** `SIZE()` in `citymap.js` read `b.a`, a footprint area **that was never emitted** — so it was `undefined`, every comparison was false, and *every building in the city fell through to "large"*: all mansions and warehouses, 2–3 floors, up to 9 occupants. The area is emitted now and the thresholds are the real **terciles** (950 / 1900 px), so the city comes out roughly a third small, a third middling, a third large. Verify generator changes by tallying the whole city (889 buildings → 1f/2f/3f = 333/361/195, 2,236 souls, lock DCs spread across the ladder), not by eyeballing one building — a constant field reads as plausible on a single sample.
Identity is `bldgId()`, derived from the footprint's own position rather than its array index, so regenerating the geometry doesn't rename every building in the city.
Tapping one gives an **address, an exterior read-aloud, and ENTER BUILDING** → state, floors, cellar, who's in, what you hear, what it smells of, ways in, and the door. Then SCAN generates exactly that many people, labelled with the address. All of it is derived from the building's id through a **local seeded RNG**, so a building reads the same every time and looking at one never disturbs the dice stream an NPC is being generated from. Nothing is stored, so nothing can go stale.
## The Tables app — encounters, treasure, magic items (2026-10-07)
One app for rolling on anything the book prints. Left panel picks a table, **results land in the main pane and stack up** so a whole night's rolls stay on screen (the side column squeezes a hoard to one word per line). Three tabs:
- **Encounters** — all 22 d100 tables. The nine urban ones also roll straight from the Map; the 13 wilderness ones are only reachable here.
- **Treasure** — `rollHoard(level)` rolls the book's table for the party's level 3–5 times plus a gemstone, a luxury item and a unique feature. Or one roll on any of the 10 treasure tables.
- **Magic items** — `rollMagicItem()` composes one per §31 (type on d6, then qualities and personality on 2d6, then that type's own feature/bonus/curse/benefit tables), or pull one of the **97 named items**. Or roll any of the 33 generator tables individually.

`src/data/loot_gen.js` is generated: 10 treasure tables, 33 generator tables, 97 named items (printed pp. 269–321), all core. `src/logic/loot.js` holds the rolling and composition.
**Three extraction traps, all silent.** (1) These pages are *mostly* one full-width table but a few print two side by side — a page counts as two-column only when **two headings sit at the same height**. Testing "is a heading right of centre" instead shredded the single-column tables, because a long row centres past the fold and vanished into a column with no heading, and a row landing *exactly* on the fold (Oaths 6, x=210 of 420) disappeared. (2) A table can **continue onto the next page without reprinting its heading**, so the current heading carries across pages. (3) A **2d6 table runs 2–12, not 1–6** — validating against the die's face count instead of its real span flagged every 2d6 table as broken and hid the genuine gaps.
**Two data shapes to respect.** `partial: 1` marks a table the extractor could not fully recover — only *Unique Feature*, where 4 of 20 rows are unreachable in the text layer; `rollTable` picks evenly among the rows present for those, so an incomplete table degrades quietly instead of returning nothing. And **Personality Trait is a d4×d4 matrix**, so a row holds four traits side by side: taking the whole row produced "Imperious Polite Puritanical Charming", and it now splits the row and picks one.

## Encounters (2026-10-07) — Phase 8, partly built
`src/data/encounters_gen.js` holds **all 22 of the core book's d100 encounter tables, 1,100 entries** (printed pp. 143–187), extracted by a scratchpad script. All core, nothing homebrew.
**The reason this was worth doing first: the book's city IS Meridia**, so its nine urban tables line up one-for-one with the eight districts via the `cat` already on `DISTRICTS` in `npc.js` (University→ged, Low→gut, High→hig, Castle→mon, Temple→nin, Slums→ril, Artisan→sil, Market→roo). That mapping is `DISTRICT_TABLE`. Tavern is situational rather than a place, so it isn't in it. The other 13 are wilderness terrains, unused so far.
Selecting a district on the Map gives **ROLL ENCOUNTER**, which rolls its own table and writes the result to the day log (kind `enc`), because "what happened and when" is the spine's job.
**Two extraction traps.** The book prints these as **percentiles — 01–99 plus 00, where 00 is 100** — so a naive parser files the 100 entry under 0 and the table silently starts at zero. And any non-`ENCOUNTERS` all-caps heading has to **end** the current table: without that, the monster-creation tables that follow the last one (ARMOR CLASS, MONSTER MUTATIONS and the rest) had their rows appended to University District, which then "covered" 132/100. The generator now asserts every table covers 1–100 exactly with no gaps before it will emit.

## The Monsters app — bestiary and fight tracker (2026-10-07)

`src/data/monsters_gen.js` holds the **whole core bestiary, 239 monsters** (printed pp. 195–265). Every number is Shadowdark core, read off the page — nothing in that file is homebrew. The left panel browses and filters; the main panel is the fight tracker with the open statblock beneath it.

### Extracting it — the pages fight back, so don't redo this from scratch
The generator is a scratchpad script (like the map pipeline) because it needs Python, PyMuPDF and the 74 MB core PDF, which is gitignored. Three things had to be solved, each of which failed silently first:
- **The pages are two-column.** `pdftotext -layout` interleaves the columns onto the same lines and shreds every statblock. The fix is to take text blocks *with coordinates*, split them at the page centre, sort each column top-to-bottom, and read left column then right.
- **The legendary creatures get a full-page spread** whose statline is one wide block. Column-splitting those pages detached the statline from its heading and lost Mordanticus, Obe-Ixx, Rathgamnon and The Wandering Merchant. A page carrying wide blocks is now read straight down instead.
- **The folio number must be stripped by POSITION, not by "looks like a number".** Dropping every bare-number line also ate the orphaned `LV` digit where a statline wraps so the level lands on its own line — which is why Plesiosaurus and Megalodon came out with no level at all.

A monster is an ALL-CAPS line whose following text contains a parsable statline; anything else is prose. **Grouping is deliberately NOT taken from the book's section headings** — telling a heading (ANGELS) from a monster whose statline merely failed to parse is guesswork, and getting it wrong silently filed 23 monsters under a category called "Bear, Brown". Each monster instead carries `fam`, read off its own name ("Angel, Domini" → "Angel", since the book names variants FAMILY, VARIANT), and `band`, the level band from the compilation's §23 guidance (weak 0–3, risky 4–6, dangerous 7–9, mighty 10+).

### The book's own formatting is preserved, not normalised
The statline genuinely varies and the parser tolerates it rather than assuming it away: the book **drops a comma** here and there ("MV near (climb) S +4", "HP 4 ATK 1 bite"); elementals print **lesser/greater pairs** ("HP 29/42", "LV 6/9"); and the **Hydra is "HP \*" / "LV \*"** because you choose how many heads it has. So `hpRaw`/`lvRaw` appear whenever the book prints something that isn't a plain number, `hp`/`lv` hold the lesser value, and **anything reading `lv` must cope with null** — the Hydra's is null and its band is "variable". The UI shows the raw string, so it never claims a number the book didn't print.

### The tracker
`src/logic/fight.js` is pure functions over one piece of state, saved with everything else. Initiative is core §2 (d20 + DEX, highest first): monsters roll their own DEX from the statblock, **PCs roll a bare d20 because the Party app doesn't track DEX** — every initiative is editable, which you want anyway for surprise and held actions. HP starts from the book's listed value, which core §23 explicitly permits instead of rolling, and **stays editable** because of the Hydra and because a monster mutated off the Make It Weird table won't match its printed line. Adding N of something numbers them ("Goblin 1…4"). At 0 HP a monster is dead and a PC is dying, per core §4; HP clamps at zero because nothing in Shadowdark reads below it, and the loader clamps on the way in so a fight saved before that fix stops showing "−5/20".

### Running a monster, not just listing it (2026-10-07)
The first version tracked HP and nothing else, so you couldn't actually *run* a monster. Each row now expands (▸) to its **attacks as buttons, its traits and spells, and its stats**. The statblock is looked back up from `MONSTERS` by name rather than copied onto the combatant, so a saved fight stays small and a monster can't drift from the book.
**`parseAttacks` splits the printed attack line**, because the book gives it as one string: `2 tentacle (near) +5 (1d8 + curse) or 1 tail +5 (3d6)`. The separator is kept and matters — **"or" means choose one, "and" means it does both this turn**. A segment with no attack bonus (`1 fire breath`, `1 darkness`, `2d4 eyestalk ray`) is not an attack roll at all; it's a named action whose rules live in a trait, so it's flagged `action` and the UI says so instead of inventing a roll. The parser is checked against all 239 monsters: 351 segments, zero unnamed, **zero damage dice lost**. `attackCount` rolls the count itself, since it can be a die.
Rolling follows core §4: nat 20 crits and **doubles the damage dice but not the flat bonus**, nat 1 always misses. A 4-attack dragon rolls four separate lines. The result deliberately **does not decide hit or miss** for the middle cases — it shows each total and leaves the AC comparison to you, which is how it actually runs at the table.
**Spell-name parsing was wrong and is now fixed.** A trait name can carry a casting parenthetical — `Flight (INT Spell).` — and the old split didn't allow it, so a spell's name stayed glued to the *end of the previous trait* and its text was attributed to the wrong ability. That was worst precisely on spellcasters: the Lich's Flight, Null, Shadow Leap, Sigil of Doom and Wither were all mislabelled. Re-extracted; specials went 190 → 202 monsters.

### Two UI traps hit building this
- **`ConfirmBtn` is a render-prop component** — `{ onConfirm, render }`, not children. Passing children crashes the whole app with "render is not a function", and because it renders in `main` the entire page goes blank rather than failing locally.
- **A local `const` silently shadows an import of the same name.** App.jsx already had `rollAttack(target, attack)` for NPC sheets, so the imported monster `rollAttack(a)` was handed the wrong arguments and died on `a.bonus` of undefined. Vite renames the loser to `rollAttack2` in stack traces — that suffix is the tell. The fight imports are aliased (`rollMonsterAttack`, `initOrder`, `dropFighter`) for exactly this reason.
- **Don't mix a CSS shorthand with its longhand in an inline style that changes** — `border` plus `borderTop: "none"` on a row whose colour changes on select makes React warn on every rerender. Use explicit sides.

### The 50 book locations ARE buildings now (2026-09-21)
They used to be bare points floating over the art. Each of the 50 is now attached to the footprint it actually is, so tapping one opens the ordinary building panel — generated address, exterior, interior, door — with the book's name as the heading and an **IN THE BOOK** tag, its kind tags, referee note and who's-here above the generated detail. PARTY HERE and SCAN are preserved.
**Finding the bug that made this impossible is the part worth remembering.** Every pin measured ~40px *outside* the nearest footprint, with suspicious uniformity. Cause: `build_asset.py` painted a **white disc of radius 41 over every badge before the footprints were traced**. That erased the outline of whatever building the badge sat on, so up to 50 buildings — at exactly the 50 places the book cares about — were damaged or dropped outright, and no footprint could ever contain a pin. Re-tracing with **badges left as ink** fixed both: a badge is a solid disc drawn *on* its building, so it merges into that building's blob, the footprint comes out whole, and the pin lands inside it. Recovered 26 buildings (889 → 915). Only the 9 district name plates are painted out now. The shipped PNG is untouched and still badge-free — painting pixels white never moved anything, so the art and the coordinates still share one space.
**Attachment is by containment only, and must stay that way.** 43 of 50 pins land inside a footprint, which is proof of which building the book means. The other 7 are left unattached rather than guessed: #4 Gedgarrin is a seven-tower college precinct, #13 The Duke's Bridge is a bridge, #28 Tree Grove is a grove, #21 Montmar Castle is a walled precinct, #18 The Grand Gate is a gate, #11 River Rats is a wharf, and #50 Rump Roast's badge sits in clear paper. Attaching by proximity instead (≤45px) put **Montmar Castle and The Grand Gate onto innocent little neighbours** — don't reintroduce it. Those 7 still open their book entry from the pin; they just have no generated interior, because there is no single building to generate one for.

### Shops and stock (2026-09-21)
`src/data/shops.js` decides what a building sells; `src/data/items_gen.js` is the catalogue, generated by `scripts/build-items.mjs` (`npm run items`) from the markdown in `Refrence/`. **196 of 915 buildings trade** — roughly one in five, plus every book location whose entry says it deals in something. Shops are outlined amber on the map and counted in the zoom readout.
**The canon line runs straight through this feature, so keep it visible.** Shop *types* are canon: §34's lists by district tier, reproduced verbatim. Tavern food and drink are canon: §33's tables, with the book's own effects ("Dwarvish gold ale, 5 sp, regain 1d4 HP per mug"). Core gear, weapons, armour and mounts are canon. But the **Equipment Emporium is not** — its own header says it is adapted from Basic Fantasy RPG with hand-tuned prices — so every item carries `k` (1 = core, 0 = emporium), every emporium price renders with an asterisk, and the shelf footer names where the numbers came from. The trade → item-category mapping is *our reading* of the emporium's own §21, marked NOT IN REFS.
Stock is a function of the building's id and the day, so a shelf **holds still while the party is in the shop and rerolls on NEXT DAY**, with nothing saved and nothing to go stale. The same local-RNG discipline as the rest of the map: looking in a shop never disturbs the dice stream an NPC is being generated from.
### Buying, and stock that runs down (2026-09-22)
Shelves now **fill once a week, not once a day**, and what the party buys is gone until the next restock — so a scarce item stays scarce and hunting one across districts is real play. This is the roadmap's "stock that runs down… restock on Sunday", minus weekly budgets.
**The ledger design is the part to preserve.** Stock is still *derived*, never stored. The only thing saved is `market = { period, sold: { bldgId: { item: qty } }, purseCp }` — what the party has actually bought. A shop nobody has visited costs zero bytes, which matters because the roster already uses ~3 MB of the 5 MB limit. The restock period is **derived from the day** (`Math.floor((day-1)/7)`) rather than stored, so there is no restock step anyone can forget; a ledger carrying an older period is simply ignored.
**That stale-period check lives in `shops.js`, next to the period logic, and must stay there.** It started life in `App.jsx`, which worked — and was one forgetful caller away from a sold-out item staying sold out for ever. `soldAt(b, day, market)` returns null for a stale ledger, and `stockOf` takes the whole `market` object rather than a pre-filtered map so no caller can get it wrong. There's a regression-style check for exactly this: apply a week-0 ledger on day 8 and nothing may read as sold out.
**Taverns don't deplete.** A kitchen and a cellar aren't a shelf, so those lines carry `unlimited` and buying one is paying for a round. They still reroll weekly.
**The party purse** is shared coin in the Party app, held in copper and rendered in gp/sp/cp. Buying takes from it and writes the purchase to the day log (kind `buy`, amber). An item the party can't afford **stays visible but goes quiet** with "Not enough coin in the purse" — knowing a thing is here and out of reach is the useful information, so don't hide it.

### Finding a shop, and getting to it (2026-09-22)
**The shops directory** is the second tab of the Locations app: filter by district and by trade, search by sign, and every row shows the address and how many lines are still in stock. Before this, 196 shops were only findable by zooming the map in and spotting an amber outline — no use when a player asks where the nearest blacksmith is.
**Picking a row flies the map to that building** at 4×, centred, where doors are live. Two things about `focusKey` in `CityMap.jsx`: it is a **key that changes**, not a watch on `selBldg`, because watching the selection would re-centre whatever you just clicked and yank it out from under the cursor; and `box.w` is in its deps with a `flewTo` ref guard, because the map **isn't mounted while another app is open** — it arrives with `focusKey` already set and its frame still unmeasured, so the effect has to retry after the ResizeObserver reports, but only fly once.

**Three traps already hit here.** (1) Tier tags must be **accepted as a set, not matched exactly** — the emporium uses `[H]` sparingly for luxuries, so a High Harbor blacksmith filtered to `[H]` alone found *literally nothing to sell*; districts now accept their tier and below (`hig` → MUH, `sil` → PM) and the **per-trade price band** does the wealth gating instead. (2) A building with stock on its shelves cannot also be "abandoned" with nobody in it — the jeweller read `Abandoned · Nobody` directly above seven priced lines — so `interiorOf(b, { trading })` forces working premises and at least one head. The flag is passed *in* because deciding what a building sells needs the shop tables, and those import `citymap.js`. (3) Rolling a trade from the district list made **Zameek's Curios a master blacksmith** and the city's best fence a tannery; `LOC_TRADE` now pins the handful of book places whose entry states their trade, which is reading the book rather than inventing.

### Two latent bugs found while wiring the above (2026-09-21)
- **A CSS class silently beat the polygon's own `fill=`/`stroke=` attributes.** `.mos-b { fill: transparent }` outranks a presentation attribute, which means the selected-building highlight in `CityMap.jsx` **had never once rendered** — selection was invisible and nobody had noticed. Fixed by moving the states into `.mos-on` / `.mos-s` classes, ordered before `.mos-b:hover` so hover still outranks them. If a shape refuses to take a colour, check for a class rule before anything else.
- **`copyText(text, done)` requires its callback** — calling it with one argument writes to the clipboard and *then* throws `done is not a function` inside the promise, so the copy appears to work while the console fills with errors and no failure is ever reported. Always go through `doCopy`. Its blocked-message is caller-supplied now, because a clipboard write fails whenever the window isn't focused and "open the text box on the sheet" is meaningless advice in a shop.
- **`coin(0)` returned "1 cp".** A `Math.max(1, …)` meant to stop a fence's sub-copper cut rounding to nothing also caught zero, so an empty purse read as holding a penny.
- **`bldgId` collided for 3 pairs of buildings.** It was district + rounded centroid, and a building sitting inside or around another can share a centre — so two different buildings on the map handed back the same address, interior and stock. Area is now part of the id. All 915 are distinct; verify with a duplicate count after any geometry change, because this fails silently.

**⚠ The street names and house numbers are PLACEHOLDERS and are labelled as such in the UI.** The address scheme is still his open decision (below). The street list is invented. The only rules-bearing numbers are the lock DCs, which use core's ladder (Easy 9 / Normal 12 / Hard 15 / Extreme 18).
Zoom is wheel or the +/−/⤢ buttons (1×–14×), pan is drag; buildings go live past 1.8× (lowered from 2.2× once footprints became whole structures rather than single rooms, which are ~3× the linear size). Geography lives inside the zoom transform; **markers and labels live in a plain HTML layer outside it**, positioned from computed screen coordinates, so they stay a constant size and stay crisp. Zoom and pan are deliberately **one piece of state** — zooming has to move the pan in the same update to keep the point under the cursor still, and splitting them meant calling one setter inside the other's updater, which StrictMode double-invokes. The city is nearly square (1.131), so the frame is **sized to fit the space it's given** rather than being allowed to hang off a scrolling page.

**How to render PDF pages here:** `pdftoppm` is not installed, so the Read tool can't rasterise a PDF. `pdftotext.exe` ships with Git (`C:\Program Files\Git\mingw64\bin\`). Installed via `py -m pip install`: **PyMuPDF** (page/image extraction — use `doc.extract_image()` for embedded bitmaps, not page rendering), **numpy, scipy, pillow, opencv-python-headless** (the detection and tracing above). Regenerating the map data is `scripts/` work done from a scratchpad, not committed — the generated output is `src/data/citymap_gen.js`.
Superseded: the earlier standalone map demo (a throwaway Claude Artifact) had the geography invented from book *text*. It's dead.

## Known issues and to-dos
- Fixed a latent bug: the wizard's talent table called `chance()` and `pick()` but neither was imported in `shadowdark.js` — would have thrown if a wizard ever rolled a talent in the 3–7 range. Now imported.
- ✅ Checked against the core PDF (2026-09-17): `WIZARD_KNOWN` was exactly right. The wizard/fighter/priest/thief talent tables were all missing half of their level-12 row ("choose a talent, **or** +2 stat points" — only the second half was coded) — fixed on all four. Backgrounds: verified all 20, added the one missing ("Barbarian"); the labor/trade/crime/martial/arcane/clergy/noble grouping is our own invention for filtering, not the book's (the book's table is a flat, uncategorized d20 roll).
- The core reaction table makes about 43% of strangers Hostile at CHA +0. He chose canon; revisit this in the Social phase if it plays badly.
- Four rumours are "Undecided". He sets their truth once and it applies citywide.

## Roadmap (build one system at a time)
0. ✅ Shell rework (done in v11–v13).
1. **The spine.** 🟡 **First slice built (2026-09-17)** — see "The spine and the Map app" below. Done: shared world state (`src/logic/world.js`, saved under `world` in the same storage key), six watches, tap-to-advance, switch-off, undo, a day log, and the watch driving day/night for generation. **Still to do: the approval queue (accept/edit/reject) and the "what changed since last session" screen.** The calendar is a day count plus his own optional date text, deliberately not a made-up month list.
2. **Geography and map.** 🟡 **Mostly built (2026-09-18).**
   - ✅ **The map is built and in the app** as its own taskbar app — the real CS6 spread, measured. See above.
   - ✅ **Buildings are clickable** — 889 whole structures, zoom in past 1.8× and tap a door.
   - District → 5 neighbourhoods → building. **Neighbourhoods not built** — but district → building now works directly, so neighbourhoods are an optional middle layer rather than a prerequisite. Danger and wealth per neighbourhood still unbuilt.
   - A street-address scheme players can work out (**still undecided — placeholder addresses are live in the UI and labelled as provisional**).
   - Drag the party along streets, with link/unlink so members can split. **Not built** — the spine records a single party position (`world.partyAt`), set from the map's PARTY HERE and written to the day log.
   - There's no movement cost; time advances manually.
   - The Gutterwash–Rilken Row toll bridge costs 5 sp. **Visible on the map art; no toll mechanic yet.**
3. **Party.** Bench/swap players; a colour per player that retints the UI; a neutral DM slot; per-player profiles; heat per faction and per player.
4. **Buildings.**
   - A tap card: address, sign, owner, description, who's inside.
   - A run screen: occupants over time, factions spawning only in their own territory, floors with map upload, exits with lock DCs, door HP and windows, a sound/smell line, an encounter table by category, and closed/burnt/guarded states.
5. **Shops and economy.** 🟡 **Stock is built (2026-09-21); pricing dynamics are not.**
   - ✅ The full core gear list plus the emporium, in tiers by district wealth. See below.
   - ✅ **196 buildings trade**, with a named sign, a shelf you can buy from, and taverns on the book's own §33 food and drink tables. Searchable directory in the Locations app.
   - ✅ **Stock runs down and restocks weekly**, paid for out of a shared party purse, with each purchase written to the day log. **Weekly merchant budgets are still unbuilt** — a shop's shelf refills regardless of what it earned.
   - **Daily price fluctuation** driven by supply, demand, events, weather and factions.
   - Quoted price shown beside the real price. Adjustments come from merchant honesty, renown, clothing, CHA and faction standing, **capped at 25%**. Only a DC 20 CHA check makes a merchant sell at a loss.
   - A 0.1–4% chance of an unusual item each week.
   - **No magic items in shops.**
   - Rebase bounty maths on the core price of plate.
6. **NPC quality.** Bias tags (e.g. "dislikes orcs": −5 to that player's reaction); NPCs remember the party; a corruption price ladder (a price for each dirtier act, rising steeply — **undesigned**); names by origin and trade.
7. **Social model.** Wants, pressures, problems and DCs; per-NPC fight and flight triggers; disposition rolled when the talk button is pressed.
8. **Encounters and daily events.**
   - 1-in-6 on entering a neighbourhood. Pools shift with district, time, heat and weather; use the books' urban and terrain tables.
   - Separate fight, social and complication pools. Many encounters don't involve the party at all.
   - One map-tied event per day, visible in advance, with approve/edit/reroll/skip.
   - Storms and heatwaves have real mechanical effects.
   - Proposed, **needs his OK**: pre-roll the event and resolve its location when the party arrives.
9. **Carousing and downtime.** All the book's activities with venue modifiers; results become permanent entities (contacts, enemies, debts); each costs one watch.
10. **Rumours and threads.** Track which rumours the party has heard; thread clocks; bounty and rumour boards.
11. **Magic items and insanity.** Items must be surrendered to the City Watch; using them carries a growing insanity risk, like Cyberpunk's cyberpsychos. **Design conversation first.**
12. **Beyond the city.** Overland travel with the core hex rules, Stonehell, the wider Reaches.

## Open decisions (ask him; don't guess)
1. ✅ **Settled 2026-09-17:** the watches are Dawn · Morning · Midday · Afternoon · Dusk · Night.
2. **The street-address scheme — now the most valuable thing he can decide.** Buildings are clickable and every one shows an address, but the street names and numbering are **invented placeholders**, flagged as provisional in the UI. Once he picks a scheme, addresses become real and can be locked per building. Options worth putting to him: numbered streets per district; named streets with odd/even sides; "district + block + door"; or no numbers at all, just sign names.
3. Pre-rolled encounters with location resolved on arrival — yes or no?
4. Which other processes, besides weather and prices, should run without asking?
5. The magic-item insanity system (not designed yet).
6. The corruption price ladder (not designed yet).

## How to work
- **One system per task.** Small, tested steps. Run the app and check your change before saying it's done.
- **Commit after every working step,** with a clear message. He syncs two computers: tell him to **pull before, push after**.
- Keep the generator's coherence: rerun the regression scripts after changing any generator data or logic.
- Keep saved data compatible. If a data shape changes, write a migration; never orphan his saves.
- End each session by updating this file.
