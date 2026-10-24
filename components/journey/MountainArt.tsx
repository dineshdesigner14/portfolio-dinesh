import { WORLD_H, WORLD_W } from "./path";

/* silhouette points, bottom-left → peak → bottom-right */
const LEFT =
  "-80 2200 L -20 2040 L 60 1930 L 40 1800 L 130 1690 L 110 1560 L 200 1450 L 180 1320 L 260 1210 L 240 1070 L 300 960 L 280 830 L 330 720 L 320 590 L 370 470 L 410 350 L 480 230 L 560 112";
const RIGHT =
  "640 235 L 710 350 L 750 470 L 790 590 L 780 720 L 830 830 L 820 960 L 880 1070 L 870 1210 L 950 1320 L 930 1450 L 1010 1560 L 990 1690 L 1060 1800 L 1050 1930 L 1120 2040 L 1180 2200";
/* centre ridge, peak → base */
const RIDGE = "545 300 L 575 520 L 535 760 L 580 1000 L 545 1260 L 590 1540 L 550 1860 L 565 2200";
const RIDGE_UP = "565 2200 L 550 1860 L 590 1540 L 545 1260 L 580 1000 L 535 760 L 575 520 L 545 300";

const SNOW =
  "M 560 112 L 640 235 L 710 350 L 690 372 L 668 345 L 640 392 L 612 360 L 585 418 L 556 372 L 528 430 L 500 380 L 472 440 L 440 392 L 410 350 L 480 230 Z";

/** [x, y, scale] — pines scattered along the flanks */
const PINES: [number, number, number][] = [
  [90, 1900, 1.5],
  [170, 1760, 1.3],
  [70, 1640, 1.6],
  [150, 1500, 1.2],
  [230, 1360, 1.3],
  [200, 1180, 1.1],
  [290, 1010, 1.2],
  [980, 1950, 1.5],
  [900, 1790, 1.3],
  [1000, 1650, 1.6],
  [920, 1500, 1.2],
  [860, 1340, 1.3],
  [840, 1140, 1.1],
  [790, 960, 1.2],
  [330, 1760, 1.0],
  [800, 1630, 1.0],
  [260, 1540, 0.9],
];

interface MountainArtProps {
  className?: string;
  preserveAspectRatio?: string;
}

/** The mountain: layered faces, snow cap, rim light, ridge lines and pines. */
export default function MountainArt({
  className = "absolute inset-0 h-full w-full",
  preserveAspectRatio = "xMidYMid meet",
}: MountainArtProps) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
    >
      <defs>
        <linearGradient id="ma-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d6e0ff" />
          <stop offset="0.55" stopColor="#b9c6f6" />
          <stop offset="1" stopColor="#cdbff2" />
        </linearGradient>
        <linearGradient id="ma-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3b3ee" />
          <stop offset="0.55" stopColor="#8f93dc" />
          <stop offset="1" stopColor="#a99be0" />
        </linearGradient>
        <linearGradient id="ma-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e4efff" />
        </linearGradient>
        <g id="ma-pine">
          <polygon points="0,-36 11,-14 5,-14 15,8 -15,8 -5,-14 -11,-14" />
          <rect x="-2" y="8" width="4" height="7" />
        </g>
      </defs>

      {/* faces */}
      <path d={`M ${LEFT} L 560 112 L ${RIDGE} Z`} fill="url(#ma-left)" />
      <path d={`M 560 112 L ${RIGHT} L ${RIDGE_UP} Z`} fill="url(#ma-right)" />

      {/* ridge lines for texture */}
      <g fill="none" stroke="#fff" strokeLinecap="round">
        <path d="M 560 112 L 520 380 L 556 600" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M 540 700 L 470 960 L 500 1220" strokeOpacity="0.22" strokeWidth="2" />
        <path d="M 600 760 L 690 1010 L 660 1300" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M 520 1300 L 420 1560 L 460 1860" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M 600 1500 L 700 1740 L 680 2000" strokeOpacity="0.18" strokeWidth="2" />
      </g>

      {/* snow */}
      <path d={SNOW} fill="url(#ma-snow)" opacity="0.96" />
      <path d="M 560 112 L 556 372 L 528 430 L 500 380 L 472 440 L 440 392 L 410 350 L 480 230 Z" fill="#dfe9ff" opacity="0.5" />

      {/* warm rim light on the sunny (left) edge */}
      <path d={`M ${LEFT}`} fill="none" stroke="#ffe3a8" strokeOpacity="0.7" strokeWidth="3" strokeLinejoin="round" />

      {/* pines */}
      <g fill="#7f9cd6" opacity="0.55">
        {PINES.map(([x, y, s], i) => (
          <use key={i} href="#ma-pine" transform={`translate(${x} ${y}) scale(${s})`} />
        ))}
      </g>
    </svg>
  );
}
