import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import Forward from 'material-ui/svg-icons/content/forward';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    media: {
        minHeight: 200,
        margin: '10px 0px',
        position: 'static', // CardMedia come with position relative per default that break tooltip absolute positioning
    },
    actions: {
        padding: 0,
    },
    detailsButton: {
        height: '36px',
        lineHeight: 'unset',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        right: '0px',
    },
};

const GraphLink = ({ link, children, p: polyglot }) => (
    <Card>
        <CardMedia style={styles.media}>{children}</CardMedia>
        <CardActions style={styles.actions}>
            <FlatButton
                fullWidth
                style={styles.detailsButton}
                containerElement={<Link to={link} />}
                to={link}
                label={polyglot.t('view_details')}
                labelPosition="before"
                icon={<Forward style={styles.icon} />}
            />
        </CardActions>
    </Card>
);

GraphLink.propTypes = {
    link: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element.isRequired,
        PropTypes.arrayOf(PropTypes.element.isRequired),
    ]),
    p: polyglotPropTypes,
};

export default translate(GraphLink);
