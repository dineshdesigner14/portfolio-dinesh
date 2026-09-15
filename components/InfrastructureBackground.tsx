"use client";

import { useEffect, useRef } from "react";

/**
 * Two-layer animated infrastructure background:
 * - Base layer: dark grid + faint nodes, always visible
 * - Reveal layer: brighter animated nodes/connections/packets,
 *   masked by a soft radial gradient that follows the cursor (rAF-smoothed).
 */
export default function InfrastructureBackground() {
  const revealRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;

    function handleMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    }

    function tick() {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.08;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.08;
      if (revealRef.current) {
        revealRef.current.style.setProperty("--mx", `${pos.current.x}px`);
        revealRef.current.style.setProperty("--my", `${pos.current.y}px`);
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* base layer: faint static grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* gradient mesh */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -right-40 -bottom-40 h-[460px] w-[460px] rounded-full bg-[#7c3aed]/20 blur-[120px]" />

      {/* reveal layer: brighter nodes + connections, masked to cursor */}
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), black 0%, transparent 75%)",
        }}
      >
        <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 14 }).map((_, i) => {
            const x1 = (i * 137) % 100;
            const y1 = (i * 71) % 100;
            const x2 = ((i + 3) * 97) % 100;
            const y2 = ((i + 5) * 53) % 100;
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#3b82f6"
                strokeOpacity={0.5}
                strokeWidth={1}
              />
            );
          })}
          {Array.from({ length: 18 }).map((_, i) => {
            const cx = (i * 53) % 100;
            const cy = (i * 89) % 100;
            return (
              <circle
                key={i}
                cx={`${cx}%`}
                cy={`${cy}%`}
                r={3}
                fill="#60a5fa"
                opacity={0.8}
              >
                <animate
                  attributeName="opacity"
                  values="0.3;0.9;0.3"
                  dur={`${3 + (i % 4)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="noise-overlay" />
    </div>
  );
}
