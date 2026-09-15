"use client";

interface DataPacketProps {
  path: string;
  isActive: boolean;
  index: number;
  extra?: boolean;
  color: string;
}

export default function DataPacket({ path, isActive, index, extra, color }: DataPacketProps) {
  const dur = (isActive ? 1.0 : 2.6) + (index % 4) * 0.3;
  return (
    <>
      <circle r={isActive ? 4 : 2.8} fill={color}>
        <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${index * 0.12}s`} path={path} />
      </circle>
      {extra && (
        <circle r={3} fill={color} opacity={0.7}>
          <animateMotion dur={`${dur}s`} repeatCount="indefinite" begin={`${index * 0.12 + dur / 2}s`} path={path} />
        </circle>
      )}
    </>
  );
}
