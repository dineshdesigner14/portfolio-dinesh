"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket } from "lucide-react";
import { DWORKER } from "@/lib/data";
import LaunchModal from "./LaunchModal";
import Architecture from "./Architecture";

type Stage = "closed" | "launching" | "universe";

const CAPABILITIES = [
  "Build Infrastructure.",
  "Automate Workflows.",
  "Manage Kubernetes.",
  "Monitor Everything.",
];

const TAGS = ["AWS", "Kubernetes", "Terraform", "Docker", "Platform Engineering"];

export default function FeaturedDWorkerCard() {
  const [stage, setStage] = useState<Stage>("closed");
  const scrollY = useRef(0);

  useEffect(() => {
    const locked = stage !== "closed";
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [stage]);

  function open() {
    scrollY.current = window.scrollY;
    setStage("launching");
  }

  function close() {
    setStage("closed");
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollY.current, behavior: "instant" as ScrollBehavior });
    });
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="glass relative mx-auto mb-12 max-w-3xl overflow-hidden rounded-3xl p-10 text-center"
        style={{ border: "1px solid rgba(56,189,248,0.15)" }}
      >
        <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-bold text-[#34d399]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#10b981]" />
          {DWORKER.status}
        </span>

        <h3 className="mb-2 text-3xl font-extrabold text-white">D-Worker</h3>
        <p className="mb-6 text-primary">{DWORKER.tagline}</p>

        <div className="mb-6 space-y-1">
          {CAPABILITIES.map((line) => (
            <p key={line} className="text-sm font-medium text-text-secondary">
              {line}
            </p>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <span key={tag} className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-[#60a5fa]">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={open}
          className="mx-auto flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          <Rocket size={16} /> Explore D-Worker
        </button>
      </motion.div>

      <AnimatePresence>
        {stage === "launching" && (
          <LaunchModal onComplete={() => setStage("universe")} onCancel={close} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === "universe" && (
          <motion.div
            key="universe"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#0F172A]"
          >
            <Architecture skipIntro onClose={close} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
