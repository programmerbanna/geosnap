import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import Button from '@/components/atoms/button';
import styles from './data-controls.module.scss';
import { addPolygon } from '@/store/slice/polygon';
import { validatePolygon } from '@/utils/polygon-validation';
import Alert from '@/components/atoms/alert';
import * as turf from '@turf/turf';
import { LatLngBounds } from 'leaflet';
import { Polygon } from '@/types/store';
import L from 'leaflet';

interface DataControlsProps {
    onPolygonsImported?: (bounds: LatLngBounds) => void;
}

const DataControls: React.FC<DataControlsProps> = ({ onPolygonsImported }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const polygons = useSelector((state: RootState) => state.polygons.polygons);
    const [alert, setAlert] = useState<string | null>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(polygons, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'polygons.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedPolygons = JSON.parse(e.target?.result as string);
                    const validPolygons: Polygon[] = [];
                    const allPoints: [number, number][] = [];

                    importedPolygons.forEach((polygon: any, index: number) => {
                        const validation = validatePolygon(polygon, polygons);
                        if (validation.isValid) {
                            const newPolygon: Polygon = {
                                ...polygon,
                                id: `imported-${Date.now()}-${index}`
                            };
                            validPolygons.push(newPolygon);

                            // Collect all points for bounds calculation
                            polygon.coordinates.forEach((coord: [number, number]) => {
                                allPoints.push([coord[0], coord[1]]);
                            });
                        } else {
                            setAlert(validation.message || 'Invalid polygon');
                        }
                    });

                    validPolygons.forEach(polygon => dispatch(addPolygon(polygon)));

                    if (allPoints.length > 0) {
                        const bounds = L.latLngBounds(allPoints);
                        onPolygonsImported?.(bounds);
                    }
                } catch (error) {
                    setAlert('Error importing polygons. Please check file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            {alert && <Alert message={alert} onClose={() => setAlert(null)} />}
            <div className={styles.controls}>
                <Button variant="secondary" size="small" onClick={handleExport}>
                    Export
                </Button>
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                >
                    Import
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                />
            </div>
        </>
    );
};

export default DataControls;