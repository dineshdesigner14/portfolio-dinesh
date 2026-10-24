import type { Provenance } from "@/lib/designLab";
import { PROVENANCE } from "./meta";

/** "Built / Operated / Explored / Concept" pill. Text + colour + dot so it never relies on colour alone. */
export function ProvenanceBadge({
  provenance,
  size = "md",
}: {
  provenance: Provenance;
  size?: "sm" | "md";
}) {
  if (provenance === "actor") return null;
  const p = PROVENANCE[provenance];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border bg-white/85 font-semibold text-[#14304f] ${
        size === "sm" ? "px-2 py-0.5 text-[10.5px]" : "px-2.5 py-1 text-[11.5px]"
      }`}
      style={{ borderColor: p.color }}
    >
      <span
        aria-hidden
        className="h-2 w-2 rounded-full"
        style={{ background: p.color, outline: p.dash ? `1.5px dashed ${p.color}` : undefined, outlineOffset: 1 }}
      />
      {p.label}
    </span>
  );
}
