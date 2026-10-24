"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { pointer, pointerNX, pointerNY } from "./hero/pointerStore";

const INTERACTIVE = "a[href],button,[role='button'],summary,[data-cursor='link']";
const TEXT_FIELD = "input,textarea,select,[contenteditable='true']";

/**
 * Site-wide "gentle breeze" cursor.
 *
 *  - dot (snappy) + ring (springy momentum) + soft light halo
 *  - over links / buttons / checkpoints: the ring grows, the dot shrinks,
 *    and the ring leans toward the element's centre (magnetic feel)
 *  - click: the ring squeezes and a small pulse ripples out
 *  - inside inputs / textareas the native text cursor comes back
 *  - publishes the pointer to the shared store, so particles, clouds and
 *    balloons react to it wherever they appear
 *
 * Disabled (native cursor kept) on touch devices and for reduced motion.
 */
export default function SiteCursor() {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);

  // dot follows the pointer; the ring follows a (possibly magnetised) target
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const ringTx = useMotionValue(-200);
  const ringTy = useMotionValue(-200);

  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.3 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.3 });
  const ringX = useSpring(ringTx, { stiffness: 160, damping: 17, mass: 0.6 });
  const ringY = useSpring(ringTy, { stiffness: 160, damping: 17, mass: 0.6 });
  const haloX = useSpring(x, { stiffness: 60, damping: 20 });
  const haloY = useSpring(y, { stiffness: 60, damping: 20 });

  const [visible, setVisible] = useState(false);
  const [overLink, setOverLink] = useState(false);
  const [overText, setOverText] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("cursor-custom");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;

      x.set(e.clientX);
      y.set(e.clientY);

      const link = target?.closest(INTERACTIVE) ?? null;
      if (link) {
        const r = link.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        ringTx.set(e.clientX + (cx - e.clientX) * 0.3);
        ringTy.set(e.clientY + (cy - e.clientY) * 0.3);
      } else {
        ringTx.set(e.clientX);
        ringTy.set(e.clientY);
      }

      // shared with the hero's particles / balloons and every cloud layer
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      pointerNX.set(e.clientX / window.innerWidth - 0.5);
      pointerNY.set(e.clientY / window.innerHeight - 0.5);

      setVisible(true);
      setOverLink(!!link);
      setOverText(!!target?.closest(TEXT_FIELD));
    };

    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      pointerNX.set(0);
      pointerNY.set(0);
      setVisible(false);
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setPressed(true);
      setPulse((n) => n + 1);
    };
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("cursor-custom");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      onLeave();
    };
  }, [enabled, x, y, ringTx, ringTy]);

  if (!enabled) return null;

  const show = visible && !overText;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      {/* light halo — brightens the clouds under the pointer */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: haloX,
          y: haloY,
          width: 280,
          height: 280,
          marginLeft: -140,
          marginTop: -140,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,243,200,0.22) 40%, transparent 68%)",
          mixBlendMode: "screen",
        }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* click pulse */}
      {pulse > 0 && (
        <motion.div
          key={pulse}
          className="absolute rounded-full border-2"
          style={{
            x: dotX,
            y: dotY,
            width: 30,
            height: 30,
            marginLeft: -15,
            marginTop: -15,
            borderColor: "rgba(79,163,255,0.8)",
          }}
          initial={{ opacity: 0.7, scale: 0.5 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      )}

      {/* outer ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          width: 38,
          height: 38,
          marginLeft: -19,
          marginTop: -19,
          borderColor: "rgba(43,103,209,0.55)",
          backgroundColor: overLink ? "rgba(79,163,255,0.14)" : "transparent",
        }}
        animate={{
          opacity: show ? 1 : 0,
          scale: pressed ? 0.8 : overLink ? 1.55 : 1,
        }}
        transition={{ duration: 0.22 }}
      />

      {/* inner dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          backgroundColor: "#2b67d1",
          boxShadow: "0 0 0 2px rgba(255,255,255,0.9)",
        }}
        animate={{ opacity: show ? 1 : 0, scale: overLink ? 0.5 : 1 }}
        transition={{ duration: 0.18 }}
      />
    </div>
  );
}
