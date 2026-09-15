"use client";

import { useEffect, useRef } from "react";

/**
 * Apple-style scroll-driven image sequence, adapted from the standalone
 * vanilla-JS version into a React client component so it can live inside
 * the actual page and coexist with the site's Lenis smooth-scroll setup.
 *
 * Frames are expected at: /sequence/images/ezgif-frame-001.jpg ...
 * Update TOTAL_FRAMES below to match however many frames you actually have.
 */

const TOTAL_FRAMES = 50; // <-- change this to match your real frame count
const FRAME_PATH = "/sequence/images/";
const FRAME_PREFIX = "ezgif-frame-";
const FRAME_EXT = ".jpg";
const BATCH_SIZE = 10;
const CANVAS_NATIVE_WIDTH = 1920;
const CANVAS_NATIVE_HEIGHT = 1080;

const PANEL_CONTENT = [
  {
    heading: "The Modern Engineering Workspace",
    text: "D-Worker brings Cloud Infrastructure, Kubernetes, Terraform, CI/CD, Monitoring, and Automation into one unified engineering platform.",
    side: "left",
  },
  {
    heading: "Built for DevOps Engineers",
    text: "Manage infrastructure, deployments, observability, and automation from a single workspace designed for modern cloud teams.",
    side: "right",
  },
  {
    heading: "Engineering Without Complexity",
    text: "From provisioning cloud resources to monitoring production systems, D-Worker simplifies complex engineering workflows through an intuitive interface.",
    side: "left",
  },
  {
    heading: "Currently Building D-Worker",
    text: "A next-generation engineering operating system focused on reliability, scalability, automation, and developer productivity.",
    side: "right",
  },
];

