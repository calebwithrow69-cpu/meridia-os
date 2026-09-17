# Meridia OS

A referee's console for the Shadowdark campaign in the City of Masks (Meridia).

## How to start it

1. Install [Node.js](https://nodejs.org) if you don't already have it (v18 or newer).
2. Open a terminal in this folder.
3. First time only, install the dependencies:

   ```
   npm install
   ```

4. Start it:

   ```
   npm run dev
   ```

5. It prints a link — usually `http://localhost:5173`. Open that in your browser.

Leave the terminal window open while you're using the app; closing it stops the app. Press `Ctrl+C` in the terminal to stop it on purpose.

## Your data

Everything you generate and save lives in your browser's local storage on this computer, under the key `meridia-os:v7`. It does **not** sync between your desktop and laptop yet — until it does, use Config → Your data → Backup before switching machines, and Restore on the other one.

## Project layout

```
src/
  App.jsx           the shell: taskbar, apps, the main NPC-file component
  lib/               small self-contained helpers
    theme.js         the colour palette
    rng.js           dice rolling and randomness
    audio.js         the interface sound effects
    storage.js       saves to your browser's storage
  data/              the tables — mostly what you'd edit to change content
    npc.js           city, factions, names, rumours, shops, all the flavour tables
    shadowdark.js    core rules: classes, gear, weapons, armour, spells
  logic/             the rules that turn tables into an NPC
    generator.js     generateNPC() and everything it calls
    sheet.js         buildSheet() — fills in the Shadowdark character sheet
  ui/                reusable interface pieces
    primitives.jsx   buttons, panels, toggles, search box
    CharSheet.jsx     the character sheet component
```

This came from a single 4,650-line file (`meridia-os-v13.jsx`, kept in this folder for reference) built in claude.ai. Splitting it up didn't change how anything looks or works — it's the same app, just in real files instead of one.
