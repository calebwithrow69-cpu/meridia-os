import { C, MONO } from "../lib/theme.js";
import { fmt, clamp } from "../lib/rng.js";
import { SD_ARMOR, SD_ANCESTRY, alLabel } from "../data/shadowdark.js";
import { sdMods, gearSlotsUsed, walletText, hpState, rollDamage } from "../logic/sheet.js";

export const INK = C.text, RULE = C.lineHot, SERIF = MONO;

export const PAPER = "#071014";

export function SBox({ label, children, tag, style, right, tone: tn = C.cyan }) {
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

export const inkIn = (w) => ({ width: w || "100%", background: "#0A1114", color: C.text, border: `1px solid ${C.green}`, fontFamily: MONO, fontSize: 12, padding: "2px 4px", outline: "none", borderRadius: 0 });

export const glow = (c, px = 8) => `0 0 ${px}px ${c}88`;

export function CharSheet({ n, editing, onEdit, onList, onRoll }) {
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


