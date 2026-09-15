"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import {
  DWORKER_RINGS,
  DWORKER_WORKFLOWS,
  DWORKER_TECH_COLOR,
  DWORKER_MODULE_DETAILS,
  DWORKER_SUB_MODULES,
} from "@/lib/data";
import { useCursor } from "@/hooks/useCursor";
import { useCamera } from "@/hooks/useCamera";
import { COLORS } from "./constants";
import { assignRingAngles, livePosition } from "./geometry";
import { easeOutCubic, CAMERA_TRANSITION, childFanTransition } from "./animations";
import CenterHub from "./CenterHub";
import OrbitRing from "./OrbitRing";
import WorkflowConnections from "./WorkflowConnections";

const ICON_MAP: Record<string, keyof typeof Icons> = {
  AWS: "Cloud",
  Azure: "CloudCog",
  "Google Cloud": "CloudLightning",
  Docker: "Container",
  Kubernetes: "CircuitBoard",
  Terraform: "Boxes",
  Helm: "Anchor",
  GitHub: "Github",
  GitLab: "GitBranch",
  Jenkins: "Cog",
  ArgoCD: "GitPullRequest",
  Grafana: "LineChart",
  Prometheus: "Flame",
  ELK: "Search",
  SigNoz: "Activity",
  NGINX: "Network",
  Istio: "Waypoints",
  Traefik: "Route",
  Vault: "Lock",
  Falco: "ShieldAlert",
  Documentation: "FileText",
  Automation: "Zap",
  Projects: "FolderOpen",
};

const VB_W = 1700;
const VB_H = 1500;
const CX = 850;
const CY = 750;
const BASE_RADIUS = 190;
const RADIUS_STEP = 95;
const HUB_SIZE = 98; // ~25% smaller than the previous 130
const GRADIENT_ID = "dworker-connection-gradient";
const RING_STAGGER = (23 * Math.PI) / 180; // stagger each ring's start angle so planets never line up in straight spokes

type Phase = "boot" | "logo" | "zooming" | "live";

