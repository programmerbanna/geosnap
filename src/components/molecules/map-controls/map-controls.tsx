import React from 'react';
import Button from '@/components/atoms/button';
import styles from './map-controls.module.scss';

interface MapControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onCenter: () => void;
    onToggleDraw: () => void;
    isDrawing: boolean;
}

const MapControls: React.FC<MapControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onCenter,
    onToggleDraw,
    isDrawing
}) => {
    return (
        <div className={styles.controls}>
            <Button variant="primary" size="small" onClick={onZoomIn}>+</Button>
            <Button variant="primary" size="small" onClick={onZoomOut}>-</Button>
            <Button variant="secondary" size="small" onClick={onCenter}>⌖</Button>
            <Button
                variant={isDrawing ? "error" : "primary"}
                size="small"
                onClick={onToggleDraw}
            >
                {isDrawing ? '✕' : '✎'}
            </Button>
        </div>
    );
};

export default MapControls;