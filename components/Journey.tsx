"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { JOURNEY } from "@/lib/data";

const WIDTH = 1200;
const HEIGHT = 420;
const MARGIN = 70;

function buildPoints(count: number) {
  const points: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = MARGIN + ((WIDTH - 2 * MARGIN) * i) / (count - 1);
    const amplitude = i === 0 || i === count - 1 ? 40 : 100;
    const y = HEIGHT / 2 + (i % 2 === 0 ? amplitude : -amplitude);
    points.push([x, y]);
  }
  return points;
}

function buildPath(points: [number, number][]) {
  let d = `M ${points[0][0]},${points[0][1]} `;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += `C ${cx},${y0} ${cx},${y1} ${x1},${y1} `;
  }
  return d.trim();
}

export default function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const vehicleRef = useRef<SVGGElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const points = buildPoints(JOURNEY.length);
  const d = buildPath(points);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const drawProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  useMotionValueEvent(drawProgress, "change", (v) => {
    if (!pathRef.current || !pathLength) return;
    const clamped = Math.max(0, Math.min(1, v));
    const point = pathRef.current.getPointAtLength(clamped * pathLength);
    if (vehicleRef.current) {
      vehicleRef.current.setAttribute("transform", `translate(${point.x}, ${point.y})`);
    }
    setActiveIndex(Math.round(clamped * (JOURNEY.length - 1)));
  });

  return (
    <section id="journey" ref={sectionRef} className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2 text-3xl font-bold"
        >
          Engineering Journey
        </motion.h2>
        <p className="mb-12 text-text-secondary">
          The path that led from curiosity to building D-Worker.
        </p>

        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="mx-auto min-w-[900px]"
            style={{ overflow: "visible" }}
          >
            {/* base track */}
            <path d={d} fill="none" stroke="#1f2937" strokeWidth={20} strokeLinecap="round" />

            {/* animated drawn portion */}
            <motion.path
              ref={pathRef}
              d={d}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={20}
              strokeLinecap="round"
              style={{
                pathLength: drawProgress,
              }}
            />

            {/* dashed center line */}
            <path
              d={d}
              fill="none"
              stroke="white"
              strokeOpacity={0.5}
              strokeWidth={2}
              strokeDasharray="10 12"
              strokeLinecap="round"
            />

            {/* milestones */}
            {points.map(([x, y], i) => {
              const isDone = i <= activeIndex;
              return (
                <g key={JOURNEY[i]} transform={`translate(${x}, ${y})`}>
                  <circle
                    r={22}
                    fill={isDone ? "#0f172a" : "#111827"}
                    stroke={isDone ? "#3b82f6" : "#374151"}
                    strokeWidth={4}
                    style={{ transition: "stroke 0.3s ease, fill 0.3s ease" }}
                  />
                  <text
                    x={0}
                    y={46}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={600}
                    fill={isDone ? "#f8fafc" : "#64748b"}
                  >
                    {JOURNEY[i]}
                  </text>
                </g>
              );
            })}

            {/* vehicle marker */}
            <g ref={vehicleRef}>
              <circle r={10} fill="#f59e0b" stroke="#111827" strokeWidth={3} />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
