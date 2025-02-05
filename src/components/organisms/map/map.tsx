"use client";
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip } from 'react-leaflet';
import L, { LatLngTuple, LatLngBounds } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import MapControls from '@/components/molecules/map-controls';
import styles from './map.module.scss';
import { RootState } from '@/store';
import { MAP_CONSTANTS } from '@/config';
import Alert from '@/components/atoms/alert';
import DataControls from '@/components/molecules/data-controls';
import { MarkerIcons } from '@/utils/leaflet-icons';
import { showAlert, clearAlert } from '@/store/slice/alert';
import MapSearch from '@/components/molecules/map-search';
import DrawingControl from '@/components/molecules/drawing-control';

/**
 * Map Component
 *
 * A core component that handles the interactive map display and polygon interactions.
 * Integrates with React Leaflet for map functionality and Redux for state management.
 *
 * Features:
 * - Interactive map with zoom controls
 * - Polygon drawing and visualization
 * - Marker placement at polygon centers
 * - Area calculation and display
 * - Geolocation support
 *
 * @component
 */

const Map: React.FC = () => {
    // Map reference for direct leaflet operations
    const mapRef = useRef<L.Map | null>(null);

    // Redux state management
    const dispatch = useDispatch();
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [isDrawing, setIsDrawing] = useState(false);
    const isSidebarOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const alertMessage = useSelector((state: RootState) => state.alert.message);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    mapRef.current?.setView([latitude, longitude], MAP_CONSTANTS.DEFAULT_ZOOM);
                },
                () => {
                    dispatch(showAlert("Location access denied. Using default location."));
                    mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
                }
            );
        } else {
            dispatch(showAlert("Geolocation is not supported by your browser. Using default location."));
            mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
        }
    }, [dispatch]);

    const calculateCenter = (coords: LatLngTuple[]): LatLngTuple => {
        const poly = turf.polygon([coords.map(coord => [coord[1], coord[0]])]);
        const center = turf.center(poly);
        return [center.geometry.coordinates[1], center.geometry.coordinates[0]];
    };

    const calculateArea = (coordinates: LatLngTuple[]) => {
        const poly = turf.polygon([coordinates.map(coord => [coord[1], coord[0]])]);
        const area = turf.area(poly);
        return area < 10000
            ? `${area.toFixed(2)} m²`
            : `${(area / 1000000).toFixed(2)} km²`;
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    mapRef.current?.setView([latitude, longitude], 13);
                },
                () => {
                    dispatch(showAlert("Please enable location permissions to use this feature"));
                    mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
                }
            );
        } else {
            dispatch(showAlert("Geolocation is not supported by your browser"));
            mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
        }
    };

    /**
     * Handles the import of polygons and adjusts map bounds
     * @param bounds - The LatLngBounds to fit the map view
     */
    const handlePolygonsImported = (bounds: LatLngBounds) => {
        if (mapRef.current) {
            setTimeout(() => {
                mapRef.current?.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 13,
                    animate: true,
                    duration: 1.5
                });
            }, 100);
        }
    };

    /**
     * Extracts color name from hex value for marker icon selection
     * @param hex - Hexadecimal color value
     * @returns The corresponding color name or undefined
     */
    const getColorName = (hex: string) => {
        const color = hex.replace('#', '');
        return Object.keys(MarkerIcons).find(key => MarkerIcons[key as keyof typeof MarkerIcons].options.iconUrl.includes(color));
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom();
            mapRef.current.setZoom(currentZoom + MAP_CONSTANTS.ZOOM_STEP);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom();
            mapRef.current.setZoom(currentZoom - MAP_CONSTANTS.ZOOM_STEP);
        }
    };

    return (
        <div className={`${styles.mapWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''} ${isDrawing ? styles.drawing : ''}`}>
            {alertMessage && (
                <Alert
                    message={alertMessage}
                    onClose={() => dispatch(clearAlert())}
                />
            )}
            <MapContainer
                center={MAP_CONSTANTS.DEFAULT_CENTER}
                zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
                minZoom={MAP_CONSTANTS.MIN_ZOOM}
                maxZoom={MAP_CONSTANTS.MAX_ZOOM}
                className={styles.map}
                ref={mapRef}
                zoomControl={false}
            >
                <TileLayer
                    url={MAP_CONSTANTS.TILE_LAYER}
                    attribution={MAP_CONSTANTS.ATTRIBUTION}
                />
                <MapSearch />
                <DrawingControl isDrawing={isDrawing} />

                {polygons.map((polygon) => (
                    <React.Fragment key={polygon.id}>
                        <Polygon
                            positions={polygon.coordinates}
                            pathOptions={{
                                color: polygon.borderColor,
                                fillColor: polygon.fillColor,
                                fillOpacity: 0.5
                            }}
                        />
                        <Marker
                            position={calculateCenter(polygon.coordinates)}
                            icon={MarkerIcons[getColorName(polygon.fillColor) as keyof typeof MarkerIcons] || MarkerIcons.blue}
                        >
                            <Tooltip permanent={false} direction="top">
                                <div>
                                    <strong>Polygon Details</strong>
                                    <p>Area: {calculateArea(polygon.coordinates)}</p>
                                    <p>Center: {calculateCenter(polygon.coordinates).map(coord => Number(coord).toFixed(4)).join(', ')}</p>
                                </div>
                            </Tooltip>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>

            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onCenter={handleGeolocation}
                onToggleDraw={() => setIsDrawing(!isDrawing)}
                isDrawing={isDrawing}
            />
            <DataControls onPolygonsImported={handlePolygonsImported} />
        </div>
    );
};

export default Map;