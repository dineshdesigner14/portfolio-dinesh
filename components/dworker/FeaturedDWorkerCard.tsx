"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { DWORKER } from "@/lib/data";
import FloatingCard from "../ui/FloatingCard";

const CAPABILITIES = [
  "Build Infrastructure.",
  "Automate Workflows.",
  "Manage Kubernetes.",
  "Monitor Everything.",
];

const TAGS = ["AWS", "Kubernetes", "Terraform", "Docker", "Platform Engineering"];

/**
 * Featured D-Worker card in "Selected Work".
 * "Explore D-Worker" opens the full /dworker ecosystem page.
 */
export default function FeaturedDWorkerCard() {
  return (
    <FloatingCard
      className="mx-auto mb-12 max-w-3xl"
      surfaceClassName="glass relative overflow-hidden rounded-3xl p-8 text-center sm:p-10"
      amp={6}
      duration={9}
    >
      {/* soft sunrise glow behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,227,168,0.6) 0%, transparent 70%)" }}
      />

      <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-white/90 bg-white/80 px-4 py-1 text-xs font-bold text-[#0f7a5c]">
        <span className="relative flex h-2 w-2" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        {DWORKER.status}
      </span>

      <h3 className="relative mb-2 text-3xl font-extrabold text-text">D-Worker</h3>
      <p className="relative mb-6 font-medium text-[#2b67d1]">{DWORKER.tagline}</p>

      <div className="relative mb-6 space-y-1">
        {CAPABILITIES.map((line) => (
          <p key={line} className="text-sm font-medium text-text-secondary">
            {line}
          </p>
        ))}
      </div>

      <ul className="relative mb-8 flex flex-wrap justify-center gap-2">
        {TAGS.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-white/90 bg-white/80 px-3 py-1 text-xs font-semibold text-[#14304f]"
          >
            {tag}
          </li>
        ))}
      </ul>

      <Link
        href="/dworker"
        className="relative mx-auto inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(79,163,255,0.42)] outline-none transition-shadow hover:shadow-[0_12px_34px_rgba(79,163,255,0.6)] focus-visible:ring-2 focus-visible:ring-[#2b67d1] focus-visible:ring-offset-4"
        style={{ backgroundImage: "linear-gradient(135deg, #4fa3ff, #5a84ff)" }}
      >
        <Rocket size={16} aria-hidden />
        Explore D-Worker
      </Link>
    </FloatingCard>
  );
}
