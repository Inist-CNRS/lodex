import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

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

const Loading = ({ children }) => (
    <div className="loading" style={styles.container}>
        <div style={styles.textContainer}>
            <CircularProgress style={styles.progress} size={20} />
            {children}
        </div>
    </div>
);

Loading.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Loading;
