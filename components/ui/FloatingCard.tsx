"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FloatingCardProps {
  children: ReactNode;
  /** layout classes for the outer wrapper (grid span, width, margins…) */
  className?: string;
  /** classes for the glass surface itself */
  surfaceClassName?: string;
  /** reveal delay (s) — also offsets the float loop so cards never sync */
  delay?: number;
  /** float amplitude (px) */
  amp?: number;
  /** seconds per float cycle */
  duration?: number;
  float?: boolean;
}

/**
 * Floating frosted-glass card: reveals on scroll, drifts gently on its own
 * rhythm, and lifts + glows on hover. Reduced-motion users get a static card.
 */
export default function FloatingCard({
  children,
  className = "",
  surfaceClassName = "glass relative rounded-3xl p-6",
  delay = 0,
  amp = 7,
  duration = 7,
  float = true,
}: FloatingCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <motion.div
        animate={float && !reduced ? { y: [0, -amp, 0] } : undefined}
        transition={{
          duration,
          delay: delay * 1.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          whileHover={reduced ? undefined : { scale: 1.015 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`${surfaceClassName} transition-shadow duration-300 hover:shadow-[0_18px_48px_-10px_rgba(79,163,255,0.38)]`}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
