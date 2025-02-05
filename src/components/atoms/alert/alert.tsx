import React, { useState, useEffect } from 'react';
import styles from './alert.module.scss';

interface AlertProps {
    message: string;
    duration?: number;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className={styles.alert}>
            {message}
        </div>
    );
};

export default Alert;