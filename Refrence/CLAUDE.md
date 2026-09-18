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

### Buildings (2026-09-18)
`BUILDINGS` in `citymap_gen.js` is **842 real footprints** — the white regions fully enclosed by ink, i.e. the buildings as the cartographer actually drew them, filtered to convex/solid/plausible shapes so canals and river slivers drop out. Each is tagged with the district of its **nearest numbered location**, which reproduces the printed dashed boundaries closely; that assignment also drives the district highlight, so the wash is correct *by construction* rather than hand-traced (hand-traced polygons were what made the first attempt inaccurate). A handful of trees and moored boats survive the filter as "buildings" — cosmetic, not worth more filtering.
Identity is `bldgId()`, derived from the footprint's own position rather than its array index, so regenerating the geometry doesn't rename every building in the city.
Tapping one gives an **address, an exterior read-aloud, and ENTER BUILDING** → state, floors, cellar, who's in, what you hear, what it smells of, ways in, and the door. Then SCAN generates exactly that many people, labelled with the address. All of it is derived from the building's id through a **local seeded RNG**, so a building reads the same every time and looking at one never disturbs the dice stream an NPC is being generated from. Nothing is stored, so nothing can go stale.
**⚠ The street names and house numbers are PLACEHOLDERS and are labelled as such in the UI.** The address scheme is still his open decision (below). The street list is invented. The only rules-bearing numbers are the lock DCs, which use core's ladder (Easy 9 / Normal 12 / Hard 15 / Extreme 18).
Zoom is wheel or the +/−/⤢ buttons (1×–14×), pan is drag; buildings go live past 2.2×. Geography lives inside the zoom transform; **markers and labels live in a plain HTML layer outside it**, positioned from computed screen coordinates, so they stay a constant size and stay crisp. Zoom and pan are deliberately **one piece of state** — zooming has to move the pan in the same update to keep the point under the cursor still, and splitting them meant calling one setter inside the other's updater, which StrictMode double-invokes. The city is nearly square (1.131), so the frame is **sized to fit the space it's given** rather than being allowed to hang off a scrolling page.

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
   - ✅ **Buildings are clickable** — 842 real footprints, zoom in past 2.2× and tap a door.
   - District → 5 neighbourhoods → building. **Neighbourhoods not built** — but district → building now works directly, so neighbourhoods are an optional middle layer rather than a prerequisite. Danger and wealth per neighbourhood still unbuilt.
   - A street-address scheme players can work out (**still undecided — placeholder addresses are live in the UI and labelled as provisional**).
   - Drag the party along streets, with link/unlink so members can split. **Not built** — the spine records a single party position (`world.partyAt`), set from the map's PARTY HERE and written to the day log.
   - There's no movement cost; time advances manually.
   - The Gutterwash–Rilken Row toll bridge costs 5 sp. **Visible on the map art; no toll mechanic yet.**
3. **Party.** Bench/swap players; a colour per player that retints the UI; a neutral DM slot; per-player profiles; heat per faction and per player.
4. **Buildings.**
   - A tap card: address, sign, owner, description, who's inside.
   - A run screen: occupants over time, factions spawning only in their own territory, floors with map upload, exits with lock DCs, door HP and windows, a sound/smell line, an encounter table by category, and closed/burnt/guarded states.
5. **Shops and economy.**
   - The full core gear list plus the emporium, in four tiers by district wealth.
   - Stock that runs down, weekly budgets, and restock on Sunday.
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
