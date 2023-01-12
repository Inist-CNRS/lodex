import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import stylesToClassname from '../../lib/stylesToClassName';
import colorsTheme from '../../../custom/colorsTheme';

const styles = stylesToClassname(
    {
        link: {
            padding: '5px',
            color: colorsTheme.green.primary,
            textDecoration: 'none',
            ':hover': {
                color: colorsTheme.orange.primary,
                textDecoration: 'none',
            },
            ':focus': {
                textDecoration: 'none',
                color: colorsTheme.orange.primary,
            },
            ':visited': {
                textDecoration: 'none',
            },
            ':active': {
                color: colorsTheme.orange.primary,
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
