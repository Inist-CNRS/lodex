import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../../propTypes';
import { isLongText, getShortText } from '../../lib/longTexts';
import { isURL, isLocalURL, canonicalURL } from '../../../../common/uris.js';
import {
    REJECTED,
    PROPOSED,
    VALIDATED,
} from '../../../../common/propositionStatus';
import Link from '../../lib/components/Link';

const styles = {
    [REJECTED]: {
        fontSize: '1.5rem',
        textDecoration: 'line-through',
    },
    [PROPOSED]: {
        fontSize: '1.5rem',
        textDecoration: 'none',
    },
    [VALIDATED]: {
        fontSize: '1.5rem',
        textDecoration: 'none',
    },
};

const DefaultView = ({
    className,
    resource,
    field,
    fieldStatus,
    shrink,
    p: polyglot,
}) => {
    let value = resource[field.name];
    if (Array.isArray(value)) {
        return <p>{polyglot.t('bad_format', { label: field.label })}</p>;
    } else if (isURL(value)) {
        return (
            <Link style={styles[fieldStatus]} href={`${value}`}>
                {value}
            </Link>
        );
    } else if (isLocalURL(value)) {
        return (
            <Link style={styles[fieldStatus]} href={`${canonicalURL(value)}`}>
                {value}
            </Link>
        );
    } else {
        return (
            <span style={styles[fieldStatus]}>
                {shrink && isLongText(value) ? (
                    <span className={className}>{getShortText(value)}</span>
                ) : (
                    <span className={className}>{value}</span>
                )}
            </span>
        );
    }
};

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    resource: PropTypes.any.isRequired,
    shrink: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

DefaultView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

export default translate(DefaultView);
