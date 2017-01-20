import React, { PropTypes } from 'react';
import { red400 } from 'material-ui/styles/colors';

const styles = {
    alert: {
        color: red400,
        margin: '0.5rem',
    },
};

const Alert = ({ children }) => (
    <div className="alert" style={styles.alert}>
        {children}
    </div>
);

Alert.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Alert;
