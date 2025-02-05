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

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/programmerbanna/geosnap.git
   cd geosnap
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build and Deploy

1. Create a production build:

   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm start
   # or
   yarn start
   ```

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

## Contributing

I welcome contributions to this project! Here's how you can help:

### Setting up for Development

1. Fork the repository
2. Clone your fork:

   ```bash
   git clone https://github.com/programmerbanna/geosnap.git
   cd geosnap
   ```

3. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development Guidelines

- Follow the existing code style and TypeScript conventions
- Ensure all components are properly typed
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when adding new features

### Making Changes

1. Make your changes
2. Test your changes thoroughly
3. Ensure no TypeScript errors or ESLint warnings
4. Update relevant documentation
5. Add tests if applicable

### Submitting a Pull Request

1. Push to your fork:

   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request from your fork to our main repository
3. Describe your changes in detail:
   - What problem does it solve?
   - What changes have you made?
   - Any breaking changes?
   - Screenshots (if applicable)

### Code Style

- Use TypeScript for all new files
- Follow the existing SCSS module pattern
- Use functional components with hooks
- Maintain component hierarchy:
  - atoms/ (basic components)
  - molecules/ (combinations of atoms)
  - organisms/ (complex components)
  - templates/ (page layouts)

### Need Help?

- Check existing issues and pull requests
- Create an issue for discussion
- Join our community discussions

### Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## License

MIT License

Copyright (c) 2025 Hasanul Haque Banna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
