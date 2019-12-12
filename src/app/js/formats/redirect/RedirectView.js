import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import stylesToClassname from '../../lib/stylesToClassName';
import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import theme from '../../theme';

const typing = {
    '0%': {
        width: '0%',
    },
    '100%': {
        width: '100%',
    },
};

const blinkCaret = {
    '0%': {
        borderColor: theme.green.primary,
    },
    '100%': {
        borderColor: 'transparent',
    },
};

const styles = stylesToClassname(
    {
        loading: {
            position: 'fixed',
            backgroundColor: '#fff',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            zIndex: 100000,
        },
        typewriter: {
            color: theme.green.primary,
            overflow: 'hidden',
            fontSize: '2rem',
            borderRight: '0.25rem solid',
            whiteSpace: 'nowrap',
            margin: '0 auto',
            animationName: [typing, blinkCaret],
            animationDuration: '1.5s, 1s',
            animationIterationCount: '1, infinite',
            zIndex: 100001,
        },
        link: {
            margin: '10px',
        },
    },
    'redirect-view',
);

export const RedirectViewLoader = ({ classes, title, url }) => (
    <div className={classes.loading}>
        <div>
            <h1 className={classes.typewriter}>{title}</h1>
        </div>
        <div className={classes.link}>
            <a href={url}>{url}</a>
        </div>
    </div>
);

RedirectViewLoader.propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
};

export const RedirectView = ({
    className,
    classes,
    p: polyglot,
    field,
    resource,
}) => {
    const url = resource[field.name];

    if (url == null || url === '') {
        return null;
    }

    useEffect(() => {
        window.location.href = url;
    });

    return (
        <div className={className}>
            <Helmet>
                <link rel="canonical" href={url} />
            </Helmet>
            <RedirectViewLoader
                classes={classes}
                title={polyglot.t('loading_redirecting')}
                url={url}
            />
        </div>
    );
};

RedirectView.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

RedirectView.defaultProps = {
    className: '',
};

const mapStateToProps = () => ({
    classes: styles,
});

export default compose(connect(mapStateToProps), translate)(RedirectView);
