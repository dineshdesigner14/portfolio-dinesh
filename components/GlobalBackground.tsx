"use client";

import { useEffect, useRef, useState } from "react";
import {
  Cloud,
  Container,
  Boxes,
  Terminal,
  GitBranch,
  Github,
  Workflow,
  Layers,
  Activity,
  BarChart3,
  Server,
  Database,
  Network,
  Lock,
  Cpu,
  Waypoints,
  Radar,
  ShieldCheck,
} from "lucide-react";

const ICONS = [
  Cloud, Container, Boxes, Terminal, GitBranch, Github, Workflow, Layers,
  Activity, BarChart3, Server, Database, Network, Lock, Cpu, Waypoints,
  Radar, ShieldCheck,
];

type Layer = "back" | "mid" | "front";

interface IconSpec {
  Icon: (typeof ICONS)[number];
  layer: Layer;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
  rotate: number;
  opacity: number;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.7) * 10000;
  return x - Math.floor(x);
}

function buildIcons(count: number): IconSpec[] {
  const layers: Layer[] = ["back", "mid", "front"];
  return Array.from({ length: count }).map((_, i) => {
    const Icon = ICONS[i % ICONS.length];
    const layer = layers[i % layers.length];
    const layerOpacity = layer === "back" ? 0.05 : layer === "mid" ? 0.08 : 0.12;
    const layerSize = layer === "back" ? 20 : layer === "mid" ? 28 : 36;
    const fallDuration = layer === "back" ? 34 + seededRandom(i * 5 + 1) * 18
      : layer === "mid" ? 24 + seededRandom(i * 5 + 1) * 14
      : 16 + seededRandom(i * 5 + 1) * 10;

    return {
      Icon,
      layer,
      top: seededRandom(i * 3 + 1) * 100,
      left: seededRandom(i * 3 + 2) * 96 + 2,
      size: layerSize + seededRandom(i * 3 + 3) * 8,
      duration: fallDuration,
      delay: -(seededRandom(i * 5 + 2) * fallDuration),
      driftX: (seededRandom(i * 5 + 3) - 0.5) * 30,
      driftY: 0,
      rotate: (seededRandom(i * 5 + 5) - 0.5) * 20,
      opacity: layerOpacity,
    };
  });
}

const ICON_SPECS = buildIcons(64);
const LAYER_PARALLAX: Record<Layer, number> = { back: 6, mid: 14, front: 24 };

export default function GlobalBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    let raf = 0;
    let visible = true;

    function handleMove(e: MouseEvent) {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }

    function handleVisibility() {
      visible = document.visibilityState === "visible";
    }

    function tick() {
      if (visible) {
        pos.current.x += (mouse.current.x - pos.current.x) * 0.05;
        pos.current.y += (mouse.current.y - pos.current.y) * 0.05;
        const el = containerRef.current;
        if (el) {
          el.style.setProperty("--parallax-x", pos.current.x.toFixed(3));
          el.style.setProperty("--parallax-y", pos.current.y.toFixed(3));
        }
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 z-0 overflow-hidden"
      style={{ ["--parallax-x" as string]: 0, ["--parallax-y" as string]: 0 }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.06),transparent_60%)]" />

      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {(["back", "mid", "front"] as Layer[]).map((layer) => (
        <div
          key={layer}
          className="floating-icon-layer absolute inset-0"
          style={{
            transform: reducedMotion
              ? undefined
              : `translate(calc(var(--parallax-x) * ${LAYER_PARALLAX[layer]}px), calc(var(--parallax-y) * ${LAYER_PARALLAX[layer]}px))`,
            transition: "transform 0.2s linear",
          }}
        >
          {ICON_SPECS.filter((s) => s.layer === layer).map((spec, i) => (
            <span
              key={`${layer}-${i}`}
              className={reducedMotion ? "" : "rain-icon"}
              style={{
                position: "absolute",
                top: "-12%",
                left: `${spec.left}%`,
                color: "#94a3b8",
                opacity: spec.opacity,
                filter: layer === "back" ? "blur(1px)" : "none",
                ["--dur" as string]: `${spec.duration}s`,
                ["--delay" as string]: `${spec.delay}s`,
                ["--sway" as string]: `${spec.driftX}px`,
                ["--rot" as string]: `${spec.rotate}deg`,
              }}
            >
              <spec.Icon size={spec.size} strokeWidth={1.25} />
            </span>
          ))}
        </div>
      ))}

      <div className="noise-overlay" />
    </div>
  );
}