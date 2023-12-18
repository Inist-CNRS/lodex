import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import Link from '../../lib/components/Link';

const styles = stylesToClassname(
    {
        link: {
            padding: '5px',
            color: 'var(--primary-main)',
            textDecoration: 'none',
            ':hover': {
                color: 'var(--secondary-main)',
                textDecoration: 'none',
            },
            ':focus': {
                textDecoration: 'none',
                color: 'var(--secondary-main)',
            },
            ':visited': {
                textDecoration: 'none',
            },
            ':active': {
                color: 'var(--secondary-main)',
            },
        },
    },
    'breadcrumb-item',
);

const BreadcrumbItem = ({ value, p: polyglot }) => {
    const label = value.label[polyglot.currentLocale];
    let props = {
        to: value.url,
    };

    if (value.isExternal === true) {
        props = {
            href: value.url,
            target: '_blank',
            rel: 'noopener noreferrer',
        };
    }
    // if value.url contain .html, it's a static page. Use href instead of to with react-router default route
    else if (
        value.url.indexOf('.html') !== -1 &&
        typeof sessionStorage !== 'undefined'
    ) {
        const tenant = sessionStorage?.getItem('lodex-tenant');
        props = {
            href: `/instance/${tenant}/${value.url}`,
            rel: 'noopener noreferrer',
        };
    }

    return (
        <Link className={styles.link} {...props}>
            {label}
        </Link>
    );
};

BreadcrumbItem.propTypes = {
    value: PropTypes.shape({
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        url: PropTypes.string.isRequired,
        isExternal: PropTypes.bool,
    }),
    p: polyglotPropTypes.isRequired,
};

export default translate(BreadcrumbItem);
