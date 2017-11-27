import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardMedia } from 'material-ui/Card';
import { Link } from 'react-router';

const styles = {
    media: { minHeight: 200, margin: '10px 0px' },
};

const Graph = ({ link, label, children }) => (
    <Link to={link}>
        <Card>
            <CardMedia
                style={styles.media}
                overlay={<CardHeader title={label} />}
            >
                {children}
            </CardMedia>
        </Card>
    </Link>
);

Graph.propTypes = {
    link: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default Graph;
