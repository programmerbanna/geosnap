import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import Button from '@/components/atoms/button';
import styles from './data-controls.module.scss';
import { addPolygon } from '@/store/slice/polygon';

const DataControls: React.FC = () => {
    const dispatch = useDispatch();
    const polygons = useSelector((state: RootState) => state.polygons.polygons);

    const handleExport = () => {
        const dataStr = JSON.stringify(polygons);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'polygons.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedPolygons = JSON.parse(e.target?.result as string);
                    importedPolygons.forEach((polygon: any) => {
                        dispatch(addPolygon(polygon));
                    });
                } catch (error) {
                    console.error('Error importing polygons:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className={styles.controls}>
            <Button variant="secondary" onClick={handleExport}>Export</Button>
            <label className={styles.importButton}>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                />
                <Button variant="secondary">Import</Button>
            </label>
        </div>
    );
};

export default DataControls;