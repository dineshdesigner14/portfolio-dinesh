"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "Initializing Cloud...",
  "Loading Kubernetes...",
  "Connecting Monitoring...",
  "Preparing Workspace...",
  "Workspace Ready",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 420;
    const interval = setInterval(() => {
      setLineIndex((i) => {
        const next = i + 1;
        setProgress(Math.min(100, (next / LINES.length) * 100));
        if (next >= LINES.length) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 400);
        }
        return next;
      });
    }, stepDuration);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg"
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#7c3aed] text-2xl font-black text-white"
          >
            D
          </motion.div>

          <div className="mb-4 h-1 w-56 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[#7c3aed]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="h-5 font-mono text-xs text-text-secondary">
            {LINES[Math.min(lineIndex, LINES.length - 1)]}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
