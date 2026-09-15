"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import Architecture from "./dworker/Architecture";

/**
 * D-Worker section — pure orchestrator. Fullscreen, no card, no max-width.
 * Architecture (and its boot sequence) is only mounted once this section
 * actually scrolls into view — not immediately on page load — so the boot
 * screen never plays at the top of the page or bleeds into other sections.
 */
export default function DWorkerShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  return (
    <section
      id="dworker"
      ref={ref}
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen"
      style={{ minHeight: "100dvh" }}
    >
      {inView && <Architecture />}
    </section>
  );
}
