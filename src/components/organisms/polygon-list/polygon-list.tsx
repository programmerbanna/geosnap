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


const PolygonList: React.FC = () => {
    const dispatch = useDispatch();
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPolygons = useMemo(() => {
        return polygons.filter(polygon =>
            polygon.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [polygons, searchTerm]);

    const calculateArea = (coordinates: LatLngTuple[]) => {
        const poly = turf.polygon([coordinates.map(coord => [coord[1], coord[0]] as [number, number])]);
        const area = turf.area(poly);
        return area < 10000
            ? `${area.toFixed(2)} m²`
            : `${(area / 1000000).toFixed(2)} km²`;
    };

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Polygons</h2>
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
                            <span className={styles.polygonItem__title}>
                                Area: {calculateArea(polygon.coordinates)}
                            </span>
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