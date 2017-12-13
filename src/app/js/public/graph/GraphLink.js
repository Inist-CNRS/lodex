import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardMedia } from 'material-ui/Card';
import { Link } from 'react-router';
import { grey200 } from 'material-ui/styles/colors';
import Forward from 'material-ui/svg-icons/content/forward';

const styles = {
    media: { minHeight: 200, margin: '10px 0px' },
    label: {
        flexGrow: 2,
        fontWeight: 'bold',
        textDecoration: 'none',
        fontSize: '2rem',
    },
    title: {
        backgroundColor: grey200,
        textDecoration: 'none',
    },
    icon: {
        float: 'right',
    },
    container: {
        width: '100%',
    },
};

const GraphLink = ({ link, label, children }) => (
    <Link to={link} style={styles.container}>
        <Card>
            <CardTitle
                style={styles.title}
                title={
                    <span style={styles.label}>
                        {label}
                        <Forward style={styles.icon} />
                    </span>
                }
            />
            <CardMedia style={styles.media}>{children}</CardMedia>
        </Card>
    </Link>
);

GraphLink.propTypes = {
    link: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default GraphLink;
