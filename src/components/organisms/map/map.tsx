"use client";
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMap, Popup } from 'react-leaflet';
import L, { LatLngTuple, LatLngBounds } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { addPolygon } from '@/store/slice/polygon';
import MapControls from '@/components/molecules/map-controls';
import styles from './map.module.scss';
import { RootState } from '@/store';
import Tooltip from '@/components/atoms/tooltip';
import { MAP_CONSTANTS, POLYGON_CONSTANTS } from '@/config';
import { validatePolygon } from '@/utils/polygon-validation';
import Alert from '@/components/atoms/alert';
// import '@/utils/leaflet-icons';
import DataControls from '@/components/molecules/data-controls';
import { MarkerIcons } from '@/utils/leaflet-icons';
import ColorPicker from '@/components/atoms/color-picker';
import '@/assets/scss/globals.scss';

const DrawingControl: React.FC<{ isDrawing: boolean }> = ({ isDrawing }) => {
    const map = useMap();
    const dispatch = useDispatch();
    const [fillColor, setFillColor] = useState('#3498db');
    const [borderColor, setBorderColor] = useState('#2980b9');
    const [points, setPoints] = useState<LatLngTuple[]>([]);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);

    useEffect(() => {
        if (!map || !isDrawing) return;

        const handleClick = (e: L.LeafletMouseEvent) => {
            const newPoint: LatLngTuple = [e.latlng.lat, e.latlng.lng];
            setPoints(prev => [...prev, newPoint]);
        };

        const handleDoubleClick = () => {
            if (points.length >= POLYGON_CONSTANTS.MIN_POINTS) {
                const validation = validatePolygon(
                    { coordinates: points },
                    polygons
                );

                if (!validation.isValid) {
                    alert(validation.message);
                    setPoints([]);
                    return;
                }

                const newPolygon = {
                    id: `polygon-${Date.now()}`,
                    coordinates: points,
                    fillColor: fillColor,
                    borderColor: borderColor
                };

                dispatch(addPolygon(newPolygon));
                setPoints([]);
            }
        };

        map.on('click', handleClick);
        map.on('dblclick', handleDoubleClick);

        return () => {
            map.off('click', handleClick);
            map.off('dblclick', handleDoubleClick);
        };
    }, [map, isDrawing, points, dispatch, polygons, fillColor, borderColor]);

    // Render temporary polygon while drawing
    return (
        <>
            {isDrawing && points.length > 0 && (
                <div className={styles.drawingControls}>
                    <ColorPicker
                        label="Fill Color"
                        value={fillColor}
                        onChange={setFillColor}
                    />
                    <ColorPicker
                        label="Border Color"
                        value={borderColor}
                        onChange={setBorderColor}
                    />
                </div>
            )}
            {points.length > 0 && (
                <Polygon
                    positions={points}
                    pathOptions={{
                        color: borderColor,
                        fillColor: fillColor,
                        fillOpacity: 0.5
                    }}
                >
                    <Tooltip
                        content={
                            <div>
                                Points: {points.length}
                                {points.length >= POLYGON_CONSTANTS.MIN_POINTS && (
                                    <div>Double click to complete</div>
                                )}
                            </div>
                        }
                        position="center"
                    />
                </Polygon>
            )}
            {points.map((point, index) => (
                <Marker key={index} position={point}>
                    <Tooltip content={`Point ${index + 1}`} position="top">
                        Point {index + 1}
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
};

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [isDrawing, setIsDrawing] = useState(false);
    const [alert, setAlert] = useState<string | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    mapRef.current?.setView([latitude, longitude], MAP_CONSTANTS.DEFAULT_ZOOM);
                },
                () => {
                    showAlert("Location access denied. Using default location.");
                    mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
                }

            );
        } else {
            showAlert("Geolocation is not supported by your browser. Using default location.");
            mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
        }

    }, []);

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

    const showAlert = (message: string) => {
        setAlert(message);
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    mapRef.current?.setView([latitude, longitude], 13);
                },
                () => {
                    showAlert("Please enable location permissions to use this feature");
                    mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
                }
            );
        } else {
            showAlert("Geolocation is not supported by your browser");
            mapRef.current?.setView(MAP_CONSTANTS.DEFAULT_CENTER, MAP_CONSTANTS.DEFAULT_ZOOM);
        }
    };


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

    const getColorName = (hex: string) => {
        const color = hex.replace('#', '');
        return Object.keys(MarkerIcons).find(key => MarkerIcons[key as keyof typeof MarkerIcons].options.iconUrl.includes(color));
    };

    return (
        <div className={`${styles.mapWrapper} ${isDrawing ? styles.drawing : ''}`}>
            {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
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
                            <Popup>
                                Area: {calculateArea(polygon.coordinates)}
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>

            <MapControls
                onZoomIn={() => mapRef.current?.zoomIn()}
                onZoomOut={() => mapRef.current?.zoomOut()}
                onCenter={handleGeolocation}
                onToggleDraw={() => setIsDrawing(!isDrawing)}
                isDrawing={isDrawing}
            />
            <DataControls onPolygonsImported={handlePolygonsImported} />
        </div>
    );
};

export default Map;