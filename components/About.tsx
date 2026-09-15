"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ABOUT, PROFILE } from "@/lib/data";
import Counter from "./Counter";

export default function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-14 md:grid-cols-[280px_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={PROFILE.photo}
            alt={PROFILE.name}
            width={280}
            height={280}
            className="aspect-square w-full rounded-3xl object-cover shadow-2xl"
          />
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-3xl font-bold"
          >
            {ABOUT.greeting}
          </motion.h2>

          {ABOUT.story.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="mb-4 leading-relaxed text-text-secondary"
            >
              {para}
            </motion.p>
          ))}

          <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {ABOUT.counters.map((c) => (
              <Counter key={c.label} value={c.value} suffix={c.suffix} label={c.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
