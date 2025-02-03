import React from 'react';
import styles from './button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'error';
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    className,
    ...props
}) => {
    return (
        <button
            className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;