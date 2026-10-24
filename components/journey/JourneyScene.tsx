"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { JOURNEY_STAGES } from "@/lib/journey";
import { Cloud } from "../hero/CloudLayers";
import type { CloudCfg } from "../hero/CloudLayers";
import heroStyles from "../hero/hero.module.css";
import MountainArt from "./MountainArt";
import StagePanel from "./StagePanel";
import { STAGE_ICONS, STAGE_TILES } from "./stageIcons";
import { NODES, PATH_D, WORLD_H, WORLD_W, arcAt } from "./path";

const N = JOURNEY_STAGES.length;

type NodeState = "passed" | "active" | "upcoming";

/* ------------------------------------------------------------------ */
/* backdrop                                                            */
/* ------------------------------------------------------------------ */

/** Sky that evolves from dawn (base of the mountain) to bright day (summit). */
function Sky({ p }: { p: MotionValue<number> }) {
  const dawn = useTransform(p, [0, 0.7], [1, 0]);
  const sun = useTransform(p, [0, 1], [0.45, 1]);
  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,#9fd8ff 0%,#bfe7ff 38%,#e6f4ff 72%,#fff8f2 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: dawn,
          background: "linear-gradient(180deg,#c7b6ff 0%,#dcceff 34%,#ffd6a5 78%,#ffe3a8 100%)",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: sun,
          background:
            "radial-gradient(circle at 18% 12%, rgba(255,250,225,0.95) 0%, rgba(255,227,168,0.45) 14%, transparent 42%)",
        }}
      />
    </div>
  );
}

/** Distant ranges; they sink slowly as you climb (parallax). */
function FarRange({ y }: { y: MotionValue<number> }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMax slice"
      className="absolute bottom-0 left-0 h-[70%] w-full"
      style={{ y }}
    >
      <path
        d="M0 700 L0 420 L180 300 L320 380 L520 200 L700 360 L860 260 L1040 400 L1240 240 L1420 380 L1600 300 L1600 700 Z"
        fill="rgba(199,182,255,0.45)"
      />
      <path
        d="M0 700 L0 520 L240 430 L420 500 L640 380 L860 500 L1100 420 L1320 520 L1600 450 L1600 700 Z"
        fill="rgba(159,216,255,0.5)"
      />
    </motion.svg>
  );
}

const BEHIND: CloudCfg[] = [
  { left: -18, top: 6, w: 46, shape: 1, o: 0.85, dur: 15, delay: -2 },
  { left: 62, top: 14, w: 44, shape: 0, o: 0.8, dur: 17, delay: -6 },
  { left: -14, top: 30, w: 48, shape: 2, o: 0.85, dur: 13, delay: -4 },
  { left: 66, top: 44, w: 46, shape: 1, o: 0.85, dur: 16, delay: -8 },
  { left: -16, top: 58, w: 50, shape: 0, o: 0.9, dur: 14, delay: -1 },
  { left: 64, top: 70, w: 48, shape: 2, o: 0.9, dur: 18, delay: -5 },
  { left: -12, top: 84, w: 46, shape: 1, o: 0.9, dur: 12, delay: -7 },
];

const FRONT: CloudCfg[] = [
  { left: 4, top: 97, w: 52, shape: 0, o: 1, dur: 13, delay: -3 },
  { left: 50, top: 98, w: 54, shape: 2, o: 1, dur: 16, delay: -9 },
];

