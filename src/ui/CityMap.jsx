import { useState, useRef, useEffect, useCallback } from "react";
import { C, MONO } from "../lib/theme.js";
import { MAP_W, MAP_H, MAP_PINS, BUILDINGS, BLDG_BY_DISTRICT, polyPoints, bldgId, nearestBldg } from "../data/citymap.js";
import { DISTRICTS, LOCATIONS } from "../data/npc.js";

/* The city as the book draws it, driven like a map application.

   `public/meridia-map.png` is the real Cursed Scroll 6 spread with the printed numbered badges and
   district name plates painted out, cropped to the city, and turned into white line art on
   transparency. It's used as a CSS mask over a flat colour, so the streets, canals and bridges glow
   instead of inking. The art is already cropped to the coordinate space, so every layer here is
   simply inset: 0 and the SVG viewBox is the whole image — there is no offset or scale factor
   anywhere between the art and the overlay, which is what went wrong with the previous version.

   Two kinds of layer sit on top, and the difference matters:
     - Geography (building footprints, district washes) lives in the SVG inside the zoom transform,
       so it scales and pans with the city exactly like ink on paper.
     - Markers and labels live in a plain HTML layer OUTSIDE the transform, positioned from computed
       screen coordinates, so they stay a constant size and stay crisp however far you zoom.

   Buildings only become interactive past BLDG_ZOOM. Below that you're looking at the city and
   tapping districts and known places; past it you're on a street tapping doors. */

const MINZ = 1, MAXZ = 14, BLDG_ZOOM = 2.2, LABEL_ZOOM = 2.6;

