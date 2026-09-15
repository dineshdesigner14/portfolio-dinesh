export interface Point {
  x: number;
  y: number;
}

export interface EcosystemColors {
  bg: string;
  primary: string;
  accent: string;
  purple: string;
}

export interface RingNodeSpec {
  name: string;
  base: Point;
  angle: number;
}