function CloudSet({ clouds, tint, z }: { clouds: CloudCfg[]; tint: string; z: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${z}`}>
      <div className={`absolute inset-0 ${heroStyles.driftMid}`}>
        {clouds.map((c, i) => (
          <Cloud key={i} cfg={c} tint={tint} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* checkpoint                                                          */
/* ------------------------------------------------------------------ */

const NODE_BG: Record<NodeState, string> = {
  passed: "linear-gradient(135deg,#7fe8cf,#2fb5a0)",
  active: "linear-gradient(135deg,#4fa3ff,#5a84ff)",
  upcoming: "linear-gradient(135deg,#f1ecff,#c7b6ff)",
};

function StageNode({
  index,
  state,
  onGo,
}: {
  index: number;
  state: NodeState;
  onGo: (i: number) => void;
}) {
  const stage = JOURNEY_STAGES[index];
  const Icon = STAGE_ICONS[stage.icon];
  const [c1, c2] = STAGE_TILES[index % STAGE_TILES.length];
  const pos = NODES[index];
  const active = state === "active";

  return (
    <div
      className="absolute z-10"
      style={{ left: `${(pos.x / WORLD_W) * 100}%`, top: `${(pos.y / WORLD_H) * 100}%` }}
    >
      <button
        type="button"
        onClick={() => onGo(index)}
        aria-label={`Stage ${index + 1}: ${stage.title}. ${stage.tagline}`}
        aria-current={active ? "step" : undefined}
        className="group relative block h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none"
      >
        {active && (
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#4fa3ff]/45" />
        )}
        <span
          className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white text-[13px] font-bold shadow-[0_10px_24px_rgba(90,132,255,0.35)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-[#2b67d1]/50"
          style={{ background: NODE_BG[state], color: state === "upcoming" ? "#2b3a67" : "#fff" }}
        >
          {state === "passed" ? (
            <Check size={19} strokeWidth={3} aria-hidden />
          ) : (
            String(index + 1).padStart(2, "0")
          )}
        </span>

        {/* label sits on the outer (left) side so it never covers the trail or the panel */}
        <span className="pointer-events-none absolute right-full top-1/2 mr-4 flex -translate-y-1/2 items-center gap-2.5 whitespace-nowrap rounded-2xl border border-white/80 bg-white/75 py-2 pl-2.5 pr-4 text-left shadow-[0_8px_20px_rgba(90,132,255,0.14)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/95 group-focus-visible:bg-white/95">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            <Icon size={16} aria-hidden />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-[#14304f]">{stage.title}</span>
            <span
              className={`overflow-hidden text-[11px] text-[#4a6280] transition-all duration-300 group-hover:max-h-6 group-hover:opacity-100 group-focus-visible:max-h-6 group-focus-visible:opacity-100 ${
                active ? "max-h-6 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {stage.tagline}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* progress ring                                                       */
/* ------------------------------------------------------------------ */

function ProgressCard({ count }: { count: number }) {
  const R = 26;
  const C = 2 * Math.PI * R;
  return (
    <div className="glass pointer-events-auto absolute bottom-6 left-6 z-30 flex items-center gap-4 rounded-2xl px-4 py-3">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden>
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(79,163,255,0.2)" strokeWidth="6" />
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="#4fa3ff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - count / N)}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
          <span className="text-lg font-extrabold text-text">{count}</span>
          <span className="text-[9px] text-text-secondary">/ {N}</span>
        </span>
      </div>
      <div className="leading-tight">
        <p className="text-[13px] font-semibold text-text">Journey progress</p>
        <p className="text-[11px] text-text-secondary">checkpoints reached</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* scene                                                               */
/* ------------------------------------------------------------------ */

export default function JourneyScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rangeRef = useRef(0);
  const lenRef = useRef(0);

  const [reached, setReached] = useState(0);
  const [maxReached, setMaxReached] = useState(0);

  // raw scroll progress through the pinned section, smoothed for the camera
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.6 });

  // camera: the world slides down as you climb, so the summit comes into view
  const camY = useMotionValue(0);
  const farY = useTransform(p, [0, 1], [0, 360]);
  const hintOpacity = useTransform(p, [0, 0.05], [1, 0]);
  const walked = useTransform(p, (v) => arcAt(v));

  const updateCamera = useCallback(
    (v: number) => camY.set(-rangeRef.current * (1 - v)),
    [camY]
  );

  useLayoutEffect(() => {
    const measure = () => {
      const world = worldRef.current;
      const sticky = stickyRef.current;
      if (!world || !sticky) return;
      rangeRef.current = Math.max(0, world.offsetHeight - sticky.clientHeight);
      updateCamera(p.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (worldRef.current) ro.observe(worldRef.current);
    if (stickyRef.current) ro.observe(stickyRef.current);
    return () => ro.disconnect();
  }, [p, updateCamera]);

  // climber marker rides the trail
  const cx = useMotionValue(NODES[0].x);
  const cy = useMotionValue(NODES[0].y);
  const placeClimber = useCallback(
    (v: number) => {
      const el = pathRef.current;
      if (!el) return;
      if (!lenRef.current) lenRef.current = el.getTotalLength();
      const pt = el.getPointAtLength(lenRef.current * arcAt(v));
      cx.set(pt.x);
      cy.set(pt.y);
    },
    [cx, cy]
  );

  useEffect(() => {
    placeClimber(p.get());
  }, [p, placeClimber]);

  useMotionValueEvent(p, "change", (v) => {
    updateCamera(v);
    placeClimber(v);
    const idx = Math.round(Math.min(Math.max(v, 0), 1) * (N - 1));
    setReached((r) => (r === idx ? r : idx));
  });

  useEffect(() => {
    setMaxReached((m) => Math.max(m, reached));
  }, [reached]);

  // clicking / pressing a checkpoint scrolls the page so the camera glides to it
  const goTo = useCallback((i: number) => {
    const sec = sectionRef.current;
    if (!sec) return;
    const clamped = Math.max(0, Math.min(N - 1, i));
    const top = sec.getBoundingClientRect().top + window.scrollY;
    const scrollable = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (scrollable * clamped) / (N - 1), behavior: "smooth" });
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(reached + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(reached - 1);
    }
  };

  const stateOf = (i: number): NodeState =>
    i < reached ? "passed" : i === reached ? "active" : "upcoming";

  return (
    <div ref={sectionRef} aria-label="Engineering Journey" className="relative" style={{ height: "340vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
        onKeyDown={onKeyDown}
      >
        <Sky p={p} />
        <FarRange y={farY} />

        {/* the mountain world — moves as one piece */}
        <motion.div
          ref={worldRef}
          className="absolute inset-x-0 top-0 mx-auto"
          style={{ width: "min(100%, 1100px)", aspectRatio: "1 / 2", y: camY, willChange: "transform" }}
        >
          <MountainArt />
          <CloudSet clouds={BEHIND} tint="220,206,255" z="z-[1]" />

          {/* trail */}
          <svg
            aria-hidden
            viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
            className="absolute inset-0 z-[2] h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="trail-walked" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#4fa3ff" />
                <stop offset="1" stopColor="#ffc98c" />
              </linearGradient>
            </defs>
            <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="30" strokeLinecap="round" />
            <path d={PATH_D} fill="none" stroke="#d9cdf5" strokeWidth="20" strokeLinecap="round" />
            <path
              d={PATH_D}
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="2 12"
              opacity="0.9"
            />
            <path ref={pathRef} d={PATH_D} fill="none" stroke="none" />
            <motion.path
              d={PATH_D}
              fill="none"
              stroke="url(#trail-walked)"
              strokeWidth="10"
              strokeLinecap="round"
              style={{ pathLength: walked }}
            />

            {/* summit flag */}
            <g aria-hidden>
              <path d={`M ${NODES[N - 1].x} ${NODES[N - 1].y - 28} L ${NODES[N - 1].x} ${NODES[N - 1].y - 92}`} stroke="#14304f" strokeWidth="3" strokeLinecap="round" />
              <path
                d={`M ${NODES[N - 1].x} ${NODES[N - 1].y - 92} L ${NODES[N - 1].x + 40} ${NODES[N - 1].y - 78} L ${NODES[N - 1].x} ${NODES[N - 1].y - 64} Z`}
                fill="#ff9f68"
              />
            </g>

            {/* climber */}
            <motion.circle cx={cx} cy={cy} r={20} fill="rgba(255,201,140,0.35)" />
            <motion.circle cx={cx} cy={cy} r={10} fill="#ffc98c" stroke="#14304f" strokeWidth="3" />
          </svg>

          {NODES.map((_, i) => (
            <StageNode key={JOURNEY_STAGES[i].id} index={i} state={stateOf(i)} onGo={goTo} />
          ))}

          <CloudSet clouds={FRONT} tint="255,214,165" z="z-[5]" />
        </motion.div>

        {/* soft seams into the sections above and below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28"
          style={{ background: "linear-gradient(180deg,#fff8f2 0%,rgba(255,248,242,0) 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28"
          style={{ background: "linear-gradient(0deg,#fff8f2 0%,rgba(255,248,242,0) 100%)" }}
        />

        {/* intro */}
        <div className="pointer-events-none absolute left-6 top-24 z-30 w-[272px]">
          <span className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2b67d1] shadow-[0_4px_16px_rgba(79,163,255,0.12)] backdrop-blur-md">
            My journey
          </span>
          <h2 className="mt-4 text-[clamp(2rem,3.4vw,2.9rem)] font-extrabold leading-[1.05] tracking-tight text-text">
            Engineering
            <br />
            Ascent
          </h2>
          <div className="mt-3 h-1 w-12 rounded-full bg-[#4fa3ff]" />
          <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">
            Every step, every challenge, every late-night debugging session brought me closer to
            building solutions that scale. This is the path that shaped me.
          </p>
          <p className="glass mt-5 rounded-2xl p-4 text-[12.5px] leading-snug text-[#14304f]">
            The summit is not the end — it&apos;s the beginning of the next climb.
          </p>
        </div>

        <StagePanel index={reached} onGo={goTo} />
        <ProgressCard count={maxReached + 1} />

        <motion.div
          aria-hidden
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-[#3b5b85]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Scroll to climb</span>
          <ChevronDown size={20} className={heroStyles.scrollBounce} />
        </motion.div>
      </div>
    </div>
  );
}
