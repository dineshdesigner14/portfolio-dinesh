import { useEffect, useState } from "react";
import type { RingNodeSpec } from "@/components/dworker/types";

interface CameraResult {
  focused: string | null;
  setFocused: (name: string | null) => void;
  toggle: (name: string) => void;
  transform: { x: number; y: number; scale: number };
}

export function useCamera(cx: number, cy: number, findNode: (name: string) => RingNodeSpec | undefined): CameraResult {
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFocused(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggle(name: string) {
    setFocused((v) => (v === name ? null : name));
  }

  const node = focused ? findNode(focused) : undefined;
  const transform = node
    ? { x: cx - node.base.x, y: cy - node.base.y, scale: 1.9 }
    : { x: 0, y: 0, scale: 1 };

  return { focused, setFocused, toggle, transform };
}
