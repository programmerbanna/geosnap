import React from 'react';
import styles from './color-picker.module.scss';


interface ColorPickerProps {
    label?: string;
    value: string;
    onChange: (color: string) => void;
    className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, className }) => {
    return (
        <div className={`${styles['color-picker']} ${className || ''}`}>
            {label && <label className={styles['color-picker__label']}>{label}</label>}
            <div className={styles['color-picker__input-wrapper']}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles['color-picker__input']}
                />
                <span className={styles['color-picker__value']}>{value}</span>
            </div>
        </div>
    );
};

export default ColorPicker;