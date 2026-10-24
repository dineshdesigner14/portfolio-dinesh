"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JOURNEY_STAGES } from "@/lib/journey";
import { STAGE_ICONS, STAGE_TILES } from "./stageIcons";
import StageDetail from "./StageDetail";

interface StagePanelProps {
  index: number;
  onGo: (index: number) => void;
}

/** Glass card on the right: details of the stage the climber is on. */
export default function StagePanel({ index, onGo }: StagePanelProps) {
  const stage = JOURNEY_STAGES[index];
  const Icon = STAGE_ICONS[stage.icon];
  const [c1, c2] = STAGE_TILES[index % STAGE_TILES.length];
  const last = JOURNEY_STAGES.length - 1;

  return (
    <aside
      aria-label="Stage details"
      className="glass absolute right-6 top-1/2 z-30 w-[330px] -translate-y-1/2 rounded-3xl p-5"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl text-white shadow-[0_8px_18px_rgba(90,132,255,0.28)]"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
            >
              <Icon size={24} aria-hidden />
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
                Stage {String(index + 1).padStart(2, "0")} of {JOURNEY_STAGES.length}
              </span>
              <h3 className="text-xl font-bold leading-tight text-text">{stage.title}</h3>
            </div>
          </div>
          <p className="mt-2 text-[13px] font-medium text-[#2b67d1]">{stage.tagline}</p>

          <div
            data-lenis-prevent
            className="mt-4 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1"
          >
            <StageDetail stage={stage} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#14304f]/10 pt-4">
        <button
          type="button"
          onClick={() => onGo(index - 1)}
          disabled={index === 0}
          aria-label="Previous stage"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/90 bg-white/80 text-[#14304f] transition-colors hover:bg-white disabled:opacity-35"
        >
          <ChevronLeft size={18} aria-hidden />
        </button>

        <div className="flex items-center gap-1.5" role="group" aria-label="Jump to stage">
          {JOURNEY_STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onGo(i)}
              aria-label={`Go to stage ${i + 1}: ${s.title}`}
              aria-current={i === index ? "step" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-[#4fa3ff]" : "w-2 bg-[#14304f]/20 hover:bg-[#4fa3ff]/60"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => onGo(index + 1)}
          disabled={index === last}
          aria-label="Next stage"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/90 bg-white/80 text-[#14304f] transition-colors hover:bg-white disabled:opacity-35"
        >
          <ChevronRight size={18} aria-hidden />
        </button>
      </div>
    </aside>
  );
}