const PANEL_RANGES = [
  { start: 0.06, peak: 0.16, end: 0.26 },
  { start: 0.32, peak: 0.42, end: 0.52 },
  { start: 0.56, peak: 0.66, end: 0.76 },
  { start: 0.8, peak: 0.88, end: 0.97 },
];

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_NATIVE_WIDTH;
    canvas.height = CANVAS_NATIVE_HEIGHT;

    const requestIdle =
      (window as any).requestIdleCallback ||
      function (cb: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void) {
        const start = Date.now();
        return setTimeout(() => {
          cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
          });
        }, 1);
      };

    function frameFileName(index: number) {
      const num = String(index).padStart(3, "0");
      return FRAME_PATH + FRAME_PREFIX + num + FRAME_EXT;
    }

    const frames: (HTMLImageElement | undefined)[] = new Array(TOTAL_FRAMES + 1);
    const frameLoaded: boolean[] = new Array(TOTAL_FRAMES + 1).fill(false);

    let lastDrawnFrameIndex = -1;
    let currentScrollY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;
    let destroyed = false;

    function drawFrame(index: number) {
      const img = frames[index];
      if (!img || !frameLoaded[index] || !ctx) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(img, 0, 0, canvas!.width, canvas!.height);
      lastDrawnFrameIndex = index;
    }

    function loadFrame(index: number, onDone: () => void) {
      if (index < 1 || index > TOTAL_FRAMES || frameLoaded[index]) {
        onDone();
        return;
      }
      const img = new Image();
      img.onload = () => {
        frameLoaded[index] = true;
        onDone();
      };
      img.onerror = () => onDone();
      img.src = frameFileName(index);
      frames[index] = img;
    }

    function loadBatch(startIndex: number) {
      if (destroyed || startIndex > TOTAL_FRAMES) return;
      const endIndex = Math.min(startIndex + BATCH_SIZE - 1, TOTAL_FRAMES);
      let remaining = endIndex - startIndex + 1;

      for (let i = startIndex; i <= endIndex; i++) {
        loadFrame(i, () => {
          remaining--;
          if (remaining <= 0) {
            requestIdle(() => loadBatch(endIndex + 1));
          }
        });
      }
    }

    function initialLoad() {
      loadFrame(1, () => {
        drawFrame(1);
        requestIdle(() => loadBatch(2));
      });
    }

    function getScrollProgress() {
      const containerHeight = container!.offsetHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = containerHeight - viewportHeight;
      if (maxScroll <= 0) return 0;
      const progress = currentScrollY / maxScroll;
      return Math.min(1, Math.max(0, progress));
    }

    function progressToFrameIndex(progress: number) {
      const raw = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;
      return Math.min(TOTAL_FRAMES, Math.max(1, raw));
    }

    function nearestLoadedFrame(targetIndex: number) {
      if (frameLoaded[targetIndex]) return targetIndex;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const below = targetIndex - offset;
        const above = targetIndex + offset;
        if (below >= 1 && frameLoaded[below]) return below;
        if (above <= TOTAL_FRAMES && frameLoaded[above]) return above;
      }
      return lastDrawnFrameIndex > 0 ? lastDrawnFrameIndex : 1;
    }

    function computePanelOpacity(progress: number, range: { start: number; peak: number; end: number }) {
      if (progress <= range.start || progress >= range.end) return 0;
      if (progress <= range.peak) {
        return (progress - range.start) / (range.peak - range.start);
      }
      return 1 - (progress - range.peak) / (range.end - range.peak);
    }

    function updatePanels(progress: number) {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const range = PANEL_RANGES[i];
        const opacity = Math.min(1, Math.max(0, computePanelOpacity(progress, range)));
        const translateY = 40 - opacity * 40;
        panel.style.opacity = opacity.toFixed(3);
        panel.style.pointerEvents = opacity > 0.05 ? "auto" : "none";

        const isRight = panel.dataset.side === "right";
        const isNarrow = window.innerWidth <= 900;
        if (isRight || isNarrow) {
          panel.style.transform = isNarrow
            ? `translate(-50%, calc(-50% + ${translateY}px))`
            : `translate(0, calc(-50% + ${translateY}px))`;
        } else {
          panel.style.transform = `translate(0, calc(-50% + ${translateY}px))`;
        }
      });
    }

    function updateScrollHint(progress: number) {
      if (hintRef.current) {
        hintRef.current.style.opacity = progress > 0.03 ? "0" : "1";
      }
    }

    function renderTick() {
      ticking = false;
      const progress = getScrollProgress();
      const targetIndex = progressToFrameIndex(progress);

      if (targetIndex !== lastDrawnFrameIndex) {
        const availableIndex = nearestLoadedFrame(targetIndex);
        drawFrame(availableIndex);
      }

      updatePanels(progress);
      updateScrollHint(progress);
    }

    function onScroll() {
      currentScrollY = window.scrollY || window.pageYOffset || 0;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderTick);
      }
    }

    function onResize() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(renderTick);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    initialLoad();
    requestAnimationFrame(renderTick);

    return () => {
      destroyed = true;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-sequence-container">
      <div className="scroll-sequence-sticky">
        <canvas ref={canvasRef} className="scroll-sequence-canvas" />

        {PANEL_CONTENT.map((panel, i) => (
          <div
            key={panel.heading}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            data-side={panel.side}
            className={`scroll-sequence-panel scroll-sequence-panel--${panel.side}`}
          >
            <h2>{panel.heading}</h2>
            <p>{panel.text}</p>
          </div>
        ))}

        <div ref={hintRef} className="scroll-sequence-hint">
          Scroll
        </div>
      </div>

      <style jsx>{`
        .scroll-sequence-container {
          position: relative;
          width: 100%;
          height: 800vh;
          background: #000000;
        }

        .scroll-sequence-sticky {
          position: sticky;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000000;
        }

        .scroll-sequence-canvas {
          width: 100vw;
          height: 100vh;
          display: block;
          object-fit: cover;
          background: #000000;
        }

        .scroll-sequence-panel {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, calc(-50% + 40px));
          width: min(560px, 86vw);
          padding: 40px 44px;
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(22px) saturate(140%);
          -webkit-backdrop-filter: blur(22px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 24px;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.02), 0 20px 60px rgba(0, 0, 0, 0.55),
            0 0 80px rgba(64, 156, 255, 0.12);
          opacity: 0;
          pointer-events: none;
          will-change: opacity, transform;
        }

        .scroll-sequence-panel--left {
          left: 12%;
          transform: translate(0, calc(-50% + 40px));
        }

        .scroll-sequence-panel--right {
          left: auto;
          right: 12%;
          transform: translate(0, calc(-50% + 40px));
        }

        .scroll-sequence-panel :global(h2) {
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 16px;
          background: linear-gradient(180deg, #ffffff 0%, #d6e6ff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .scroll-sequence-panel :global(p) {
          font-size: clamp(0.95rem, 1.3vw, 1.08rem);
          line-height: 1.6;
          color: rgba(245, 245, 247, 0.72);
          font-weight: 400;
          max-width: 46ch;
        }

        .scroll-sequence-hint {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245, 245, 247, 0.4);
          opacity: 1;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        @media (max-width: 900px) {
          .scroll-sequence-panel--left,
          .scroll-sequence-panel--right {
            left: 50%;
            right: auto;
            transform: translate(-50%, calc(-50% + 40px));
            width: 88vw;
          }
        }
      `}</style>
    </div>
  );
}