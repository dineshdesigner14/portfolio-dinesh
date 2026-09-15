"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import { PROJECTS } from "@/lib/data";
import FeaturedDWorkerCard from "./dworker/FeaturedDWorkerCard";

export default function Projects() {
  const otherProjects = PROJECTS.filter((p) => p.title !== "D-Worker");

  return (
    <section id="projects" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-3xl font-bold"
        >
          Selected Work
        </motion.h2>
        <p className="mb-14 text-text-secondary">Production systems built for scale and reliability.</p>

        <FeaturedDWorkerCard />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="glass group relative flex flex-col overflow-hidden rounded-3xl p-6 text-left transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)]"
            >
              {p.featured && (
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] px-3 py-1 text-xs font-bold text-[#3d2e00]">
                  <Star size={12} /> Featured
                </span>
              )}
              <h3 className="mb-2 text-xl font-bold">{p.title}</h3>
              <p className="mb-4 flex-1 text-sm text-text-secondary">{p.desc}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-[#60a5fa]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 text-sm font-semibold">
                <a href={p.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary">
                  <Github size={16} /> GitHub
                </a>
                <a href={p.demo} className="flex items-center gap-1.5 hover:text-primary">
                  <ExternalLink size={16} /> Live Demo
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
