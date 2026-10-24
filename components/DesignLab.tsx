"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { ALL_CASES as CASE_STUDIES } from "@/lib/cases";
import type { Provenance } from "@/lib/designLab";
import { WindProvider } from "./hero/WindProvider";
import CloudLayers from "./hero/CloudLayers";
import SectionHeading from "./ui/SectionHeading";
import CaseStudyView from "./designlab/CaseStudyView";
import { ProvenanceBadge } from "./designlab/badges";
import { PROVENANCE } from "./designlab/meta";

const LEGEND: Provenance[] = ["built", "operated", "explored", "concept"];

/**
 * System Design Lab & Engineering Case Studies.
 * Interactive architectures, flows, failure scenarios and a troubleshooting walkthrough,
 * with every component labelled as built / operated / explored / concept.
 */
export default function DesignLab() {
  const [activeId, setActiveId] = useState(CASE_STUDIES[0].id);
  const active = CASE_STUDIES.find((c) => c.id === activeId) ?? CASE_STUDIES[0];

  return (
    <WindProvider>
      <section
        id="design-lab"
        aria-label="System Design Lab"
        className="relative isolate overflow-hidden px-5 py-28 sm:px-8 sm:py-36"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "linear-gradient(180deg,#fff8f2 0%,#eaf6ff 12%,#e4f1ff 40%,#efe9ff 72%,#fff3e6 94%,#fff8f2 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 12% 20%, rgba(199,182,255,0.3) 0%, transparent 42%), radial-gradient(ellipse at 90% 60%, rgba(255,227,168,0.38) 0%, transparent 44%)",
          }}
        />
        <CloudLayers layer="back" />

        <div className="relative z-30 mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Design Lab"
            title="System Design Lab & Engineering Case Studies"
            subtitle="Interactive architectures, the reasoning behind them, and how I troubleshoot when they break."
          />

          {/* the honesty legend */}
          <div className="glass mb-10 rounded-3xl p-5">
            <p className="flex items-start gap-2 text-[13px] leading-snug text-[#14304f]">
              <Info size={16} className="mt-0.5 flex-none text-[#2b67d1]" aria-hidden />
              Every component is labelled so you can tell what I built from what is a design exercise. Nothing here
              claims a production result or a metric.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {LEGEND.map((k) => (
                <li key={k} className="rounded-2xl border border-white/90 bg-white/60 p-3">
                  <ProvenanceBadge provenance={k} size="sm" />
                  <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">{PROVENANCE[k].blurb}</p>
                </li>
              ))}
            </ul>
          </div>

          {CASE_STUDIES.length > 1 && (
            <div role="tablist" aria-label="Case studies" className="mb-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {CASE_STUDIES.map((c, i) => {
                const on = c.id === active.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActiveId(c.id)}
                    className={`rounded-3xl border p-4 text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                      on
                        ? "border-[#4fa3ff] bg-white shadow-[0_10px_30px_rgba(79,163,255,0.25)]"
                        : "border-white/90 bg-white/60 hover:bg-white/85"
                    }`}
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
                      Case study {i + 1}
                    </span>
                    <span className="mt-1 block text-[14px] font-bold leading-snug text-text">{c.short}</span>
                    <span className="mt-0.5 block text-[12px] text-text-secondary">
                      {c.kind === "implemented" ? "Implemented system" : "Conceptual design"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <CaseStudyView key={active.id} study={active} />
        </div>
      </section>
    </WindProvider>
  );
}
