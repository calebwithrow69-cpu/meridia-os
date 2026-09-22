import { useState, useEffect } from "react";
import { C, MONO } from "../lib/theme.js";

export const inputStyle = { background: "#0A1114", color: C.text, border: `1px solid ${C.lineHot}`, fontSize: 13, padding: 8, outline: "none", borderRadius: 0 };

export function Bracket({ children, pad = "p-3", tone: tn = C.line }) {
  return (
    <div className="relative" style={{ border: `1px solid ${tn}`, background: C.panel }}>
      {[["Top", "Left"], ["Top", "Right"], ["Bottom", "Left"], ["Bottom", "Right"]].map(([v, h]) => (
        <span key={v + h} className="absolute block" style={{ [v.toLowerCase()]: -1, [h.toLowerCase()]: -1, width: 8, height: 8, [`border${v}`]: `2px solid ${C.cyan}`, [`border${h}`]: `2px solid ${C.cyan}` }} />
      ))}
      <div className={pad}>{children}</div>
    </div>
  );
}


/* What's on the shelf, and buying from it.

   Prices from Shadowdark core are shown plain; prices from the adapted Equipment Emporium are
   marked, because that file is homebrew and its numbers must never read as if they came out of
   the rulebook. A line the party cannot afford stays visible but goes quiet rather than
   vanishing — knowing a thing is here and out of reach is the useful information. */
export function ShopShelf({ shop, day, purse = 0, daysLeft, coin, onBuy, onCopy }) {
  const houses = shop.stock.filter((i) => !i.canon).length;
  return (
    <div className="mt-2" style={{ border: `1px solid ${C.amber}55`, background: `${C.amber}08` }}>
      <div className="flex items-baseline justify-between px-2 pt-1 gap-2">
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.amber, letterSpacing: "0.1em" }}>
          {shop.tavern ? "ON THE BOARD" : "FOR SALE"}
        </span>
        <span className="flex-1" />
        <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>PURSE {coin ? coin(purse) : purse}</span>
        {onCopy && (
          <button onClick={onCopy} title="Copy this shop as text"
            style={{ background: "none", border: `1px solid ${C.line}`, color: C.dim, fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", padding: "1px 5px", cursor: "pointer", borderRadius: 0 }}>COPY</button>
        )}
      </div>
      <div className="px-2 pb-1">
        {shop.stock.map((it, i) => {
          const broke = it.cp > purse;
          const dead = it.out || broke;
          return (
            <div key={i} className="flex gap-2 items-baseline" style={{ borderBottom: `1px solid ${C.line}44`, padding: "2px 0", opacity: it.out ? 0.45 : 1 }}>
              <span style={{ fontFamily: MONO, fontSize: 10, color: it.out ? C.blood : C.dim, minWidth: 22 }}>
                {it.unlimited ? "" : it.out ? "—" : `${it.qty}×`}
              </span>
              <span style={{ fontSize: 12, color: C.text, flex: 1 }}>
                {it.n}
                {it.worn && <span style={{ color: C.dim, fontSize: 10 }}> · second-hand</span>}
                {it.note && <span style={{ color: C.dim, fontSize: 10 }}> · {it.note}</span>}
              </span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: it.out ? C.dim : it.canon ? C.text : C.gold, whiteSpace: "nowrap" }}>
                {it.out ? "sold out" : `${it.price}${it.canon ? "" : "*"}`}
              </span>
              {onBuy && (
                <button onClick={() => !dead && onBuy(it)} disabled={dead}
                  title={it.out ? "None left until the next restock" : broke ? "Not enough coin in the purse" : `Buy for ${it.price}`}
                  style={{
                    background: "none", border: `1px solid ${dead ? C.line : C.green}`,
                    color: dead ? C.line : C.green, fontFamily: MONO, fontSize: 9,
                    letterSpacing: "0.08em", padding: "1px 5px", borderRadius: 0,
                    cursor: dead ? "default" : "pointer", minWidth: 34,
                  }}>BUY</button>
              )}
            </div>
          );
        })}
        <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, paddingTop: 3, lineHeight: 1.5 }}>
          {shop.tavern
            ? "Food and drink from the book's own tavern tables. The kitchen doesn't run out."
            : <>
              {houses
                ? `${houses === shop.stock.length ? "All" : `${houses} of these`} marked * are house prices from the adapted Equipment Emporium, not Shadowdark core.`
                : "Core Shadowdark prices."}
              {" "}{shop.cleared ? "Cleared out. " : ""}
              {daysLeft === 1 ? "Restocks tomorrow." : `Restocks in ${daysLeft} days.`}
            </>}
        </div>
        <div style={{ fontSize: 11, color: C.dim, paddingTop: 4, lineHeight: 1.45 }}>{shop.quirk} They {shop.wont}.</div>
      </div>
    </div>
  );
}

