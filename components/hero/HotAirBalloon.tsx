"use client";

import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useWind } from "./WindProvider";

interface HotAirBalloonProps {
  techName: string;
  techDesc: string;
  iconSrc: string;
  balloonSrc: string;
  baseX: number; // base position in px or %, your layout call
  baseY: number;
  floatRange?: number; // vertical idle float amplitude
  floatDuration?: number; // seconds, vary per balloon so they never sync
  reducedMotion?: boolean;
}

export function HotAirBalloon({
  techName,
  techDesc,
  iconSrc,
  balloonSrc,
  baseX,
  baseY,
  floatRange = 14,
  floatDuration = 6,
  reducedMotion = false,
}: HotAirBalloonProps) {
  const { gustX, gustY } = useWind();
  const [hovered, setHovered] = useState(false);

  // Base idle float — a motion value we drive with a repeating animate on mount
  const idleY = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    let frame: number;
    const start = performance.now() + Math.random() * 2000; // random phase offset
    function loop(now: number) {
      const t = (now - start) / 1000;
      idleY.set(Math.sin((t / floatDuration) * Math.PI * 2) * floatRange);
      frame = requestAnimationFrame(loop);
    }
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [floatDuration, floatRange, idleY, reducedMotion]);

  // Balloon spring: reacts to idle float + wind gust + hover lift
  const balloonTargetY = useTransform(
    idleY,
    (v) => v + gustY + (hovered ? -14 : 0)
  );
  const balloonY = useSpring(balloonTargetY, { stiffness: 40, damping: 12 });
  const balloonX = useSpring(gustX, { stiffness: 40, damping: 12 });

  // Basket spring chained off balloon's spring — creates natural lag
  const basketY = useSpring(balloonY, { stiffness: 22, damping: 9 });
  const basketX = useSpring(balloonX, { stiffness: 22, damping: 9 });

  // Rope curvature reacts to the delta between balloon and basket
  const ropeDelta = useTransform(
    [balloonX, basketX],
    ([bx, kx]: number[]) => (bx as number) - (kx as number)
  );

  return (
    <motion.div
      className="absolute cursor-pointer select-none"
      style={{ left: baseX, top: baseY, x: balloonX, y: balloonY }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Soft glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl bg-white/40 -z-10"
        animate={{ opacity: hovered ? 0.5 : 0, scale: hovered ? 1.3 : 0.8 }}
        transition={{ duration: 0.4 }}
      />

      {/* Balloon envelope */}
      <Image src={balloonSrc} alt={techName} width={90} height={110} priority />

      {/* Rope (SVG, curves based on delta) */}
      <RopeSVG deltaMotionValue={ropeDelta} />

      {/* Basket, lagging behind via chained spring */}
      <motion.div
        className="flex justify-center"
        style={{ x: basketX, y: basketY }}
      >
        <GlassLabel
          icon={iconSrc}
          name={techName}
          desc={techDesc}
          expanded={hovered}
        />
      </motion.div>
    </motion.div>
  );
}

function RopeSVG({ deltaMotionValue }: { deltaMotionValue: any }) {
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const unsub = deltaMotionValue.on("change", (v: number) => setDelta(v));
    return () => unsub();
  }, [deltaMotionValue]);

  const controlX = 15 + delta * 2;

  return (
    <svg width="30" height="40" className="mx-auto -mt-1 overflow-visible">
      <path
        d={`M 15 0 Q ${controlX} 20 15 40`}
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function GlassLabel({
  icon,
  name,
  desc,
  expanded,
}: {
  icon: string;
  name: string;
  desc: string;
  expanded: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-full bg-white/60 backdrop-blur-md px-3 py-1.5 shadow-md"
      animate={{
        paddingLeft: expanded ? 16 : 12,
        paddingRight: expanded ? 16 : 12,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Image src={icon} alt={name} width={20} height={20} />
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-slate-800">{name}</span>
        <motion.span
          className="text-[10px] text-slate-500 overflow-hidden"
          animate={{
            height: expanded ? "auto" : 0,
            opacity: expanded ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
        >
          {desc}
        </motion.span>
      </div>
    </motion.div>
  );
}