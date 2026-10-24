import type { ReactNode } from "react";
import { Check } from "lucide-react";
import type { JourneyStage } from "@/lib/journey";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2b67d1]">
        {title}
      </h4>
      {children}
    </section>
  );
}

/** Story, learnings, tools, milestones and "where it showed up" for one stage. */
export default function StageDetail({ stage }: { stage: JourneyStage }) {
  return (
    <div className="space-y-4 text-left">
      <p className="text-[13.5px] leading-relaxed text-text-secondary">{stage.story}</p>

      {stage.learnings.length > 0 && (
        <Block title={stage.learningsLabel ?? "Key learnings"}>
          <ul className="space-y-1.5">
            {stage.learnings.map((l) => (
              <li key={l} className="flex gap-2 text-[13px] leading-snug text-[#14304f]">
                <span
                  aria-hidden
                  className="mt-[3px] flex h-4 w-4 flex-none items-center justify-center rounded-full bg-[#4fa3ff]/20 text-[#2b67d1]"
                >
                  <Check size={10} strokeWidth={3} />
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {stage.tools.length > 0 && (
        <Block title="Tools & services">
          <ul className="flex flex-wrap gap-1.5">
            {stage.tools.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/90 bg-white/75 px-2.5 py-1 text-[11.5px] font-medium text-[#14304f] shadow-[0_2px_8px_rgba(90,132,255,0.08)]"
              >
                {t}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {stage.milestones.length > 0 && (
        <Block title="Milestones">
          <ul className="space-y-1.5">
            {stage.milestones.map((m) => (
              <li key={m} className="flex gap-2 text-[13px] leading-snug text-[#14304f]">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-[#ff9f68]" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Block>
      )}

      {stage.usedAt.length > 0 && (
        <Block title="Where it showed up">
          <ul className="space-y-1">
            {stage.usedAt.map((u) => (
              <li key={u} className="text-[12px] leading-snug text-text-secondary">
                {u}
              </li>
            ))}
          </ul>
        </Block>
      )}
    </div>
  );
}
