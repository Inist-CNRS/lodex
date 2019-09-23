import React from 'react';
import PropTypes from 'prop-types';

const styles = {
    body: {
        paddingBottom: 80,
    },
};

export const AppComponent = ({ children }) => (
    <div style={styles.body}>
        <div className="body">{children}</div>
    </div>
);

AppComponent.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppComponent;
