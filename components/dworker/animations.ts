export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

export const CAMERA_TRANSITION = {
  type: "tween" as const,
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function childFanTransition(index: number) {
  return { duration: 0.35, ease: "easeOut" as const, delay: index * 0.03 };
}

export const PANEL_TRANSITION = { duration: 0.25, ease: "easeOut" as const };
