import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';

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

    return (
        <a href={value.url} className={styles.link}>
            {label}
        </a>
    );
};

BreadcrumbItem.propTypes = {
    value: PropTypes.shape({
        label: PropTypes.shape({
            en: PropTypes.string.isRequired,
            fr: PropTypes.string.isRequired,
        }).isRequired,
        url: PropTypes.string.isRequired,
    }),
    p: polyglotPropTypes.isRequired,
};

export default translate(BreadcrumbItem);
