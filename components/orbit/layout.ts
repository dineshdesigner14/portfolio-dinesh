import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Anchor,
  Boxes,
  CircuitBoard,
  Cloud,
  CloudCog,
  CloudLightning,
  Cog,
  Container,
  FileText,
  Flame,
  FolderOpen,
  GitBranch,
  GitPullRequest,
  Github,
  LineChart,
  Lock,
  Network,
  Route,
  Search,
  ShieldAlert,
  Waypoints,
  Zap,
} from "lucide-react";
import { DWORKER_RINGS, DWORKER_TECH_COLOR, DWORKER_WORKFLOWS } from "@/lib/data";

/**
 * Orbit Garden layout.
 * Radii are fractions of the stage size; the chip angles below were solved
 * numerically so that no two chips, ring badges or the hub overlap
 * (≥ 9px clear on the smallest 600px stage, roomier on larger ones) and so that
 * no chip reaches past 45% of the stage width (the side panels never cover chips).
 */
export const RING_FR = [0.168, 0.224, 0.281, 0.34, 0.402, 0.466];
export const HUB_FR = 0.078;
export const BADGE_ANGLE = -60;

/** degrees, per ring, in the order of DWORKER_RINGS[].nodes */
export const ANGLES: number[][] = [
  [353, 57, 237],
  [113, 197, 155, 17],
  [50, 93, 230, 273],
  [60, 150, 119, 241],
  [24, 67, 107, 141, 252],
  [100, 259, 316],
];

/** one soft colour per ring (all from the Cloud Odyssey palette family) */
export const RING_COLORS = ["#4fa3ff", "#8e7be0", "#2fb5a0", "#ff9f68", "#e8a93c", "#5a84ff"];

export function stageSize(viewportHeight: number): number {
  return Math.max(600, Math.min(860, viewportHeight - 120));
}

export function nodePos(ring: number, index: number, count: number, S: number) {
  const deg = ANGLES[ring]?.[index] ?? (360 * index) / count;
  const a = (deg * Math.PI) / 180;
  const r = RING_FR[ring] * S;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

export function badgePos(ring: number, S: number) {
  const a = (BADGE_ANGLE * Math.PI) / 180;
  const r = RING_FR[ring] * S;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
}

export const TECH_ICONS: Record<string, LucideIcon> = {
  AWS: Cloud,
  Azure: CloudCog,
  "Google Cloud": CloudLightning,
  Docker: Container,
  Kubernetes: CircuitBoard,
  Terraform: Boxes,
  Helm: Anchor,
  GitHub: Github,
  GitLab: GitBranch,
  Jenkins: Cog,
  ArgoCD: GitPullRequest,
  Grafana: LineChart,
  Prometheus: Flame,
  ELK: Search,
  SigNoz: Activity,
  NGINX: Network,
  Istio: Waypoints,
  Traefik: Route,
  Vault: Lock,
  Falco: ShieldAlert,
  Documentation: FileText,
  Automation: Zap,
  Projects: FolderOpen,
};

/** brand accent per tech; near-white brand colours are darkened for the light theme */
export function techColor(name: string): string {
  const c = DWORKER_TECH_COLOR[name] ?? "#4fa3ff";
  return c.toUpperCase() === "#F8FAFC" ? "#3d4a5c" : c;
}

/** name → which ring / slot it sits on */
export const NODE_INDEX: Record<string, { ring: number; index: number; count: number }> = {};
DWORKER_RINGS.forEach((ring, ri) =>
  ring.nodes.forEach((n, i) => {
    NODE_INDEX[n] = { ring: ri, index: i, count: ring.nodes.length };
  })
);

/** undirected workflow neighbours */
export const NEIGHBORS: Record<string, string[]> = {};
DWORKER_WORKFLOWS.forEach(([a, b]) => {
  (NEIGHBORS[a] ??= []).push(b);
  (NEIGHBORS[b] ??= []).push(a);
});

export interface Pipeline {
  id: string;
  label: string;
  blurb: string;
  nodes: string[];
}

/** preset flows — every hop exists in DWORKER_WORKFLOWS */
export const PIPELINES: Pipeline[] = [
  {
    id: "deploy",
    label: "Deploy flow",
    blurb: "Commit to cluster",
    nodes: ["GitHub", "Jenkins", "Docker", "Kubernetes", "AWS"],
  },
  {
    id: "observe",
    label: "Observability",
    blurb: "From pods to dashboards",
    nodes: ["Kubernetes", "Prometheus", "Grafana"],
  },
  {
    id: "secure",
    label: "Security",
    blurb: "Secrets and service mesh",
    nodes: ["Vault", "Kubernetes", "Istio"],
  },
];

/** sub-module bloom around a selected node (solved: ≥ 14px between chips for every list) */
const BLOOM = { rx1: 150, ry1: 62, rx2: 225, ry2: 105, innerMax: 8 };

export function bloomLayout(n: number): { x: number; y: number }[] {
  const inner = Math.min(n, BLOOM.innerMax);
  const outer = n - inner;
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < inner; i++) {
    const a = (2 * Math.PI * i) / inner;
    out.push({ x: BLOOM.rx1 * Math.cos(a), y: BLOOM.ry1 * Math.sin(a) });
  }
  for (let i = 0; i < outer; i++) {
    const a = Math.PI / Math.max(inner, 1) + (2 * Math.PI * i) / outer;
    out.push({ x: BLOOM.rx2 * Math.cos(a), y: BLOOM.ry2 * Math.sin(a) });
  }
  return out;
}

/**
 * Camera zoom when a node is selected. The bloom is ~550px wide at scale 1; the free
 * space between the left column (304px) and the right panel (354px) is `vw - 658`,
 * so the zoom is limited to what fits (1.13 at 1280px, 1.45 on large screens).
 * The node is centred in that free space, which sits 25px left of the viewport centre.
 */
export const CAMERA_SHIFT_X = -25;
export function cameraScale(viewportWidth: number): number {
  return Math.max(1.1, Math.min(1.45, (viewportWidth - 658) / 550));
}
