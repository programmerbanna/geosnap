import React from 'react';
import './button.module.scss';

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
            className={`button button--${variant} button--${size} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;