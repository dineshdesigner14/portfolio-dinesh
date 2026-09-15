"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface WindState {
  gustX: number;
  gustY: number;
  intensity: number; // 0 to 1, useful for scaling secondary effects
}

const defaultWind: WindState = { gustX: 0, gustY: 0, intensity: 0 };

const WindContext = createContext<WindState>(defaultWind);

export function useWind() {
  return useContext(WindContext);
}

interface WindProviderProps {
  children: ReactNode;
  minInterval?: number; // ms
  maxInterval?: number; // ms
  gustDuration?: number; // ms
}

export function WindProvider({
  children,
  minInterval = 4000,
  maxInterval = 8000,
  gustDuration = 1400,
}: WindProviderProps) {
  const [wind, setWind] = useState<WindState>(defaultWind);

  useEffect(() => {
    let gustTimeout: ReturnType<typeof setTimeout>;
    let scheduleTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    function scheduleNextGust() {
      const delay = minInterval + Math.random() * (maxInterval - minInterval);
      scheduleTimeout = setTimeout(() => {
        if (cancelled) return;

        const direction = Math.random() > 0.5 ? 1 : -1;
        const strength = 4 + Math.random() * 6; // 4 to 10 px range
        const intensity = strength / 10;

        setWind({
          gustX: strength * direction,
          gustY: strength * 0.25 * direction,
          intensity,
        });

        gustTimeout = setTimeout(() => {
          if (cancelled) return;
          setWind(defaultWind);
          scheduleNextGust();
        }, gustDuration);
      }, delay);
    }

    scheduleNextGust();

    return () => {
      cancelled = true;
      clearTimeout(gustTimeout);
      clearTimeout(scheduleTimeout);
    };
  }, [minInterval, maxInterval, gustDuration]);

  return <WindContext.Provider value={wind}>{children}</WindContext.Provider>;
}