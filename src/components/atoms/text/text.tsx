import React from 'react';
import styles from './text.module.scss';

type TextSize = 'xs' | 'sm' | 'md' | 'lg';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps {
    size?: TextSize;
    weight?: TextWeight;
    align?: TextAlign;
    color?: string;
    className?: string;
    children: React.ReactNode;
    as?: 'p' | 'span' | 'div';
}

const Text: React.FC<TextProps> = ({
    size = 'md',
    weight = 'normal',
    align = 'left',
    color,
    className,
    children,
    as = 'p',
    ...props
}) => {
    const Component = as;

    return (
        <Component
            className={`${styles.text} ${styles[`text--${size}`]} ${styles[`text--${weight}`]} ${styles[`text--${align}`]} ${className || ''}`}
            style={{ color }}
            {...props}
        >
            {children}
        </Component>
    );
};

export default Text;