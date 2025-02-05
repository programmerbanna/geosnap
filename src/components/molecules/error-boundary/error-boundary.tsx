"use client";
import React, { Component, ErrorInfo } from 'react';
import styles from './error-boundary.module.scss';
import Heading from '@/components/atoms/heading';
import Text from '@/components/atoms/text';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className={styles.error}>
                    <Heading level="h2" size="xl">
                        Something went wrong
                    </Heading>
                    <Text size="md" align="center">
                        {this.state.error?.message}
                    </Text>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;