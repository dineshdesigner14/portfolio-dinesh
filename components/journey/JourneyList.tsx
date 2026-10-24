"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { JOURNEY_STAGES } from "@/lib/journey";
import MountainArt from "./MountainArt";
import StageDetail from "./StageDetail";
import { STAGE_ICONS, STAGE_TILES } from "./stageIcons";

/**
 * Phones, tablets and reduced-motion users: no scroll-pinning.
 * A vertical trail where every stage expands into its full story on tap.
 */
export default function JourneyList() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const [seen, setSeen] = useState<number[]>([0]);

  const toggle = (i: number) => {
    setOpen((cur) => (cur === i ? null : i));
    setSeen((s) => (s.includes(i) ? s : [...s, i]));
  };

  return (
    <section
      aria-label="Engineering Journey"
      className="relative isolate overflow-hidden px-5 pb-24 pt-28 sm:px-8"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg,#fff8f2 0%,#dff0ff 18%,#ebe5ff 55%,#fff3e6 92%,#fff8f2 100%)",
        }}
      />
      <MountainArt
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] w-full opacity-60"
        preserveAspectRatio="xMidYMin slice"
      />

      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <span className="inline-flex rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2b67d1] backdrop-blur-md">
            My journey
          </span>
          <h2 className="mt-4 text-[clamp(2rem,6vw,3rem)] font-extrabold leading-[1.05] tracking-tight text-text">
            Engineering Ascent
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-text-secondary">
            Every step, every challenge, every late-night debugging session brought me closer to
            building solutions that scale. Tap a stage to see what I learned there.
          </p>
        </div>

        <ol className="relative border-l-2 border-[#4fa3ff]/35 pl-7">
          {JOURNEY_STAGES.map((stage, i) => {
            const Icon = STAGE_ICONS[stage.icon];
            const [c1, c2] = STAGE_TILES[i % STAGE_TILES.length];
            const isOpen = open === i;
            const done = seen.includes(i);
            return (
              <li key={stage.id} className="relative mb-4 last:mb-0">
                <span
                  aria-hidden
                  className="absolute -left-[44px] top-5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white text-[11px] font-bold shadow-[0_6px_16px_rgba(90,132,255,0.3)]"
                  style={{
                    background: done
                      ? "linear-gradient(135deg,#4fa3ff,#5a84ff)"
                      : "linear-gradient(135deg,#f1ecff,#c7b6ff)",
                    color: done ? "#fff" : "#2b3a67",
                  }}
                >
                  {done && !isOpen ? <Check size={14} strokeWidth={3} /> : String(i + 1).padStart(2, "0")}
                </span>

                <div className="glass overflow-hidden rounded-2xl">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggle(i)}
                    className="flex w-full items-center gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
                  >
                    <span
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-white"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      <Icon size={22} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-bold text-text">{stage.title}</span>
                      <span className="block text-[12.5px] text-text-secondary">{stage.tagline}</span>
                    </span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-text-secondary">
                      <ChevronDown size={18} aria-hidden />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-[#14304f]/10 p-4 pt-4">
                          <StageDetail stage={stage} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
