import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import translate from 'redux-polyglot/translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import Link from '../../lib/components/Link';

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
            <Button
                primary
                fullWidth
                style={styles.detailsButton}
                containerElement={<Link to={link} />}
                to={link}
            >
                <FontAwesomeIcon icon={faArrowRight} style={styles.icon} />
                {polyglot.t('view_details')}
            </Button>
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
