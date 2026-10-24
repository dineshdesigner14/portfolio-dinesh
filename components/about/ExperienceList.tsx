"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EXPERIENCE } from "@/lib/data";
import FloatingCard from "../ui/FloatingCard";

/** Experience timeline: each role is a floating glass card that expands. */
export default function ExperienceList() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="relative border-l-2 border-[#4fa3ff]/30 pl-7">
      {EXPERIENCE.map((job, i) => {
        const isOpen = open === i;
        return (
          <FloatingCard
            key={job.role}
            className="mb-6 last:mb-0"
            surfaceClassName="glass relative rounded-2xl"
            delay={i * 0.1}
            amp={5}
            duration={8 + i * 1.3}
          >
            <span
              aria-hidden
              className="absolute -left-[38px] top-6 h-3.5 w-3.5 rounded-full bg-[#4fa3ff] shadow-[0_0_0_5px_rgba(79,163,255,0.22)]"
            />
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full rounded-2xl p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-text">{job.role}</h4>
                  <p className="text-sm font-medium text-primary">{job.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap text-xs text-text-secondary">{job.period}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-text-secondary">
                    <ChevronDown size={18} aria-hidden />
                  </motion.span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-1.5 overflow-hidden text-sm text-text-secondary"
                  >
                    {job.points.map((p) => (
                      <li key={p} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#4fa3ff]" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </button>
          </FloatingCard>
        );
      })}
    </div>
  );
}
