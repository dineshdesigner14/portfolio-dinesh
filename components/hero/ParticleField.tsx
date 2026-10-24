"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useWind } from "./WindProvider";
import { pointer } from "./pointerStore";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  ph: number;
  sp: number;
  c: string;
}

const COLORS = ["255,255,255", "255,227,168", "191,231,255", "220,206,255"];

/**
 * Ambient light particles on a single canvas (cheap: one draw loop, no DOM nodes).
 * They drift upward, twinkle, get nudged by wind gusts and pushed away by the cursor.
 */
export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const { gustX } = useWind();
  const windRef = useRef(0);

  useEffect(() => {
    windRef.current = gustX;
  }, [gustX]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let particles: Particle[] = [];

    const seed = () => {
      const count = w < 700 ? 28 : 58;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(0.04 + Math.random() * 0.16),
        r: 0.8 + Math.random() * 1.8,
        a: 0.35 + Math.random() * 0.55,
        ph: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 1.4,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = (time: number, step: boolean) => {
      ctx.clearRect(0, 0, w, h);

      let px = -9999;
      let py = -9999;
      if (pointer.active) {
        const r = canvas.getBoundingClientRect();
        px = pointer.x - r.left;
        py = pointer.y - r.top;
      }

      for (const p of particles) {
        if (step) {
          p.x += p.vx + windRef.current * 0.03;
          p.y += p.vy;

          const dx = p.x - px;
          const dy = p.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 120) * 1.8;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }

          if (p.y < -6) p.y = h + 6;
          if (p.x < -6) p.x = w + 6;
          else if (p.x > w + 6) p.x = -6;
        }

        const twinkle = 0.55 + 0.45 * Math.sin(time * 0.001 * p.sp + p.ph);
        const a = p.a * twinkle;

        ctx.fillStyle = `rgba(${p.c},${a * 0.18})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${p.c},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0, false);
    };

    const loop = (t: number) => {
      if (visible) draw(t, true);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);

    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}
