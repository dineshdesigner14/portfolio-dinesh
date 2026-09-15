"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { CERTIFICATIONS } from "@/lib/data";

export default function Certifications() {
  return (
    <section id="certifications" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-3xl font-bold"
        >
          Certifications
        </motion.h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((c, i) => {
            const Icon = (Icons as any)[c.icon] ?? Icons.Award;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass flex flex-col items-center gap-3 rounded-3xl p-6 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-[#7c3aed]/20 text-[#60a5fa]">
                  <Icon size={28} />
                </div>
                <h3 className="font-bold">{c.name}</h3>
                <span className="text-sm text-text-secondary">{c.year}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
