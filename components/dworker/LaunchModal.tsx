"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
const STEPS = [
  "Initializing Workspace",
  "Loading Infrastructure",
  "Connecting Cloud Providers",
  "Preparing Kubernetes",
  "Loading Monitoring",
  "Initializing Platform Services",
  "Loading Engineering Universe",
];

const STEP_INTERVAL = 260;
const READY_HOLD = 600;

function AmbientParticles() {
  const particles = Array.from({ length: 10 }).map((_, i) => {
    const seed = (i + 1) * 41.7;
    return {
      x: 20 + ((seed * 7) % 60),
      y: 10 + ((seed * 11) % 40),
      delay: (seed % 4) * 0.5,
      duration: 3 + (seed % 3),
    };
  });
  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#38BDF8]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0], y: [0, -14, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

export default function LaunchModal({ onComplete, onCancel }: { onComplete: () => void; onCancel: () => void }) {
  const [completedCount, setCompletedCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (completedCount >= STEPS.length) {
      setReady(true);
      const t = setTimeout(onComplete, READY_HOLD);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCompletedCount((c) => c + 1), STEP_INTERVAL);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedCount]);

  const progress = ready ? 1 : completedCount / STEPS.length;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-black"
        style={{ backdropFilter: "blur(16px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex w-[90vw] max-w-[820px] flex-col items-center overflow-hidden rounded-[24px] px-8 py-10 sm:w-[700px]"
        style={{
          height: "min(560px, 85vh)",
          background: "rgba(8,17,31,0.92)",
          backdropFilter: "blur(32px)",
          border: "1px solid rgba(56,189,248,0.15)",
          boxShadow: "0 0 90px rgba(37,99,235,0.25), 0 0 140px rgba(124,58,237,0.15)",
        }}
      >
        <AmbientParticles />

        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex h-28 w-28 items-center justify-center rounded-2xl bg-white p-4"
          style={{ filter: "drop-shadow(0 0 24px rgba(124,58,237,0.5))" }}
        >
          <div className="relative h-full w-full">
            <Image src="/dworker-favicon.png" alt="D-Worker" fill className="object-contain" priority />
          </div>
        </motion.div>

        <div className="mb-6" />

        <div className="relative z-10 mb-4 h-px w-full max-w-sm bg-white/10" />

        <p className="relative z-10 mb-4 text-xs text-text-secondary">Preparing Engineering Workspace...</p>

        <div className="relative z-10 flex w-full max-w-sm flex-1 flex-col justify-center gap-2.5 overflow-hidden">
          {STEPS.map((step, i) => {
            const done = i < completedCount;
            return (
              <div key={step} className="flex items-center gap-2.5">
                <motion.span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  animate={{
                    backgroundColor: done ? "rgba(56,189,248,0.2)" : "rgba(255,255,255,0.06)",
                    boxShadow: done ? "0 0 8px rgba(56,189,248,0.6)" : "none",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
                    {done && (
                      <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                        <Check size={11} className="text-[#38BDF8]" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <motion.span
                  animate={{ opacity: done ? 1 : 0.35 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-medium text-white"
                >
                  {step}
                </motion.span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-4 w-full max-w-sm">
          <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #2563EB, #38BDF8)" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
          <AnimatePresence>
            {ready && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 text-center text-xs font-bold text-[#34d399]"
              >
                Workspace Ready ✓
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
