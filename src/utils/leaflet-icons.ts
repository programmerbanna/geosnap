"use client";
import L from "leaflet";

// Fix marker icons
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;

const createIcon = (color: string) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export const MarkerIcons = {
  blue: createIcon("blue"),
  red: createIcon("red"),
  green: createIcon("green"),
  orange: createIcon("orange"),
  yellow: createIcon("yellow"),
  violet: createIcon("violet"),
  grey: createIcon("grey"),
  black: createIcon("black"),
};

// Set default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png`,
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png`,
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
});
