"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { PLATFORM_MODULES } from "@/lib/data";

// Deterministic pseudo-random generator so scatter positions are stable across renders
function seeded(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function getScatter(index: number) {
  const angle = seeded(index * 3 + 1) * Math.PI * 2;
  const distance = 180 + seeded(index * 3 + 2) * 220;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: (seeded(index * 3 + 3) - 0.5) * 60,
    scale: 0.55 + seeded(index * 5 + 1) * 0.25,
  };
}

export default function PlatformModules() {
  return (
    <section id="platform-modules" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-3xl font-bold"
        >
          Platform Modules
        </motion.h2>
        <p className="mb-16 text-text-secondary">
          Everything a cloud & DevOps engineer needs, in one workspace.
        </p>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {PLATFORM_MODULES.map((mod, i) => {
            const scatter = getScatter(i);
            const Icon = (Icons as any)[mod.icon] ?? Icons.Box;
            return (
              <motion.div
                key={mod.name}
                initial={{
                  opacity: 0.3,
                  x: scatter.x,
                  y: scatter.y,
                  rotate: scatter.rotate,
                  scale: scatter.scale,
                  filter: "blur(6px)",
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 12,
                  mass: 0.9,
                  delay: (i % 4) * 0.06,
                }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 15 } }}
                className="glass group flex flex-col items-center justify-center gap-4 rounded-3xl p-6 text-center"
                style={{ transformPerspective: 900 }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-[#7c3aed]/20 text-[#60a5fa] transition-transform duration-300 group-hover:scale-110">
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold">{mod.name}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
