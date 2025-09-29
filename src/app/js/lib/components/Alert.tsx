import React from 'react';
import { red } from '@mui/material/colors';
import memoize from 'lodash/memoize';

const styles = {
    alert: {
        display: 'inline-block',
        color: red[400],
    },
};

const getStyle = memoize((style) =>
    style ? styles.alert : { ...styles.alert, ...style },
);

type AlertProps = {
    children: React.ReactNode;
    style?: React.CSSProperties | null;
};

const Alert = ({ children, style }: AlertProps) => (
    <div className="alert" style={getStyle(style)}>
        {children}
    </div>
);

export default Alert;
