"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import JourneyScene from "./journey/JourneyScene";
import JourneyList from "./journey/JourneyList";

/**
 * Engineering Ascent.
 *  - wide screens: pinned scroll scene — the camera follows the mountain,
 *    the climber walks the trail, every checkpoint is clickable.
 *  - phones / tablets / reduced motion: vertical trail of expandable stages.
 *
 * The #journey wrapper stays mounted so nav links and scroll-spy keep working.
 */
export default function Journey() {
  const reduced = useReducedMotion();
  const [wide, setWide] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div id="journey">
      {wide === null ? (
        <div aria-hidden className="min-h-screen" />
      ) : wide && !reduced ? (
        <JourneyScene />
      ) : (
        <JourneyList />
      )}
    </div>
  );
}
