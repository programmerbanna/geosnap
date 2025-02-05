import { LatLngTuple } from "leaflet";

export interface Polygon {
  id: string;
  coordinates: LatLngTuple[];
  fillColor: string;
  borderColor: string;
  label?: string;
}

export interface PolygonState {
  polygons: Polygon[];
  activePolygonId: string | null;
}
