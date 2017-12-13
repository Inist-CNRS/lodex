import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia } from 'material-ui/Card';
import { ListItem } from 'material-ui/List';
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
        width: '100%',
    },
    title: {
        backgroundColor: grey200,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        float: 'right',
    },
};

const GraphLink = ({ link, children }) => (
    <Link to={link}>
        <Card>
            <ListItem rightIcon={<Forward style={styles.icon} />}>
                <CardMedia style={styles.media}>{children}</CardMedia>
            </ListItem>
        </Card>
    </Link>
);

GraphLink.propTypes = {
    link: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default GraphLink;
