import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, CardActions, Button } from '@mui/material';
import Forward from '@mui/icons-material/Forward';
import translate from 'redux-polyglot/translate';

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
        <CardMedia sx={styles.media}>{children}</CardMedia>
        <CardActions sx={styles.actions}>
            <Button
                variant="text"
                color="primary"
                fullWidth
                sx={styles.detailsButton}
                component={(props) => <Link to={link} {...props} />}
                to={link}
                endIcon={<Forward sx={styles.icon} />}
            >
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
