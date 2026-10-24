import type { LucideIcon } from "lucide-react";
import {
  Blocks,
  Cloud,
  Container,
  GraduationCap,
  Layers,
  MountainSnow,
  Network,
  Ship,
  Terminal,
  Workflow,
} from "lucide-react";
import type { StageIconKey } from "@/lib/journey";

export const STAGE_ICONS: Record<StageIconKey, LucideIcon> = {
  graduation: GraduationCap,
  terminal: Terminal,
  network: Network,
  cloud: Cloud,
  container: Container,
  layers: Layers,
  ship: Ship,
  workflow: Workflow,
  blocks: Blocks,
  mountain: MountainSnow,
};

/** pastel tile colours, cycled per stage */
export const STAGE_TILES: [string, string][] = [
  ["#9fd8ff", "#4fa3ff"],
  ["#dcceff", "#9a83e6"],
  ["#ffe3a8", "#ff9f68"],
  ["#bfe7ff", "#5a84ff"],
  ["#d9f5e8", "#4fb6a0"],
];
