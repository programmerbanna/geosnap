import * as turf from "@turf/turf";
import { Polygon } from "@/types/store";

export const validatePolygon = (
  newPolygon: Polygon,
  existingPolygons: Polygon[]
): { isValid: boolean; message?: string } => {
  // Convert coordinates to GeoJSON format
  const newPoly = turf.polygon([
    newPolygon.coordinates.map((coord) => [coord[1], coord[0]]),
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
