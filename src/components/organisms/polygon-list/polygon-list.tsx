"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updatePolygon, deletePolygon } from '@/store/slice/polygon';
import Button from '@/components/atoms/button';
import ColorPicker from '@/components/atoms/color-picker';
import * as turf from '@turf/turf';

import styles from './polygon-list.module.scss';
import { LatLngTuple } from 'leaflet';
import Text from '@/components/atoms/text';
import Heading from '@/components/atoms/heading';

import dynamic from 'next/dynamic';
import { toggleSidebar } from '@/store/slice/sidebar';

const DataControls = dynamic(() => import('@/components/molecules/data-controls'), { ssr: false });


const PolygonList: React.FC = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [searchTerm, setSearchTerm] = useState('');

    const hasPolygons = polygons.length > 0;

    const calculateArea = (coordinates: LatLngTuple[]) => {
        const poly = turf.polygon([coordinates.map(coord => [coord[1], coord[0]])]);
        const area = turf.area(poly);
        return area < 10000
            ? `${area.toFixed(2)} m²`
            : `${(area / 1000000).toFixed(2)} km²`;
    };

    const calculateCenter = (coordinates: LatLngTuple[]) => {
        const poly = turf.polygon([coordinates.map(coord => [coord[1], coord[0]])]);
        const center = turf.center(poly);
        return [center.geometry.coordinates[0], center.geometry.coordinates[1]];
    };

    const filteredPolygons = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return polygons.filter(polygon => {
            const area = calculateArea(polygon.coordinates);
            const center = calculateCenter(polygon.coordinates);
            const location = `${center[0].toFixed(4)},${center[1].toFixed(4)}`;

            return polygon.id.toLowerCase().includes(searchLower) ||
                area.toLowerCase().includes(searchLower) ||
                location.includes(searchLower);
        });
    }, [polygons, searchTerm]);

    const handleColorChange = (id: string, type: 'fillColor' | 'borderColor', color: string) => {
        const polygon = polygons.find(p => p.id === id);
        if (polygon) {
            dispatch(updatePolygon({
                ...polygon,
                [type]: color
            }));
        }
    };

    const handleDelete = (id: string) => {
        dispatch(deletePolygon(id));
    };

    return (
        <div className={`${styles.container} ${!isOpen ? styles.collapsed : ''}`}>
            <button
                className={styles.toggleButton}
                onClick={() => dispatch(toggleSidebar())}
                aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isOpen ? '→' : '←'}
            </button>
            <div className={styles.content}>
                {hasPolygons ? (
                    <div className={styles.header}>
                        <Heading level="h2" size="xl">
                            Polygons
                        </Heading>
                        <input
                            type="text"
                            placeholder="Search polygons..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        <DataControls />
                        <div className={styles.list}>
                            {filteredPolygons.map((polygon) => (
                                <div key={polygon.id} className={styles.polygonItem}>
                                    <div className={styles.polygonItem__header}>
                                        <Text size="md" weight="medium" className={styles.polygonItem__title}>
                                            {polygon.label || `Polygon ${polygon.id.slice(0, 8)}`}
                                        </Text>
                                        <Text size="sm" className={styles.polygonItem__area}>
                                            Area: {calculateArea(polygon.coordinates)}
                                        </Text>
                                    </div>
                                    <div className={styles.polygonItem__colors}>
                                        <div className={styles.colorPickerWrapper}>
                                            <ColorPicker
                                                label="Fill Color"
                                                value={polygon.fillColor}
                                                onChange={(color) => handleColorChange(polygon.id, 'fillColor', color)}
                                            />
                                        </div>
                                        <div className={styles.colorPickerWrapper}>
                                            <ColorPicker
                                                label="Border Color"
                                                value={polygon.borderColor}
                                                onChange={(color) => handleColorChange(polygon.id, 'borderColor', color)}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.polygonItem__actions}>
                                        <Button
                                            variant="error"
                                            size="small"
                                            onClick={() => handleDelete(polygon.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <Heading level="h2" size="xl">
                            Draw or Import Polygons
                        </Heading>
                        <Text size="md" className={styles.emptyStateText}>
                            Start by drawing a polygon on the map or import existing data using the controls below.
                        </Text>
                        <DataControls />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PolygonList;