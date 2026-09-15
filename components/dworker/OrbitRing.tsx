"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import type { OrbitNodeSpec } from "./geometry";
import { livePosition } from "./geometry";
import OrbitNode from "./OrbitNode";

interface OrbitRingProps {
  nodes: OrbitNodeSpec[];
  cx: number;
  cy: number;
  radius: number;
  rotation: number;
  reveal: (index: number) => number;
  bloomedEnough: boolean;
  focused: string | null;
  onSelect: (name: string) => void;
  iconMap: Record<string, keyof typeof Icons>;
  colorMap: Record<string, string>;
  magnet?: { x: number; y: number };
  onHover: (name: string | null) => void;
}

/**
 * One orbital ring of planets. No hub-spokes here — each planet's position
 * is computed live every render from its base angle + this ring's current
 * rotation, so planets genuinely travel around their orbit rather than
 * sitting statically. Hover highlights + lifts + magnetically pulls the
 * planet using its own accent color; details only ever appear in focus mode.
 */
export default function OrbitRing({
  nodes,
  cx,
  cy,
  radius,
  rotation,
  reveal,
  bloomedEnough,
  focused,
  onSelect,
  iconMap,
  colorMap,
  magnet = { x: 0, y: 0 },
  onHover,
}: OrbitRingProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {nodes.map((node, i) => {
        const r = reveal(i);
        const pos = livePosition(cx, cy, radius, node.baseAngle, rotation, r);
        const isFocused = focused === node.name;
        const isHovered = hovered === node.name;
        const isDimmedByFocus = focused !== null && !isFocused;
        const IconComp = (Icons as any)[iconMap[node.name]] ?? Icons.Circle;
        const color = colorMap[node.name] ?? "#2563EB";
        const active = isFocused || isHovered;
        const lift = isHovered ? -6 - magnet.y * 1.8 : 0;
        const magnetX = isHovered ? magnet.x * 1.8 : 0;

        return (
          <g
            key={node.name}
            transform={`translate(${pos.x + magnetX}, ${pos.y + lift})`}
            style={{ cursor: bloomedEnough ? "pointer" : "default", transition: "transform 0.2s ease" }}
            onMouseEnter={() => {
              if (!bloomedEnough) return;
              setHovered(node.name);
              onHover(node.name);
            }}
            onMouseLeave={() => {
              setHovered(null);
              onHover(null);
            }}
            onClick={(e) => {
              if (!bloomedEnough) return;
              e.stopPropagation();
              onSelect(node.name);
            }}
          >
            <OrbitNode label={node.name} Icon={IconComp} reveal={r} isActive={active} dimmed={isDimmedByFocus} color={color} />
          </g>
        );
      })}
    </>
  );
}
