"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useWind } from "./WindProvider";
import { pointer } from "./pointerStore";

export interface BalloonTech {
  id: string;
  name: string;
  desc: string;
  /** section the balloon scrolls to when clicked */
  href: string;
  Icon: LucideIcon;
  /** envelope gradient: light → mid → deep */
  colors: [string, string, string];
  basket: string;
}

interface HotAirBalloonProps {
  tech: BalloonTech;
  /** centre position, % of the hero */
  x: number;
  y: number;
  scale?: number;
  /** vertical idle float amplitude (px) */
  floatRange?: number;
  /** seconds per float cycle — vary per balloon so they never sync */
  floatDuration?: number;
  reducedMotion?: boolean;
}

const BASE_W = 78;
const BASE_H = 94;
const ROPE_H = 26;

const ENVELOPE_PATH =
  "M50 2 C20 2 3 28 7 56 C10 78 30 94 41 110 L59 110 C70 94 90 78 93 56 C97 28 80 2 50 2 Z";

function Envelope({
  tech,
  w,
  h,
}: {
  tech: BalloonTech;
  w: number;
  h: number;
}) {
  const [c1, c2, c3] = tech.colors;
  const Icon = tech.Icon;
  const id = tech.id;

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 120"
      aria-hidden
      className="block overflow-visible"
      style={{ filter: "drop-shadow(0 14px 16px rgba(90,132,255,0.22))" }}
    >
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.55" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        <radialGradient id={`h-${id}`} cx="0.32" cy="0.26" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`c-${id}`}>
          <path d={ENVELOPE_PATH} />
        </clipPath>
      </defs>

      <path d={ENVELOPE_PATH} fill={`url(#g-${id})`} />
      <g clipPath={`url(#c-${id})`}>
        {/* light band + gore ribs */}
        <rect x="0" y="44" width="100" height="16" fill="#fff" opacity="0.26" />
        <path d="M50 0 C28 30 28 78 44 112" stroke="#fff" strokeOpacity="0.5" fill="none" />
        <path d="M50 0 C72 30 72 78 56 112" stroke="#fff" strokeOpacity="0.5" fill="none" />
        <path d="M50 0 L50 112" stroke="#fff" strokeOpacity="0.4" fill="none" />
        <ellipse cx="34" cy="30" rx="22" ry="30" fill={`url(#h-${id})`} />
      </g>
      <path d={ENVELOPE_PATH} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.4" />

      <Icon x={36} y={44} size={28} color="#fff" strokeWidth={2.2} />
    </svg>
  );
}

