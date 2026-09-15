"use client";

import { curvedPath } from "./geometry";
import type { Point } from "./types";

interface WorkflowConnectionsProps {
  workflows: [string, string][];
  positions: Record<string, Point>;
  revealByName: Record<string, number>;
  colorMap: Record<string, string>;
  activeName: string | null;
  gradientId: string;
}

/**
 * Draws only genuine engineering-workflow relationships between specific
 * technologies (e.g. GitHub -> Jenkins -> Docker -> Kubernetes -> AWS) —
 * never a spoke from every planet back to the hub. Hovering/focusing a
 * planet brightens only the workflow paths touching it.
 */
export default function WorkflowConnections({
  workflows,
  positions,
  revealByName,
  colorMap,
  activeName,
  gradientId,
}: WorkflowConnectionsProps) {
  return (
    <>
      {workflows.map(([from, to], i) => {
        const a = positions[from];
        const b = positions[to];
        if (!a || !b) return null;

        const reveal = Math.min(revealByName[from] ?? 0, revealByName[to] ?? 0);
        const touchesActive = activeName === from || activeName === to;
        const dimmed = activeName !== null && !touchesActive;
        const color = colorMap[to] ?? colorMap[from] ?? "#2563EB";
        const d = curvedPath(a, b, i % 2 === 0 ? 0.16 : -0.16);

        return (
          <g key={`${from}-${to}`}>
            <path
              d={d}
              fill="none"
              stroke={touchesActive ? color : `url(#${gradientId})`}
              strokeWidth={touchesActive ? 2 : 1}
              pathLength={1}
              strokeDasharray={1}
              style={{
                strokeDashoffset: 1 - reveal,
                opacity: reveal * (dimmed ? 0.05 : touchesActive ? 0.9 : 0.35),
                filter: touchesActive ? `drop-shadow(0 0 3px ${color}99)` : "none",
                transition: "opacity 0.3s ease, filter 0.3s ease, stroke 0.3s ease",
              }}
            />
            {reveal > 0.6 && !dimmed && (
              <circle r={touchesActive ? 3.2 : 2.2} fill={color}>
                <animateMotion
                  dur={`${touchesActive ? 1.4 : 3.2}s`}
                  repeatCount="indefinite"
                  begin={`${i * 0.2}s`}
                  path={d}
                />
              </circle>
            )}
          </g>
        );
      })}
    </>
  );
}
