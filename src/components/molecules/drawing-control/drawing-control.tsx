import React, { useEffect, useState, useCallback } from 'react';
import { useMap } from 'react-leaflet';
import { Polygon, Marker, Tooltip } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import * as turf from '@turf/turf';
import { RootState } from '@/store';
import { addPolygon } from '@/store/slice/polygon';
import { showAlert } from '@/store/slice/alert';
import { POLYGON_CONSTANTS } from '@/config';
import { validatePolygon } from '@/utils/polygon-validation';
import ColorPicker from '@/components/atoms/color-picker';
import { Polygon as PolygonType } from '@/types/store';
import styles from './drawing-control.module.scss';

/**
 * DrawingControl Component
 *
 * Manages polygon drawing interactions on the map surface.
 * Handles point placement, validation, and polygon creation.
 *
 * Features:
 * - Point-by-point polygon drawing
 * - Real-time preview of polygon shape
 * - Intersection validation
 * - Color customization before creation
 *
 * @component
 * @param {DrawingControlProps} props - Component properties
 */

interface DrawingControlProps {
    /** Controls whether drawing mode is active */
    isDrawing: boolean;
}

/**
 * Validates and processes polygon drawing operations
 * Prevents invalid polygon creation and handles user interactions
 */
const DrawingControl: React.FC<DrawingControlProps> = ({ isDrawing }) => {
    const map = useMap();
    const dispatch = useDispatch();
    const [fillColor, setFillColor] = useState('#3498db');
    const [borderColor, setBorderColor] = useState('#2980b9');
    const [points, setPoints] = useState<LatLngTuple[]>([]);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);

    const isPointInAnyPolygon = useCallback((point: LatLngTuple, existingPolygons: PolygonType[]) => {
        const pt = turf.point([point[1], point[0]]);
        return existingPolygons.some(polygon => {
            const poly = turf.polygon([polygon.coordinates.map(coord => [coord[1], coord[0]])]);
            return turf.booleanPointInPolygon(pt, poly);
        });
    }, []);

    /**
     * Handles map click events for point placement
     * Validates point position and updates drawing state
     * @param {L.LeafletMouseEvent} e - Click event
     */
    const handleClick = useCallback((e: L.LeafletMouseEvent) => {
        const target = e.originalEvent.target as HTMLElement;
        if (target.closest('.drawingControls')) return;

        const newPoint: LatLngTuple = [e.latlng.lat, e.latlng.lng];
        if (isPointInAnyPolygon(newPoint, polygons)) {
            dispatch(showAlert("Cannot place markers inside existing polygons"));
            return;
        }
        setPoints(prev => [...prev, newPoint]);
    }, [dispatch, isPointInAnyPolygon, polygons]);

    const handleDoubleClick = useCallback(() => {
        if (points.length >= POLYGON_CONSTANTS.MIN_POINTS) {
            const closedPoints = [...points];
            if (points[0][0] !== points[points.length - 1][0] ||
                points[0][1] !== points[points.length - 1][1]) {
                closedPoints.push(points[0]);
            }

            const validation = validatePolygon({ coordinates: closedPoints }, polygons);
            if (!validation.isValid) {
                dispatch(showAlert(validation.message));
                setPoints([]);
                return;
            }

            dispatch(addPolygon({
                id: `polygon-${Date.now()}`,
                coordinates: closedPoints,
                fillColor,
                borderColor
            }));
            setPoints([]);
        }
    }, [points, polygons, dispatch, fillColor, borderColor]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isDrawing && points.length > 0 && (e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            setPoints(prev => prev.slice(0, -1));
        }
    }, [isDrawing, points.length]);

    useEffect(() => {
        if (isDrawing) {
            window.addEventListener('keydown', handleKeyDown);
            map.on('click', handleClick);
            map.on('dblclick', handleDoubleClick);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            map.off('click', handleClick);
            map.off('dblclick', handleDoubleClick);
        };
    }, [isDrawing, map, handleClick, handleDoubleClick, handleKeyDown]);

    return (
        <>
            {isDrawing && points.length > 0 && (
                <div className={`${styles.drawingControls} drawingControls`}>
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
                    <Tooltip>
                        <div>
                            Points: {points.length}
                            {points.length >= POLYGON_CONSTANTS.MIN_POINTS && (
                                <div>Double click to complete</div>
                            )}
                        </div>
                    </Tooltip>
                </Polygon>
            )}
            {points.map((point, index) => (
                <Marker key={index} position={point}>
                    <Tooltip position={[point[0], point[1]]}>
                        Point {index + 1}
                    </Tooltip>
                </Marker>
            ))}
        </>
    );
};

export default DrawingControl;