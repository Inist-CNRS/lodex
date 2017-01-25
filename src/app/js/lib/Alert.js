import React, { PropTypes } from 'react';
import { red400 } from 'material-ui/styles/colors';

const styles = {
    alert: {
        display: 'inline-block',
        color: red400,
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
