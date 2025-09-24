import PropTypes from 'prop-types';
import React from 'react';

import { Typography } from '@mui/material';
import {
    PROPOSED,
    REJECTED,
    VALIDATED,
} from '../../../../../../common/propositionStatus';
import {
    canonicalURL,
    isLocalURL,
    isURL,
} from '../../../../../../common/uris';
import Link from '../../../../lib/components/Link';
import { getShortText, isLongText } from '../../../../lib/longTexts';
import { field as fieldPropTypes } from '../../../../propTypes';

const styles = {
    [REJECTED]: {
        fontSize: '1rem',
        textDecoration: 'line-through',
    },
    [PROPOSED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
    [VALIDATED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
};

const DefaultView = ({ className, resource, field, fieldStatus, shrink }) => {
    let value = resource[field.name];

    if (isURL(value)) {
        return (
            <Link style={styles[fieldStatus]} href={`${value}`}>
                {value}
            </Link>
        );
    }
    if (isLocalURL(value)) {
        return (
            <Link style={styles[fieldStatus]} href={`${canonicalURL(value)}`}>
                {value}
            </Link>
        );
    }

    const text = shrink && isLongText(value) ? getShortText(value) : value;
    return (
        <Typography
            component="span"
            className="property_value_item"
            sx={styles[fieldStatus]}
        >
            <span className={className}>{text}</span>
        </Typography>
    );
};

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    resource: PropTypes.any.isRequired,
    shrink: PropTypes.bool,
};

DefaultView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

export default DefaultView;

export const getReadableValue = ({ resource, field }) => {
    return resource[field.name];
};
