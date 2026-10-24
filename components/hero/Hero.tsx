"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ChevronDown, Compass, Download } from "lucide-react";
import { Poppins } from "next/font/google";
import { PROFILE } from "@/lib/data";
import { WindProvider } from "./WindProvider";
import SkyGradient from "./SkyGradient";
import CloudLayers from "./CloudLayers";
import ParticleField from "./ParticleField";
import { BalloonField } from "./BalloonField";
import styles from "./hero.module.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Link that leans toward the pointer (magnetic button). */
function MagneticLink({
  href,
  external,
  disabled,
  className,
  style,
  children,
}: {
  href: string;
  external?: boolean;
  disabled?: boolean;
  className: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18 });
  const y = useSpring(my, { stiffness: 260, damping: 18 });

  return (
    <motion.a
      ref={ref}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onPointerMove={(e) => {
        if (disabled) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left - r.width / 2) * 0.22);
        my.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      style={{ x, y, ...style }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const rise = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: "easeOut" as const },
        };

  return (
    <WindProvider>
      <section
        ref={sectionRef}
        id="top"
        aria-label="Introduction"
        className={`${poppins.className} ${styles.hero} relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5`}
      >
        <SkyGradient />
        <CloudLayers layer="back" />
        <ParticleField />
        <BalloonField />
        <CloudLayers layer="front" />

        {/* soft fade into the next section — no hard edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[26] h-44"
          style={{
            background: "linear-gradient(180deg, rgba(255,248,242,0) 0%, #fff8f2 100%)",
          }}
        />

        <div className="relative z-30 mx-auto flex w-full max-w-3xl flex-col items-center pb-28 pt-28 text-center sm:pt-32">
          <div className={styles.veil} aria-hidden />

          <motion.div
            {...rise(0)}
            className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-[13px] font-medium tracking-wide text-[#1B3A5C] shadow-[0_4px_16px_rgba(79,163,255,0.14)] backdrop-blur-md"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Building • Automating • Scaling
          </motion.div>

          <motion.h1
            {...rise(1)}
            className="text-[clamp(2.4rem,7vw,5rem)] font-extrabold uppercase leading-[1.02] tracking-tight"
            style={{
              backgroundImage: "linear-gradient(180deg, #0d1d2a 0%, #1b3a5c 60%, #256486 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Dinesh Kannan
          </motion.h1>

          <motion.p
            {...rise(2)}
            className="mt-3 text-[clamp(0.8rem,1.6vw,1.05rem)] font-bold uppercase tracking-[0.26em] text-[#2B67D1]"
          >
            Cloud &amp; DevOps Engineer
          </motion.p>

          <motion.p
            {...rise(3)}
            className="mt-4 max-w-xl text-[clamp(0.95rem,1.5vw,1.125rem)] text-[#3B4D63]"
          >
            Cloud Engineer • Platform Engineer • Automation Enthusiast
          </motion.p>

          <motion.div
            {...rise(4)}
            className="mt-9 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row"
          >
            <MagneticLink
              href={PROFILE.resumeUrl}
              external
              disabled={!!reduced}
              style={{ backgroundImage: "linear-gradient(135deg, #4FA3FF, #5A84FF)" }}
              className="inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(79,163,255,0.42)] transition-shadow hover:shadow-[0_12px_34px_rgba(79,163,255,0.6)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B67D1]"
            >
              <Download size={18} aria-hidden />
              Download Resume
            </MagneticLink>

            <MagneticLink
              href="#journey"
              disabled={!!reduced}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/90 bg-white/70 px-8 py-3.5 text-[15px] font-semibold text-[#14304F] shadow-[0_6px_20px_rgba(90,132,255,0.1)] backdrop-blur-md transition-colors hover:bg-white/95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B67D1]"
            >
              <Compass size={18} className="text-[#2B67D1]" aria-hidden />
              Explore Journey
            </MagneticLink>
          </motion.div>
        </div>

        <a
          href="#about"
          aria-label="Scroll down to About"
          className="absolute bottom-9 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full text-[#3B5B85] outline-none focus-visible:ring-2 focus-visible:ring-[#2B67D1] focus-visible:ring-offset-4"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Scroll</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/80 shadow-[0_6px_18px_rgba(90,132,255,0.14)] backdrop-blur-md">
            <ChevronDown size={20} className={styles.scrollBounce} aria-hidden />
          </span>
        </a>

      </section>
    </WindProvider>
  );
}
