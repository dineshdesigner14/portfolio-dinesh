import { useMemo } from "react";
import { computeRingLayout } from "@/components/dworker/geometry";
import type { RingNodeSpec } from "@/components/dworker/types";

export function useOrbit(names: string[], cx: number, cy: number, radius: number): RingNodeSpec[] {
  return useMemo(() => computeRingLayout(names, cx, cy, radius), [names, cx, cy, radius]);
}
