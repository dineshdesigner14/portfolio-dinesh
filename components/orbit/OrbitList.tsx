"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DWORKER, DWORKER_RINGS } from "@/lib/data";
import { DetailBody } from "./DetailCard";
import { PIPELINES, RING_COLORS, TECH_ICONS, techColor } from "./layout";
import { Intro } from "./Panels";

/**
 * Phones, tablets, short screens and reduced-motion users:
 * the same six orbits as grouped cards, each technology expands in place.
 */
export default function OrbitList() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);

  const pick = (name: string) => {
    setOpen((cur) => (cur === name ? null : name));
    requestAnimationFrame(() => {
      document.getElementById(`tech-${name}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  return (
    <section aria-label="D-Worker ecosystem" className="relative px-5 pb-20 pt-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Intro />
        <p className="mt-4 text-[14px] leading-relaxed text-text-secondary">{DWORKER.description}</p>

        <div className="glass mt-6 rounded-3xl p-4">
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2b67d1]">
            Flows
          </h2>
          <ul className="space-y-2">
            {PIPELINES.map((p) => (
              <li key={p.id} className="text-[12.5px] text-[#14304f]">
                <span className="font-semibold">{p.label}: </span>
                <span className="text-text-secondary">{p.nodes.join(" → ")}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 space-y-5">
          {DWORKER_RINGS.map((ring, ri) => (
            <section key={ring.name} className="glass rounded-3xl p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-3 text-[15px] font-bold text-text">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white text-[12px]"
                  style={{ borderColor: RING_COLORS[ri] }}
                  aria-hidden
                >
                  {ri + 1}
                </span>
                {ring.name}
              </h2>

              <ul className="flex flex-wrap gap-2">
                {ring.nodes.map((name) => {
                  const Icon = TECH_ICONS[name];
                  const color = techColor(name);
                  const isOpen = open === name;
                  return (
                    <li key={name} id={`tech-${name}`}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => pick(name)}
                        className="flex items-center gap-1.5 rounded-full border bg-white/80 py-[5px] pl-[5px] pr-3 text-[13px] font-semibold text-[#14304f] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
                        style={{
                          borderColor: isOpen ? RING_COLORS[ri] : "rgba(255,255,255,0.9)",
                          boxShadow: isOpen ? `0 0 0 3px ${RING_COLORS[ri]}33` : undefined,
                        }}
                      >
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full"
                          style={{ background: `${color}24`, color }}
                        >
                          {Icon && <Icon size={14} strokeWidth={2.3} aria-hidden />}
                        </span>
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence initial={false}>
                {ring.nodes.includes(open ?? "") && open && (
                  <motion.div
                    key={open}
                    initial={reduced ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-2xl border border-white/90 bg-white/60 p-4">
                      <h3 className="mb-3 text-lg font-bold text-text">{open}</h3>
                      <DetailBody name={open} onPick={pick} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
