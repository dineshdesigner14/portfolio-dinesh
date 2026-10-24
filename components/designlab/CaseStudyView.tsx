"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  FileWarning,
  Info,
  MousePointerClick,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import type { CaseStudy, Provenance } from "@/lib/designLab";
import { PROVENANCE } from "./meta";
import { ProvenanceBadge } from "./badges";
import Diagram from "./Diagram";
import ComponentPanel from "./ComponentPanel";
import Walkthrough from "./Walkthrough";
import styles from "./designlab.module.css";

const REAL_ORDER = ["built", "operated", "explored", "concept"] as const;

function RealityCard({ study }: { study: CaseStudy }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-[#2b67d1]">
        <MousePointerClick size={16} aria-hidden />
        Select any component in the diagram to explore it.
      </div>
      <h3 className="mb-3 mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
        What is real in this design
      </h3>
      <div className="space-y-3">
        {REAL_ORDER.map((k) => {
          const items = study.real[k];
          if (!items || items.length === 0) return null;
          return (
            <div key={k}>
              <ProvenanceBadge provenance={k} size="sm" />
              <ul className="mt-1.5 space-y-1">
                {items.map((t) => (
                  <li key={t} className="flex gap-2 text-[12.5px] leading-snug text-[#14304f]">
                    <span aria-hidden className="mt-[6px] h-1 w-1 flex-none rounded-full bg-[#14304f]/50" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CaseStudyView({ study }: { study: CaseStudy }) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const [flowId, setFlowId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [failureId, setFailureId] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  const flow = study.flows.find((f) => f.id === flowId) ?? null;
  const failure = study.failures.find((f) => f.id === failureId) ?? null;
  const cur = flow ? flow.steps[Math.min(step, flow.steps.length - 1)] : null;

  const nodeIds = useMemo(() => new Set(study.nodes.map((n) => n.id)), [study]);
  const brokenNodes = useMemo(
    () => (failure ? failure.breaks.filter((id) => nodeIds.has(id)) : []),
    [failure, nodeIds]
  );
  const brokenEdges = useMemo(
    () => (failure ? failure.breaks.filter((id) => !nodeIds.has(id)) : []),
    [failure, nodeIds]
  );

  // autoplay: advance one step at a time, stop on the last one (never loops)
  useEffect(() => {
    if (!playing || !flow) return;
    if (step >= flow.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 2800);
    return () => clearTimeout(t);
  }, [playing, flow, step]);

  const startFlow = (id: string) => {
    setFailureId(null);
    if (flowId === id) {
      setFlowId(null);
      setPlaying(false);
      return;
    }
    setFlowId(id);
    setStep(0);
    setPlaying(!reduced);
  };

  const pickFailure = (id: string) => {
    setFlowId(null);
    setPlaying(false);
    setFailureId((cur) => (cur === id ? null : id));
  };

  const select = (id: string) => {
    setSelected(id);
    requestAnimationFrame(() =>
      panelRef.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" })
    );
  };

  const onFocusNodes = useCallback((ids: string[]) => setHighlight(ids), []);

  const lastStep = flow ? flow.steps.length - 1 : 0;

  return (
    <div>
      {/* header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/90 bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
            {study.kind === "implemented" ? "Implemented system" : "Conceptual design"}
          </span>
          {!study.reviewed && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8a93c]/60 bg-[#ffe3a8]/50 px-3 py-1 text-[11px] font-semibold text-[#6b4a0a]">
              <FileWarning size={13} aria-hidden />
              Draft — reasoning text pending owner review
            </span>
          )}
        </div>
        <h3 className="mt-3 text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold leading-tight tracking-tight text-text">
          {study.title}
        </h3>
        <p className="mt-1 text-[15px] font-medium text-[#2b67d1]">{study.tagline}</p>
        <p className="mt-2 max-w-3xl text-[14px] leading-relaxed text-text-secondary">{study.summary}</p>
        {study.disclaimer && (
          <p className="mt-3 flex max-w-3xl items-start gap-2 rounded-2xl border border-[#8e7be0]/40 bg-[#dcceff]/40 px-4 py-2.5 text-[12.5px] leading-snug text-[#14304f]">
            <Info size={14} className="mt-0.5 flex-none text-[#6f5bc7]" aria-hidden />
            {study.disclaimer}
          </p>
        )}
      </div>

      {/* diagram */}
      <div className="glass rounded-3xl p-3 sm:p-5">
        <div className="overflow-x-auto" data-lenis-prevent>
          <div className="min-w-[900px]">
            <Diagram
              study={study}
              selected={selected}
              onSelect={select}
              litNodes={cur?.nodes ?? []}
              litEdges={cur?.edges ?? []}
              brokenNodes={brokenNodes}
              brokenEdges={brokenEdges}
              highlight={highlight}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 text-[11.5px] text-text-secondary">
          <p className="flex items-center gap-1.5 lg:hidden">
            <ArrowRight size={13} className={styles.swipeHint} aria-hidden />
            Swipe the diagram sideways to see all of it
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1" aria-label="How to read the diagram">
            <li className="flex items-center gap-1.5">
              <svg width="26" height="8" aria-hidden>
                <path d="M1 4 H25" stroke="#9db4d9" strokeWidth="2" />
              </svg>
              request
            </li>
            <li className="flex items-center gap-1.5">
              <svg width="26" height="8" aria-hidden>
                <path d="M1 4 H25" stroke="#9db4d9" strokeWidth="2" strokeDasharray="6 5" />
              </svg>
              control
            </li>
            <li className="flex items-center gap-1.5">
              <svg width="26" height="8" aria-hidden>
                <path d="M1 4 H25" stroke="#9db4d9" strokeWidth="2" strokeDasharray="2 5" strokeLinecap="round" />
              </svg>
              data
            </li>
            {(["built", "explored", "concept"] as Provenance[]).map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <svg width="22" height="14" aria-hidden>
                  <rect x="1.5" y="1.5" width="19" height="11" rx="4" fill="#fff" stroke={PROVENANCE[k].color} strokeWidth="1.8" strokeDasharray={PROVENANCE[k].dash} />
                </svg>
                {PROVENANCE[k].label.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* quick pick: also the keyboard / screen-reader route through the components */}
      <div className="mt-4">
        <h4 className="sr-only">Components</h4>
        <ul className="flex flex-wrap gap-2">
          {study.nodes
            .filter((n) => n.provenance !== "actor")
            .map((n) => {
              const active = selected === n.id;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => select(n.id)}
                    aria-pressed={active}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                      active ? "border-[#4fa3ff] bg-white shadow-sm" : "border-white/90 bg-white/60 hover:bg-white/85"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full"
                      style={{ background: PROVENANCE[n.provenance].color }}
                    />
                    {n.label}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>

      {/* player + component panel */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2b67d1]">
            Play a flow
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.flows.map((f) => {
              const on = flowId === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => startFlow(f.id)}
                    className={`rounded-2xl border px-3.5 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                      on
                        ? "border-[#4fa3ff] bg-white shadow-[0_6px_18px_rgba(79,163,255,0.25)]"
                        : "border-white/90 bg-white/60 hover:bg-white/85"
                    }`}
                  >
                    <span className="block text-[13px] font-semibold text-[#14304f]">{f.label}</span>
                    <span className="block text-[11px] text-text-secondary">{f.blurb}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <h4 className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c2453f]">
            <ShieldAlert size={13} aria-hidden />
            Break something
          </h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {study.failures.map((f) => {
              const on = failureId === f.id;
              return (
                <li key={f.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickFailure(f.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                      on
                        ? "border-[#e0524f] bg-[#ffd6d6]/70 text-[#7a1f1b]"
                        : "border-white/90 bg-white/60 text-[#14304f] hover:bg-white/85"
                    }`}
                  >
                    {f.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* caption: what is happening right now */}
          <div className="mt-5 min-h-[120px] rounded-2xl border border-white/90 bg-white/60 p-4" aria-live="polite">
            {flow && cur ? (
              <motion.div key={`${flow.id}-${step}`} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Step {step + 1} of {flow.steps.length}
                </p>
                <p className="mt-1 text-[15px] font-bold text-text">{cur.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{cur.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {!reduced && (
                    <button
                      type="button"
                      onClick={() => {
                        if (step >= lastStep) setStep(0);
                        setPlaying((p) => !p);
                      }}
                      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#2b67d1] focus-visible:ring-offset-2"
                      style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
                    >
                      {playing ? <Pause size={13} aria-hidden /> : <Play size={13} aria-hidden />}
                      {playing ? "Pause" : step >= lastStep ? "Replay" : "Play"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      setStep((s) => Math.max(0, s - 1));
                    }}
                    disabled={step === 0}
                    aria-label="Previous step"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/90 bg-white/80 text-[#14304f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1] disabled:opacity-40"
                  >
                    <ArrowLeft size={14} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPlaying(false);
                      setStep((s) => Math.min(lastStep, s + 1));
                    }}
                    disabled={step >= lastStep}
                    aria-label="Next step"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/90 bg-white/80 text-[#14304f] outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1] disabled:opacity-40"
                  >
                    <ArrowRight size={14} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlowId(null);
                      setPlaying(false);
                    }}
                    className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-text-secondary outline-none hover:text-[#14304f] focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
                  >
                    <RotateCcw size={13} aria-hidden /> Clear
                  </button>
                </div>
              </motion.div>
            ) : failure ? (
              <motion.div key={failure.id} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5 text-[13px] leading-snug">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-bold text-text">{failure.label}</p>
                  <ProvenanceBadge provenance={failure.provenance} size="sm" />
                </div>
                <p>
                  <span className="font-semibold text-[#c2453f]">What you’d see: </span>
                  {failure.symptom}
                </p>
                <p>
                  <span className="font-semibold text-[#14304f]">What the design does: </span>
                  {failure.behaviour}
                </p>
                <p>
                  <span className="font-semibold text-[#1c8a78]">How to harden it: </span>
                  {failure.mitigation}
                </p>
              </motion.div>
            ) : (
              <p className="text-[13px] leading-relaxed text-text-secondary">
                Pick a flow to watch a request and its data move through the system, or break a component to see what the design does when something goes wrong.
              </p>
            )}
          </div>
        </div>

        <div ref={panelRef} className="scroll-mt-28">
          {selected ? (
            <ComponentPanel study={study} nodeId={selected} onClose={() => setSelected(null)} />
          ) : (
            <RealityCard study={study} />
          )}
        </div>
      </div>

      {/* trade-offs */}
      <div className="mt-12">
        <h4 className="text-lg font-bold text-text">Engineering decisions &amp; trade-offs</h4>
        <p className="mb-4 mt-1 text-[13.5px] text-text-secondary">
          What was chosen, what it was chosen over, and what it costs.
        </p>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {study.decisions.map((d) => (
            <li key={d.title} className="glass flex flex-col rounded-3xl p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h5 className="text-[14.5px] font-bold leading-snug text-text">{d.title}</h5>
                <ProvenanceBadge provenance={d.provenance} size="sm" />
              </div>
              <dl className="space-y-2 text-[12.5px] leading-snug">
                <div>
                  <dt className="font-semibold text-[#1c8a78]">Chose</dt>
                  <dd className="text-[#14304f]">{d.chose}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-text-secondary">Over</dt>
                  <dd className="text-[#14304f]">{d.over}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#2b67d1]">Because</dt>
                  <dd className="text-[#14304f]">{d.because}</dd>
                </div>
                <div className="rounded-xl bg-[#ffe3a8]/45 px-3 py-2">
                  <dt className="font-semibold text-[#6b4a0a]">The cost</dt>
                  <dd className="text-[#14304f]">{d.cost}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      {/* troubleshooting */}
      <div className="mt-12">
        <h4 className="mb-4 text-lg font-bold text-text">Troubleshooting walkthrough</h4>
        <Walkthrough data={study.walkthrough} onFocus={onFocusNodes} />
      </div>
    </div>
  );
}
