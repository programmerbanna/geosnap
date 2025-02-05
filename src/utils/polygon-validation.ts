"use client";
import * as turf from "@turf/turf";
import { Polygon } from "@/types/store";
import { LatLngTuple } from "leaflet";

export const validatePolygon = (
  newPolygon: { coordinates: LatLngTuple[] },
  existingPolygons: Polygon[]
) => {
  // Check minimum points
  if (newPolygon.coordinates.length < 3) {
    return {
      isValid: false,
      message: "Polygon must have at least 3 points",
    };
  }

  // Create turf polygon for new polygon
  const turfPolygon = turf.polygon([
    newPolygon.coordinates.map((coord) => [coord[1], coord[0]]),
  ]);

  // Check for self-intersection
  if (!turf.booleanValid(turfPolygon)) {
    return {
      isValid: false,
      message: "Polygon cannot intersect itself",
    };
  }

  // Check for overlap with existing polygons
  for (const existing of existingPolygons) {
    const existingTurfPolygon = turf.polygon([
      existing.coordinates.map((coord) => [coord[1], coord[0]]),
    ]);

    if (
      turf.booleanOverlap(turfPolygon, existingTurfPolygon) ||
      turf.booleanContains(turfPolygon, existingTurfPolygon) ||
      turf.booleanContains(existingTurfPolygon, turfPolygon)
    ) {
      return {
        isValid: false,
        message: "Polygon cannot overlap with existing polygons",
      };
    }
  }

  return { isValid: true, message: "" };
};
