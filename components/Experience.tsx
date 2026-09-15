"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center text-3xl font-bold"
        >
          Experience
        </motion.h2>

        <div className="relative border-l border-white/10 pl-8">
          {EXPERIENCE.map((job, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={job.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative mb-8"
              >
                <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_4px_rgba(59,130,246,0.2)]" />
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="glass w-full rounded-2xl p-5 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{job.role}</h3>
                      <p className="text-sm text-primary">{job.company}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-text-secondary">{job.period}</span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown size={18} />
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
                          <li key={p}>• {p}</li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
