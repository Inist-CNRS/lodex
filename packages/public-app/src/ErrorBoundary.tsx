import { Component, type ErrorInfo } from 'react';
import { reportClientError } from '@lodex/frontend-common/utils/reportClientError';

type ErrorBoundaryProps = {
    children: React.ReactNode;
    fallback: React.ReactNode;
};

export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    { hasError: boolean }
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
        reportClientError('react.ErrorBoundary', error);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}
