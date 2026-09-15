"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  "Initializing Workspace...",
  "Loading Infrastructure...",
  "Loading Kubernetes...",
  "Loading Monitoring...",
  "Loading Platform...",
];

function ProgressBar({ active }: { active: boolean }) {
  return (
    <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
      <motion.div
        className="h-full rounded-full bg-[#2563EB]"
        initial={{ width: "0%" }}
        animate={{ width: active ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);

  // store the latest onDone in a ref so this component's own timers are
  // never reset just because the parent re-renders and passes a new
  // function reference (e.g. from cursor-tracking causing frequent re-renders)
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (stepIndex >= STEPS.length) {
      setReady(true);
      const t = setTimeout(() => onDoneRef.current(), 550);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStepIndex((v) => v + 1), 420);
    return () => clearTimeout(t);
    // intentionally NOT depending on onDone here — see onDoneRef above
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-[#0F172A]"
    >
      <div className="space-y-3 font-mono text-sm text-[#60A5FA]">
        {STEPS.slice(0, Math.min(stepIndex + 1, STEPS.length)).map((line, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <div>{"> " + line}</div>
            <ProgressBar active={i <= stepIndex} />
          </motion.div>
        ))}
        {ready && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2 text-sm font-bold text-[#34d399]"
          >
            {"> Workspace Ready ✓"}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
