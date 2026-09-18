/* THE SPINE — one shared world state everything else hangs off.

   Time only moves when Caleb taps. Nothing here runs on a timer, and the whole system can be
   switched off (`on: false`), in which case the rest of the app behaves exactly as it did before
   the spine existed. Advancing a watch is undoable, and every advance writes a line in the day
   log so "what happened yesterday" is answerable at the table.

   Watch names are his (confirmed 2026-09-17). The day counter is a plain running count rather
   than a calendar of named months — the reference books don't give Meridia a month list, so
   inventing one would be presenting homebrew as canon. `dateLabel` is his own free text for
   whatever calendar he decides to keep. */

export const WATCHES = [
  { id: "dawn", name: "Dawn", night: false },
  { id: "morning", name: "Morning", night: false },
  { id: "midday", name: "Midday", night: false },
  { id: "afternoon", name: "Afternoon", night: false },
  { id: "dusk", name: "Dusk", night: true },
  { id: "night", name: "Night", night: true },
];

export const WATCH_COUNT = WATCHES.length;
export const LOG_CAP = 400;
const HISTORY_CAP = 40;

export const WORLD_DEFAULT = {
  on: true,
  day: 1,
  watch: 0,
  dateLabel: "",
  partyAt: null,   // a location number from LOCATIONS, or null
  log: [],         // [{ id, day, watch, text, kind }] newest first
  history: [],     // snapshots for undo, newest first
};

export const watchOf = (world) => WATCHES[((world && world.watch) || 0) % WATCH_COUNT];

// the generator already keys some flavour off day vs night; the spine drives that when it's on
export const timeOf = (world) => (world && world.on ? (watchOf(world).night ? "night" : "day") : null);

export const watchLabel = (world) => `${watchOf(world).name.toUpperCase()}`;
export const dayLabel = (world) => (world.dateLabel ? world.dateLabel : `Day ${world.day}`);

/* Deliberately NOT including `log` — undo rewinds where you are in time, it doesn't erase what
   you wrote down. Otherwise a note typed after a watch advance would vanish with that advance. */
const snapshot = (w) => ({ day: w.day, watch: w.watch, partyAt: w.partyAt });

function withHistory(world, next) {
  return { ...next, history: [snapshot(world), ...(world.history || [])].slice(0, HISTORY_CAP) };
}

export function logLine(world, text, kind = "note") {
  const entry = { id: Math.random().toString(36).slice(2, 9), day: world.day, watch: world.watch, text, kind };
  return { ...world, log: [entry, ...(world.log || [])].slice(0, LOG_CAP) };
}

/* advance one watch; rolling past Night starts the next day */
export function advanceWatch(world, note) {
  const last = world.watch >= WATCH_COUNT - 1;
  const day = last ? world.day + 1 : world.day;
  const watch = last ? 0 : world.watch + 1;
  let next = { ...world, day, watch };
  const name = WATCHES[watch].name;
  next = logLine(next, note || (last ? `A new day begins — ${name.toLowerCase()}.` : `${name}.`), last ? "day" : "watch");
  return withHistory(world, next);
}

/* jump straight to a watch on the current day (tapping one in the list) */
export function setWatch(world, watch) {
  if (watch === world.watch) return world;
  let next = { ...world, watch };
  next = logLine(next, `Moved to ${WATCHES[watch].name.toLowerCase()}.`, "watch");
  return withHistory(world, next);
}

export function advanceDay(world) {
  let next = { ...world, day: world.day + 1, watch: 0 };
  next = logLine(next, `A new day begins — ${WATCHES[0].name.toLowerCase()}.`, "day");
  return withHistory(world, next);
}

export function setPartyAt(world, n, placeName) {
  let next = { ...world, partyAt: n };
  next = logLine(next, n == null ? "Party position cleared." : `Party moved to ${placeName}.`, "party");
  return withHistory(world, next);
}

export function undo(world) {
  const [prev, ...rest] = world.history || [];
  if (!prev) return world;
  /* Only the position in time is restored, field by field — never a blanket spread of the
     snapshot. Snapshots written by earlier versions carried a `log` too, and spreading one of
     those would wipe out notes taken since. The log is kept and gets a line of its own, because
     the table's record should include its own corrections. */
  const back = {
    ...world,
    day: prev.day != null ? prev.day : world.day,
    watch: prev.watch != null ? prev.watch : world.watch,
    partyAt: prev.partyAt !== undefined ? prev.partyAt : world.partyAt,
    history: rest,
  };
  const to = prev.day === world.day ? WATCHES[prev.watch].name.toLowerCase() : `day ${prev.day}, ${WATCHES[prev.watch].name.toLowerCase()}`;
  return logLine(back, `Stepped back to ${to}.`, "undo");
}

export const canUndo = (world) => !!(world && world.history && world.history.length);

// entries grouped newest-day-first, for the log view
export function logByDay(world) {
  const out = [];
  (world.log || []).forEach((e) => {
    const row = out.find((r) => r.day === e.day);
    if (row) row.entries.push(e);
    else out.push({ day: e.day, entries: [e] });
  });
  return out;
}
