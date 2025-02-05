import React from 'react';
import styles from './color-picker.module.scss';

interface ColorPickerProps {
    label: string;
    value: string;
    onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
    return (
        <div className={styles.colorPicker}>
            <label className={styles.colorPicker__label}>
                {label}
                <div className={styles.colorPicker__wrapper}>
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={styles.colorPicker__input}
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={styles.colorPicker__text}
                        pattern="^#[0-9A-Fa-f]{6}$"
                    />
                </div>
            </label>
        </div>
    );
};

export default ColorPicker;