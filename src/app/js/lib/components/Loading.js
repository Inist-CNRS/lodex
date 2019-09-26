import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, CardContent } from '@material-ui/core';
import Card from './Card';

const styles = {
    container: {
        paddingTop: '0.5rem',
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
    <Card className="loading" style={styles.container}>
        <CardContent style={styles.textContainer}>
            <CircularProgress style={styles.progress} size={20} />
            {children}
        </CardContent>
    </Card>
);

Loading.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Loading;
