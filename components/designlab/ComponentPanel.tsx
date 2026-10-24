"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { CaseStudy, NodeInfo } from "@/lib/designLab";
import { NODE_ICONS, PROVENANCE } from "./meta";
import { ProvenanceBadge } from "./badges";

type TabKey = keyof NodeInfo;

const TABS: { key: TabKey; label: string }[] = [
  { key: "what", label: "What it does" },
  { key: "scaling", label: "Scaling" },
  { key: "failure", label: "Failure" },
  { key: "tradeoffs", label: "Trade-offs" },
  { key: "reliability", label: "Reliability" },
  { key: "security", label: "Security" },
  { key: "cost", label: "Cost" },
];

/** Details of one component, split into tabs so nothing is a wall of text. */
export default function ComponentPanel({
  study,
  nodeId,
  onClose,
}: {
  study: CaseStudy;
  nodeId: string;
  onClose: () => void;
}) {
  const node = study.nodes.find((n) => n.id === nodeId);
  const info = study.info[nodeId];
  const [tab, setTab] = useState<TabKey>("what");
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!node || !info) return null;
  const Icon = NODE_ICONS[node.icon];
  const prov = PROVENANCE[node.provenance];
  const isActor = node.provenance === "actor";
  const tabs = isActor ? TABS.slice(0, 1) : TABS;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setTab(tabs[next].key);
    refs.current[next]?.focus();
  };

  const value = info[tab];

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl"
          style={{ background: prov.tint, color: prov.color }}
        >
          <Icon size={24} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight text-text">{node.label}</h3>
          <p className="text-[12.5px] text-text-secondary">{node.sub}</p>
          <div className="mt-1.5">
            <ProvenanceBadge provenance={node.provenance} size="sm" />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close component details"
          className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-white/90 bg-white/80 text-[#14304f] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
        >
          <X size={15} aria-hidden />
        </button>
      </div>

      {!isActor && prov.blurb && (
        <p className="mt-3 text-[12px] leading-snug text-text-secondary">{prov.blurb}</p>
      )}

      <div
        role="tablist"
        aria-label={`${node.label} details`}
        className="mt-4 flex gap-1 overflow-x-auto rounded-full border border-white/90 bg-white/60 p-1"
      >
        {tabs.map((t, i) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-tab-${t.key}`}
              aria-selected={active}
              aria-controls={`${base}-panel`}
              tabIndex={active ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => onKey(e, i)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#2b67d1] ${
                active ? "bg-white text-[#14304f] shadow-sm" : "text-text-secondary hover:text-[#14304f]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${tab}`}
        className="mt-4 min-h-[110px] text-[13.5px] leading-relaxed text-[#14304f]"
      >
        {Array.isArray(value) ? (
          value.length === 0 ? (
            <p className="text-text-secondary">No major trade-off to note.</p>
          ) : (
            <ul className="space-y-2">
              {value.map((v) => (
                <li key={v} className="flex gap-2">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[#ff9f68]" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          )
        ) : (
          <p>{value}</p>
        )}
      </div>
    </div>
  );
}
