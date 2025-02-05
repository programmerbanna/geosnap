# GeoSnap - Interactive Polygon Map Editor

## Overview

GeoSnap is a web application built with Next.js, TypeScript, and React Leaflet that allows users to create, edit, and manage polygons on an interactive map. The application provides advanced features for polygon manipulation, data management, and geolocation support.

## Features

- Interactive map with drawing tools
- Polygon creation and management
- Color customization for polygons
- Area calculation and center markers
- Polygon validation (no overlapping)
- Import/Export polygon data
- Geolocation support
- Search and filter polygons
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Redux Toolkit
- React Leaflet
- Sass/SCSS
- Turf.js for geospatial calculations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## How to Use

### Map Navigation

- **Zoom Controls**:
  - Click (+) to zoom in
  - Click (-) to zoom out
  - Click (⌖) to center map on your location
  - Use mouse wheel for smooth zooming

### Drawing Mode

1. **Start Drawing**:

   - Click the pencil icon (✎) to enter drawing mode
   - Icon turns red (✕) when drawing mode is active

2. **Create Polygon**:

   - Single click to place points on the map
   - Points are connected automatically
   - Minimum 3 points required
   - Double click to complete the polygon
   - Preview shows real-time shape

3. **Customize Colors**:
   - Use color pickers while drawing to set:
     - Fill color
     - Border color
   - Colors can be changed later from the sidebar

### Polygon Management

1. **View Polygons**:

   - All polygons listed in sidebar
   - Shows area and unique ID
   - Hover over center marker for area details

2. **Search Polygons**:

   - Use search bar in sidebar
   - Filter by polygon ID or label
   - Results update in real-time

3. **Edit Polygons**:
   - Change fill/border colors
   - Delete using the trash icon
   - Changes reflect immediately on map

### Data Import/Export

1. **Export Data**:

   - Click "Export" in sidebar
   - Saves as JSON file
   - Includes all polygon data:
     - Coordinates
     - Colors
     - Labels
     - Areas

2. **Import Data**:
   - Click "Import" in sidebar
   - Select JSON file
   - Validates polygon data
   - Shows error if validation fails
   - Map auto-centers on imported polygons

### Validation Rules

- Polygons cannot overlap
- Minimum 3 points required
- Points cannot be inside existing polygons
- Error messages show if validation fails

### Keyboard Shortcuts

- ESC: Cancel current drawing
- Delete: Remove selected polygon
- Space: Toggle sidebar
- Ctrl/Cmd + Z: Undo last point while drawing

### Tips

- Use the center button (⌖) to find your location
- Double-click completes the current polygon
- Export regularly to save your work
- Search works with partial matches
