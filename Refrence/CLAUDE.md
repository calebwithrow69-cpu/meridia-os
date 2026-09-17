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
8. `Cursed Scroll 2 - Red Sands V2-2.pdf`, `Cursed Scroll 3 - Midnight Sun V3-5.pdf` — Desert Rider, Pit Fighter, Ras-Godai, Sea Wolf, Seer classes and setting material. Not yet wired into the generator.
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

## Known issues and to-dos
- Fixed a latent bug: the wizard's talent table called `chance()` and `pick()` but neither was imported in `shadowdark.js` — would have thrown if a wizard ever rolled a talent in the 3–7 range. Now imported.
- **Check against the core PDF:** the wizard spells-known table, the wizard talent table, and the 20 backgrounds (all written from memory).
- Cursed Scroll 2 and 3's classes (Desert Rider, Pit Fighter, Ras-Godai, Sea Wolf, Seer) aren't wired into the generator yet — flag if he wants them added.
- **Sound is harsh.** Rebuild it: filtered, layered, stereo, cyberpunk, no audio files; quiet interface sounds, distinct combat sounds; separate interface/combat toggles; a "test sounds" row.
- The core reaction table makes about 43% of strangers Hostile at CHA +0. He chose canon; revisit this in the Social phase if it plays badly.
- Saving should move to **seed + edits** instead of full NPC objects (~5 KB each now).
- Four rumours are "Undecided". He sets their truth once and it applies citywide.

## Roadmap (build one system at a time)
0. ✅ Shell rework (done in v11–v13).
1. **The spine.** Shared world state; a real calendar; six watches (he named early morning, mid morning, midday?, afternoon, evening, night — **confirm the sixth**); time only advances when he taps, and the whole time system can be switched off. Also: an approval queue (accept/edit/reject), undo, a day log, and a "what changed since last session" screen.
2. **Geography and map.**
   - District → 5 neighbourhoods → building. Neighbourhoods have danger and wealth levels.
   - A street-address scheme players can work out (**undecided**).
   - A vector map drawn from the CS6 spread. Tapping a building opens it; it doesn't move the party.
   - Drag the party along streets, with link/unlink so members can split.
   - There's no movement cost; time advances manually.
   - The Gutterwash–Rilken Row toll bridge costs 5 sp.
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
1. The sixth watch.
2. The street-address scheme.
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
