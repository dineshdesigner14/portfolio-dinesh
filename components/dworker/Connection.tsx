"use client";

interface ConnectionProps {
  d: string;
  reveal: number;
  isActive: boolean;
  dimmed: boolean;
  color: string;
  gradientId: string;
}

export default function Connection({ d, reveal, isActive, dimmed, color, gradientId }: ConnectionProps) {
  return (
    <path
      d={d}
      fill="none"
      stroke={isActive ? color : `url(#${gradientId})`}
      strokeWidth={isActive ? 2.5 : 1.3}
      pathLength={1}
      strokeDasharray={1}
      style={{
        strokeDashoffset: 1 - reveal,
        opacity: reveal * (dimmed ? 0.06 : isActive ? 0.95 : 0.5),
        filter: isActive ? `drop-shadow(0 0 4px ${color}aa)` : "none",
        transition: "opacity 0.3s ease, filter 0.3s ease, stroke 0.3s ease",
      }}
    />
  );
}
