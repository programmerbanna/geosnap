// General application constants
export const APP_NAME = "GeoSnap";
export const DEFAULT_ZOOM = 13;
export const DEFAULT_CENTER: [number, number] = [51.505, -0.09]; // London coordinates

// Map related constants
export const MAP_CONSTANTS = {
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  DEFAULT_ZOOM: 13,
  DEFAULT_CENTER: [51.505, -0.09] as [number, number],
  TILE_LAYER: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: "© OpenStreetMap contributors",
} as const;

// Polygon related constants
export const POLYGON_CONSTANTS = {
  MIN_POINTS: 3,
  DEFAULT_FILL_COLOR: "#3498db",
  DEFAULT_BORDER_COLOR: "#2980b9",
  DEFAULT_FILL_OPACITY: 0.3,
} as const;

// UI related constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: "300px",
  MOBILE_BREAKPOINT: "768px",
  ANIMATION_DURATION: "0.3s",
} as const;
