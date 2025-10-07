
export interface Position {
  azimuth: number; // 0-360 degrees, 0 = North, 90 = East
  altitude: number; // 0-90 degrees, 0 = horizon
}

export interface PanelPosition {
  azimuth: number; // 0-360 degrees, orientation
  tilt: number; // 0-90 degrees from horizontal
}

export interface VoltageDataPoint {
  time: number;
  voltage: number;
}

export interface GeminiAdvice {
  analysis: string;
  recommendation: string;
  funFact: string;
}