export function Panel({ label, tone: tn = C.cyan, children, locked, onLock, onReroll, collapsed, onCollapse }) {
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

export function ConfirmBtn({ onConfirm, render }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3000); return () => clearTimeout(t); }, [armed]);
  return render(armed, () => { if (armed) { setArmed(false); onConfirm(); } else setArmed(true); });
}


export function Seg({ label, value, options, onChange, tone: tn = C.cyan }) {
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


export function Row({ k, v, tone: tn = C.text }) {
  return (
    <div className="flex gap-3 py-1" style={{ borderBottom: `1px solid ${C.line}55` }}>
      <div style={{ color: C.dim, fontSize: 10, minWidth: 84, letterSpacing: "0.07em", fontFamily: MONO, paddingTop: 3 }}>{k}</div>
      <div style={{ color: tn, fontSize: 13, lineHeight: 1.45, flex: 1 }}>{v}</div>
    </div>
  );
}


export function Stat({ k, v, tone: tn = C.text }) {
  return (
    <div className="text-center px-1 py-2" style={{ border: `1px solid ${C.line}`, minWidth: 0 }}>
      <div style={{ color: C.dim, fontSize: 9, letterSpacing: "0.1em", fontFamily: MONO }}>{k}</div>
      <div style={{ color: tn, fontSize: 16, fontWeight: 600, fontFamily: MONO }}>{v}</div>
    </div>
  );
}


export function Select({ label, value, onChange, options }) {
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


export function Group({ title, children }) {
  return <div className="mb-3"><div style={{ color: C.gold, fontSize: 10, letterSpacing: "0.16em", fontFamily: MONO, marginBottom: 6 }}>{title}</div>{children}</div>;
}


export function Toggle({ on, label, onClick }) {
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


export function Btn({ children, onClick, tone: tn = C.lineHot, color = C.dim, fill, flex = true }) {
  return (
    <button onClick={onClick} className={`${flex ? "flex-1 " : ""}py-2 px-3`}
      style={{ border: `1px solid ${tn}`, color: fill ? "#06090B" : color, background: fill || "transparent", fontSize: 11, fontFamily: MONO, letterSpacing: "0.1em", borderRadius: 0, cursor: "pointer" }}>
      {children}
    </button>
  );
}


export function Glyph({ kind, color, size = 22 }) {
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
      {kind === "compass" && <><circle cx="12" cy="12" r="9.5" {...p} /><path d="M15.5 8.5l-2 5-5 2 2-5z" {...p} /></>}
    </svg>
  );
}


export function Search({ value, onChange, placeholder }) {
  return (
    <div className="flex gap-1 mb-3">
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ ...inputStyle, flex: 1 }} />
      {value && <button onClick={() => onChange("")} className="px-2" style={{ border: `1px solid ${C.lineHot}`, background: "transparent", color: C.dim, cursor: "pointer", borderRadius: 0 }}>✕</button>}
    </div>
  );
}

export const hit = (q, ...fields) => { const t = q.trim().toLowerCase(); return !t || fields.some((f) => String(f || "").toLowerCase().includes(t)); };


