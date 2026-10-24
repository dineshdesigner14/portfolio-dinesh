"use client";

import { RotateCcw } from "lucide-react";
import { DWORKER_MODULE_DETAILS, DWORKER_RINGS, DWORKER_SUB_MODULES } from "@/lib/data";
import { NEIGHBORS, NODE_INDEX, RING_COLORS, TECH_ICONS, techColor } from "./layout";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
      {children}
    </h4>
  );
}

/** Description, tools, connections and modules for one technology. */
export function DetailBody({
  name,
  onPick,
}: {
  name: string;
  onPick: (name: string) => void;
}) {
  const detail = DWORKER_MODULE_DETAILS[name];
  const neighbors = NEIGHBORS[name] ?? [];
  const subs = DWORKER_SUB_MODULES[name] ?? [];

  return (
    <div className="space-y-4 text-left">
      {detail && <p className="text-[13.5px] leading-relaxed text-text-secondary">{detail.desc}</p>}

      {detail && detail.tech.length > 0 && (
        <section>
          <Label>Covers</Label>
          <ul className="flex flex-wrap gap-1.5">
            {detail.tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/90 bg-white/75 px-2.5 py-1 text-[11.5px] font-medium text-[#14304f]"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {neighbors.length > 0 && (
        <section>
          <Label>Works with</Label>
          <ul className="flex flex-wrap gap-1.5">
            {neighbors.map((n) => {
              const Icon = TECH_ICONS[n];
              return (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => onPick(n)}
                    className="flex items-center gap-1.5 rounded-full border border-white/90 bg-white/80 py-1 pl-1.5 pr-2.5 text-[11.5px] font-semibold text-[#14304f] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
                  >
                    {Icon && (
                      <span style={{ color: techColor(n) }}>
                        <Icon size={13} aria-hidden />
                      </span>
                    )}
                    {n}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {subs.length > 0 && (
        <section>
          <Label>Inside {name}</Label>
          <ul className="flex flex-wrap gap-1.5">
            {subs.map((s) => (
              <li
                key={s}
                className="rounded-full bg-[#4fa3ff]/12 px-2.5 py-1 text-[11px] font-medium text-[#2b67d1]"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/** Glass card shown on the right while a node is selected. */
export default function DetailCard({
  name,
  onPick,
  onClose,
}: {
  name: string;
  onPick: (name: string) => void;
  onClose: () => void;
}) {
  const Icon = TECH_ICONS[name];
  const color = techColor(name);
  const slot = NODE_INDEX[name];
  const ringName = slot ? DWORKER_RINGS[slot.ring].name : "";
  const ringColor = slot ? RING_COLORS[slot.ring] : "#4fa3ff";

  return (
    <div className="glass rounded-3xl p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl"
          style={{ background: `${color}22`, color }}
        >
          {Icon && <Icon size={24} aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold leading-tight text-text">{name}</h3>
          <span
            className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{ background: `${ringColor}22`, color: "#14304f" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ringColor }} aria-hidden />
            {ringName}
          </span>
        </div>
      </div>

      <div data-lenis-prevent className="mt-4 max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
        <DetailBody name={name} onPick={onPick} />
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/90 bg-white/80 py-2 text-[13px] font-semibold text-[#14304f] outline-none transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#2b67d1]"
      >
        <RotateCcw size={14} aria-hidden />
        Back to the garden
      </button>
    </div>
  );
}
