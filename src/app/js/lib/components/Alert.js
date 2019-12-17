import React from 'react';
import PropTypes from 'prop-types';
import { red400 } from '@material-ui/core/styles/colors';
import memoize from 'lodash.memoize';

const styles = {
    alert: {
        display: 'inline-block',
        color: red400,
    },
};

const getStyle = memoize(style => Object.assign({}, styles.alert, style));

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
