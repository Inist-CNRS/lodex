import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
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

const RedirectView = ({ className, p: polyglot, field, resource }) => {
    const url = resource[field.name];

    useEffect(() => {
        window.location.href = url;
    });

    return (
        <div className={className}>
            <Helmet>
                <link rel="canonical" href={url} />
            </Helmet>
            <div className={styles.loading}>
                <div>
                    <h1 className={styles.typewriter}>
                        {polyglot.t('loading_redirecting')}
                    </h1>
                </div>
                <div className={styles.link}>
                    <a href={url}>{url}</a>
                </div>
            </div>
        </div>
    );
};

RedirectView.propTypes = {
    className: PropTypes.string,
    p: polyglotPropTypes.isRequired,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

RedirectView.defaultProps = {
    className: '',
};

export default compose(translate)(RedirectView);
