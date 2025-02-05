import * as turf from "@turf/turf";
import { Polygon } from "@/types/store";
import { LatLngTuple } from "leaflet";

type ValidateInput = Polygon | { coordinates: LatLngTuple[] };

export const validatePolygon = (
  newPolygon: ValidateInput,
  existingPolygons: Polygon[]
): { isValid: boolean; message?: string } => {
  const coordinates = "coordinates" in newPolygon ? newPolygon.coordinates : [];

  // Convert coordinates to GeoJSON format
  const newPoly = turf.polygon([
    coordinates.map((coord) => [coord[1], coord[0]]),
  ]);

  // Check for self-intersection
  if (!turf.booleanValid(newPoly)) {
    return {
      isValid: false,
      message: "Polygon cannot self-intersect",
    };
  }

  // Check for intersection with existing polygons
  for (const existing of existingPolygons) {
    const existingPoly = turf.polygon([
      existing.coordinates.map((coord) => [coord[1], coord[0]]),
    ]);

    if (turf.booleanOverlap(newPoly, existingPoly)) {
      return {
        isValid: false,
        message: "Polygon cannot overlap with existing polygons",
      };
    }
  }

  return { isValid: true };
};
