import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Archive,
  Bell,
  BookOpen,
  Boxes,
  Cloud,
  Cog,
  Cpu,
  Database,
  FileCode,
  FolderOpen,
  Gauge,
  GitBranch,
  Globe,
  Hammer,
  HardDrive,
  KeyRound,
  Layers,
  LineChart,
  Lock,
  Network,
  Package,
  Radar,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Target,
  User,
  Waypoints,
  Zap,
} from "lucide-react";
import type { DiagramNode, IconKey, Provenance, ZoneTone } from "@/lib/designLab";

export const NODE_ICONS: Record<IconKey, LucideIcon> = {
  user: User,
  api: Server,
  auth: ShieldCheck,
  file: FileCode,
  queue: Layers,
  lock: Lock,
  archive: Archive,
  gauge: Gauge,
  cog: Cog,
  terraform: Boxes,
  folder: FolderOpen,
  cloud: Cloud,
  database: Database,
  key: KeyRound,
  globe: Globe,
  shield: Shield,
  network: Network,
  zap: Zap,
  git: GitBranch,
  hammer: Hammer,
  package: Package,
  refresh: RefreshCw,
  waypoints: Waypoints,
  chart: LineChart,
  search: Search,
  bell: Bell,
  book: BookOpen,
  radar: Radar,
  activity: Activity,
  cpu: Cpu,
  disk: HardDrive,
  boxes: Boxes,
  target: Target,
};

export interface ProvenanceMeta {
  label: string;
  color: string;
  tint: string;
  /** border dash pattern: a second, non-colour cue for "less than built" */
  dash?: string;
  badgeW: number;
  blurb: string;
}

export const PROVENANCE: Record<Provenance, ProvenanceMeta> = {
  built: {
    label: "Built",
    color: "#2fb5a0",
    tint: "rgba(47,181,160,0.18)",
    badgeW: 44,
    blurb: "Implemented and tested by me.",
  },
  operated: {
    label: "Operated",
    color: "#4fa3ff",
    tint: "rgba(79,163,255,0.18)",
    badgeW: 58,
    blurb: "Run in production at work. Kept generic, with no employer-specific detail.",
  },
  explored: {
    label: "Explored",
    color: "#e8a93c",
    tint: "rgba(232,169,60,0.2)",
    dash: "2 3",
    badgeW: 56,
    blurb: "Researched or prototyped, not shipped.",
  },
  concept: {
    label: "Concept",
    color: "#8e7be0",
    tint: "rgba(142,123,224,0.18)",
    dash: "6 4",
    badgeW: 54,
    blurb: "A reference design shown for discussion, not something I claim to have built.",
  },
  actor: {
    label: "Actor",
    color: "#7c8db5",
    tint: "rgba(124,141,181,0.18)",
    badgeW: 0,
    blurb: "",
  },
};

export const ZONE_STYLE: Record<ZoneTone, { fill: string; stroke: string }> = {
  sky: { fill: "rgba(159,216,255,0.2)", stroke: "rgba(79,163,255,0.5)" },
  lavender: { fill: "rgba(199,182,255,0.18)", stroke: "rgba(142,123,224,0.5)" },
  gold: { fill: "rgba(255,227,168,0.28)", stroke: "rgba(232,169,60,0.55)" },
  peach: { fill: "rgba(255,214,165,0.24)", stroke: "rgba(255,159,104,0.5)" },
};

/* ---------- geometry ---------- */

export const NODE_W = 170;
export const NODE_H = 60;

export function dims(n: DiagramNode) {
  return { w: n.w ?? NODE_W, h: n.h ?? NODE_H };
}

/** point on a node's rectangle border, in the direction of (tx, ty) */
function borderPoint(n: DiagramNode, tx: number, ty: number, gap = 3) {
  const { w, h } = dims(n);
  const dx = tx - n.x;
  const dy = ty - n.y;
  if (dx === 0 && dy === 0) return { x: n.x, y: n.y };
  const sx = w / 2 / Math.max(Math.abs(dx), 1e-9);
  const sy = h / 2 / Math.max(Math.abs(dy), 1e-9);
  const t = Math.min(sx, sy);
  const len = Math.hypot(dx, dy);
  return {
    x: n.x + dx * t + (dx / len) * gap,
    y: n.y + dy * t + (dy / len) * gap,
  };
}

export interface EdgeGeo {
  d: string;
  mid: { x: number; y: number };
}

/** gently curved edge between two nodes, clipped to their borders */
export function edgeGeometry(a: DiagramNode, b: DiagramNode, bend = 0.1): EdgeGeo {
  const p1 = borderPoint(a, b.x, b.y);
  const p2 = borderPoint(b, a.x, a.y, 5);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const cx = (p1.x + p2.x) / 2 - (dy / len) * len * bend;
  const cy = (p1.y + p2.y) / 2 + (dx / len) * len * bend;
  return {
    d: `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`,
    mid: {
      x: 0.25 * p1.x + 0.5 * cx + 0.25 * p2.x,
      y: 0.25 * p1.y + 0.5 * cy + 0.25 * p2.y,
    },
  };
}
