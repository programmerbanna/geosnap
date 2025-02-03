import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Marker, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { addPolygon } from '@/store/slice/polygon';
import MapControls from '@/components/molecules/map-controls';
import styles from './map.module.scss';
import { RootState } from '@/store';
import Tooltip from '@/components/atoms/tooltip';

const DrawingControl: React.FC<{ isDrawing: boolean }> = ({ isDrawing }) => {
    const map = useMap();
    const dispatch = useDispatch();
    const [points, setPoints] = useState<LatLngTuple[]>([]);

    useEffect(() => {
        if (!map || !isDrawing) return;

        const handleClick = (e: L.LeafletMouseEvent) => {
            const newPoint: LatLngTuple = [e.latlng.lat, e.latlng.lng];
            setPoints(prev => [...prev, newPoint]);
        };

        const handleDoubleClick = () => {
            if (points.length >= 3) {
                const newPolygon = {
                    id: Date.now().toString(),
                    coordinates: points,
                    fillColor: '#3498db',
                    borderColor: '#2980b9'
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
    }, [map, isDrawing, points, dispatch]);

    // Render temporary polygon while drawing
    return points.length > 0 ? (
        <Polygon
            positions={points}
            pathOptions={{
                color: '#3498db',
                fillColor: '#3498db',
                fillOpacity: 0.3
            }}
        />
    ) : null;
};

const Map: React.FC = () => {
    const mapRef = useRef<L.Map | null>(null);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [isDrawing, setIsDrawing] = useState(false);

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
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                mapRef.current?.setView([latitude, longitude], 13);
            }, (error) => {
                console.error("Error getting location:", error);
            });
        }
    };

    return (
        <div className={styles.mapWrapper}>
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                className={styles.map}
                ref={mapRef}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
                        <Tooltip content={`Area: ${calculateArea(polygon.coordinates)}`}>
                            <Marker position={calculateCenter(polygon.coordinates)} />
                        </Tooltip>
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
        </div>
    );
};

export default Map;