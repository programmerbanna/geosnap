import React, { useState } from 'react';
import styles from './tooltip.module.scss';

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={styles.tooltipWrapper}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`${styles.tooltip} ${styles[`tooltip--${position}`]}`}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;