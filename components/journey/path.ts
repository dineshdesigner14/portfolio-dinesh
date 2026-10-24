export interface Pt {
  x: number;
  y: number;
}

/** The "world" is the whole mountain, in SVG units. */
export const WORLD_W = 1100;
export const WORLD_H = 2200;

/** Checkpoint positions, bottom (stage 1) → summit (stage 10). */
export const NODES: Pt[] = [
  { x: 470, y: 2030 },
  { x: 660, y: 1830 },
  { x: 440, y: 1630 },
  { x: 670, y: 1430 },
  { x: 430, y: 1230 },
  { x: 680, y: 1030 },
  { x: 450, y: 830 },
  { x: 660, y: 630 },
  { x: 500, y: 440 },
  { x: 575, y: 255 },
];

interface Seg {
  a: Pt;
  c1: Pt;
  c2: Pt;
  b: Pt;
}

/** Catmull-Rom spline through the points, expressed as cubic Béziers. */
function buildSegments(points: Pt[]): Seg[] {
  const out: Seg[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    out.push({
      a: p1,
      c1: { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      c2: { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      b: p2,
    });
  }
  return out;
}

function bezier(s: Seg, t: number): Pt {
  const u = 1 - t;
  return {
    x: u * u * u * s.a.x + 3 * u * u * t * s.c1.x + 3 * u * t * t * s.c2.x + t * t * t * s.b.x,
    y: u * u * u * s.a.y + 3 * u * u * t * s.c1.y + 3 * u * t * t * s.c2.y + t * t * t * s.b.y,
  };
}

function segLength(s: Seg, steps = 48): number {
  let len = 0;
  let prev = bezier(s, 0);
  for (let i = 1; i <= steps; i++) {
    const cur = bezier(s, i / steps);
    len += Math.hypot(cur.x - prev.x, cur.y - prev.y);
    prev = cur;
  }
  return len;
}

const SEGMENTS = buildSegments(NODES);

/** SVG path data for the whole trail. */
export const PATH_D = SEGMENTS.map(
  (s, i) =>
    `${i === 0 ? `M ${s.a.x} ${s.a.y} ` : ""}C ${s.c1.x} ${s.c1.y} ${s.c2.x} ${s.c2.y} ${s.b.x} ${s.b.y}`
).join(" ");

const LENGTHS = SEGMENTS.map((s) => segLength(s));
const TOTAL = LENGTHS.reduce((a, b) => a + b, 0);

/** Fraction of the trail (0..1) at which each checkpoint sits. */
export const STAGE_ARC: number[] = (() => {
  const out = [0];
  let acc = 0;
  for (const l of LENGTHS) {
    acc += l;
    out.push(acc / TOTAL);
  }
  return out;
})();

/**
 * Maps scroll progress (0..1, linear in stages) to a fraction of the trail,
 * so progress i/(n-1) lands exactly on checkpoint i.
 */
export function arcAt(progress: number): number {
  const n = NODES.length - 1;
  const s = Math.min(Math.max(progress, 0), 1) * n;
  const i = Math.min(Math.floor(s), n - 1);
  const f = s - i;
  return STAGE_ARC[i] + (STAGE_ARC[i + 1] - STAGE_ARC[i]) * f;
}
