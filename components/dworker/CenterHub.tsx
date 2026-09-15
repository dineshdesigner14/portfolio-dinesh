"use client";

import Image from "next/image";

interface CenterHubProps {
  size: number;
  glowStrength: number; // 0..1
}
 
export default function CenterHub({ size, glowStrength }: CenterHubProps) {
  return (
    <div
className="z-10 flex flex-col items-center justify-center rounded-full border-[3px] border-[#7C3AED] bg-white p-3"      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${18 + glowStrength * 40}px rgba(124,58,237,${0.3 + glowStrength * 0.45})`,
        transition: "box-shadow 0.2s ease",
      }}
    >
      <div className="relative h-[75%] w-[75%]">
        <Image src="/dworker-favicon.png" alt="D-Worker" fill className="object-contain" priority />
      </div>
    </div>
  );
}
