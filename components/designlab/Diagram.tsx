"use client";

import { useMemo } from "react";
import type { KeyboardEvent } from "react";
import { useReducedMotion } from "framer-motion";
import type { CaseStudy, DiagramNode } from "@/lib/designLab";
import { NODE_ICONS, PROVENANCE, ZONE_STYLE, dims, edgeGeometry } from "./meta";
import styles from "./designlab.module.css";

interface DiagramProps {
  study: CaseStudy;
  selected: string | null;
  onSelect: (id: string) => void;
  /** components / links lit by the flow that is playing */
  litNodes: string[];
  litEdges: string[];
  /** components / links knocked out by the failure scenario */
  brokenNodes: string[];
  brokenEdges: string[];
  /** components the troubleshooting walkthrough is pointing at */
  highlight: string[];
}

const COLORS = { idle: "#9db4d9", lit: "#4fa3ff", broken: "#e0524f" };

/**
 * Architecture diagram as inline SVG: crisp at any size, light, and every
 * component is a real keyboard-focusable button.
 */
export default function Diagram({
  study,
  selected,
  onSelect,
  litNodes,
  litEdges,
  brokenNodes,
  brokenEdges,
  highlight,
}: DiagramProps) {
  const reduced = useReducedMotion();
  const uid = study.id;
  const byId = useMemo(
    () => Object.fromEntries(study.nodes.map((n) => [n.id, n])) as Record<string, DiagramNode>,
    [study]
  );
  const geos = useMemo(
    () =>
      study.edges.map((e) => ({
        e,
        g: edgeGeometry(byId[e.from], byId[e.to], e.bend ?? 0.1),
      })),
    [study, byId]
  );
  const anyLit = litNodes.length > 0 || litEdges.length > 0;

  const onKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${study.viewBox.w} ${study.viewBox.h}`}
      role="group"
      aria-label={`${study.title}: architecture diagram. Select a component to read about it.`}
      className="block h-auto w-full"
    >
      <defs>
        <filter id={`shadow-${uid}`} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#5a84ff" floodOpacity="0.16" />
        </filter>
        {(["idle", "lit", "broken"] as const).map((k) => (
          <marker
            key={k}
            id={`arrow-${k}-${uid}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS[k]} />
          </marker>
        ))}
      </defs>

      {/* zones */}
      {study.zones.map((z) => {
        const s = ZONE_STYLE[z.tone];
        return (
          <g key={z.id} aria-hidden>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={22} fill={s.fill} stroke={s.stroke} strokeDasharray="6 6" />
            <text
              x={z.x + 14}
              y={z.y + 24}
              fontSize={10.5}
              fontWeight={700}
              letterSpacing="0.14em"
              fill="#4a6280"
              style={{ textTransform: "uppercase" }}
            >
              {z.label}
            </text>
          </g>
        );
      })}

      {/* links */}
      <g>
        {geos.map(({ e, g }) => {
          const broken =
            brokenEdges.includes(e.id) || brokenNodes.includes(e.from) || brokenNodes.includes(e.to);
          const lit = !broken && litEdges.includes(e.id);
          const state = broken ? "broken" : lit ? "lit" : "idle";
          const prov = e.provenance && e.provenance !== "built" ? PROVENANCE[e.provenance] : null;
          const stroke = state === "idle" ? prov?.color ?? COLORS.idle : COLORS[state];
          const dash =
            state === "broken"
              ? "5 5"
              : prov?.dash ?? (e.kind === "control" ? "6 5" : e.kind === "data" ? "2 5" : undefined);
          return (
            <g key={e.id} aria-hidden>
              <path
                d={g.d}
                fill="none"
                stroke={stroke}
                strokeWidth={state === "lit" ? 3 : 1.8}
                strokeDasharray={state === "lit" ? undefined : dash}
                strokeLinecap="round"
                markerEnd={`url(#arrow-${state}-${uid})`}
                opacity={anyLit && state !== "lit" ? 0.3 : 0.9}
                className={styles.edgeIdle}
              />
              {lit && !reduced && (
                <>
                  <path d={g.d} fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" className={styles.march} opacity={0.9} />
                  <circle r={4.5} fill="#ffc98c" stroke="#fff" strokeWidth={1.6}>
                    <animateMotion dur="1.8s" repeatCount="indefinite" path={g.d} />
                  </circle>
                </>
              )}
              {broken && (
                <g transform={`translate(${g.mid.x} ${g.mid.y})`}>
                  <circle r={9} fill="#fff" stroke="#e0524f" strokeWidth={1.6} />
                  <path d="M -3.5 -3.5 L 3.5 3.5 M 3.5 -3.5 L -3.5 3.5" stroke="#e0524f" strokeWidth={2} strokeLinecap="round" />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* components */}
      {study.nodes.map((n) => {
        const { w, h } = dims(n);
        const left = n.x - w / 2;
        const top = n.y - h / 2;
        const prov = PROVENANCE[n.provenance];
        const Icon = NODE_ICONS[n.icon];
        const lit = litNodes.includes(n.id);
        const broken = brokenNodes.includes(n.id);
        const hl = highlight.includes(n.id);
        const sel = selected === n.id;
        const dim = anyLit && !lit && !sel;
        const stroke = broken ? COLORS.broken : lit ? COLORS.lit : prov.color;
        const label = `${n.label}, ${n.provenance === "actor" ? "not a platform component" : prov.label}. ${n.sub}.${
          broken ? " Not working in this failure scenario." : ""
        }`;

        return (
          <g
            key={n.id}
            role="button"
            tabIndex={0}
            aria-pressed={sel}
            aria-label={label}
            onClick={() => onSelect(n.id)}
            onKeyDown={(e) => onKey(e, n.id)}
            className={styles.node}
            style={{ opacity: dim ? 0.5 : 1 }}
          >
            {hl && (
              <rect
                x={left - 7}
                y={top - 7}
                width={w + 14}
                height={h + 14}
                rx={22}
                fill="rgba(255,227,168,0.55)"
                stroke="#e8a93c"
                strokeWidth={2}
                className={reduced ? undefined : styles.halo}
              />
            )}
            {lit && (
              <rect x={left - 4} y={top - 4} width={w + 8} height={h + 8} rx={20} fill="rgba(79,163,255,0.18)" />
            )}
            <rect
              x={left - 5}
              y={top - 5}
              width={w + 10}
              height={h + 10}
              rx={21}
              fill="none"
              stroke="#2b67d1"
              strokeWidth={3}
              className={styles.focusRing}
            />
            <rect
              x={left}
              y={top}
              width={w}
              height={h}
              rx={16}
              fill={broken ? "rgba(255,127,127,0.22)" : "rgba(255,255,255,0.92)"}
              stroke={stroke}
              strokeWidth={sel ? 3.4 : 2}
              strokeDasharray={prov.dash}
              filter={`url(#shadow-${uid})`}
              className={styles.nodeBody}
            />
            <circle cx={left + 27} cy={n.y} r={17} fill={prov.tint} />
            <Icon x={left + 16} y={n.y - 11} size={22} color={broken ? COLORS.broken : prov.color} strokeWidth={2.2} />
            <text x={left + 50} y={n.y - 3} fontSize={12.5} fontWeight={700} fill="#14304f">
              {n.label}
            </text>
            <text x={left + 50} y={n.y + 14} fontSize={10.5} fill="#4a6280">
              {n.sub}
            </text>

            {n.provenance !== "actor" && (
              <g transform={`translate(${left + w - prov.badgeW - 8} ${top - 9})`}>
                <rect width={prov.badgeW} height={17} rx={8.5} fill="#fff" stroke={prov.color} strokeWidth={1.4} />
                <text x={prov.badgeW / 2} y={12} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#14304f">
                  {prov.label}
                </text>
              </g>
            )}

            {broken && (
              <g transform={`translate(${left + 4} ${top + 2})`}>
                <circle r={9} fill="#e0524f" />
                <path d="M -3.2 -3.2 L 3.2 3.2 M 3.2 -3.2 L -3.2 3.2" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      })}

      {/* names of the links that are lit right now */}
      {geos.map(({ e, g }) => {
        if (!litEdges.includes(e.id)) return null;
        const w = e.label.length * 5.7 + 18;
        return (
          <g key={`label-${e.id}`} transform={`translate(${g.mid.x} ${g.mid.y})`} aria-hidden className={styles.fadeIn}>
            <rect x={-w / 2} y={-11} width={w} height={22} rx={11} fill="#fff" stroke="#4fa3ff" strokeWidth={1.2} />
            <text textAnchor="middle" y={4} fontSize={10.5} fontWeight={600} fill="#14304f">
              {e.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
