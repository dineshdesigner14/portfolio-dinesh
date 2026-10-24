"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CircleSlash,
  Info,
  ListChecks,
  Search,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import type { WalkStepKey, Walkthrough as WalkthroughData } from "@/lib/designLab";

const STEPS: { key: WalkStepKey; label: string; Icon: typeof Search }[] = [
  { key: "symptoms", label: "Symptoms", Icon: AlertTriangle },
  { key: "evidence", label: "Evidence", Icon: Search },
  { key: "hypotheses", label: "Hypotheses", Icon: ListChecks },
  { key: "rootCause", label: "Root cause", Icon: Target },
  { key: "fix", label: "Fix", Icon: Wrench },
  { key: "prevention", label: "Prevention", Icon: ShieldCheck },
];

/** Structured troubleshooting: one step at a time, and the diagram highlights what matters. */
export default function Walkthrough({
  data,
  onFocus,
}: {
  data: WalkthroughData;
  onFocus: (nodeIds: string[]) => void;
}) {
  const reduced = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  useEffect(() => {
    onFocus(data.focus[step.key]);
  }, [data, step.key, onFocus]);

  useEffect(() => () => onFocus([]), [onFocus]);

  const go = (i: number) => setIdx(Math.max(0, Math.min(STEPS.length - 1, i)));

  return (
    <section aria-labelledby="walk-title" className="glass rounded-3xl p-5 sm:p-7">
      <span className="inline-flex items-center gap-2 rounded-full border border-[#e8a93c]/60 bg-[#ffe3a8]/50 px-3 py-1 text-[11px] font-semibold text-[#6b4a0a]">
        <Info size={13} aria-hidden />
        {data.label}
      </span>
      <h3 id="walk-title" className="mt-3 text-xl font-bold text-text sm:text-2xl">
        {data.title}
      </h3>
      <p className="mt-1 text-[14px] text-text-secondary">{data.intro}</p>

      {/* stepper */}
      <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Troubleshooting steps">
        {STEPS.map((s, i) => {
          const active = i === idx;
          const done = i < idx;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center gap-2 rounded-2xl border px-2.5 py-2 text-left text-[12px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                  active
                    ? "border-[#4fa3ff] bg-white text-[#14304f] shadow-[0_6px_18px_rgba(79,163,255,0.25)]"
                    : "border-white/90 bg-white/55 text-text-secondary hover:bg-white/80"
                }`}
              >
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold"
                  style={{
                    background: active ? "linear-gradient(135deg,#4fa3ff,#5a84ff)" : done ? "#2fb5a0" : "rgba(20,48,79,0.1)",
                    color: active || done ? "#fff" : "#14304f",
                  }}
                >
                  {done ? <Check size={13} strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                <span className="truncate">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* step content */}
      <div className="mt-5 min-h-[230px]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <h4 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-text">
              <step.Icon size={17} className="text-[#2b67d1]" aria-hidden />
              {step.label}
            </h4>

            {step.key === "symptoms" && (
              <ul className="grid gap-2 sm:grid-cols-3">
                {data.symptoms.map((s) => (
                  <li
                    key={s}
                    className="rounded-2xl border border-[#ff9f68]/40 bg-[#ffd6a5]/35 p-3 text-[13px] leading-snug text-[#14304f]"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}

            {step.key === "evidence" && (
              <ul className="space-y-2">
                {data.evidence.map((e) => (
                  <li key={e.source + e.finding} className="rounded-2xl border border-white/90 bg-white/65 p-3">
                    <div className="flex flex-wrap items-start gap-x-3 gap-y-1">
                      <span className="rounded-full bg-[#4fa3ff]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#2b67d1]">
                        {e.source}
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] leading-snug text-[#14304f]">{e.finding}</span>
                    </div>
                    {e.command && (
                      <code className="mt-2 block overflow-x-auto whitespace-nowrap rounded-lg bg-[#14304f] px-3 py-1.5 font-mono text-[11.5px] text-[#d9ecff]">
                        $ {e.command}
                      </code>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {step.key === "hypotheses" && (
              <ul className="space-y-2">
                {data.hypotheses.map((h) => {
                  const ok = h.verdict === "confirmed";
                  return (
                    <li
                      key={h.text}
                      className={`flex gap-3 rounded-2xl border p-3 ${
                        ok ? "border-[#2fb5a0] bg-[#d9f5e8]/70" : "border-white/90 bg-white/55"
                      }`}
                    >
                      <span
                        className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full text-white"
                        style={{ background: ok ? "#2fb5a0" : "#8a9bb8" }}
                        aria-hidden
                      >
                        {ok ? <Check size={14} strokeWidth={3} /> : <CircleSlash size={13} />}
                      </span>
                      <span className="min-w-0 text-[13px] leading-snug text-[#14304f]">
                        <span className="block font-semibold">
                          {h.text}{" "}
                          <span className="ml-1 rounded-full bg-white/80 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide">
                            {ok ? "Confirmed" : "Ruled out"}
                          </span>
                        </span>
                        <span className="text-text-secondary">{h.because}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {step.key === "rootCause" && (
              <p className="rounded-2xl border-l-4 border-[#e8a93c] bg-[#ffe3a8]/45 p-4 text-[14px] leading-relaxed text-[#14304f]">
                {data.rootCause}
              </p>
            )}

            {step.key === "fix" && (
              <ol className="space-y-2">
                {data.fix.map((f, i) => (
                  <li key={f} className="flex gap-3 text-[13.5px] leading-snug text-[#14304f]">
                    <span
                      className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white"
                      style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{f}</span>
                  </li>
                ))}
              </ol>
            )}

            {step.key === "prevention" && (
              <ul className="grid gap-2 sm:grid-cols-2">
                {data.prevention.map((p) => (
                  <li
                    key={p}
                    className="flex gap-2.5 rounded-2xl border border-white/90 bg-white/65 p-3 text-[13px] leading-snug text-[#14304f]"
                  >
                    <Check size={16} className="mt-0.5 flex-none text-[#2fb5a0]" strokeWidth={3} aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {data.timeline && data.timeline.length > 0 && (
        <div className="mt-5 rounded-2xl border border-white/90 bg-white/55 p-4">
          <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
            Incident timeline
          </h4>
          <ol className="grid gap-3 sm:grid-cols-5">
            {data.timeline.map((t, i) => (
              <li key={t.phase} className="relative">
                <div className="flex items-center gap-2">
                  <span
                    className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <span className="text-[12.5px] font-bold text-text">{t.phase}</span>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">{t.event}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-text-secondary">
            Phases only. No durations are shown because this is an illustration, not a real incident.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#14304f]/10 pt-4">
        <p className="text-[12px] text-text-secondary">
          Relevant components are highlighted in the diagram above.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            disabled={idx === 0}
            className="flex items-center gap-1.5 rounded-full border border-white/90 bg-white/80 px-4 py-2 text-[12.5px] font-semibold text-[#14304f] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1] disabled:opacity-40"
          >
            <ArrowLeft size={14} aria-hidden /> Back
          </button>
          <button
            type="button"
            onClick={() => go(idx + 1)}
            disabled={idx === STEPS.length - 1}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-[#2b67d1] focus-visible:ring-offset-2 disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
          >
            Next <ArrowRight size={14} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
