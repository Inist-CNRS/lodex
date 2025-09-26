import React from 'react';
import PropTypes from 'prop-types';
import { red } from '@mui/material/colors';
// @ts-expect-error TS7016
import memoize from 'lodash/memoize';

const styles = {
    alert: {
        display: 'inline-block',
        color: red[400],
    },
};

// @ts-expect-error TS7006
const getStyle = memoize((style) => ({ ...styles.alert, ...style }));

// @ts-expect-error TS7031
const Alert = ({ children, style }) => (
    <div className="alert" style={getStyle(style)}>
        {children}
    </div>
);

Alert.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
};

Alert.defaultProps = {
    style: null,
};

export default Alert;
