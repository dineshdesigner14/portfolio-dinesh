import { motionValue } from "framer-motion";

/**
 * Shared, mutable pointer state for the hero.
 * Lives outside React so mouse movement never triggers re-renders.
 */
export const pointer = {
  /** viewport coordinates */
  x: -9999,
  y: -9999,
  /** true while the pointer is over the hero */
  active: false,
};

/** Pointer position normalised to -0.5..0.5 across the hero (drives parallax). */
export const pointerNX = motionValue(0);
export const pointerNY = motionValue(0);
