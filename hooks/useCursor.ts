import { useEffect, useRef, useState } from "react";

export function useCursor(containerRef: React.RefObject<HTMLElement | null>, maxOffset = 4) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      target.current = {
        x: Math.max(-1, Math.min(1, relX)) * maxOffset,
        y: Math.max(-1, Math.min(1, relY)) * maxOffset,
      };
    }

    function tick() {
      setOffset((prev) => ({
        x: prev.x + (target.current.x - prev.x) * 0.06,
        y: prev.y + (target.current.y - prev.y) * 0.06,
      }));
      raf.current = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, [containerRef, maxOffset]);

  return offset;
}
