"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Activity,
  Cloud,
  Container,
  Github,
  Layers,
  Network,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { HotAirBalloon, type BalloonTech } from "./HotAirBalloon";

const TECH = {
  aws: {
    id: "aws",
    name: "AWS",
    desc: "Cloud",
    href: "#journey",
    Icon: Cloud,
    colors: ["#FFE3A8", "#FFD6A5", "#FF9F68"],
    basket: "#C98A52",
  },
  docker: {
    id: "docker",
    name: "Docker",
    desc: "Containerization",
    href: "#journey",
    Icon: Container,
    colors: ["#DCCEFF", "#C7B6FF", "#8E7BE0"],
    basket: "#7B6BB0",
  },
  terraform: {
    id: "terraform",
    name: "Terraform",
    desc: "Infrastructure as Code",
    href: "#journey",
    Icon: Layers,
    colors: ["#BFE7FF", "#9FD8FF", "#5A84FF"],
    basket: "#4F688B",
  },
  kubernetes: {
    id: "kubernetes",
    name: "Kubernetes",
    desc: "Orchestration",
    href: "#journey",
    Icon: Network,
    colors: ["#CFE9FF", "#7DB8FF", "#3F7FE0"],
    basket: "#3F6E9B",
  },
  github: {
    id: "github",
    name: "GitHub",
    desc: "Version Control",
    href: "#projects",
    Icon: Github,
    colors: ["#EFE7FF", "#C7B6FF", "#9A83E6"],
    basket: "#6F6290",
  },
  cicd: {
    id: "cicd",
    name: "CI / CD",
    desc: "Automation",
    href: "#journey",
    Icon: Workflow,
    colors: ["#FFD6A5", "#FFB08A", "#FF7F7F"],
    basket: "#B8665C",
  },
  monitoring: {
    id: "monitoring",
    name: "Monitoring",
    desc: "Observability",
    href: "#journey",
    Icon: Activity,
    colors: ["#FFF0C2", "#FFD27A", "#F0A640"],
    basket: "#A8742F",
  },
  security: {
    id: "security",
    name: "Security",
    desc: "Protection",
    href: "#journey",
    Icon: ShieldCheck,
    colors: ["#D9F5E8", "#9FE3C8", "#4FB6A0"],
    basket: "#3E7F72",
  },
} satisfies Record<string, BalloonTech>;

interface Slot {
  tech: BalloonTech;
  /** desktop layout: centre x/y in %, scale */
  x: number;
  y: number;
  s: number;
  /** idle float amplitude / period — different for every balloon so nothing syncs */
  fr: number;
  fd: number;
  /** compact (phones/small tablets) layout; omitted → balloon is hidden there */
  c?: { x: number; y: number; s: number };
}

const SLOTS: Slot[] = [
  { tech: TECH.aws, x: 10, y: 13, s: 1, fr: 14, fd: 6.4, c: { x: 14, y: 11, s: 0.58 } },
  { tech: TECH.docker, x: 5, y: 37, s: 1.08, fr: 12, fd: 7.6, c: { x: 86, y: 15, s: 0.58 } },
  { tech: TECH.terraform, x: 15, y: 57, s: 0.92, fr: 13, fd: 8.2 },
  { tech: TECH.kubernetes, x: 29, y: 62, s: 1.02, fr: 15, fd: 6.9, c: { x: 14, y: 66, s: 0.58 } },
  { tech: TECH.github, x: 90, y: 12, s: 0.98, fr: 11, fd: 7.1 },
  { tech: TECH.cicd, x: 95, y: 36, s: 1.06, fr: 16, fd: 6.1, c: { x: 86, y: 68, s: 0.58 } },
  { tech: TECH.monitoring, x: 84, y: 55, s: 0.94, fr: 12, fd: 8.8 },
  { tech: TECH.security, x: 70, y: 64, s: 1, fr: 14, fd: 7.4 },
];

type Tier = "compact" | "mid" | "wide";

function tierFor(width: number): Tier {
  if (width < 900) return "compact";
  if (width < 1200) return "mid";
  return "wide";
}

function useTier(): Tier {
  const [tier, setTier] = useState<Tier>(() =>
    typeof window === "undefined" ? "wide" : tierFor(window.innerWidth)
  );
  useEffect(() => {
    const onResize = () => setTier(tierFor(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return tier;
}

/** Positions all 8 technology balloons around the headline. */
export function BalloonField() {
  const reduced = useReducedMotion();
  const tier = useTier();

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {SLOTS.map((slot) => {
        if (tier === "compact" && !slot.c) return null;
        const pos =
          tier === "compact" && slot.c
            ? slot.c
            : { x: slot.x, y: slot.y, s: tier === "mid" ? slot.s * 0.82 : slot.s };
        return (
          <div key={slot.tech.id} className="pointer-events-auto">
            <HotAirBalloon
              tech={slot.tech}
              x={pos.x}
              y={pos.y}
              scale={pos.s}
              floatRange={slot.fr}
              floatDuration={slot.fd}
              reducedMotion={!!reduced}
            />
          </div>
        );
      })}
    </div>
  );
}
