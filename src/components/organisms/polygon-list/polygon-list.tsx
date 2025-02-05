import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updatePolygon, deletePolygon } from '@/store/slice/polygon';
import Button from '@/components/atoms/button';
import ColorPicker from '@/components/atoms/color-picker';
import * as turf from '@turf/turf';
import styles from './polygon-list.module.scss';
import { LatLngTuple } from 'leaflet';
import DataControls from '@/components/molecules/data-controls';
import Text from '@/components/atoms/text';
import Heading from '@/components/atoms/heading';


const PolygonList: React.FC = () => {
    const dispatch = useDispatch();
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleLabelChange = (id: string, label: string) => {
        const polygon = polygons.find(p => p.id === id);
        if (polygon) {
            dispatch(updatePolygon({
                ...polygon,
                label
            }));
        }
    };

    return (
        <div className={styles.container}>
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
            </div>
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
                            <ColorPicker
                                label="Fill Color"
                                value={polygon.fillColor}
                                onChange={(color) => handleColorChange(polygon.id, 'fillColor', color)}
                            />
                            <ColorPicker
                                label="Border Color"
                                value={polygon.borderColor}
                                onChange={(color) => handleColorChange(polygon.id, 'borderColor', color)}
                            />
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
    );
};

export default PolygonList;