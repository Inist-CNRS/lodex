import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import customTheme from '../../../custom/customTheme';
import Link from '../../lib/components/Link';

const styles = stylesToClassname(
    {
        link: {
            padding: '5px',
            color: customTheme.palette.primary.main,
            textDecoration: 'none',
            ':hover': {
                color: customTheme.palette.secondary.main,
                textDecoration: 'none',
            },
            ':focus': {
                textDecoration: 'none',
                color: customTheme.palette.secondary.main,
            },
            ':visited': {
                textDecoration: 'none',
            },
            ':active': {
                color: customTheme.palette.secondary.main,
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
