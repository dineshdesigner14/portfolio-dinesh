"use client";

import { motion, useReducedMotion } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** "lg" = section title (h2), "md" = sub-section title (h3) */
  size?: "lg" | "md";
}

/** Eyebrow pill + title + subtitle, shared by every Cloud Odyssey section. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  size = "lg",
}: SectionHeadingProps) {
  const reduced = useReducedMotion();
  const Title = size === "lg" ? motion.h2 : motion.h3;
  const center = align === "center";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-8 flex flex-col gap-3 ${center ? "items-center text-center" : "items-start text-left"}`}
    >
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2b67d1] shadow-[0_4px_16px_rgba(79,163,255,0.12)] backdrop-blur-md">
          {eyebrow}
        </span>
      )}
      <Title
        className={`font-extrabold tracking-tight text-text ${
          size === "lg" ? "text-[clamp(1.9rem,4vw,3rem)] leading-[1.1]" : "text-2xl"
        }`}
      >
        {title}
      </Title>
      {subtitle && (
        <p className={`max-w-xl text-[15px] text-text-secondary ${center ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
