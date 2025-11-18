import React from 'react';
import { CircularProgress } from '@mui/material';

const styles = {
    container: {
        margin: '2rem',
        padding: '2rem',
    },
    textContainer: {
        display: 'flex',
    },
    progress: {
        marginRight: '1rem',
        marginTop: '-0.2rem',
    },
};

interface LoadingProps {
    children: React.ReactNode;
    className?: string;
}

const Loading = ({ children, className = 'loading' }: LoadingProps) => (
    <div className={className} style={styles.container}>
        <div style={styles.textContainer}>
            <CircularProgress
                variant="indeterminate"
                sx={styles.progress}
                size={20}
            />
            {children}
        </div>
    </div>
);

export default Loading;