const TIER_TONE = { Wealthy: C.gold, Working: C.cyan, Poor: C.blood };
export const tierTone = (code) => TIER_TONE[(DISTRICTS[code] || {}).cls] || C.cyan;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function CityMap({ selDistrict, selBldg, selLoc, partyAt, night, onDistrict, onBldg, onLoc, onBlank }) {
  const wrapRef = useRef(null);
  const viewRef = useRef(null);
  const svgRef = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  /* Zoom and pan are one piece of state on purpose: zooming has to move the pan in the same
     update to keep the point under the cursor still, and splitting them meant setting one from
     inside the other's updater — which React's StrictMode double-invokes. */
  const [view, setView] = useState({ z: 1, x: 0, y: 0 });
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hoverB, setHoverB] = useState(null);
  const z = view.z, pan = view;

  /* The city is nearly square, so on a laptop it's the height that runs out first. Measure the
     space we've been given and size the frame to fit inside it, rather than letting a map you're
     supposed to zoom and drag hang off the bottom of a scrolling page. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const aw = el.clientWidth, ah = el.clientHeight;
      if (!aw || !ah) return;
      const k = Math.min(aw / MAP_W, ah / MAP_H);
      setBox({ w: Math.max(1, Math.floor(MAP_W * k)), h: Math.max(1, Math.floor(MAP_H * k)) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // never let the city pull away from the frame
  const fit = useCallback((x, y, zoom) => {
    const el = viewRef.current;
    if (!el) return { x, y };
    const w = el.clientWidth, h = el.clientHeight;
    return { x: clamp(x, w - w * zoom, 0), y: clamp(y, h - h * zoom, 0) };
  }, []);

  // a resize can leave the city pulled off the frame, so re-clamp when the box changes
  useEffect(() => {
    setView((v) => (v.z === 1 ? (v.x || v.y ? { z: 1, x: 0, y: 0 } : v) : { z: v.z, ...fit(v.x, v.y, v.z) }));
  }, [box.w, box.h, fit]);

  // one pure update: the map point under (cx, cy) stays under (cx, cy)
  const zoomAt = useCallback((factor, cx, cy) => {
    setView((v) => {
      const nz = clamp(v.z * factor, MINZ, MAXZ);
      if (nz === v.z) return v;
      const k = nz / v.z;
      return { z: nz, ...fit(cx - (cx - v.x) * k, cy - (cy - v.y) * k, nz) };
    });
  }, [fit]);

  // React treats wheel as passive, so preventDefault needs a native listener
  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const stepZoom = (factor) => zoomAt(factor, box.w / 2, box.h / 2);
  const reset = () => setView({ z: 1, x: 0, y: 0 });

  function onPointerDown(e) {
    if (e.button !== 0) return;
    moved.current = false;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
  }
  function onPointerMove(e) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!moved.current && Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
    if (moved.current) setView((v) => ({ z: v.z, ...fit(d.vx + dx, d.vy + dy, v.z) }));
  }
  const onPointerUp = () => { drag.current = null; };

  // map units -> container pixels, for the un-transformed marker layer
  const sx = box.w ? (box.w / MAP_W) * z : 0;
  const sy = box.h ? (box.h / MAP_H) * z : 0;
  const px = (mx) => mx * sx + pan.x;
  const py = (my) => my * sy + pan.y;

  const art = night ? C.violet : C.cyan;
  const liveB = z >= BLDG_ZOOM;
  const labels = z >= LABEL_ZOOM;
  const selId = selBldg ? bldgId(selBldg) : null;
  const dimTone = selDistrict ? tierTone(selDistrict) : null;

  // only the visible slice gets markers; at high zoom that is a handful instead of fifty
  const vis = (mx, my, pad = 60) => {
    const X = px(mx), Y = py(my);
    return X > -pad && X < box.w + pad && Y > -pad && Y < box.h + pad;
  };

  function blankClick(e) {
    if (moved.current || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const m = svgRef.current.getScreenCTM();
    if (!m) return;
    const p = pt.matrixTransform(m.inverse());
    const near = liveB ? nearestBldg(p.x, p.y, 40) : null;
    if (near) onBldg(near); else onBlank && onBlank(p.x, p.y);
  }

  return (
    <div ref={wrapRef} style={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div ref={viewRef}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        style={{
          position: "relative", width: box.w || "100%", height: box.h || undefined,
          aspectRatio: box.w ? undefined : `${MAP_W} / ${MAP_H}`,
          background: "#04070A", border: `1px solid ${C.line}`, overflow: "hidden",
          cursor: drag.current && moved.current ? "grabbing" : "grab", touchAction: "none",
        }}>
        <style>{`
          .mos-b { fill: transparent; stroke: transparent; stroke-width: 6; }
          .mos-b:hover { fill: var(--bh); stroke: #fff; stroke-width: 10; }
          @keyframes mosPing { 0% { transform: scale(1); opacity: 0.85; } 100% { transform: scale(2.6); opacity: 0; } }
        `}</style>

        {/* everything geographic rides this one transform */}
        <div style={{
          position: "absolute", inset: 0, transformOrigin: "0 0",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${z})`,
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, opacity: 0.4,
            backgroundImage: `linear-gradient(${C.line}55 1px, transparent 1px), linear-gradient(90deg, ${C.line}55 1px, transparent 1px)`,
            backgroundSize: `${100 / 16}% ${100 / 14}%`,
          }} />
          {/* bloom passes, then the crisp line pass — all the same masked art */}
          {[{ b: 10, o: 0.55 }, { b: 3, o: 0.45 }, { b: 0, o: 1 }].map((L, i) => (
            <div key={i} aria-hidden="true" style={{
              position: "absolute", inset: 0, backgroundColor: art, opacity: L.o,
              WebkitMaskImage: "url(/meridia-map.png)", maskImage: "url(/meridia-map.png)",
              WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
              filter: L.b ? `blur(${L.b / z}px)` : "none",
            }} />
          ))}

          <svg ref={svgRef} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ position: "absolute", inset: 0 }}>
            <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="transparent" onClick={blankClick} />

            {/* district wash: the district's own buildings, stroked fat enough to read as a region */}
            {selDistrict && (BLDG_BY_DISTRICT[selDistrict] || []).map((b, i) => (
              <polygon key={i} points={polyPoints(b.p)} fill={`${dimTone}33`}
                stroke={`${dimTone}2e`} strokeWidth={liveB ? 10 : 46} strokeLinejoin="round" pointerEvents="none" />
            ))}

            <g pointerEvents={liveB ? "auto" : "none"}>
              {liveB && BUILDINGS.map((b, i) => {
                const on = selId === bldgId(b);
                return (
                  <polygon key={i} className="mos-b" points={polyPoints(b.p)}
                    style={{ "--bh": `${tierTone(b.d)}66`, cursor: "pointer" }}
                    fill={on ? "#ffffffcc" : undefined} stroke={on ? "#fff" : undefined}
                    strokeWidth={on ? 10 : undefined}
                    onClick={() => { if (!moved.current) onBldg(b); }}
                    onPointerEnter={() => setHoverB(b)} onPointerLeave={() => setHoverB(null)} />
                );
              })}
            </g>
          </svg>
        </div>

        {/* markers: outside the transform, so they never grow or blur */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {LOCATIONS.map((l) => {
            const p = MAP_PINS[l.n];
            if (!p || !vis(p[0], p[1])) return null;
            const on = selLoc === l.n, here = partyAt === l.n, tone = tierTone(l.d);
            return (
              <div key={l.n} style={{ position: "absolute", left: px(p[0]), top: py(p[1]), transform: "translate(-50%, -50%)", pointerEvents: "auto" }}>
                {on && <i style={{
                  position: "absolute", left: "50%", top: "50%", width: 16, height: 16, marginLeft: -8, marginTop: -8,
                  border: `1.5px solid ${tone}`, borderRadius: "50%", animation: "mosPing 1.6s ease-out infinite",
                }} />}
                <button onClick={() => { if (!moved.current) onLoc(l.n); }} title={`${l.n}. ${l.name}`}
                  style={{
                    width: on ? 15 : 11, height: on ? 15 : 11, borderRadius: "50%", padding: 0, display: "block",
                    border: `2px solid ${on ? "#fff" : tone}`, background: here ? C.green : on ? tone : "#05080B",
                    cursor: "pointer", boxShadow: `0 0 8px ${tone}aa`,
                  }} />
                {(labels || on) && (
                  <span style={{
                    position: "absolute", left: 12, top: -7, whiteSpace: "nowrap", pointerEvents: "none",
                    fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em",
                    color: on ? "#fff" : C.text, background: "#04070Ad9",
                    border: `1px solid ${on ? tone : C.line}`, padding: "1px 4px",
                  }}>{l.n}. {l.name}</span>
                )}
                {here && <span style={{
                  position: "absolute", left: "50%", top: 12, transform: "translateX(-50%)", whiteSpace: "nowrap",
                  fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", color: C.green, pointerEvents: "none",
                }}>PARTY</span>}
              </div>
            );
          })}

          {/* the hovered door gets its address on the map, the way a map app would */}
          {liveB && hoverB && vis(hoverB.c[0], hoverB.c[1]) && (
            <span style={{
              position: "absolute", left: px(hoverB.c[0]) + 14, top: py(hoverB.c[1]) - 10,
              fontFamily: MONO, fontSize: 10, color: "#fff", background: "#04070Aee",
              border: `1px solid ${tierTone(hoverB.d)}`, padding: "2px 5px", whiteSpace: "nowrap",
            }}>{DISTRICTS[hoverB.d].name}</span>
          )}
        </div>

        {/* chrome */}
        <div style={{ position: "absolute", right: 8, top: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {[["+", () => stepZoom(1.5)], ["−", () => stepZoom(1 / 1.5)]].map(([t, fn]) => (
            <button key={t} onClick={fn} style={{
              width: 26, height: 26, border: `1px solid ${C.lineHot}`, background: "#04070Ad9", color: C.cyan,
              fontFamily: MONO, fontSize: 14, lineHeight: 1, cursor: "pointer", borderRadius: 0,
            }}>{t}</button>
          ))}
          <button onClick={reset} title="Whole city" style={{
            width: 26, height: 26, border: `1px solid ${C.lineHot}`, background: "#04070Ad9", color: z > 1 ? C.gold : C.dim,
            fontFamily: MONO, fontSize: 11, lineHeight: 1, cursor: "pointer", borderRadius: 0,
          }}>⤢</button>
        </div>
        <div style={{
          position: "absolute", left: 8, bottom: 8, fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em",
          color: C.dim, background: "#04070Ac9", border: `1px solid ${C.line}`, padding: "2px 6px",
        }}>
          {z.toFixed(1)}× · {liveB ? `${BUILDINGS.length} DOORS LIVE` : "ZOOM IN FOR DOORS"}
        </div>

        {/* scanlines last, and never in the way of a click */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5, mixBlendMode: "overlay",
          backgroundImage: `repeating-linear-gradient(to bottom, ${art}26 0px, ${art}26 1px, transparent 1px, transparent 3px)`,
        }} />
      </div>
    </div>
  );
}

export function MapLegend({ night }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-2" style={{ fontFamily: MONO, fontSize: 10, color: C.dim }}>
      {[["Wealthy", C.gold], ["Working", C.cyan], ["Poor", C.blood]].map(([lb, col]) => (
        <span key={lb} className="flex items-center gap-1">
          <i style={{ width: 8, height: 8, background: col, display: "inline-block" }} />{lb}
        </span>
      ))}
      <span className="flex items-center gap-1"><i style={{ width: 8, height: 8, background: C.green, display: "inline-block" }} />Party</span>
      <span style={{ color: night ? C.violet : C.dim }}>{night ? "Night wash" : "Day wash"}</span>
      <span>Drag to pan · wheel to zoom</span>
      <span style={{ marginLeft: "auto" }}>Cursed Scroll 6 spread, pp. 2–3</span>
    </div>
  );
}
