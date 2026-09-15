import { useEffect, useRef, useState } from "react";
import { clamp01 } from "@/components/dworker/constants";

export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  const targetProgress = useRef(0);
  const smoothedProgress = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    function computeTarget() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollable = Math.max(rect.height - vh, 1);
      const raw = -rect.top / scrollable;
      targetProgress.current = clamp01(raw);
    }

    function onScroll() {
      computeTarget();
    }

    computeTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    function tick() {
      const diff = targetProgress.current - smoothedProgress.current;
      smoothedProgress.current += diff * 0.09;
      if (Math.abs(diff) < 0.0002) smoothedProgress.current = targetProgress.current;
      setProgress(smoothedProgress.current);
      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [ref]);

  return progress;
}
