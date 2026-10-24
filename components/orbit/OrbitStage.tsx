"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { DWORKER_RINGS, DWORKER_SUB_MODULES } from "@/lib/data";
import {
  CAMERA_SHIFT_X,
  HUB_FR,
  NEIGHBORS,
  NODE_INDEX,
  PIPELINES,
  RING_COLORS,
  RING_FR,
  TECH_ICONS,
  badgePos,
  bloomLayout,
  cameraScale,
  nodePos,
  stageSize,
  techColor,
} from "./layout";
import styles from "./orbit.module.css";
import DetailCard from "./DetailCard";
import { FlowsCard, Intro, Legend } from "./Panels";

interface Point {
  x: number;
  y: number;
}

/** gently curved line between two node centres */
function edgePath(a: Point, b: Point, bend: number): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const off = len * 0.16 * bend;
  return `M ${a.x} ${a.y} Q ${mx - (dy / len) * off} ${my + (dx / len) * off} ${b.x} ${b.y}`;
}

function NodeChip({
  name,
  ring,
  index,
  x,
  y,
  dim,
  lit,
  focus,
  selected,
  onHover,
  onSelect,
}: {
  name: string;
  ring: number;
  index: number;
  x: number;
  y: number;
  dim: boolean;
  lit: boolean;
  focus: boolean;
  selected: boolean;
  onHover: (name: string | null) => void;
  onSelect: (name: string) => void;
}) {
  const Icon = TECH_ICONS[name];
  const color = techColor(name);
  const ringColor = RING_COLORS[ring];
  const vars = {
    "--dur": `${5.5 + ((ring * 7 + index * 3) % 5) * 0.7}s`,
    "--delay": `${-((ring * 3 + index * 5) % 7)}s`,
  } as CSSProperties;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${name}, ${DWORKER_RINGS[ring].name}`}
      onClick={() => onSelect(name)}
      onPointerEnter={() => onHover(name)}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(name)}
      onBlur={() => onHover(null)}
      className="group absolute z-[4] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-opacity duration-300"
      style={{ left: x, top: y, opacity: dim ? 0.26 : 1 }}
    >
      <span
        className={`${styles.float} flex items-center gap-1.5 whitespace-nowrap rounded-full border bg-white/75 py-[5px] pl-[5px] pr-3 text-[12.5px] font-semibold text-[#14304f] backdrop-blur-md transition-[box-shadow,background-color,scale] duration-200 hover:scale-[1.06] hover:bg-white/95 group-focus-visible:ring-2 group-focus-visible:ring-[#2b67d1] ${
          focus ? "scale-[1.08]" : ""
        }`}
        style={{
          ...vars,
          borderColor: lit ? ringColor : "rgba(255,255,255,0.9)",
          boxShadow: lit
            ? `0 0 0 3px ${ringColor}33, 0 10px 24px ${ringColor}45`
            : "0 6px 16px rgba(90,132,255,0.14)",
          backgroundColor: lit ? "rgba(255,255,255,0.95)" : undefined,
        }}
      >
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full"
          style={{ background: `${color}24`, color }}
        >
          {Icon && <Icon size={14} strokeWidth={2.3} aria-hidden />}
        </span>
        {name}
      </span>
    </button>
  );
}

/**
 * Orbit Garden: six labelled orbits of technologies around the D-Worker core.
 * Hover = light up what a node works with · click = zoom in and bloom its modules.
 */
export default function OrbitStage() {
  const [S, setS] = useState(() => stageSize(window.innerHeight));
  const [vw, setVw] = useState(() => window.innerWidth);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [ringFocus, setRingFocus] = useState<number | null>(null);
  const [pipeId, setPipeId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const onResize = () => {
      setS(stageSize(window.innerHeight));
      setVw(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const reset = () => {
    setSelected(null);
    setPipeId(null);
    setRingFocus(null);
    setHovered(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // preset flows light up one hop at a time
  useEffect(() => {
    if (!pipeId) return;
    const p = PIPELINES.find((x) => x.id === pipeId);
    if (!p) return;
    setStep(0);
    const t = setInterval(() => setStep((s) => (s < p.nodes.length - 1 ? s + 1 : s)), 750);
    return () => clearInterval(t);
  }, [pipeId]);

  const pos = useMemo(() => {
    const m: Record<string, Point> = {};
    DWORKER_RINGS.forEach((ring, ri) =>
      ring.nodes.forEach((n, i) => {
        m[n] = nodePos(ri, i, ring.nodes.length, S);
      })
    );
    return m;
  }, [S]);

  const select = (name: string) => {
    setPipeId(null);
    setRingFocus(null);
    setSelected((cur) => (cur === name ? null : name));
  };

  const runPipe = (id: string) => {
    setSelected(null);
    setRingFocus(null);
    setPipeId((cur) => (cur === id ? null : id));
  };

  const focusRing = (ring: number | null) => {
    setSelected(null);
    setPipeId(null);
    setRingFocus(ring);
  };

  // what is "lit" right now: selection/hover > running flow > ring spotlight
  const focusName = selected ?? hovered;
  const pipe = PIPELINES.find((p) => p.id === pipeId) ?? null;
  let litNodes: Set<string> | null = null;
  let litEdges: [string, string][] = [];
  if (focusName) {
    const nb = NEIGHBORS[focusName] ?? [];
    litNodes = new Set([focusName, ...nb]);
    litEdges = nb.map((n) => [focusName, n]);
  } else if (pipe) {
    const reached = pipe.nodes.slice(0, step + 1);
    litNodes = new Set(reached);
    litEdges = reached.slice(1).map((n, i) => [reached[i], n]);
  } else if (ringFocus !== null) {
    litNodes = new Set(DWORKER_RINGS[ringFocus].nodes);
  }

  const zoom = cameraScale(vw);
  const cam = selected && pos[selected]
    ? {
        x: -pos[selected].x * zoom + CAMERA_SHIFT_X,
        y: -pos[selected].y * zoom,
        scale: zoom,
      }
    : { x: 0, y: 0, scale: 1 };

  const subs = selected ? DWORKER_SUB_MODULES[selected] ?? [] : [];
  const bloom = useMemo(() => bloomLayout(subs.length), [subs.length]);
  const selRing = selected ? NODE_INDEX[selected]?.ring ?? 0 : 0;
  const hubSize = 2 * HUB_FR * S;

  return (
    <section
      aria-label="D-Worker ecosystem"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-6 pt-20"
    >
      <div className="absolute left-6 top-24 z-30 w-[280px] space-y-4">
        <Intro />
        <Legend focus={ringFocus} onFocus={focusRing} />
      </div>

      <div className="absolute right-6 top-1/2 z-30 w-[330px] -translate-y-1/2">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={`detail-${selected}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
            >
              <DetailCard name={selected} onPick={select} onClose={reset} />
            </motion.div>
          ) : (
            <motion.div
              key="flows"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25 }}
            >
              <FlowsCard pipeId={pipeId} onRun={runPipe} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* stage */}
      <div className="relative z-10 flex-none" style={{ width: S, height: S }}>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={cam}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          style={{ transformOrigin: "50% 50%" }}
        >
          {/* soft glow behind the orbits */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.22) 56%, transparent 72%)",
            }}
          />

          {/* orbits + satellites */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 overflow-visible"
            width={S}
            height={S}
            viewBox={`${-S / 2} ${-S / 2} ${S} ${S}`}
          >
            {DWORKER_RINGS.map((ring, ri) => {
              const r = RING_FR[ri] * S;
              const faded = ringFocus !== null && ringFocus !== ri;
              return (
                <g key={ring.name} style={{ opacity: faded ? 0.18 : 1, transition: "opacity 0.4s" }}>
                  <circle
                    r={r}
                    stroke={RING_COLORS[ri]}
                    strokeOpacity={0.6}
                    className={`${styles.ring} ${ri % 2 ? styles.ringRev : ""}`}
                    style={{ "--dur": `${70 + ri * 18}s` } as CSSProperties}
                  />
                  <g
                    className={styles.satellite}
                    style={
                      {
                        "--dur": `${38 + ri * 9}s`,
                        animationDirection: ri % 2 ? "reverse" : "normal",
                      } as CSSProperties
                    }
                  >
                    <circle cx={r} cy={0} r={9} fill={RING_COLORS[ri]} opacity={0.18} />
                    <circle cx={r} cy={0} r={3.6} fill={RING_COLORS[ri]} />
                  </g>
                </g>
              );
            })}
          </svg>

          {/* workflow lines: only the ones that matter right now */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-[1] overflow-visible"
            width={S}
            height={S}
            viewBox={`${-S / 2} ${-S / 2} ${S} ${S}`}
          >
            {litEdges.map(([a, b], i) => {
              if (!pos[a] || !pos[b]) return null;
              const d = edgePath(pos[a], pos[b], i % 2 ? 1 : -1);
              return (
                <g key={`${a}-${b}`} className={styles.edgeIn}>
                  <path d={d} fill="none" stroke="#4fa3ff" strokeOpacity={0.5} strokeWidth={2.2} strokeLinecap="round" />
                  <path d={d} fill="none" stroke="#ffffff" strokeOpacity={0.95} strokeWidth={2.2} strokeLinecap="round" className={styles.edgeFlow} />
                  <circle r={4} fill="#ffc98c" stroke="#fff" strokeWidth={1.5}>
                    <animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* numbered badges on each orbit (names live in the legend) */}
          {DWORKER_RINGS.map((ring, ri) => {
            const b = badgePos(ri, S);
            const faded = ringFocus !== null && ringFocus !== ri;
            return (
              <span
                key={ring.name}
                title={ring.name}
                aria-hidden
                className="absolute z-[2] flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white text-[11px] font-bold text-[#14304f] shadow-sm transition-opacity duration-300"
                style={{ left: S / 2 + b.x, top: S / 2 + b.y, borderColor: RING_COLORS[ri], opacity: faded ? 0.25 : 1 }}
              >
                {ri + 1}
              </span>
            );
          })}

          {/* core */}
          <button
            type="button"
            onClick={reset}
            aria-label="D-Worker core — reset view"
            className="absolute z-[3] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[#2b67d1]/50"
            style={{ left: S / 2, top: S / 2, width: hubSize, height: hubSize }}
          >
            <span
              aria-hidden
              className={`${styles.halo} absolute -inset-[60%] rounded-full`}
              style={{
                background:
                  "radial-gradient(circle, rgba(199,182,255,0.6) 0%, rgba(255,227,168,0.3) 40%, transparent 68%)",
              }}
            />
            <span className="relative flex h-full w-full items-center justify-center rounded-full border-[3px] border-[#c7b6ff] bg-white shadow-[0_10px_40px_rgba(124,92,224,0.35)]">
              <span className="relative block h-[70%] w-[70%]">
                <Image src="/dworker-favicon.png" alt="D-Worker" fill className="object-contain" priority />
              </span>
            </span>
          </button>

          {/* technologies */}
          {DWORKER_RINGS.map((ring, ri) =>
            ring.nodes.map((name, i) => {
              const p = pos[name];
              const isLit = !!litNodes?.has(name);
              return (
                <NodeChip
                  key={name}
                  name={name}
                  ring={ri}
                  index={i}
                  x={S / 2 + p.x}
                  y={S / 2 + p.y}
                  dim={!!litNodes && !isLit}
                  lit={isLit}
                  focus={name === focusName}
                  selected={name === selected}
                  onHover={setHovered}
                  onSelect={select}
                />
              );
            })
          )}

          {/* sub-modules bloom around the selected node */}
          <AnimatePresence>
            {selected && pos[selected] && subs.length > 0 && (
              <motion.div
                key={`bloom-${selected}`}
                aria-hidden
                className="pointer-events-none absolute z-[6]"
                style={{ left: S / 2 + pos[selected].x, top: S / 2 + pos[selected].y, width: 0, height: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="absolute left-0 top-0 overflow-visible" width={1} height={1}>
                  {bloom.map((b, i) => (
                    <line
                      key={i}
                      x1={0}
                      y1={0}
                      x2={b.x}
                      y2={b.y}
                      stroke={RING_COLORS[selRing]}
                      strokeOpacity={0.4}
                      strokeWidth={1.2}
                      strokeDasharray="2 4"
                    />
                  ))}
                </svg>
                {subs.map((s, i) => (
                  <span
                    key={s}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: bloom[i]?.x ?? 0, top: bloom[i]?.y ?? 0 }}
                  >
                    <motion.span
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.035, type: "spring", stiffness: 260, damping: 20 }}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/90 bg-white/90 py-[3px] pl-2 pr-2.5 text-[10px] font-semibold text-[#14304f] shadow-[0_4px_12px_rgba(90,132,255,0.2)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: RING_COLORS[selRing] }} />
                      {s}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
