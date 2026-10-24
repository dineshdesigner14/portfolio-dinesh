"use client";

import { Play, Square } from "lucide-react";
import { DWORKER, DWORKER_RINGS } from "@/lib/data";
import { PIPELINES, RING_COLORS } from "./layout";

export function Intro() {
  return (
    <div>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2b67d1] shadow-[0_4px_16px_rgba(79,163,255,0.12)] backdrop-blur-md">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {DWORKER.status}
      </span>
      <h1 className="mt-4 text-[clamp(2.2rem,3.6vw,3.2rem)] font-extrabold leading-[1.02] tracking-tight text-text">
        D-Worker
      </h1>
      <p className="mt-2 text-[15px] font-medium leading-snug text-[#2b67d1]">{DWORKER.tagline}</p>
    </div>
  );
}

/** The six orbits. Clicking one spotlights its technologies. */
export function Legend({
  focus,
  onFocus,
}: {
  focus: number | null;
  onFocus: (ring: number | null) => void;
}) {
  return (
    <nav aria-label="Orbits" className="glass rounded-3xl p-4">
      <h2 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
        Orbits
      </h2>
      <ul className="space-y-1">
        {DWORKER_RINGS.map((ring, ri) => {
          const active = focus === ri;
          return (
            <li key={ring.name}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onFocus(active ? null : ri)}
                className={`flex w-full items-center gap-3 rounded-2xl px-2 py-1.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                  active ? "bg-white/90 shadow-sm" : "hover:bg-white/60"
                }`}
              >
                <span
                  className="flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 bg-white text-[11px] font-bold"
                  style={{ borderColor: RING_COLORS[ri], color: "#14304f" }}
                  aria-hidden
                >
                  {ri + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#14304f]">
                  {ring.name}
                </span>
                <span className="text-[11px] text-text-secondary">{ring.nodes.length}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Idle card on the right: what D-Worker is + preset flows to play. */
export function FlowsCard({
  pipeId,
  onRun,
}: {
  pipeId: string | null;
  onRun: (id: string) => void;
}) {
  return (
    <div className="glass rounded-3xl p-5">
      <h2 className="text-[15px] font-bold text-text">What is D-Worker?</h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-text-secondary">{DWORKER.description}</p>

      <h3 className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2b67d1]">
        Watch a flow
      </h3>
      <ul className="space-y-2">
        {PIPELINES.map((p) => {
          const running = pipeId === p.id;
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-pressed={running}
                onClick={() => onRun(p.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                  running
                    ? "border-[#4fa3ff] bg-white/95 shadow-[0_6px_18px_rgba(79,163,255,0.25)]"
                    : "border-white/90 bg-white/70 hover:bg-white/90"
                }`}
              >
                <span
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-white"
                  style={{ background: "linear-gradient(135deg,#4fa3ff,#5a84ff)" }}
                >
                  {running ? <Square size={12} fill="currentColor" aria-hidden /> : <Play size={13} fill="currentColor" aria-hidden />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-[#14304f]">{p.label}</span>
                  <span className="block truncate text-[11px] text-text-secondary">
                    {p.nodes.join(" → ")}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[11.5px] leading-snug text-text-secondary">
        Hover a node to light up what it works with. Click one to zoom in.
      </p>
    </div>
  );
}
