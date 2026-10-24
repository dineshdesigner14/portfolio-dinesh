"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { WindProvider } from "../hero/WindProvider";
import CloudLayers from "../hero/CloudLayers";
import ParticleField from "../hero/ParticleField";
import OrbitStage from "./OrbitStage";
import OrbitList from "./OrbitList";

/** Floating glass pill: back to the portfolio · title · the live product site. */
function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
      <nav
        aria-label="D-Worker"
        className="glass pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full px-4 py-2"
      >
        <Link
          href="/#projects"
          className="flex items-center gap-2 rounded-full px-2 py-1 text-[13px] font-semibold text-[#14304f] outline-none transition-colors hover:text-[#2b67d1] focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
        >
          <ArrowLeft size={16} aria-hidden />
          Portfolio
        </Link>
        <span className="hidden text-[13px] font-bold tracking-wide text-text sm:block">
          D-Worker ecosystem
        </span>
        <a
          href="https://dworker.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold text-white outline-none transition-shadow hover:shadow-[0_0_24px_4px_rgba(79,163,255,0.4)] focus-visible:ring-2 focus-visible:ring-[#2b67d1] focus-visible:ring-offset-2"
          style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
        >
          dworker.cloud
          <ExternalLink size={13} aria-hidden />
        </a>
      </nav>
    </header>
  );
}

/**
 * /dworker — the D-Worker ecosystem on its own page, in the Cloud Odyssey sky.
 *  - big screens: the interactive Orbit Garden
 *  - phones / short screens / reduced motion: grouped, expandable list
 */
export default function DWorkerPage() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px) and (min-height: 700px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <WindProvider>
      <main className="relative isolate min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg,#dff0ff 0%,#e6f4ff 30%,#ebe5ff 66%,#fff3e6 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 85% 12%, rgba(255,227,168,0.45) 0%, transparent 42%), radial-gradient(ellipse at 8% 70%, rgba(199,182,255,0.32) 0%, transparent 46%)",
          }}
        />
        <CloudLayers layer="back" />
        <ParticleField />

        <TopBar />

        {wide === null ? (
          <div aria-hidden className="min-h-screen" />
        ) : wide && !reduced ? (
          <OrbitStage />
        ) : (
          <OrbitList />
        )}
      </main>
    </WindProvider>
  );
}
