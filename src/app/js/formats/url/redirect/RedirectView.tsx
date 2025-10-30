import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import { type Field } from '../../../propTypes';

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
        borderColor: 'var(--primary-main)',
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
            color: 'var(--primary-main)',
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

interface RedirectViewLoaderProps {
    classes: object;
    title: string;
    url: string;
}

export const RedirectViewLoader = ({
    classes,
    title,
    url,
}: RedirectViewLoaderProps) => (
    // @ts-expect-error TS2339
    <div className={classes.loading}>
        <div>
            {/*
             // @ts-expect-error TS2339 */}
            <h1 className={classes.typewriter}>{title}</h1>
        </div>
        {/*
         // @ts-expect-error TS2339 */}
        <div className={classes.link}>
            <a href={url}>{url}</a>
        </div>
    </div>
);

interface RedirectViewProps {
    className?: string;
    classes: object;
    p: unknown;
    field: Field;
    resource: object;
}

export const RedirectView = ({
    className,

    classes,

    p: polyglot,

    field,

    resource,
}: RedirectViewProps) => {
    // @ts-expect-error TS7053
    const url = resource[field.name];

    useEffect(() => {
        if (!url) return;
        window.location.href = url;
    }, [url]);

    if (url == null || url === '') {
        return null;
    }

    return (
        <div className={className}>
            <Helmet>
                <link rel="canonical" href={url} />
            </Helmet>
            <RedirectViewLoader
                classes={classes}
                // @ts-expect-error TS18046
                title={polyglot.t('loading_redirecting')}
                url={url}
            />
        </div>
    );
};

const mapStateToProps = () => ({
    classes: styles,
});

// @ts-expect-error TS2345
export default compose(connect(mapStateToProps), translate)(RedirectView);
