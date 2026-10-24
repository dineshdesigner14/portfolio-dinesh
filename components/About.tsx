"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Boxes,
  CircuitBoard,
  Cloud,
  Container,
  Infinity as InfinityIcon,
  Terminal,
} from "lucide-react";
import { ABOUT, CERTIFICATIONS, PROFILE, SKILLS } from "@/lib/data";
import { WindProvider } from "./hero/WindProvider";
import CloudLayers from "./hero/CloudLayers";
import FloatingCard from "./ui/FloatingCard";
import SectionHeading from "./ui/SectionHeading";
import ExperienceList from "./about/ExperienceList";

const SKILL_ICONS: Record<string, LucideIcon> = {
  Cloud,
  Container,
  Infinity: InfinityIcon,
  LineChart: Activity,
};

const CERT_ICONS: Record<string, LucideIcon> = {
  Cloud,
  Boxes,
  CircuitBoard,
  Container,
  Terminal,
};

/** soft pastel tile colours, one per skill card */
const TILE: [string, string][] = [
  ["#9fd8ff", "#4fa3ff"],
  ["#dcceff", "#9a83e6"],
  ["#ffe3a8", "#ff9f68"],
  ["#bfe7ff", "#5a84ff"],
];

/** Sky wash + sun glow behind the About section; clouds are layered on top. */
function AboutBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #fff8f2 0%, #eaf6ff 14%, #dff0ff 42%, #ebe5ff 70%, #fff3e6 92%, #fff8f2 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 88% 18%, rgba(255,227,168,0.45) 0%, transparent 42%), radial-gradient(ellipse at 8% 58%, rgba(199,182,255,0.32) 0%, transparent 46%)",
        }}
      />
    </div>
  );
}

export default function About() {
  return (
    <WindProvider>
      <section
        id="about"
        aria-label="About"
        className="relative isolate overflow-hidden px-5 py-28 sm:px-8 sm:py-36"
      >
        <AboutBackdrop />
        <CloudLayers layer="back" />
        <CloudLayers layer="front" />

        <div className="relative z-30 mx-auto max-w-6xl">
          {/* ---------- intro ---------- */}
          <div className="grid items-start gap-12 lg:grid-cols-[320px_1fr] lg:gap-16">
            <FloatingCard
              className="mx-auto w-full max-w-[320px] pb-6"
              surfaceClassName="glass relative rounded-[2rem] p-3"
              amp={9}
              duration={8.5}
            >
              <Image
                src={PROFILE.photo}
                alt={PROFILE.name}
                width={320}
                height={320}
                priority={false}
                className="aspect-square w-full rounded-[1.5rem] object-cover"
              />
              <span className="absolute inset-x-6 -bottom-4 rounded-full border border-white/90 bg-white/90 px-4 py-2 text-center text-[12px] font-semibold text-[#14304f] shadow-[0_8px_24px_rgba(79,163,255,0.22)] backdrop-blur-md">
                Cloud &amp; DevOps Engineer
              </span>
            </FloatingCard>

            <div>
              <SectionHeading eyebrow="About me" title={ABOUT.greeting} />

              <FloatingCard
                surfaceClassName="glass relative rounded-3xl p-6 sm:p-8"
                amp={6}
                duration={9}
                delay={0.1}
              >
                <div className="space-y-4 text-[15px] leading-relaxed text-text-secondary">
                  {ABOUT.story.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </FloatingCard>
            </div>
          </div>

          {/* ---------- core skills ---------- */}
          <div className="mt-24">
            <SectionHeading
              eyebrow="Core skills"
              title="The tools I build with"
              subtitle="A stack chosen for speed, reliability and scale."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SKILLS.map((skill, i) => {
                const Icon = SKILL_ICONS[skill.icon] ?? Cloud;
                const [c1, c2] = TILE[i % TILE.length];
                return (
                  <FloatingCard
                    key={skill.category}
                    delay={0.08 * i}
                    amp={6 + (i % 3) * 2}
                    duration={7 + i * 0.8}
                  >
                    <span
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_8px_18px_rgba(90,132,255,0.28)]"
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    >
                      <Icon size={24} aria-hidden />
                    </span>
                    <h3 className="mb-3 text-[17px] font-bold text-text">{skill.category}</h3>
                    <ul className="flex flex-wrap gap-2">
                      {skill.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-white/90 bg-white/70 px-3 py-1 text-[12px] font-medium text-[#14304f]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </FloatingCard>
                );
              })}
            </div>
          </div>

          {/* ---------- experience + certifications ---------- */}
          <div className="mt-24 grid gap-14 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Experience" title="Where I've been building" size="md" />
              <ExperienceList />
            </div>

            <div>
              <SectionHeading
                eyebrow="Certifications"
                title="Next on the climb"
                subtitle="No certifications yet — this is the one I'm preparing for."
                size="md"
              />
              <div className="grid gap-4">
                {CERTIFICATIONS.map((cert, i) => {
                  const Icon = CERT_ICONS[cert.icon] ?? Award;
                  const [c1, c2] = TILE[i % TILE.length];
                  return (
                    <FloatingCard
                      key={cert.name}
                      surfaceClassName="glass relative flex h-full items-center gap-4 rounded-2xl p-4"
                      className="h-full"
                      delay={0.07 * i}
                      amp={5}
                      duration={7.5 + i * 0.7}
                    >
                      <span
                        className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-white"
                        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                      >
                        <Icon size={20} aria-hidden />
                      </span>
                      <span className="leading-snug">
                        <span className="block text-[13px] font-semibold text-text">{cert.name}</span>
                        <span className="mt-1 inline-flex rounded-full bg-[#ffe3a8]/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#8a5a12]">
                          {cert.year}
                        </span>
                      </span>
                    </FloatingCard>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </WindProvider>
  );
}
