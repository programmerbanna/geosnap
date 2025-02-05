import React from 'react';
import styles from './heading.module.scss';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold';

interface HeadingProps {
    level?: HeadingLevel;
    size?: HeadingSize;
    weight?: HeadingWeight;
    children: React.ReactNode;
    className?: string;
    color?: string;
}

const Heading: React.FC<HeadingProps> = ({
    level = 'h2',
    size = 'md',
    weight = 'semibold',
    children,
    className,
    color,
    ...props
}) => {
    const Component = level;

    return (
        <Component
            className={`${styles.heading} ${styles[`heading--${size}`]} ${styles[`heading--${weight}`]} ${className || ''}`}
            style={{ color }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Heading;