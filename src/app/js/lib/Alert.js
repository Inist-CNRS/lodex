import React, { PropTypes } from 'react';
import { red400 } from 'material-ui/styles/colors';
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
    style: PropTypes.object, // eslint-disable-line
};

Alert.defaultProps = {
    style: null,
};

export default Alert;
