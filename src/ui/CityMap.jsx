import { C, MONO } from "../lib/theme.js";
import { MAP_W, MAP_H, CITY_BOX, MAP_PINS, MAP_DISTRICTS, polyPoints } from "../data/citymap.js";
import { DISTRICTS, LOCATIONS } from "../data/npc.js";

/* The city as the book draws it, lit like a HUD.

   `public/meridia-map.png` is the Cursed Scroll 6 spread converted to white-on-transparent line
   art. It's used as a CSS mask over a flat colour, so the printed streets, canals, bridges and
   numbered badges render as glowing neon instead of black ink — accurate to the book, but it
   reads as a screen rather than a page. Everything interactive is an SVG layer on top, in the
   same 1000 x 709 coordinate space, so a pin lands exactly on the book's own badge. */

const TIER_TONE = { Wealthy: C.gold, Working: C.cyan, Poor: C.blood };
export const tierTone = (code) => TIER_TONE[(DISTRICTS[code] || {}).cls] || C.cyan;

export function CityMap({ selDistrict, selLoc, partyAt, onDistrict, onLoc, night }) {
  const art = night ? C.violet : C.cyan;
  // crop to the city, leaving the coordinate space alone: the inner layer is scaled up and offset
  // so that CITY_BOX fills the frame, and both the art and the SVG ride along together.
  const inner = {
    position: "absolute",
    width: `${(MAP_W / CITY_BOX.w) * 100}%`,
    height: `${(MAP_H / CITY_BOX.h) * 100}%`,
    left: `${(-CITY_BOX.x / CITY_BOX.w) * 100}%`,
    top: `${(-CITY_BOX.y / CITY_BOX.h) * 100}%`,
  };
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: `${CITY_BOX.w} / ${CITY_BOX.h}`, background: "#04070A", border: `1px solid ${C.line}`, overflow: "hidden" }}>
      <style>{`
        .mos-dist { cursor: pointer; transition: fill 0.15s, stroke 0.15s; }
        .mos-dist:hover { fill: var(--dt); stroke: var(--dh); stroke-width: 1.5; }
        .mos-pin circle.ring { transition: r 0.12s, opacity 0.12s, stroke-width 0.12s; }
        .mos-pin:hover circle.ring { opacity: 1; r: 14; stroke-width: 2; }
        @keyframes mosPing { 0% { r: 14; opacity: 0.9; } 100% { r: 26; opacity: 0; } }
      `}</style>
      {/* faint tech grid under the city */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, opacity: 0.45,
        backgroundImage: `linear-gradient(${C.line}66 1px, transparent 1px), linear-gradient(90deg, ${C.line}66 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
      }} />
      {/* bloom pass, then the crisp line pass — both are the same masked art */}
      {[{ blur: 9, o: 0.7 }, { blur: 3, o: 0.5 }, { blur: 0, o: 1 }].map((L, i) => (
        <div key={i} aria-hidden="true" style={{
          ...inner, backgroundColor: art, opacity: L.o,
          WebkitMaskImage: "url(/meridia-map.png)", maskImage: "url(/meridia-map.png)",
          WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
          filter: L.blur ? `blur(${L.blur}px)` : "none",
        }} />
      ))}
      {/* scanlines */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.55, mixBlendMode: "overlay",
        backgroundImage: `repeating-linear-gradient(to bottom, ${art}26 0px, ${art}26 1px, transparent 1px, transparent 3px)`,
      }} />

      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ ...inner }}>
        {Object.keys(MAP_DISTRICTS).map((code) => {
          const on = selDistrict === code, tone = tierTone(code);
          return (
            <polygon key={code} className="mos-dist" points={polyPoints(MAP_DISTRICTS[code])}
              onClick={() => onDistrict(code)}
              style={{ "--dt": `${tone}1c`, "--dh": `${tone}99` }}
              fill={on ? `${tone}26` : "transparent"}
              stroke={on ? tone : "transparent"} strokeWidth={on ? 2 : 0} strokeDasharray="6 4" />
          );
        })}

        {LOCATIONS.map((l) => {
          const p = MAP_PINS[l.n];
          if (!p) return null;
          const on = selLoc === l.n, here = partyAt === l.n, tone = tierTone(l.d);
          return (
            <g key={l.n} className="mos-pin" onClick={(e) => { e.stopPropagation(); onLoc(l.n); }} style={{ cursor: "pointer" }}>
              <circle cx={p[0]} cy={p[1]} r="14" fill="transparent" />
              <circle className="ring" cx={p[0]} cy={p[1]} r={on ? 14 : 11} fill="none"
                stroke={on ? "#fff" : tone} strokeWidth={on ? 2 : 1} opacity={on ? 1 : 0.5} />
              {on && <>
                <circle cx={p[0]} cy={p[1]} r="20" fill="none" stroke={tone} strokeWidth="1" opacity="0.8" />
                <circle cx={p[0]} cy={p[1]} fill="none" stroke={tone} strokeWidth="1.5"
                  style={{ animation: "mosPing 1.6s ease-out infinite" }} />
              </>}
              {here && <>
                <circle cx={p[0]} cy={p[1] - 26} r="5" fill={C.green} />
                <path d={`M${p[0]} ${p[1] - 14} l-5 -8 h10 z`} fill={C.green} />
              </>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function MapLegend({ night }) {
  const rows = [["Wealthy", C.gold], ["Working", C.cyan], ["Poor", C.blood]];
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2" style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
      {rows.map(([lb, col]) => (
        <span key={lb} className="flex items-center gap-1">
          <i style={{ width: 8, height: 8, background: col, display: "inline-block" }} />{lb}
        </span>
      ))}
      <span className="flex items-center gap-1"><i style={{ width: 8, height: 8, background: C.green, display: "inline-block" }} />Party</span>
      <span style={{ color: night ? C.violet : C.dim }}>{night ? "Night wash" : "Day wash"}</span>
      <span style={{ marginLeft: "auto", color: C.dim }}>Cursed Scroll 6 spread, pp. 2–3</span>
    </div>
  );
}
