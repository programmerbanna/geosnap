import React from 'react';
import './input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}


const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className={`input-wrapper ${className || ''}`}>
            {label && <label className="input-label">{label}</label>}
            <input className={`input ${error ? 'input--error' : ''}`} {...props} />
            {error && <span className="input-error">{error}</span>}
        </div>
    );
};

export default Input;