function BackgroundParticles({ intensity, maxRadius }: { intensity: number; maxRadius: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => {
        const seed = (i + 1) * 37.13;
        const angle = (seed % 360) * (Math.PI / 180);
        const dist = 80 + ((seed * 13) % (maxRadius + 150));
        return {
          x: CX + Math.cos(angle) * dist,
          y: CY + Math.sin(angle) * dist,
          delay: (seed % 5) * 0.6,
          duration: 6 + (seed % 4),
          r: 1.1 + (i % 3) * 0.5,
        };
      }),
    [maxRadius]
  );

  return (
    <>
      {particles.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={COLORS.accent}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.28 * intensity, 0], cy: [p.y, p.y - 20, p.y] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function EcosystemBackdrop() {
  return (
    <>
      <defs>
        <radialGradient id="dworker-radial-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.13" />
          <stop offset="60%" stopColor="#7C3AED" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>
        <pattern id="dworker-grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1f2937" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="url(#dworker-grid)" opacity={0.3} />
      <rect x={0} y={0} width={VB_W} height={VB_H} fill="url(#dworker-radial-glow)" />
    </>
  );
}

/**
 * A true solar system — no hub-spokes. Six independent orbital rings, each
 * with its own radius and a staggered starting angle (so planets never
 * align into straight spokes from the center). Planets continuously and
 * slowly orbit — inner rings faster, outer rings slower, alternating
 * direction — genuinely traveling around their path rather than sitting
 * static. Only real engineering-workflow relationships (GitHub -> Jenkins
 * -> Docker -> Kubernetes -> AWS, etc.) are drawn as curved connections;
 * everything else is just an orbit. Hover brightens a planet's own
 * workflow links; click flies the camera in and expands its children.
 */
export default function Architecture({ skipIntro = false, onClose }: { skipIntro?: boolean; onClose?: () => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const parallax = useCursor(boxRef, 5);

  const [phase, setPhase] = useState<Phase>(skipIntro ? "live" : "boot");
  const [zoomT, setZoomT] = useState(0);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("zooming"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "zooming") return;
    let raf = 0;
    const start = performance.now();
    const DURATION = 2400;
    function tick(t: number) {
      const el = Math.min(1, (t - start) / DURATION);
      setZoomT(easeOutCubic(el));
      if (el < 1) raf = requestAnimationFrame(tick);
      else setPhase("live");
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const revealAmount = phase === "boot" || phase === "logo" ? 0 : phase === "zooming" ? zoomT : 1;
  const live = phase === "live";

  const ringGeometry = useMemo(
    () =>
      DWORKER_RINGS.map((ring, i) => ({
        ...ring,
        radius: BASE_RADIUS + i * RADIUS_STEP,
        angleOffset: i * RING_STAGGER,
        speed: (i % 2 === 0 ? 1 : -1) * (0.09 - i * 0.011),
        nodes: assignRingAngles(ring.nodes, i * RING_STAGGER),
      })),
    []
  );
  const maxRadius = ringGeometry[ringGeometry.length - 1]?.radius ?? BASE_RADIUS;

  const [rotations, setRotations] = useState<number[]>(() => ringGeometry.map(() => 0));
  const [idle, setIdle] = useState({ x: 0, y: 0 });
  const rotationsRef = useRef(rotations);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    function tick(t: number) {
      const dt = (t - last) / 1000;
      last = t;
      if (live) {
        rotationsRef.current = rotationsRef.current.map((r, i) => r + ringGeometry[i].speed * dt);
        setRotations([...rotationsRef.current]);
        const el = t / 1000;
        setIdle({ x: Math.sin(el * 0.2) * 6, y: Math.cos(el * 0.15) * 5 });
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [live, ringGeometry]);

  function nodeReveal(ringIndex: number, nodeIndex: number, nodeCount: number) {
    const totalRings = DWORKER_RINGS.length;
    const start = 0.03 + (ringIndex / totalRings) * 0.75;
    const end = start + 0.32;
    const t0 = start + (nodeIndex / nodeCount) * (end - start) * 0.6;
    const t1 = t0 + (end - start) * 0.5;
    const local = (revealAmount - t0) / (t1 - t0);
    return easeOutCubic(local);
  }

  const { livePositions, revealByName } = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const reveals: Record<string, number> = {};
    ringGeometry.forEach((ring, ringIndex) => {
      ring.nodes.forEach((node, nodeIndex) => {
        const r = nodeReveal(ringIndex, nodeIndex, ring.nodes.length);
        reveals[node.name] = r;
        positions[node.name] = livePosition(CX, CY, ring.radius, node.baseAngle, rotations[ringIndex] ?? 0, r);
      });
    });
    return { livePositions: positions, revealByName: reveals };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringGeometry, rotations, revealAmount]);

  const findNode = (name: string) => {
    const p = livePositions[name];
    return p ? { name, base: p, angle: 0 } : undefined;
  };
  const { focused, setFocused, toggle, transform: cameraTarget } = useCamera(CX, CY, findNode);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !focused && onClose) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, onClose]);

  const bloomedEnough = live;
  const ringOpacity = 0.08 + revealAmount * 0.3;
  const focusedSpec = focused ? findNode(focused) : undefined;
  const children = focused ? DWORKER_SUB_MODULES[focused] ?? [] : [];
  const focusedDetail = focused ? DWORKER_MODULE_DETAILS[focused] : null;
  const focusedColor = focused ? DWORKER_TECH_COLOR[focused] ?? COLORS.primary : COLORS.primary;
  const activeName = focused ?? hoveredName;

  const introScale = 2.6 - revealAmount * 1.6;
  const camScale = focused ? cameraTarget.scale : introScale;
  const camX = (focused ? cameraTarget.x : 0) + parallax.x + (live && !focused ? idle.x : 0);
  const camY = (focused ? cameraTarget.y : 0) + parallax.y + (live && !focused ? idle.y : 0);

  return (
    <div style={{ height: "100dvh" }} className="relative">
      <div ref={boxRef} className="relative h-full w-full" onClick={() => focused && setFocused(null)}>
        {ringGeometry.map((ring, i) => {
          const ringHasActive = activeName != null && ring.nodes.some((n) => n.name === activeName);
          return (
            <svg
              key={`orbit-${ring.name}`}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              style={{ opacity: focused ? 0.02 : ringOpacity * (ringHasActive ? 1.8 : 1) * (1 - i * 0.05) }}
            >
              <circle
                cx={CX}
                cy={CY}
                r={ring.radius}
                fill="none"
                stroke={ringHasActive ? DWORKER_TECH_COLOR[activeName!] ?? "#38BDF8" : "#1f2937"}
                strokeWidth={ringHasActive ? 1.6 : 1}
                strokeDasharray="3 9"
              />
            </svg>
          );
        })}

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="pointer-events-none absolute inset-0 h-full w-full">
          <EcosystemBackdrop />
        </svg>

        <motion.svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={COLORS.primary} />
              <stop offset="100%" stopColor={COLORS.purple} />
            </linearGradient>
          </defs>

          <motion.g
            animate={{ x: camX, y: camY, scale: camScale }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
            transition={CAMERA_TRANSITION}
          >
            <BackgroundParticles intensity={revealAmount} maxRadius={maxRadius} />

            <WorkflowConnections
              workflows={DWORKER_WORKFLOWS}
              positions={livePositions}
              revealByName={revealByName}
              colorMap={DWORKER_TECH_COLOR}
              activeName={activeName}
              gradientId={GRADIENT_ID}
            />

            {ringGeometry.map((ring, ringIndex) => (
              <OrbitRing
                key={ring.name}
                nodes={ring.nodes}
                cx={CX}
                cy={CY}
                radius={ring.radius}
                rotation={rotations[ringIndex] ?? 0}
                reveal={(nodeIndex) => nodeReveal(ringIndex, nodeIndex, ring.nodes.length)}
                bloomedEnough={bloomedEnough}
                focused={focused}
                onSelect={toggle}
                iconMap={ICON_MAP}
                colorMap={DWORKER_TECH_COLOR}
                magnet={parallax}
                onHover={setHoveredName}
              />
            ))}

            <AnimatePresence>
              {focusedSpec &&
                children.map((child, j) => {
                  const childAngle = (j / children.length) * Math.PI * 2;
                  const r = 165;
                  const cx2 = focusedSpec.base.x + r * Math.cos(childAngle);
                  const cy2 = focusedSpec.base.y + r * Math.sin(childAngle);
                  const labelR = r + 18;
                  const labelX = focusedSpec.base.x + labelR * Math.cos(childAngle);
                  const labelY = focusedSpec.base.y + labelR * Math.sin(childAngle);
                  const pointsRight = Math.cos(childAngle) >= 0;
                  return (
                    <motion.g key={child}>
                      <motion.line
                        x1={focusedSpec.base.x}
                        y1={focusedSpec.base.y}
                        x2={focusedSpec.base.x}
                        y2={focusedSpec.base.y}
                        stroke={focusedColor}
                        strokeWidth={1}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.55, x2: cx2, y2: cy2 }}
                        exit={{ opacity: 0 }}
                        transition={childFanTransition(j)}
                      />
                      <motion.circle
                        r={3}
                        fill={focusedColor}
                        initial={{ opacity: 0, scale: 0.4, cx: focusedSpec.base.x, cy: focusedSpec.base.y }}
                        animate={{ opacity: 1, scale: 1, cx: cx2, cy: cy2 }}
                        exit={{ opacity: 0 }}
                        transition={childFanTransition(j)}
                      />
                      <motion.foreignObject
                        width={120}
                        height={18}
                        initial={{ opacity: 0, x: focusedSpec.base.x, y: focusedSpec.base.y - 9 }}
                        animate={{
                          opacity: 1,
                          x: pointsRight ? labelX : labelX - 120,
                          y: labelY - 9,
                        }}
                        exit={{ opacity: 0 }}
                        transition={childFanTransition(j)}
                      >
                        <div
                          className={`pointer-events-none whitespace-nowrap text-xs font-medium ${
                            pointsRight ? "text-left" : "text-right"
                          }`}
                          style={{ color: focusedColor }}
                        >
                          {child}
                        </div>
                      </motion.foreignObject>
                    </motion.g>
                  );
                })}
            </AnimatePresence>
          </motion.g>
        </motion.svg>

        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            left: "50%",
            top: "50%",
            transform: `translate(calc(-50% + ${camX}px), calc(-50% + ${camY}px)) scale(${camScale})`,
            transformOrigin: "center",
            opacity: focused ? 0.35 : 1,
            transition: "opacity 0.4s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <CenterHub size={HUB_SIZE} glowStrength={phase === "logo" ? 1 : revealAmount} />
          {phase === "logo" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-3 text-xs font-semibold tracking-wide text-[#60A5FA]"
            >
              Engineering. Unified.
            </motion.p>
          )}
        </div>

        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="glass absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full px-5 py-3 text-center"
              style={{ borderColor: `${focusedColor}55` }}
            >
              <p className="mb-1 text-sm font-bold" style={{ color: focusedColor }}>
                {focused}
              </p>
              <p className="mb-2 max-w-xs text-xs text-text-secondary">{focusedDetail?.desc}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFocused(null);
                }}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold text-white"
              >
                ← Back to ecosystem
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {onClose && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="glass absolute left-6 top-6 z-30 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
          >
            ← Back to Portfolio
          </motion.button>
        )}
      </div>
    </div>
  );
}
