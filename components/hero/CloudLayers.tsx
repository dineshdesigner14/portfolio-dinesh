"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useWind } from "./WindProvider";
import { pointerNX, pointerNY } from "./pointerStore";
import styles from "./hero.module.css";

/** [x%, y%, size%] of each puff, relative to its cloud box. */
type Puff = [number, number, number];

const SHAPES: Puff[][] = [
  [[16, 66, 28], [34, 48, 36], [58, 42, 42], [80, 56, 32], [50, 68, 46]],
  [[14, 62, 26], [30, 50, 30], [48, 40, 38], [68, 48, 34], [86, 64, 26], [52, 70, 44]],
  [[20, 64, 30], [42, 44, 38], [66, 50, 36], [84, 66, 28], [48, 72, 48]],
];

export interface CloudCfg {
  left: number;
  top: number;
  w: number;
  shape: number;
  o: number;
  dur: number;
  delay: number;
}

interface LayerCfg {
  id: "far" | "mid" | "front";
  /** 0..1 — how strongly the layer reacts to wind + pointer (front = strongest). */
  depth: number;
  drift: string;
  tint: string;
  clouds: CloudCfg[];
}

const LAYERS: LayerCfg[] = [
  {
    id: "far",
    depth: 0.25,
    drift: styles.driftFar,
    tint: "220,206,255",
    clouds: [
      { left: -6, top: 4, w: 24, shape: 0, o: 0.75, dur: 16, delay: 0 },
      { left: 22, top: 10, w: 20, shape: 2, o: 0.6, dur: 19, delay: -4 },
      { left: 46, top: 2, w: 26, shape: 1, o: 0.7, dur: 22, delay: -9 },
      { left: 70, top: 12, w: 22, shape: 0, o: 0.65, dur: 17, delay: -2 },
      { left: 90, top: 5, w: 20, shape: 2, o: 0.6, dur: 21, delay: -7 },
    ],
  },
  {
    id: "mid",
    depth: 0.55,
    drift: styles.driftMid,
    tint: "255,214,165",
    clouds: [
      { left: -8, top: 30, w: 30, shape: 1, o: 0.8, dur: 14, delay: -3 },
      { left: 30, top: 46, w: 28, shape: 0, o: 0.7, dur: 18, delay: -8 },
      { left: 60, top: 34, w: 32, shape: 2, o: 0.78, dur: 15, delay: -5 },
      { left: 86, top: 48, w: 26, shape: 1, o: 0.72, dur: 20, delay: -1 },
    ],
  },
  {
    id: "front",
    depth: 1,
    drift: styles.driftFront,
    tint: "199,182,255",
    clouds: [
      { left: -10, top: 84, w: 42, shape: 0, o: 1, dur: 13, delay: -6 },
      { left: 26, top: 90, w: 46, shape: 2, o: 1, dur: 16, delay: -2 },
      { left: 58, top: 85, w: 44, shape: 1, o: 1, dur: 12, delay: -9 },
      { left: 88, top: 91, w: 40, shape: 0, o: 1, dur: 15, delay: -4 },
    ],
  },
];

export function Cloud({ cfg, tint }: { cfg: CloudCfg; tint: string }) {
  const vars = {
    "--dur": `${cfg.dur}s`,
    "--delay": `${cfg.delay}s`,
  } as CSSProperties;

  return (
    <div
      className={styles.breathe}
      style={{
        position: "absolute",
        left: `${cfg.left}%`,
        top: `${cfg.top}%`,
        width: `${cfg.w}%`,
        aspectRatio: "2.2 / 1",
        opacity: cfg.o,
        ...vars,
      }}
    >
      {SHAPES[cfg.shape].map(([x, y, r], i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${x - r / 2}%`,
            top: `${y}%`,
            width: `${r}%`,
            aspectRatio: "1 / 1",
            transform: "translateY(-50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle at 42% 34%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 34%, rgba(255,255,255,0) 70%), radial-gradient(circle at 50% 100%, rgba(${tint},0.55) 0%, rgba(${tint},0) 62%)`,
          }}
        />
      ))}
    </div>
  );
}

function Layer({ cfg }: { cfg: LayerCfg }) {
  const reduced = useReducedMotion();
  const { gustX } = useWind();

  // Wind gusts push each layer by a depth-scaled amount.
  const wind = useMotionValue(0);
  useEffect(() => {
    wind.set(reduced ? 0 : gustX * cfg.depth * 2.4);
  }, [gustX, reduced, cfg.depth, wind]);

  // Pointer parallax (opposite direction, deeper layers move more).
  const targetX = useTransform(
    () => (reduced ? 0 : pointerNX.get() * -cfg.depth * 40) + wind.get()
  );
  const targetY = useTransform(() => (reduced ? 0 : pointerNY.get() * -cfg.depth * 16));
  const x = useSpring(targetX, { stiffness: 30, damping: 20, mass: 1.2 });
  const y = useSpring(targetY, { stiffness: 30, damping: 20 });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute top-0 -left-[10%] h-full w-[120%]"
      style={{ x, y, willChange: "transform" }}
    >
      <div className={`absolute inset-0 ${cfg.drift}`}>
        {cfg.clouds.map((c, i) => (
          <Cloud key={i} cfg={c} tint={cfg.tint} />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * "back"  → far + mid clouds (behind balloons)
 * "front" → foreground clouds (in front of balloons, bottom of hero)
 */
export default function CloudLayers({ layer }: { layer: "back" | "front" }) {
  const layers = LAYERS.filter((l) => (layer === "front" ? l.id === "front" : l.id !== "front"));
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${
        layer === "front" ? "z-[25]" : "z-[1]"
      }`}
    >
      {layers.map((l) => (
        <Layer key={l.id} cfg={l} />
      ))}
    </div>
  );
}
