import type { Point } from "./types";

export interface OrbitNodeSpec {
  name: string;
  baseAngle: number;
}

/**
 * Assigns each node in a ring an evenly-spaced base angle. `angleOffset`
 * staggers where each ring "starts" — critical so that node[0] of every
 * ring isn't all pointing straight up (which is what caused planets from
 * different rings to visually stack in straight lines instead of looking
 * like independent orbits).
 */
export function assignRingAngles(names: string[], angleOffset: number): OrbitNodeSpec[] {
  return names.map((name, i) => ({
    name,
    baseAngle: angleOffset + (2 * Math.PI * i) / names.length,
  }));
}

/** A planet's live position: base angle + however much its ring has rotated so far, at `radius`, scaled inward by `reveal` (0 = still at the core, 1 = fully out on its orbit). */
export function livePosition(cx: number, cy: number, radius: number, baseAngle: number, rotation: number, reveal: number): Point {
  const angle = baseAngle + rotation;
  return {
    x: cx + Math.cos(angle) * radius * reveal,
    y: cy + Math.sin(angle) * radius * reveal,
  };
}

/** Quadratic bezier path between two live points, with a gentle perpendicular bend for an organic (non-straight) workflow line. */
export function curvedPath(a: Point, b: Point, bend = 0.18): string {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const perpX = -dy / len;
  const perpY = dx / len;
  const offset = len * bend;
  const cxp = midX + perpX * offset;
  const cyp = midY + perpY * offset;
  return `M ${a.x},${a.y} Q ${cxp},${cyp} ${b.x},${b.y}`;
}
