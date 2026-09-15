"use client";

import { clamp01 } from "./constants";

interface OrbitNodeProps {
  label: string;
  Icon: any;
  reveal: number;
  isActive: boolean;
  dimmed: boolean;
  color: string;
}

export default function OrbitNode({ label, Icon, reveal, isActive, dimmed, color }: OrbitNodeProps) {
  const scale = 0.35 + reveal * 0.65;
  const opacity = reveal * (dimmed ? 0.16 : 1);
  const labelOpacity = clamp01((reveal - 0.5) * 2) * (dimmed ? 0.1 : 1);

  return (
    <foreignObject x={-64} y={-30} width={128} height={92} style={{ overflow: "visible" }}>
      <div
        className="flex h-full w-full flex-col items-center justify-start"
        style={{ pointerEvents: reveal > 0.9 ? "auto" : "none" }}
      >
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{
            transform: `scale(${scale})`,
            opacity,
            background: isActive ? `radial-gradient(circle, ${color}33 0%, transparent 70%)` : "transparent",
            transition: "filter 0.3s ease, background 0.3s ease",
          }}
        >
          <Icon
            size={26}
            style={{
              color: isActive ? color : "#94A3B8",
              filter: isActive ? `drop-shadow(0 0 10px ${color}99)` : "none",
              transition: "color 0.3s ease, filter 0.3s ease",
            }}
          />
        </div>
        <div
          className="mt-2 whitespace-nowrap text-center text-[11px] font-semibold"
          style={{ opacity: labelOpacity, color: isActive ? color : "#F8FAFC", transition: "opacity 0.2s ease, color 0.3s ease" }}
        >
          {label}
        </div>
      </div>
    </foreignObject>
  );
}