export function HotAirBalloon({
  tech,
  x,
  y,
  scale = 1,
  floatRange = 12,
  floatDuration = 7,
  reducedMotion = false,
}: HotAirBalloonProps) {
  const { gustX, gustY } = useWind();
  const rootRef = useRef<HTMLDivElement>(null);
  const windRef = useRef({ x: 0, y: 0 });
  const hoverRef = useRef(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    windRef.current = { x: gustX, y: gustY };
  }, [gustX, gustY]);

  // Targets are driven every frame; springs smooth them; the basket
  // follows the balloon through a second, softer spring → natural lag.
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const bx = useSpring(targetX, { stiffness: 38, damping: 11, mass: 1.1 });
  const by = useSpring(targetY, { stiffness: 38, damping: 11, mass: 1.1 });
  const kx = useSpring(bx, { stiffness: 20, damping: 8 });
  const ky = useSpring(by, { stiffness: 20, damping: 8 });
  const tilt = useTransform(bx, [-48, 48], [-7, 7]);

  // Rope redraws from the balloon↔basket offset ("rope physics").
  const rope = useTransform(() => {
    const dx = Math.max(-26, Math.min(26, bx.get() - kx.get()));
    const y0 = by.get() - ky.get();
    const mid = (y0 + ROPE_H) / 2;
    return `M ${6 + dx} ${y0} Q ${6 + dx * 0.2} ${mid} 7 ${ROPE_H} M ${18 + dx} ${y0} Q ${18 + dx * 0.2} ${mid} 17 ${ROPE_H}`;
  });

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;

    const phase = Math.random() * Math.PI * 2;
    let raf = 0;

    const loop = (now: number) => {
      const t = now / 1000;

      // gentle push away from the cursor ("breeze")
      let pushX = 0;
      let pushY = 0;
      if (pointer.active) {
        const parent = el.offsetParent;
        if (parent) {
          const pr = parent.getBoundingClientRect();
          const cx = pr.left + (pr.width * x) / 100;
          const cy = pr.top + (pr.height * y) / 100 + 60 * scale;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const R = 240;
          if (d < R) {
            const f = (1 - d / R) ** 2;
            pushX = (dx / d) * f * 34;
            pushY = (dy / d) * f * 18;
          }
        }
      }

      const idle = Math.sin((t / floatDuration) * Math.PI * 2 + phase) * floatRange;
      const sway =
        Math.sin((t / (floatDuration * 1.6)) * Math.PI * 2 + phase * 1.3) * floatRange * 0.5;

      targetX.set(sway + windRef.current.x * 2.4 + pushX);
      targetY.set(idle + windRef.current.y * 1.6 + pushY + (hoverRef.current ? -16 : 0));

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, floatDuration, floatRange, x, y, scale, targetX, targetY]);

  const open = () => {
    hoverRef.current = true;
    setExpanded(true);
  };
  const close = () => {
    hoverRef.current = false;
    setExpanded(false);
  };

  const w = BASE_W * scale;
  const h = BASE_H * scale;
  const Icon = tech.Icon;
  const target = tech.href === "#projects" ? "Projects" : "Journey";

  return (
    <div
      ref={rootRef}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: w, marginLeft: -w / 2 }}
    >
      <a
        href={tech.href}
        aria-label={`${tech.name}, ${tech.desc}. Go to ${target}`}
        onPointerEnter={open}
        onPointerLeave={close}
        onFocus={open}
        onBlur={close}
        className="group flex flex-col items-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#2B67D1] focus-visible:ring-offset-4 focus-visible:ring-offset-white/60"
      >
        {/* envelope */}
        <motion.div
          className="relative"
          style={{ x: bx, y: by, rotate: reducedMotion ? 0 : tilt, transformOrigin: "50% 100%" }}
        >
          <motion.div
            aria-hidden
            className="absolute rounded-full"
            style={{
              inset: "-18%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(159,216,255,0.35) 48%, transparent 70%)",
            }}
            animate={{ opacity: expanded ? 0.95 : 0, scale: expanded ? 1.1 : 0.8 }}
            transition={{ duration: 0.4 }}
          />
          <div className="relative">
            <Envelope tech={tech} w={w} h={h} />
          </div>
        </motion.div>

        {/* rope + basket + glass label (lag behind the envelope) */}
        <motion.div className="flex flex-col items-center" style={{ x: kx, y: ky }}>
          <svg
            width={24 * scale}
            height={ROPE_H * scale}
            viewBox={`0 0 24 ${ROPE_H}`}
            aria-hidden
            className="block overflow-visible"
          >
            <motion.path
              d={rope}
              stroke="rgba(70,90,130,0.55)"
              strokeWidth={1.1}
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          <div
            aria-hidden
            style={{
              width: 22 * scale,
              height: 15 * scale,
              background: `linear-gradient(180deg, rgba(255,255,255,0.3), rgba(0,0,0,0.14)), ${tech.basket}`,
              borderRadius: "2px 2px 7px 7px",
              boxShadow: "0 5px 9px rgba(60,80,120,0.28)",
            }}
          />

          <div className="mt-2 flex items-center gap-2 whitespace-nowrap rounded-full border border-white/80 bg-white/70 px-3 py-1.5 shadow-[0_8px_20px_rgba(90,132,255,0.12)] backdrop-blur-md transition-colors duration-300 group-hover:bg-white/90 group-focus-visible:bg-white/90">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: `linear-gradient(135deg, ${tech.colors[1]}, ${tech.colors[2]})` }}
            >
              <Icon size={14} color="#fff" strokeWidth={2.4} aria-hidden />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-[#14304F]">{tech.name}</span>
              <motion.span
                className="overflow-hidden text-[10.5px] text-[#4A6280]"
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                {tech.desc}
              </motion.span>
            </span>
          </div>
        </motion.div>
      </a>
    </div>
  );
}
