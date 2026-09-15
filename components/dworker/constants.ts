/** Visual palette from the design spec. */
export const COLORS = {
  bg: "#0F172A",
  primary: "#2563EB",
  accent: "#60A5FA",
  purple: "#7C3AED",
};

export const BOOT_LINES = [
  "Initializing Workspace...",
  "Loading Infrastructure...",
  "Loading Kubernetes...",
  "Loading Monitoring...",
  "Loading Platform...",
];

// Re-exported so existing imports of `assignRingAngles`/`easeOutCubic`/`clamp01`
// from "./constants" keep working after the geometry/animation split below.
export { assignRingAngles, livePosition, curvedPath } from "./geometry";
export { clamp01, easeOutCubic, CAMERA_TRANSITION, childFanTransition, PANEL_TRANSITION } from "./animations";
